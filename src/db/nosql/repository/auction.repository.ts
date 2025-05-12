import { AuctionStatusType } from '../../../constants/enums';
import { TAuction, TUpdateAuction } from '../../../types/auction.type';
import AuctionModel from '../model/auction.model';
import BatchModel from '../model/batch.model';

export class AuctionMongoRepository {
  async getFeaturedAuctionsForHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    const currentDate = new Date();

    if (select) {
      return await AuctionModel.find({
        is_featured: true,
        game_end_datetime: { $gt: currentDate },
        resolved: null,
        status: { $ne: AuctionStatusType.CANCELLED },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(select)
        .populate({
          path: 'batches',
          model: BatchModel,
          select: '_id uniqueId batch_no',
        })
        .lean();
    }

    return await AuctionModel.find({
      is_featured: true,
      game_end_datetime: { $gt: currentDate },
      resolved: null,
      status: { $ne: AuctionStatusType.CANCELLED },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getUpcomingAuctionsForHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    const currentDate = new Date();

    if (select) {
      return await AuctionModel.find({
        game_start_datetime: { $gt: currentDate },
        resolved: null,
        status: { $ne: AuctionStatusType.CANCELLED },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(select)
      .populate({
        path: 'batches',
        model: BatchModel,
        select: '_id uniqueId batch_no',
      })
      .lean();
    }

    return await AuctionModel.find({
      game_start_datetime: { $gt: currentDate },
      resolved: null,
      status: { $ne: AuctionStatusType.CANCELLED },
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  }

  async getAuctionWithBeforeDateAndLimit(
    beforeDate: string | null = null,
    limit: number = 10,
  ) {
    if (beforeDate)
      return await AuctionModel.find({
        createdAt: { $lt: new Date(beforeDate) },
        status: { $ne: AuctionStatusType.CANCELLED },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(
          '_id uniqueId currency_id title address entry_coins jackpot game_start_datetime resolved image_url link_url',
        )
        .lean();

    return await AuctionModel.find({
      status: { $ne: AuctionStatusType.CANCELLED },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        '_id uniqueId currency_id title address entry_coins jackpot game_start_datetime resolved image_url link_url',
      )
      .lean();
  }

  async getAuctionNextCount(
    beforeDate: string | null = null,
    offset: number = 10,
  ) {
    if (beforeDate)
      return await AuctionModel.countDocuments({
        createdAt: { $lt: new Date(beforeDate) },
        status: { $ne: AuctionStatusType.CANCELLED },
      })
        .sort({ createdAt: -1 })
        .skip(offset);

    return await AuctionModel.countDocuments({
      status: { $ne: AuctionStatusType.CANCELLED },
    })
      .sort({ createdAt: -1 })
      .skip(offset);
  }

  async getAuctionByUniqueId(uniqueId: string, select: string | null = null) {
    if (select)
      return await AuctionModel.findOne({ uniqueId: uniqueId })
        .select(select)
        .lean();

    return await AuctionModel.findOne({ uniqueId: uniqueId }).lean();
  }

  async getAuctionsByUniqueIds(
    uniqueIds: string[],
    select: string | null = null,
  ) {
    if (select)
      return await AuctionModel.find({ uniqueId: { $in: uniqueIds } })
        .select(select)
        .lean();

    return await AuctionModel.find({ uniqueId: { $in: uniqueIds } }).lean();
  }

  async auctionExistsByUniqueId(uniqueId: string) {
    return await AuctionModel.exists({ uniqueId: uniqueId }).lean();
  }

  async createAuction(auction: TAuction) {
    return await AuctionModel.create(auction);
  }

  async updateAuction(uniqueId: string, auction: TUpdateAuction) {
    return await AuctionModel.findOneAndUpdate(
      { uniqueId: uniqueId },
      auction,
      { new: true },
    );
  }

  async deleteAuction(uniqueId: string) {
    return await AuctionModel.deleteOne({ uniqueId: uniqueId });
  }
}
