import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { validateRequestBody } from '../../utils/validatiion.utils';

import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from '../../controllers/admin/course.controller';
import { courseFileUploaderMiddleware } from '../../fileUploaders/course.fileUploaders';
import { createCourseSchema, updateCourseSchema } from '../../schema/course.schema';

const CourseRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

CourseRouter.get('/', jwtMiddleware.verifyToken, getAllCourses);
CourseRouter.get('/:id', jwtMiddleware.verifyToken, getSingleCourse);
CourseRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  courseFileUploaderMiddleware,
  validateRequestBody(createCourseSchema),
  createCourse,
);
CourseRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  courseFileUploaderMiddleware,
  validateRequestBody(updateCourseSchema),
  updateCourse,
);

CourseRouter.delete('/:id', jwtMiddleware.verifyToken, deleteCourse);

export { CourseRouter };
