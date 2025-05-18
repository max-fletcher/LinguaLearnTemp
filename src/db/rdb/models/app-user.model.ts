import { ProficiencyLevel, AppUserVerificationStatus } from '../../../constants/enums';
import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class AppUserModel extends Model<
  InferAttributes<AppUserModel>,
  InferCreationAttributes<AppUserModel>
> {
  declare id: string
  declare phoneNumber: string
  declare firstName: string
  declare lastName: string
  declare email: string | null
  declare streak: number
  declare xpPoints: number
  declare avatarUrl: string | null
  declare nativeLanguage: string
  declare learningGoal: string
  declare proficiencyLevel?: string | null
  declare isNewUser: boolean
  declare lastLoginAt: string
  declare verified: string
  declare deletedAt: string | null
  declare deletedBy: string | null
}

AppUserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      // unique: true, // Not needed since we are using soft-deletes
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
      // unique: true, // Not needed since we are using soft-deletes
      allowNull: true,
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    xpPoints: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.ENUM(
        ProficiencyLevel.BEGINNER,
        ProficiencyLevel.INTERMEDIATE,
        ProficiencyLevel.ADVANCED,
      ),
      allowNull: false,
      defaultValue: ProficiencyLevel.BEGINNER
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
        AppUserVerificationStatus.VERIFIED,
        AppUserVerificationStatus.UNVERIFIED,
        AppUserVerificationStatus.BANNED,
      ),
      defaultValue: AppUserVerificationStatus.UNVERIFIED,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
  },
);

export { AppUserModel };
