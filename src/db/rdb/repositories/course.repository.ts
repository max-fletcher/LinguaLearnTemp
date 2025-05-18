import { Op, Transaction } from 'sequelize';
import { CourseModel, DayModel } from '../models';
import { Course, UpdateCourseData, StoreCourse } from '../../../types/course.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
export class CourseRepository {
  constructor() {}
  async findCourseById(id: string, select: string[]|null = null, withRelations: boolean = false): Promise<Course> {
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
          as: 'days',
          model: DayModel,
          where: {
            deletedAt: {
              [Op.eq]: null
            }
          }
        },
      ];
    }

    return (await CourseModel.findOne(options)) as unknown as Course;
  }

  async findCourseByIds(ids: string[]): Promise<Course[]> {
    return (await CourseModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as Course[];
  }

  async courseExistsById(id: string): Promise<number> {
    return await CourseModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getAllCourses(): Promise<Course[]> {
    return (await CourseModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as Course[];
  }

  async storeCourse(data: StoreCourse, transaction?: Transaction): Promise<Course> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await CourseModel.create(data, options) as unknown as Course;
  }

  async updateCourse(data: UpdateCourseData, id: string, transaction?: Transaction): Promise<Course> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await CourseModel.update(data, options)) as unknown as Course;
  }

  async deleteCourse(id: string, deletedBy: string, transaction?: Transaction): Promise<Course> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await CourseModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as Course;
  }

  async hardDeleteById(id: string): Promise<Course> {
    return (await CourseModel.destroy({
      where: {
        id: id,
      },
    })) as unknown as Course;
  }

  async getAllCoursesWithOptions(select: string[]|null = null): Promise<Course[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await CourseModel.findAll(options));
  }
}
