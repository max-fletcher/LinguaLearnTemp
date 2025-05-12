import mongoose, { Schema } from 'mongoose';
import { TBatch } from '../../../types/batch.type';

const batchSchema = new Schema<TBatch>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    auction: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Auction',
    },
    auction_batches: {
      type: [mongoose.Schema.ObjectId],
      required: false,
      ref: 'AuctionBatch',
    },
    batch_no: {
      type: Number,
      required: true,
      min: 0,
    },
    jackpot_awarded: {
      type: Number,
      required: true,
      min: 0,
    },
    participants: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isFull: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const BatchModel = mongoose.model<TBatch>('Batch', batchSchema);

export default BatchModel;
