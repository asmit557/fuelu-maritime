/**
 * Route Entity - Core domain model representing a maritime route
 * Independent of any framework or external dependency
 */
export class Route {
  constructor(
    public readonly id: string,
    public readonly routeId: string,
    public readonly vesselType: string,
    public readonly fuelType: string,
    public readonly year: number,
    public readonly ghgIntensity: number, // gCO2eq/MJ
    public readonly fuelConsumption: number, // metric tons
    public readonly distance: number, // nautical miles
    public readonly isBaseline: boolean = false
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.ghgIntensity < 0) throw new Error('GHG intensity cannot be negative');
    if (this.fuelConsumption < 0) throw new Error('Fuel consumption cannot be negative');
    if (this.distance <= 0) throw new Error('Distance must be positive');
    if (this.year < 2020) throw new Error('Year must be 2020 or later');
  }

  /**
   * Calculate total energy in MJ
   * Conversion factor: 1 metric ton of fuel = 41,000 MJ
   */
  public calculateEnergy(): number {
    return this.fuelConsumption * 41000;
  }

  /**
   * Calculate total emissions in gCO2eq
   */
  public calculateTotalEmissions(): number {
    return this.ghgIntensity * this.calculateEnergy();
  }

  public setBaseline(): Route {
    return new Route(
      this.id,
      this.routeId,
      this.vesselType,
      this.fuelType,
      this.year,
      this.ghgIntensity,
      this.fuelConsumption,
      this.distance,
      true
    );
  }
}
