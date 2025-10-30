import { InteractionManager } from 'react-native';
import ApiService, { SyncProgress } from './ApiService';
import PoemService from './PoemService';
import { StorageService } from '../utils/storage';
import { API_CONFIG } from '../config/api';
import { Poem } from '../types';

export interface SyncResult {
  success: boolean;
  message: string;
  totalPoems?: number;
  newPoems?: number;
}

type ProgressCallback = (progress: SyncProgress) => void;

class SyncService {
  private isSyncing = false;
  private progressCallback: ProgressCallback | null = null;

  /**
   * Perform sync with server with background processing
   * Uses InteractionManager to avoid UI freezes
   */
  async sync(force: boolean = false, onProgress?: ProgressCallback): Promise<SyncResult> {
    if (this.isSyncing) {
      console.warn('⚠️  SyncService.sync: Already in progress');
      return { success: false, message: 'Синхронизация уже выполняется' };
    }

    try {
      this.isSyncing = true;
      this.progressCallback = onProgress || null;
      console.warn(`🔄 SyncService.sync: Starting... ${force ? '(FORCED)' : '(AUTO)'}`);

      // Check internet connection first
      console.warn('🌐 SyncService.sync: Checking connection...');
      const hasConnection = await ApiService.checkConnection();
      if (!hasConnection) {
        console.warn('❌ SyncService.sync: No internet connection');
        return { success: false, message: 'Нет подключения к интернету' };
      }
      console.warn('✅ SyncService.sync: Connection OK');

      // Fetch poems from server
      console.warn('📥 SyncService.sync: Fetching poems from server...');
      const syncResponse = await ApiService.fetchPoems(this.onFetchProgress.bind(this));
      const serverPoems = syncResponse.data;

      if (!serverPoems || serverPoems.length === 0) {
        console.warn('⚠️  SyncService.sync: No poems received from server');
        return { success: true, message: 'Нет данных на сервере', totalPoems: 0, newPoems: 0 };
      }

      console.warn(`📚 SyncService.sync: Fetched ${serverPoems.length} poems from server`);

      // Process poems in background using InteractionManager
      const result = await this.processPoemsInBackground(serverPoems);

      // Update last sync date
      await StorageService.setLastSync(new Date().toISOString());

      console.log('SyncService: Sync completed successfully');
      return result;

    } catch (error) {
      // Log error only in dev mode to avoid showing errors when server is not configured
      if (__DEV__) {
        console.log('SyncService: Sync failed (this is expected if server is not configured):', error);
      }
      return {
        success: false,
        message: 'Ошибка синхронизации'
      };
    } finally {
      this.isSyncing = false;
      this.progressCallback = null;
    }
  }

  /**
   * Process poems in background using batching to avoid UI freeze
   */
  private async processPoemsInBackground(poems: Poem[]): Promise<SyncResult> {
    return new Promise((resolve) => {
      // Wait for interactions to finish before processing
      InteractionManager.runAfterInteractions(async () => {
        try {
          let processedCount = 0;
          const batchSize = API_CONFIG.BATCH_SIZE;
          const totalBatches = Math.ceil(poems.length / batchSize);

          console.log(`SyncService: Processing ${poems.length} poems in ${totalBatches} batches`);

          // Process poems in batches
          for (let i = 0; i < poems.length; i += batchSize) {
            const batch = poems.slice(i, i + batchSize);

            // Import batch
            await PoemService.importPoems(batch);

            processedCount += batch.length;

            // Report progress
            if (this.progressCallback) {
              this.progressCallback({
                loaded: processedCount,
                total: poems.length,
                percentage: Math.round((processedCount / poems.length) * 100),
              });
            }

            // Yield to main thread between batches to keep UI responsive
            await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
          }

          resolve({
            success: true,
            message: `Загружено ${poems.length} ${this.getPoemWord(poems.length)}`,
            totalPoems: poems.length,
            newPoems: poems.length,
          });
        } catch (error) {
          console.error('SyncService: Error processing poems:', error);
          resolve({
            success: false,
            message: 'Ошибка обработки данных',
          });
        }
      });
    });
  }

  /**
   * Progress callback for fetch operation
   */
  private onFetchProgress(progress: SyncProgress) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  /**
   * Check if sync is needed based on last sync time
   */
  async shouldSync(): Promise<boolean> {
    const lastSync = await StorageService.getLastSync();

    if (!lastSync) {
      console.log('SyncService: Never synced before - will sync now');
      return true; // Auto-sync on first launch to get server data
    }

    // Sync if last sync was more than configured hours ago
    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const hoursSinceLastSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);

    const shouldSync = hoursSinceLastSync > API_CONFIG.SYNC_INTERVAL_HOURS;
    console.log('SyncService: Hours since last sync:', hoursSinceLastSync.toFixed(2));
    console.log('SyncService: Should sync:', shouldSync);

    return shouldSync;
  }

  /**
   * Auto-sync if needed (called on app start)
   */
  async autoSync(): Promise<void> {
    console.warn('🔍 SyncService.autoSync: Checking if sync is needed...');
    const shouldSync = await this.shouldSync();

    if (shouldSync) {
      console.warn('✅ SyncService.autoSync: Sync needed, starting...');
      await this.sync();
      console.warn('✅ SyncService.autoSync: Sync completed');
    } else {
      console.warn('⏭️  SyncService.autoSync: Sync skipped (recent sync exists)');
    }
  }

  /**
   * Cancel ongoing sync operation
   */
  cancelSync() {
    ApiService.cancelFetch();
    this.isSyncing = false;
    this.progressCallback = null;
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
