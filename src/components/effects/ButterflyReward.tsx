
import React, { useState, useEffect } from 'react';
import Butterfly from './Butterfly';

export interface ButterflyType {
  id: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  position: { x: number, y: number };
  targetPosition?: { x: number, y: number };
}

interface ButterflyRewardProps {
  show: boolean;
  count?: number;
  onComplete?: () => void;
}

const BUTTERFLY_COLORS = ['blue', 'purple', 'pink', 'orange', 'green'];

const ButterflyReward: React.FC<ButterflyRewardProps> = ({ 
  show, 
  count = 3,
  onComplete 
}) => {
  const [butterflies, setButterflies] = useState<ButterflyType[]>([]);
  const [animationCompleted, setAnimationCompleted] = useState(0);
  
  useEffect(() => {
    if (show) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Générer de nouveaux papillons
      const newButterflies = Array.from({ length: count }).map((_, index) => {
        // Position de départ en bas de l'écran, position aléatoire horizontale
        const startX = Math.random() * windowWidth * 0.8 + windowWidth * 0.1;
        const startY = windowHeight + 20; // Juste en-dessous de l'écran
        
        // Position finale en haut, position aléatoire horizontale
        const targetX = Math.random() * windowWidth * 0.8 + windowWidth * 0.1;
        const targetY = Math.random() * (windowHeight * 0.7) + windowHeight * 0.1;
        
        return {
          id: `butterfly-${Date.now()}-${index}`,
          color: BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)],
          size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)] as 'sm' | 'md' | 'lg',
          position: { x: startX, y: startY },
          targetPosition: { x: targetX, y: targetY }
        };
      });
      
      setButterflies(newButterflies);
      setAnimationCompleted(0);
    } else {
      setButterflies([]);
    }
  }, [show, count]);
  
  // Quand tous les papillons ont terminé leur animation
  useEffect(() => {
    if (animationCompleted === butterflies.length && butterflies.length > 0) {
      if (onComplete) onComplete();
      
      // Ajouter les papillons collectés au localStorage
      const collectedButterflies = JSON.parse(localStorage.getItem('collectedButterflies') || '[]');
      const newCollection = [
        ...collectedButterflies,
        ...butterflies.map(b => ({
          id: b.id,
          color: b.color,
          size: b.size,
          collected: new Date().toISOString()
        }))
      ];
      localStorage.setItem('collectedButterflies', JSON.stringify(newCollection));
    }
  }, [animationCompleted, butterflies.length, onComplete, butterflies]);
  
  const handleAnimationEnd = (id: string) => {
    setAnimationCompleted(prev => prev + 1);
    
    // Mettre à jour la position du papillon pour qu'il reste à sa position finale
    setButterflies(prev => 
      prev.map(b => 
        b.id === id && b.targetPosition 
          ? { ...b, position: b.targetPosition, targetPosition: undefined } 
          : b
      )
    );
  };
  
  return (
    <>
      {butterflies.map((butterfly, index) => (
        <Butterfly 
          key={butterfly.id}
          color={butterfly.color}
          size={butterfly.size}
          position={butterfly.position}
          className={butterfly.targetPosition ? "animate-butterfly-rise" : ""}
          onAnimationEnd={() => handleAnimationEnd(butterfly.id)}
        />
      ))}
    </>
  );
};

export default ButterflyReward;
