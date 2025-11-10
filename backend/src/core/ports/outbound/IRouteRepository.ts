import { Route } from '../../domain/entities/Route';

/**
 * Outbound Port: Route Repository Interface
 */
export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  update(route: Route): Promise<void>;
  save(route: Route): Promise<void>;
}
