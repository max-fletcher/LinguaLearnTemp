import { CurrencyRepository } from '../db/rdb/repositories/currency.repository';

export class CurrencyService {
  private currencyRepo: CurrencyRepository;

  constructor() {
    this.currencyRepo = new CurrencyRepository();
  }

  async findCurrencyById(id: string) {
    return await this.currencyRepo.findCurrencyById(id);
  }

  async findCurrencyByShortCode(shortName: string) {
    return await this.currencyRepo.findCurrencyByShortCode(shortName);
  }
}
