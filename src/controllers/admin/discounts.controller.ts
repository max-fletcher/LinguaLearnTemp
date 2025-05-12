import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { UserPayload } from '../../schema/token-payload.schema';
import { DiscountService } from '../../services/admin/discounts.service';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';

const discountService = new DiscountService();

export async function getDiscounts(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await discountService.getDiscounts(
      req.user as UserPayload,
    );

    return res.send({
      discounts: response,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
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

export async function getDiscountDetails(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const discountId = req.params.id;

    const response = await discountService.getDiscountsDetails(
      discountId,
      req.user as UserPayload,
    );

    return res.send({
      discounts: response,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
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

export async function storeDiscounts(req: AdminAuthenticatedRequest, res: Response) {
  try {
    if (req.files.thumbnail_image && req.files.thumbnail_image.length)
      req.body.thumbnail_image = req.files.thumbnail_image[0].location;

    const response = await discountService.createDiscount(
      req.body,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
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

export async function updateDiscount(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const discountId = req.params.id;

    if (req.files.thumbnail_image && req.files.thumbnail_image.length)
      req.body.thumbnail_image = req.files.thumbnail_image[0].location;

    const response = await discountService.updateDiscount(
      req.body,
      req.user as UserPayload,
      discountId,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
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

export async function deleteDiscount(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const discountId = req.params.id;

    const response = await discountService.deleteDiscount(
      req.user as UserPayload,
      discountId,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
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

export async function updateDiscountStatus(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const discountId = req.params.id;

    const response = await discountService.updateDiscountStatus(
      req.body,
      req.user as UserPayload,
      discountId,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
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
