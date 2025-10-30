import { Poem } from '../types';
import { API_CONFIG, buildUrl } from '../config/api';

export interface SyncResponse {
  data: Poem[];
}

export interface SyncProgress {
  loaded: number;
  total: number;
  percentage: number;
}

type ProgressCallback = (progress: SyncProgress) => void;

class ApiService {
  private abortController: AbortController | null = null;

  /**
   * Fetch all poems from the server
   * Based on QirimJuniorService.cs GetPoemsAsync()
   */
  async fetchPoems(onProgress?: ProgressCallback): Promise<SyncResponse> {
    try {
      // Create abort controller for cancellation support
      this.abortController = new AbortController();

      const url = buildUrl(API_CONFIG.ENDPOINTS.POEMS);
      console.log('ApiService: Fetching poems from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SyncResponse = await response.json();

      console.log('ApiService: Received poems:', result.data?.length || 0);

      // Report initial progress
      if (onProgress && result.data) {
        onProgress({
          loaded: 0,
          total: result.data.length,
          percentage: 0,
        });
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('ApiService: Fetch cancelled');
        throw new Error('Fetch cancelled');
      }
      console.error('ApiService: Error fetching poems:', error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Cancel ongoing fetch operation
   */
  cancelFetch() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Check if server is reachable
   */
  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const url = buildUrl(API_CONFIG.ENDPOINTS.POEMS);
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Silently fail if server is not configured or unreachable
      if (__DEV__) {
        console.log('ApiService: Server not reachable (this is expected if server is down)');
      }
      return false;
    }
  }
}

export default new ApiService();
