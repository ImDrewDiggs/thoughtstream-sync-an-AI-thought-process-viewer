
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

interface ApiErrorAlertProps {
  error: string | null;
  onUpdateApiKey: () => void;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, onUpdateApiKey }) => {
  if (!error) return null;

  const isQuotaError = error.includes("quota");

  return (
    <Alert variant="destructive" className="animate-appear">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        {isQuotaError && (
          <>
            <p className="font-semibold mt-2">How to fix:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Visit <a href="https://platform.openai.com/account/billing/overview" target="_blank" rel="noreferrer" className="underline">OpenAI Billing</a> to check your usage</li>
              <li>Upgrade to a paid plan or add more credits</li>
              <li>Try using a different API key</li>
            </ol>
            <Button variant="outline" size="sm" onClick={onUpdateApiKey} className="mt-2">
              Update API Key
            </Button>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ApiErrorAlert;
