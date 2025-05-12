import { NextFunction, Response } from 'express';
import { AdminAuthenticatedRequest } from '../types/authenticate.type';

export const userRoleMiddleware =
  (userType: string[]) =>
  (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user && !userType.includes(req.user.userType))) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    next();
  };
