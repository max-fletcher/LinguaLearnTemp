// import {TestModel} from "./test.model"
import { AdminUserModel } from './admin-users.model';
import { UserModel } from './user.model';
// import { CashBalanceHistoryModel } from './cash-balance-histories.model';
// import { CurrencyModel } from './currency.model';
// import { PayoutRequestModel } from './payout-requests.model';
// import { ProfessionalEducationModel } from './professional-education.model';
// import { ProfessionalExperienceModel } from './professional-experience.model';
// import { ProfessionalModel } from './professional.model';
// import { SCTransactionHistoryModel } from './sweep-coin-transaction-history.model';
// import { TiersModel } from './tiers.model';
// import { TransactionModel } from './transactions.model';
// import { UserBalanceModel } from './user-balances.model';
// import { UserTierStatusModel } from './user-tier-status.model';
// import { DiscountsModel } from './discounts.model';
// import FirebaseNotificationsModel from './firebase-notifications';
// import { AppUserTokenModel } from './app-user-tokens.model';

// ADMIN USER ASSOCIATIONS
// AdminUserModel.hasOne(ProfessionalModel, {
//   as: 'professional',
//   foreignKey: 'admin_user_id',
// });
// ProfessionalModel.belongsTo(AdminUserModel, {
//   as: 'admin_user',
//   foreignKey: 'admin_user_id',
// });
// AdminUserModel.hasMany(ProfessionalEducationModel, {
//   as: 'professional_education',
//   foreignKey: 'admin_user_id',
// });
// ProfessionalEducationModel.belongsTo(AdminUserModel, {
//   as: 'admin_user',
//   foreignKey: 'admin_user_id',
// });
// AdminUserModel.hasMany(ProfessionalExperienceModel, {
//   as: 'professional_experience',
//   foreignKey: 'admin_user_id',
// });
// ProfessionalExperienceModel.belongsTo(AdminUserModel, {
//   as: 'admin_user',
//   foreignKey: 'admin_user_id',
// });

// APP USER ASSOCIATIONS
// AppUserModel.hasMany(UserTierStatusModel, {
//   as: 'tier_statuses',
//   foreignKey: 'user_id',
// });
// UserTierStatusModel.belongsTo(AppUserModel, {
//   as: 'user',
//   foreignKey: 'user_id',
// });
// TiersModel.hasMany(UserTierStatusModel, {
//   as: 'tier_statuses',
//   foreignKey: 'tier_id',
// });
// UserTierStatusModel.belongsTo(TiersModel, {
//   as: 'tier',
//   foreignKey: 'tier_id',
// });

// AppUserModel.hasOne(UserBalanceModel, {
//   as: 'app_user_balance',
//   foreignKey: 'user_id',
// });
// UserBalanceModel.belongsTo(AppUserModel, {
//   as: 'app_user',
//   foreignKey: 'user_id',
// });
// AdminUserModel.hasOne(UserBalanceModel, {
//   as: 'admin_balance',
//   foreignKey: 'admin_user_id',
// });
// UserBalanceModel.belongsTo(AdminUserModel, {
//   as: 'admin_user',
//   foreignKey: 'admin_user_id',
// });

// CurrencyModel.hasOne(AppUserModel, { as: 'user', foreignKey: 'currency_id' });
// AppUserModel.belongsTo(CurrencyModel, {
//   as: 'currency',
//   foreignKey: 'currency_id',
// });
// CurrencyModel.hasOne(TransactionModel, {
//   as: 'transaction',
//   foreignKey: 'currency_id',
// });
// TransactionModel.belongsTo(CurrencyModel, {
//   as: 'currency',
//   foreignKey: 'currency_id',
// });
// CurrencyModel.hasOne(PayoutRequestModel, {
//   as: 'payout_request',
//   foreignKey: 'currency_id',
// });
// PayoutRequestModel.belongsTo(CurrencyModel, {
//   as: 'currency',
//   foreignKey: 'currency_id',
// });

// TiersModel.hasMany(CashBalanceHistoryModel, {
//   as: 'cash_balance_histories',
//   foreignKey: 'tier_id',
// });
// CashBalanceHistoryModel.belongsTo(TiersModel, {
//   as: 'tier',
//   foreignKey: 'tier_id',
// });

// TiersModel.hasMany(SCTransactionHistoryModel, {
//   as: 'sc_transaction_histories',
//   foreignKey: 'tier_id',
// });
// SCTransactionHistoryModel.belongsTo(TiersModel, {
//   as: 'tier',
//   foreignKey: 'tier_id',
// });

// // AdminUserModel.hasOne(PayoutRequestModel, {as: 'payout', foreignKey: 'admin_user_id'});
// // PayoutRequestModel.belongsTo(AdminUserModel, {as: 'admin_user', foreignKey: 'admin_user_id'});
// PayoutRequestModel.hasOne(AdminUserModel, {
//   as: 'admin_user',
//   sourceKey: 'admin_user_id',
//   foreignKey: 'id',
// });
// PayoutRequestModel.hasOne(AppUserModel, {
//   as: 'app_user',
//   sourceKey: 'user_id',
//   foreignKey: 'id',
// });

// TransactionModel.hasOne(AdminUserModel, {
//   as: 'admin_user',
//   sourceKey: 'admin_user_id',
//   foreignKey: 'id',
// });
// TransactionModel.belongsTo(AppUserModel, {
//   as: 'app_user',
//   foreignKey: 'user_id',
// });

// DiscountsModel.belongsTo(AdminUserModel, {
//   as: 'admin_user',
//   foreignKey: 'admin_user_id',
// });
// DiscountsModel.belongsTo(TiersModel, {
//   as: 'tier',
//   foreignKey: 'tier_id',
// });

// AppUserModel.hasMany(FirebaseNotificationsModel, {
//   as: 'firebase_devices',
//   foreignKey: 'user_id',
//   sourceKey: 'id',
// });

// AppUserModel.hasOne(AppUserTokenModel, {
//   as: 'app_user_token',
//   foreignKey: 'user_id',
// });
// AppUserTokenModel.belongsTo(AppUserModel, {
//   as: 'app_user',
//   foreignKey: 'user_id',
// });

export {
  UserModel,
  AdminUserModel,
  // CurrencyModel,
  // PayoutRequestModel,
  // ProfessionalEducationModel,
  // ProfessionalExperienceModel,
  // ProfessionalModel,
  // TiersModel,
  // SCTransactionHistoryModel,
  // TransactionModel,
  // UserBalanceModel,
  // UserTierStatusModel,
  // CashBalanceHistoryModel,
};
