import express from 'express';
import {
  confirmChangeEmail,
  confirmChangePhoneNo,
  confirmChangeWhatsappNo,
  // deleteMyAccount,
  getUserProfile,
  initiateEmailChange,
  initiatePhoneNoChange,
  initiateWhatsappNoChange,
  initiateAccountWipeout,
  confirmAccountWipeout,
  updateAvatar,
  updateName,
  updateNotificationStatus,
  updateProfileImage,
  updateUsername,
  verifyOTPForDeleteAppUser,
} from '../../controllers/app/user.controller';
import { appUserUsernameSetMiddleware } from '../../middleware/appUserUsernameSet.middleware';
import { s3FileUploader } from '../../middleware/fileUploadS3.middleware';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';
import {
  appVerifyOtpSchema,
  avatarSchama,
  confirmAccountWipeoutSchema,
  emailSchema,
  nameSchema,
  phoneNoSchema,
  profileImageSchama,
  usernameSchema,
  whatsappNoSchema,
} from '../../schema/app-auth.schema';
import { toggleNotificationSchema } from '../../schema/user-profile.schema';
import { validateRequestBody } from '../../utils/validatiion.utils';

const appUserRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define routes
appUserRouter
  .get(
    '/user_profile',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    getUserProfile,
  )
  .post(
    '/update_name',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(nameSchema),
    updateName,
  )
  .post(
    '/update_username',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    validateRequestBody(usernameSchema),
    updateUsername,
  )
  .post(
    '/initialize_change_phone_no',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(phoneNoSchema),
    initiatePhoneNoChange,
  )
  .post(
    '/confirm_change_phone_no',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(appVerifyOtpSchema),
    confirmChangePhoneNo,
  )
  .post(
    '/initialize_change_email',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(emailSchema),
    initiateEmailChange,
  )
  .post(
    '/confirm_change_email',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(appVerifyOtpSchema),
    confirmChangeEmail,
  )
  .post(
    '/initialize_change_whatsapp_no',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(whatsappNoSchema),
    initiateWhatsappNoChange,
  )
  .post(
    '/confirm_change_whatsapp_no',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(appVerifyOtpSchema),
    confirmChangeWhatsappNo,
  )
  .post(
    '/update_avatar',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(avatarSchama),
    updateAvatar,
  )
  .post(
    '/update_profile_image',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    s3FileUploader(
      [
        { name: 'profile_image', maxCount: 1 },
        { name: 'avatar_url', maxCount: 1 },
      ],
      'app_user_profile_images',
      31457280,
    ),
    validateRequestBody(profileImageSchama),
    updateProfileImage,
  )
  .post(
    '/update_notification_status',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    validateRequestBody(toggleNotificationSchema),
    updateNotificationStatus,
  )
  .get('/delete_app_user/initiate', jwtMiddleware.verifyAppUserToken, initiateAccountWipeout)
  .post(
    '/delete_app_user/verify_otp',
    jwtMiddleware.verifyAppUserToken,
    validateRequestBody(appVerifyOtpSchema),
    verifyOTPForDeleteAppUser
  )
  .post(
    '/delete_app_user/confirm',
    jwtMiddleware.verifyAppUserToken,
    validateRequestBody(confirmAccountWipeoutSchema),
    confirmAccountWipeout
  );

export { appUserRouter };
