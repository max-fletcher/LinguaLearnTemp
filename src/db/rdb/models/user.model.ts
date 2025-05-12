import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: string
  declare phone_number: string
  declare name?: string | null
  declare email?: string | null
  declare password: string
  declare streak: number
  declare xpPoints: number
  declare avatarUrl?: string | null
  declare nativeLanguage: string
  declare learningGoal: string
  declare proficiencyLevel?: string | null
  declare isNewUser: boolean
  declare lastLoginAt: string
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    streak: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    xpPoints: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nativeLanguage: {
      type: DataTypes.STRING,
    },
    learningGoal: {
      type: DataTypes.TEXT,
    },
    proficiencyLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isNewUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    }
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
  },
);

export { UserModel };
