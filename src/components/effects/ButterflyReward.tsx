import React, { useState, useEffect } from 'react';
import Butterfly from './Butterfly';

export interface ButterflyType {
  id: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  position: { x: number, y: number };
  targetPosition?: { x: number, y: number };
  flightPattern?: string;
}

interface ButterflyRewardProps {
  show: boolean;
  count?: number;
  onComplete?: () => void;
}

// Variété étendue de couleurs pour les papillons
const BUTTERFLY_COLORS = [
  'blue', 'purple', 'pink', 'orange', 'green', 
  'yellow', 'teal', 'red', 'indigo', 'cyan', 
  'magenta', 'gold', 'lime'
];

// Différents modèles de vol pour les papillons
const FLIGHT_PATTERNS = [
  'zigzag', 'straight', 'curved', 'spiral', 'wave'
];

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
      
      // Générer de nouveaux papillons avec plus de variété
      const newButterflies = Array.from({ length: count }).map((_, index) => {
        // Position de départ plus variée (différents côtés de l'écran)
        const startPositions = [
          { x: Math.random() * windowWidth * 0.8 + windowWidth * 0.1, y: windowHeight + 20 }, // bas
          { x: -20, y: Math.random() * windowHeight * 0.8 + windowHeight * 0.1 }, // gauche
          { x: windowWidth + 20, y: Math.random() * windowHeight * 0.8 + windowHeight * 0.1 } // droite
        ];
        const startPosition = startPositions[Math.floor(Math.random() * startPositions.length)];
        
        // Position finale - tendre vers le centre de l'écran avec variation
        const targetX = Math.random() * windowWidth * 0.6 + windowWidth * 0.2;
        const targetY = Math.random() * (windowHeight * 0.6) + windowHeight * 0.2;
        
        // Sélection aléatoire de couleur
        const color = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)];
        
        // Sélection aléatoire de taille avec distribution ajustée
        // Plus de chances d'avoir des tailles moyennes
        const sizeDistribution = ['sm', 'sm', 'md', 'md', 'md', 'lg', 'lg'];
        const size = sizeDistribution[Math.floor(Math.random() * sizeDistribution.length)] as 'sm' | 'md' | 'lg';
        
        // Attribuer un pattern de vol
        const flightPattern = FLIGHT_PATTERNS[Math.floor(Math.random() * FLIGHT_PATTERNS.length)];
        
        return {
          id: `butterfly-${Date.now()}-${index}`,
          color,
          size,
          position: { x: startPosition.x, y: startPosition.y },
          targetPosition: { x: targetX, y: targetY },
          flightPattern
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
      
      // Ajouter les papillons collectés au localStorage avec plus de détails
      const collectedButterflies = JSON.parse(localStorage.getItem('collectedButterflies') || '[]');
      const newCollection = [
        ...collectedButterflies,
        ...butterflies.map(b => ({
          id: b.id,
          color: b.color,
          size: b.size,
          collected: new Date().toISOString(),
          rarity: calculateRarity(b.color, b.size) // Calcul de rareté basé sur couleur et taille
        }))
      ];
      localStorage.setItem('collectedButterflies', JSON.stringify(newCollection));
    }
  }, [animationCompleted, butterflies.length, onComplete, butterflies]);
  
  // Fonction pour calculer la rareté d'un papillon
  const calculateRarity = (color: string, size: string) => {
    // Couleurs plus rares
    const rareColors = ['magenta', 'gold', 'cyan', 'teal'];
    // La taille grande est plus rare
    
    if (rareColors.includes(color) && size === 'lg') {
      return 'legendary';
    } else if (rareColors.includes(color)) {
      return 'rare';
    } else if (size === 'lg') {
      return 'uncommon';
    }
    return 'common';
  };
  
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
      {butterflies.map((butterfly) => (
        <Butterfly 
          key={butterfly.id}
          color={butterfly.color}
          size={butterfly.size}
          position={butterfly.position}
          className={butterfly.targetPosition ? `animate-butterfly-${butterfly.flightPattern || 'rise'}` : ""}
          onAnimationEnd={() => handleAnimationEnd(butterfly.id)}
        />
      ))}
    </>
  );
};

export default ButterflyReward;
