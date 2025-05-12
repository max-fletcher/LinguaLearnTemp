import { Response } from 'express';
import { AdminAuthenticatedRequest } from 'types/authenticate.type';
import { TierService } from '../../services/admin/tiers.service';
import { CustomException } from '../../errors/CustomException.error';

const tierService = new TierService();

export async function getTiers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await tierService.getAllTiers();

    res.send({
      tiers: response,
    });
  } catch (error) {
    res.send(error);
  }
}

export async function createTiers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await tierService.createTiers(req.body);

    return res.status(response.status).send({
      message: response.message,
      tiers: response.tiers,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export const updateTiers = async (req: AdminAuthenticatedRequest, res: Response) => {
  try {
    const response = await tierService.updateTier(req.body, req.params.id);

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

export const deleteTiers = async (req: AdminAuthenticatedRequest, res: Response) => {
  try {
    const response = await tierService.deleteTiers(req.params.id);

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

export const getTierDetails = async (
  req: AdminAuthenticatedRequest,
  res: Response,
) => {
  try {
    const response = await tierService.getTierDetails(req.params.id);
    return res.status(200).send({
      tier: response,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

export async function getSelectedTiers(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const order = req.query.order as string;

    if (!order) {
      throw new CustomException('Order is required', 400);
    }

    const orderTiers = order.split(',');

    const response = await tierService.getSelectedTiers(orderTiers);

    return res.send(response);
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
