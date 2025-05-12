import mongoose from 'mongoose';

export type TAuctionWallet = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  title: string;
  address: string;
  entry_coins: number;
  createdAt: string;
};

export type TAuctionBatchWallet = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  user_id: string;
  auction_id: mongoose.Types.ObjectId;
  createdAt: number;
};
