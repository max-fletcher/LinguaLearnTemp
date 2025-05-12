import mongoose from "mongoose"

export type TEduContentPurchase = {
  _id?: mongoose.Types.ObjectId
  uniqueId: string
  edu_content_id: mongoose.Types.ObjectId
  user_id: string
  downloaded: boolean
}

export type TCreateEduContentPurchase = {
  _id?: string;
  uniqueId: string;
  edu_content_id: mongoose.Types.ObjectId
  user_id: string;
};

export type TEduContentPurchaseWithTimestamps = {
  _id?: string;
  uniqueId: string;
  edu_content_id: mongoose.Types.ObjectId
  user_id: string;
  downloaded: boolean;
  createdAt: string;
  updatedAt: string;
};

// _id uniqueId admin_user_id is_library is_vault content_type thumbnail_url title currency_id price coins_rewarded duration

export type TFormattedEduContentType = {
  _id?: string;
  uniqueId: string;
  admin_user_id: string;
  is_library: boolean;
  is_vault: boolean;
  content_type: string;
  thumbnail_url: string;
  title: string;
  currency_id: string;
  price: number;
  coins_rewarded: number;
  duration: number;
  createdAt: string;
};

export type TEduContentPurchasedType = {
  _id: string;
  uniqueId: string;
  edu_content_id: TFormattedEduContentType;
  user_id: string;
  createdAt: string;
};
