import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { LessonRepository } from '../../db/rdb/repositories/lesson.repository';
import { StoreLessonData, UpdateLessonData } from '../../types/lesson.type';

export class LessonService {
  private lessonRepo: LessonRepository;

  constructor() {
    this.lessonRepo = new LessonRepository();
  }

  async findLessonById(id: string, select: string[]|null = null, withRelations: boolean = false) {
    return await this.lessonRepo.findLessonById(id, select, withRelations);
  }

  async lessonExistsById(id: string) {
    return await this.lessonRepo.lessonExistsById(id);
  }

  async getAllLessons() {
    return await this.lessonRepo.getAllLessons();
  }

  async getAllLessonsWithOptions(select: string[]|null = null) {
    return await this.lessonRepo.getAllLessonsWithOptions(select);
  }

  async storeLesson(data: StoreLessonData, transaction?: Transaction) {
    const id = generateId()
    return await this.lessonRepo.storeLesson({ id, ...data }, transaction);
  }

  async updateLesson(data: UpdateLessonData, id: string, transaction?: Transaction) {
    return await this.lessonRepo.updateLesson(data, id, transaction);
  }

  async deleteLesson(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.lessonRepo.deleteLesson(id, deletedBy, transaction);
  }
}
