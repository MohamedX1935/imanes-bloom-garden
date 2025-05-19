
import React from 'react';
import { cn } from '@/lib/utils';

interface ButterflyProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  position: { x: number, y: number };
  className?: string;
  onAnimationEnd?: () => void;
  flightPattern?: string;
}

const Butterfly: React.FC<ButterflyProps> = ({ 
  color, 
  size = 'md', 
  position,
  className,
  onAnimationEnd,
  flightPattern // Now we properly accept this prop
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };
  
  // Couleurs de base pour les papillons
  const colorValues = {
    blue: { primary: '#9b87f5', secondary: '#7b67d5' },
    purple: { primary: '#d946ef', secondary: '#c026d3' },
    pink: { primary: '#ff9ff3', secondary: '#f368e0' },
    orange: { primary: '#ff9f43', secondary: '#ee5a24' },
    green: { primary: '#a3cb38', secondary: '#78e08f' },
    yellow: { primary: '#fff200', secondary: '#ffda79' },
    teal: { primary: '#00d2d3', secondary: '#01a3a4' },
    red: { primary: '#ff6b6b', secondary: '#ee5253' },
    indigo: { primary: '#5f27cd', secondary: '#341f97' },
    cyan: { primary: '#48dbfb', secondary: '#0abde3' },
    magenta: { primary: '#ff00ff', secondary: '#c31db5' },
    gold: { primary: '#ffda79', secondary: '#cc8e35' },
    lime: { primary: '#c8ff00', secondary: '#7fad39' }
  };
  
  // Obtenir la couleur spécifique ou utiliser une couleur par défaut
  const butterflyColor = colorValues[color as keyof typeof colorValues] || colorValues.blue;
  
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
      }}
      onAnimationEnd={onAnimationEnd}
      data-flight-pattern={flightPattern} // We can add this as a data attribute for potential CSS targeting
    >
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <g className="butterfly-wings animate-butterfly-wings">
          <path 
            d="M25,30 C20,20 10,15 5,20 C0,25 10,35 25,30 Z" 
            fill={butterflyColor.primary}
            stroke={butterflyColor.secondary}
            strokeWidth="0.5"
            className="left-wing"
          />
          <path 
            d="M25,30 C30,20 40,15 45,20 C50,25 40,35 25,30 Z" 
            fill={butterflyColor.primary}
            stroke={butterflyColor.secondary}
            strokeWidth="0.5"
            className="right-wing"
          />
          {/* Motifs décoratifs sur les ailes (cercles, lignes, etc.) */}
          <circle cx="15" cy="23" r="1.5" fill={butterflyColor.secondary} />
          <circle cx="35" cy="23" r="1.5" fill={butterflyColor.secondary} />
          <circle cx="18" cy="27" r="1" fill={butterflyColor.secondary} />
          <circle cx="32" cy="27" r="1" fill={butterflyColor.secondary} />
        </g>
        <line x1="25" y1="30" x2="25" y2="35" stroke="#333" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default Butterfly;
