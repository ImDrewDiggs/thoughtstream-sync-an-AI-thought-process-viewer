
import React from 'react';
import ThoughtVisualizer from '@/components/ThoughtVisualizer';
import TimelineControl from '@/components/TimelineControl';
import { ThoughtNode } from '@/utils/modelUtils';

interface ThoughtVisualizationSectionProps {
  thoughts: ThoughtNode[];
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

const ThoughtVisualizationSection: React.FC<ThoughtVisualizationSectionProps> = ({
  thoughts,
  currentTime,
  isPlaying,
  onTimeChange,
  onPlayPause,
  onReset
}) => {
  if (thoughts.length === 0) return null;

  return (
    <div className="glass-panel p-6 animate-appear">
      <h2 className="text-lg font-medium mb-4">AI Thought Visualization</h2>
      
      <div className="h-[400px] mb-6 rounded-xl overflow-hidden border border-gray-100">
        <ThoughtVisualizer 
          thoughts={thoughts} 
          currentTime={currentTime} 
        />
      </div>
      
      <TimelineControl 
        thoughts={thoughts}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTimeChange={onTimeChange}
        onPlayPause={onPlayPause}
        onReset={onReset}
      />
    </div>
  );
};

export default ThoughtVisualizationSection;
