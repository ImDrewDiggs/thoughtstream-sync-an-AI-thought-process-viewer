
import { toast } from "@/components/ui/use-toast";
import { StreamHandlers, ModelMapping } from "./types/aiTypes";
import { getApiKey } from "./apiKeyService";
import { processStreamedResponse } from "./streamProcessingService";

// Map our model IDs to Claude model IDs
const MODEL_MAPPING: ModelMapping = {
  'claude-3-sonnet': 'claude-3-sonnet-20240229',
  'claude-3-opus': 'claude-3-opus-20240229',
  'claude-3-haiku': 'claude-3-haiku-20240307',
};

// Main function to connect with Claude API and stream thoughts
export const streamThoughtsFromClaude = async (
  prompt: string, 
  modelId: string,
  handlers: StreamHandlers
) => {
  const apiKey = getApiKey('claude');
  
  if (!apiKey) {
    handlers.onError("Claude API key not found. Please add your Anthropic API key.");
    return;
  }
  
  const claudeModel = MODEL_MAPPING[modelId] || 'claude-3-sonnet-20240229';
  
  try {
    // Make the Claude API request with streaming enabled
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: claudeModel,
        system: "Provide a detailed analysis with your reasoning. Share your thought process as you work through the question.",
        messages: [
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
        if (errorData.error?.type === "authentication_error") {
          errorMessage = "Authentication failed. Please check your Claude API key.";
        } else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        console.error("Error parsing API error response:", e);
      }
      
      handlers.onError(errorMessage);
      return;
    }
    
    // Process the streamed response
    await processClaudeStreamedResponse(response, handlers);
    
  } catch (error) {
    console.error("Error connecting to Claude API:", error);
    handlers.onError("Failed to connect to Claude API. Please check your connection and try again.");
  }
};

// Process Claude's streaming response format
const processClaudeStreamedResponse = async (
  response: Response,
  handlers: StreamHandlers
) => {
  if (!response.body) {
    handlers.onError("Response body is null");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let thoughtId = 1;
  let processingId = 1;
  let decisionId = 1;
  let outputId = 1;

  // Create an initial input node
  const initialNode: ThoughtNode = {
    id: `input-1`,
    text: "Processing request...",
    type: 'input',
    connections: [`proc-${processingId}`],
    x: 50,
    y: 50,
    createdAt: Date.now()
  };
  
  handlers.onThought(initialNode);

  try {
    let lastY = 50;
    let lastX = 50;
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events from the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                continue;
              }
              
              const json = JSON.parse(data);
              const delta = json.delta?.text;
              
              if (delta && delta.trim()) {
                // Create a thought node based on content
                let nodeType: 'processing' | 'decision' | 'output' = 'processing';
                let nodeId = '';
                let connections: string[] = [];
                
                // Determine node type based on content patterns
                if (delta.toLowerCase().includes('if') || 
                    delta.toLowerCase().includes('consider') || 
                    delta.toLowerCase().includes('decide')) {
                  nodeType = 'decision';
                  nodeId = `dec-${decisionId}`;
                  connections = [`proc-${processingId + 1}`];
                  decisionId++;
                } else if (delta.toLowerCase().includes('result') || 
                          delta.toLowerCase().includes('conclusion') || 
                          delta.toLowerCase().includes('therefore')) {
                  nodeType = 'output';
                  nodeId = `output-${outputId}`;
                  connections = [];
                  outputId++;
                } else {
                  nodeType = 'processing';
                  nodeId = `proc-${processingId}`;
                  
                  // Connect to next processing node or decision node
                  if (processingId % 3 === 0) {
                    connections = [`dec-${decisionId}`];
                  } else {
                    connections = [`proc-${processingId + 1}`];
                  }
                  
                  processingId++;
                }
                
                // Calculate node positions
                lastX += 150;
                if (thoughtId % 2 === 0) {
                  lastY += 70;
                } else {
                  lastY -= 30;
                }
                
                const thoughtNode: ThoughtNode = {
                  id: nodeId,
                  text: delta.trim(),
                  type: nodeType,
                  connections,
                  x: lastX,
                  y: lastY,
                  createdAt: Date.now()
                };
                
                handlers.onThought(thoughtNode);
                thoughtId++;
              }
            }
          } catch (err) {
            console.error("Error parsing Claude stream:", err);
          }
        }
      }
    }
    
    // Final output node if none was created
    if (outputId === 1) {
      const finalNode: ThoughtNode = {
        id: `output-${outputId}`,
        text: "Completed processing",
        type: 'output',
        connections: [],
        x: lastX + 150,
        y: lastY,
        createdAt: Date.now()
      };
      
      handlers.onThought(finalNode);
    }
    
    handlers.onFinish();
  } catch (error) {
    console.error("Error reading Claude stream:", error);
    handlers.onError("Error reading response stream");
  }
};

import { ThoughtNode } from "@/utils/modelUtils";
