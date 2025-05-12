import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class UserOTPModel extends Model<
  InferAttributes<UserOTPModel>,
  InferCreationAttributes<UserOTPModel>
> {
  declare id: string
  declare phoneNumber: string
  declare otp: string
  declare otp_expires_at: string
  declare verified: boolean
}

UserOTPModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.INTEGER,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: 'user_otps',
    sequelize,
    timestamps: true,
  },
);

export { UserOTPModel };
