import mongoose from 'mongoose';
import { TAuction } from './auction.type';
import { TAuctionBatchBids } from './auction-batch.type';

export type TBatch = {
  uniqueId: string;
  auction: mongoose.Types.ObjectId;
  auction_batches: mongoose.Types.ObjectId[] | [];
  batch_no: number;
  jackpot_awarded: number;
  participants: number;
  isFull: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TGetBatch = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  auction: mongoose.Types.ObjectId;
  auction_batches: mongoose.Types.ObjectId[] | [];
  batch_no: number;
  jackpot_awarded: number;
  participants: number;
  isFull: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TBatchParticipants = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  auction: TAuction;
  auction_batches: TAuctionBatchBids[] | [];
  batch_no: number;
  jackpot_awarded: number;
  participants: number;
  isFull: boolean;
  createdAt?: string;
  updatedAt?: string;
}
