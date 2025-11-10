/**
 * Frontend Route Model - matches backend domain entity
 */
export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  energy: number;
  isBaseline: boolean;
}

export interface ComparisonData {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  actualIntensity: number;
  baselineIntensity: number;
  targetIntensity: number;
  percentDiffFromBaseline: number;
  percentDiffFromTarget: number;
  isCompliant: boolean;
  totalEmissions: number;
  energy: number;
}
