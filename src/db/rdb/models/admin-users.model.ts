import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
// import { UserStatus, UserTypes } from '../../../constants/enums';
import { UserClient } from '../../../db/clients/postgres.client';

const sequelize = UserClient.getInstance();

class AdminUserModel extends Model<
  InferAttributes<AdminUserModel>,
  InferCreationAttributes<AdminUserModel>
> {
  declare id: string
  declare firstName: string
  declare lastName: string
  declare email: string | null
  declare phoneNumber: string | null
  declare password: string
}

AdminUserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    
  },
  {
    tableName: 'admin_users',
    sequelize,
    timestamps: true,
  },
);

export { AdminUserModel };
