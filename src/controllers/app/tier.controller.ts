import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { Response } from 'express';
import { TierService } from '../../services/tier.services';
// import { StripeService } from '../../services/stripe.services';
// import { getEnvVar } from '../../utils/common.utils';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { AppUserBalanceService } from '../../services/app-user-balance.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { CustomException } from '../../errors/CustomException.error';
import {
  formatGetAllTiers,
  formatPackagePageData,
  formatSingleTier,
  formatUserActiveTiers,
} from '../../formatter/tier.formatter';
// import { stripePaymentType } from '../../constants/enums';
import { AppUserService } from '../../services/user.services';
import { SquareService } from '../../services/square.services';
import { SquareError } from 'square';
import { UserClient } from '../../db/clients/postgres.client';
import { AppUserNotificationOptions, NotificationIcons, NotificationUserType } from '../../constants/enums';
import { NotificationDataType } from '../../types/notification.type';
import { NotificationService } from '../../services/notification.service';

const appUserService = new AppUserService();
const tierService = new TierService();
const appUserBalanceService = new AppUserBalanceService();
const squareService = new SquareService();
// const stripeService = new StripeService();
const sequelize = UserClient.getInstance();
const notificationService = new NotificationService();

export async function getAllTiers(req: AppAuthenticatedRequest, res: Response) {
  try {
    const allTiersData = await tierService.getAllTiers([
      'id',
      'name',
      'order',
      'price',
      'duration',
      'coins_rewarded',
      'perks',
      'exclusive_access',
      'exclusive_perks',
    ]);

    const mostPopular = await tierService.findMostPopular();
    const allTiers = formatGetAllTiers(allTiersData, mostPopular);

    return res.json({
      data: {
        tiers: allTiers,
        mostPopular: mostPopular
      },
      status_code: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        status_code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      status_code: 500,
    });
  }
}

export async function getSingleTierById(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const tierId = req.params.id;
    if (!tierId) throw new BadRequestException('Tier id not given !');

    const tierData = await tierService.getTierById(tierId, [
      'id',
      'name',
      'price',
      'duration',
      'coins_rewarded',
      'perks',
      'exclusive_access',
      'exclusive_perks',
    ]);
    if (!tierData) throw new NotFoundException('Tier with this id not found !');

    const tier = formatSingleTier(tierData);

    return res.json({
      data: {
        tier: tier,
      },
      status_code: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        status_code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      status_code: 500,
    });
  }
}

export async function getUserActiveTiers(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const appUserBalance =
      await appUserBalanceService.findAppUserBalanceByUserId(req.user!.id, [
        'cash_balance',
      ]);

    const tierData = await tierService.getUserSubscribedTiers(req.user!.id);
    const userTiers = formatUserActiveTiers(tierData);

    return res.json({
      data: {
        user_cash_balance: appUserBalance.coin_balance,
        user_tiers: userTiers,
      },
      status_code: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        status_code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      status_code: 500,
    });
  }
}

export async function purchaseTier(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  const transaction = await sequelize.transaction();
  try {
    const tierId = req.body.tier_id;
    const paymentToken = req.body.payment_token;

    // # Remove later if client wants auto-renewal on
    req.body.auto_renewal = false;

    const appUser = await appUserService.findUserById(req.user!.id, ['id', 'name', 'email', 'phone', 'country', 'notifications', 'disable_notifications_till'])
    if (!appUser) throw new NotFoundException('App user not found!');

    const tier = await tierService.getTierById(tierId, ['id', 'name', 'price', 'duration', 'coins_rewarded']);
    if (!tier) throw new NotFoundException('Tier not found!');

    let response = null
    if(req.body.auto_renewal)
      response = await squareService.handleTierSubscriptionRecurring(paymentToken, appUser, tier, transaction)
    else
      response = await squareService.handleTierSubscriptionOneTime(paymentToken, appUser, tier, transaction)

    if(!response)
      throw new CustomException('Payment processing failed. Please try again.', 500)

    transaction.commit();

    const url_path = { name: "MyPackage", params: null }
    const notificationData = {
      user_id: appUser.id,
      title: `Message from Homerun. Your tier purchase has been successful`,
      body: `Hello ${appUser.name}. Your tier purchase has been successful. Hence, you have been awarded ${tier.coins_rewarded} sweep coins and your credit card has been charged $${tier.price}.`,
      icon: NotificationIcons.CROWN,
      link_title: `See package details`,
      url_path: JSON.stringify(url_path),
      url_path_desktop: `/profile/my-package`,
      type: NotificationUserType.APPUSER
    };

    let sendNotification = false
    const currentDatetime = new Date().toISOString();
    if(appUser.notifications === AppUserNotificationOptions.ON || (appUser.disable_notifications_till && currentDatetime > appUser.disable_notifications_till))
      sendNotification = true
    await notificationService.storeNotification(notificationData as unknown as NotificationDataType, sendNotification);

    return res.json({
      data: {
        message: 'Tier purchased successfully!',
        tier: tier
      },
      status_code: 200,
    });
  } catch (e) {
    console.log('purchaseTier error', e);
    transaction.rollback();
    if (e instanceof SquareError) {
      return res.status(Number(e.statusCode)).send({
        error: {
          message: e.errors[0].detail,
        },
        status_code: e.statusCode,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        status_code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      status_code: 500,
    });
  }
}

// # Kept if stripe if ever needed again
// export async function purchaseTierStripe(req: AppAuthenticatedRequest, res: Response) {
//   try {
//     const tierId = req.body.tier_id

//     const tier = await tierService.getTierById(tierId);
//     if(!tier)
//       throw new NotFoundException('Tier not found!');
  
//     // # Remove later if client wants auto-renewal on
//     req.body.auto_renewal = false
  
//     const additionalData = { userId: req.user!.id, paymentType: stripePaymentType.TierSubscription, tierId: tier.id, autoRenewal: req.body.auto_renewal ? 'yes' : 'no' };
//     const priceId = req.body.auto_renewal ? tier.stripe_price_id_recurring : tier.stripe_price_id_single;
//     const redirectBaseUrl = getEnvVar('STRIPE_REDIRECT_BASE_URL');
//     const session = await stripeService.createCheckoutSession(req.user!, priceId, redirectBaseUrl, additionalData, req.body.auto_renewal);
  
//     return res.json({
//       data:{
//         message: 'Checkout generated.',
//         stripe_session: session
//       },
//       status_code: 200
//     });
//   } catch (e) {
//     if (e instanceof CustomException) {
//       return res
//         .status(e.statusCode)
//         .json({ 
//           error:{
//             message: e.message
//           },
//           status_code: e.statusCode 
//         });
//     }

//     return res
//       .status(500)
//       .json({
//         error:{
//           message: 'Something went wrong! Please try again.',
//         },
//         status_code: 500 
//       });
//   }
// }

export async function getPackagePageData(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const packagePageData = await tierService.getPackagePageData(req.user!.id);
    const getAllTiers = await tierService.getAllTiers(['id', 'name', 'order']);
    const memoizedAllTiers: any = {};
    getAllTiers.map((tier) => (memoizedAllTiers[tier.order] = tier.id));
    const formattedPackagePageData = formatPackagePageData(
      packagePageData,
      memoizedAllTiers,
    );

    return res.json({
      data: {
        package_page_data: formattedPackagePageData,
      },
      status_code: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        status_code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      status_code: 500,
    });
  }
}
