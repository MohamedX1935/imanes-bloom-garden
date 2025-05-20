
import React, { useState } from 'react';
import { CheckCircle, Trash2, Flower, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import HabitReminderDialog from './HabitReminderDialog';
import { toast } from 'sonner';

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
  reminderEnabled?: boolean; // Whether a reminder is enabled
  reminderTime?: string; // Time for the reminder (HH:MM)
  notificationId?: number; // ID of the scheduled notification
}

interface HabitPlantProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateReminder?: (
    id: string, 
    reminderEnabled: boolean, 
    reminderTime: string, 
    notificationId?: number
  ) => void;
}

const HabitPlant: React.FC<HabitPlantProps> = ({ 
  habit, 
  onComplete, 
  onDelete,
  onUpdateReminder = () => {} // Default empty function if not provided
}) => {
  const [animate, setAnimate] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

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
    
    onComplete(habit.id);
  };

  const handleReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la propagation au parent
    setReminderDialogOpen(true);
  };

  const handleSaveReminder = (
    habitId: string, 
    reminderEnabled: boolean, 
    reminderTime: string, 
    notificationId?: number
  ) => {
    onUpdateReminder(habitId, reminderEnabled, reminderTime, notificationId);
  };
  
  return (
    <div className="bloom-card flex flex-col items-center relative">
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          onClick={handleReminderClick}
          className={`p-1 ${habit.reminderEnabled 
            ? 'text-bloom-purple' 
            : 'text-gray-400 hover:text-bloom-purple'} transition-colors`}
          aria-label="Configurer un rappel"
        >
          <Bell className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(habit.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Supprimer l'habitude"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
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

      <HabitReminderDialog 
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        habit={habit}
        onSaveReminder={handleSaveReminder}
      />
    </div>
  );
};

export default HabitPlant;
