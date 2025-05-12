import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { UnauthorizedException } from '../../errors/UnauthorizedException.error';
import { AppUserService } from '../../services/user.services';
import { Request, Response } from 'express';
import { formatAppUserProfile } from '../../formatter/app-user.formatter';
import { CustomException } from '../../errors/CustomException.error';
import {
  rollbackMultipleFileS3,
} from '../../middleware/fileUploadS3.middleware';
import { mapAppUserGenerateToken } from '../../mapper/user.mapper';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { datetimeYMDHis } from '../../utils/datetime.utils';
import { AppUserNotificationOptions } from '../../constants/enums';
import { AuthService } from '../../services/app/auth.services';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { UserClient } from '../../db/clients/postgres.client';
import { jobQueue } from '../../utils/queue';

const appUserService = new AppUserService();
const authService = new AuthService();
const jwtMiddleware = new JwtMiddleware();
const sequelize = UserClient.getInstance();

export async function getUser(req: Request, res: Response) {
  try {
    if (!req?.params?.id)
      throw new UnauthorizedException('You are unauthorized!');

    const email = req.query.email as string;
    const user = await appUserService.findUserById(req.params.id);
    const mongoUser = await appUserService.getMongoUser(email);

    return res.status(200).json({
      user,
      mongoUser,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function getUserProfile(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    res.json({
      data: {
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateUsername(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const updated = await appUserService.updateUsername(req.body, req.user!.id);
    if (!updated)
      throw new CustomException(
        'Failed to update name. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    res.json({
      data: {
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateName(req: AppAuthenticatedRequest, res: Response) {
  try {
    const updated = await appUserService.updateName(req.body, req.user!.id);

    if (!updated)
      throw new CustomException(
        'Failed to update name. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    res.json({
      data: {
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function initiatePhoneNoChange(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  const user = await appUserService.findUserById(req.user!.id);

  try {
    const initialize = await appUserService.initiatePhoneNoChange(
      req.body,
      user,
    );

    if (!initialize)
      throw new CustomException('Something went wrong. Please try again.', 500);

    res.json({
      data: {
        message: 'OTP sent. Check your messages.',
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function confirmChangePhoneNo(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const updated = await appUserService.confirmChangePhoneNo(
      req.body.otp,
      req.user!,
    );

    if (!updated)
      throw new CustomException(
        'Failed to update phone number. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    const { token, validity } = jwtMiddleware.generateAppUserToken(
      mapAppUserGenerateToken(
        userProfile.id,
        userProfile.name,
        userProfile.username,
        userProfile.email,
        userProfile.phone,
        userProfile.whatsapp_no,
        userProfile.verified,
        userProfile.guest,
      ),
    );

    await authService.storeOrUpdateAppUserToken(userProfile.id, token);

    res.json({
      data: {
        auth: {
          jwt: token,
          validity: validity,
        },
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function initiateEmailChange(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const user = await appUserService.findUserById(req.user!.id);

    const initialize = await appUserService.initiateEmailChange(
      req.body,
      user,
    );
    if (!initialize)
      throw new CustomException('Something went wrong. Please try again.', 500);

    res.json({
      data: {
        message: 'OTP sent. Check your email.',
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function confirmChangeEmail(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const updated = await appUserService.confirmChangeEmail(
      req.body.otp,
      req.user!,
    );
    if (!updated)
      throw new CustomException(
        'Failed to update email. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    const { token, validity } = jwtMiddleware.generateAppUserToken(
      mapAppUserGenerateToken(
        userProfile.id,
        userProfile.name,
        userProfile.username,
        userProfile.email,
        userProfile.phone,
        userProfile.whatsapp_no,
        userProfile.verified,
        userProfile.guest,
      ),
    );

    await authService.storeOrUpdateAppUserToken(userProfile.id, token);

    res.json({
      data: {
        auth: {
          jwt: token,
          validity: validity,
        },
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function initiateWhatsappNoChange(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const user = await appUserService.findUserById(req.user!.id);

    const initialize = await appUserService.initiateWhatsappNoChange(
      req.body,
      user,
    );

    if (!initialize)
      throw new CustomException('Something went wrong. Please try again.', 500);

    res.json({
      data: {
        message: 'OTP sent. Check your messages.',
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function confirmChangeWhatsappNo(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const updated = await appUserService.confirmChangeWhatsappNo(
      req.body.otp,
      req.user!,
    );
    if (!updated)
      throw new CustomException(
        'Failed to update phone number. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    const { token, validity } = jwtMiddleware.generateAppUserToken(
      mapAppUserGenerateToken(
        userProfile.id,
        userProfile.name,
        userProfile.username,
        userProfile.email,
        userProfile.phone,
        userProfile.whatsapp_no,
        userProfile.verified,
        userProfile.guest,
      ),
    );

    await authService.storeOrUpdateAppUserToken(userProfile.id, token);

    res.json({
      data: {
        auth: {
          jwt: token,
          validity: validity,
        },
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateAvatar(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const updated = await appUserService.updateAppUser(req.body, req.user!.id);
    if (!updated)
      throw new CustomException(
        'Failed to update avatar. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    res.json({
      data: {
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateProfileImage(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    // req.body.profile_image_url = req.files.profile_image[0].location
    // req.body.avatar_url = req.files.avatar_url[0].location
    // req.body.avatar_url = req.files.profile_image[0].location;
    // console.log('updated avatar url', req.body.avatar_url)

    req.body.avatar_url = req.files.profile_image[0].location;
    // req.body.avatar_url = req.files.avatar_url
    //   ? req.files.avatar_url[0].location
    //   : user.avatar_url;

    // if (user.avatar_url)
    //   deleteMultipleFilesS3(extractS3Fullpaths([user.avatar_url]));
    // if (user.profile_image_url)
    //   deleteMultipleFilesS3(extractS3Fullpaths([user.profile_image_url]));

    const updated = await appUserService.updateAppUser(req.body, req.user!.id);
    if (!updated)
      throw new CustomException(
        'Failed to update avatar. Please try again.',
        500,
      );

    const userProfile = await appUserService.getUserProfile(req.user!.id);
    const formattedData = formatAppUserProfile(userProfile); // # Will need optimization later(fetches all tier_statuses. Should fetch 1 with highest order & latest date)

    res.json({
      data: {
        user_profile: formattedData,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    rollbackMultipleFileS3(req);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateNotificationStatus(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const currentDate = new Date();

    switch (req.body.notifications) {
      case AppUserNotificationOptions.ON:
        req.body.disable_notifications_till = null;
        break;
      case AppUserNotificationOptions['1HR']:
        req.body.disable_notifications_till = new Date(
          datetimeYMDHis(currentDate, 'mins', 60),
        );
        break;
      case AppUserNotificationOptions['8HR']:
        req.body.disable_notifications_till = new Date(
          datetimeYMDHis(currentDate, 'mins', 8 * 60),
        );
        break;
      case AppUserNotificationOptions['24HR']:
        req.body.disable_notifications_till = new Date(
          datetimeYMDHis(currentDate, 'mins', 24 * 60),
        );
        break;
      case AppUserNotificationOptions.OFF:
        req.body.disable_notifications_till = null;
        break;
    }

    const updated = await appUserService.updateAppUser(req.body, req.user!.id);
    if (!updated)
      throw new CustomException(
        'Failed to update notification status. Please try again.',
        500,
      );

    return res.json({
      data: {
        message: 'Notification status changed successfully.',
      },
      status_code: 200,
    });
  } catch (e) {
    // console.log(e);
    rollbackMultipleFileS3(req);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function initiateAccountWipeout(req: AppAuthenticatedRequest, res: Response) {
  try {
    let sent = null
    let channel = null
    const appUser = await appUserService.findUserById(req.user!.id)
    if(appUser.phone){
      channel = 'phone';
      sent = await authService.sendOTP(appUser.phone);
    }
    else if(appUser.email){
      channel = 'email';
      sent = await authService.sendOTPToWhatsappOrEmail(appUser, 'email');
    }
    else if(appUser.whatsapp_no){
      channel = 'whatsapp';
      sent = await authService.sendOTPToWhatsappOrEmail(appUser, 'whatsapp');
    }

    if (sent)
      return res.json({
        data: {
          message: `OTP sent to your ${channel === 'phone' ? 'phone/whatsapp' : channel }. Check your messages.`,
          channel: channel
        },
        status_code: 200,
      });

    throw new NotFoundException('Phone number, email and whatsapp number missing !');
  } catch (e: any) {
    if (e.constructor.name === 'RestException') {
      return res.status(500).json({
        error: {
          message: `Failed to send OTP. Please try again.`,
        },
        code: 500,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function verifyOTPForDeleteAppUser(req: AppAuthenticatedRequest, res: Response) {
  try {
    const channel = req.body.channel ?? 'phone';
    if (channel !== 'phone' && channel !== 'email' && channel !== 'whatsapp')
      throw new BadRequestException('Invalid channel!');

    let to;
    switch (channel) {
      case 'phone':
        {
          to = req.user!.phone;
        }
        break;
      case 'email':
        {
          to = req.user!.email;
          if (!to)
            throw new BadRequestException(
              'Email not set. Please set email and try again.',
            );
        }
        break;
      case 'whatsapp':
        {
          to = req.user!.whatsapp_no;
          if (!to)
            throw new BadRequestException(
              'Whatsapp no. not set. Please set Whatsapp no. and try again.',
            );
        }
        break;
    }

    const verified = await authService.verifyOTP(to!, req.body.otp);

    if (!verified)
      throw new CustomException(
        'Verification failed! Please resend OTP and try again.',
        500,
      );

    return res.json({
      data: {
        message: 'OTP verified. You may proceed.',
      },
      status_code: 200,
    });
  } catch (e: any) {
    if (e.constructor.name === 'RestException') {
      return res.status(500).json({
        error: {
          message: 'Failed to verify OTP. Please try again.',
        },
        code: 500,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function confirmAccountWipeout(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { reason } = req.body;
    const runAt = new Date(datetimeYMDHis(new Date(), 'days', 30))

    const transaction = await sequelize.transaction();

    const deleteAppUserAlreadyQueued = await jobQueue.jobs({ name: 'deleteAppUser', 'data.reason': reason, 'data.userId': req.user!.id });
    if (deleteAppUserAlreadyQueued.length)
      throw new BadRequestException("This user has already been pushed to queue for deletion. Please wait for it to be processed.");

    jobQueue.schedule(runAt, 'deleteAppUser', { reason: reason, userId: req.user!.id });

    await transaction.commit();

    return res.json({
      data: {
        message: `Your account information will be deleted shortly.`,
        deletedAt: runAt
      },
      status_code: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}