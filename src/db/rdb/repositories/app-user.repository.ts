import { Op, Transaction } from 'sequelize';
import { AppUserModel } from '../models';
import {
  User,
  UpdateAppUser,
  StoreAppUser,
} from '../../../types/app.user.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
export class AppUserRepository {
  constructor() {}
  async createUser(user: User, transaction: Transaction): Promise<User> {
      const createdUser = await AppUserModel.create(user, {
        transaction: transaction,
      });
      return createdUser;
  }

  async findUserById(id: string, select: string[]|null = null): Promise<User> {
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

    return (await AppUserModel.findOne(options)) as unknown as User;
  }

  async findUserByIds(ids: string[]): Promise<User[]> {
    return (await AppUserModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as User[];
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

  async findUserByEmail(email: string, exceptId: string | null = null): Promise<User> {
    const options: any = {
      where: {
        email: email,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.findOne(options)) as unknown as User;
  }

  async userExistsByEmail(email: string, exceptId: string | null = null): Promise<User> {
    const options: any = {
      where: {
        email: email,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.count(options)) as unknown as User;
  }

  async findUserByPhone(phoneNumber: string, exceptId: string | null = null): Promise<User> {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.findOne(options)) as unknown as User;
  }

  async userExistsByPhone(phoneNumber: string, exceptId: string | null = null): Promise<User> {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.count(options)) as unknown as User;
  }

  // async nullifyUserOtp(id: string): Promise<User> {
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
  //   )) as unknown as User;
  // }

  // async setOtp(id: string, otp: string): Promise<User> {
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
  //   )) as unknown as User;
  // }

  async getAllAppUsers(): Promise<User[]> {
    return (await AppUserModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as User[];
  }

  async storeAppUser(data: StoreAppUser, transaction?: Transaction): Promise<User> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AppUserModel.create(data, options) as unknown as User;
  }

  async updateAppUser(data: UpdateAppUser, id: string, transaction?: Transaction): Promise<User> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.update(data, options)) as unknown as User;
  }

  async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction): Promise<User> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await AppUserModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as User;
  }

  async hardDeleteById(id: string): Promise<User> {
    return (await AppUserModel.destroy({
      where: {
        id: id,
      },
    })) as unknown as User;
  }

  async getAllAppUsersWithOptions(select: string[]|null = null): Promise<User[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findAll(options));
  }
}
