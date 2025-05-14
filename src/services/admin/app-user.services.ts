import { Transaction } from 'sequelize';
import { AppUserRepository } from '../../db/rdb/repositories/app-user.repository';
import { StoreAppUserData, UpdateAppUserData } from '../../types/app-user.type';
import { generateId } from '../../utils/id.utils';

export class AppUserService {
  private appUserRepo: AppUserRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
  }

  async findUserById(id: string, select: string[]|null = null) {
    return await this.appUserRepo.findUserById(id, select);
  }

  async userExistsById(id: string) {
    return await this.appUserRepo.userExistsById(id);
  }

  async findUserByEmail(email: string) {
    return await this.appUserRepo.findUserByEmail(email);
  }

  async userExistsByEmail(email: string, exceptId: string | null = null) {
    return await this.appUserRepo.userExistsByEmail(email, exceptId);
  }

  async findUserByPhone(phoneNumber: string, exceptId: string | null = null) {
    return await this.appUserRepo.findUserByPhone(phoneNumber, exceptId);
  }

  async userExistsByPhone(phoneNumber: string, exceptId: string | null = null) {
    return await this.appUserRepo.userExistsByPhone(phoneNumber, exceptId);
  }

  async getAllAppUsers() {
    return await this.appUserRepo.getAllAppUsers();
  }

  async getAllAppUsersWithOptions(select: string[]|null = null) {
    return await this.appUserRepo.getAllAppUsersWithOptions(select);
  }

  async storeAppUser(data: StoreAppUserData, transaction?: Transaction) {
    const id = generateId()
    return await this.appUserRepo.storeAppUser({ id, ...data }, transaction);
  }

  async updateAppUser(data: UpdateAppUserData, id: string, transaction?: Transaction) {
    return await this.appUserRepo.updateAppUser(data, id, transaction);
  }

  async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.appUserRepo.deleteAppUser(id, deletedBy, transaction);
  }
}
