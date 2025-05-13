// import { UserStatus, UserTypes } from '../../../constants/enums';
import { generateId } from '../../../utils/id.utils';
import { hashPassword } from '../../../utils/password.utils';
import { AdminUserModel } from '../models';

const seedAdminUsers = async () => {
  try {
    const adminUsers = [
      {
        id: generateId(),
        firstName: 'Admin',
        lastName: 'One',
        email: 'admin1@mail.com',
        phoneNumber: '1234567890',
        password: await hashPassword('password'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await AdminUserModel.bulkCreate(adminUsers);
    // console.log('Admin users have been seeded successfully');
  } catch (error) {
    console.error('Error seeding admin users:', error);
  }
};

export { seedAdminUsers };
