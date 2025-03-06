
import React from 'react';
import { ModelInfo, predefinedModels } from '@/utils/modelUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { API_PROVIDERS } from '@/services/types/aiTypes';
import { getApiKey } from '@/services/apiService';

interface ModelSelectorProps {
  selectedModel: ModelInfo | null;
  onModelSelect: (model: ModelInfo) => void;
  customModels: ModelInfo[];
  onConnectApiClick: (provider?: string) => void;
  hasApiKey: Record<string, boolean>;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelSelect,
  customModels,
  onConnectApiClick,
  hasApiKey
}) => {
  const allModels = [...predefinedModels, ...customModels];

  const renderProviderBadge = (provider: string) => {
    const providerInfo = API_PROVIDERS.find(p => p.id === provider);
    if (!providerInfo) return null;
    
    return (
      <div className="mt-1 flex items-center">
        <span className={cn(
          "text-xs rounded-full px-2 py-0.5 mr-1",
          hasApiKey[provider] ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
        )}>
          {providerInfo.name}
        </span>
        {!hasApiKey[provider] && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6 px-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            onClick={(e) => {
              e.stopPropagation();
              onConnectApiClick(provider);
            }}
          >
            Connect
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Select AI Model</h2>
        <div className="flex gap-2">
          {API_PROVIDERS.map(provider => (
            <Button 
              key={provider.id}
              onClick={() => onConnectApiClick(provider.id)}
              variant={hasApiKey[provider.id] ? "outline" : "default"}
              size="sm"
              className="text-xs"
            >
              {hasApiKey[provider.id] ? `Update ${provider.name}` : `Connect ${provider.name}`}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allModels.map((model) => (
          <div 
            key={model.id}
            onClick={() => onModelSelect(model)}
            className={cn(
              "p-4 rounded-xl border transition-all duration-300 hover-scale cursor-pointer",
              selectedModel?.id === model.id 
                ? "border-blue-400 bg-blue-50/50" 
                : "border-gray-200 hover:border-gray-300 bg-white/50"
            )}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{model.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {model.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{model.description}</p>
            {renderProviderBadge(model.provider)}
          </div>
        ))}
      </div>
      
      {Object.values(hasApiKey).every(v => !v) && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <p>API connection required to visualize real AI thought processes.</p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
