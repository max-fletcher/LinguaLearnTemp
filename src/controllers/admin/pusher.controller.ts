import { Response } from 'express';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { CustomException } from '../../errors/CustomException.error';
import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { PusherService } from '../../services/pusher.service';

const adminUserRepo = new AdminUserRepository();
const pusherService = new PusherService();

export async function authorizedPusherChannel(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.body.user_id;
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;

    if (!userId) {
      throw new CustomException('User id is required', 400);
    }

    const adminUser = await adminUserRepo.findUserById(userId);

    if (adminUser) {
      const authResponse = pusherService.authorizePusherUser(
        socketId,
        channel,
        adminUser.id,
        {
          name: adminUser.name,
          username: adminUser.username!,
          avatar: adminUser.avatar!,
        },
      );

      return res.send(authResponse);
    }
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
      });
    }
    throw new CustomException('Failed to authorized pusher channel', 500);
  }
}
