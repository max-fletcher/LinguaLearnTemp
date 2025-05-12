import { NextFunction, Response } from 'express';
import { AppAuthenticatedRequest } from '../types/authenticate.type';

export const appUserUsernameSetMiddleware = async (
  req: AppAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user!.username)
    return res.status(401).json({
      data: {
        message: 'Username is not set! Please update your username to proceed.',
        statusCode: 401,
      },
    });

  next();
};
