/**
 * API Configuration
 *
 * Update API_BASE_URL with your actual server URL
 */

export const API_CONFIG = {
  // Base URL from original CommonSettings.cs (HTTPS for security)
  BASE_URL: 'https://junior.ana-yurt.com',

  // API Endpoints
  ENDPOINTS: {
    POEMS: '/api/?action=poems',
  },

  // Request timeout in milliseconds
  TIMEOUT: 30000, // 30 seconds for large data

  // Sync interval in hours
  SYNC_INTERVAL_HOURS: 24,

  // Batch processing
  BATCH_SIZE: 10, // Process poems in batches of 10 to avoid UI freeze
};

// Helper function to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
