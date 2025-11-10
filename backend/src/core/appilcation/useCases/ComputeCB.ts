import { Route } from '../../domain/entities/Route';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { FuelEUTarget } from '../../domain/valueObjects/FuelEUTarget';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use Case: Compute Compliance Balance
 * Formula: CB = (Target - Actual) × Energy
 */
export interface CBInput {
  shipId: string;
  year: number;
  actualIntensity: number;
  energy: number;
}

export class ComputeCB {
  public execute(input: CBInput): ComplianceBalance {
    const targetIntensity = FuelEUTarget.getTarget(input.year);
    const cbGco2eq = (targetIntensity - input.actualIntensity) * input.energy;

    return new ComplianceBalance(
      uuidv4(),
      input.shipId,
      input.year,
      cbGco2eq,
      targetIntensity,
      input.actualIntensity,
      input.energy
    );
  }
}
