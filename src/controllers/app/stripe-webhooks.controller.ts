import Stripe from 'stripe';
import { Request, Response } from 'express';
import { getEnvVar } from '../../utils/common.utils';
import { UserClient } from '../../db/clients/postgres.client';
import { StripeService } from '../../services/stripe.services';
import {
  AppUserNotificationOptions,
  NotificationIcons,
  NotificationUserType,
  stripePaymentType,
} from '../../constants/enums';
import { AppUserService } from '../../services/user.services';
import { TierService } from '../../services/tier.services';
import { NotificationDataType } from '../../types/notification.type';
import { NotificationService } from '../../services/notification.service';

const stripe = new Stripe(getEnvVar('STRIPE_SECRET_KEY'));
const sequelize = UserClient.getInstance();
const stripeService = new StripeService();
const appUserService = new AppUserService();
const tierService = new TierService();
const notificationService = new NotificationService();

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event = req.body;
  const webhookSecret: string | null = getEnvVar('STRIPE_WEBHOOK_SECRET');

  if (webhookSecret) {
    const signature = req.headers['stripe-signature'] as string;
    // console.log(req.body, signature, webhookSecret);
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (err) {
      // console.log('Error verifying webhook signature:', err);
      return res
        .status(400)
        .send(`Webhook Error: ${(err as { message: string })?.message}`);
    }
  }

  // AVAILABLE EVENTS
  // checkout.session.completed
  // customer.subscription.created
  // customer.subscription.updated
  // customer.subscription.deleted
  // customer.subscription.cancelled
  // customer.subscription.failed
  // invoice.payment_succeeded
  // invoice.paid
  // invoice.payment_failed
  // charge.succeeded
  // charge.failed

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const transaction = await sequelize.transaction();
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            // console.log('subscription completed', subscription, subscription.metadata);

            if (subscription.metadata.paymentType && subscription.metadata.paymentType === stripePaymentType.TierSubscription && subscription.metadata.autoRenewal === 'yes'){
              await stripeService.handleTierSubscriptionRecurring(subscription, transaction);

              const appUser = await appUserService.findUserById(subscription.metadata.userId);
              const tierPurchased = await tierService.getTierById(subscription.metadata.tierId);

              // SEND NOTIFICATION
              if(appUser && tierPurchased){
                const url_path = { name: "MyPackage", params: null }
                const notificationData = {
                  user_id: subscription.metadata.userId,
                  title: `Message from Homerun. Your tier subscription has been renewed.`,
                  body: `Hello ${appUser.name}. Your tier subscription has been renewed successfully. Hence, you have been awarded ${tierPurchased.coins_rewarded} sweep coins and your credit card has been charged $${tierPurchased.price}.`,
                  icon: NotificationIcons.CROWN,
                  link_title: `See package details`,
                  url_path: JSON.stringify(url_path),
                  url_path_desktop: `/profile/my-package`,
                  type: NotificationUserType.APPUSER
                };
    
                let sendNotification = false;
                const currentDatetime = new Date().toISOString();
                if (appUser.notifications === AppUserNotificationOptions.ON || (appUser.disable_notifications_till && currentDatetime > appUser.disable_notifications_till))
                  sendNotification = true;
                await notificationService.storeNotification(notificationData as unknown as NotificationDataType, sendNotification);
              }
            }

            await transaction.commit();

            return res.status(200).json({
              data: {
                message: 'Webhook subscription succeeded.'
              },
              status_code: 200
            })
          } catch (error) {
            // console.log(`Error processing checkout.session.completed: ${error}`);
            await transaction.rollback();
            // # SEND BEAM NOTIFICATION ? IS THIS NEEDED/POSSIBLE ?
          }
        }
        break;
      }
      case 'customer.subscription.failed': {
        const subscription = event.data.object as Stripe.Subscription;
        try {
          // console.log('subscription failed', subscription, subscription.metadata);
          // handle subscription failed

          const appUser = await appUserService.findUserById(subscription.metadata.userId);
          const tierPurchased = await tierService.getTierById(subscription.metadata.tierId);

          // SEND NOTIFICATION

          if(appUser && tierPurchased){
            const url_path = { name: "MyPackage", params: null }
            const notificationData = {
              user_id: subscription.metadata.userId,
              title: `Message from Homerun. Something went wrong with your ${tierPurchased.name} tier subscription renewal`,
              body: `Hello ${appUser.name}. Something went wrong with your ${tierPurchased.name} tier subscription renewal. Please contact Homerun support for further information.`,
              icon: NotificationIcons.CROWN,
              link_title: `See all packages`,
              url_path: JSON.stringify(url_path),
              url_path_desktop: `/profile/my-package`,
              type: NotificationUserType.APPUSER
            };

            let sendNotification = false;
            const currentDatetime = new Date().toISOString();
            if (appUser.notifications === AppUserNotificationOptions.ON || (appUser.disable_notifications_till && currentDatetime > appUser.disable_notifications_till))
              sendNotification = true;
            await notificationService.storeNotification(notificationData as unknown as NotificationDataType, sendNotification);
          }

          return res.status(200).json({
            data: {
              message: 'Webhook subscription failed.'
            },
            status_code: 200
          })
        } catch (error) {
          console.log(`Error processing customer.subscription.failed: ${error}`);
          throw error;
        }
        break;
      }
      case 'charge.succeeded': {
        const payment = event.data.object as Stripe.Subscription;
        const transaction = await sequelize.transaction();
        try {
          // console.log('Payment charge succeeded', payment);
          if (payment.metadata.paymentType && payment.metadata.paymentType === stripePaymentType.TierSubscription && payment.metadata.autoRenewal === 'no'){
            await stripeService.handleTierSubscriptionOneTime(payment, transaction);

            const appUser = await appUserService.findUserById(payment.metadata.userId);
            const tierPurchased = await tierService.getTierById(payment.metadata.tierId);

            // SEND BEAM NOTIFICATION
            if(appUser && tierPurchased){
              const url_path = { name: "MyPackage", params: null }
              const notificationData = {
                user_id: payment.metadata.userId,
                title: `Message from Homerun. Your tier purchase has been successful.`,
                body: `Hello ${appUser.name}. Your tier purchase has been successful. Hence, you have been awarded ${tierPurchased.coins_rewarded} sweep coins and your credit card has been charged $${tierPurchased.price}.`,
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
            }
          }

          await transaction.commit();

          return res.status(200).json({
            data: {
              message: 'Webhook charge succeeded.'
            },
            status_code: 200
          })
        } catch (error) {
          // console.log(`Error processing charge.succeeded: ${error}`);
          await transaction.rollback();
          // # SEND BEAM NOTIFICATION. IS THIS NEEDED/NECESSARY ?
        }
        break;
      }
      case 'charge.failed': {
        const payment = event.data.object as Stripe.Subscription;
        try {
          // console.log('Payment charge failed', payment);
          // # handle payment failed

          const appUser = await appUserService.findUserById(payment.metadata.userId);
          const tierPurchased = await tierService.getTierById(payment.metadata.tierId);
          
          // SEND NOTIFICATION
          if(appUser && tierPurchased){
            const url_path = { name: "MyPackage", params: null }
            const notificationData = {
              user_id: payment.metadata.userId,
              title: `Message from Homerun. Something went wrong with your ${tierPurchased.name} tier puchase`,
              body: `Hello ${appUser.name}. Something went wrong with your ${tierPurchased.name} tier purchase. Please contact Homerun support for further information.`,
              icon: NotificationIcons.CROWN,
              link_title: `See all packages`,
              url_path: JSON.stringify(url_path),
              url_path_desktop: `/profile/my-package`,
              type: NotificationUserType.APPUSER
            };
  
            let sendNotification = false
            const currentDatetime = new Date().toISOString();
            if(appUser.notifications === AppUserNotificationOptions.ON || (appUser.disable_notifications_till && currentDatetime > appUser.disable_notifications_till))
              sendNotification = true
            await notificationService.storeNotification(notificationData as unknown as NotificationDataType, sendNotification);
          }

          return res.status(200).json({
            data: {
              message: 'Webhook charge failed.'
            },
            status_code: 200
          })
        } catch (error) {
          // console.log(`Error processing charge.failed: ${error}`);
          // # SEND BEAM NOTIFICATION. IS THIS NEEDED/NECESSARY ?
        }
        break;
      }
      default:
        // console.log('event type', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Full error object:', error);
    res.status(500).json({
      error: 'Error processing webhook',
      details: (error as Error).message,
    });
  }
};
