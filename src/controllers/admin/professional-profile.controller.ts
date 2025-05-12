import { Response } from 'express';
import { AdminAuthenticatedRequest } from 'types/authenticate.type';
import { CustomException } from '../../errors/CustomException.error';
import { UserPayload } from '../../schema/token-payload.schema';
import { ProfessionalService } from '../../services/admin/professional.service';

const professionalService = new ProfessionalService();

export async function storeWorkExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await professionalService.storeWorkExperience(
      req.body,
      req.files,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
      experience: response.experience,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export async function getExperiences(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await professionalService.getProfessionalExperiences(
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      experiences: response.experiences,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
      });
    }

    return res.status(500).send({
      error: error,
    });
  }
}

export async function getExperience(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await professionalService.getProfessionalExperience(
      req.params.id,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      experience: response.experience,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
      });
    }

    return res.status(500).send({
      error: error,
    });
  }
}

export async function updateExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await professionalService.updateProfessionalExperience(
      req.params.id,
      req.body,
      req.files,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export async function deleteExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await professionalService.deleteProfessionalExperience(
      req.params.id,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

// Store Educational Experience

export async function storeEducationExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await professionalService.storeEducationalExperience(
      req.body,
      req.files,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
      experience: response.experience,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

// Get All Educational Experiences

export async function getEducationalExperiences(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response =
      await professionalService.getProfessionalEducationalExperiences(
        req.user as UserPayload,
      );

    return res.status(response.status).send({
      experiences: response.experiences,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

// Get Specific Education Experience

export async function getEducationExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response =
      await professionalService.getProfessionalEducationExperience(
        req.params.id,
        req.user as UserPayload,
      );

    return res.status(response.status).send({
      experience: response.experience,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
      });
    }

    return res.status(500).send({
      error: error,
    });
  }
}

// Update Specific Education Experience

export async function updateEducationExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response =
      await professionalService.updateProfessionalEducationalExperience(
        req.params.id,
        req.body,
        req.files,
        req.user as UserPayload,
      );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

// Delete Specific Education Experience

export async function deleteEducationalExperience(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response =
      await professionalService.deleteProfessionalEducationExperience(
        req.params.id,
        req.user as UserPayload,
      );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

// Get Professional Biography

export async function getBiography(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const response = await professionalService.getProfileBiography(
      req.user as UserPayload,
    );

    return res.send({
      biography: response,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export async function updateBiography(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await professionalService.updateProfileBiography(
      req.body,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}
