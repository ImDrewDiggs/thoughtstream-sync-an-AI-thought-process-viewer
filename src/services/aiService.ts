
import { toast } from "@/components/ui/use-toast";
import { ThoughtNode } from "@/utils/modelUtils";

// API key storage and management
export const storeApiKey = (apiKey: string) => {
  localStorage.setItem('openai_api_key', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

export const clearApiKey = () => {
  localStorage.removeItem('openai_api_key');
};

// Interface for streaming response handlers
interface StreamHandlers {
  onThought: (thought: ThoughtNode) => void;
  onFinish: () => void;
  onError: (error: string) => void;
}

// Process the streamed response from OpenAI
const processStreamedResponse = async (
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
    text: "Processing input request",
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
        
        // Process complete chunks from the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5);
            
            if (data === "[DONE]") {
              // Stream completed
              continue;
            }
            
            try {
              const json = JSON.parse(data);
              const delta = json.choices[0]?.delta?.content;
              
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
                // Horizontal position increases with each step
                // Vertical position zigzags to create a flow
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
            } catch (err) {
              console.error("Error parsing JSON from stream:", err);
            }
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
    console.error("Error reading stream:", error);
    handlers.onError("Error reading response stream");
  }
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
  
  // Map our model IDs to OpenAI model IDs
  const modelMapping: Record<string, string> = {
    'gpt-4-mini': 'gpt-4o-mini',
    'gpt-4': 'gpt-4o',
    'claude-3': 'gpt-4o', // Fallback since we're using OpenAI
    'llama-3': 'gpt-4o-mini', // Fallback
    'gemini-pro': 'gpt-4o' // Fallback
  };
  
  const openaiModel = modelMapping[modelId] || 'gpt-4o-mini';
  
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
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      handlers.onError(errorMessage);
      return;
    }
    
    // Process the streamed response
    await processStreamedResponse(response, handlers);
    
  } catch (error) {
    console.error("Error connecting to OpenAI:", error);
    handlers.onError("Failed to connect to OpenAI API");
  }
};
