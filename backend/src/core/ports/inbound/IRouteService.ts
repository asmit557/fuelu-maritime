import { Route } from '../../domain/entities/Route';
import { ComparisonResult } from '../../appilcation/useCases/ComputeComparison';

/**
 * Inbound Port: Route Service Interface
 */
export interface IRouteService {
  getAllRoutes(): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonResult[]>;
}
