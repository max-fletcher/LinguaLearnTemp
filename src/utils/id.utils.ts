import ShortUniqueId from 'short-unique-id';

const generateId = () => {
  const uId = new ShortUniqueId({ length: 10 });
  const id = uId.rnd();
  return id;
};

export function generateCurrencyId() {
  return `cur_${generateId()}`;
}

export function generateUserId() {
  return `usr_${generateId()}`;
}

export function generateAppUserTokenId() {
  return `apt_${generateId()}`;
}

export function createAdminUserId() {
  return `adm_${generateId()}`;
}

export function createTierId() {
  return `tier_${generateId()}`;
}

export function createUserBalanceId() {
  return `usrb_${generateId()}`;
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateProfessionalExpId() {
  return `exp_${generateId()}`;
}

export function generateProfessionalId() {
  return `pro_${generateId()}`;
}

export function generatePayoutRequestId() {
  return `payreq_${generateId()}`;
}

export function generateTransactionId() {
  return `tx_${generateId()}`;
}

export function generateCashBalanceHistoryId() {
  return `cbh_${generateId()}`;
}

export function generateSCBalanceHistoryId() {
  return `scbh_${generateId()}`;
}

export function generateUserTierStatusId() {
  return `uts_${generateId()}`;
}

export function generateEduContentId() {
  return `educ_${generateId()}`;
}

export function generateEduContentFileId() {
  return `ecf_${generateId()}`;
}

export function generateEduContentPurcahseId() {
  return `edcp_${generateId()}`;
}

export function generateAuctionId() {
  return `auc_${generateId()}`;
}

export function generateExpertiseId() {
  return `expr_${generateId()}`;
}

export function generateVerificationCodeId() {
  return `vc_${generateId()}`;
}

export function generateNotificationId() {
  return `ntf_${generateId()}`;
}

export function generateSCTransactionHistoryId() {
  return `sct_${generateId()}`;
}

export function generateDiscountId() {
  return `dis_${generateId()}`;
}

export function generateFCMTokenId() {
  return `fcm_${generateId()}`;
}
