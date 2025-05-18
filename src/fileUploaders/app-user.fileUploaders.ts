import { NextFunction, Request, Response } from "express";
import { multipleFileLocalUploader } from "../middleware/fileUploadLocal.middleware";
import multer from "multer";

const appUserUploader = multipleFileLocalUploader(
  [
    { name: 'avatarUrl', maxCount: 1 },
  ],
  'users',
  5242880, // 5 MB
)

export const appUserFileUploaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  appUserUploader(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      return res.status(Number(error.code)).json({
        error: {
          message: error.message,
        },
        statusCode: Number(error.code),
      });
    } else if (error) {
      return res.status(500).json({
        error: {
          message: error.message,
        },
        statusCode: 500,
      });
    }

    next()
  })
}