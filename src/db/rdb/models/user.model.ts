import { UserVerificationStatus } from '../../../constants/enums';
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
  declare phoneNumber: string
  declare firstName: string | null
  declare lastName: string | null
  declare email?: string | null
  declare streak: number
  declare xpPoints: number
  declare avatarUrl?: string | null
  declare nativeLanguage: string
  declare learningGoal: string
  declare proficiencyLevel?: string | null
  declare isNewUser: boolean
  declare lastLoginAt: string
  declare verified: string
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
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
      allowNull: false,
    },
    learningGoal: {
      type: DataTypes.TEXT,
    },
    proficiencyLevel: {
      type: DataTypes.STRING,
    },
    isNewUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    verified: {
      type: DataTypes.ENUM(
        UserVerificationStatus.VERIFIED,
        UserVerificationStatus.UNVERIFIED,
        UserVerificationStatus.BANNED,
      ),
      defaultValue: UserVerificationStatus.VERIFIED,
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
  },
);

export { UserModel };
