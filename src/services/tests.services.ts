// COMMENTED TO MITIGATE TYPESCRIPT ERRORS

// import { generateUserId } from '../utils/id.utils';
import { Request } from 'express';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
// import { mapToUserModel } from '../mapper/user.mapper';
// import { hashPassword } from '../utils/password.utils';
// import { AuthProviders } from '../constants/enums';
// import { deleteMultipleFileLocal } from '../middleware/fileUploadLocal.middleware';
import { CustomException } from '../errors/CustomException.error';
import { NotFoundException } from '../errors/NotFoundException.error';

export class TestService {
  private userRepo: AppUserRepository;

  constructor() {
    this.userRepo = new AppUserRepository();
  }

  async createUserWithImages(
    username: string,
    email: string,
    password: string,
    phone: string,
    images: string[] | null,
  ) {
    // COMMENTED TO MITIGATE TYPESCRIPT ERRORS

    // const id = generateUserId();
    // const hashedPassword = await hashPassword(password);
    // const newUser = mapToUserModel(
    //   id,
    //   username,
    //   email,
    //   hashedPassword,
    //   '',
    //   '',
    //   '',
    //   AuthProviders.PHONE,
    //   images,
    // );

    console.log(username, email, password, phone, images);

    // const rdsUser = await this.userRepo.createUser(newUser);
    const rdsUser = await this.userRepo.findUserByEmail(email);
    return {
      user: rdsUser,
    };
  }

  async deleteUserWithImages(req: Request, id: string) {
    const rdsUser = await this.userRepo.findUserById(id);
    if (!rdsUser) throw new NotFoundException('User with given ID not found !');

    // COMMENTED TO MITIGATE TYPESCRIPT ERRORS

    // deleteMultipleFileLocal(req, rdsUser.images!);
    const result = await this.userRepo.hardDeleteById(id);

    if (!result)
      throw new CustomException('Failed to delete! Please try again.', 500);

    return {
      message: 'User deleted successfully!',
      statusCode: 200,
      data: rdsUser,
    };
  }
}
