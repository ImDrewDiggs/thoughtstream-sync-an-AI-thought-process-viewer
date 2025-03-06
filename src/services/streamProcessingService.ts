
import { toast } from "@/components/ui/use-toast";
import { ThoughtNode } from "@/utils/modelUtils";
import { StreamHandlers } from "./types/aiTypes";

// Process the streamed response from the API
export const processStreamedResponse = async (
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
