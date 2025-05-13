import { Op, Transaction } from 'sequelize';
import { UserModel } from '../models';
import {
  User,
  UpdateAppUser,
  StoreAppUser,
} from '../../../types/app.user.type';
import { getEnvVar } from '../../../utils/common.utils';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
export class AppUserRepository {
  constructor() {}
  async createUser(
    user: User,
    transaction: Transaction,
  ): Promise<User> {
      const createdUser = await UserModel.create(user, {
        transaction: transaction,
      });
      return createdUser;
  }

  async findUserById(id: string, select: string[]|null = null): Promise<User> {
    const options: any = {
      where: {
        id: id,
      },
    }

    if(select){
      options.attributes = select
    }

    return (await UserModel.findOne(options)) as unknown as User;
  }

  async findUserByIds(ids: string[]): Promise<User[]> {
    return (await UserModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })) as unknown as User[];
  }

  async userExistsById(id: string): Promise<number> {
    return await UserModel.count({
      where: {
        id: id,
      },
    });
  }

  async findUserByEmail(email: string, exceptId: string | null = null): Promise<User> {
    const options: { where: { email: string; id?: object } } = {
      where: {
        email: email,
      },
    };

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await UserModel.findOne(options)) as unknown as User;
  }

  async userExistsByEmail(email: string, exceptId: string | null = null): Promise<User> {
    const options: { where: { email: string; id?: object } } = {
      where: {
        email: email,
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await UserModel.count(options)) as unknown as User;
  }

  async findUserByPhone(phoneNumber: string, exceptId: string | null = null): Promise<User> {
    const options: { where: { phoneNumber: string; id?: object } } = {
      where: {
        phoneNumber: phoneNumber,
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await UserModel.findOne(options)) as unknown as User;
  }

  async userExistsByPhone(phoneNumber: string, exceptId: string | null = null): Promise<User> {
    const options: { where: { phoneNumber: string; id?: object } } = {
      where: {
        phoneNumber: phoneNumber,
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await UserModel.count(options)) as unknown as User;
  }

  // async nullifyUserOtp(id: string): Promise<User> {
  //   return (await UserModel.update(
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
  //   return (await UserModel.update(
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

  async deleteById(id: string): Promise<User> {
    return (await UserModel.destroy({
      where: {
        id: id,
      },
    })) as unknown as User;
  }

  async storeAppUser(data: User, transaction?: Transaction): Promise<User> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await UserModel.create(data, options) as unknown as User;
  }

  async updateAppUser(data: UpdateAppUser, id: string, transaction?: Transaction): Promise<User> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await UserModel.update(data, options)) as unknown as User;
  }

  async getAllAppUsers(): Promise<User[]> {
    return (await UserModel.findAll({
      order: [['createdAt', 'DESC']],
    })) as unknown as User[];
  }

  async getAllAppUsersWithOptions(select: string[]|null = null): Promise<User[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await UserModel.findAll(options));
  }
}
