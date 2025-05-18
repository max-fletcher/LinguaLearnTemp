// import {TestModel} from "./test.model"
import { AdminUserModel } from './admin-users.model';
import { AppUserModel } from './app-user.model';
import { UserOTPModel } from './user-otp.model';
import { CourseModel } from './course.model';
import { DayModel } from './days.model';
import { LessonModel } from './lesson.model';

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
  as: 'updated_courses',
  foreignKey: 'updatedBy',
});
CourseModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
});

AdminUserModel.hasMany(CourseModel, {
  as: 'deleted_courses',
  foreignKey: 'deletedBy',
});
CourseModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(DayModel, {
  as: 'updated_days',
  foreignKey: 'updatedBy',
});
DayModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
});

AdminUserModel.hasMany(DayModel, {
  as: 'deleted_days',
  foreignKey: 'deletedBy',
});
DayModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(LessonModel, {
  as: 'updated_lessons',
  foreignKey: 'updatedBy',
});
LessonModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
});

AdminUserModel.hasMany(LessonModel, {
  as: 'deleted_lessons',
  foreignKey: 'deletedBy',
});
LessonModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});


// COURSE ASSOCIATIONS
CourseModel.hasMany(DayModel, {
  as: 'days',
  foreignKey: 'courseId',
});
DayModel.belongsTo(CourseModel, {
  as: 'course',
  foreignKey: 'courseId',
});


// DAy ASSOCIATIONS
DayModel.hasMany(LessonModel, {
  as: 'lessons',
  foreignKey: 'dayId',
});
LessonModel.belongsTo(DayModel, {
  as: 'day',
  foreignKey: 'dayId',
});

export {
  AppUserModel,
  AdminUserModel,
  UserOTPModel,
  CourseModel,
  DayModel,
  LessonModel,
};
