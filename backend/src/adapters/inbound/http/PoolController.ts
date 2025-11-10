import { Request, Response } from 'express';
import { CreatePool } from '../../../core/appilcation/useCases/CreatePool';
import { IPoolRepository } from '../../../core/ports/outbound/IPoolRepository';

/**
 * Inbound Adapter: HTTP Controller for Pooling
 */
export class PoolController {
  constructor(private poolRepository: IPoolRepository) {}

  createPool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year, members } = req.body;
      
      if (!year || !members || !Array.isArray(members)) {
        res.status(400).json({ error: 'year and members array are required' });
        return;
      }

      const createPool = new CreatePool(this.poolRepository);
      const pool = await createPool.execute({ year, members });
      
      res.json({ message: 'Pool created successfully', pool });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
