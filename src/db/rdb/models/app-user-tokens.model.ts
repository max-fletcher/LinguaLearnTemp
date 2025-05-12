import { UserClient } from '../../clients/postgres.client';

import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class AppUserTokenModel extends Model<
  InferAttributes<AppUserTokenModel>,
  InferCreationAttributes<AppUserTokenModel>
> {
  declare id: string;
  declare user_id: string;
  declare token: string;
}

AppUserTokenModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'app_user_tokens',
    sequelize,
    timestamps: true,
  },
);

export { AppUserTokenModel };
