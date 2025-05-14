// import {TestModel} from "./test.model"
import { AdminUserModel } from './admin-users.model';
import { AppUserModel } from './app-user.model';
import { UserOTPModel } from './user-otp.model';
import { CourseModel } from './course.model';
import { DayModel } from './days.model';

// ADMIN USER ASSOCIATIONS
AdminUserModel.hasMany(AppUserModel, {
  as: 'deleted_app_user',
  foreignKey: 'deletedBy',
});
AppUserModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(CourseModel, {
  as: 'courses',
  foreignKey: 'updatedBy',
});
CourseModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
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
  AppUserModel,
  AdminUserModel,
  UserOTPModel,
  CourseModel
};
