import { NextFunction, Request, Response } from "express";
import { multipleFileLocalUploader } from "../middleware/fileUploadLocal.middleware";
import multer from "multer";

const courseUploader = multipleFileLocalUploader(
  [
    { name: 'imagePath', maxCount: 1 },
  ],
  'courses',
  1048576, // 5 MB
)

export const courseFileUploaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  courseUploader(req, res, function (error) {
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