import { Op, Transaction } from 'sequelize';
import { LessonModel } from '../models';
import { Lesson, UpdateLessonData, StoreLesson } from '../../../types/lesson.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
export class LessonRepository {
  constructor() {}
  async findLessonById(id: string, select: string[]|null = null, withRelations: boolean = false): Promise<Lesson> {
    const options: any = {
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(select)
      options.attributes = select

    if(withRelations){
      options.include = [
        {
          as: 'lessons',
          model: LessonModel,
          where: {
            deletedAt: {
              [Op.eq]: null
            }
          }
        },
      ];
    }

    return (await LessonModel.findOne(options)) as unknown as Lesson;
  }

  async findLessonByIds(ids: string[]): Promise<Lesson[]> {
    return (await LessonModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as Lesson[];
  }

  async lessonExistsById(id: string): Promise<number> {
    return await LessonModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getAllLessons(): Promise<Lesson[]> {
    return (await LessonModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as Lesson[];
  }

  async storeLesson(data: StoreLesson, transaction?: Transaction): Promise<Lesson> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await LessonModel.create(data, options) as unknown as Lesson;
  }

  async updateLesson(data: UpdateLessonData, id: string, transaction?: Transaction): Promise<Lesson> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LessonModel.update(data, options)) as unknown as Lesson;
  }

  async deleteLesson(id: string, deletedBy: string, transaction?: Transaction): Promise<Lesson> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await LessonModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as Lesson;
  }

  async hardDeleteById(id: string): Promise<Lesson> {
    return (await LessonModel.destroy({
      where: {
        id: id,
      },
    })) as unknown as Lesson;
  }

  async getAllLessonsWithOptions(select: string[]|null = null): Promise<Lesson[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await LessonModel.findAll(options));
  }
}
