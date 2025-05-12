import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class TestModel extends Model<
  InferAttributes<TestModel>,
  InferCreationAttributes<TestModel>
> {
  declare id: string;
  declare username?: string;
  declare email?: string;
  declare password?: string;
  declare phone?: string;
  declare roles?: [string];
  declare types?: [string];
  declare providers?: [string];
  declare token?: string;
  declare images: [string];
}

TestModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    types: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    providers: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: 'TestTable',
    sequelize,
    timestamps: true,
  },
);

// export { TestModel }
