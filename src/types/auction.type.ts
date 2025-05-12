import mongoose from 'mongoose';
import { AUCTION_PROPERTY_CONDITION_TYPES } from '../constants/enums';

export type TPropertyDetails = {
  key: string;
  value: string;
  icon: string;
};

export type TGetAuction = {
  _id: mongoose.Types.ObjectId;
  uniqueId?: string;
  currency_id: string;
  admin_user_id: string;
  batches: mongoose.Types.ObjectId[] | [];
  title: string;
  address: string;
  description: string | null;
  condition: (typeof AUCTION_PROPERTY_CONDITION_TYPES)[number];
  build_year: number;
  property_details: TPropertyDetails[] | null;
  map_coordinates: string[] | null;
  entry_coins: number;
  jackpot: number;
  actual_price: number | null;
  starting_bid: number;
  auction_start_datetime: Date | null;
  auction_end_datetime: Date | null;
  game_start_datetime: Date;
  game_end_datetime: Date;
  max_participants: number;
  resolved: Date | null;
  image_url: string | null;
  link_url: string | null;
  is_featured: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TAuction = {
  uniqueId?: string;
  currency_id: string;
  admin_user_id: string;
  batches: mongoose.Types.ObjectId[] | [];
  title: string;
  address: string;
  description: string | null;
  condition: (typeof AUCTION_PROPERTY_CONDITION_TYPES)[number];
  build_year: number;
  property_details: TPropertyDetails[] | null;
  map_coordinates: string[] | null;
  entry_coins: number;
  jackpot: number;
  actual_price: number | null;
  starting_bid: number;
  auction_start_datetime: Date | null;
  auction_end_datetime: Date | null;
  game_start_datetime: Date;
  game_end_datetime: Date;
  max_participants: number;
  resolved: Date | null;
  image_url: string | null;
  link_url: string | null;
  is_featured: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TUpdateAuction = {
  uniqueId?: string;
  currency_id?: string;
  admin_user_id?: string;
  batches: mongoose.Types.ObjectId[] | [];
  title?: string;
  address?: string;
  description?: string | null;
  condition?: (typeof AUCTION_PROPERTY_CONDITION_TYPES)[number];
  build_year?: number;
  property_details?: TPropertyDetails[] | null;
  map_coordinates?: string[] | null;
  entry_coins?: number;
  jackpot?: number;
  actual_price?: number | null;
  starting_bid?: number;
  auction_start_datetime?: Date | null;
  auction_end_datetime?: Date | null;
  game_start_datetime?: Date;
  game_end_datetime?: Date;
  max_participants?: number;
  resolved?: Date | null;
  image_url?: string | null;
  link_url?: string | null;
  is_featured?: boolean;
  status?: string | null;
};

export type TSingleAuctionBeforeFormatting = {
  _id: mongoose.Types.ObjectId;
  uniqueId?: string;
  currency_id?: string;
  admin_user_id?: string;
  title?: string;
  address?: string;
  batches: mongoose.Types.ObjectId[] | [];
  description?: string | null;
  condition?: (typeof AUCTION_PROPERTY_CONDITION_TYPES)[number];
  build_year?: number;
  property_details?: TPropertyDetails[] | null;
  map_coordinates?: string[] | null;
  entry_coins?: number;
  jackpot?: number;
  actual_price?: number | null;
  starting_bid?: number;
  auction_start_datetime?: Date | null;
  auction_end_datetime?: Date | null;
  game_start_datetime?: Date;
  game_end_datetime?: Date;
  max_participants?: number;
  resolved?: Date | null;
  image_url?: string | null;
  link_url?: string | null;
  is_featured?: boolean;
  status?: string | null;
};

export type TSingleAuctionFormatted = {
  id: mongoose.Types.ObjectId;
  uniqueId?: string;
  currency_id?: string;
  currency: {
    id: string;
    name: string;
    short_code: string;
  };
  admin_user_id?: string;
  createdBy: {
    id: string;
    name: string;
    username: string | null;
  };
  batches: mongoose.Types.ObjectId[] | [];
  title?: string;
  address?: string;
  description?: string | null;
  condition?: (typeof AUCTION_PROPERTY_CONDITION_TYPES)[number];
  build_year?: number;
  property_details?: TPropertyDetails[] | null;
  longitude: string | null;
  latitude: string | null;
  entry_coins?: number;
  jackpot?: number;
  actual_price?: number | null;
  starting_bid?: number;
  auction_start_datetime?: Date | null;
  auction_end_datetime?: Date | null;
  game_start_datetime?: Date;
  game_end_datetime?: Date;
  max_participants?: number;
  resolved?: Date | null;
  image_url?: string | null;
  link_url?: string | null;
  is_featured?: boolean;
  status?: string | null;
};

export type THomepageAuctionBeforeFormatting = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  currency_id: string;
  title: string;
  address: string;
  entry_coins: number;
  jackpot: number;
  starting_bid: number;
  game_start_datetime: string;
  game_end_datetime: string;
  image_url: string;
  batches: {
    _id: string,
    uniqueId: string,
    batch_no: number,
  }[]
};

export type THomepageAuctionFormatted = {
  id: mongoose.Types.ObjectId;
  uniqueId: string;
  currency: {
    id: string;
    name: string;
    short_code: string;
  };
  title: string;
  address: string;
  entry_coins: number;
  jackpot: number;
  starting_bid: number;
  image_url: string | null;
  game_start_datetime: string;
  game_end_datetime: string;
};
