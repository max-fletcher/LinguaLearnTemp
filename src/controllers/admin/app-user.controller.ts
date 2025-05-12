import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/user.services';

const appUserService = new AppUserService();

export async function getAppUsers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await appUserService.getAllAppUsers();

    return res.send({
      users: response,
    });
  } catch (error) {
    // console.log(error);
    throw new CustomException('Bad Request', 400);
  }
}

export async function invalidateAllAppUserTokens(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await appUserService.invalidateAllAppUserTokens();

    if(response)
      return res.status(200).json({
        message: "All app user tokens invalidated successfully!"
      });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}
