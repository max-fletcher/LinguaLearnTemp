import { AppUserNotificationOptions } from '../constants/enums';
import { UserProfileResponse } from '../types/app-user.type';
import { TActiveTiersStatusesWithTiers } from '../types/tier.type';
import { roundTo2DP } from '../utils/number.utils';

export function formatAppUserProfile(data: any): UserProfileResponse {
  let completion: any = 0;
  const totalFields = 5;
  if (data.name) completion++;
  if (data.username) completion++;
  if (data.email) completion++;
  if (data.phone) completion++;
  if (data.avatar_url) completion++;

  completion = +((completion / totalFields) * 100).toFixed(2);

  let active_tiers = data.tier_statuses.map((tier_status: TActiveTiersStatusesWithTiers) => {
    return {
      id: tier_status.tier.id,
      name: tier_status.tier.name,
    }
  })

  active_tiers = active_tiers.filter((obj: TActiveTiersStatusesWithTiers, index: number, arr: TActiveTiersStatusesWithTiers[]) =>
    arr.findIndex(item => JSON.stringify(item) === JSON.stringify(obj)) === index);

  const currentDatetime = new Date();
  const notificationStatuses = [AppUserNotificationOptions['1HR'], AppUserNotificationOptions['8HR'], AppUserNotificationOptions['24HR']]

  const formattedData = {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    whatsapp_no: data.whatsapp_no,
    profile_image_url: data.profile_image_url,
    avatar_url: data.avatar_url,
    country: data.country,
    currency: data.currency.short_code,
    profile_completion: completion,
    notifications_active: data.notifications === AppUserNotificationOptions.ON || (notificationStatuses.includes(data.notifications) && currentDatetime > new Date(data.disable_notifications_till)) ? true : false,
    registration_method: data.registration_method,
    balance: {
      cash_balance: roundTo2DP(Number(data.app_user_balance.cash_balance)),
      coin_balance: Number(data.app_user_balance.coin_balance),
      exp_date: data.app_user_balance.exp_date,
    },
    device_lists: data.firebase_devices,
    tier:
      data.tier_statuses.length === 0
        ? null
        : {
            id: data.tier_statuses[0].tier.id,
            name: data.tier_statuses[0].tier.name,
          },
    active_tiers: data.tier_statuses.length === 0 ? [] : active_tiers,
  };

  return formattedData;
}

export function formatLoginAppUserData(data: any): UserProfileResponse {
  let active_tiers = data.tier_statuses.map((tier_status: TActiveTiersStatusesWithTiers) => {
    return {
      id: tier_status.tier.id,
      name: tier_status.tier.name,
    }
  })
  active_tiers = active_tiers.filter((obj: TActiveTiersStatusesWithTiers, index: number, arr: TActiveTiersStatusesWithTiers[]) =>
    arr.findIndex(item => JSON.stringify(item) === JSON.stringify(obj)) === index);

  const currentDatetime = new Date();
  const notificationStatuses = [AppUserNotificationOptions['1HR'], AppUserNotificationOptions['8HR'], AppUserNotificationOptions['24HR']]

  const formattedData = {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    whatsapp_no: data.whatsapp_no,
    country: data.country,
    currency: data.currency.short_code,
    profile_image_url: data.profile_image_url,
    avatar_url: data.avatar_url,
    status: data.status,
    verified: data.verified,
    guest: data.guest,
    createdAt: data.createdAt,
    notifications_active: data.notifications === AppUserNotificationOptions.ON || (notificationStatuses.includes(data.notifications) && currentDatetime > new Date(data.disable_notifications_till)) ? true : false,
    registration_method: data.registration_method,
    balance: {
      cash_balance: roundTo2DP(Number(data.app_user_balance.cash_balance)),
      coin_balance: Number(data.app_user_balance.coin_balance),
      exp_date: data.app_user_balance.exp_date,
    },
    device_lists: data.firebase_devices,
    tier:
      data.tier_statuses.length === 0
        ? null
        : {
            id: data.tier_statuses[0].tier.id,
            name: data.tier_statuses[0].tier.name,
          },

    active_tiers: data.tier_statuses.length === 0 ? [] : active_tiers,
  };

  return formattedData;
}
