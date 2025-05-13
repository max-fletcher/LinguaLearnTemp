import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class DayModel extends Model<
  InferAttributes<DayModel>,
  InferCreationAttributes<DayModel>
> {
  declare id: string
  declare courseId: string
  declare dayNumber: number
  declare title: string
  declare description: string | null
  declare createdBy: string
  declare updatedBy: string
}

DayModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayNumber: {
      type: DataTypes.INTEGER,
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
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'days',
    sequelize,
    timestamps: true,
  },
);

export { DayModel };
