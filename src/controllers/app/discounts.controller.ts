import { Response } from 'express';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { CustomException } from '../../errors/CustomException.error';
import { AppDiscountService } from '../../services/app/discount.service';

const appDiscountService = new AppDiscountService();

export async function getPublishedDiscounts(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await appDiscountService.getPublishedDiscounts();

    return res.send({
      discounts: response,
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
