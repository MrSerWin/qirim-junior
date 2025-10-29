import { Poem } from '../types';
import { API_CONFIG, buildUrl } from '../config/api';

export interface SyncResponse {
  poems: Poem[];
  lastUpdated: string;
  hasMore: boolean;
}

class ApiService {
  /**
   * Fetch all poems from the server
   */
  async fetchPoems(lastSyncDate?: string): Promise<SyncResponse> {
    try {
      const url = new URL(buildUrl(API_CONFIG.ENDPOINTS.POEMS));

      // Add last sync date as query parameter for incremental sync
      if (lastSyncDate) {
        url.searchParams.append('since', lastSyncDate);
      }

      console.log('ApiService: Fetching poems from:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('ApiService: Received poems:', data.poems?.length || 0);

      return {
        poems: data.poems || [],
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        hasMore: data.hasMore || false,
      };
    } catch (error) {
      console.error('ApiService: Error fetching poems:', error);
      throw error;
    }
  }

  /**
   * Check if server is reachable
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(buildUrl(API_CONFIG.ENDPOINTS.HEALTH), {
        method: 'GET',
        timeout: 5000,
      } as any);

      return response.ok;
    } catch (error) {
      console.error('ApiService: Connection check failed:', error);
      return false;
    }
  }

  /**
   * Sync poems incrementally based on last sync date
   */
  async syncPoems(lastSyncDate?: string): Promise<SyncResponse> {
    console.log('ApiService: Starting sync...', lastSyncDate ? `since ${lastSyncDate}` : 'full sync');

    try {
      return await this.fetchPoems(lastSyncDate);
    } catch (error) {
      console.error('ApiService: Sync failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
