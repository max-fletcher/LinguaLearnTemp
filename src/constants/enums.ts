export enum AppUserVerificationStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  BANNED = 'BANNED',
}

export const APP_USER_VERIFICATION_STATUSES = [
  AppUserVerificationStatus.VERIFIED,
  AppUserVerificationStatus.UNVERIFIED,
  AppUserVerificationStatus.BANNED,
] as const;

export enum Languages {
  ENGLISH = 'ENGLISH',
  BANGLA = 'BANGLA',
  FRENCH = 'FRENCH',
  SPANISH = 'SPANISH',
}

export const LANGUAGES = [
  Languages.ENGLISH,
  Languages.BANGLA,
  Languages.FRENCH,
  Languages.SPANISH,
] as const;

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export const DIFFICULTIES = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.ADVANCED,
] as const;

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export const PROFICIENCY_LEVELS = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.ADVANCED,
] as const;