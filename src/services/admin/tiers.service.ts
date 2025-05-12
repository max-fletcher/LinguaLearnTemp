import { TiersModel } from '../../db/rdb/models';
import { TiersRepository } from '../../db/rdb/repositories/tiers.repository';
import { CustomException } from '../../errors/CustomException.error';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { TiersRequestSchema } from '../../schema/tiers.schema';
import { UpdateTier } from '../../types/tier.type';
import { createTierId } from '../../utils/id.utils';
import { CurrencyService } from '../currency.services';
import { StripeService } from '../stripe.services';

export class TierService {
  private tierRepository: TiersRepository;
  private stripeService: StripeService
  private currencyService: CurrencyService

  constructor() {
    this.tierRepository = new TiersRepository();
    this.stripeService = new StripeService();
    this.currencyService = new CurrencyService();
  }

  async getAllTiers() {
    const tiers = await this.tierRepository.getAllTiers();

    return tiers;
  }

  async getTierDetails(id: string) {
    const tiers = await this.tierRepository.getTiersById(id);
    return tiers;
  }

  async getSelectedTiers(order: string[]) {
    try {
      const tiers = await this.tierRepository.getSelectedTiers(order);

      return tiers;
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }

      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  async createTiers(request: TiersRequestSchema) {
    try {
      const id = createTierId();
      const perks = request.perks ? request.perks : [];

      const tiers = await this.tierRepository.storeTiers({
        ...request,
        id: id,
        perks: perks,
      } as unknown as TiersModel);

      if (tiers) {
        return {
          tiers: tiers,
          message: 'Tier created successfully',
          status: 201,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }

      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  async updateTier(request: UpdateTier, id: string) {
    try {
      const checkTier = await this.tierRepository.getTiersById(id);
      const perks = request.perks ? request.perks : [];

      if (!checkTier) throw new NotFoundException('Tiers not found');

      // # Change later if currency becomes dynamic
      const currency = await this.currencyService.findCurrencyByShortCode('AUD')
      // const currency = await currencyService.findCurrencyById(req.body.currency_id, ['id', 'short_code'])
      if(!currency)
        throw new NotFoundException('Currency not found.')

      // Kept this here in case stripe is ever needed again
      // const updateProduct = await this.stripeService.updateProduct(checkTier.stripe_product_id, request.name, request.price, checkTier.price, currency.short_code)
      // if(!updateProduct)
      //   throw new CustomException('Failed to create stripe product.', 500)
      // request.stripe_price_id = updateProduct.default_price as string

      await this.tierRepository.updateTiers({
        ...request,
        perks: perks,
        id,
      } as unknown as TiersModel);

      return {
        message: 'Tier update successfully',
        status: 200,
      };
    } catch (error) {
      if (error instanceof CustomException)
        return {
          message: error.message,
          status: error.statusCode,
        };

      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }

  async deleteTiers(id: string) {
    try {
      const tiers = await this.tierRepository.deleteTiers(id);

      if (tiers) {
        return {
          message: 'Tier delete successfully',
          status: 200,
        };
      } else {
        throw new NotFoundException('Tiers not found');
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }

      return {
        message: 'Something went wrong',
        status: 400,
      };
    }
  }
}
