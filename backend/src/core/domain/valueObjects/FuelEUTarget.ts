/**
 * FuelEU Target Value Object - Immutable target values by year
 * Source: FuelEU Maritime Regulation (EU) 2023/1805
 */
export class FuelEUTarget {
  private static readonly BASELINE_2020 = 91.16; // gCO2eq/MJ
  
  private static readonly TARGETS: Record<number, number> = {
    2025: 89.34,  // 2% reduction
    2026: 89.34,
    2027: 89.34,
    2028: 89.34,
    2029: 89.34,
    2030: 85.69,  // 6% reduction
    2035: 77.94,  // 14.5% reduction
    2040: 62.30,  // 31% reduction
    2045: 34.64,  // 62% reduction
    2050: 18.23   // 80% reduction
  };

  public static getTarget(year: number): number {
    if (year < 2025) {
      return this.BASELINE_2020;
    }
    
    // Find the applicable target year
    const targetYears = Object.keys(this.TARGETS).map(Number).sort((a, b) => a - b);
    let applicableYear = targetYears[0];
    
    for (const targetYear of targetYears) {
      if (year >= targetYear) {
        applicableYear = targetYear;
      } else {
        break;
      }
    }
    
    return this.TARGETS[applicableYear];
  }

  public static getReductionPercentage(year: number): number {
    const target = this.getTarget(year);
    return ((this.BASELINE_2020 - target) / this.BASELINE_2020) * 100;
  }
}
