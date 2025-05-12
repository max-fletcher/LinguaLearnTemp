export class EnvVarEmptyError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, EnvVarEmptyError.prototype);
    this.name = this.constructor.name;
  }
}
