export class CreateUserEmit {
  constructor(
    public readonly username: string,
    private readonly password: string,
  ) {}

  toString() {
    return JSON.stringify({
      username: this.username,
      password: this.password,
    });
  }
}
