
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ModelSelector from '@/components/ModelSelector';
import ModelUploader from '@/components/ModelUploader';
import ThoughtVisualizer from '@/components/ThoughtVisualizer';
import TimelineControl from '@/components/TimelineControl';
import ApiKeyDialog from '@/components/ApiKeyDialog';
import { ModelInfo, ThoughtNode } from '@/utils/modelUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getApiKey, streamThoughtsFromOpenAI } from '@/services/aiService';

const Index = () => {
  // State for model selection
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [customModels, setCustomModels] = useState<ModelInfo[]>([]);
  
  // State for thought visualization
  const [thoughts, setThoughts] = useState<ThoughtNode[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for API connection
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  
  const animationRef = useRef<number | null>(null);
  
  // Check for API key on mount
  useEffect(() => {
    const apiKey = getApiKey();
    setHasApiKey(!!apiKey);
  }, []);
  
  // Update API key status when dialog closes
  const handleApiDialogChange = (open: boolean) => {
    setShowApiDialog(open);
    if (!open) {
      setHasApiKey(!!getApiKey());
    }
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
    
    // Check if API key is available
    if (!hasApiKey) {
      setShowApiDialog(true);
      return;
    }
    
    setIsProcessing(true);
    setThoughts([]);
    
    // Reset the timeline
    stopAnimation();
    setIsPlaying(false);
    
    // Stream thoughts from the OpenAI API
    streamThoughtsFromOpenAI(prompt, selectedModel.id, {
      onThought: (thought) => {
        setThoughts(prev => {
          const updatedThoughts = [...prev, thought];
          if (prev.length === 0) {
            setCurrentTime(thought.createdAt);
          }
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
      onError: (error) => {
        setIsProcessing(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      }
    });
  };
  
  // Animation controls
  const startAnimation = () => {
    if (!thoughts.length) return;
    
    const startTime = thoughts[0].createdAt;
    const endTime = thoughts[thoughts.length - 1].createdAt;
    
    if (currentTime >= endTime) {
      setCurrentTime(startTime);
    }
    
    const step = (timestamp: number) => {
      setCurrentTime(prev => {
        const newTime = prev + 16; // ~60fps
        
        if (newTime >= endTime) {
          setIsPlaying(false);
          return endTime;
        }
        
        return newTime;
      });
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(step);
      }
    };
    
    animationRef.current = requestAnimationFrame(step);
  };
  
  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Handle play/pause toggle
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Handle reset
  const handleReset = () => {
    stopAnimation();
    setCurrentTime(thoughts[0]?.createdAt || 0);
    setIsPlaying(false);
  };
  
  // Start or stop animation based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }
    
    return () => {
      stopAnimation();
    };
  }, [isPlaying]);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);
  
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
              onConnectApiClick={() => setShowApiDialog(true)}
              hasApiKey={hasApiKey}
            />
            <ModelUploader onModelUploaded={handleModelUploaded} />
          </div>
          
          {/* Center and right columns - Prompt input and visualization */}
          <div className="md:col-span-2 space-y-6">
            {/* Prompt input section */}
            <div className="glass-panel p-6 animate-appear">
              <h2 className="text-lg font-medium mb-4">Enter Prompt</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleGenerateThoughts}
                  disabled={isProcessing || !selectedModel}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Generate Thought Process"}
                </Button>
              </div>
            </div>
            
            {/* Visualization section */}
            {thoughts.length > 0 && (
              <div className="glass-panel p-6 animate-appear">
                <h2 className="text-lg font-medium mb-4">AI Thought Visualization</h2>
                
                <div className="h-[400px] mb-6 rounded-xl overflow-hidden border border-gray-100">
                  <ThoughtVisualizer 
                    thoughts={thoughts} 
                    currentTime={currentTime} 
                  />
                </div>
                
                <TimelineControl 
                  thoughts={thoughts}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  onTimeChange={setCurrentTime}
                  onPlayPause={handlePlayPause}
                  onReset={handleReset}
                />
              </div>
            )}
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
      />
    </div>
  );
};

export default Index;
