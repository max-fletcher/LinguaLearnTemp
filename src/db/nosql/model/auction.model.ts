import {
  AUCTION_PROPERTY_CONDITION_TYPES,
  AUCTION_STATUS_TYPES,
  AuctionStatusType,
} from '../../../constants/enums';
import mongoose, { Schema } from 'mongoose';
import { TAuction, TPropertyDetails } from '../../../types/auction.type';

const PropertyDetailsSchema = new Schema<TPropertyDetails>({
  key: String,
  value: String,
  icon: String,
});

const auctionSchema = new Schema<TAuction>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    currency_id: {
      type: String,
      required: true,
    },
    admin_user_id: {
      type: String,
      required: true,
    },
    batches: {
      type: [mongoose.Schema.ObjectId],
      required: false,
      ref: 'Batch',
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    condition: {
      type: String,
      enum: AUCTION_PROPERTY_CONDITION_TYPES,
      required: true,
    },
    build_year: {
      type: Number,
      required: true,
    },
    property_details: {
      type: [PropertyDetailsSchema],
      required: false,
    },
    map_coordinates: {
      type: [String],
      required: false,
    },
    entry_coins: {
      type: Number,
      required: true,
      min: 0,
    },
    jackpot: {
      type: Number,
      required: true,
      min: 0,
    },
    actual_price: {
      type: Number,
      required: true,
      min: 0,
    },
    starting_bid: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    auction_start_datetime: {
      type: Date,
      required: false,
    },
    auction_end_datetime: {
      type: Date,
      required: false,
    },
    game_start_datetime: {
      type: Date,
      required: true,
    },
    game_end_datetime: {
      type: Date,
      required: true,
    },
    max_participants: {
      type: Number,
      required: true,
      min: 2,
    },
    resolved: {
      type: Date,
      required: false,
      default: null,
    },
    image_url: {
      type: String,
      required: false,
    },
    link_url: {
      type: String,
      required: false,
    },
    is_featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: AUCTION_STATUS_TYPES,
      required: true,
      default: AuctionStatusType.UPCOMING,
    },
  },
  { timestamps: true },
);

const AuctionModel = mongoose.model<TAuction>('Auction', auctionSchema);

export default AuctionModel;
