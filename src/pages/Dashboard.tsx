
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';

const Dashboard = () => {
  // These would normally be fetched from a global state or API
  const [stats, setStats] = useState({
    habitsCompleted: 1,
    totalHabits: 3,
    journalEntries: 0,
    totalSteps: 4500,
    activityMinutes: 0
  });
  
  // For demo purposes, let's simulate some data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalSteps: prev.totalSteps + Math.floor(Math.random() * 10) + 1
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const renderQuote = () => {
    const quotes = [
      "La constance est le chemin de l'excellence.",
      "Prends soin de ton corps pour nourrir ton esprit.",
      "Chaque petite habitude te rapproche de la personne que tu veux devenir.",
      "La créativité naît de la pratique quotidienne.",
      "Célèbre chaque petit progrès sur ton chemin."
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return (
      <Card className="bloom-card mt-6 text-center">
        <blockquote className="text-lg italic text-bloom-purple-dark">
          "{randomQuote}"
        </blockquote>
      </Card>
    );
  };
  
  return (
    <div className="pb-24">
      <PageHeader 
        title="Tableau d'Épanouissement" 
        subtitle="Ton parcours de croissance personnelle"
      />
      
      <div className="px-4 space-y-6">
        <SummaryCards 
          habitsCompleted={stats.habitsCompleted}
          totalHabits={stats.totalHabits}
          journalEntries={stats.journalEntries}
          totalSteps={stats.totalSteps}
          activityMinutes={stats.activityMinutes}
        />
        
        <Card className="bloom-card">
          <h3 className="font-handwriting text-bloom-purple-dark text-xl mb-3">Ta Semaine</h3>
          
          <div className="grid grid-cols-7 gap-1">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
              <div 
                key={day + i} 
                className={`text-center py-2 ${i === new Date().getDay() ? 'bg-bloom-purple-light/30 rounded-lg font-medium text-bloom-purple-dark' : ''}`}
              >
                <div className="text-sm">{day}</div>
                <div className="mt-1">
                  {/* Random emoji for each day */}
                  {["🌱", "🪴", "🌿", "🌸", "✨", "📚", "🧘‍♀️"][i]}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {renderQuote()}
      </div>
    </div>
  );
};

export default Dashboard;
