import { Request, Response } from 'express';
import { IRouteService } from '../../../core/ports/inbound/IRouteService';

/**
 * Inbound Adapter: HTTP Controller for Routes
 */
export class RouteController {
  constructor(private routeService: IRouteService) {}

  getAllRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const routes = await this.routeService.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  setBaseline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const route = await this.routeService.setBaseline(id);
      res.json({ message: 'Baseline set successfully', route });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getComparison = async (req: Request, res: Response): Promise<void> => {
  try {
    const comparison = await this.routeService.getComparison();
    res.json(comparison);
  } catch (error) {
    console.error('Comparison error:', error); // Add detailed logging
    res.status(500).json({ 
      error: (error as Error).message,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
};
}
