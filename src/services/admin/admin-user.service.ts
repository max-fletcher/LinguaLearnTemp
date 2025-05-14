import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { CustomException } from '../../errors/CustomException.error';
import { UserPayload } from '../../schema/token-payload.schema';
import {
  CreateAdminUserSchema,
  UpdateAdminUserSchema,
} from '../../schema/user.schema';
import { AdminUser, UserBalanceType } from '../../types/common.type';
import {
  createAdminUserId,
  createUserBalanceId,
  generateVerificationCodeId,
} from '../../utils/id.utils';
import { hashPassword } from '../../utils/password.utils';
import { formatUserResponse } from '../../utils/response.utils';
import { EmailService } from '../email.service';

export class AdminUserService {
  private adminUserRepo: AdminUserRepository;
  private userBalanceRepo: UserBalanceRepository;
  private emailService: EmailService;

  constructor() {
    this.adminUserRepo = new AdminUserRepository();
    this.userBalanceRepo = new UserBalanceRepository();
    this.emailService = new EmailService();
  }

  async getAllAdminUsers(userType: string) {
    const users = await this.adminUserRepo.getAdminUsers(userType);

    return users;
  }

  async userDetails(id: string) {
    const user = await this.adminUserRepo.findUserById(id);
    return user;
  }

  async createAdminUser(request: CreateAdminUserSchema) {
    try {
      const id = createAdminUserId();
      const password = await hashPassword(request.password);

      const user = await this.adminUserRepo.storeAdminUser({
        ...request,
        id: id,
        password: password,
        verified_token: generateVerificationCodeId(),
      } as AdminUserModel);

      if (user) {
        const balanceData = {
          id: createUserBalanceId(),
          admin_user_id: user.id,
          cash_balance: 0,
          coin_balance: 0,
        };

        // Create Usre Balance Record
        await this.userBalanceRepo.createUserBalance(
          balanceData as UserBalanceType,
        );

        // Send Email Invitation
        await this.emailService.sendEmailInvitation(
          user.name,
          user.email as string,
          user.user_type as string,
          `${process.env.HOMERUN_ADMIN_URL}/verify/${user.verified_token}`,
        );

        return {
          user: user,
          message: 'User created successfully',
          status: 201,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        user: null,
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  async updateAdminUser(request: UpdateAdminUserSchema) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(request.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      if (request.password && request.password.length > 0) {
        const password = await hashPassword(request.password);
        request.password = password;
      } else {
        request.password = checkUser.password;
      }

      const user = await this.adminUserRepo.updateAdminuser(
        request as unknown as AdminUserModel,
      );

      if (user) {
        return {
          message: 'User updated successfully',
          status: 200,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      // console.log(error);
      return {
        user: null,
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  async updateProfile(request: AdminUser, files: any, user: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      if (request.password && request.password.length > 0) {
        const password = await hashPassword(request.password);
        request.password = password;
      } else {
        request.password = checkUser.password;
      }

      if (files?.avatar && files.avatar.length) {
        request.avatar = files.avatar[0].location;
        deleteMultipleFilesS3(
          extractS3Fullpaths([checkUser.avatar] as string[]),
        );
      } else {
        request.avatar = checkUser.avatar;
      }

      // if (files && files.avatar !== undefined) {
      //   const avatar = files.avatar[0];
      //   request.avatar = resolveFilePath(avatar);
      //   deleteLocalFile(checkUser?.avatar);
      // }

      const profile = await this.adminUserRepo.updateUserProfile(
        request as unknown as AdminUserModel,
        checkUser.id,
      );

      const getUser = await this.adminUserRepo.findUserById(user.id);
      const data = formatUserResponse(getUser);

      if (profile) {
        return {
          user: data,
          message: 'Profile updated successfully',
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      return {
        user: null,
        message: 'Something went wrong',
        status: 400,
      };
    }
  }
}
