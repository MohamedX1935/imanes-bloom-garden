
import React, { useState } from 'react';
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import HabitPlant, { Habit } from '@/components/habits/HabitPlant';
import AddHabitDialog from '@/components/habits/AddHabitDialog';

// Sample initial habits
const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Méditation',
    streak: 3,
    completedToday: false,
    growthStage: 2,
  },
  {
    id: '2',
    name: 'Lecture',
    streak: 7,
    completedToday: true,
    growthStage: 3,
  },
  {
    id: '3',
    name: 'Cours de langue',
    streak: 1,
    completedToday: false,
    growthStage: 1,
  }
];

const Garden = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleCompleteHabit = (id: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === id) {
          const newStreak = habit.streak + 1;
          
          // Calculate new growth stage based on streak
          let growthStage = habit.growthStage;
          if (newStreak >= 10) growthStage = 3;
          else if (newStreak >= 5) growthStage = 2;
          else if (newStreak >= 1) growthStage = 1;
          
          return {
            ...habit,
            completedToday: true,
            streak: newStreak,
            growthStage,
            lastCompleted: new Date()
          };
        }
        return habit;
      })
    );
    
    toast.success("Habitude accomplie ! 🌱");
  };

  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      streak: 0,
      completedToday: false,
      growthStage: 0
    };
    
    setHabits(prev => [...prev, newHabit]);
    toast.success(`${name} ajoutée à ton jardin !`);
  };

  return (
    <div className="pb-24">
      <PageHeader 
        title="Mon Jardin des Habitudes" 
        subtitle="Cultive tes habitudes jour après jour"
      />
      
      <div className="grid grid-cols-2 gap-4 px-4 mt-4">
        {habits.map(habit => (
          <HabitPlant
            key={habit.id}
            habit={habit}
            onComplete={handleCompleteHabit}
          />
        ))}
        
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="h-full min-h-[180px] bg-bloom-green-light/30 border-2 border-dashed border-bloom-green-light hover:border-bloom-green hover:bg-bloom-green-light/50 text-bloom-green-dark flex flex-col gap-2 rounded-2xl"
        >
          <Plus className="w-8 h-8" />
          <span>Nouvelle habitude</span>
        </Button>
      </div>
      
      <AddHabitDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddHabit={handleAddHabit}
      />
    </div>
  );
};

export default Garden;
