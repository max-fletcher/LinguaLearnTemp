import { Op, Transaction } from 'sequelize';
import { AppUserModel } from '../models';
import {
  AppUser,
  UpdateAppUserData,
  StoreAppUser,
} from '../../../types/app-user.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
export class AppUserRepository {
  constructor() {}
  async createUser(user: AppUser, transaction: Transaction): Promise<AppUser> {
      const createdUser = await AppUserModel.create(user, {
        transaction: transaction,
      });
      return createdUser;
  }

  async findUserById(id: string, select: string[]|null = null): Promise<AppUser> {
    const options: any = {
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(select){
      options.attributes = select
    }

    return (await AppUserModel.findOne(options)) as unknown as AppUser;
  }

  async findUserByIds(ids: string[]): Promise<AppUser[]> {
    return (await AppUserModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as AppUser[];
  }

  async userExistsById(id: string): Promise<number> {
    return await AppUserModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async findUserByEmail(email: string, exceptId: string | null = null): Promise<AppUser> {
    const options: any = {
      where: {
        email: email,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.findOne(options)) as unknown as AppUser;
  }

  async userExistsByEmail(email: string, exceptId: string | null = null): Promise<AppUser> {
    const options: any = {
      where: {
        email: email,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.count(options)) as unknown as AppUser;
  }

  async findUserByPhone(phoneNumber: string, exceptId: string | null = null): Promise<AppUser> {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.findOne(options)) as unknown as AppUser;
  }

  async userExistsByPhone(phoneNumber: string, exceptId: string | null = null): Promise<AppUser> {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.count(options)) as unknown as AppUser;
  }

  // async nullifyUserOtp(id: string): Promise<AppUser> {
  //   return (await AppUserModel.update(
  //     {
  //       otp: null,
  //       otp_expires_at: null,
  //     },
  //     {
  //       where: {
  //         id: id,
  //       },
  //     },
  //   )) as unknown as AppUser;
  // }

  // async setOtp(id: string, otp: string): Promise<AppUser> {
  //   const otp_validity = Number(getEnvVar('OTP_EXPIRY'));
  //   return (await AppUserModel.update(
  //     {
  //       // otp: otp,
  //       otp_expires_at: datetimeYMDHis(null, 'mins', otp_validity),
  //     },
  //     {
  //       where: {
  //         id: id,
  //       },
  //     },
  //   )) as unknown as AppUser;
  // }

  async getAllAppUsers(): Promise<AppUser[]> {
    return (await AppUserModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as AppUser[];
  }

  async storeAppUser(data: StoreAppUser, transaction?: Transaction): Promise<AppUser> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AppUserModel.create(data, options) as unknown as AppUser;
  }

  async updateAppUser(data: UpdateAppUserData, id: string, transaction?: Transaction): Promise<AppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.update(data, options)) as unknown as AppUser;
  }

  async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction): Promise<AppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await AppUserModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as AppUser;
  }

  async hardDeleteById(id: string): Promise<AppUser> {
    return (await AppUserModel.destroy({
      where: {
        id: id,
      },
    })) as unknown as AppUser;
  }

  async getAllAppUsersWithOptions(select: string[]|null = null): Promise<AppUser[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findAll(options));
  }
}
