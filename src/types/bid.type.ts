import mongoose, { MergeType } from 'mongoose';
import { AppUserBasicInfo } from './app.user.type';
import { TAuctionBatch } from './auction-batch.type';
import { TGetAuction } from './auction.type';
import { TGetBatch } from './batch.type';

export type TBid = {
  uniqueId: string;
  auction_batch_id: mongoose.Types.ObjectId;
  bid_amount: number;
  is_active: boolean;
  won: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TPlacedBidForFormatting = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  auction_batch_id: mongoose.Types.ObjectId;
  bid_amount: number;
  is_active: boolean;
  won: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TFormattedPlacedBid = {
  id: string;
  replaceUniqueId? : string
  uniqueId: string;
  bid_amount: number;
  createdAt: string;
  won: boolean;
  app_user: AppUserBasicInfo
};

export type TActiveBidsForViewBidsForFormatting = {
  _id: string
  uniqueId: string
  auction_batch_id: {
    _id: string
    uniqueId: string
    user_id: string
  },
  bid_amount: number
  is_active: boolean
  won: boolean
  createdAt: string
};

export type TBidWithAuctionBatch = TBid & {
  auction_batch_id: MergeType<TAuctionBatch , {
    auction: TGetAuction,
    batch: TGetBatch
  }>
};