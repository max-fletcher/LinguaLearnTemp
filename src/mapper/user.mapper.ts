import {
  UserMongo,
  User,
  UserWithTimeStamps,
  // UserProviders,
  AppUserGenerateToken,
} from '../types/app.user.type';
import { 
  AppUserStatus, 
  // RegistrationMethod
} from '../constants/enums';

export function mapToUserModel(
  id: string,
  name: string | null,
  username: string | null,
  email: string | null,
  password: string | null,
  phone: string,
  whatsapp_no: string | null,
  otp: string | null,
  otp_expires_at: string | null,
  providers: UserProviders,
  google_id: string | null,
  facebook_id: string | null,
  apple_id: string | null,
  profile_image_url: string | null,
  avatar_url: string | null,
  country: string | null,
  currency_id: string | null,
  status: string | null,
  verified: boolean | null,
  guest: boolean | null,
  // stripe_customer_id: string | null,
  square_customer_id: string | null,
  card_id: string | null,
  notifications: string,
  disable_notifications_till: string | null,
  deleted_at: string | null,
  reason_for_delete: string | null,
  registration_method: string | null,
): User {
  return {
    id: id,
    name: name ? name : null,
    username: username ? username : null,
    email: email ? email : null,
    password: password ? password : null,
    phone: phone,
    whatsapp_no: whatsapp_no ? whatsapp_no : null,
    otp: otp ? otp : null,
    otp_expires_at: otp_expires_at ? otp_expires_at : null,
    providers: providers,
    google_id: google_id ? google_id : null,
    facebook_id: facebook_id ? facebook_id : null,
    apple_id: apple_id ? apple_id : null,
    profile_image_url: profile_image_url ? profile_image_url : null,
    avatar_url: avatar_url ? avatar_url : null,
    country: country ? country : null,
    currency_id: currency_id,
    status: status ? status : AppUserStatus.ACTIVE,
    verified: verified ? verified : false,
    guest: guest ? guest : true,
    // stripe_customer_id: stripe_customer_id ? stripe_customer_id : null,
    square_customer_id: square_customer_id ? square_customer_id : null,
    card_id: card_id ? card_id : null,
    notifications: notifications,
    disable_notifications_till: disable_notifications_till ?? null,
    deleted_at: deleted_at ?? null,
    reason_for_delete: reason_for_delete ?? null,
    registration_method: registration_method ?? RegistrationMethod.PHONE,
  };
}

export function mapToAppUserAuthResponse(
  id: string,
  name: string | null,
  username: string | null,
  email: string | null,
  phone: string,
  whatsapp_no: string | null,
  avatar_url: string | null,
  country: string | null,
  currency_id: string | null,
  status: string | null,
  verified: boolean | null,
  guest: boolean | null,
  createdAt?: string,
): UserWithTimeStamps {
  return {
    id: id,
    name: name ? name : null,
    username: username ? username : null,
    email: email ? email : null,
    phone: phone,
    whatsapp_no: whatsapp_no ? whatsapp_no : null,
    avatar_url: avatar_url ? avatar_url : null,
    country: country ? country : null,
    currency_id: currency_id,
    status: status ? status : AppUserStatus.ACTIVE,
    verified: verified ? verified : false,
    guest: guest ? guest : true,
    createdAt: createdAt,
  };
}

export function mapAppUserGenerateToken(
  id: string,
  phone_number: string,
  name: string | null,
  email: string | null,
  avatarUrl: string | null
): AppUserGenerateToken {
  return {
    id: id,
    phone_number: phone_number,
    name: name ? name : null,
    email: email ? email : null,
    avatarUrl: avatarUrl ? avatarUrl : null,
  };
}

export function mapToMongoUser(email: string, name: string): UserMongo {
  return {
    email: email,
    name: name,
  };
}
