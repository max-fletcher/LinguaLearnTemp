import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be at most 128 characters long'),

    confirm_password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .superRefine(async (data, ctx) => {
    const { password, confirm_password } = data;

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

export type LoginRequestSchema = z.infer<typeof loginRequestSchema>;
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;
