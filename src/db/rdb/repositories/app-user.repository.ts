import { Op, Transaction } from 'sequelize';
import { UserModel } from '../models';
import {
  User,
  UserUpdate,
} from '../../../types/app.user.type';
import { updateUserOptions } from 'types/repository.type';
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

  async userExistsByUsername(
    username: string,
    id: string | null = null,
  ): Promise<number> {
    const options: { where: { username: string; id?: object } } = {
      where: {
        username: username,
      },
    };
    if (id) options.where.id = { [Op.ne]: id };

    return await UserModel.count(options);
  }

  async findUserByEmail(email: string): Promise<User> {
    return (await UserModel.findOne({
      where: {
        email: email,
      },
    })) as unknown as User;
  }

  async userExistsByEmail(
    email: string,
    id: string | null = null,
  ): Promise<User> {
    const options: { where: { email: string; id?: object } } = {
      where: {
        email: email,
      },
    };
    if (id) options.where.id = { [Op.ne]: id };

    return (await UserModel.count(options)) as unknown as User;
  }

  async findUserByPhone(
    phone: string,
    id: string | null = null,
  ): Promise<User> {
    const options: { where: { phone: string; id?: object } } = {
      where: {
        phone: phone,
      },
    };
    if (id) options.where.id = { [Op.ne]: id };

    return (await UserModel.findOne(options)) as unknown as User;
  }

  async userExistsByPhone(
    phone: string,
    id: string | null = null,
  ): Promise<User> {
    const options: { where: { phone: string; id?: object } } = {
      where: {
        phone: phone,
      },
    };
    if (id) options.where.id = { [Op.ne]: id };

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
  //       otp: otp,
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

  async updateUser(
    data: UserUpdate,
    id: string,
    transaction?: Transaction,
  ): Promise<User> {
    const options: updateUserOptions = {
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
