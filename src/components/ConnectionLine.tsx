
import React from 'react';

interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isAnimated?: boolean;
  isVisible: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY,
  isAnimated = true,
  isVisible
}) => {
  // Calculate control points for the curved line
  const controlPointX = (startX + endX) / 2;
  const controlPointY = (startY + endY) / 2 - 30;
  
  // Create the SVG path
  const path = `M ${startX} ${startY} Q ${controlPointX} ${controlPointY}, ${endX} ${endY}`;
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 0,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <path
        d={path}
        className={isAnimated ? 'thought-node-connection' : ''}
        fill="none"
        stroke="hsl(210, 100%, 70%)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={isAnimated ? "10" : "0"}
      />
      {/* Animated dot along the path */}
      {isAnimated && (
        <circle r="3" fill="#3B82F6">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      )}
    </svg>
  );
};

export default ConnectionLine;
