import { z } from 'zod';
import { imageValidationRule } from './common.schema';

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
    .number({ required_error: 'Total days is required.' })
    .min(1, { message: 'Total days has to be at least 1.' })
    .max(1000000, { message: 'Total days cannot exceed 1000000.' }),
  language: z
    .string({ required_error: 'Language is required.' })
    .trim()
    .min(3, { message: 'Language has to be at least 3 characters long.' })
    .max(255, { message: 'Language cannot exceed 255 characters.' }),
  targetLanguage: z
    .string({ required_error: 'Target language is required.' })
    .trim()
    .min(3, { message: 'Target language has to be at least 3 characters long.' })
    .max(255, { message: 'Target language cannot exceed 255 characters.' }),
  difficulty: z
    .string({ required_error: 'Difficulty is required.' })
    .trim()
    .min(3, { message: 'Difficulty has to be at least 3 characters long.' })
    .max(255, { message: 'Difficulty cannot exceed 255 characters.' }),
  estimatedHours: z
    .number({ required_error: 'Estimated hours is required.' })
    .min(1, { message: 'Estimated hours has to be at least 1.' })
    .max(1000000, { message: 'Estimated hours cannot exceed 1000000.' }),
  imagePath: z.array(imageValidationRule)
    .nonempty({ message: "Image is be required." }),
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
    .number({ required_error: 'Total days is required.' })
    .min(1, { message: 'Total days has to be at least 1.' })
    .max(1000000, { message: 'Total days cannot exceed 1000000.' })
    .optional()
    .nullable(),
  language: z
    .string({ required_error: 'Language is required.' })
    .trim()
    .min(3, { message: 'Language has to be at least 3 characters long.' })
    .max(255, { message: 'Language cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  targetLanguage: z
    .string({ required_error: 'Target language is required.' })
    .trim()
    .min(3, { message: 'Target language has to be at least 3 characters long.' })
    .max(255, { message: 'Target language cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  difficulty: z
    .string({ required_error: 'Difficulty is required.' })
    .trim()
    .min(3, { message: 'Difficulty has to be at least 3 characters long.' })
    .max(255, { message: 'Difficulty cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  estimatedHours: z
    .number({ required_error: 'Estimated hours is required.' })
    .min(1, { message: 'Estimated hours has to be at least 1.' })
    .max(1000000, { message: 'Estimated hours cannot exceed 1000000.' }),
  imagePath: z.array(imageValidationRule)
    .optional()
    .nullable(),
});