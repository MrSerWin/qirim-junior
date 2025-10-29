/**
 * API Configuration
 *
 * Update API_BASE_URL with your actual server URL
 */

export const API_CONFIG = {
  // TODO: Replace with your actual API URL
  BASE_URL: 'https://your-api-server.com/api',

  // API Endpoints
  ENDPOINTS: {
    POEMS: '/poems',
    SYNC: '/sync',
    HEALTH: '/health',
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Sync interval in hours
  SYNC_INTERVAL_HOURS: 24,
};

// Helper function to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
