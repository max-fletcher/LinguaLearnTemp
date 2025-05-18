import { z } from 'zod';
import { imageValidationRule } from './common.schema';
import { DIFFICULTIES, LANGUAGES } from '../constants/enums';

export const createCourseSchema = z.object({
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
  totalDays: z
    .coerce
    .number({ required_error: 'Total days is required.' })
    .min(1, { message: 'Total days has to be at least 1.' })
    .max(1000000, { message: 'Total days cannot exceed 1000000.' }),
  language: z
    .enum(LANGUAGES, { required_error: 'Language is required.' }),
  targetLanguage: z
    .enum(LANGUAGES, { required_error: 'Target language is required.' }),
  difficulty: z
    .enum(DIFFICULTIES, { required_error: 'Difficulty is required.' }),
  estimatedHours: z
    .coerce
    .number({ required_error: 'Estimated hours is required.' })
    .min(1, { message: 'Estimated hours has to be at least 1.' })
    .max(1000000, { message: 'Estimated hours cannot exceed 1000000.' }),
  imagePath: z.array(imageValidationRule, {required_error: "Image is be required." }),
});

export const updateCourseSchema = z.object({
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
  totalDays: z
    .coerce
    .number({ required_error: 'Total days is required.' })
    .min(1, { message: 'Total days has to be at least 1.' })
    .max(1000000, { message: 'Total days cannot exceed 1000000.' })
    .optional()
    .nullable(),
  language: z
    .enum(LANGUAGES, { required_error: 'Language is required.' }),
  targetLanguage: z
    .enum(LANGUAGES, { required_error: 'Target language is required.' }),
  difficulty: z
    .enum(DIFFICULTIES, { required_error: 'Difficulty is required.' }),
  estimatedHours: z
    .coerce
    .number({ required_error: 'Estimated hours is required.' })
    .min(1, { message: 'Estimated hours has to be at least 1.' })
    .max(1000000, { message: 'Estimated hours cannot exceed 1000000.' }),
  imagePath: z.array(imageValidationRule, {required_error: "Image is be required." })
    .optional()
    .nullable(),
});