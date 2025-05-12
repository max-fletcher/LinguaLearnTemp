import { Request } from 'express';
import { AppUserPayload, AdminUserPayload } from '../schema/token-payload.schema';

export interface AdminAuthenticatedRequest extends Request {
  user?: AdminUserPayload;
  files?: any;
}

export interface AppAuthenticatedRequest extends Request {
  user?: AppUserPayload;
  files?: any;
}