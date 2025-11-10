import { Request, Response } from 'express';
import { IComplianceService } from '../../../core/ports/inbound/IComplianceService';

/**
 * Inbound Adapter: HTTP Controller for Compliance
 */
export class ComplianceController {
  constructor(private complianceService: IComplianceService) {}

  getComplianceBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const cb = await this.complianceService.getComplianceBalance(
        shipId as string,
        parseInt(year as string)
      );
      
      res.json(cb);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getAdjustedCB = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const adjustedCb = await this.complianceService.getAdjustedComplianceBalance(
        shipId as string,
        parseInt(year as string)
      );
      
      res.json({ shipId, year, adjustedCb });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
