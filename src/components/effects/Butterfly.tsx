
import React from 'react';
import { cn } from '@/lib/utils';

interface ButterflyProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  position: { x: number, y: number };
  className?: string;
  onAnimationEnd?: () => void;
}

const Butterfly: React.FC<ButterflyProps> = ({ 
  color, 
  size = 'md', 
  position,
  className,
  onAnimationEnd
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };
  
  return (
    <div 
      className={cn(
        "absolute z-50 transition-all duration-[3s] animate-butterfly",
        sizeClasses[size],
        className
      )}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        filter: `hue-rotate(${color === 'blue' ? 180 : color === 'purple' ? 270 : color === 'pink' ? 320 : color === 'green' ? 100 : 0}deg)`
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <g className="butterfly-wings animate-butterfly-wings">
          <path 
            d="M25,30 C20,20 10,15 5,20 C0,25 10,35 25,30 Z" 
            fill="#9b87f5" 
            className="left-wing"
          />
          <path 
            d="M25,30 C30,20 40,15 45,20 C50,25 40,35 25,30 Z" 
            fill="#9b87f5" 
            className="right-wing"
          />
        </g>
        <line x1="25" y1="30" x2="25" y2="35" stroke="#333" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default Butterfly;
