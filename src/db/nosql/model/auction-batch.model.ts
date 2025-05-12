import mongoose, { Schema } from 'mongoose';
import { TAuctionBatch } from '../../../types/auction-batch.type';

const auctionBatchSchema = new Schema<TAuctionBatch>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    auction: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Auction',
    },
    batch: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Batch',
    },
    bids: {
      type: [mongoose.Schema.ObjectId],
      required: false,
      ref: 'Bid',
    },
  },
  { timestamps: true },
);

const AuctionBatchModel = mongoose.model<TAuctionBatch>(
  'AuctionBatch',
  auctionBatchSchema,
  'auctionbatches',
);

export default AuctionBatchModel;