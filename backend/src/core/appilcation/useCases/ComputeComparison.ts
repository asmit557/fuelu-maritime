import { Route } from '../../domain/entities/Route';
import { FuelEUTarget } from '../../domain/valueObjects/FuelEUTarget';

export interface ComparisonResult {
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

export class ComputeComparison {
  public execute(routes: Route[], baseline: Route | null): ComparisonResult[] {
    if (!baseline) {
      throw new Error('No baseline route found');
    }

    if (!routes || routes.length === 0) {
      return [];
    }

    return routes.map(route => {
      try {
        const targetIntensity = FuelEUTarget.getTarget(route.year);
        const percentDiffFromBaseline = 
          ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
        const percentDiffFromTarget = 
          ((route.ghgIntensity / targetIntensity) - 1) * 100;
        const isCompliant = route.ghgIntensity <= targetIntensity;

        return {
          routeId: route.routeId,
          vesselType: route.vesselType,
          fuelType: route.fuelType,
          year: route.year,
          actualIntensity: route.ghgIntensity,
          baselineIntensity: baseline.ghgIntensity,
          targetIntensity,
          percentDiffFromBaseline,
          percentDiffFromTarget,
          isCompliant,
          totalEmissions: route.calculateTotalEmissions(),
          energy: route.calculateEnergy()
        };
      } catch (error) {
        console.error(`Error processing route ${route.routeId}:`, error);
        throw error;
      }
    });
  }
}
