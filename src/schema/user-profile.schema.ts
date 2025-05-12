import { z } from 'zod';
import { imageValidationS3Rule } from './common.schema';
import { AppUserNotificationOptions } from '../constants/enums';

const expertiseSchema = z
  .object({
    title: z.string().max(255).optional(),
    description: z.string().max(255).optional(),
  })
  .refine(
    (data) => data.title || data.description, // Ensure at least one field is present
    { message: 'Either title or description must be provided' },
  )
  .nullable();

export const professionalWorkExperienceSchema = z
  .object({
    title: z.string().min(3, { message: 'Required' }).max(255),
    company: z.string().min(3, { message: 'Required' }).max(255),
    logo_url: z.array(imageValidationS3Rule).optional().nullable(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().nullable().optional(),
  })
  .refine(
    (data) =>
      !data.end_date || new Date(data.end_date) > new Date(data.start_date),
    {
      path: ['end_date'],
      message: 'End date must be greater than start date.',
    },
  );

export const professionalEducationSchema = z
  .object({
    title: z.string().min(3, { message: 'Required' }).max(255),
    institution: z.string().min(3, { message: 'Required' }).max(255),
    logo_url: z.array(imageValidationS3Rule).optional().nullable(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().nullable().optional(),
  })
  .refine(
    (data) =>
      !data.end_date || new Date(data.end_date) > new Date(data.start_date),
    {
      path: ['end_date'],
      message: 'End date must be greater than start date.',
    },
  );

export const professionalBiographySchema = z.object({
  profession: z.string().min(1, { message: 'Required' }).max(255),
  biography: z.string().min(1, { message: 'Required' }).max(255),
  key_expertise: z.array(expertiseSchema).min(1, 'Min 1 expertise is required'),
});

export const toggleNotificationSchema = z.object({
  notifications: z.enum(
    [
      AppUserNotificationOptions.ON,
      AppUserNotificationOptions['1HR'],
      AppUserNotificationOptions['8HR'],
      AppUserNotificationOptions['24HR'],
      AppUserNotificationOptions.OFF,
    ],
    {
      required_error: 'Notification status is required',
    },
  ),
});

export type ProfessionalWorkExperienceSchema = z.infer<
  typeof professionalWorkExperienceSchema
>;
export type ProfessionalEducationSchema = z.infer<
  typeof professionalEducationSchema
>;
