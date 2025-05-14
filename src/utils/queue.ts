import Agenda from "agenda";
import { getEnvVar } from '../utils/common.utils';
import { AppUserService } from "../services/admin/app-user.services";
import { UserClient } from "../db/clients/postgres.client";
import { AppUserBalanceService } from "../services/app-user-balance.services";
import { CustomException } from "../errors/CustomException.error";
import { FirebaseNotificationService } from "../services/firebase-notification.service";

const sequelize = UserClient.getInstance();
const appUserService = new AppUserService();
const appUserBalanceService = new AppUserBalanceService();
const firebaseService = FirebaseNotificationService.getInstance();

export const jobQueue = new Agenda({
  db: {
    address: getEnvVar('CONTENT_MONGO_URI'),
    collection: "jobs",
  },
});

jobQueue.define("testQueue", async (job: any) => {
  try {
    const data = job?.attrs?.data;
    console.log("This job is running as soon as it was received. This is the data that was sent:");
    console.log("------------------------------");
    console.log(data);

    return true
  } catch (error) {
    // console.log('Error from testQueue', error)
  }
});

jobQueue.define("deleteAppUser", async (job: any) => {
  try {
    const data = job?.attrs?.data;
    // console.log('deleteAppUser queue worker data', data);
    
    const transaction = await sequelize.transaction();
    const confirmed = await appUserService.confirmAccountWipeout(data.userId, data.reason, transaction);
    const zeroBalance = await appUserBalanceService.setAppUserBalancesToZeroById(data.userId, transaction);
    await transaction.commit();

    if(!confirmed || !zeroBalance)
      throw new CustomException('Something went wrong with your account deletion!', 500);

    return true
  } catch (error) {
    // console.log('Error from deleteAppUser', error)
  }
});

jobQueue.define("sendNotificationToAllAppUser", async (job: any) => {
  try {
    const data = job?.attrs?.data;
    const select = ['id', 'name', 'username']
    console.log('sendNotificationToAllAppUser queue worker data', data);

    const appUsers = await appUserService.getAllAppUsersWithOptions(select);
    appUsers.forEach(async (appUser) => {
      await firebaseService.processAppNotification(
        appUser.id,
        data.title,
        data.message,
      );
    })

    return true
  } catch (error) {
    console.log('Error from sendNotificationToAllAppUser', error)
  }
});