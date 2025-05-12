import { z } from 'zod';

export const purchaseEduContentSchema = z.object({
  edu_content_id: z
    .string({ required_error: 'Educational content id is required.' })
    .trim(),
});
