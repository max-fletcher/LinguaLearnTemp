import { NextFunction, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { AdminUserRepository } from '../db/rdb/repositories/admin-user.repository';
import { AppUserPayload, AdminUserPayload } from '../schema/token-payload.schema';
import {
  AppAuthenticatedRequest,
  AdminAuthenticatedRequest,
} from '../types/authenticate.type';
import { getEnvVar } from '../utils/common.utils';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { datetimeYMDHis } from '../utils/datetime.utils';
import { CustomException } from '../errors/CustomException.error';
import { UnauthorizedException } from '../errors/UnauthorizedException.error';

export class JwtMiddleware {
  generateToken(payload: AdminUserPayload): string {
    const expiresIn = Number(getEnvVar('JWT_EXPIRY'));
    return sign(payload, getEnvVar('JWT_SECRET'), {
      expiresIn: `${expiresIn} days`,
    });
  }

  async verifyToken(
    req: AdminAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        return res.status(401).json({ message: 'You are not logged in!' });

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as AdminUserPayload;
        const adminRepo = new AdminUserRepository();
        const checkUser = await adminRepo.findUserById(req.user.id);

        if (!checkUser) {
          throw new UnauthorizedException('Invalid Token Data');
        }

        next();
      } else {
        throw new UnauthorizedException('Token Expired');
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException)
        return res.status(401).json({ message: e.message });

      return res
        .status(500)
        .json({ message: 'Something went wrong! Please try again.' });
    }
  }

  generateAppUserToken(payload: AppUserPayload): {
    token: string;
    validity: string;
  } {
    const expiresIn = Number(getEnvVar('JWT_EXPIRY'));
    return {
      token: sign(payload, getEnvVar('JWT_SECRET'), {
        expiresIn: `${expiresIn} days`,
      }),
      validity: datetimeYMDHis(null, 'days', expiresIn),
    };
  }

  async verifyAppUserToken(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        return res.status(401).json({ message: 'You are not logged in!' });

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as AppUserPayload;
        const userRepo = new AppUserRepository();
        const checkUser = await userRepo.findUserById(req.user.id);

        if (!checkUser)
          throw new UnauthorizedException('Invalid token provided!')
          // throw new UnauthorizedException('Invalid token provided!', new Date());

        if (checkUser)
          throw new UnauthorizedException('This user has been deleted!')
          // throw new UnauthorizedException('This user has been deleted!');

        next();
      } else {
        throw new UnauthorizedException('Auth token expired! Please login again.')
      }
    } catch (e: any) {
      // console.log('jwt middleware error', e);

      if (e instanceof CustomException) {
        return res.status(e.statusCode).json({
          error: {
            message: e.message,
          },
          code: e.statusCode,
        });
      }

      return res
        .status(500)
        .json({ message: 'Something went wrong! Please try again.' });
    }
  }

  async optionalVerifyAppUserToken(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        const payload = verify(token, getEnvVar('JWT_SECRET')) as any;
        if (payload) {
          req.user = payload as AppUserPayload;
          if (!payload.device_id) {
            const userRepo = new AppUserRepository();
            const checkUser = await userRepo.findUserById(req.user.id);

            if (!checkUser)
              throw new UnauthorizedException('Invalid token provided!')

            next();
          }
        } else {
          throw new UnauthorizedException('Auth token expired! Please login again.')
        }
      } else {
        next();
      }
    } catch (e: any) {
      // console.log(e);

      if (e instanceof CustomException) {
        return res.status(e.statusCode).json({
          error: {
            message: e.message,
          },
          code: e.statusCode,
        });
      }

      return res
        .status(500)
        .json({ message: 'Something went wrong! Please try again.' });
    }
  }
}
