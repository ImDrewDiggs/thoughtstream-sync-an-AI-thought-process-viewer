
import React from 'react';
import { cn } from '@/lib/utils';
import { ThoughtNode as ThoughtNodeType } from '@/utils/modelUtils';

interface ThoughtNodeProps {
  node: ThoughtNodeType;
  style?: React.CSSProperties;
  isVisible: boolean;
}

const ThoughtNode: React.FC<ThoughtNodeProps> = ({ 
  node, 
  style, 
  isVisible 
}) => {
  // Determine the node color based on type
  const getNodeColor = () => {
    switch (node.type) {
      case 'input':
        return 'bg-emerald-50 border-emerald-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'decision':
        return 'bg-amber-50 border-amber-200';
      case 'output':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  const getNodeIcon = () => {
    switch (node.type) {
      case 'input':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        );
      case 'processing':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'decision':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      case 'output':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "absolute thought-node p-3 rounded-lg border shadow-sm",
        "transition-all duration-300 hover:shadow-md",
        getNodeColor(),
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={style}
    >
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white">
          {getNodeIcon()}
        </div>
        <span className="text-xs font-medium capitalize text-gray-600">
          {node.type}
        </span>
      </div>
      <p className="text-sm text-gray-800">{node.text}</p>
    </div>
  );
};

export default ThoughtNode;
