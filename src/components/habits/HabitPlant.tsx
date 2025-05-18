
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  streak: number;
  completedToday: boolean;
  lastCompleted?: Date;
  growthStage: 0 | 1 | 2 | 3; // 0: seed, 1: sprout, 2: growing, 3: blooming
}

interface HabitPlantProps {
  habit: Habit;
  onComplete: (id: string) => void;
}

const HabitPlant: React.FC<HabitPlantProps> = ({ habit, onComplete }) => {
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
  
  return (
    <div className="bloom-card flex flex-col items-center">
      <div 
        className={cn(
          "mb-3 transition-all duration-500",
          plantSize[habit.growthStage],
          habit.completedToday ? "animate-float" : ""
        )}
      >
        {plantImages[habit.growthStage]}
      </div>
      
      <h3 className="text-lg font-medium mb-1">{habit.name}</h3>
      <p className="text-xs text-gray-500 mb-3">
        {habit.streak} jours de suite
      </p>
      
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
  );
};

export default HabitPlant;
