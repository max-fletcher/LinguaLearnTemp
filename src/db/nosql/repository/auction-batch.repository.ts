import mongoose from 'mongoose';
import AuctionBatchModel from '../model/auction-batch.model';

export class AuctionBatchMongoRepository {
  async getAuctionBatchByUniqueId(
    uniqueId: string,
    select: string | null = null,
  ) {
    if (select)
      return await AuctionBatchModel.findOne({ uniqueId: uniqueId })
        .select(select)
        .lean();

    return await AuctionBatchModel.findOne({ uniqueId: uniqueId }).lean();
  }

  async getAuctionBatchesByUniqueIds(
    uniqueIds: string[],
    select: string | null = null,
  ) {
    if (select)
      return await AuctionBatchModel.find({ uniqueId: { $in: uniqueIds } })
        .select(select)
        .lean();

    return await AuctionBatchModel.find({
      uniqueId: { $in: uniqueIds },
    }).lean();
  }

  async auctionBatchExistsByUniqueId(uniqueId: string) {
    return await AuctionBatchModel.exists({ uniqueId: uniqueId }).lean();
  }

  async getUserAuctionBatchesByAuctionIds(
    userId: string,
    auctionIds: mongoose.Types.ObjectId[],
    select: string | null = null,
  ) {
    if (select)
      return await AuctionBatchModel.find({
        user_id: userId,
        auction: { $in: auctionIds },
      })
        .select(select)
        .lean();

    return await AuctionBatchModel.find({
      user_id: userId,
      auction: { $in: auctionIds },
    }).lean();
  }
}
