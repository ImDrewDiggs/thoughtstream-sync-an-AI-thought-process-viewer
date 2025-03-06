
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ModelSelector from '@/components/ModelSelector';
import ModelUploader from '@/components/ModelUploader';
import ApiKeyDialog from '@/components/ApiKeyDialog';
import PromptInput from '@/components/PromptInput';
import ApiErrorAlert from '@/components/ApiErrorAlert';
import ThoughtVisualizationSection from '@/components/ThoughtVisualizationSection';
import { ModelInfo, ThoughtNode } from '@/utils/modelUtils';
import { toast } from '@/components/ui/use-toast';
import { getApiKey, streamThoughtsFromAI } from '@/services/aiService';
import { API_PROVIDERS } from '@/services/types/aiTypes';
import useThoughtAnimation from '@/hooks/useThoughtAnimation';

const Index = () => {
  // State for model selection
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [customModels, setCustomModels] = useState<ModelInfo[]>([]);
  
  // State for thought visualization
  const [thoughts, setThoughts] = useState<ThoughtNode[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for API connection
  const [hasApiKey, setHasApiKey] = useState<Record<string, boolean>>({});
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Use our custom animation hook
  const {
    currentTime,
    isPlaying,
    handlePlayPause,
    handleReset,
    handleTimeChange
  } = useThoughtAnimation({ thoughts });
  
  // Check for API keys on mount
  useEffect(() => {
    checkAllApiKeys();
  }, []);
  
  // Check all API keys
  const checkAllApiKeys = () => {
    const apiKeyStatus: Record<string, boolean> = {};
    API_PROVIDERS.forEach(provider => {
      apiKeyStatus[provider.id] = !!getApiKey(provider.id);
    });
    setHasApiKey(apiKeyStatus);
  };
  
  // Update API key status when dialog closes
  const handleApiDialogChange = (open: boolean) => {
    setShowApiDialog(open);
    if (!open) {
      checkAllApiKeys();
    }
  };

  // Handle API key dialog open with selected provider
  const handleConnectApiClick = (provider?: string) => {
    if (provider) {
      setSelectedProvider(provider);
    }
    setShowApiDialog(true);
  };
  
  // Handle model upload
  const handleModelUploaded = (model: ModelInfo) => {
    setCustomModels(prev => [...prev, model]);
    setSelectedModel(model);
    toast({
      title: "Model added",
      description: `${model.name} has been added to your models.`
    });
  };
  
  // Generate thought process
  const handleGenerateThoughts = () => {
    if (!selectedModel) {
      toast({
        title: "Select a model",
        description: "Please select an AI model first.",
        variant: "destructive"
      });
      return;
    }
    
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please enter a prompt to process.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if API key is available for the selected model's provider
    if (!hasApiKey[selectedModel.provider]) {
      setSelectedProvider(selectedModel.provider);
      setShowApiDialog(true);
      return;
    }
    
    setIsProcessing(true);
    setThoughts([]);
    setApiError(null);
    
    // Reset the animation
    handleReset();
    
    // Stream thoughts from the selected AI provider
    streamThoughtsFromAI(prompt, selectedModel, {
      onThought: (thought: ThoughtNode) => {
        setThoughts(prev => {
          const updatedThoughts = [...prev, thought];
          return updatedThoughts;
        });
      },
      onFinish: () => {
        setIsProcessing(false);
        toast({
          title: "Thought process completed",
          description: "You can now visualize the AI's thinking process."
        });
      },
      onError: (error: string) => {
        setIsProcessing(false);
        setApiError(error);
        toast({
          title: "Error",
          description: "Failed to generate thought process",
          variant: "destructive"
        });
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 flex flex-col space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Model selection */}
          <div className="space-y-6">
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelSelect={setSelectedModel}
              customModels={customModels}
              onConnectApiClick={handleConnectApiClick}
              hasApiKey={hasApiKey}
            />
            <ModelUploader onModelUploaded={handleModelUploaded} />
          </div>
          
          {/* Center and right columns - Prompt input and visualization */}
          <div className="md:col-span-2 space-y-6">
            {/* Prompt input section */}
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerateThoughts}
              isProcessing={isProcessing}
              isDisabled={!selectedModel}
            />
            
            {/* API Error Alert */}
            <ApiErrorAlert 
              error={apiError} 
              onUpdateApiKey={() => {
                if (selectedModel) {
                  setSelectedProvider(selectedModel.provider);
                }
                setShowApiDialog(true)
              }} 
            />
            
            {/* Visualization section */}
            <ThoughtVisualizationSection
              thoughts={thoughts}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeChange={handleTimeChange}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        <p>ThoughtStream Sync — Visualize AI thinking in real-time</p>
      </footer>
      
      {/* API Key Dialog */}
      <ApiKeyDialog 
        open={showApiDialog} 
        onOpenChange={handleApiDialogChange}
        selectedProvider={selectedProvider}
      />
    </div>
  );
};

export default Index;
