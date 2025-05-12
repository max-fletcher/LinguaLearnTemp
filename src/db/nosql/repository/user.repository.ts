import { UserMongo } from '../../../types/app.user.type';
import AppUserModel from '../model/user.model';

export class UserMongoRepository {
  async getUser(email: string) {
    const user = await AppUserModel.findOne({ email: email });
    return user;
  }

  async createUser(user: UserMongo) {
    await AppUserModel.create(user);
  }
}
