
import React from 'react';
import { CheckCircle, Trash2, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as icons from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  iconName?: string;
  streak: number;
  completedToday: boolean;
  lastCompleted?: Date;
  growthStage: 0 | 1 | 2 | 3; // 0: seed, 1: sprout, 2: growing, 3: blooming
}

interface HabitPlantProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitPlant: React.FC<HabitPlantProps> = ({ habit, onComplete, onDelete }) => {
  // Plant visuals based on growth stage
  const plantImages = [
    "🌱", // seed
    "🌿", // sprout
    "🪴", // growing
    "🌸", // blooming
  ];

  const plantSize = [
    "text-3xl", // seed
    "text-4xl", // sprout
    "text-5xl", // growing
    "text-6xl", // blooming
  ];

  // Get the icon component from habit.iconName
  const getIconComponent = () => {
    if (!habit.iconName || !(habit.iconName in icons)) {
      return Leaf;
    }
    return (icons as any)[habit.iconName];
  };

  const IconComponent = getIconComponent();
  
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
          habit.completedToday ? "animate-float" : ""
        )}
      >
        {plantImages[habit.growthStage]}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1">{habit.name}</h3>
        <p className="text-xs text-gray-500 mb-3">
          {habit.streak} jours de suite
        </p>
      </div>
      
      <div className="flex space-x-2 mt-auto">
        <div className="bg-bloom-purple-light/30 p-1.5 rounded-full mb-2">
          <IconComponent className="w-4 h-4 text-bloom-purple" />
        </div>
        
        <button
          onClick={() => onComplete(habit.id)}
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
    </div>
  );
};

export default HabitPlant;
