import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { UnauthorizedException } from '../../errors/UnauthorizedException.error';
import { LoginRequestSchema } from '../../schema/login.schema';
import { 
  comparePassword, 
  // hashPassword 
} from '../../utils/password.utils';

export class AdminAuthService {
  private adminUserRepo: AdminUserRepository;

  constructor() {
    this.adminUserRepo = new AdminUserRepository();
  }

  async adminLogin(request: LoginRequestSchema) {
    const user = await this.adminUserRepo.findUserByEmail(request.email);

    if (user) {
      const isMatch = await comparePassword(
        request.password,
        user.password || '',
      );

      if (isMatch) {
        return {
          user: user,
          authenticated: true,
          message: 'Login Successful',
          status: 201,
        };
      } else {
        throw new UnauthorizedException('Incorrect Password')
      }
    }
    throw new BadRequestException('You are not registered!')
  }

  // async resetPassword(data: PasswordResetSchema, user: UserPayload) {
  //   try {
  //     const checkUser = await this.adminUserRepo.findUserById(
  //       user.id as string,
  //     );

  //     if (!checkUser) {
  //       throw new CustomException('User not found', 404);
  //     }

  //     const password = await hashPassword(data.password);

  //     await this.adminUserRepo.updateUserProfile(
  //       {
  //         password: password,
  //       } as unknown as AdminUserModel,
  //       checkUser.id as string,
  //     );
  //   } catch (error) {
  //     if (error instanceof CustomException) {
  //       throw new CustomException(error.message, error.statusCode);
  //     }

  //     throw new CustomException('Bad Request', 400);
  //   }
  // }
}
