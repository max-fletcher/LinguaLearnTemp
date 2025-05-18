import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { CourseRepository } from '../../db/rdb/repositories/course.repository';
import { StoreCourseData, UpdateCourseData } from '../../types/course.type';

export class CourseService {
  private courseRepo: CourseRepository;

  constructor() {
    this.courseRepo = new CourseRepository();
  }

  async findCourseById(id: string, select: string[]|null = null, withRelations: boolean = false) {
    return await this.courseRepo.findCourseById(id, select, withRelations);
  }

  async courseExistsById(id: string) {
    return await this.courseRepo.courseExistsById(id);
  }

  async getAllCourses() {
    return await this.courseRepo.getAllCourses();
  }

  async getAllCoursesWithOptions(select: string[]|null = null) {
    return await this.courseRepo.getAllCoursesWithOptions(select);
  }

  async storeCourse(data: StoreCourseData, transaction?: Transaction) {
    const id = generateId()
    return await this.courseRepo.storeCourse({ id, ...data }, transaction);
  }

  async updateCourse(data: UpdateCourseData, id: string, transaction?: Transaction) {
    return await this.courseRepo.updateCourse(data, id, transaction);
  }

  async deleteCourse(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.courseRepo.deleteCourse(id, deletedBy, transaction);
  }
}
