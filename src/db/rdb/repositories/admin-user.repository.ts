// import { Op } from 'sequelize';
// import { UserStatus } from '../../../constants/enums';
import { AdminUser } from '../../../types/admin.user.type';
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

  // async findUserByToken(token: string): Promise<AdminUser> {
  //   return (await AdminUserModel.findOne({
  //     where: {
  //       verified_token: token,
  //       status: UserStatus.UNVERIFIED,
  //     },
  //   })) as unknown as AdminUser;
  // }

  async findUserById(id: string): Promise<AdminUser> {
    return (await AdminUserModel.findOne({
      where: {
        id: id,
      },
    })) as unknown as AdminUser;
  }

  // async findUserByIds(ids: string[]): Promise<AdminUser[]> {
  //   return (await AdminUserModel.findAll({
  //     where: {
  //       id: {
  //         [Op.in]: ids,
  //       },
  //     },
  //   })) as unknown as AdminUser[];
  // }

  // async getAdminUsers(user_type: string): Promise<AdminUser[]> {
  //   const queryOptions: any = {
  //     attributes: {
  //       exclude: ['password'],
  //     },
  //     // include: [
  //     //   {
  //     //     as: "professional",
  //     //     model: ProfessionalModel,
  //     //     include: [
  //     //       {
  //     //         as: "experiences",
  //     //         model: ProfessionalExperienceModel
  //     //       }
  //     //     ],
  //     //   }
  //     // ]
  //     order: [['createdAt', 'DESC']],
  //   };

  //   if (user_type !== 'ALL') {
  //     queryOptions.where = { user_type: user_type };
  //   }

  //   return (await AdminUserModel.findAll(
  //     queryOptions,
  //   )) as unknown as AdminUser[];
  // }

  // async storeAdminUser(adminUser: AdminUser): Promise<AdminUser> {
  //   return (await AdminUserModel.create(adminUser)) as unknown as AdminUser;
  // }

  // async updateAdminuser(adminUser: AdminUser): Promise<AdminUser> {
  //   return (await AdminUserModel.update(adminUser, {
  //     where: {
  //       id: adminUser.id,
  //     },
  //   })) as unknown as AdminUser;
  // }

  // async updateUserProfile(userData: AdminUser, id: string): Promise<AdminUser> {
  //   return (await AdminUserModel.update(userData, {
  //     where: {
  //       id: id,
  //     },
  //   })) as unknown as AdminUser;
  // }

  // async updateAdminUserStatus(status: string, id: string): Promise<AdminUser> {
  //   return (await AdminUserModel.update(
  //     { status: status },
  //     {
  //       where: {
  //         id: id,
  //       },
  //     },
  //   )) as unknown as AdminUser;
  // }

  // async fetchSuperAdmin(): Promise<AdminUser> {
  //   return (await AdminUserModel.findOne({
  //     where: {
  //       user_type: 'SUPERADMIN',
  //     },
  //   })) as unknown as AdminUser;
  // }
}
