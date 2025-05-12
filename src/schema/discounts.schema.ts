import { z } from 'zod';
import { DISCOUNT_STATUS, DISCOUNT_TYPES } from '../constants/enums';
import { imageValidationS3Rule } from './common.schema';

export const discountRequestSchema = z
  .object({
    id: z.string().nullable().optional(),
    admin_user_id: z.string().nullable().optional(),
    tier_id: z
      .string()
      .trim()
      .min(1, { message: 'Tier Id is required' })
      .max(255),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Discount name is required' })
      .max(255),
    company: z.string().max(255).optional().nullable(),
    description: z.string().nullable().optional(),
    discount_type: z.enum(DISCOUNT_TYPES),
    discount_value: z.coerce
      .number()
      .min(1, { message: 'Discount value is required' }),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    status: z.enum(DISCOUNT_STATUS).optional(),
    thumbnail_image: z.array(imageValidationS3Rule).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const { start_date, end_date } = data;
    if (new Date(start_date) > new Date(end_date)) {
      ctx.addIssue({
        code: 'custom',
        path: ['end_date'],
        message: 'End date must be greater than start date.',
      });
    }
  });

export const discountStatusRequestSchema = z.object({
  status: z.enum(DISCOUNT_STATUS),
});

export type DiscountRequestType = z.infer<typeof discountRequestSchema>;
export type DiscountStatusRequestType = z.infer<
  typeof discountStatusRequestSchema
>;
