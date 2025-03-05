
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ThoughtNode } from '@/utils/modelUtils';

interface TimelineControlProps {
  thoughts: ThoughtNode[];
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

const TimelineControl: React.FC<TimelineControlProps> = ({
  thoughts,
  currentTime,
  isPlaying,
  onTimeChange,
  onPlayPause,
  onReset
}) => {
  // Get the start and end times of the thought process
  const startTime = thoughts.length > 0 ? thoughts[0].createdAt : 0;
  const endTime = thoughts.length > 0 ? thoughts[thoughts.length - 1].createdAt : 0;
  
  // Calculate the progress percentage
  const progress = endTime > startTime
    ? Math.min(100, ((currentTime - startTime) / (endTime - startTime)) * 100)
    : 0;
  
  // Format the current timestamp
  const formatTime = (timeMs: number) => {
    const seconds = Math.floor((timeMs - startTime) / 1000);
    const milliseconds = Math.floor(((timeMs - startTime) % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newTime = startTime + ((endTime - startTime) * value[0]) / 100;
    onTimeChange(newTime);
  };

  return (
    <div className="glass-panel p-4 w-full flex flex-col space-y-4 animate-appear">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Timeline</h3>
        <span className="text-xs text-gray-600">
          {formatTime(currentTime)}
        </span>
      </div>
      
      <Slider
        value={[progress]}
        min={0}
        max={100}
        step={0.1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      
      {/* Timeline markers */}
      <div className="relative w-full h-6">
        {thoughts.map((thought, index) => {
          const position = ((thought.createdAt - startTime) / (endTime - startTime)) * 100;
          return (
            <div
              key={thought.id}
              className="absolute w-1 h-3 bg-blue-400 rounded-full transform -translate-x-1/2"
              style={{ left: `${position}%` }}
              title={thought.text}
            >
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-500">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          className="px-3 py-1 h-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={onPlayPause}
          className="px-4 py-1 h-8"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  );
};

export default TimelineControl;
