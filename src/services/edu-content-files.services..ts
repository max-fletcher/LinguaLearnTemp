import { EduContentFileMongoRepository } from '../db/nosql/repository/edu-content-file.repository';

export class EducationalContentFileService {
  private educationalContentFileMongoRepo: EduContentFileMongoRepository;

  constructor() {
    this.educationalContentFileMongoRepo = new EduContentFileMongoRepository();
  }

  async getEduContentByIds(ids: string[]) {
    return await this.educationalContentFileMongoRepo.getEduContentByIds(ids);
  }

  async getEduContentFileCount(ids: string[]) {
    return await this.educationalContentFileMongoRepo.getEduContentFileCount(
      ids,
    );
  }

  async massDeleteEduContentFile(ids: string[]) {
    return await this.educationalContentFileMongoRepo.massDeleteEduContentFile(
      ids,
    );
  }
}
