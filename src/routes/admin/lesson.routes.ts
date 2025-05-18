import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createLessonSchema, updateLessonSchema } from '../../schema/lesson.schema';
import { createLesson, deleteLesson, getAllLessons, getSingleLesson, updateLesson } from '../../controllers/admin/lesson.controller';
import { lessonFileUploaderMiddleware } from '../../fileUploaders/lesson.fileUploaders';

const LessonRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

LessonRouter.get('/', jwtMiddleware.verifyToken, getAllLessons);
LessonRouter.get('/:id', jwtMiddleware.verifyToken, getSingleLesson);
LessonRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  lessonFileUploaderMiddleware,
  validateRequestBody(createLessonSchema),
  createLesson,
);
LessonRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  lessonFileUploaderMiddleware,
  validateRequestBody(updateLessonSchema),
  updateLesson,
);

LessonRouter.delete('/:id', jwtMiddleware.verifyToken, deleteLesson);

export { LessonRouter };
