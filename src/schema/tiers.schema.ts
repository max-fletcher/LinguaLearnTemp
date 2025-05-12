import { z } from 'zod';

export const tiersRequestSchema = z.object({
  name: z.string().min(5).max(128),
  price: z.coerce.number().min(1).max(10000000),
  duration: z.coerce.number().min(1).max(10000000),
  coins_rewarded: z.coerce.number().min(1),
  perks: z.array(z.string().min(1, 'Perk cannot be empty')),
});

export type TiersRequestSchema = z.infer<typeof tiersRequestSchema>;

export const purchaseTierSchema = z.object({
  tier_id: z
    .string({ required_error: 'Tier is required' })
    .trim()
    .max(255, { message: 'Tier ID cannot exceed 255 characters.' }),
  payment_token: z
    .string({ required_error: 'Payment token is required' })
    .trim()
    .max(255, { message: 'Payment token cannot exceed 255 characters.' }),
});

export type PurchaseTierSchema = z.infer<typeof purchaseTierSchema>;
