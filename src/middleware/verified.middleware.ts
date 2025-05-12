import { NextFunction, Response } from 'express';
import { AppAuthenticatedRequest } from '../types/authenticate.type';

export const appUserVerifiedMiddleware = async (
  req: AppAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user!.verified)
    return res.status(401).json({
      data: {
        message: 'You are not verified! Please verify your account to proceed.',
        statusCode: 401,
      },
    });

  next();
};
