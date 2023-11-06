export class CreateCatEmit {
  constructor(
    public readonly name: string,
    private readonly age: number,
    private readonly breed: string,
    private readonly userId: string,
  ) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      age: this.age,
      breed: this.breed,
      userId: this.userId,
    });
  }
}
