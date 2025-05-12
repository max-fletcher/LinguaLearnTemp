import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';
import { ProfessionalRepository } from '../../db/rdb/repositories/professional.repository';
import { CustomException } from '../../errors/CustomException.error';
import {
  deleteMultipleFilesS3,
  extractS3Fullpaths,
} from '../../middleware/fileUploadS3.middleware';
import { UserPayload } from '../../schema/token-payload.schema';
import {
  ProfessionalEducation,
  ProfessionalExperience,
  ProfessionalType,
} from '../../types/common-models.type';
import {
  generateProfessionalExpId,
  generateProfessionalId,
} from '../../utils/id.utils';

export class ProfessionalService {
  private adminUserRepo: AdminUserRepository;
  private professionalRepo: ProfessionalRepository;

  constructor() {
    this.adminUserRepo = new AdminUserRepository();
    this.professionalRepo = new ProfessionalRepository();
  }

  async storeWorkExperience(
    request: ProfessionalExperience,
    files: any,
    user: UserPayload,
  ) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const id = generateProfessionalExpId();

      request.id = id;
      request.admin_user_id = checkUser.id;

      if (files?.logo_url && files.logo_url.length)
        request.logo_url = files.logo_url[0].location;

      const experience = await this.professionalRepo.storeWorkExperience(
        request as unknown as ProfessionalExperience,
      );

      if (experience) {
        return {
          experience: experience,
          message: 'Working experience created successfully',
          status: 201,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      // console.log(error);
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        user: null,
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  async updateProfessionalExperience(
    id: string,
    request: ProfessionalExperience,
    files: any,
    user: UserPayload,
  ) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const checkExperience = await this.professionalRepo.getWorkExperience(
        id,
        checkUser.id,
      );

      if (!checkExperience)
        throw new CustomException('Experience not found', 404);

      if (files?.logo_url && files.logo_url.length) {
        request.logo_url = files.logo_url[0].location;
        deleteMultipleFilesS3(
          extractS3Fullpaths([checkExperience.logo_url] as string[]),
        );
      } else {
        request.logo_url = checkExperience.logo_url;
      }

      const experience = await this.professionalRepo.updateWorkExperience(
        request as unknown as ProfessionalExperience,
        id,
        checkUser.id,
      );

      if (experience) {
        return {
          message: 'Working experience updated successfully',
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        user: null,
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  async getProfessionalExperiences(request: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(request.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const experiences = await this.professionalRepo.getWorkExperiences(
        checkUser.id,
      );

      if (experiences) {
        return {
          experiences: experiences,
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      // console.log(error);
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }

      throw new CustomException('Bad Request', 400);
    }
  }

  async getProfessionalExperience(id: string, request: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(request.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const experience = await this.professionalRepo.getWorkExperience(
        id,
        checkUser.id,
      );

      if (experience) {
        return {
          experience: experience,
          status: 200,
        };
      } else {
        throw new CustomException('Experience not found!', 404);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        throw new CustomException(error.message, error.statusCode);
      }
      return {
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  // Delete Working Experience

  async deleteProfessionalExperience(id: string, user: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const checkExperience = await this.professionalRepo.getWorkExperience(
        id,
        checkUser.id,
      );

      if (!checkExperience)
        throw new CustomException('Experience not found', 404);

      if (checkExperience.logo_url != null) {
        deleteMultipleFilesS3(
          extractS3Fullpaths([checkExperience.logo_url] as string[]),
        );
      }

      const experience = await this.professionalRepo.deleteWorkExperience(
        id,
        checkUser.id,
      );

      if (experience) {
        return {
          message: 'Working experience deleted successfully',
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        user: null,
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  // Store Education Experience

  async storeEducationalExperience(
    request: ProfessionalExperience,
    files: any,
    user: UserPayload,
  ) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const id = generateProfessionalExpId();

      request.id = id;
      request.admin_user_id = checkUser.id;

      if (files?.logo_url && files.logo_url.length)
        request.logo_url = files.logo_url[0].location;

      const experience = await this.professionalRepo.storeEducationalExperience(
        request as unknown as ProfessionalEducation,
      );

      if (experience) {
        return {
          experience: experience,
          message: 'Educational experience created successfully',
          status: 201,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        user: null,
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  // Get All Educational Experiences

  async getProfessionalEducationalExperiences(request: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(request.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const experiences = await this.professionalRepo.getEducationalExperiences(
        checkUser.id,
      );

      if (experiences) {
        return {
          experiences: experiences,
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  async getProfessionalEducationExperience(id: string, request: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(request.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const experience = await this.professionalRepo.getEducationExperience(
        id,
        checkUser.id,
      );

      if (experience) {
        return {
          experience: experience,
          status: 200,
        };
      } else {
        throw new CustomException('Experience not found!', 404);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        throw new CustomException(error.message, error.statusCode);
      }
      return {
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  async updateProfessionalEducationalExperience(
    id: string,
    request: ProfessionalEducation,
    files: any,
    user: UserPayload,
  ) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const checkExperience =
        await this.professionalRepo.getEducationExperience(id, checkUser.id);

      if (!checkExperience)
        throw new CustomException('Experience not found', 404);

      if (files?.logo_url && files.logo_url.length) {
        request.logo_url = files.logo_url[0].location;
        deleteMultipleFilesS3(
          extractS3Fullpaths([checkExperience.logo_url] as string[]),
        );
      } else {
        request.logo_url = checkExperience.logo_url;
      }

      const experience = await this.professionalRepo.updateEducationlExperience(
        request as unknown as ProfessionalEducation,
        id,
        checkUser.id,
      );

      if (experience) {
        return {
          message: 'Educational experience updated successfully',
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          user: null,
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        user: null,
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  // Delete Working Experience

  async deleteProfessionalEducationExperience(id: string, user: UserPayload) {
    try {
      const checkUser = await this.adminUserRepo.findUserById(user.id);

      if (!checkUser) throw new CustomException('User not found', 404);

      const checkExperience =
        await this.professionalRepo.getEducationExperience(id, checkUser.id);

      if (!checkExperience)
        throw new CustomException('Experience not found', 404);

      if (checkExperience.logo_url != null) {
        deleteMultipleFilesS3(
          extractS3Fullpaths([checkExperience.logo_url] as string[]),
        );
      }

      const experience =
        await this.professionalRepo.deleteEducationalExperience(
          id,
          checkUser.id,
        );

      if (experience) {
        return {
          message: 'Educational experience deleted successfully',
          status: 200,
        };
      } else {
        throw new CustomException('Something went wrong', 500);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  // Profile Biography

  async getProfileBiography(user: UserPayload) {
    try {
      const biography = await this.professionalRepo.getBiography(
        user.id as string,
      );

      if (biography != null) {
        return biography;
      } else {
        return null;
      }
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Bad Request',
        status: 400,
      };
    }
  }

  async updateProfileBiography(request: ProfessionalType, user: UserPayload) {
    try {
      const biography = await this.professionalRepo.getBiography(
        user.id as string,
      );

      if (!biography) {
        request.id = generateProfessionalId();
        request.admin_user_id = user.id;

        await this.professionalRepo.storeBiography(request);
      } else {
        await this.professionalRepo.updateBiography(request, user.id as string);
      }

      return {
        message: 'Biography updated successfully',
        status: 200,
      };
    } catch (error) {
      if (error instanceof CustomException) {
        return {
          message: error.message,
          status: error.statusCode,
        };
      }
      return {
        message: 'Bad Request',
        status: 400,
      };
    }
  }
}
