import { DiscountStatus } from '../../constants/enums';
import { DiscountRepository } from '../../db/rdb/repositories/discount.repository';
import { CustomException } from '../../errors/CustomException.error';

export class AppDiscountService {
  private discountRepo: DiscountRepository;

  constructor() {
    this.discountRepo = new DiscountRepository();
  }

  async getPublishedDiscounts() {
    try {
      const discounts = await this.discountRepo.findAllDiscounts({
        where: {
          status: DiscountStatus.PUBLISHED,
        },
      });

      return discounts;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong', 500);
    }
  }
}
