import twilio from 'twilio';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { UserMongoRepository } from '../db/nosql/repository/user.repository';
import { mapToMongoUser } from '../mapper/user.mapper';
import { SocialAuthProviders, UserUpdate } from '../types/app.user.type';
import { ValidationException } from '../errors/ValidationException.error';
import { getEnvVar } from '../utils/common.utils';
import { CustomException } from '../errors/CustomException.error';
// import { RedisService } from '../services/redis.services';
import { NodeCacheService } from '../services/node-cache.services';
import { AppUserPayload } from '../schema/token-payload.schema';
import { AuthService } from './app/auth.services';
import { UnauthorizedException } from '../errors/UnauthorizedException.error';
import { execSync  } from 'child_process';
import { NotFoundException } from '../errors/NotFoundException.error';
import { AppUserStatus } from '../constants/enums';
import { datetimeYMDHis } from '../utils/datetime.utils';
import { Transaction } from 'sequelize';

export class AppUserService {
  private appUserRepo: AppUserRepository;
  private authService: AuthService;
  private userMongoRepo: UserMongoRepository;
  // private redisService: RedisService;
  private nodeCacheService: NodeCacheService;

  constructor() {
    this.appUserRepo = new AppUserRepository();
    this.authService = new AuthService();
    this.userMongoRepo = new UserMongoRepository();
    // this.redisService = new RedisService();
    this.nodeCacheService = new NodeCacheService();
  }

  async findUserById(id: string, select: string[]|null = null) {
    return await this.appUserRepo.findUserById(id, select);
  }

  async userExistsById(id: string) {
    return await this.appUserRepo.userExistsById(id);
  }

  async findUserByEmail(email: string) {
    return await this.appUserRepo.findUserByEmail(email);
  }

  async findUserByPhone(phone: string) {
    return await this.appUserRepo.findUserByPhone(phone);
  }

  async getAllAppUsers() {
    return await this.appUserRepo.getAllAppUsers();
  }

  async getAllAppUsersWithOptions(select: string[]|null = null) {
    return await this.appUserRepo.getAllAppUsersWithOptions(select);
  }

  async findUserByProviderID(
    provider: SocialAuthProviders,
    provider_id: string,
  ) {
    return await this.appUserRepo.findUserByProviderID(provider, provider_id);
  }

  async userExistsByProviderID(
    provider: SocialAuthProviders,
    provider_id: string,
  ) {
    return await this.appUserRepo.userExistsByProviderID(provider, provider_id);
  }

  async getUserProfile(id: string) {
    return await this.appUserRepo.getUserProfile(id);
  }

  async updateName(data: UserUpdate, id: string) {
    const updated = await this.appUserRepo.updateUser(data, id);

    if (!updated) return false;

    return true;
  }

  async updateUsername(data: UserUpdate, id: string) {
    // const usernameExists = await this.appUserRepo.userExistsByUsername(
    //   data.username!,
    //   id,
    // );
    // if (usernameExists)
    //   throw new ValidationException('Username taken! Please try another one.');

    const updated = await this.appUserRepo.updateUser(data, id);

    if (!updated) return false;

    return true;
  }

  async initiatePhoneNoChange(data: UserUpdate, user: AppUserPayload) {
    if (data.phone === user.phone)
      throw new ValidationException(
        'You are already using this phone number!.',
      );

    const taken = await this.appUserRepo.userExistsByPhone(
      data.phone!,
      user.id,
    );
    if (taken)
      throw new ValidationException(
        'Phone number already taken! Please try another one.',
      );

    // const stored = await this.redisService.setRedisData(`${user.id}:new_phone_no`, JSON.stringify(data.phone), 120);
    // if (stored !== 'OK')
    //   throw new CustomException('Something went wrong! Please try again.', 500);

    const stored = this.nodeCacheService.setNodeCacheData(
      `${user.id}:new_phone_no`,
      JSON.stringify(data.phone),
      120,
    );
    if (!stored)
      throw new CustomException('Something went wrong! Please try again.', 500);
    // console.log(this.nodeCacheService.getNodeCacheData(`${user.id}:new_phone_no`));

    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    const verification = await client.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        channel: 'sms',
        to: data.phone!,
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

    return true;
  }

  async confirmChangePhoneNo(otp: string, user: AppUserPayload) {
    // const newPhoneNo = await this.redisService.getRedisData(`${user.id}:new_phone_no`);
    let newPhoneNo = this.nodeCacheService.getNodeCacheData(
      `${user.id}:new_phone_no`,
    ) as string;

    if (!newPhoneNo || newPhoneNo === '')
      throw new UnauthorizedException('OTP timed out. Please try again.');

    newPhoneNo = newPhoneNo.replaceAll("\"", '')

    const verified = await this.authService.verifyOTP(newPhoneNo!, otp);
    if (!verified)
      throw new CustomException(
        'Verification failed! Please resend OTP and try again.',
        500,
      );

    const updateData = { phone: newPhoneNo };

    const updated = await this.appUserRepo.updateUser(updateData, user.id);
    if (!updated)
      throw new CustomException(
        'Verification failed! Please resend OTP and try again.',
        500,
      );

    // await this.redisService.deleteRedisData(`${user.id}:new_phone_no`);
    this.nodeCacheService.deleteNodeCacheData(
      `${user.id}:new_phone_no`,
    ) as unknown as string;

    return true;
  }

  async initiateEmailChange(data: UserUpdate, user: AppUserPayload) {
    if (data.email === user.email)
      throw new ValidationException('You are already using this email!.');

    const taken = await this.appUserRepo.userExistsByEmail(
      data.email!,
      user.id,
    );
    if (taken)
      throw new ValidationException(
        'Email already taken! Please try another one.',
      );

    const stored = this.nodeCacheService.setNodeCacheData(
      `${user.id}:new_email`,
      JSON.stringify(data.email),
      120,
    );
    if (!stored)
      throw new CustomException('Something went wrong! Please try again.', 500);

    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const verificationTemplate = getEnvVar(
      'SENDGRID_EMAIL_VERIFICATION_OTP_TEMPLATE',
    );
    const fromEmail = getEnvVar('SENDGRID_EMAIL_VERIFICATION_OTP_FROM_EMAIL');
    const fromName = getEnvVar('SENDGRID_EMAIL_VERIFICATION_OTP_FROM_NAME');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    const username = user.username
      ? user.username
      : user.name
        ? user.name
        : 'HomeRun User';

    const verification = await client.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        channel: 'email',
        channelConfiguration: {
          template_id: verificationTemplate,
          from: fromEmail,
          from_name: fromName,
          substitutions: {
            username: username,
          },
        },
        to: data.email!,
      });
    // const verification = { status: 'pending', valid: true }

    if (
      verification.status &&
      verification.status !== 'pending' &&
      !verification.valid
    )
      throw new CustomException(
        'Failed to generate OPT. Please try again.',
        500,
      );

    return true;
  }

  async confirmChangeEmail(otp: string, user: AppUserPayload) {
    let newEmail = this.nodeCacheService.getNodeCacheData(
      `${user.id}:new_email`,
    ) as string;

    if (!newEmail || newEmail === '')
      throw new UnauthorizedException('OTP timed out. Please try again.');

    newEmail = newEmail.replaceAll("\"", '')

    // const verified = await this.authService.verifyOTP(newEmail, otp);
    // console.log('verify status', verified);

    // if (!verified)
    //   throw new CustomException(
    //     'Verification failed! Please resend OTP and try again.',
    //     500,
    //   );

    const verifyResponse = this.verificationCheckEmail(newEmail, otp);

    // console.log('verifyResponse', verifyResponse);

    if(verifyResponse === 'approved') {
      const updateData = { email: newEmail };

      const updated = await this.appUserRepo.updateUser(updateData, user.id);
      if (!updated)
        throw new CustomException(
          'Verification failed! Please resend OTP and try again.',
          500,
        );

      this.nodeCacheService.deleteNodeCacheData(
        `${user.id}:new_email`,
      ) as unknown as string;

      return true;
    } else {
      return false
    }
  }

  async initiateWhatsappNoChange(data: UserUpdate, user: AppUserPayload) {
    if (data.whatsapp_no === user.whatsapp_no)
      throw new ValidationException(
        'You are already using this whatsapp number!.',
      );

    const taken = await this.appUserRepo.userExistsByWhatsapp(
      data.whatsapp_no!,
      user.id,
    );
    if (taken)
      throw new ValidationException(
        'WhatsApp number already taken! Please try another one.',
      );

    // const stored = await this.redisService.setRedisData(`${user.id}:new_whatsapp_no`, JSON.stringify(data.whatsapp_no), 120);
    // if (stored !== 'OK')
    //   throw new CustomException('Something went wrong! Please try again.', 500);

    const stored = this.nodeCacheService.setNodeCacheData(
      `${user.id}:new_whatsapp_no`,
      JSON.stringify(data.whatsapp_no),
      120,
    );
    if (!stored)
      throw new CustomException('Something went wrong! Please try again.', 500);
    // console.log(this.nodeCacheService.getNodeCacheData(`${user.id}:new_whatsapp_no`));

    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
    const client = twilio(twilioAccountSid, twilioAuthToken);

    const verification = await client.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        channel: 'whatsapp',
        to: data.whatsapp_no!,
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

    return true;
  }

  async confirmChangeWhatsappNo(otp: string, user: AppUserPayload) {
    // const newWhatsAppNo = await this.redisService.getRedisData(`${user.id}:new_whatsapp_no`);
    let newWhatsAppNo = this.nodeCacheService.getNodeCacheData(
      `${user.id}:new_whatsapp_no`,
    ) as string;

    if (!newWhatsAppNo || newWhatsAppNo === '')
      throw new UnauthorizedException('OTP timed out. Please try again.');

    newWhatsAppNo = newWhatsAppNo.replaceAll("\"", '')

    const verified = await this.authService.verifyOTP(newWhatsAppNo!, otp);
    if (!verified)
      throw new CustomException(
        'Verification failed! Please resend OTP and try again.',
        500,
      );

    const updateData = { whatsapp_no: JSON.parse(newWhatsAppNo) };

    const updated = await this.appUserRepo.updateUser(updateData, user.id);
    if (!updated)
      throw new CustomException(
        'Verification failed! Please resend OTP and try again.',
        500,
      );

    // await this.redisService.deleteRedisData(`${user.id}:new_whatsapp_no`);
    this.nodeCacheService.deleteNodeCacheData(
      `${user.id}:new_whatsapp_no`,
    ) as unknown as string;

    return true;
  }

  async updateAppUser(data: UserUpdate, id: string) {
    const updated = await this.appUserRepo.updateUser(data, id);

    if (!updated) return false;

    return true;
  }

  async getMongoUser(email: string) {
    return await this.userMongoRepo.getUser(email);
  }

  async createMongoUser(email: string, name: string) {
    const user = mapToMongoUser(email, name);
    await this.userMongoRepo.createUser(user);
  }

  async confirmAccountWipeout(id: string, reason: string, transaction?: Transaction) {
    const appUser = await this.appUserRepo.findUserById(id);

    if (!appUser)
      throw new NotFoundException('User not found.')

    const updateData = {
        name: null,
        email: null,
        phone: null,
        whatsapp_no: null,
        providers: [],
        google_id: null,
        facebook_id: null,
        apple_id: null,
        profile_image_url: null,
        avatar_url: null,
        status: AppUserStatus.DELETED,
        square_customer_id: null,
        deleted_at: datetimeYMDHis(),
        reason_for_delete: reason,
    }
    await this.appUserRepo.updateUser(updateData, appUser.id, transaction);

    return {
      status: 200,
      message: 'User removed successfully.',
    };
  }

  verificationCheckEmail(to: string, code: string) {
    const twilioVerifyServiceSid = getEnvVar('TWILIO_VERIFY_SERVICE_SID');
    const twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');

    // Define the curl command
    const curlCommand = `curl -s -X POST "https://verify.twilio.com/v2/Services/${twilioVerifyServiceSid}/VerificationCheck" --data-urlencode "To=${to}" --data-urlencode "Code=${code}" -u ${twilioAccountSid}:${twilioAuthToken}`;
    // Execute the curl command
    try {
      // Execute the curl command synchronously
      const response = execSync(curlCommand, { encoding: 'utf-8' });  // Returns stdout as a string
      console.log(`Response: ${response}`);
      const jsonResponse = JSON.parse(response);
      return jsonResponse.status;
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new CustomException('Verification Failed', 500);
    }
  }

  async invalidateAllAppUserTokens() {
    try {
      const response = this.appUserRepo.invalidateAllAppUserTokens()
      return response;
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new CustomException('Verification Failed', 500);
    }
  }
}
