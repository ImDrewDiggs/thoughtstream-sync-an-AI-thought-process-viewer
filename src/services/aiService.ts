
// Re-export functionality from individual service modules
import { getApiKey, storeApiKey, clearApiKey } from './apiKeyService';
import { streamThoughtsFromOpenAI } from './openaiService';
import { streamThoughtsFromClaude } from './claudeService';
import { ApiProvider } from './types/aiTypes';
import { ModelInfo } from '@/utils/modelUtils';

// Export the API key management functions
export { getApiKey, storeApiKey, clearApiKey };

// Determine the API provider based on model ID
const getProviderForModel = (modelId: string): ApiProvider => {
  if (modelId.startsWith('claude')) {
    return 'claude';
  }
  return 'openai';
};

// Main function to stream thoughts from any supported AI provider
export const streamThoughtsFromAI = async (
  prompt: string,
  modelInfo: ModelInfo,
  handlers: any
) => {
  const provider = getProviderForModel(modelInfo.id);
  
  switch (provider) {
    case 'claude':
      return streamThoughtsFromClaude(prompt, modelInfo.id, handlers);
    case 'openai':
    default:
      return streamThoughtsFromOpenAI(prompt, modelInfo.id, handlers);
  }
};
