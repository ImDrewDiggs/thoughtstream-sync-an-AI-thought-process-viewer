
// API key storage and management
export const storeApiKey = (apiKey: string) => {
  localStorage.setItem('openai_api_key', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

export const clearApiKey = () => {
  localStorage.removeItem('openai_api_key');
};
