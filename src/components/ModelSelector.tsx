
import React from 'react';
import { ModelInfo, predefinedModels } from '@/utils/modelUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ModelSelectorProps {
  selectedModel: ModelInfo | null;
  onModelSelect: (model: ModelInfo) => void;
  customModels: ModelInfo[];
  onConnectApiClick: () => void;
  hasApiKey: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelSelect,
  customModels,
  onConnectApiClick,
  hasApiKey
}) => {
  const allModels = [...predefinedModels, ...customModels];

  return (
    <div className="glass-panel p-6 flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Select AI Model</h2>
        <Button 
          onClick={onConnectApiClick}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          {hasApiKey ? "Update API Key" : "Connect API"}
        </Button>
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
          </div>
        ))}
      </div>
      
      {!hasApiKey && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <p>API connection required to visualize real AI thought processes.</p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
