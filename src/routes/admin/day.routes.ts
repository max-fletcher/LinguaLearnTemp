import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createDay, deleteDay, getAllDays, getSingleDay, updateDay } from '../../controllers/admin/day.controller';
import { createDaySchema, updateDaySchema } from '../../schema/day.schema';

const DayRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

DayRouter.get('/', jwtMiddleware.verifyToken, getAllDays);
DayRouter.get('/:id', jwtMiddleware.verifyToken, getSingleDay);
DayRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  validateRequestBody(createDaySchema),
  createDay,
);
DayRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  validateRequestBody(updateDaySchema),
  updateDay,
);

DayRouter.delete('/:id', jwtMiddleware.verifyToken, deleteDay);

export { DayRouter };
