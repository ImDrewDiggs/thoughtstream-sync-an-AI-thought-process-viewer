
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { getApiKey, storeApiKey } from "@/services/apiService";
import { InfoIcon } from "lucide-react";
import { API_PROVIDERS, ProviderInfo } from "@/services/types/aiTypes";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProvider?: string;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedProvider = 'openai'
}) => {
  const [activeTab, setActiveTab] = useState(selectedProvider);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved API keys when dialog opens
  useEffect(() => {
    if (open) {
      const keys: Record<string, string> = {};
      API_PROVIDERS.forEach(provider => {
        keys[provider.id] = getApiKey(provider.id) || '';
      });
      setApiKeys(keys);
      setActiveTab(selectedProvider);
    }
  }, [open, selectedProvider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const currentKey = apiKeys[activeTab];
      
      if (!currentKey.trim()) {
        toast({
          title: "API Key Required",
          description: "Please enter a valid API key",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      storeApiKey(currentKey.trim(), activeTab);
      
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved locally"
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

  const getProviderInfo = (providerId: string): ProviderInfo => {
    return API_PROVIDERS.find(p => p.id === providerId) || API_PROVIDERS[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Connection</DialogTitle>
          <DialogDescription>
            Enter your API key to connect with language models. Your keys are stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            {API_PROVIDERS.map((provider) => (
              <TabsTrigger 
                key={provider.id} 
                value={provider.id}
                className="flex-1"
              >
                {provider.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {API_PROVIDERS.map((provider) => (
            <TabsContent key={provider.id} value={provider.id}>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor={`${provider.id}ApiKey`}>{provider.name} API Key</Label>
                  <Input
                    id={`${provider.id}ApiKey`}
                    type="password"
                    placeholder={provider.id === 'openai' ? "sk-..." : "sk-ant-..."}
                    value={apiKeys[provider.id] || ''}
                    onChange={(e) => setApiKeys(prev => ({...prev, [provider.id]: e.target.value}))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Get your API key from{" "}
                    <a 
                      href={getProviderInfo(provider.id).apiUrlInfo}
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {provider.id === 'openai' ? 'platform.openai.com/api-keys' : 'console.anthropic.com/keys'}
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
                        <p>This application uses your API key to analyze and visualize responses. Usage counts toward your account quota.</p>
                        <p className="mt-1">Free tier accounts have limited usage. Consider upgrading to a paid plan if you encounter quota errors.</p>
                        <a 
                          href={provider.id === 'openai' ? 
                                "https://platform.openai.com/account/billing/overview" :
                                "https://console.anthropic.com/account/billing"}
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
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
