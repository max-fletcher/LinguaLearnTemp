import EduContentFileModel from '../model/edu-content-file.model';

export class EduContentFileMongoRepository {
  async getEduContentByIds(ids: string[]) {
    return await EduContentFileModel.find({ _id: ids });
  }

  async getEduContentFileCount(ids: string[]) {
    return await EduContentFileModel.countDocuments({ _id: ids });
  }

  async massDeleteEduContentFile(ids: string[]) {
    return await EduContentFileModel.deleteMany({ _id: ids });
  }
}
