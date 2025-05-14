import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createCourseSchema, updateCourseSchema } from '../../schema/course.schema';
import { multipleFileLocalUploader } from '../../middleware/fileUploadLocal.middleware';
import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from '../../controllers/admin/course.controller';

const CourseRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

CourseRouter.get('/', jwtMiddleware.verifyToken, getAllCourses);
CourseRouter.get('/:id', jwtMiddleware.verifyToken, getSingleCourse);
CourseRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  multipleFileLocalUploader(
    [
      { name: 'imagePath', maxCount: 1 },
    ],
    'course',
    1048576, // 5 MB
  ),
  validateRequestBody(createCourseSchema),
  createCourse,
);
CourseRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  multipleFileLocalUploader(
    [
      { name: 'imagePath', maxCount: 1 },
    ],
    'course',
    1048576, // 5 MB
  ),
  validateRequestBody(updateCourseSchema),
  updateCourse,
);

CourseRouter.delete('/:id', jwtMiddleware.verifyToken, deleteCourse);

export { CourseRouter };
