import { AdminUserPayload } from '../../schema/token-payload.schema';
import { AdminAuthService } from '../../services/admin/auth.service';
import { generateToken } from '../../utils/jwt.utils';
import { Request, Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';

const adminAuthService = new AdminAuthService();

export async function login(req: Request, res: Response) {
  try {
    const response = await adminAuthService.adminLogin(req.body);

    const user = {
      id: response.user.id,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: response.user.email,
      phoneNumber: response.user.phoneNumber,
    } as AdminUserPayload

    const token = generateToken(user);
  
    return res.json({
      data: {
        user: user,
        jwt: token,
      },
      status_code: 200,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
      });
    }

    res.status(500).send({
      error: error,
    });
  }
}
