import { DiscountStatus, UserTypes } from '../../constants/enums';
import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { DiscountRepository } from '../../db/rdb/repositories/discount.repository';
import { TiersRepository } from '../../db/rdb/repositories/tiers.repository';
import { CustomException } from '../../errors/CustomException.error';
import {
  deleteMultipleFilesS3,
  extractS3Fullpaths,
} from '../../middleware/fileUploadS3.middleware';
import { UserPayload } from '../../schema/token-payload.schema';
import { DiscountTypes } from '../../types/discounts.type';
import { NotificationDataType } from '../../types/notification.type';
import { generateDiscountId } from '../../utils/id.utils';
import { NotificationService } from '../notification.service';

export class DiscountService {
  private tierRepo: TiersRepository;
  private discountRepo: DiscountRepository;
  private adminUserRepo: AdminUserRepository;
  private notificationService: NotificationService;

  constructor() {
    this.tierRepo = new TiersRepository();
    this.discountRepo = new DiscountRepository();
    this.adminUserRepo = new AdminUserRepository();
    this.notificationService = new NotificationService();
  }

  async getDiscounts(user: UserPayload) {
    try {
      let query;

      if (user.userType === UserTypes.INFLUENCER) {
        query = {
          where: {
            admin_user_id: user.id,
          },
        };
      }

      const discounts = await this.discountRepo.findAllDiscounts(query);

      return discounts;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong', 500);
    }
  }

  async getDiscountsDetails(id: string, user: UserPayload) {
    try {
      let query = {};

      if (user.userType === UserTypes.INFLUENCER) {
        query = {
          where: {
            admin_user_id: user.id,
          },
        };
      }

      const discounts = await this.discountRepo.findDiscountById(id, query);

      return discounts;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong', 500);
    }
  }

  async createDiscount(request: DiscountTypes, user: UserPayload) {
    try {
      const checkTier = await this.tierRepo.getTiersById(request.tier_id);

      if (!checkTier) throw new CustomException('Tier not found', 404);

      const data = {
        ...request,
        id: generateDiscountId() as string,
        admin_user_id: user.id,
      };

      const discount = await this.discountRepo.storeNewDiscount(data);

      if (discount.status === DiscountStatus.PENDING) {
        const adminUser = await this.adminUserRepo.fetchSuperAdmin();

        const notificationData = {
          user_id: adminUser.id,
          title: 'Discount Request Approval',
          url_path: `/discounts`,
          body: `New discount offer is submitted. Offer Title: ${discount.name}`,
        };

        await this.notificationService.storeNotification(
          notificationData as unknown as NotificationDataType,
        );
      }

      return {
        status: 201,
        message: 'Discount created successfully',
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
        status: 500,
      };
    }
  }

  async updateDiscount(
    request: DiscountTypes,
    user: UserPayload,
    discountId: string,
  ) {
    try {
      const checkTier = await this.tierRepo.getTiersById(request.tier_id);
      const where =
        user.userType === UserTypes.INFLUENCER
          ? { admin_user_id: user.id }
          : {};
      const checkDiscount = await this.discountRepo.findDiscountById(
        discountId,
        where,
      );

      if (!checkTier) throw new CustomException('Tier not found', 404);

      if (!checkDiscount) throw new CustomException('Discount not found', 404);

      if (request.thumbnail_image) {
        await deleteMultipleFilesS3(
          extractS3Fullpaths([checkDiscount?.thumbnail_image]),
        );
      }

      await this.discountRepo.updateDiscount(request, discountId);

      return {
        status: 200,
        message: 'Discount updated successfully',
      };
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }

      return {
        message: 'Something went wrong',
        status: 500,
      };
    }
  }

  async deleteDiscount(user: UserPayload, discountId: string) {
    try {
      const where =
        user.userType === UserTypes.INFLUENCER
          ? { admin_user_id: user.id }
          : {};
      const checkDiscount = await this.discountRepo.findDiscountById(
        discountId,
        where,
      );

      if (!checkDiscount) throw new CustomException('Discount not found', 404);

      if (checkDiscount.thumbnail_image) {
        await deleteMultipleFilesS3(
          extractS3Fullpaths([checkDiscount.thumbnail_image]),
        );
      }

      await this.discountRepo.deleteDiscount(discountId);

      return {
        status: 200,
        message: 'Discount deleted successfully',
      };
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }

      return {
        message: 'Something went wrong',
        status: 500,
      };
    }
  }

  async updateDiscountStatus(
    request: DiscountTypes,
    user: UserPayload,
    discountId: string,
  ) {
    try {
      const checkDiscount = await this.discountRepo.findDiscountById(
        discountId,
        {},
      );

      if (!checkDiscount) throw new CustomException('Discount not found', 404);

      await this.discountRepo.updateDiscount(request, discountId);

      const notificationData = {
        user_id: checkDiscount.admin_user_id,
        title: 'Discount Offer Approved',
        url_path: `/discounts`,
        body: `Your discount offer is approved. Offer Title: ${checkDiscount.name}`,
      };

      await this.notificationService.storeNotification(
        notificationData as unknown as NotificationDataType,
      );

      return {
        status: 200,
        message: 'Discount status updated successfully',
      };
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }

      return {
        message: 'Something went wrong',
        status: 500,
      };
    }
  }
}
