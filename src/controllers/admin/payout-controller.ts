import { Response } from 'express';
import { UserPayload } from 'schema/token-payload.schema';
import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { PayoutService } from '../../services/admin/payout.service';
import { NotificationService } from '../../services/notification.service';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { NotificationDataType } from '../../types/notification.type';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { CustomException } from '../../errors/CustomException.error';

const payoutService = new PayoutService();
const adminUserRepo = new AdminUserRepository();
const notificationService = new NotificationService();

export async function getPayouts(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await payoutService.getAllPayouts(req);

    return res.send({
      payouts: response.payouts,
      payout_statics: response.payout_statics,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export async function getSinglePayout(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const payoutReqId = req.params.id;
    const payout = await payoutService.getSinglePayout(payoutReqId) as unknown as any;

    if(!payout)
      throw new NotFoundException('Payout with this id not found.');

    return res.send({
      payout: {
        id: payout.id,
        user_id: payout.user_id,
        admin_user_id: payout.admin_user_id,
        currency_id: payout.currency_id,
        currency: !payout.currency_id ? null : {
          id: payout.currency.id,
          name: payout.currency.name,
          short_code: payout.currency.short_code,
        },
        amount: payout.amount,
        name: payout.name,
        address: payout.address,
        bank_name: payout.bank_name,
        bank_account_no: payout.bank_account_no,
        zip_code: payout.zip_code,
        phoneNumber: payout.phoneNumber,
        status: payout.status,
        createdAt: payout.createdAt,
        updatedAt: payout.updatedAt,
        user_type: payout.user_id ? 'APP_USER' : payout.admin_user?.user_type,
        app_user: !payout.user_id ? null : {
          id: payout.app_user.id,
          name: payout.app_user.name,
          username: payout.app_user.username,
          email: payout.app_user.email,
          phone: payout.app_user.phone,
          avatar_url: payout.app_user.avatar_url,
          country: payout.app_user.country,
        },
        admin_user: !payout.admin_user_id ? null : {
          id: payout.admin_user.id,
          name: payout.admin_user.name,
          username: payout.admin_user.username,
          email: payout.admin_user.email,
          phone: payout.admin_user.phone,
          avatar: payout.admin_user.avatar,
        }
      }
    });
  } catch (error) {
    // console.log('getSinglePayout', error);
    if(error instanceof CustomException){
      return res.status(error.statusCode).send({
        error: error.message,
      });
    }
    return res.status(500).send({
      error: error,
    });
  }
}

export async function requestPayout(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await payoutService.storePayoutRequest(
      req.body,
      req.user as UserPayload,
    );

    if (response.status === 201) {
      const adminUser = await adminUserRepo.fetchSuperAdmin();

      const notificationData = {
        user_id: adminUser.id,
        title: 'Request for Payout',
        url_path: '/payout',
        body: `New Payout Request is submitted. Payout ID: ${response?.payoutRequest?.id}`,
      };

      await notificationService.storeNotification(
        notificationData as NotificationDataType,
      );
    }

    return res.status(response.status).send({
      message: response.message,
      payoutRequest: response.payoutRequest,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export async function approvePayoutRequest(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await payoutService.approvePayoutRequest(
      req.params.id,
      req.body,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}
