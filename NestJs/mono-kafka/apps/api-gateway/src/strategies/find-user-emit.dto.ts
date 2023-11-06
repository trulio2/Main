export class FindUserEmit {
  constructor(public readonly username: string) {}

  toString() {
    return JSON.stringify({
      username: this.username,
    });
  }
}
