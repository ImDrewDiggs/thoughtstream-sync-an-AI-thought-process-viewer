
import { ThoughtNode } from "@/utils/modelUtils";

// Interface for streaming response handlers
export interface StreamHandlers {
  onThought: (thought: ThoughtNode) => void;
  onFinish: () => void;
  onError: (error: string) => void;
}

// OpenAI model mapping type
export type ModelMapping = Record<string, string>;
