import { Op } from 'sequelize';
import { z } from 'zod';
import { EXPECTED_USER_STATUS, EXPECTED_USER_TYPES } from '../constants/enums';
import { AdminUserModel } from '../db/rdb/models';
import { imageValidationS3Rule } from './common.schema';

// const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
// const ACCEPTED_FILE_TYPES = ['image/png'];

const isUnique = async (field: string, value: string, id?: string) => {
  if (!value) return true;

  const whereClause: any = { [field]: value };

  // If id is provided, exclude that user from the uniqueness check
  if (id) {
    whereClause.id = { [Op.ne]: id };
  }

  const existingUser = await AdminUserModel.findOne({
    where: whereClause,
  });

  return existingUser === null;
};

export const registrationReqeustSchema = z.object({
  email: z.string().email().nullable().optional(),
  password: z.string().min(8).max(128).nullable().optional(),
  phone: z.string().nullable().optional(),
  provider: z.string().nullable().optional(),
  token: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
});

// User Schema for creating an admin user

export const createAdminUserSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Required' }).max(255),
    username: z.string().trim().min(1, { message: 'Required' }).max(128),
    email: z.string().trim().min(1, { message: 'Required' }).email(),
    phone: z.string().max(128).nullable().optional(),
    user_type: z.enum(EXPECTED_USER_TYPES, { required_error: 'Required' }),
    status: z.enum(EXPECTED_USER_STATUS, { required_error: 'Required' }),
    password: z.string().min(8, { message: 'Required' }).max(128),
  })
  .superRefine(async (data, ctx) => {
    const { username, email } = data;

    // Check uniqueness of username
    const isUsernameUnique = await isUnique('username', username);
    if (!isUsernameUnique) {
      ctx.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'Username already exists',
      });
    }

    // Check uniqueness of email
    const isEmailUnique = await isUnique('email', email);
    if (!isEmailUnique) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Email already exists',
      });
    }
  });

// User schema for Update Admin Users

export const updateAdminUserSchema = z
  .object({
    id: z.string().trim().min(1, { message: 'Required' }).max(255),
    name: z.string().trim().min(1, { message: 'Required' }).max(255),
    username: z.string().trim().min(1, { message: 'Required' }).max(128),
    email: z.string().trim().min(1, { message: 'Required' }).email(),
    phone: z.string().max(128).nullable().optional(),
    user_type: z.enum(EXPECTED_USER_TYPES, { required_error: 'Required' }),
    status: z.enum(EXPECTED_USER_STATUS, { required_error: 'Required' }),
    password: z.string().max(128).optional(),
  })
  .refine(
    (data) =>
      data.password === undefined ||
      data.password === '' ||
      data.password.length >= 8,
    {
      path: ['password'],
      message: 'Password must be at least 8 characters long',
    },
  )
  .superRefine(async (data, ctx) => {
    const { id, username, email } = data;

    // Check uniqueness of username
    const isUsernameUnique = await isUnique('username', username, id);
    if (!isUsernameUnique) {
      ctx.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'Username already exists',
      });
    }

    // Check uniqueness of email
    const isEmailUnique = await isUnique('email', email, id);
    if (!isEmailUnique) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Email already exists',
      });
    }
  });

// Update user profile Schema validation

export const updateUserProfileSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Required' }).max(255),
    email: z.string().trim().min(1, { message: 'Required' }).email(),
    phone: z.string().max(128).nullable().optional(),
    avatar: z.array(imageValidationS3Rule).optional().nullable(),
    password: z.string().max(128).optional().nullable(),
    confirm_password: z.string().max(128).optional().nullable(),
  })
  .superRefine(async (data, ctx) => {
    const { password, confirm_password } = data;

    if (
      password !== undefined &&
      password !== null &&
      password !== '' &&
      password?.length < 8
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must be at least 8 characters long',
      });
    }

    if (
      password !== '' &&
      confirm_password !== '' &&
      password !== confirm_password
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'Passwords do not match',
      });
    }
  });

export type RegistrationRequestSchema = z.infer<
  typeof registrationReqeustSchema
>;

export type CreateAdminUserSchema = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserSchema = z.infer<typeof updateAdminUserSchema>;
export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
