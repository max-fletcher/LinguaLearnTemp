// import { Op } from 'sequelize';
// import { UserStatus } from '../../../constants/enums';
import { AdminUser } from '../../../types/admin-user.type';
import { AdminUserModel } from '../models';

export class AdminUserRepository {
  async findUserByEmail(email: string): Promise<AdminUser> {
    const options: any = {
      where: {
        email: email,
      },
    };

    return (await AdminUserModel.findOne(options,)) as unknown as AdminUser;
  }

  async findUserById(id: string): Promise<AdminUser> {
    return (await AdminUserModel.findOne({
      where: {
        id: id,
      },
    })) as unknown as AdminUser;
  }
}
