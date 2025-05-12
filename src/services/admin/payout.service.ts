import {
  NotificationIcons,
  NotificationUserType,
  PayoutStatus,
  TransactionStatus,
  TransactionTypes,
  UserTypes,
} from '../../constants/enums';
import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { PayoutRepository } from '../../db/rdb/repositories/payout.repository';
import { TransactionRepository } from '../../db/rdb/repositories/transaction.repository';
import { UserBalanceRepository } from '../../db/rdb/repositories/user-balance.repository';
import { CustomException } from '../../errors/CustomException.error';
import { PayoutRequestSchema } from '../../schema/payout.schema';
import { UserPayload } from '../../schema/token-payload.schema';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { PayoutRequest, TransactionType } from '../../types/common-models.type';
import { NotificationDataType } from '../../types/notification.type';
import { generateTransactionId } from '../../utils/id.utils';
import { NotificationService } from '../notification.service';

export class PayoutService {
  private adminUserRepo: AdminUserRepository;
  private userBalanceRepo: UserBalanceRepository;
  private payoutRepo: PayoutRepository;
  private transactionRepo: TransactionRepository;
  private notificationService: NotificationService;

  constructor() {
    this.adminUserRepo = new AdminUserRepository();
    this.userBalanceRepo = new UserBalanceRepository();
    this.payoutRepo = new PayoutRepository();
    this.transactionRepo = new TransactionRepository();
    this.notificationService = new NotificationService();
  }

  async getAllPayouts(request: AdminAuthenticatedRequest) {
    try {
      const user = request.user as UserPayload;

      const payouts = await this.payoutRepo.getAllPayouts(request.query, user);

      const payout_statics: any = {
        approved_payouts: await this.payoutRepo.getTotalPayoutsCount(user, {
          where: { status: PayoutStatus.APPROVED },
        }),

        rejected_payouts: await this.payoutRepo.getTotalPayoutsCount(user, {
          where: { status: PayoutStatus.REJECTED },
        }),

        total_payouts: await this.payoutRepo.getTotalPayoutsBalance(user, {
          where: { status: PayoutStatus.APPROVED },
        }),
      };

      if (
        user.userType !== UserTypes.SUPERADMIN &&
        user.userType !== UserTypes.ADMIN
      ) {
        payout_statics.available_balance =
          await this.userBalanceRepo.getUserBalance(user);
      } else {
        payout_statics.pending_payouts =
          await this.payoutRepo.getTotalPayoutsCount(user, {
            where: { status: PayoutStatus.PENDING },
          });
      }

      return {
        payouts,
        payout_statics,
      };
    } catch (error) {
      // console.log(error);
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  async getSinglePayout(id: string) {
    return await this.payoutRepo.getSinglePayout(id);
  }

  /**
   * Store User Payout Requests
   *
   * @param request - The payout request form data
   * @param user - The user who is requesting for payout
   * @returns A response object with message and status
   */
  async storePayoutRequest(request: PayoutRequestSchema, user: UserPayload) {
    try {
      // Only regular users can request for payout
      if (
        user.userType === UserTypes.SUPERADMIN ||
        user.userType === UserTypes.ADMIN
      ) {
        throw new CustomException(
          'Super admin and admin can not request for payout',
          400,
        );
      }

      // Check if the user has enough balance
      const checkBalance = await this.userBalanceRepo.findUserBalance(
        user.id as string,
      );

      if (checkBalance && checkBalance.cash_balance >= request.amount) {
        // Store the payout request
        const payoutRequest = await this.payoutRepo.storePayoutRequest(
          request as unknown as PayoutRequest,
          user,
        );

        if (payoutRequest) {
          return {
            payoutRequest: payoutRequest,
            message: 'Payout request created successfully',
            status: 201,
          };
        } else {
          throw new CustomException('Something went wrong', 500);
        }
      } else {
        throw new CustomException('Insufficient balance', 400);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  /**
   * Approve a payout request
   * @param id - The id of the payout request
   * @param request - The updated payout request
   * @param user - The user who is approving the payout request
   * @returns A response object with message and status
   */
  async approvePayoutRequest(
    id: string,
    request: PayoutRequest,
    user: UserPayload,
  ) {
    try {
      let checkBalance = null;

      if (
        user.userType !== UserTypes.SUPERADMIN &&
        user.userType !== UserTypes.ADMIN
      ) {
        // Only superadmin can approve payout requests
        throw new CustomException(
          'Only superadmin and admin can approve payout requests',
          400,
        );
      }

      const payout = await this.payoutRepo.findPayoutRequestById(id);

      if (!payout) {
        throw new CustomException('Payout request not found', 404);
      }

      if (payout.admin_user_id && payout.admin_user_id !== null) {
        checkBalance = await this.userBalanceRepo.findUserBalance(
          payout.admin_user_id as string,
        );
      } else {
        checkBalance = await this.userBalanceRepo.findAppUserBalance(
          payout.user_id as string,
        );
      }

      if (checkBalance && Number(checkBalance.cash_balance) < payout.amount) {
        throw new CustomException('Insufficient balance', 400);
      }

      if (
        payout.status === PayoutStatus.APPROVED ||
        payout.status === PayoutStatus.REJECTED
      ) {
        throw new CustomException(
          'You can not update an approved/rejected payout',
          400,
        );
      }

      // Create a new transaction
      const transaction_request = {
        id: generateTransactionId(),
        admin_user_id: payout.admin_user_id,
        user_id: payout.user_id,
        payout_request_id: payout.id,
        transaction_type: TransactionTypes.PAYOUT,
        amount: payout.amount,
        status: TransactionStatus.COMPLETED,
      };

      // Update the payout request status
      await this.payoutRepo.updatePayoutStatus(
        id,
        request as unknown as PayoutRequest,
      );

      // If the payout request is approved, subtract the amount from the user's balance
      if (checkBalance && request.status === PayoutStatus.APPROVED) {
        await checkBalance.update({
          cash_balance: checkBalance.cash_balance - payout.amount,
        });
      }

      // Store the new transaction
      await this.transactionRepo.storeNewTransaction(
        transaction_request as unknown as TransactionType,
      );

      let notificationData;

      if(payout.admin_user_id){
        // Store Notification
        notificationData = {
          user_id: payout.admin_user_id,
          title: `Payout ${request.status}!`,
          body: `Your Payout ID: ${payout.id} is ${request.status}!`,
        };
      }
      else{
        const url_path = { name: "Payout", params: null }
        if(request.status === PayoutStatus.APPROVED)
          notificationData = {
            user_id: payout.user_id,
            title: `Payout approved`,
            body: `You have successfully withdrawn ${payout.amount} dollars.`,
            icon: NotificationIcons.COIN,
            link_title: `Go to balance`,
            url_path: JSON.stringify(url_path),
            url_path_desktop: `/profile/payout`,
            type: NotificationUserType.APPUSER
          };
        else if(request.status === PayoutStatus.REJECTED)
          notificationData = {
            user_id: payout.user_id,
            title: `Payout rejected`,
            body: `Your payout request for withdrawal of ${payout.amount} dollars has been rejected.`,
            icon: NotificationIcons.COIN,
            link_title: `Go to balance`,
            url_path: JSON.stringify(url_path),
            url_path_desktop: `/profile/payout`,
            type: NotificationUserType.APPUSER
          };
      }

      await this.notificationService.storeNotification(
        notificationData as unknown as NotificationDataType,
      );

      return {
        message: 'Payout request updated successfully',
        status: 200,
      };
    } catch (error) {
      // console.log(error);
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }
}
