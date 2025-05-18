import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/admin/app-user.services';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from '../../middleware/fileUploadLocal.middleware';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { NotFoundException } from '../../errors/NotFoundException.error';

const appUserService = new AppUserService();

export async function getAllAppUsers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const users = await appUserService.getAllAppUsers();

    return res.status(200).json({
      data: {
        message: 'User list fetched successfully!',
        users: users,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log('getAllAppUsers', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function getSingleAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id
    const user = await appUserService.findUserById(appUserId);

    if(!user)
      throw new NotFoundException('User not found.')
    if(user.deletedAt)
      throw new NotFoundException('User not found.')

    return res.status(200).json({
      data: {
        message: 'User fetched successfully!',
        user: user,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log('getSingleAllAppUser', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function createAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const phoneNumberExists = await appUserService.userExistsByPhone(req.body.phoneNumber)
    if(phoneNumberExists)
      throw new BadRequestException('Phone number already taken.')

    if(req.body.email){
      const emailExists = await appUserService.userExistsByEmail(req.body.email)
      if(emailExists)
        throw new BadRequestException('Email already taken.')
    }

    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { ...req.body, isNewUser: true, avatarUrl: filesWithFullPaths?.avatarUrl[0] }
    const response = await appUserService.storeAppUser(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'User created successfully!',
          user: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('createAppUser', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function updateAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id
    const user = await appUserService.findUserById(appUserId, ['id', 'avatarUrl', 'deletedAt'])
    if(!user)
      throw new NotFoundException('User not found.')
    if(user.deletedAt)
      throw new NotFoundException('User not found.')

    if(req.body.phoneNumber){
      const phoneNumberExists = await appUserService.userExistsByPhone(req.body.phoneNumber, appUserId)
      if(phoneNumberExists)
        throw new BadRequestException('Phone number already taken.')
    }

    if(req.body.email){
      const emailExists = await appUserService.userExistsByEmail(req.body.email, appUserId)
      if(emailExists)
        throw new BadRequestException('Email already taken.')
    }

    let data = { ...req.body }

    if(req.files?.avatarUrl && req.files?.avatarUrl.length > 0){
      if(user.avatarUrl)
        deleteMultipleFileLocal(req, [user.avatarUrl])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, avatarUrl: filesWithFullPaths?.avatarUrl[0] }
    }

    const response = await appUserService.updateAppUser(data, appUserId);

    if(response){
      const user = await appUserService.findUserById(appUserId);
      return res.json({
        data: {
          message: 'User updated successfully!',
          user: user,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('updateAppUser', error);
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function deleteAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id

    const user = await appUserService.findUserById(appUserId)
    if(!user)
      throw new NotFoundException('User not found.')
    if(user.deletedAt)
      throw new NotFoundException('User not found.')

    if(user.avatarUrl)
      deleteMultipleFileLocal(req, [user.avatarUrl])

    const response = await appUserService.deleteAppUser(appUserId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'User deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('updateAppUser', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}