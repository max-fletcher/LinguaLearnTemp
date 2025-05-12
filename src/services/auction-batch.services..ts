import mongoose from 'mongoose';
import { AuctionBatchMongoRepository } from '../db/nosql/repository/auction-batch.repository';

export class AuctionBatchService {
  private auctionBatchMongoRepo: AuctionBatchMongoRepository;

  constructor() {
    this.auctionBatchMongoRepo = new AuctionBatchMongoRepository();
  }

  async getAuctionByUniqueId(uniqueId: string) {
    return await this.auctionBatchMongoRepo.getAuctionBatchByUniqueId(uniqueId);
  }

  async getAuctionsByUniqueIds(uniqueIds: string[], select: string | null) {
    return await this.auctionBatchMongoRepo.getAuctionBatchesByUniqueIds(
      uniqueIds,
      select,
    );
  }

  async auctionExistsByUniqueId(uniqueId: string) {
    return await this.auctionBatchMongoRepo.auctionBatchExistsByUniqueId(
      uniqueId,
    );
  }

  async getUserAuctionBatchesByAuctionIds(
    userId: string,
    auctionIds: mongoose.Types.ObjectId[],
    select: string | null = null,
  ) {
    return await this.auctionBatchMongoRepo.getUserAuctionBatchesByAuctionIds(
      userId,
      auctionIds,
      select,
    );
  }
}
