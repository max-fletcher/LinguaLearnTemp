import mongoose from 'mongoose';
import {
  EDU_CONTENT_ACCESS_LEVEL_TYPES,
  EDU_CONTENT_C_TYPES,
  EDU_CONTENT_CATEGORY_TYPES,
  EDU_CONTENT_STATUS,
} from '../constants/enums';
import { TEduContentFileData } from './edu-content-files.types';

export type TEducationalContent = {
  _id?: mongoose.Types.ObjectId;
  uniqueId?: string;
  admin_user_id: string;
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order: number;
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url?: string;
  title: string;
  text: string;
  edu_content_files?: mongoose.Types.ObjectId[];
  currency_id: string;
  price: number;
  coins_rewarded: number;
  duration: number;
  status: (typeof EDU_CONTENT_STATUS)[number];
  stripe_product_id: string;
  stripe_price_id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TEducationalContentForFormatting = {
  _id?: mongoose.Types.ObjectId;
  uniqueId: string;
  admin_user_id: string;
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order: number;
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url: string;
  title: string;
  text: string;
  edu_content_files?: mongoose.Types.ObjectId[];
  currency_id: string;
  price: number;
  coins_rewarded: number;
  duration: number;
  status: (typeof EDU_CONTENT_STATUS)[number];
  stripe_product_id: string;
  stripe_price_id: string;
  createdAt: string;
};

export type TEducationalContentWithFiles = {
  uniqueId: string;
  admin_user_id: string;
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order: number;
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url: string;
  title: string;
  text: string;
  edu_content_files?: TEduContentFileData[];
  currency_id: string;
  price: number;
  coins_rewarded: number;
  duration: number;
  status: (typeof EDU_CONTENT_STATUS)[number];
  createdAt?: string;
  updatedAt?: string;
};

export type TUpdateEducationalContent = {
  admin_user_id?: string;
  category?: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order?: number;
  content_type?: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url?: string;
  title?: string;
  text?: string;
  edu_content_files?: mongoose.Types.ObjectId[];
  currency_id?: string;
  price?: number;
  coins_rewarded?: number;
  duration?: number;
  status?: (typeof EDU_CONTENT_STATUS)[number];
  stripe_product_id?: string;
  stripe_price_id?: string;
  edu_content_files_delete?: mongoose.Types.ObjectId[];
};

export type MemoizedEduContentType = {
  [key: string]: {
    _id: string;
    uniqueId: string;
    category: string;
    title: string;
    price: number;
    is_premium: boolean;
    createdAt: string;
  };
};

export type TEduContentPurchaseIntermediate = {
  _id: mongoose.Types.ObjectId;
  uniqueId?: string;
  admin_user_id?: string;
  category?: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order?: number;
  content_type?: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url?: string;
  title?: string;
  text?: string;
  edu_content_files?: TEduContentFileData[];
  currency_id?: string;
  price?: number;
  coins_rewarded?: number;
  duration?: number;
  status?: (typeof EDU_CONTENT_STATUS)[number];
  purchased?: boolean;
  stripe_product_id?: string;
  stripe_price_id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TFormattedEduContentDetails = {
  id: mongoose.Types.ObjectId;
  uniqueId: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  is_library: boolean;
  is_vault: boolean;
  tier: null | {
    id: string;
    name: string;
    order: number;
    price: number;
    duration: number;
    coins_rewarded: number;
    perks: string[] | null;
    exclusive_access: string | null;
    exclusive_perks: string[] | null;
  };
  category: string;
  content_type: string;
  thumbnail_url: string | null;
  title: string;
  text: string;
  currency: string;
  price: number;
  coins_rewarded: number;
  edu_content_files: string | null;
  duration: number;
  purchased: boolean;
  tier_access: boolean;
  validity: string | null;
  createdAt: string;
};

export type TGetAllEducationalContent = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  admin_user_id: string;
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order: number;
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url: string | null;
  title: string;
  edu_content_files: TEduContentFileData[] | null;
  status: (typeof EDU_CONTENT_STATUS)[number];
  createdAt: string;
};

export type TFormattedGetAllEducationalContent = {
  id: string;
  uniqueId: string;
  author: null | {
    id: string;
    name: string;
  };
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  is_library: boolean;
  is_vault: boolean;
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url: string | null;
  title: string;
  edu_content_files: TEduContentFileData | null;
  status: (typeof EDU_CONTENT_STATUS)[number];
  createdAt: string;
};

export type TEducationalContentUpdateResponse = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  admin_user_id: string;
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order: number;
  access_level: (typeof EDU_CONTENT_ACCESS_LEVEL_TYPES)[number];
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  thumbnail_url: string;
  title: string;
  text: string;
  edu_content_files: TEduContentFileData[] | null;
  currency_id: string;
  price: number;
  coins_rewarded: number;
  duration: number;
  stripe_product_id: string;
  stripe_price_id: string;
  status: (typeof EDU_CONTENT_STATUS)[number];
  createdAt: string;
  updatedAt: string;
  __v: string;
};

export type THomepageEducationalContentBeforeFormatting = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  category: (typeof EDU_CONTENT_CATEGORY_TYPES)[number];
  tier_order: number;
  content_type: (typeof EDU_CONTENT_C_TYPES)[number];
  access_level: (typeof EDU_CONTENT_ACCESS_LEVEL_TYPES)[number];
  thumbnail_url: string;
  title: string;
  currency_id: string;
  price: number;
  coins_rewarded: number;
  duration: number;
};

export type THomepageEducationalContentFormatted = {
  id: mongoose.Types.ObjectId;
  uniqueId: string;
  category: string;
  content_type: string;
  access_level: string;
  thumbnail_url: string | null;
  title: string;
  currency?: {
    id: string;
    name: string;
    short_code: string;
  };
  price: number;
  coins_rewarded: number;
  duration: number;
  is_library?: boolean;
  is_vault?: boolean;
  //   purchased: boolean
  //   tier_access: boolean
};
