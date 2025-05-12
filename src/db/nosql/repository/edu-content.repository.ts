import {
  EduContentCategories,
  EduContentStatus,
} from '../../../constants/enums';
import { TEducationalContent } from '../../../types/edu-content.types';
import EducationalContentModel from '../model/edu-content.model';

export class EduContentMongoRepository {
  async getPremiumEduContentHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    if (select)
      return await EducationalContentModel.find({
        category: EduContentCategories.PREMIUM,
        status: EduContentStatus.APPROVED,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(select)
        .lean();

    return await EducationalContentModel.find({
      statuscategory: EduContentCategories.PREMIUM,
      status: EduContentStatus.APPROVED,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getEduContentHomepageService(
    select: string | null = null,
    limit: number = 10,
  ) {
    if (select)
      return await EducationalContentModel.find({
        category: EduContentCategories.NONPREMIUM,
        status: EduContentStatus.APPROVED,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(select)
        .lean();

    return await EducationalContentModel.find({
      category: EduContentCategories.NONPREMIUM,
      status: EduContentStatus.APPROVED,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getEduContentByUniqueId(
    uniqueId: string,
    withRelations: boolean = true,
    select: string | null = null,
  ) {
    if (withRelations && select)
      return await EducationalContentModel.findOne({ uniqueId: uniqueId })
        .select(select)
        .populate('edu_content_files')
        .lean();
    if (!withRelations && select)
      return await EducationalContentModel.findOne(
        { uniqueId: uniqueId },
        select,
      ).lean();
    if (withRelations && !select)
      return await EducationalContentModel.findOne({ uniqueId: uniqueId })
        .populate('edu_content_files')
        .lean();

    return (await EducationalContentModel.findOne({
      uniqueId: uniqueId,
    }).lean()) as unknown as TEducationalContent;
  }

  async getEduContentByUniqueIds(
    uniqueIds: string[],
    withRelations: boolean = true,
    select: string | null = null,
  ) {
    if (withRelations && select)
      return await EducationalContentModel.find({
        uniqueId: { $in: uniqueIds },
      })
        .select(select)
        .populate('edu_content_files')
        .lean();
    if (!withRelations && select)
      return await EducationalContentModel.find(
        { uniqueId: { $in: uniqueIds } },
        select,
      ).lean();
    if (withRelations && !select)
      return await EducationalContentModel.find({
        uniqueId: { $in: uniqueIds },
      })
        .populate('edu_content_files')
        .lean();

    return await EducationalContentModel.find({
      uniqueId: { $in: uniqueIds },
    }).lean();
  }

  async eduContentExistsByUniqueId(uniqueId: string) {
    return await EducationalContentModel.exists({ uniqueId: uniqueId }).lean();
  }
}
