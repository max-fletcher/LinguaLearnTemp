// import { CurrencyData } from 'types/currency.type';
// import { AppUserStatus } from '../../../constants/enums';
// import { hashPassword } from '../../../utils/password.utils';
// import { UserModel } from '../models';
// import { CurrencyRepository } from '../repositories/currency.repository';

const seedAppUsers = async () => {
  // const currencyRepo = new CurrencyRepository();
  // const defaultCurrency: CurrencyData = await currencyRepo.findCurrencyByShortCode('AUD');

  try {
    // const appUsers = [
    //   {
    //     id: 'usr_56913465891340',
    //     username: null,
    //     email: 'mahin.chowdhury.1991@gmail.com',
    //     password: null,
    //     phone: '+8801762214315',
    //     otp: null,
    //     otp_expires_at: null,
    //     providers: [],
    //     profile_image_url: null,
    //     avatar_url: null,
    //     country: 'Australia',
    //     currency_id: defaultCurrency.id,
    //     status: AppUserStatus.ACTIVE,
    //     guest: true,
    //     verified: true,
    //     stripe_customer_id: null,
    //     notifications: 'ON',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     id: 'usr_56913465891350',
    //     username: 'User 2',
    //     email: 'user2@mail.com',
    //     password: await hashPassword('password'),
    //     phone: '23456789',
    //     otp: '123456',
    //     otp_expires_at: '2024-10-10 12:00:00',
    //     providers: [],
    //     profile_image_url: null,
    //     avatar_url: null,
    //     country: 'Australia',
    //     currency_id: defaultCurrency.id,
    //     status: AppUserStatus.ACTIVE,
    //     guest: false,
    //     verified: true,
    //     stripe_customer_id: null,
    //     notifications: 'ON',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     id: 'usr_56913465891360',
    //     username: 'User 3',
    //     email: 'user3@mail.com',
    //     password: await hashPassword('password'),
    //     phone: '34567890',
    //     otp: '123456',
    //     otp_expires_at: '2024-10-10 12:00:00',
    //     providers: [],
    //     profile_image_url: null,
    //     avatar_url: null,
    //     country: 'Australia',
    //     currency_id: defaultCurrency.id,
    //     status: AppUserStatus.ACTIVE,
    //     guest: false,
    //     verified: true,
    //     stripe_customer_id: null,
    //     notifications: 'ON',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

    // const appUsersBalances = [
    //   {
    //     id: 'usrb_56913465891340',
    //     user_id: 'usr_56913465891340',
    //     admin_user_id: null,
    //     cash_balance: 50,
    //     coin_balance: 50,
    //     exp_date: new Date(),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     id: 'usrb_56913465891350',
    //     user_id: 'usr_56913465891350',
    //     admin_user_id: null,
    //     cash_balance: 100,
    //     coin_balance: 100,
    //     exp_date: new Date(),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     id: 'usrb_56913465891360',
    //     user_id: 'usr_56913465891360',
    //     admin_user_id: null,
    //     cash_balance: 150,
    //     coin_balance: 150,
    //     exp_date: new Date(),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

    // await UserModel.bulkCreate(appUsers);
    // console.log('App users have been seeded successfully');
  } catch (error) {
    // console.error('Error seeding app users:', error);
  }
};

export { seedAppUsers };
