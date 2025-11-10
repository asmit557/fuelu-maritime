import { ComputeCB } from '../../src/core/appilcation/useCases/ComputeCB';

describe('ComputeCB Use Case', () => {
  const computeCB = new ComputeCB();

  test('should calculate positive CB for compliant ship', () => {
    const result = computeCB.execute({
      shipId: 'SHIP001',
      year: 2025,
      actualIntensity: 87.20,
      energy: 18450000000
    });

    expect(result.cbGco2eq).toBeGreaterThan(0);
    expect(result.targetIntensity).toBe(89.34);
    expect(result.actualIntensity).toBe(87.20);
  });

  test('should calculate negative CB for non-compliant ship', () => {
    const result = computeCB.execute({
      shipId: 'SHIP005',
      year: 2025,
      actualIntensity: 92.10,
      energy: 6150000000
    });

    expect(result.cbGco2eq).toBeLessThan(0);
  });

  test('should use correct target for 2025', () => {
    const result = computeCB.execute({
      shipId: 'TEST',
      year: 2025,
      actualIntensity: 85.00,
      energy: 1000000000
    });

    expect(result.targetIntensity).toBe(89.34);
  });
});
