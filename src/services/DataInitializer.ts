import { Poem } from 'src/types';
import PoemService from './PoemService';
import { StorageService } from 'src/utils/storage';


// Import the poems JSON data
const poemsData: Poem[] = require('../assets/poems.json');

class DataInitializer {
  private isInitialized = false;

  /**
   * Initialize the database with poems data on first launch
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('DataInitializer: Already initialized, skipping...');
      return;
    }

    try {
      console.log('DataInitializer: Starting initialization...');
      console.log('DataInitializer: Poems data loaded, count:', poemsData?.length || 0);

      const isEmpty = await PoemService.isDatabaseEmpty();
      console.log('DataInitializer: Database is empty?', isEmpty);

      if (isEmpty) {
        console.log('DataInitializer: Database is empty, importing poems...');
        await this.importPoems();
        console.log('DataInitializer: Poems imported successfully!');
      } else {
        console.log('DataInitializer: Database already initialized');
      }

      this.isInitialized = true;
      console.log('DataInitializer: Initialization complete!');
    } catch (error) {
      console.error('DataInitializer: Error during initialization:', error);
      console.error('DataInitializer: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  /**
   * Import poems from bundled JSON file
   */
  private async importPoems(): Promise<void> {
    try {
      // Filter out deleted poems
      const activePoems = poemsData.filter(poem => !poem.IsDeleted);

      // Import in batches for better performance
      const batchSize = 50;
      for (let i = 0; i < activePoems.length; i += batchSize) {
        const batch = activePoems.slice(i, i + batchSize);
        await PoemService.importPoems(batch);
        console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(activePoems.length / batchSize)}`);
      }

      await StorageService.setLastSync(new Date().toISOString());
      await StorageService.setFirstLaunchDone();
    } catch (error) {
      console.error('Error importing poems:', error);
      throw error;
    }
  }

  /**
   * Force re-import all poems (for testing/updates)
   */
  async forceReimport(): Promise<void> {
    await PoemService.clearAllData();
    this.isInitialized = false;
    await this.initialize();
  }
}

export default new DataInitializer();
