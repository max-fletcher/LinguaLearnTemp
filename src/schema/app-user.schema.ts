import { z } from 'zod';
import { APP_USER_VERIFICATION_STATUSES } from '../constants/enums';
import { imageValidationRule } from './common.schema';

export const createAppUserSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Phone no. is required' })
    .trim()
    .min(3, { message: 'Phone no. has to be at least 3 characters long.' })
    .max(255, { message: 'Phone no. cannot exceed 255 characters.' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(3, { message: 'First name has to be at least 3 characters long.' })
    .max(255, { message: 'First name cannot exceed 255 characters.' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(3, { message: 'Last name has to be at least 3 characters long.' })
    .max(255, { message: 'Last name cannot exceed 255 characters.' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(3, { message: 'Email has to be at least 3 characters long.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  nativeLanguage: z
    .string({ required_error: 'Native language is required' })
    .trim()
    .min(3, { message: 'Native language has to be at least 3 characters long.' })
    .max(255, { message: 'Native language cannot exceed 255 characters.' }),
  learningGoal: z
    .string({ required_error: 'Learning goal is required' })
    .trim()
    .min(3, { message: 'Learning goal has to be at least 3 characters long.' })
    .max(255, { message: 'Learning goal cannot exceed 255 characters.' }),
  proficiencyLevel: z
    .string({ required_error: 'Proficiency level is required' })
    .trim()
    .min(3, { message: 'Proficiency level has to be at least 3 characters long.' })
    .max(255, { message: 'Proficiency level cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  avatarUrl: z.array(imageValidationRule).optional().nullable(),
});

export const updateAppUserSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Phone no. is required' })
    .trim()
    .min(3, { message: 'Phone no. has to be at least 3 characters long.' })
    .max(255, { message: 'Phone no. cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(3, { message: 'First name has to be at least 3 characters long.' })
    .max(255, { message: 'First name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(3, { message: 'Last name has to be at least 3 characters long.' })
    .max(255, { message: 'Last name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(3, { message: 'Email has to be at least 3 characters long.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  nativeLanguage: z
    .string({ required_error: 'Native language is required' })
    .trim()
    .min(3, { message: 'Native language has to be at least 3 characters long.' })
    .max(255, { message: 'Native language cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  learningGoal: z
    .string({ required_error: 'Learning goal is required' })
    .trim()
    .min(3, { message: 'Learning goal has to be at least 3 characters long.' })
    .max(255, { message: 'Learning goal cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  proficiencyLevel: z
    .string({ required_error: 'Proficiency level is required' })
    .trim()
    .min(3, { message: 'Proficiency level has to be at least 3 characters long.' })
    .max(255, { message: 'Proficiency level cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  verified: z.enum(APP_USER_VERIFICATION_STATUSES)
    .optional()
    .nullable(),
  avatarUrl: z.array(imageValidationRule).optional().nullable(),
});