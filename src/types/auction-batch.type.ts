import mongoose from 'mongoose';
import { TAuction } from './auction.type';
import { TBatch } from './batch.type';
import { TBid } from './bid.type';

export type TAuctionBatch = {
  uniqueId: string;
  user_id: string;
  auction: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  bids: mongoose.Types.ObjectId[];
  createdAt?: string;
  updatedAt?: string;
};

export type MemoizedAuctionType = {
  [key: string]: {
    _id: string;
    uniqueId: string;
    title: string;
    address: string;
    entry_coins: number;
    createdAt: string;
  };
};

export type MemoizedAuctionBatchesType = {
  [key: string]: {
    _id: string;
    uniqueId: string;
    user_id: string;
    auction:
      | string
      | {
          _id: string;
          uniqueId: string;
          title: string;
          address: string;
          entry_coins: number;
          createdAt: string;
        };
    createdAt: string;
  };
};

export type TGetAuctionBatch = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  user_id: string;
  auction: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  bids: mongoose.Types.ObjectId[];
  createdAt?: string;
  updatedAt?: string;
};

export type TAuctionBatchBids = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  user_id: string;
  auction: TAuction;
  batch: TBatch;
  bids: TBid[] | [];
  createdAt?: string;
  updatedAt?: string;
}

export type TAuctionBatchByAuctionIdBatchIdAndUserId = {
  _id: string
  uniqueId: string
  user_id: string
  auction: {
    _id: string
    uniqueId: string
    game_end_datetime: string
    status: string
  },
  batch: string
  bids: mongoose.Types.ObjectId[]
  createdAt: string
};

export type TAuctionBatchGroupChatForFormatting = {
  _id: mongoose.Types.ObjectId
  uniqueId: string
  user_id: string
  auction_id: mongoose.Types.ObjectId
  batch_id: mongoose.Types.ObjectId
  message: string
  file_url: string | null
  createdAt: string
  updatedAt: string
}

export type TAuctionBatchGroupChatFormatted = {
  id: string
  uniqueId: string
  message: string | null
  file_url: string | null
  createdAt: string
  app_user: {
    id: string
    name: string | null
    username: string | null
    avatar_url: string | null
  }
};
