/**
 * Pool Entity - Represents a pooling arrangement between ships
 */
export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export class Pool {
  constructor(
    public readonly id: string,
    public readonly year: number,
    public readonly members: PoolMember[],
    public readonly createdAt: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.members.length < 2) {
      throw new Error('Pool must have at least 2 members');
    }

    // Validate conservation of CB
    const totalBefore = this.members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalAfter = this.members.reduce((sum, m) => sum + m.cbAfter, 0);
    
    if (Math.abs(totalBefore - totalAfter) > 0.01) {
      throw new Error('Pool must conserve total compliance balance');
    }

    // Validate no deficit ship exits worse
    this.members.forEach(member => {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        throw new Error(`Deficit ship ${member.shipId} cannot exit worse after pooling`);
      }
    });

    // Validate no surplus ship exits negative
    this.members.forEach(member => {
      if (member.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} cannot exit negative after pooling`);
      }
    });

    // Validate final sum is non-negative
    if (totalAfter < 0) {
      throw new Error('Pool total CB must be non-negative');
    }
  }

  public getTotalCbBefore(): number {
    return this.members.reduce((sum, m) => sum + m.cbBefore, 0);
  }

  public getTotalCbAfter(): number {
    return this.members.reduce((sum, m) => sum + m.cbAfter, 0);
  }
}
