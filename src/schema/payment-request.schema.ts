import { z } from 'zod';

export const checkPayoutValiditySchema = z.object({
  amount: z.coerce.number({ required_error: 'Withdraw amount is required.' }).min(1).max(10000000),
});

export type CheckPayoutValiditySchema = z.infer<
  typeof checkPayoutValiditySchema
>;

export const withdrawRequestSchema = z.object({
  amount: z.coerce.number({ required_error: 'Withdraw amount is required.' }).min(1, { message: 'Amount must be 1 or greater.' }).max(10000000, { message: 'Amount cannot exceed 10000000.' }),
  name: z.string({ required_error: 'Name is required.' }).min(1, { message: 'Name is required.' }).max(255, { message: 'Name cannot exceed 255 charaters.' }),
  address: z.string({ required_error: 'Address is required.' }).min(1, { message: 'Address is required.' }).max(255, { message: 'Address cannot exceed 255 charaters.' }),
  bank_name: z.string({ required_error: 'Bank name is required.' }).trim().min(1, { message: 'Bank name is required.' }).max(255, { message: 'Bank name cannot exceed 255 charaters.' }),
  bank_account_no: z.string({ required_error: 'Bank account no. is required.' }).trim().min(1, { message: 'Bank account no. is required.' }).max(255, { message : 'Bank account no. cannot exceed 255 charaters.' }),
  zip_code: z.string({ required_error: 'Zip code is required.' }).min(1).max(255, { message: 'Zip code cannot exceed 255 charaters.' }),
  phone_number: z.string({ required_error: 'Phone number is required.' }).min(1, { message: 'Phone number is required.' }).max(255, { message: 'Phone number cannot exceed 255 charaters.' }),
});

export type WithdrawRequestSchema = z.infer<typeof withdrawRequestSchema>;
