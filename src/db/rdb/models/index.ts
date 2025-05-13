// import {TestModel} from "./test.model"
import { AdminUserModel } from './admin-users.model';
import { UserModel } from './app-user.model';
import { UserOTPModel } from './user-otp.model';
import { CourseModel } from './course.model';
import { DayModel } from './days.model';

// ADMIN USER ASSOCIATIONS
AdminUserModel.hasMany(CourseModel, {
  as: 'courses',
  foreignKey: 'createdBy',
});
CourseModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'createdBy',
});
CourseModel.hasMany(DayModel, {
  as: 'days',
  foreignKey: 'courseId',
});
DayModel.belongsTo(CourseModel, {
  as: 'course',
  foreignKey: 'courseId',
});

export {
  UserModel,
  AdminUserModel,
  UserOTPModel,
  CourseModel
};
