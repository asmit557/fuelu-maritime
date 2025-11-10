/**
 * Compliance Balance Entity - Represents a ship's compliance status
 * CB = (Target - Actual) × Energy
 * Positive CB = surplus, Negative CB = deficit
 */
export class ComplianceBalance {
  constructor(
    public readonly id: string,
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGco2eq: number, // Compliance Balance in gCO2eq
    public readonly targetIntensity: number,
    public readonly actualIntensity: number,
    public readonly energy: number
  ) {}

  public isSurplus(): boolean {
    return this.cbGco2eq > 0;
  }

  public isDeficit(): boolean {
    return this.cbGco2eq < 0;
  }

  public canBank(): boolean {
    return this.isSurplus();
  }

  public getAbsoluteValue(): number {
    return Math.abs(this.cbGco2eq);
  }
}
