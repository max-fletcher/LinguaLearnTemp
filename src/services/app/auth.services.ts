import { AppUserRepository } from '../../db/rdb/repositories/app-user.repository';
import { mapToUserModel } from '../../mapper/user.mapper';
import {
  createUserBalanceId,
  generateUserId /*, generateOtp*/,
} from '../../utils/id.utils';
import {
  SocialAuthProviders,
  UserAllDataTypes,
  UserUpdate,
  UserWithTimeStamps,
} from '../../types/app.user.type';
import fs from 'fs';
import admin from 'firebase-admin';
import twilio from 'twilio';
import { getEnvVar } from '../../utils/common.utils';
import { CustomException } from '../../errors/CustomException.error';
import { mapToUserBalanceModel } from '../../mapper/user-balance.mapper';
import { datetimeYMDHis } from '../../utils/datetime.utils';
import { formatLoginAppUserData } from '../../formatter/app-user.formatter';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { UnauthorizedException } from '../../errors/UnauthorizedException.error';
import { Transaction } from 'sequelize';
import { capitalizeFirstLetter } from '../../utils/string.utils';
import { NameAndUsernameSchema } from 'schema/app-auth.schema';
import { ValidationException } from '../../errors/ValidationException.error';
import { CurrencyRepository } from '../../db/rdb/repositories/currency.repository';
import { AppUserPayload } from 'schema/token-payload.schema';
import { AppUserNotificationOptions, RegistrationMethod, ResendOTPChannel } from '../../constants/enums';

export class AuthService {
  private appUserRepo: AppUserRepository;
  private currencyRepo: CurrencyRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
    this.currencyRepo = new CurrencyRepository();
  }

  async loginWithPhone(phone: string, transaction: Transaction) {
    const user: UserWithTimeStamps = await this.appUserRepo.findUserByPhone(phone);
    // const otp = generateOtp();

    if (user) {
      // await this.appUserRepo.setOtp(user.id, otp);
      const userData = await this.appUserRepo.getUserProfile(user.id);

      if(phone !== "+8801700000000"){
        const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
        const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
        const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');

        const client = twilio(twilioAccountSid, twilioAuthToken);
        const verification = await client.verify.v2
          .services(twilioVerifyServiceSid)
          .verifications.create({
            channel: 'sms',
            to: phone,
          });

        if (
          verification.status &&
          verification.status !== 'pending' &&
          !verification.valid
        )
          throw new CustomException(
            'Failed to generate OPT. Please try again.',
            500,
          );
      }

      await transaction.commit();

      const formattedData = formatLoginAppUserData(userData); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

      return {
        data: formattedData,
        devices: userData,
        authenticated: true,
        message: 'Login Successful',
        status: 200,
      };
    }

    const id = generateUserId();
    const defaultCurrency =
      await this.currencyRepo.findCurrencyByShortCode('AUD');
    const newUser = mapToUserModel(
      id,
      phone !== "+8801700000000" ? null : 'Test User',
      phone !== "+8801700000000" ? null : 'Test User',
      null,
      null,
      phone,
      null,
      // otp,
      null,
      null,
      [],
      null,
      null,
      null,
      null,
      null,
      'Australia',
      defaultCurrency.id,
      null,
      phone !== "+8801700000000" ? null : true,
      null,
      null,
      null,
      AppUserNotificationOptions.ON,
      null,
      null,
      null,
      RegistrationMethod.PHONE
    );

    const balanceId = createUserBalanceId();
    const newUserBalance = mapToUserBalanceModel(balanceId, id, null);
    const createdUser: UserWithTimeStamps = await this.appUserRepo.createUser(
      newUser,
      newUserBalance,
      transaction,
    );

    if (!createdUser)
      throw new CustomException('Failed to store user. Please try again.', 500);

    if(phone !== "+8801700000000"){
      const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
      const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
      const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');

      const client = twilio(twilioAccountSid, twilioAuthToken);
      const verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications.create({
          channel: 'sms',
          to: phone,
        });

      // # For testing purposes only. Remove on prod.
      // const verification = {status: 'pending', valid: true}

      if (
        verification.status &&
        verification.status !== 'pending' &&
        !verification.valid
      )
        throw new CustomException(
          'Failed to generate OPT. Please try again.',
          500,
        );
    }

    await transaction.commit();

    const userData = await this.appUserRepo.getUserProfile(id);
    const formattedData = formatLoginAppUserData(userData); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    return {
      data: formattedData,
      authenticated: true,
      message: 'Login Successful',
      status: 201,
    };
  }

  async usernameExists(data: NameAndUsernameSchema, id: string) {
    const usernameExists = await this.appUserRepo.userExistsByUsername(
      data.username,
      id,
    );

    if (usernameExists) return true;

    return false;
  }

  async updateNameAndUsername(data: NameAndUsernameSchema, id: string, transaction?: Transaction) {
    const usernameExists = await this.appUserRepo.userExistsByUsername(
      data.username,
      id,
    );
    if (usernameExists)
      throw new ValidationException('User with this username already exists!');

    const updated = await this.appUserRepo.updateUser(data, id, transaction);

    if (!updated) return false;

    if(transaction)
      await transaction.commit();

    const userData = await this.appUserRepo.getUserProfile(id);
    const formattedData = formatLoginAppUserData(userData); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    return {
      data: formattedData,
      authenticated: true,
      message: 'Login Successful',
      status: 200,
    };
  }

  async verifyOTP(
    to: string,
    otp: string,
    verifyAppUserId: string | null = null,
  ) {
    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    const verificationCheck = await client.verify.v2
      .services(twilioVerifyServiceSid)
      .verificationChecks.create({
        to: to,
        code: otp,
      });

    if (verificationCheck) {
      if (verificationCheck.status === 'approved' && verificationCheck.valid) {
        if (verifyAppUserId) {
          const data: UserUpdate = { verified: true };
          const updated = await this.appUserRepo.updateUser(
            data,
            verifyAppUserId,
          );
          if (!updated)
            throw new CustomException(
              'Something went wrong. Please try again.',
              500,
            );
          return await this.appUserRepo.getUserProfile(verifyAppUserId);
        }
        return true;
      }

      if (verificationCheck.status === 'failed')
        throw new BadRequestException('OTP mismatch!');

      if (verificationCheck.status === 'expired')
        throw new UnauthorizedException(
          'OTP expired! Please resend OTP and try again.',
        );

      if (verificationCheck.status === 'max_attempts_reached')
        throw new UnauthorizedException(
          'Too many attempts for current OTP! Please resend OTP and try again.',
        );

      // deleted || failed || pending || canceled
      throw new UnauthorizedException(
        'OTP mismatch! Please resend OTP and try again.',
      );
    }

    // fallback
    throw new UnauthorizedException(
      'This OTP has been deleted! Please resend OTP and try again.',
    );
  }

  async sendOTP(phone: string) {
    if (!phone)
      throw new BadRequestException(
        'Phone no. not set. Please set Phone no. and try again.',
      );

    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    const verification = await client.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        channel: 'sms',
        to: phone,
      });

    if (
      verification.status &&
      verification.status !== 'pending' &&
      !verification.valid
    )
      throw new CustomException(
        'Failed to generate OPT. Please try again.',
        500,
      );

    // const otp = generateOtp();
    // await this.appUserRepo.setOtp(id, otp);
    return true;
  }

  async resendOtp(user: AppUserPayload, channel: string|null = ResendOTPChannel.PHONE) {
    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    const appUsers = await this.appUserRepo.findUserById(user.id);

    let verification;
    if (channel === ResendOTPChannel.PHONE){
      if (!appUsers.phone)
        throw new BadRequestException(
          'Phone no. not set. Please set Phone no. and try again.',
        );

      verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications.create({
          channel: 'sms',
          to: appUsers.phone!,
        });
    }
    else if (channel === ResendOTPChannel.EMAIL){
      if (!appUsers.email)
        throw new BadRequestException(
          'Email not set. Please set email and try again.',
        );

      verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications.create({
          channel: 'email',
          to: appUsers.email,
        });
    }
    else if (channel === ResendOTPChannel.WHATSAPP){
      if (!appUsers.whatsapp_no)
        throw new BadRequestException(
          'Whatsapp number not set. Please set whatsapp no. and try again.',
        );

      verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications.create({
          channel: 'whatsapp',
          to: appUsers.whatsapp_no,
        });
    }

    if (
      verification &&
      verification.status &&
      verification.status !== 'pending' &&
      !verification.valid
    )
      throw new CustomException(
        'Failed to generate OPT. Please try again.',
        500,
      );

    // const otp = generateOtp();
    // await this.appUserRepo.setOtp(id, otp);
    return true;
  }

  async sendOTPToWhatsappOrEmail(user: AppUserPayload, channel: string) {
    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    let verification;
    if (channel === 'email') {
      if (!user.email)
        throw new BadRequestException(
          'Email not set. Please set email and try again.',
        );

      verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications.create({
          channel: 'email',
          to: user.email,
        });
    }
    if (channel === 'whatsapp') {
      if (!user.whatsapp_no)
        throw new BadRequestException(
          'Whatsapp number not set. Please set whatsapp no. and try again.',
        );

      verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications.create({
          channel: 'whatsapp',
          to: user.whatsapp_no,
        });
    }

    if (
      verification!.status &&
      verification!.status !== 'pending' &&
      !verification!.valid
    )
      throw new CustomException(
        'Failed to generate OPT. Please try again.',
        500,
      );

    // const otp = generateOtp();
    // await this.appUserRepo.setOtp(id, otp);
    return true;
  }

  async checkGoogleAuth(idToken: string) {
    if (!idToken) throw new CustomException('Google token missing!', 500);

    // Home PC: fs.readFileSync('./src/config/google-services.json', 'utf8'), Office PC: fs.readFileSync('../../config/google-services.json', 'utf8')
    const FIREBASE_SERVICE_ACCOUNT = JSON.parse(
      fs.readFileSync('./src/config/google-services.json', 'utf8'),
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
      });
    }
    const firebaseAuth = admin.auth();

    return await firebaseAuth
      .verifyIdToken(idToken)
      .then((decodedToken: { uid: any }) => {
        return decodedToken;
      })
      .catch((e) => {
        console.log('social auth error', e);
        throw new CustomException('Invalid google token!', 500);
      });
  }

  async checkAppleAuth(idToken: string) {
    if (!idToken) throw new CustomException('Apple token missing!', 500);

    // Home PC: fs.readFileSync('./src/config/google-services.json', 'utf8'), Office PC: fs.readFileSync('../../config/google-services.json', 'utf8')
    const FIREBASE_SERVICE_ACCOUNT = JSON.parse(
      fs.readFileSync('./src/config/google-services.json', 'utf8'),
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
      });
    }
    const firebaseAuth = admin.auth();

    return await firebaseAuth
      .verifyIdToken(idToken)
      .then((decodedToken: { uid: any }) => {
        return decodedToken;
      })
      .catch((e) => {
        console.log('social auth error', e);
        throw new CustomException('Invalid apple token!', 500);
      });
  }

  async loginSocialUser(
    provider: SocialAuthProviders,
    data: any,
    transaction: Transaction,
  ) {
    data.displayName = data.displayName !== "null null" ? data.displayName : null;

    // # Might need to change type from any to something meaningful later
    let userExists: UserAllDataTypes =
      await this.appUserRepo.findUserByProviderID(provider, data.uid);

    if (userExists) {
      const userData = await this.appUserRepo.getUserProfile(userExists.id);
      const formattedData = formatLoginAppUserData(userData); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

      await transaction.commit();

      return {
        data: formattedData,
        authenticated: true,
        message: `${capitalizeFirstLetter(provider)} Login Successful`,
        status: 200,
      };
    }

    userExists = await this.appUserRepo.findUserByEmail(data.email);

    if (userExists) {
      const updateUser: UserUpdate = {
        username: userExists.username ?? data.displayName,
        providers: [
          ...userExists.providers,
          {
            [provider]: {
              uid: data.uid,
              username: data.displayName,
              email: data.email,
              phone: data.phoneNumber,
            },
          },
        ],
        google_id:
          userExists.google_id ?? (provider === 'google' ? data.uid : null),
        facebook_id:
          userExists.facebook_id ?? (provider === 'facebook' ? data.uid : null),
        apple_id:
          userExists.apple_id ?? (provider === 'apple' ? data.uid : null),
        profile_image_url: userExists.profile_image_url ?? data.photoURL,
        avatar_url: userExists.avatar_url ?? data.photoURL,
        updatedAt: datetimeYMDHis(),
      };

      await this.appUserRepo.updateUser(updateUser, userExists.id, transaction);
      await transaction.commit();
      const userData = await this.appUserRepo.getUserProfile(userExists.id);
      const formattedData = formatLoginAppUserData(userData); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

      return {
        data: formattedData,
        authenticated: true,
        message: `${capitalizeFirstLetter(provider)} Login Successful`,
        status: 200,
      };
    }

    const id = generateUserId();
    const defaultCurrency =
      await this.currencyRepo.findCurrencyByShortCode('AUD');
    const newUser = mapToUserModel(
      id,
      data.displayName,
      null,
      data.email,
      null,
      data.phone,
      null,
      null,
      null,
      [
        {
          [provider]: {
            uid: data.uid,
            username: data.displayName,
            email: data.email,
            phone: data.phoneNumber,
          },
        },
      ],
      provider === 'google' ? data.uid : null,
      provider === 'facebook' ? data.uid : null,
      provider === 'apple' ? data.uid : null,
      data.photoURL,
      data.photoURL,
      null,
      defaultCurrency.id,
      null,
      true,
      null,
      null,
      null,
      AppUserNotificationOptions.ON,
      null,
      null,
      null,
      RegistrationMethod.SOCIAL
    );

    const balanceId = createUserBalanceId();
    const newUserBalance = mapToUserBalanceModel(balanceId, id, null);
    const createdUser: UserWithTimeStamps = await this.appUserRepo.createUser(
      newUser,
      newUserBalance,
      transaction,
    );
    await transaction.commit();
    if (!createdUser)
      throw new CustomException('Failed to store user. Please try again.', 500);

    const userData = await this.appUserRepo.getUserProfile(id);
    const formattedData = formatLoginAppUserData(userData); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    return {
      data: formattedData,
      authenticated: true,
      message: `${capitalizeFirstLetter(provider)} Login Successful`,
      status: 201,
    };
  }

  async storeOrUpdateAppUserToken(
    userId: string,
    token: string,
    transaction?: Transaction,
  ) {
    const response = await this.appUserRepo.storeOrUpdateAppUserToken(userId, token, transaction);

    return response;
  }
}
