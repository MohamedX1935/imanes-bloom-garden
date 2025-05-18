
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import HabitPlant, { Habit, GrowthStage } from '@/components/habits/HabitPlant';
import AddHabitDialog from '@/components/habits/AddHabitDialog';
import { getUserProfile } from '@/components/settings/UserSettings';

// Calculer l'étape de croissance en fonction du streak
const calculateGrowthStage = (streak: number): GrowthStage => {
  if (streak >= 30) return 4; // Arbre mature après 30 jours
  if (streak >= 14) return 3; // Floraison après 14 jours
  if (streak >= 7) return 2; // En croissance après 7 jours
  if (streak >= 3) return 1; // Pousse après 3 jours
  return 0; // Graine
};

// Sample initial habits
const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Méditation',
    iconName: 'Flower',
    streak: 3,
    completedToday: false,
    growthStage: 1,
  },
  {
    id: '2',
    name: 'Lecture',
    iconName: 'BookOpen',
    streak: 14,
    completedToday: true,
    growthStage: 3,
  },
  {
    id: '3',
    name: 'Cours de langue',
    iconName: 'Calendar',
    streak: 1,
    completedToday: false,
    growthStage: 0,
  }
];

const Garden = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [userName, setUserName] = useState("Imane");

  // Vérifier si c'est un nouveau jour et réinitialiser completedToday
  const checkAndResetDailyStatus = (savedHabits: Habit[]) => {
    const lastUpdateStr = localStorage.getItem('lastHabitUpdate');
    const today = new Date().toDateString();
    
    if (lastUpdateStr && lastUpdateStr !== today) {
      // C'est un nouveau jour, réinitialiser completedToday pour toutes les habitudes
      const updatedHabits = savedHabits.map(habit => ({
        ...habit,
        completedToday: false,
        // Si l'habitude n'a pas été complétée hier, réinitialiser le streak
        // sauf si c'est un arbre mature (growthStage 4 et regressionDisabled true)
        streak: habit.completedToday || (habit.growthStage === 4 && habit.regressionDisabled) 
               ? habit.streak 
               : 0,
        // Recalculer le stade de croissance basé sur le nouveau streak
        growthStage: habit.growthStage === 4 && habit.regressionDisabled 
                    ? 4 // Maintenir l'arbre mature
                    : calculateGrowthStage(habit.completedToday ? habit.streak : 0)
      }));
      
      // Sauvegarder les habitudes mises à jour
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      localStorage.setItem('lastHabitUpdate', today);
      
      return updatedHabits;
    }
    
    // Même jour, pas besoin de réinitialiser
    return savedHabits;
  };

  useEffect(() => {
    // Charger les habitudes depuis localStorage si disponible
    const savedHabits = localStorage.getItem('habits');
    let habitsToUse;
    
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      habitsToUse = checkAndResetDailyStatus(parsedHabits);
    } else {
      habitsToUse = initialHabits;
      localStorage.setItem('habits', JSON.stringify(initialHabits));
    }
    
    setHabits(habitsToUse);
    
    // Enregistrer la date d'aujourd'hui pour les vérifications futures
    localStorage.setItem('lastHabitUpdate', new Date().toDateString());

    // Charger le profil utilisateur
    const profile = getUserProfile();
    setUserName(profile.name);
  }, []);

  // Sauvegarder les habitudes dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleCompleteHabit = (id: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === id) {
          const newStreak = habit.streak + 1;
          
          // Calculer le nouveau stade de croissance basé sur le streak
          const growthStage = calculateGrowthStage(newStreak);
          
          // Vérifier si la plante a atteint l'étape mature
          const isNewlyMatured = growthStage === 4 && habit.growthStage !== 4;
          
          // Si la plante vient d'atteindre l'étape mature, afficher une notification spéciale
          if (isNewlyMatured) {
            toast.success(`🌳 Félicitations ! Votre ${habit.name} est devenue un arbre mature !`, {
              duration: 5000,
            });
          }
          
          return {
            ...habit,
            completedToday: true,
            streak: newStreak,
            growthStage,
            lastCompleted: new Date(),
            // Une fois mature (stade 4), empêcher la régression
            regressionDisabled: isNewlyMatured || habit.regressionDisabled
          };
        }
        return habit;
      })
    );
    
    const completedHabit = habits.find(habit => habit.id === id);
    if (completedHabit) {
      toast.success(`Bravo ! Habitude "${completedHabit.name}" accomplie ! 🌱`);
    }
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    toast.success("Habitude supprimée du jardin !");
  };

  const handleAddHabit = (name: string, iconName: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      iconName,
      streak: 0,
      completedToday: false,
      growthStage: 0,
      regressionDisabled: false
    };
    
    setHabits(prev => [...prev, newHabit]);
    toast.success(`${name} ajoutée au jardin d'Imane !`);
  };

  // Calcul des statistiques du jardin
  const totalMatureTrees = habits.filter(h => h.growthStage === 4).length;
  const totalHabits = habits.length;
  
  return (
    <div className="pb-24">
      <PageHeader 
        title={`Jardin des Habitudes de ${userName}`}
        subtitle="Cultive tes habitudes jour après jour"
      />
      
      {/* Statistiques du jardin */}
      <div className="px-4 mb-4">
        <div className="bloom-card bg-bloom-green-light/20 p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-bloom-green-dark">
                <span className="font-semibold">Total des plantes:</span> {totalHabits}
              </p>
              <p className="text-sm text-bloom-purple">
                <span className="font-semibold">Arbres matures:</span> {totalMatureTrees}
              </p>
            </div>
            <div className="text-3xl">
              {totalMatureTrees > 0 ? '🌳' : '🌱'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 px-4 mt-4">
        {habits.map(habit => (
          <HabitPlant
            key={habit.id}
            habit={habit}
            onComplete={handleCompleteHabit}
            onDelete={handleDeleteHabit}
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
