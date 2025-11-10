import { ComputeComparison } from '../../src/core/application/useCases/ComputeComparison';
import { Route } from '../../src/core/domain/entities/Route';

describe('ComputeComparison Use Case', () => {
  const computeComparison = new ComputeComparison();

  test('should compare routes against baseline', () => {
    const baseline = new Route(
      '1', 'R001', 'Container Ship', 'HFO', 2020, 91.50, 500, 5000, true
    );
    
    const routes = [
      new Route('2', 'R002', 'Container Ship', 'VLSFO', 2025, 87.20, 450, 4800, false),
      new Route('3', 'R003', 'Bulk Carrier', 'MGO', 2025, 75.30, 380, 4200, false),
    ];

    const results = computeComparison.execute(routes, baseline);

    expect(results).toHaveLength(2);
    expect(results[0].baselineIntensity).toBe(91.50);
    expect(results[0].targetIntensity).toBe(89.34);
    expect(results[0].isCompliant).toBe(true);
  });

  test('should throw error if no baseline', () => {
    const routes = [
      new Route('2', 'R002', 'Container Ship', 'VLSFO', 2025, 87.20, 450, 4800, false),
    ];

    expect(() => computeComparison.execute(routes, null)).toThrow('No baseline route found');
  });
});
