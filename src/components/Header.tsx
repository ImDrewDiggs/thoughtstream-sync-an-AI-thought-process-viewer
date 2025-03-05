
import React from 'react';
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full py-4 px-6 flex items-center justify-between",
      "glass-panel border-b border-white/20 z-10",
      className
    )}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>
        <h1 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          ThoughtStream Sync
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <a 
          href="#" 
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Documentation
        </a>
        <a 
          href="#" 
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Examples
        </a>
        <div className="h-6 w-px bg-gray-200" />
        <button className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          Share
        </button>
      </div>
    </header>
  );
};

export default Header;
