import { Transaction } from 'sequelize';
import { UserBalanceRepository } from '../db/rdb/repositories/user-balance.repository';

export class AppUserBalanceService {
  private userBalanceRepo: UserBalanceRepository;

  constructor() {
    this.userBalanceRepo = new UserBalanceRepository();
  }

  async findAppUserBalanceByUserId(id: string, attributes: any = null) {
    return await this.userBalanceRepo.findAppUserBalanceByUserId(
      id,
      attributes,
    );
  }

  async setAppUserBalancesToZeroById(id: string, transaction: Transaction | null = null) {
    return await this.userBalanceRepo.setAppUserBalancesToZeroById(id, transaction);
  }
}
