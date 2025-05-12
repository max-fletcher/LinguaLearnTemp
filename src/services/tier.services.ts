import { TiersRepository } from '../db/rdb/repositories/tiers.repository';

export class TierService {
  private tierRepo: TiersRepository;

  constructor() {
    this.tierRepo = new TiersRepository();
  }

  async getAllTiers(attributes: string[]|null = null) {
    return await this.tierRepo.getAllTiers(attributes);
  }

  async findMostPopular() {
    return await this.tierRepo.findMostPopular();
  }

  async getTierById(id: string, attributes: any = null) {
    return await this.tierRepo.getTiersById(id, attributes);
  }

  async getUserSubscribedTiers(id: string) {
    return await this.tierRepo.getUserSubscribedTiers(id);
  }

  async getPackagePageData(id: string) {
    return await this.tierRepo.getPackagePageData(id);
  }

  async getUserHighestTier(id: string) {
    return await this.tierRepo.getUserHighestTier(id);
  }
}
