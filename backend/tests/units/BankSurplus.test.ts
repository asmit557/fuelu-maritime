import { BankSurplus } from '../../src/core/application/useCases/BankSurplus';
import { ComplianceBalance } from '../../src/core/domain/entities/ComplianceBalance';
import { IBankRepository } from '../../src/core/ports/outbound/IBankRepository';

describe('BankSurplus Use Case', () => {
  let mockBankRepo: jest.Mocked<IBankRepository>;
  let bankSurplus: BankSurplus;

  beforeEach(() => {
    mockBankRepo = {
      save: jest.fn(),
      findByShipAndYear: jest.fn(),
      getTotalBanked: jest.fn(),
      deduct: jest.fn(),
    };
    bankSurplus = new BankSurplus(mockBankRepo);
  });

  test('should bank valid surplus', async () => {
    const cb = new ComplianceBalance(
      'cb-1',
      'SHIP001',
      2025,
      1000000,
      89.34,
      87.20,
      18450000000
    );

    const result = await bankSurplus.execute(cb, 500000);

    expect(mockBankRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        shipId: 'SHIP001',
        year: 2025,
        amountGco2eq: 500000
      })
    );
  });

  test('should reject banking deficit CB', async () => {
    const cb = new ComplianceBalance(
      'cb-1',
      'SHIP001',
      2025,
      -1000000,
      89.34,
      92.10,
      6150000000
    );

    await expect(bankSurplus.execute(cb, 100000)).rejects.toThrow('Cannot bank deficit CB');
  });

  test('should reject banking more than available surplus', async () => {
    const cb = new ComplianceBalance(
      'cb-1',
      'SHIP001',
      2025,
      1000000,
      89.34,
      87.20,
      18450000000
    );

    await expect(bankSurplus.execute(cb, 1500000)).rejects.toThrow(
      'Cannot bank more than available surplus'
    );
  });
});
