import { z } from 'zod';
import { EXPECTED_PAYOUT_STATUS, PayoutStatus } from '../constants/enums';

export const payoutRequestSchema = z.object({
  amount: z.coerce.number({ required_error: 'Amount is required.' }).min(1, { message: 'Amount must be 1 or greater.' }).max(10000000, { message: 'Amount cannot exceed 10000000.' }),
  name: z.string({ required_error: 'Name is required.' }).trim().min(1, { message: 'Name is required.' }).max(255, { message: 'Name cannot exceed 255 charaters.' }),
  address: z.string({ required_error: 'Address is required.' }).trim().min(1, { message: 'Address is required.' }).max(255, { message: 'Address cannot exceed 255 charaters.' }),
  bank_name: z.string({ required_error: 'Bank name is required.' }).trim().min(1, { message: 'Bank name is required.' }).max(255, { message: 'Bank name cannot exceed 255 charaters.' }),
  bank_account_no: z.string({ required_error: 'Bank account no. is required.' }).trim().min(1, { message: 'Bank account no. is required.' }).max(255, { message: 'Bank account no. cannot exceed 255 charaters.' }),
  zip_code: z.string({ required_error: 'Zip code is required.' }).nullable().optional(),
  phone_number: z.string({ required_error: 'Phone number is required.' }).trim().min(1, { message: 'Phone number is required.' }).max(255, { message: 'Phone number cannot exceed 255 charaters.' }),
});

export const updatePayoutStatusSchema = z.object({
  status: z.enum(EXPECTED_PAYOUT_STATUS, {
    required_error: 'Required',
  }),
});

export const payoutFilterSchema = z.object({
  status: z
    .enum([
      '',
      PayoutStatus.PENDING,
      PayoutStatus.APPROVED,
      PayoutStatus.REJECTED,
    ])
    .optional(),
  search: z.string().optional(),
});

export type PayoutRequestSchema = z.infer<typeof payoutRequestSchema>;
