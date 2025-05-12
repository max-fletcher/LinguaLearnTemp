export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.name = 'AuthorizationError';
  }
}
