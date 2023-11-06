export class FindCatEmit {
  constructor(private readonly userId: string) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
    });
  }
}
