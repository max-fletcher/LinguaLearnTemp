import Stripe from 'stripe';
import { getEnvVar } from '../utils/common.utils';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { AppUserGenerateToken } from 'types/app.user.type';
import { CustomException } from '../errors/CustomException.error';
import { StripeWebhookAdditionalData } from '../types/stripe.type';
import { CurrencyData } from '../types/currency.type';
import { CurrencyRepository } from '../db/rdb/repositories/currency.repository';
import { TiersRepository } from '../db/rdb/repositories/tiers.repository';
import {
  AppUserTierStatus,
  CashBalanceHistoryReasonTypes,
  SCTransactionHistoryReasonTypes,
  TransactionStatus,
  TransactionTypes,
} from '../constants/enums';
import {
  generateCashBalanceHistoryId,
  generateEduContentPurcahseId,
  generateSCBalanceHistoryId,
  generateTransactionId,
  generateUserTierStatusId,
} from '../utils/id.utils';
import { mapToTransactionModel } from '../mapper/transaction.mapper';
import { TransactionRepository } from '../db/rdb/repositories/transaction.repository';
import { Transaction } from 'sequelize';
import { mapToCashBalanceHistoryModel } from '../mapper/cashBalanceHistory.mapper';
import { CashBalanceHistoryRepository } from '../db/rdb/repositories/cash-balance-histories.repository';
import { UserTierStatusRepository } from '../db/rdb/repositories/user-tier-status.repository';
import { mapUserTierStatusModel } from '../mapper/userTierStatus.mapper';
import { UserBalanceRepository } from '../db/rdb/repositories/user-balance.repository';
import { datetimeYMDHis } from '../utils/datetime.utils';
import { EduContentMongoRepository } from '../db/nosql/repository/edu-content.repository';
import { TEducationalContent } from '../types/edu-content.types';
import { EduContentPurchaseMongoRepository } from '../db/nosql/repository/edu-content-purchase.repository';
import { mapEduContentPurchaseModel } from '../mapper/eduContentPurchase.mapper';
import { SCTransactionHistoryRepository } from '../db/rdb/repositories/sc-transaction-history.repository';

export class StripeService {
  private stripe: Stripe;
  private appUserRepository: AppUserRepository;
  private currencyRepository: CurrencyRepository;
  private tierRepository: TiersRepository;
  private eduContentRepository: EduContentMongoRepository;
  private eduContentPurchaseRepository: EduContentPurchaseMongoRepository;
  private transactionRepository: TransactionRepository;
  private cashBalanceHistoryRepository: CashBalanceHistoryRepository;
  private userTierStatusRepository: UserTierStatusRepository;
  private userBalanceRepository: UserBalanceRepository;
  private scTransactionRepository: SCTransactionHistoryRepository;

  constructor() {
    this.stripe = new Stripe(getEnvVar('STRIPE_SECRET_KEY'));
    this.appUserRepository = new AppUserRepository();
    this.currencyRepository = new CurrencyRepository();
    this.tierRepository = new TiersRepository();
    this.eduContentRepository = new EduContentMongoRepository();
    this.eduContentPurchaseRepository = new EduContentPurchaseMongoRepository();
    this.transactionRepository = new TransactionRepository();
    this.cashBalanceHistoryRepository = new CashBalanceHistoryRepository();
    this.userTierStatusRepository = new UserTierStatusRepository();
    this.userBalanceRepository = new UserBalanceRepository();
    this.scTransactionRepository = new SCTransactionHistoryRepository();
  }

  async createCheckoutSession(
    user: AppUserGenerateToken,
    priceId: string,
    redirectUrl: string,
    additionalData: StripeWebhookAdditionalData,
    autoRenewal: boolean = false,
  ) {
    let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null;
    let existingCustomers: any = null;
    if (user.phone)
      existingCustomers = await this.stripe.customers.search({
        query: "phone:'" + user.phone + "'",
      });

    if (existingCustomers && existingCustomers.data.length > 0)
      customer = existingCustomers.data[0];

    if (!customer)
      existingCustomers = await this.stripe.customers.search({
        query: "email:'" + user.email + "'",
      });

    if (existingCustomers && existingCustomers.data.length > 0)
      customer = existingCustomers.data[0];

    if (!customer) {
      customer = await this.stripe.customers.create({
        phone: user.phone ?? undefined,
        email: user.email ?? undefined,
      });
      // # Kept this for if stripe is ever needed
      // await this.appUserRepository.updateUser(
      //   { stripe_customer_id: customer.id },
      //   user.id,
      // );
    }

    if (
      customer &&
      !customer.deleted &&
      ((!customer.phone && user.phone) || (!customer.email && user.email))
    )
      customer = await this.stripe.customers.update(customer.id, {
        phone: user.phone ?? undefined,
        email: user.email ?? undefined,
      });

    if (autoRenewal) {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: additionalData,
        },
        success_url: `${redirectUrl}?success=true&paymentType=${additionalData.paymentType}&userId=${additionalData.userId}&${additionalData.tierId ? ('tierId=' + additionalData.tierId) : ('eduContentId=' + additionalData.eduContentId)}`,
        cancel_url: `${redirectUrl}?canceled=true&paymentType=${additionalData.paymentType}&userId=${additionalData.userId}&${additionalData.tierId ? ('tierId=' + additionalData.tierId) : ('eduContentId=' + additionalData.eduContentId)}`,
      };

      return await this.stripe.checkout.sessions.create(sessionParams);
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: additionalData,
      },
      success_url: `${redirectUrl}?success=true&paymentType=${additionalData.paymentType}&userId=${additionalData.userId}&${additionalData.tierId ? ('tierId=' + additionalData.tierId) : ('eduContentId=' + additionalData.eduContentId)}`,
      cancel_url: `${redirectUrl}?canceled=true&paymentType=${additionalData.paymentType}&userId=${additionalData.userId}&${additionalData.tierId ? ('tierId=' + additionalData.tierId) : ('eduContentId=' + additionalData.eduContentId)}`,
    };

    return await this.stripe.checkout.sessions.create(sessionParams);
  }

  async handleTierSubscriptionRecurring(
    subscription: Stripe.Response<Stripe.Subscription>,
    transaction?: Transaction,
  ) {
    const defaultCurrency: CurrencyData =
      await this.currencyRepository.findCurrencyByShortCode('AUD');
    const tier = await this.tierRepository.getTiersById(
      subscription.metadata.tierId,
    );

    const currentDate = new Date();
    const startDate = new Date(datetimeYMDHis(currentDate, 'days', 0));
    const endDate = new Date(datetimeYMDHis(currentDate, 'days', tier.duration));

    await this.appUserRepository.updateUser(
      { guest: false },
      subscription.metadata.userId,
      transaction,
    );

    const transactionId = generateTransactionId();
    await this.transactionRepository.createTransaction(
      mapToTransactionModel(
        transactionId,
        subscription.metadata.userId,
        null,
        null,
        null,
        tier.id,
        null,
        TransactionTypes.TIER_PURCHASE,
        defaultCurrency.id,
        tier.price,
        subscription.latest_invoice ? subscription.latest_invoice?.toString() : null,
        null,
        TransactionStatus.COMPLETED,
      ),
      transaction,
    );

    const cashBalanceHistoryId = generateCashBalanceHistoryId();
    await this.cashBalanceHistoryRepository.storeCashBalanceHistories(
      mapToCashBalanceHistoryModel(
        cashBalanceHistoryId,
        subscription.metadata.userId,
        null,
        tier.id,
        null,
        null,
        CashBalanceHistoryReasonTypes.TIER_PURCHASE,
        defaultCurrency.id,
        tier.price,
      ),
      transaction,
    );

    const userTierStatusId = generateUserTierStatusId();
    await this.userTierStatusRepository.storeUserTierStatuses(
      mapUserTierStatusModel(
        userTierStatusId,
        subscription.metadata.tierId,
        subscription.metadata.userId,
        startDate,
        endDate,
        subscription.metadata.autoRenewal === 'yes' ? true : false,
        null,
        null,
        AppUserTierStatus.ACTIVE,
        subscription.id,
      ),
      transaction,
    );

    await this.userBalanceRepository.addOrSubCashAndCoinBalanceAppUser(
      0,
      'sub',
      tier.coins_rewarded,
      'add',
      subscription.metadata.userId,
      endDate,
      transaction,
    );

    const storeData = {
      id: generateSCBalanceHistoryId(),
      user_id: subscription.metadata.userId,
      tier_id: subscription.metadata.tierId,
      edu_content_id: null,
      auction_id: null,
      reason: SCTransactionHistoryReasonTypes.TIER_PURCHASE,
      amount: tier.coins_rewarded,
    };

    await this.scTransactionRepository.storeSCTransactionHistories(
      storeData,
      transaction,
    );

    return true;
  }

  async handleTierSubscriptionOneTime(
    payment: Stripe.Subscription,
    transaction?: Transaction,
  ) {
    const defaultCurrency: CurrencyData =
      await this.currencyRepository.findCurrencyByShortCode('AUD');
    const tier = await this.tierRepository.getTiersById(
      payment.metadata.tierId,
    );

    const currentDate = new Date();
    const startDate = new Date(datetimeYMDHis(currentDate, 'days', 0));
    const endDate = new Date(
      datetimeYMDHis(currentDate, 'days', tier.duration),
    );

    await this.appUserRepository.updateUser(
      { guest: false },
      payment.metadata.userId,
      transaction,
    );

    const transactionId = generateTransactionId();
    await this.transactionRepository.createTransaction(
      mapToTransactionModel(
        transactionId,
        payment.metadata.userId,
        null,
        null,
        null,
        tier.id,
        null,
        TransactionTypes.TIER_PURCHASE,
        defaultCurrency.id,
        tier.price,
        payment.latest_invoice ? payment.latest_invoice?.toString() : null,
        null,
        TransactionStatus.COMPLETED,
      ),
      transaction,
    );

    const cashBalanceHistoryId = generateCashBalanceHistoryId();
    await this.cashBalanceHistoryRepository.storeCashBalanceHistories(
      mapToCashBalanceHistoryModel(
        cashBalanceHistoryId,
        payment.metadata.userId,
        null,
        tier.id,
        null,
        null,
        CashBalanceHistoryReasonTypes.TIER_PURCHASE,
        defaultCurrency.id,
        tier.price,
      ),
      transaction,
    );

    const userTierStatusId = generateUserTierStatusId();
    await this.userTierStatusRepository.storeUserTierStatuses(
      mapUserTierStatusModel(
        userTierStatusId,
        payment.metadata.tierId,
        payment.metadata.userId,
        startDate,
        endDate,
        payment.metadata.autoRenewal === 'yes' ? true : false,
        null,
        null,
        AppUserTierStatus.ACTIVE,
        payment.id,
      ),
      transaction,
    );

    await this.userBalanceRepository.addOrSubCashAndCoinBalanceAppUser(
      0,
      'sub',
      tier.coins_rewarded,
      'add',
      payment.metadata.userId,
      endDate,
      transaction,
    );

    const storeData = {
      id: generateSCBalanceHistoryId(),
      user_id: payment.metadata.userId,
      tier_id: payment.metadata.tierId,
      edu_content_id: null,
      auction_id: null,
      reason: SCTransactionHistoryReasonTypes.TIER_PURCHASE,
      amount: tier.coins_rewarded,
    };

    await this.scTransactionRepository.storeSCTransactionHistories(
      storeData,
      transaction,
    );

    return true;
  }

  async cancelSubscription(subscription_id: string) {
    const subscription =
      await this.stripe.subscriptions.cancel(subscription_id);
    // console.log(subscription);

    if (!subscription)
      throw new CustomException(
        'Failed to cancel subscription. Please try again.',
        500,
      );

    return true;
  }

  async handleEduContentPurchase(
    payment: Stripe.Subscription,
    transaction?: Transaction,
  ) {
    const defaultCurrency: CurrencyData =
      await this.currencyRepository.findCurrencyByShortCode('AUD');
    const eduContent = this.eduContentRepository.getEduContentByUniqueId(
      payment.metadata.eduContentId,
    ) as unknown as TEducationalContent;

    const transactionId = generateTransactionId();
    await this.transactionRepository.createTransaction(
      mapToTransactionModel(
        transactionId,
        payment.metadata.userId,
        null,
        null,
        eduContent._id!.toString(),
        null,
        null,
        CashBalanceHistoryReasonTypes.EDU_CONTENT_PURCHASE,
        defaultCurrency.id,
        eduContent.price,
        payment.latest_invoice ? payment.latest_invoice?.toString() : null,
        null,
        TransactionStatus.COMPLETED,
      ),
      transaction,
    );

    const cashBalanceHistoryId = generateCashBalanceHistoryId();
    await this.cashBalanceHistoryRepository.storeCashBalanceHistories(
      mapToCashBalanceHistoryModel(
        cashBalanceHistoryId,
        payment.metadata.userId,
        null,
        null,
        eduContent.uniqueId!,
        null,
        CashBalanceHistoryReasonTypes.EDU_CONTENT_PURCHASE,
        defaultCurrency.id,
        eduContent.price,
      ),
      transaction,
    );

    const eduContentPurchaseId = generateEduContentPurcahseId();
    await this.eduContentPurchaseRepository.createEduContentPurchase(
      mapEduContentPurchaseModel(
        eduContentPurchaseId,
        eduContent._id!,
        payment.metadata.userId,
      ),
    );

    await this.userBalanceRepository.addOrSubCashAndCoinBalanceAppUser(
      0,
      'sub',
      eduContent.price,
      'add',
      payment.metadata.userId,
      null,
      transaction,
    );

    return true;
  }

  async updateProduct(productId: string, productName: string, price: number, previousPrice: number, currencyCode: string){
    console.log(price, previousPrice, Number(price), Number(previousPrice), Number(price) !== Number(previousPrice));
    if(Number(price) !== Number(previousPrice)){
      console.log('halao');
      const newPrice = await this.stripe.prices.create({ currency: currencyCode, unit_amount: price * 100, product: productId });
      const updateParams: Stripe.ProductUpdateParams = { name: productName, default_price: newPrice.id };
      return await this.stripe.products.update(productId, updateParams);
    }

    const updateParams: Stripe.ProductUpdateParams = { name: productName };
    return await this.stripe.products.update(productId, updateParams);
  };

  async archiveProduct(productId: string){
    const updateParams: Stripe.ProductUpdateParams = { active: false };
    return await this.stripe.products.update(productId, updateParams);
  };
}
