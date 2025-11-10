import { Request, Response } from 'express';
import { BankSurplus } from '../../../core/appilcation/useCases/BankSurplus';
import { ApplyBanked } from '../../../core/appilcation/useCases/ApplyBanked';
import { IBankRepository } from '../../../core/ports/outbound/IBankRepository';
import { IComplianceRepository } from '../../../core/ports/outbound/IComplianceRepository';

/**
 * Inbound Adapter: HTTP Controller for Banking
 */
export class BankingController {
  constructor(
    private bankRepository: IBankRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  getBankRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId) {
        res.status(400).json({ error: 'shipId is required' });
        return;
      }

      const records = year
        ? await this.bankRepository.findByShipAndYear(shipId as string, parseInt(year as string))
        : [];
      
      const total = await this.bankRepository.getTotalBanked(shipId as string);
      
      res.json({ records, total });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  bankSurplus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;
      
      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const cb = await this.complianceRepository.findByShipAndYear(shipId, year);
      if (!cb) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      const bankSurplus = new BankSurplus(this.bankRepository);
      const entry = await bankSurplus.execute(cb, amount);
      
      res.json({ message: 'Surplus banked successfully', entry });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  applyBanked = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;
      
      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const cb = await this.complianceRepository.findByShipAndYear(shipId, year);
      if (!cb) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      const applyBanked = new ApplyBanked(this.bankRepository);
      const result = await applyBanked.execute(cb, amount);
      
      res.json({ message: 'Banked surplus applied successfully', result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
