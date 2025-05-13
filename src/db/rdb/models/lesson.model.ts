import { Difficulty } from '../../../constants/enums';
import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class LessonModel extends Model<
  InferAttributes<LessonModel>,
  InferCreationAttributes<LessonModel>
> {
  declare id: string
  declare dayId: string
  declare title: string
  declare description: string | null
  declare estimatedMinutes: number
  declare difficulty: string
  declare audioIntro: string
  declare xpReward: number
  declare lessonOrder: number
  declare updatedBy: string
  declare deletedAt: string | null
  declare deletedBy: string | null
}

LessonModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    dayId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    estimatedMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM(
        Difficulty.BEGINNER,
        Difficulty.INTERMEDIATE,
        Difficulty.ADVANCED,
      ),
      defaultValue: Difficulty.BEGINNER,
      allowNull: false,
    },
    audioIntro: {
      type: DataTypes.STRING,
    },
    xpReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50
    },
    lessonOrder: {
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
    tableName: 'lessons',
    sequelize,
    timestamps: true,
  },
);

export { LessonModel };
