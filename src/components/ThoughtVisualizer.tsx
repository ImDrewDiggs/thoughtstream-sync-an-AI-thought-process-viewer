
import React, { useRef, useState, useEffect } from 'react';
import ThoughtNode from './ThoughtNode';
import ConnectionLine from './ConnectionLine';
import { ThoughtNode as ThoughtNodeType } from '@/utils/modelUtils';

interface ThoughtVisualizerProps {
  thoughts: ThoughtNodeType[];
  currentTime: number;
}

const ThoughtVisualizer: React.FC<ThoughtVisualizerProps> = ({ 
  thoughts, 
  currentTime 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 500 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Track the node positions based on their coordinates
  const nodePositions = new Map<string, { x: number, y: number }>();
  
  // Update container size on resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.1;
    const newScale = Math.max(0.5, Math.min(2, scale + delta));
    setScale(newScale);
  };
  
  // Render connections between nodes
  const renderConnections = () => {
    const connections: React.ReactNode[] = [];
    
    thoughts.forEach(node => {
      const startPos = nodePositions.get(node.id);
      
      if (startPos) {
        node.connections.forEach(targetId => {
          const endPos = nodePositions.get(targetId);
          
          if (endPos) {
            // Calculate absolute positions
            const startX = startPos.x + 100; // Offset for node width
            const startY = startPos.y + 25; // Offset for node height
            const endX = endPos.x;
            const endY = endPos.y + 25; // Offset for node height
            
            const isVisible = 
              node.createdAt <= currentTime && 
              thoughts.find(t => t.id === targetId)?.createdAt <= currentTime;
            
            connections.push(
              <ConnectionLine
                key={`${node.id}-${targetId}`}
                startX={startX}
                startY={startY}
                endX={endX}
                endY={endY}
                isVisible={!!isVisible}
              />
            );
          }
        });
      }
    });
    
    return connections;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-blue-50/30 rounded-xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div 
        className="absolute"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          width: containerSize.width,
          height: containerSize.height,
        }}
      >
        {/* Render connections first (in the background) */}
        {renderConnections()}
        
        {/* Render nodes on top */}
        {thoughts.map((node) => {
          // Calculate node position based on its coordinates
          const nodeX = node.x;
          const nodeY = node.y;
          
          // Store the position for connection calculations
          nodePositions.set(node.id, { x: nodeX, y: nodeY });
          
          const isVisible = node.createdAt <= currentTime;
          
          return (
            <ThoughtNode
              key={node.id}
              node={node}
              isVisible={isVisible}
              style={{
                left: `${nodeX}px`,
                top: `${nodeY}px`,
                width: '200px',
              }}
            />
          );
        })}
      </div>
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
          onClick={() => setScale(Math.min(2, scale + 0.1))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-8.5M3 15l4.5-4.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ThoughtVisualizer;
