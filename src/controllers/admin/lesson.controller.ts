import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from '../../middleware/fileUploadLocal.middleware';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { LessonService } from '../../services/admin/lesson.services';

const lessonService = new LessonService();

export async function getAllLessons(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessons = await lessonService.getAllLessons();

    return res.status(200).json({
      data: {
        message: 'Lesson list fetched successfully!',
        lessons: lessons,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log('getAllLessons', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function getSingleLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.id
    const lesson = await lessonService.findLessonById(lessonId, null, true);

    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.deletedAt)
      throw new NotFoundException('Lesson not found.')

    return res.status(200).json({
      data: {
        message: 'Lesson fetched successfully!',
        lesson: lesson,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log('getSingleAllLesson', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function createLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { ...req.body, audioIntro: filesWithFullPaths?.audioIntro[0], updatedBy: req.user!.id }
    const response = await lessonService.storeLesson(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'Lesson created successfully!',
          lesson: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('createLesson', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function updateLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.id
    const lesson = await lessonService.findLessonById(lessonId, ['id', 'audioIntro', 'deletedAt'])
    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.deletedAt)
      throw new NotFoundException('Lesson not found.')

    let data = { ...req.body, updatedBy: req.user!.id }

    if(req.files?.audioIntro && req.files?.audioIntro.length > 0){
      if(lesson.audioIntro)
        deleteMultipleFileLocal(req, [lesson.audioIntro])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, audioIntro: filesWithFullPaths?.audioIntro[0] }
    }

    const response = await lessonService.updateLesson(data, lessonId);

    if(response){
      const lesson = await lessonService.findLessonById(lessonId);
      return res.json({
        data: {
          message: 'Lesson updated successfully!',
          lesson: lesson,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('updateLesson', error);
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function deleteLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.id

    const lesson = await lessonService.findLessonById(lessonId)
    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.deletedAt)
      throw new NotFoundException('Lesson not found.')

    if(lesson.audioIntro)
      deleteMultipleFileLocal(req, [lesson.audioIntro])

    const response = await lessonService.deleteLesson(lessonId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'Lesson deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('deleteLesson', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}