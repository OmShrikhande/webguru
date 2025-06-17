// API configuration file
let API_BASE_URL = 'http://localhost';
let API_PORT = '5000';

// Function to fetch configuration from the backend
const fetchConfig = async () => {
  try {
    // Use a default URL to fetch the config
    const response = await fetch(`${API_BASE_URL}:${API_PORT}/api/config`);
    if (response.ok) {
      const config = await response.json();
      API_BASE_URL = config.apiBaseUrl;
      API_PORT = config.port;
      console.log('API config loaded:', { API_BASE_URL, API_PORT });
    }
  } catch (error) {
    console.warn('Failed to fetch API config, using defaults:', error);
  }
};

// Initialize config on load
fetchConfig();

// Helper function to get the full API URL
const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}:${API_PORT}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export { API_BASE_URL, API_PORT, getApiUrl }