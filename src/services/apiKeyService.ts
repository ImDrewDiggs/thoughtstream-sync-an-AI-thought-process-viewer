
// Service to manage API keys for different providers

// Get the API key from localStorage
export const getApiKey = (provider: string = 'openai') => {
  return localStorage.getItem(`${provider}_api_key`);
};

// Store the API key in localStorage
export const storeApiKey = (apiKey: string, provider: string = 'openai') => {
  localStorage.setItem(`${provider}_api_key`, apiKey);
};

// Clear the API key from localStorage
export const clearApiKey = (provider: string = 'openai') => {
  localStorage.removeItem(`${provider}_api_key`);
};
