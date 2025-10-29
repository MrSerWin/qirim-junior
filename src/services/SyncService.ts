import ApiService from './ApiService';
import PoemService from './PoemService';
import { StorageService } from '../utils/storage';

class SyncService {
  private isSyncing = false;

  /**
   * Perform full or incremental sync with server
   */
  async sync(force: boolean = false): Promise<{success: boolean; message: string}> {
    if (this.isSyncing) {
      console.log('SyncService: Sync already in progress');
      return { success: false, message: 'Синхронизация уже выполняется' };
    }

    try {
      this.isSyncing = true;
      console.log('SyncService: Starting sync...', force ? '(forced)' : '');

      // Check internet connection first
      const hasConnection = await ApiService.checkConnection();
      if (!hasConnection) {
        console.log('SyncService: No internet connection');
        return { success: false, message: 'Нет подключения к интернету' };
      }

      // Get last sync date for incremental sync
      const lastSyncDate = force ? undefined : await StorageService.getLastSync();
      console.log('SyncService: Last sync date:', lastSyncDate || 'Never');

      // Fetch poems from server
      const syncResponse = await ApiService.syncPoems(lastSyncDate || undefined);
      console.log('SyncService: Fetched', syncResponse.poems.length, 'poems');

      if (syncResponse.poems.length === 0) {
        console.log('SyncService: No new poems to sync');
        return { success: true, message: 'Нет новых стихов' };
      }

      // Import poems to local database
      await PoemService.importPoems(syncResponse.poems);

      // Update last sync date
      await StorageService.setLastSync(syncResponse.lastUpdated);

      console.log('SyncService: Sync completed successfully');
      return {
        success: true,
        message: `Загружено ${syncResponse.poems.length} ${this.getPoemWord(syncResponse.poems.length)}`
      };

    } catch (error) {
      console.error('SyncService: Sync failed:', error);
      return {
        success: false,
        message: 'Ошибка синхронизации. Попробуйте позже.'
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Check if sync is needed based on last sync time
   */
  async shouldSync(): Promise<boolean> {
    const lastSync = await StorageService.getLastSync();

    if (!lastSync) {
      console.log('SyncService: Never synced before');
      return true;
    }

    // Sync if last sync was more than 24 hours ago
    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const hoursSinceLastSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);

    const shouldSync = hoursSinceLastSync > 24;
    console.log('SyncService: Hours since last sync:', hoursSinceLastSync.toFixed(2));
    console.log('SyncService: Should sync:', shouldSync);

    return shouldSync;
  }

  /**
   * Auto-sync if needed (called on app start or manual refresh)
   */
  async autoSync(): Promise<void> {
    const shouldSync = await this.shouldSync();

    if (shouldSync) {
      console.log('SyncService: Auto-syncing...');
      await this.sync();
    } else {
      console.log('SyncService: Auto-sync skipped (recent sync exists)');
    }
  }

  /**
   * Get correct word form for poem count (Russian grammar)
   */
  private getPoemWord(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'стихов';
    }

    if (lastDigit === 1) {
      return 'стих';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'стиха';
    }

    return 'стихов';
  }
}

export default new SyncService();
