import { z } from 'zod';

export const firebaseValidationSchema = z.object({
  device_id: z.string().min(1, { message: 'Required' }),
  fcm_token: z.string().min(1, { message: 'Required' }),
});
