import { z } from 'zod';
import { DayService } from '../services/admin/day.services';
import { CourseService } from '../services/admin/course.services';

const dayService = new DayService()
const courseService = new CourseService()

export const createDaySchema = z.object({
  courseId: z
    .string({ required_error: 'Course id is required.' })
    .trim(),
  dayNumber: z
    .coerce
    .number({ required_error: 'Day number is required.' })
    .min(1, { message: 'Day number has to be at least 1.' })
    .max(1000000, { message: 'Day number cannot exceed 1000000.' }),
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(3, { message: 'Title has to be at least 3 characters long.' })
    .max(255, { message: 'Title cannot exceed 255 characters.' }),
  description: z
    .string({ required_error: 'Description is required.' })
    .trim()
    .min(3, { message: 'Description has to be at least 3 characters long.' })
    .max(255, { message: 'Description cannot exceed 255 characters.' })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { courseId, dayNumber } = data;

  const course = await courseService.findCourseById(courseId, ['id', 'totalDays'])
  if(!course){
    ctx.addIssue({
      code: 'custom',
      path: ['courseId'],
      message: 'Course with this course id doesn\'t exist.',
    });
  }

  // Check if course with day already exists
  const courseWithDay = await dayService.courseWithDayExists(courseId, dayNumber);
  if (courseWithDay) {
    ctx.addIssue({
      code: 'custom',
      path: ['courseId'],
      message: 'Course id with this day number already exists.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['dayNumber'],
      message: 'Course id with this day number already exists.',
    });
  }

  if(course && data.dayNumber > course.totalDays){
    ctx.addIssue({
      code: 'custom',
      path: ['dayNumber'],
      message: 'Day number cannot exceed course\'s total days.',
    });
  }
});

export const updateDaySchema = z.object({
  id: z
    .string({ required_error: 'Id is required.' })
    .trim(),
  courseId: z
    .string({ required_error: 'Course id is required.' })
    .trim()
    .optional()
    .nullable(),
  dayNumber: z
    .coerce
    .number({ required_error: 'Day number is required.' })
    .min(1, { message: 'Day number has to be at least 1.' })
    .max(1000000, { message: 'Day number cannot exceed 1000000.' })
    .optional()
    .nullable(),
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(3, { message: 'Title has to be at least 3 characters long.' })
    .max(255, { message: 'Title cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  description: z
    .string({ required_error: 'Description is required.' })
    .trim()
    .min(3, { message: 'Description has to be at least 3 characters long.' })
    .max(255, { message: 'Description cannot exceed 255 characters.' })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { id } = data;
  let { courseId, dayNumber } = data;
  const day = await dayService.findDayById(id, ['id', 'courseId', 'dayNumber', 'deletedAt'])

  if(!courseId)
    courseId = day.courseId
  if(!dayNumber)
    dayNumber = day.dayNumber

  const course = await courseService.findCourseById(courseId, ['id', 'totalDays'])
  if(!course){
    ctx.addIssue({
      code: 'custom',
      path: ['courseId'],
      message: 'Course with this course id doesn\'t exist.',
    });
  }

  // Check if course with day already exists
  const courseWithDay = await dayService.courseWithDayExists(courseId, dayNumber);
  if (courseWithDay && dayNumber !== day.dayNumber) {
    ctx.addIssue({
      code: 'custom',
      path: ['courseId'],
      message: 'Course id with this day number already exists.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['dayNumber'],
      message: 'Course id with this day number already exists.',
    });
  }

  if(course && data.dayNumber && data.dayNumber > course.totalDays){
    ctx.addIssue({
      code: 'custom',
      path: ['dayNumber'],
      message: 'Day number cannot exceed course\'s total days.',
    });
  }
});