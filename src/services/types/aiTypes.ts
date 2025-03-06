
import { ThoughtNode } from "@/utils/modelUtils";

export interface StreamHandlers {
  onThought: (thought: ThoughtNode) => void;
  onFinish: () => void;
  onError: (error: string) => void;
}

export interface ModelMapping {
  [key: string]: string;
}

export type ApiProvider = 'openai' | 'claude' | 'other';

export interface ProviderInfo {
  id: ApiProvider;
  name: string;
  description: string;
  apiUrlInfo: string;
  requiresApiKey: boolean;
}

export const API_PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Connect to GPT-4o and other OpenAI models',
    apiUrlInfo: 'https://platform.openai.com/api-keys',
    requiresApiKey: true
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Connect to Claude 3 Sonnet, Opus, and Haiku',
    apiUrlInfo: 'https://console.anthropic.com/keys',
    requiresApiKey: true
  }
];
