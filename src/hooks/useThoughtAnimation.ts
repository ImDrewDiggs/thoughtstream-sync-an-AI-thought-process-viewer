
import { useRef, useState, useEffect } from 'react';
import { ThoughtNode } from '@/utils/modelUtils';

interface UseThoughtAnimationProps {
  thoughts: ThoughtNode[];
  autoPlay?: boolean;
}

const useThoughtAnimation = ({ thoughts, autoPlay = false }: UseThoughtAnimationProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const animationRef = useRef<number | null>(null);

  const startAnimation = () => {
    if (!thoughts.length) return;
    
    const startTime = thoughts[0].createdAt;
    const endTime = thoughts[thoughts.length - 1].createdAt;
    
    if (currentTime >= endTime) {
      setCurrentTime(startTime);
    }
    
    const step = () => {
      setCurrentTime(prev => {
        const newTime = prev + 16; // ~60fps
        
        if (newTime >= endTime) {
          setIsPlaying(false);
          return endTime;
        }
        
        return newTime;
      });
      
      if (animationRef.current) {
        animationRef.current = requestAnimationFrame(step);
      }
    };
    
    animationRef.current = requestAnimationFrame(step);
  };
  
  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handleReset = () => {
    stopAnimation();
    if (thoughts.length > 0) {
      setCurrentTime(thoughts[0].createdAt);
    }
    setIsPlaying(false);
  };
  
  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  // Start or stop animation based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(() => startAnimation());
    } else {
      stopAnimation();
    }
    
    return () => {
      stopAnimation();
    };
  }, [isPlaying, thoughts]);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  // Initialize currentTime when thoughts change
  useEffect(() => {
    if (thoughts.length > 0 && currentTime === 0) {
      setCurrentTime(thoughts[0].createdAt);
    }
  }, [thoughts, currentTime]);

  return {
    currentTime,
    isPlaying,
    handlePlayPause,
    handleReset,
    handleTimeChange
  };
};

export default useThoughtAnimation;
