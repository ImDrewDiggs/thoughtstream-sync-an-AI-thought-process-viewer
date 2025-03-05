
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getApiKey, storeApiKey } from "@/services/aiService";
import { InfoIcon } from "lucide-react";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState(getApiKey() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!apiKey.trim()) {
        toast({
          title: "API Key Required",
          description: "Please enter a valid API key",
          variant: "destructive"
        });
        return;
      }
      
      storeApiKey(apiKey.trim());
      
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved securely"
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to connect with GPT models. Your key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Get your API key from{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                platform.openai.com/api-keys
              </a>
            </p>
          </div>
          
          <div className="rounded-md bg-blue-50 p-3 text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-3 text-blue-800">
                <h3 className="font-medium">About API Usage</h3>
                <div className="mt-1 text-xs">
                  <p>ThoughtStream Sync uses your OpenAI API key to visualize thought processes. Usage counts toward your OpenAI account quota.</p>
                  <p className="mt-1">Free tier accounts have limited usage. Consider upgrading to a paid plan if you encounter quota errors.</p>
                  <a 
                    href="https://platform.openai.com/account/billing/overview" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-1 block font-medium text-blue-600 hover:underline"
                  >
                    Check your usage →
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save API Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
