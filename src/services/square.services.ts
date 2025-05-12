import Stripe from 'stripe';
import { getEnvVar } from '../utils/common.utils';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { User } from 'types/app.user.type';
// import { CustomException } from '../errors/CustomException.error';
// import { StripeWebhookAdditionalData } from '../types/stripe.type';
import { CurrencyData } from '../types/currency.type';
import { CurrencyRepository } from '../db/rdb/repositories/currency.repository';
// import { TiersRepository } from '../db/rdb/repositories/tiers.repository';
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
import { Square, SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';
import { Tier } from '../types/tier.type';
import { Transaction } from 'sequelize';

export class SquareService {
  private squareClient: SquareClient;
  private appUserRepository: AppUserRepository;
  private currencyRepository: CurrencyRepository;
  // private tierRepository: TiersRepository;
  private eduContentRepository: EduContentMongoRepository;
  private eduContentPurchaseRepository: EduContentPurchaseMongoRepository;
  private transactionRepository: TransactionRepository;
  private cashBalanceHistoryRepository: CashBalanceHistoryRepository;
  private userTierStatusRepository: UserTierStatusRepository;
  private userBalanceRepository: UserBalanceRepository;
  private scTransactionRepository: SCTransactionHistoryRepository;

  constructor() {
    this.squareClient = new SquareClient({ environment: SquareEnvironment.Sandbox, token: getEnvVar('SQUARE_ACCESS_TOKEN') });
    this.appUserRepository = new AppUserRepository();
    this.currencyRepository = new CurrencyRepository();
    // this.tierRepository = new TiersRepository();
    this.eduContentRepository = new EduContentMongoRepository();
    this.eduContentPurchaseRepository = new EduContentPurchaseMongoRepository();
    this.transactionRepository = new TransactionRepository();
    this.cashBalanceHistoryRepository = new CashBalanceHistoryRepository();
    this.userTierStatusRepository = new UserTierStatusRepository();
    this.userBalanceRepository = new UserBalanceRepository();
    this.scTransactionRepository = new SCTransactionHistoryRepository();
  }

  async handleTierSubscriptionOneTime(
    paymentToken: string,
    appUser: User,
    tier: Tier,
    transaction?: Transaction,
  ) {
    let customer: Square.Customer|null = null;
    let squareCustomerResponse: Square.CreateCustomerResponse|null = null;

    if(appUser.square_customer_id)
      squareCustomerResponse = await this.squareClient.customers.get({
        customerId: appUser.square_customer_id
      }) as Square.CreateCustomerResponse;

    if(!squareCustomerResponse?.customer) {
      squareCustomerResponse = await this.squareClient.customers.create({
        givenName: appUser.name ? appUser.name : undefined,
        emailAddress: appUser.email ? appUser.email : undefined,
        phoneNumber: appUser.phone ? appUser.phone : undefined,
        referenceId: appUser.id,
        note: 'A Homerun app user'
      });

      if(squareCustomerResponse.customer)
        customer = squareCustomerResponse.customer

      await this.appUserRepository.updateUser({ square_customer_id: customer!.id }, appUser.id!);
    }

    if(squareCustomerResponse.customer)
      customer = squareCustomerResponse.customer

    const transactionId = generateTransactionId();
    const createPaymentResponse = await this.squareClient.payments.create({
      sourceId: paymentToken,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt((Number(tier.price)*100)),
        currency: "AUD",
      },
      customerId: customer!.id,
      locationId: getEnvVar('SQUARE_LOCATION_ID'),
      referenceId: transactionId,
      note: `${tier.name} Tier Purchase`,
    });

    // # Remove later when multiple currencies are implemented
    const defaultCurrency: CurrencyData = await this.currencyRepository.findCurrencyByShortCode('AUD');

    const currentDate = new Date();
    const startDate = new Date(datetimeYMDHis(currentDate, 'days', 0));
    const endDate = new Date(datetimeYMDHis(currentDate, 'days', tier.duration));

    await this.appUserRepository.updateUser(
      { guest: false },
      appUser.id,
      transaction,
    );

    await this.transactionRepository.createTransaction(
      mapToTransactionModel(
        transactionId,
        appUser.id,
        null,
        null,
        null,
        tier.id,
        null,
        TransactionTypes.TIER_PURCHASE,
        defaultCurrency.id,
        tier.price,
        createPaymentResponse.payment?.id ?? null,
        null,
        TransactionStatus.COMPLETED,
      ),
      transaction,
    );

    const cashBalanceHistoryId = generateCashBalanceHistoryId();
    await this.cashBalanceHistoryRepository.storeCashBalanceHistories(
      mapToCashBalanceHistoryModel(
        cashBalanceHistoryId,
        appUser.id,
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
        tier.id,
        appUser.id,
        startDate,
        endDate,
        false,
        null,
        null,
        AppUserTierStatus.ACTIVE,
        createPaymentResponse.payment!.id
      ),
      transaction,
    );

    await this.userBalanceRepository.addOrSubCashAndCoinBalanceAppUser(
      0,
      'sub',
      tier.coins_rewarded,
      'add',
      appUser.id,
      endDate,
      transaction,
    );

    const storeData = {
      id: generateSCBalanceHistoryId(),
      user_id: appUser.id,
      tier_id: tier.id,
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

  async handleTierSubscriptionRecurring(
    paymentToken: string,
    appUser: User,
    tier: Tier,
    transaction?: Transaction,
  ) {
    let customer: Square.Customer|null = null;
    let squareCustomerResponse: Square.CreateCustomerResponse|null = null;

    if(appUser.square_customer_id)
      squareCustomerResponse = await this.squareClient.customers.get({
        customerId: appUser.square_customer_id
      }) as Square.CreateCustomerResponse;

    if(!squareCustomerResponse?.customer) {
      squareCustomerResponse = await this.squareClient.customers.create({
        givenName: appUser.name ? appUser.name : undefined,
        emailAddress: appUser.email ? appUser.email : undefined,
        phoneNumber: appUser.phone ? appUser.phone : undefined,
        referenceId: appUser.id,
        note: 'A Homerun app user'
      });

      if(squareCustomerResponse.customer)
        customer = squareCustomerResponse.customer

      await this.appUserRepository.updateUser({ square_customer_id: customer!.id }, appUser.id!);
    }

    if(squareCustomerResponse.customer)
      customer = squareCustomerResponse.customer


    // NEED TO CREATE CARD AND ASSOCIATE IT WITH A CUSTOMER


    // const transactionId = generateTransactionId();
    // const createPaymentResponse = await this.squareClient.subscriptions.create({
    //   source: paymentToken,
    //   idempotencyKey: randomUUID(),
    //   amountMoney: {
    //     amount: BigInt(tier.price),
    //     currency: "AUD",
    //   },
    //   customerId: customer!.id!,
    //   locationId: getEnvVar('SQUARE_LOCATION_ID'),
    //   referenceId: transactionId,
    //   note: `${tier.name} Tier Purchase`,
    // });

    // if(createPaymentResponse.errors){
    //   console.log(createPaymentResponse.errors);
    //   throw new CustomException(`Couldn't process square payment. Please try again.`, 500)
    // }

    // console.log('paymentToken', paymentToken, 'appUser', appUser, 'customer', customer, 'squareCustomerResponse', squareCustomerResponse);

    // // # Remove later when multiple currencies are implemented
    // const defaultCurrency: CurrencyData = await this.currencyRepository.findCurrencyByShortCode('AUD');

    // const currentDate = new Date();
    // const startDate = new Date(datetimeYMDHis(currentDate, 'days', 0));
    // const endDate = new Date(
    //   datetimeYMDHis(currentDate, 'days', tier.duration),
    // );

    // await this.appUserRepository.updateUser(
    //   { guest: false },
    //   appUser.id,
    //   transaction,
    // );

    // await this.transactionRepository.createTransaction(
    //   mapToTransactionModel(
    //     transactionId,
    //     appUser.id,
    //     null,
    //     null,
    //     null,
    //     tier.id,
    //     null,
    //     TransactionTypes.TIER_PURCHASE,
    //     defaultCurrency.id,
    //     tier.price,
    //     null,
    //     null,
    //     TransactionStatus.COMPLETED,
    //   ),
    //   transaction,
    // );

    // const cashBalanceHistoryId = generateCashBalanceHistoryId();
    // await this.cashBalanceHistoryRepository.storeCashBalanceHistories(
    //   mapToCashBalanceHistoryModel(
    //     cashBalanceHistoryId,
    //     appUser.id,
    //     null,
    //     tier.id,
    //     null,
    //     null,
    //     CashBalanceHistoryReasonTypes.TIER_PURCHASE,
    //     defaultCurrency.id,
    //     tier.price,
    //   ),
    //   transaction,
    // );

    // const userTierStatusId = generateUserTierStatusId();
    // await this.userTierStatusRepository.storeUserTierStatuses(
    //   mapUserTierStatusModel(
    //     userTierStatusId,
    //     tier.id,
    //     appUser.id,
    //     startDate,
    //     endDate,
    //     true,
    //     null,
    //     null,
    //     AppUserTierStatus.ACTIVE,
    //     null,
    //     createPaymentResponse.payment!.id
    //   ),
    //   transaction,
    // );

    // await this.userBalanceRepository.addOrSubCashAndCoinBalanceAppUser(
    //   0,
    //   'sub',
    //   tier.coins_rewarded,
    //   'add',
    //   appUser.id,
    //   endDate,
    //   transaction,
    // );

    // const storeData = {
    //   id: generateSCBalanceHistoryId(),
    //   user_id: appUser.id,
    //   tier_id: tier.id,
    //   edu_content_id: null,
    //   auction_id: null,
    //   reason: SCTransactionHistoryReasonTypes.TIER_PURCHASE,
    //   amount: tier.coins_rewarded,
    // };

    // await this.scTransactionRepository.storeSCTransactionHistories(
    //   storeData,
    //   transaction,
    // );

    // return true;
  }

  async cancelSubscription(subscription_id: string) {
    // const subscription = await this.stripe.subscriptions.cancel(subscription_id);
    // // console.log(subscription);

    // if (!subscription)
    //   throw new CustomException(
    //     'Failed to cancel subscription. Please try again.',
    //     500,
    //   );

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
}
