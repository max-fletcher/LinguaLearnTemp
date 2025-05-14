import { Difficulty, Languages } from '../../../constants/enums';
import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class CourseModel extends Model<
  InferAttributes<CourseModel>,
  InferCreationAttributes<CourseModel>
> {
  declare id: string
  declare title: string
  declare description: string | null
  declare totalDays: number
  declare language: string
  declare targetLanguage: string
  declare difficulty: string
  declare imagePath: string
  declare estimatedHours: number
  declare updatedBy: string
  declare deletedAt: string | null
  declare deletedBy: string | null
}

CourseModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    totalDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.ENUM(
        Languages.ENGLISH,
        Languages.BANGLA,
        Languages.FRENCH,
        Languages.SPANISH
      ),
      allowNull: false,
      defaultValue: Languages.ENGLISH,
    },
    targetLanguage: {
      type: DataTypes.ENUM(
        Languages.ENGLISH,
        Languages.BANGLA,
        Languages.FRENCH,
        Languages.SPANISH
      ),
      allowNull: false,
      defaultValue: Languages.ENGLISH,
    },
    difficulty: {
      type: DataTypes.ENUM(
        Difficulty.BEGINNER,
        Difficulty.INTERMEDIATE,
        Difficulty.ADVANCED,
      ),
      allowNull: false,
      defaultValue: Difficulty.BEGINNER,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'courses',
    sequelize,
    timestamps: true,
  },
);

export { CourseModel };
