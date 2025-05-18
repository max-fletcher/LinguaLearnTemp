// import { rollbackMultipleFileS3 } from '../middleware/fileUploadS3.middleware';
import { z } from 'zod';
import { rollbackMultipleFileLocalUpload } from '../middleware/fileUploadLocal.middleware';
import { NextFunction, Request, Response } from 'express';

export const validateRequestBody =
  (schema: z.ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        ...req.body,
        ...req.query,
        ...(req?.files ?? {}),
      });
      next();
    } catch (error: any) {
      console.log('validateRequestBody', error);
      // rollbackMultipleFileS3(req);
      rollbackMultipleFileLocalUpload(req);
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error:{
            message: 'Validation failed',
            errors: error.issues.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          code: 500,
        });
      } else {
        return res.status(500).json({
          error: {
            message: 'Internal server error',
          },
          code: 500,
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
