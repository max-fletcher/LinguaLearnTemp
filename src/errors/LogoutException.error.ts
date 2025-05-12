import { CustomException } from './CustomException.error';

export class LogoutException extends CustomException {
  statusCode = 418;
  constructor(message: string) {
    super(message, 418);
    Object.setPrototypeOf(this, LogoutException.prototype);
    this.name = this.constructor.name;
  }
}
