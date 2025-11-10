import axios, { AxiosInstance } from 'axios';
import { IApiClient } from '../../core/ports/IApiClient';
import { Route, ComparisonData } from '../../core/domain/models/Route';
import { ComplianceBalance, BankEntry, Pool, PoolMember } from '../../core/domain/models/Compliance';

export class ApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true // Important for cookies
    });

    // Add request interceptor to attach token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('401 Unauthorized - Token may be invalid or expired');
          localStorage.removeItem('accessToken');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  async getRoutes(): Promise<Route[]> {
    const response = await this.client.get('/routes');
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await this.client.post(`/routes/${routeId}/baseline`);
    return response.data.route;
  }

  async getComparison(): Promise<ComparisonData[]> {
    const response = await this.client.get('/routes/comparison');
    return response.data;
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await this.client.get('/compliance/cb', {
      params: { shipId, year }
    });
    return response.data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number }> {
    const response = await this.client.get('/compliance/adjusted-cb', {
      params: { shipId, year }
    });
    return response.data;
  }

  async getBankRecords(shipId: string, year?: number): Promise<{ records: BankEntry[]; total: number }> {
    const response = await this.client.get('/banking/records', {
      params: { shipId, year }
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<void> {
    await this.client.post('/banking/bank', { shipId, year, amount });
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<void> {
    await this.client.post('/banking/apply', { shipId, year, amount });
  }

  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    const response = await this.client.post('/pools', { year, members });
    return response.data.pool;
  }
}
