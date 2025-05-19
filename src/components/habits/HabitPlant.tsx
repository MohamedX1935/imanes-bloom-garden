import React, { useState } from 'react';
import { CheckCircle, Trash2, Flower } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as icons from 'lucide-react';
import ButterflyReward from '../effects/ButterflyReward';

export type GrowthStage = 0 | 1 | 2 | 3 | 4;

export interface Habit {
  id: string;
  name: string;
  iconName?: string;
  streak: number;
  completedToday: boolean;
  lastCompleted?: Date;
  growthStage: GrowthStage; // 0: seed, 1: sprout, 2: growing, 3: blooming, 4: mature
  regressionDisabled?: boolean; // New property to prevent regression once mature
}

interface HabitPlantProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitPlant: React.FC<HabitPlantProps> = ({ habit, onComplete, onDelete }) => {
  const [animate, setAnimate] = useState(false);
  const [showButterflies, setShowButterflies] = useState(false);

  // Plant visuals based on growth stage
  const plantImages = [
    "🌱", // seed (stage 0)
    "🌿", // sprout (stage 1)
    "🪴", // growing (stage 2)
    "🌸", // blooming (stage 3)
    "🌳", // mature tree (stage 4)
  ];

  const plantDescriptions = [
    "Graine plantée", // seed
    "Début de pousse", // sprout
    "En croissance", // growing
    "Floraison", // blooming
    "Arbre mature", // mature tree
  ];

  const plantSize = [
    "text-3xl", // seed
    "text-4xl", // sprout
    "text-5xl", // growing
    "text-6xl", // blooming
    "text-7xl", // mature tree
  ];

  // Get the icon component from habit.iconName
  const getIconComponent = () => {
    if (!habit.iconName || !(habit.iconName in icons)) {
      return Flower;
    }
    return (icons as any)[habit.iconName];
  };

  const IconComponent = getIconComponent();
  
  // Calculer le nombre de jours restants pour atteindre l'étape suivante
  const getDaysToNextStage = () => {
    const daysRequired = [0, 3, 7, 14, 30]; // Jours requis pour chaque étape
    if (habit.growthStage >= 4) return null; // Étape finale atteinte
    
    const currentStageThreshold = daysRequired[habit.growthStage + 1];
    return currentStageThreshold - habit.streak;
  };
  
  const daysToNextStage = getDaysToNextStage();
  
  const handleCompleteClick = () => {
    if (habit.completedToday) return;
    
    // Animer la plante quand marquée complète
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1000);
    
    // Montrer les papillons de récompense
    onComplete(habit.id);
    
    // Afficher les papillons avec un léger délai pour permettre à l'état de se mettre à jour
    setTimeout(() => {
      setShowButterflies(true);
    }, 100);
    
    // Cacher les papillons après un certain temps
    setTimeout(() => {
      setShowButterflies(false);
    }, 3500);
  };
  
  // Déterminer le nombre de papillons en fonction du streak et de l'étape de croissance
  const getButterfliesCount = () => {
    // Bonus pour accomplir un arbre mature (étape 4)
    if (habit.growthStage === 4) return 7;
    
    // Le nombre augmente avec le streak
    if (habit.streak >= 30) return 5;
    if (habit.streak >= 14) return 4;
    if (habit.streak >= 7) return 3;
    if (habit.streak >= 3) return 2;
    return 1;
  };
  
  return (
    <div className="bloom-card flex flex-col items-center relative">
      <button
        onClick={() => onDelete(habit.id)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Supprimer l'habitude"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      
      <div 
        className={cn(
          "mb-3 transition-all duration-500",
          plantSize[habit.growthStage],
          animate ? "animate-bounce" : "",
          habit.completedToday ? "animate-float" : ""
        )}
      >
        {plantImages[habit.growthStage]}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1">{habit.name}</h3>
        <p className="text-xs text-gray-500 mb-1">
          {habit.streak} jours de suite
        </p>
        <p className="text-xs text-bloom-green mb-3">
          {plantDescriptions[habit.growthStage]}
          {daysToNextStage !== null && daysToNextStage > 0 && (
            <span className="block text-gray-500 mt-1">
              ({daysToNextStage} jours avant évolution)
            </span>
          )}
          {habit.growthStage === 4 && (
            <span className="block text-bloom-purple mt-1 font-semibold">
              ★ Objectif atteint ! ★
            </span>
          )}
        </p>
      </div>
      
      <div className="flex space-x-2 mt-auto">
        <div className="bg-bloom-purple-light/30 p-1.5 rounded-full mb-2">
          <IconComponent className="w-4 h-4 text-bloom-purple" />
        </div>
        
        <button
          onClick={handleCompleteClick}
          disabled={habit.completedToday}
          className={cn(
            "rounded-full p-2 transition-all duration-300",
            habit.completedToday 
              ? "bg-bloom-green text-white cursor-default" 
              : "bg-bloom-green-light text-bloom-green-dark hover:bg-bloom-green hover:text-white"
          )}
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
      
      {/* Système de papillons de récompense amélioré */}
      {showButterflies && (
        <ButterflyReward 
          show={true} 
          count={getButterfliesCount()} 
          onComplete={() => setShowButterflies(false)}
        />
      )}
    </div>
  );
};

export default HabitPlant;
