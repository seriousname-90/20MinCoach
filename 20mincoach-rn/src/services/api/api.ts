// /src/services/api.ts (updated with DTO integration)

import { logger } from '../../utils/logger';
import { globalErrorHandler } from '../../middleware/error.middleware';
import { ApiError, NetworkError } from '../../utils/errors';
import { DTOTransformer, DTOResponse, type ApiResponse, type PaginatedResponse } from '../dto/dto';

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const startTime = Date.now();
    
    logger.apiRequest(url, options.method || 'GET', {
      endpoint,
      body: options.body ? '***' : undefined
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      logger.apiResponse(url, options.method || 'GET', response.status, duration);

      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiError(
          responseData.error?.message || `HTTP ${response.status}`,
          response.status,
          url,
          { 
            endpoint, 
            method: options.method,
            responseData 
          }
        );
      }

      return responseData;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors, timeouts, etc.
      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout', { endpoint, timeout: this.timeout });
      }

      if (error.message?.includes('Network request failed')) {
        throw new NetworkError('Network connection failed', { endpoint });
      }

      logger.error('Unexpected API error', error as Error, { endpoint });
      throw new ApiError('Unexpected API error', 500, url, { endpoint, originalError: error });
    }
  }

  // User endpoints
  async getCurrentUser(): Promise<DTOResponse<User>> {
    return DTOResponse.fromPromise(
      this.request<UserDTO>('/users/me').then(DTOTransformer.toUser)
    );
  }

  async getUsers(page: number = 1, limit: number = 20): Promise<DTOResponse<PaginatedResponse<User>>> {
    return DTOResponse.fromPromise(
      this.request<PaginatedResponse<UserDTO>>(`/users?page=${page}&limit=${limit}`)
        .then(response => DTOTransformer.toPaginatedResponse(response, DTOTransformer.toUser))
    );
  }

  // Coach endpoints
  async getCoaches(page: number = 1, limit: number = 20): Promise<DTOResponse<PaginatedResponse<Coach>>> {
    return DTOResponse.fromPromise(
      this.request<PaginatedResponse<CoachDTO>>(`/coaches?page=${page}&limit=${limit}`)
        .then(response => DTOTransformer.toPaginatedResponse(response, DTOTransformer.toCoach))
    );
  }

  async getCoach(id: string): Promise<DTOResponse<Coach>> {
    return DTOResponse.fromPromise(
      this.request<CoachDTO>(`/coaches/${id}`).then(DTOTransformer.toCoach)
    );
  }

  // Session endpoints
  async createSessionRequest(data: unknown): Promise<DTOResponse<SessionRequest>> {
    const validatedData = DTOTransformer.fromCreateSessionRequest(data);
    
    return DTOResponse.fromPromise(
      this.request<SessionRequestDTO>('/session-requests', {
        method: 'POST',
        body: JSON.stringify(validatedData),
      }).then(DTOTransformer.toSessionRequest)
    );
  }

  async getSessionRequests(
    status?: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<DTOResponse<PaginatedResponse<SessionRequest>>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });

    return DTOResponse.fromPromise(
      this.request<PaginatedResponse<SessionRequestDTO>>(`/session-requests?${queryParams}`)
        .then(response => DTOTransformer.toPaginatedResponse(response, DTOTransformer.toSessionRequest))
    );
  }
}

export const apiService = new ApiService(process.env.EXPO_PUBLIC_API_URL || 'https://api.your-app.com');