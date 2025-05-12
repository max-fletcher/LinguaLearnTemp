import { EduContentMongoRepository } from '../db/nosql/repository/edu-content.repository';
import { TiersRepository } from '../db/rdb/repositories/tiers.repository';

export class EducationalContentService {
  private educationalContentMongoRepo: EduContentMongoRepository;
  private tierRepository: TiersRepository;

  constructor() {
    this.educationalContentMongoRepo = new EduContentMongoRepository();
    this.tierRepository = new TiersRepository();
  }

  async getPremiumEduContentHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    return await this.educationalContentMongoRepo.getPremiumEduContentHomepageService(
      select,
      limit,
    );
  }

  async getEduContentHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    return await this.educationalContentMongoRepo.getEduContentHomepageService(
      select,
      limit,
    );
  }

  async getEducationalContentByUniqueId(
    uniqueId: string,
    withRelations: boolean = true,
  ) {
    return await this.educationalContentMongoRepo.getEduContentByUniqueId(
      uniqueId,
      withRelations,
    );
  }

  async getEducationalContentByUniqueIds(
    uniqueIds: string[],
    withRelations: boolean = true,
    select: string | null,
  ) {
    return await this.educationalContentMongoRepo.getEduContentByUniqueIds(
      uniqueIds,
      withRelations,
      select,
    );
  }

  async eduContentExistsByUniqueId(uniqueId: string) {
    return await this.educationalContentMongoRepo.eduContentExistsByUniqueId(
      uniqueId,
    );
  }
}
