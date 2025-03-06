
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  isDisabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isProcessing,
  isDisabled
}) => {
  return (
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
          onClick={onGenerate}
          disabled={isProcessing || isDisabled}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Generate Thought Process"}
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;
