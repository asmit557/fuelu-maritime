import { ApplyBanked } from '../../src/core/application/useCases/ApplyBanked';
import { ComplianceBalance } from '../../src/core/domain/entities/ComplianceBalance';
import { IBankRepository } from '../../src/core/ports/outbound/IBankRepository';

describe('ApplyBanked Use Case', () => {
  let mockBankRepo: jest.Mocked<IBankRepository>;
  let applyBanked: ApplyBanked;

  beforeEach(() => {
    mockBankRepo = {
      save: jest.fn(),
      findByShipAndYear: jest.fn(),
      getTotalBanked: jest.fn().mockResolvedValue(1000000),
      deduct: jest.fn(),
    };
    applyBanked = new ApplyBanked(mockBankRepo);
  });

  test('should apply banked surplus to deficit', async () => {
    const cb = new ComplianceBalance(
      'cb-1', 'SHIP001', 2025, -500000, 89.34, 92.10, 6150000000
    );

    const result = await applyBanked.execute(cb, 300000);

    expect(result.cbBefore).toBe(-500000);
    expect(result.bankedApplied).toBe(300000);
    expect(result.cbAfter).toBe(-200000);
    expect(mockBankRepo.deduct).toHaveBeenCalledWith('SHIP001', 300000);
  });

  test('should reject if insufficient banked amount', async () => {
    mockBankRepo.getTotalBanked.mockResolvedValue(100000);
    
    const cb = new ComplianceBalance(
      'cb-1', 'SHIP001', 2025, -500000, 89.34, 92.10, 6150000000
    );

    await expect(applyBanked.execute(cb, 200000)).rejects.toThrow('Insufficient banked surplus');
  });
});
