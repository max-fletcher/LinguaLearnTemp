import { rollbackMultipleFileS3 } from '../middleware/fileUploadS3.middleware';
import { z } from 'zod';

export const validateRequestBody =
  (schema: z.ZodSchema) => async (req: any, res: any, next: any) => {
    try {
      await schema.parseAsync({
        ...req.body,
        ...req.query,
        ...(req?.files ?? {}),
      });
      next();
    } catch (error: any) {
      rollbackMultipleFileS3(req);
      if (error instanceof z.ZodError) {
        res.status(422).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }
    }
  };

export function validateBody<T>(
  eventBody: string | null | undefined,
  schema: z.ZodSchema,
): undefined | T {
  if (!eventBody) {
    return undefined;
  }

  try {
    const parsedBody = JSON.parse(eventBody);
    const validation = schema.safeParse(parsedBody);

    if (!validation.success) {
      // console.log('zod validation failed', validation.error);
      return undefined;
    }
    return validation.data;
  } catch (e) {
    console.error('unable to validate body', e);
    return undefined;
  }
}

export function validateObject<T>(
  obj: unknown,
  schema: z.ZodSchema,
): undefined | T {
  if (!obj) {
    return undefined;
  }
  try {
    const validation = schema.safeParse(obj);

    if (!validation.success) {
      // console.log('zod validation failed', validation.error);
      return undefined;
    }
    return validation.data;
  } catch (e) {
    console.error('unable to validate body', e);
    return undefined;
  }
}
