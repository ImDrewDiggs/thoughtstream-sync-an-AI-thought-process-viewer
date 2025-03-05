
import { toast } from "@/components/ui/use-toast";

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  type: string;
}

export interface ThoughtNode {
  id: string;
  text: string;
  type: 'input' | 'processing' | 'output' | 'decision';
  connections: string[];
  x: number;
  y: number;
  createdAt: number;
}

export const predefinedModels: ModelInfo[] = [
  {
    id: 'gpt-4-mini',
    name: 'GPT-4 Mini',
    description: 'Smaller version of GPT-4 with faster inference',
    type: 'language'
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    description: 'Open source large language model by Meta',
    type: 'language'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Advanced reasoning model by Anthropic',
    type: 'language'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Multimodal model by Google',
    type: 'multimodal'
  }
];

// Simulated thought process generation
export const generateThoughtProcess = (prompt: string, modelId: string): ThoughtNode[] => {
  const thoughtNodes: ThoughtNode[] = [];
  
  // Initial input node
  thoughtNodes.push({
    id: 'input-1',
    text: `Processing input: "${prompt}"`,
    type: 'input',
    connections: ['proc-1'],
    x: 50,
    y: 50,
    createdAt: Date.now()
  });
  
  // Processing nodes (simulated)
  thoughtNodes.push({
    id: 'proc-1',
    text: 'Analyzing key concepts in the input',
    type: 'processing',
    connections: ['proc-2'],
    x: 200,
    y: 120,
    createdAt: Date.now() + 500
  });
  
  thoughtNodes.push({
    id: 'proc-2',
    text: 'Retrieving relevant knowledge',
    type: 'processing',
    connections: ['dec-1'],
    x: 350,
    y: 80,
    createdAt: Date.now() + 1000
  });
  
  // Decision node
  thoughtNodes.push({
    id: 'dec-1',
    text: 'Determining response approach',
    type: 'decision',
    connections: ['proc-3', 'proc-4'],
    x: 500,
    y: 150,
    createdAt: Date.now() + 1500
  });
  
  // More processing
  thoughtNodes.push({
    id: 'proc-3',
    text: 'Formulating detailed explanation',
    type: 'processing',
    connections: ['output-1'],
    x: 650,
    y: 80,
    createdAt: Date.now() + 2000
  });
  
  thoughtNodes.push({
    id: 'proc-4',
    text: 'Considering alternative viewpoints',
    type: 'processing',
    connections: ['output-1'],
    x: 650,
    y: 220,
    createdAt: Date.now() + 2500
  });
  
  // Output node
  thoughtNodes.push({
    id: 'output-1',
    text: 'Synthesizing final response',
    type: 'output',
    connections: [],
    x: 800,
    y: 150,
    createdAt: Date.now() + 3000
  });
  
  return thoughtNodes;
};

export const handleModelUpload = async (file: File): Promise<ModelInfo | null> => {
  try {
    // This is a simulated model upload
    // In a real app, you would need to handle the actual model file here
    
    // Simulating processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check file size (example validation)
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File too large",
        description: "The model file size should be less than 100MB",
        variant: "destructive"
      });
      return null;
    }
    
    // Return mocked model info based on the file name
    const modelInfo: ModelInfo = {
      id: `custom-${Date.now()}`,
      name: file.name.split('.')[0],
      description: 'Custom uploaded model',
      type: file.name.includes('vision') ? 'multimodal' : 'language'
    };
    
    toast({
      title: "Model uploaded successfully",
      description: `${modelInfo.name} is ready to use`
    });
    
    return modelInfo;
  } catch (error) {
    console.error("Error uploading model:", error);
    toast({
      title: "Upload failed",
      description: "There was a problem uploading your model",
      variant: "destructive"
    });
    return null;
  }
};
