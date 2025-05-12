// export enum UserTypes {
//   SUPERADMIN = 'SUPERADMIN',
//   ADMIN = 'ADMIN',
//   PROFESSIONAL = 'PROFESSIONAL',
//   INFLUENCER = 'INFLUENCER',
//   USER = 'USER',
//   DEFAULT = 'DEFAULT',
// }

// export const EXPECTED_USER_TYPES = [
//   UserTypes.SUPERADMIN,
//   UserTypes.ADMIN,
//   UserTypes.PROFESSIONAL,
//   UserTypes.INFLUENCER,
// ] as const;

// export enum UserStatus {
//   VERIFIED = 'VERIFIED',
//   UNVERIFIED = 'UNVERIFIED',
//   PENDING = 'PENDING',
//   BANNED = 'BANNED',
// }

// export const EXPECTED_USER_STATUS = [
//   UserStatus.VERIFIED,
//   UserStatus.UNVERIFIED,
//   UserStatus.PENDING,
//   UserStatus.BANNED,
// ] as const;

export enum RateTypes {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum AuthProviders {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  X = 'X',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

export enum AppUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

export enum TransactionTypes {
  CONTENT_PURCHASE = 'CONTENT_PURCHASE',
  TIER_PURCHASE = 'TIER_PURCHASE',
  PAYOUT = 'PAYOUT',
  REWARD = 'REWARD',
  COMMISION = 'COMMISION',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TransactionPaymentMethodTypes {
  CREDIT_CARD = 'CREDIT_CARD',
  APPLE_PAY = 'APPLE_PAY',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const EXPECTED_PAYOUT_STATUS = [
  PayoutStatus.APPROVED,
  PayoutStatus.PENDING,
  PayoutStatus.REJECTED,
] as const;

export enum CashBalanceHistoryReasonTypes {
  EDU_CONTENT_PURCHASE = 'EDU_CONTENT_PURCHASE',
  TIER_PURCHASE = 'TIER_PURCHASE',
  PAYOUT = 'PAYOUT',
}

export const CASH_BALANCE_HISTORY_REASONS = [
  CashBalanceHistoryReasonTypes.EDU_CONTENT_PURCHASE,
  CashBalanceHistoryReasonTypes.TIER_PURCHASE,
  CashBalanceHistoryReasonTypes.PAYOUT,
] as const;

export enum SCTransactionHistoryReasonTypes {
  EDU_CONTENT_PURCHASE = 'EDU_CONTENT_PURCHASE',
  TIER_PURCHASE = 'TIER_PURCHASE',
  JOIN_AUCTION = 'JOIN_AUCTION',
  WON_FROM_AUCTION = 'WON_FROM_AUCTION',
  REFUND_FROM_AUCTION = 'REFUND_FROM_AUCTION',
}

export const SC_TRANSACTION_HISTORY_REASONS = [
  SCTransactionHistoryReasonTypes.EDU_CONTENT_PURCHASE,
  SCTransactionHistoryReasonTypes.TIER_PURCHASE,
  SCTransactionHistoryReasonTypes.JOIN_AUCTION,
  SCTransactionHistoryReasonTypes.WON_FROM_AUCTION,
  SCTransactionHistoryReasonTypes.REFUND_FROM_AUCTION,
] as const;

// MONGO TYPES
export enum EduContentCategories {
  NONPREMIUM = 'NONPREMIUM',
  PREMIUM = 'PREMIUM',
}

export const EDU_CONTENT_CATEGORY_TYPES = [
  EduContentCategories.NONPREMIUM,
  EduContentCategories.PREMIUM,
] as const;

// OLD. REMOVE LATER.
export enum EduContentCategoriesOld {
  CONTENT = 'CONTENT',
  ANALYTICS = 'ANALYTICS',
  PREMIUM = 'PREMIUM',
}

export const EDU_CONTENT_CATEGORY_TYPES_OLD = [
  EduContentCategoriesOld.CONTENT,
  EduContentCategoriesOld.ANALYTICS,
  EduContentCategoriesOld.PREMIUM,
] as const;
// END OLD. REMOVE LATER.

export enum EduContentCTypes {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
}

export const EDU_CONTENT_C_TYPES = [
  EduContentCTypes.TEXT,
  EduContentCTypes.VIDEO,
] as const;

export enum EduContentAccessLevel {
  CONTENT = 'CONTENT',
  ANALYTICS = 'ANALYTICS',
  LIBRARY = 'LIBRARY',
  VAULT = 'VAULT',
}

export const EDU_CONTENT_ACCESS_LEVEL_TYPES = [
  EduContentAccessLevel.CONTENT,
  EduContentAccessLevel.ANALYTICS,
  EduContentAccessLevel.LIBRARY,
  EduContentAccessLevel.VAULT,
] as const;

export enum EduContentStatus {
  REQUEST_APPROVAL = 'REQUEST_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const EDU_CONTENT_STATUS = [
  EduContentStatus.REQUEST_APPROVAL,
  EduContentStatus.APPROVED,
  EduContentStatus.REJECTED,
] as const;

export enum EduContentSubmenu {
  FOR_ME = 'FOR_ME',
  LIBRARY = 'LIBRARY',
  VAULT = 'VAULT',
  PURCHASED = 'PURCHASED',
}

export const EDU_CONTENT_SUBMENU_TYPES = [
  EduContentSubmenu.FOR_ME,
  EduContentSubmenu.LIBRARY,
  EduContentSubmenu.VAULT,
  EduContentSubmenu.PURCHASED,
] as const;

export enum EduContentSearchCTypes {
  ALL = 'ALL',
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
}

export const EDU_CONTENT_SEARCH_C_TYPES = [
  EduContentSearchCTypes.ALL,
  EduContentSearchCTypes.TEXT,
  EduContentSearchCTypes.VIDEO,
] as const;

export enum ProConnectReqStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export const PRO_CONNECT_REQ_STATUS = [
  ProConnectReqStatus.PENDING,
  ProConnectReqStatus.ACCEPTED,
] as const;

export enum AuctionPropertyConditions {
  C1 = 'C1',
  C2 = 'C2',
  C3 = 'C3',
  C4 = 'C4',
  C5 = 'C5',
  C6 = 'C6',
}

export const AUCTION_PROPERTY_CONDITION_TYPES = [
  AuctionPropertyConditions.C1,
  AuctionPropertyConditions.C2,
  AuctionPropertyConditions.C3,
  AuctionPropertyConditions.C4,
  AuctionPropertyConditions.C5,
  AuctionPropertyConditions.C6,
] as const;

export enum stripePaymentType {
  TierSubscription = 'TierSubscription',
  EduContentPurchase = 'EduContentPurchase',
}

export enum BlogStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
}

export const BLOG_STATUS = [
  BlogStatus.PUBLISHED,
  BlogStatus.DRAFT,
  BlogStatus.PENDING,
  BlogStatus.INACTIVE,
] as const;

export enum ForumStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export const FORUM_STATUS = [
  ForumStatus.PUBLISHED,
  ForumStatus.PENDING,
  ForumStatus.REJECTED,
] as const;

export enum AuctionStatusType {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  PENDING = 'PENDING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export const AUCTION_STATUS_TYPES = [
  AuctionStatusType.UPCOMING,
  AuctionStatusType.ONGOING,
  AuctionStatusType.PENDING,
  AuctionStatusType.ENDED,
  AuctionStatusType.CANCELLED,
] as const;

export enum DiscountStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export const DISCOUNT_STATUS = [
  DiscountStatus.PENDING,
  DiscountStatus.PUBLISHED,
  DiscountStatus.EXPIRED,
  DiscountStatus.REJECTED,
  DiscountStatus.INACTIVE,
] as const;

export const DISCOUNT_TYPES = [
  DiscountType.PERCENTAGE,
  DiscountType.FIXED,
] as const;

export enum ResendOTPChannel {
  PHONE = 'phone',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
}

export const RESEND_OTP_CHANNEL = [
  ResendOTPChannel.PHONE,
  ResendOTPChannel.EMAIL,
  ResendOTPChannel.WHATSAPP,
] as const;

export enum NotificationSearchCategories {
  ALL = 'ALL',
  UNSEEN = 'UNSEEN',
}

export const NOTIFICATION_SEARCH_CATEGORIES = [
  NotificationSearchCategories.ALL,
  NotificationSearchCategories.UNSEEN,
] as const;

export enum NotificationUserType {
  APPUSER = 'APPUSER',
  ADMIN = 'ADMIN',
}

export enum NotificationIcons {
  TROPHY = 'TROPHY',
  BELL = 'BELL',
  GAVEL = 'GAVEL',
  BOOK = 'BOOK',
  CROWN = 'CROWN',
  TRANSACTION = 'TRANSACTION',
  COIN = 'COIN',
}

export const NOTIFICATION_ICONS = [
  NotificationIcons.TROPHY,
  NotificationIcons.BELL,
  NotificationIcons.GAVEL,
  NotificationIcons.BOOK,
  NotificationIcons.CROWN,
  NotificationIcons.TRANSACTION,
  NotificationIcons.COIN,
] as const;