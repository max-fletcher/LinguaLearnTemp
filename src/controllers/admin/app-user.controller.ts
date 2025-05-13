import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/user.services';
import { multipleFileLocalFullPathResolver } from '../../middleware/fileUploadLocal.middleware';
import { BadRequestException } from '../../errors/BadRequestException.error';

const appUserService = new AppUserService();

export async function getAllAppUsers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await appUserService.getAllAppUsers();

    return res.send({
      users: response,
    });
  } catch (error) {
    
    throw new CustomException('Bad Request', 400);
  }
}

export async function createAppUser(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const phoneNumberExists = await appUserService.userExistsByPhone(req.body.phoneNumber)
    if(phoneNumberExists)
      throw new BadRequestException('Phone number already taken.')

    const emailExists = await appUserService.userExistsByEmail(req.body.email)
    if(emailExists)
      throw new BadRequestException('Email already taken.')

    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { ...req.body, isNewUser: true, avatarUrl: filesWithFullPaths?.avatarUrl[0] }
    const response = await appUserService.storeAppUser(data);

    if(response)
      return res.status(201).json({
        data: {
          user: response,
          message: 'User created successfully!'
        },
        status_code: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('createAppUser', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
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

export async function updateAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const adminId = req.user!.id

    const data = { ...req.body, isNewUser: true }
    const response = await appUserService.updateAppUser(data, adminId);

    if(response)
      return res.json({
        data: {
          user: response,
          message: 'User updated successfully!'
        },
        status_code: 200,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('updateAppUser', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
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
