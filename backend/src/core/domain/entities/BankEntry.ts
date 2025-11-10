/**
 * Bank Entry Entity - Represents banked surplus for future use
 */
export class BankEntry {
  constructor(
    public readonly id: string,
    public readonly shipId: string,
    public readonly year: number,
    public readonly amountGco2eq: number,
    public readonly createdAt: Date = new Date()
  ) {
    if (amountGco2eq <= 0) {
      throw new Error('Bank amount must be positive');
    }
  }
}
