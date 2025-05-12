import { generateAuctionId } from '../utils/id.utils';
import { AuctionMongoRepository } from '../db/nosql/repository/auction.repository';
import { TAuction, TUpdateAuction } from '../types/auction.type';

export class AuctionService {
  private auctionMongoRepo: AuctionMongoRepository;

  constructor() {
    this.auctionMongoRepo = new AuctionMongoRepository();
  }

  async getFeaturedAuctionsForHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    return await this.auctionMongoRepo.getFeaturedAuctionsForHomepageService(
      select,
      limit,
    );
  }

  async getUpcomingAuctionsForHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    return await this.auctionMongoRepo.getUpcomingAuctionsForHomepageService(
      select,
      limit,
    );
  }

  async getInfScrollAuctionService(
    oldestAuctionId: string,
    limit: number = 10,
  ) {
    const select = 'createdAt';
    let oldestAuction;
    let auctions;
    let next;

    if (oldestAuctionId) {
      oldestAuction = await this.auctionMongoRepo.getAuctionByUniqueId(
        oldestAuctionId,
        select,
      );
    }

    if (oldestAuction) {
      auctions = await this.auctionMongoRepo.getAuctionWithBeforeDateAndLimit(
        oldestAuction.createdAt,
        limit,
      );
      next = await this.auctionMongoRepo.getAuctionNextCount(
        oldestAuction.createdAt,
        limit,
      );
      return { next, auctions };
    }

    auctions = await this.auctionMongoRepo.getAuctionWithBeforeDateAndLimit(
      null,
      limit,
    );
    next = await this.auctionMongoRepo.getAuctionNextCount(null, limit);
    return { next, auctions };
  }

  async getAuctionByUniqueId(uniqueId: string) {
    return await this.auctionMongoRepo.getAuctionByUniqueId(uniqueId);
  }

  async getAuctionsByUniqueIds(uniqueIds: string[], select: string | null) {
    return await this.auctionMongoRepo.getAuctionsByUniqueIds(
      uniqueIds,
      select,
    );
  }

  async auctionExistsByUniqueId(uniqueId: string) {
    return await this.auctionMongoRepo.auctionExistsByUniqueId(uniqueId);
  }

  async createAuction(data: TAuction) {
    const auctionId: string = generateAuctionId();
    const createdAuction = await this.auctionMongoRepo.createAuction({
      uniqueId: auctionId,
      ...data,
    });

    return createdAuction;
  }

  async updateAuction(uniqueId: string, data: TUpdateAuction) {
    return await this.auctionMongoRepo.updateAuction(uniqueId, data);
  }

  async deleteAuction(uniqueId: string) {
    return await this.auctionMongoRepo.deleteAuction(uniqueId);
  }
}
