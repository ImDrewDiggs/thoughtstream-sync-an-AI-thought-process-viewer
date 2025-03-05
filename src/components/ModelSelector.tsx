
import React from 'react';
import { ModelInfo, predefinedModels } from '@/utils/modelUtils';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel: ModelInfo | null;
  onModelSelect: (model: ModelInfo) => void;
  customModels: ModelInfo[];
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelSelect,
  customModels
}) => {
  const allModels = [...predefinedModels, ...customModels];

  return (
    <div className="glass-panel p-6 flex flex-col space-y-4 w-full">
      <h2 className="text-lg font-medium">Select AI Model</h2>
      
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
    </div>
  );
};

export default ModelSelector;
