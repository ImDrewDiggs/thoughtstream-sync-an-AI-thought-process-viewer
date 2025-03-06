
import { toast } from "@/components/ui/use-toast";
import { StreamHandlers, ModelMapping } from "./types/aiTypes";
import { getApiKey } from "./apiKeyService";
import { processStreamedResponse } from "./streamProcessingService";

// Map our model IDs to OpenAI model IDs
const MODEL_MAPPING: ModelMapping = {
  'gpt-4-mini': 'gpt-4o-mini',
  'gpt-4': 'gpt-4o',
  'claude-3': 'gpt-4o', // Fallback since we're using OpenAI
  'llama-3': 'gpt-4o-mini', // Fallback
  'gemini-pro': 'gpt-4o' // Fallback
};

// Main function to connect with OpenAI API and stream thoughts
export const streamThoughtsFromOpenAI = async (
  prompt: string, 
  modelId: string,
  handlers: StreamHandlers
) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    handlers.onError("API key not found. Please add your OpenAI API key.");
    return;
  }
  
  const openaiModel = MODEL_MAPPING[modelId] || 'gpt-4o-mini';
  
  try {
    // Make the OpenAI API request with streaming enabled
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that thinks step by step and shows your reasoning process. Break down your thoughts clearly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      // Get the error details
      const errorBody = await response.text();
      let errorMessage = `API error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorBody);
        
        // Handle quota exceeded error
        if (errorData.error?.code === "insufficient_quota" || errorBody.includes("exceeded your current quota")) {
          errorMessage = "OpenAI API quota exceeded. Please check your billing details or upgrade your OpenAI plan.";
          
          // Show toast with more details
          toast({
            title: "API Quota Exceeded",
            description: "Your OpenAI account has reached its quota limit. Visit platform.openai.com to upgrade your plan.",
            variant: "destructive",
          });
        } else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        // If we can't parse the JSON, just use the status code
        console.error("Error parsing API error response:", e);
      }
      
      handlers.onError(errorMessage);
      return;
    }
    
    // Process the streamed response
    await processStreamedResponse(response, handlers);
    
  } catch (error) {
    console.error("Error connecting to OpenAI:", error);
    handlers.onError("Failed to connect to OpenAI API. Please check your connection and try again.");
  }
};
