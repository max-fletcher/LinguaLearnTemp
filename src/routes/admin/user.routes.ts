import express from 'express';
// import multer from 'multer';
// import {
//   createAdminUser,
//   getAdminUsers,
//   getUserDetails,
//   updateAdminUser,
//   updateUserProfile,
// } from '../../controllers/admin/admin-user.controller';
// import { getAppUsers, invalidateAllAppUserTokens } from '../../controllers/admin/app-user.controller';
// import {
//   deleteDiscount,
//   getDiscountDetails,
//   getDiscounts,
//   storeDiscounts,
//   updateDiscount,
//   updateDiscountStatus,
// } from '../../controllers/admin/discounts.controller';
// import {
//   getNotifications,
//   storeNotifications,
//   updateSeenNotification,
// } from '../../controllers/admin/notification.controller';
// import {
//   approvePayoutRequest,
//   getPayouts,
//   getSinglePayout,
//   requestPayout,
// } from '../../controllers/admin/payout-controller';
// import {
//   deleteEducationalExperience,
//   deleteExperience,
//   getBiography,
//   getEducationalExperiences,
//   getEducationExperience,
//   getExperience,
//   getExperiences,
//   storeEducationExperience,
//   storeWorkExperience,
//   updateBiography,
//   updateEducationExperience,
//   updateExperience,
// } from '../../controllers/admin/professional-profile.controller';
// import {
//   createTiers,
//   deleteTiers,
//   getSelectedTiers,
//   getTierDetails,
//   getTiers,
//   updateTiers,
// } from '../../controllers/admin/tiers.controller';
// import { getTransactions } from '../../controllers/admin/transaction.controller';
// import { s3FileUploader } from '../../middleware/fileUploadS3.middleware';
// import { userRoleMiddleware } from '../../middleware/user.middleware';
// import {
//   discountRequestSchema,
//   discountStatusRequestSchema,
// } from '../../schema/discounts.schema';
// import {
//   payoutFilterSchema,
//   payoutRequestSchema,
//   updatePayoutStatusSchema,
// } from '../../schema/payout.schema';
// import { tiersRequestSchema } from '../../schema/tiers.schema';
// import { transactionFilterSchema } from '../../schema/transaction.schema';
// import {
//   professionalBiographySchema,
//   professionalEducationSchema,
//   professionalWorkExperienceSchema,
// } from '../../schema/user-profile.schema';
// import {
//   createAdminUserSchema,
//   updateAdminUserSchema,
//   updateUserProfileSchema,
// } from '../../schema/user.schema';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { loginRequestSchema } from '../../schema/login.schema';
import { login } from '../../controllers/admin/auth.controller';

const adminUserRouter = express.Router();
// const formData = multer();

adminUserRouter.post('/login', validateRequestBody(loginRequestSchema), login);

// adminUserRouter.post(
//   '/profile/update',
//   s3FileUploader([{ name: 'avatar', maxCount: 1 }], 'profile_avatar'),
//   validateRequestBody(updateUserProfileSchema),
//   updateUserProfile,
// );

// // Professional Profile Routes

// adminUserRouter.post(
//   '/professional-profile/store-experience',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   s3FileUploader([{ name: 'logo_url', maxCount: 1 }], 'professional_profile'),
//   validateRequestBody(professionalWorkExperienceSchema),

//   storeWorkExperience,
// );

// adminUserRouter.get(
//   '/professional-profile/experiences',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   getExperiences,
// );

// adminUserRouter.get(
//   '/professional-profile/experiences/:id',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   getExperience,
// );

// adminUserRouter.put(
//   '/professional-profile/experiences/:id',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   s3FileUploader([{ name: 'logo_url', maxCount: 1 }], 'professional_profile'),
//   validateRequestBody(professionalWorkExperienceSchema),
//   updateExperience,
// );

// adminUserRouter.delete(
//   '/professional-profile/experiences/:id',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   deleteExperience,
// );

// adminUserRouter.post(
//   '/professional-profile/store-education',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   s3FileUploader([{ name: 'logo_url', maxCount: 1 }], 'professional_profile'),
//   validateRequestBody(professionalEducationSchema),
//   storeEducationExperience,
// );

// adminUserRouter.get(
//   '/professional-profile/educations',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   getEducationalExperiences,
// );

// adminUserRouter.get(
//   '/professional-profile/educations/:id',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   getEducationExperience,
// );

// adminUserRouter.put(
//   '/professional-profile/educations/:id',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   s3FileUploader([{ name: 'logo_url', maxCount: 1 }], 'professional_profile'),
//   validateRequestBody(professionalEducationSchema),
//   updateEducationExperience,
// );

// adminUserRouter.delete(
//   '/professional-profile/educations/:id',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   deleteEducationalExperience,
// );

// adminUserRouter.get(
//   '/professional-profile/biography',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   getBiography,
// );

// adminUserRouter.post(
//   '/professional-profile/update-biography',
//   userRoleMiddleware([UserTypes.PROFESSIONAL]),
//   validateRequestBody(professionalBiographySchema),
//   updateBiography,
// );

// // Define admin users routes
// adminUserRouter
//   .get(
//     '/admin-users',
//     userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//     getAdminUsers,
//   )
//   .get(
//     '/admin-users/:id',
//     userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//     getUserDetails,
//   );

// adminUserRouter.post(
//   '/admin-users/create',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(createAdminUserSchema),
//   createAdminUser,
// );

// adminUserRouter.put(
//   '/admin-users/update',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(updateAdminUserSchema),
//   updateAdminUser,
// );

// // Define App User Routes

// adminUserRouter.get(
//   '/app-users',
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   getAppUsers,
// );

// adminUserRouter.get(
//   '/logout-all-app-users',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//   ]),
//   invalidateAllAppUserTokens,
// );

// // Define tiers routes

// adminUserRouter.get(
//   '/tiers',
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   getTiers,
// );
// adminUserRouter.post(
//   '/tiers/create',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(tiersRequestSchema),
//   createTiers,
// );
// adminUserRouter.put(
//   '/tiers/update/:id',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(tiersRequestSchema),
//   updateTiers,
// );

// adminUserRouter.delete(
//   '/tiers/delete/:id',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   deleteTiers,
// );
// adminUserRouter.get(
//   '/tiers/:id',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   getTierDetails,
// );

// // Payout Routes

// adminUserRouter.get(
//   '/payouts',
//   formData.none(),
//   validateRequestBody(payoutFilterSchema),
//   getPayouts,
// );

// adminUserRouter.get(
//   '/payouts/:id',
//   getSinglePayout,
// );

// adminUserRouter.post(
//   '/request-payout',
//   formData.none(),
//   validateRequestBody(payoutRequestSchema),
//   requestPayout,
// );

// adminUserRouter.post(
//   '/payouts-approve/:id',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(updatePayoutStatusSchema),
//   approvePayoutRequest,
// );

// // Transaction Routes

// adminUserRouter.get(
//   '/transactions',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(transactionFilterSchema),
//   getTransactions,
// );

// // Notification Routes

// adminUserRouter.get('/notifications', getNotifications);

// adminUserRouter.post('/notifications', storeNotifications);

// adminUserRouter.put('/seen-notification', updateSeenNotification);

// // Admin Discounts Routes

// adminUserRouter.get(
//   '/discounts',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//     UserTypes.ADMIN,
//     UserTypes.INFLUENCER,
//   ]),
//   getDiscounts,
// );

// adminUserRouter.get(
//   '/discounts/:id',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//     UserTypes.ADMIN,
//     UserTypes.INFLUENCER,
//   ]),
//   getDiscountDetails,
// );

// adminUserRouter.post(
//   '/discounts',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//     UserTypes.ADMIN,
//     UserTypes.INFLUENCER,
//   ]),
//   s3FileUploader([{ name: 'thumbnail_image', maxCount: 1 }], 'discounts'),
//   validateRequestBody(discountRequestSchema),
//   storeDiscounts,
// );

// adminUserRouter.put(
//   '/discounts/:id',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//     UserTypes.ADMIN,
//     UserTypes.INFLUENCER,
//   ]),
//   s3FileUploader([{ name: 'thumbnail_image', maxCount: 1 }], 'discounts'),
//   validateRequestBody(discountRequestSchema),
//   updateDiscount,
// );

// adminUserRouter.delete(
//   '/discounts/:id',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//     UserTypes.ADMIN,
//     UserTypes.INFLUENCER,
//   ]),
//   deleteDiscount,
// );

// adminUserRouter.patch(
//   '/discounts/update-status/:id',
//   formData.none(),
//   userRoleMiddleware([UserTypes.SUPERADMIN, UserTypes.ADMIN]),
//   validateRequestBody(discountStatusRequestSchema),
//   updateDiscountStatus,
// );

// adminUserRouter.get(
//   '/get-selected-tiers',
//   userRoleMiddleware([
//     UserTypes.SUPERADMIN,
//     UserTypes.ADMIN,
//     UserTypes.INFLUENCER,
//   ]),
//   getSelectedTiers,
// );

export { adminUserRouter };
