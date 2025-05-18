
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import { getUserProfile } from '@/components/settings/UserSettings';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StepHistory {
  date: string;
  steps: number;
}

const generateDemoHistory = (): StepHistory[] => {
  const history: StepHistory[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    history.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      steps: Math.floor(Math.random() * 6000) + 4000
    });
  }
  
  return history;
};

const Dashboard = () => {
  // These would normally be fetched from a global state or API
  const [stats, setStats] = useState({
    habitsCompleted: 1,
    totalHabits: 3,
    journalEntries: 0,
    totalSteps: 4500,
    activityMinutes: 0
  });

  const [stepHistory, setStepHistory] = useState<StepHistory[]>(generateDemoHistory());
  const [userName, setUserName] = useState("Imane");
  
  // Load data on component mount
  useEffect(() => {
    // Try to load step history from localStorage
    const savedHistory = localStorage.getItem('stepHistory');
    if (savedHistory) {
      setStepHistory(JSON.parse(savedHistory));
    }

    // Load habits data to get completed count
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const habits = JSON.parse(savedHabits);
      const completed = habits.filter((h: any) => h.completedToday).length;
      setStats(prev => ({
        ...prev,
        habitsCompleted: completed,
        totalHabits: habits.length
      }));
    }

    // Load steps data
    const savedSteps = localStorage.getItem('todaySteps');
    if (savedSteps) {
      const data = JSON.parse(savedSteps);
      if (data.stepData) {
        setStats(prev => ({
          ...prev,
          totalSteps: data.stepData.steps
        }));
      }
    }

    // Load activity sessions to get total minutes
    const savedSessions = localStorage.getItem('activitySessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      const minutes = sessions.reduce((acc: number, session: any) => {
        return acc + Math.round(session.duration / 60);
      }, 0);
      
      setStats(prev => ({
        ...prev,
        activityMinutes: minutes
      }));
    }

    // Load user profile
    const profile = getUserProfile();
    setUserName(profile.name);
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
        title={`Tableau d'Épanouissement de ${userName}`}
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
        
        <Card className="bloom-card p-4">
          <h3 className="font-handwriting text-bloom-purple-dark text-xl mb-4">Historique des Pas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stepHistory}
                margin={{ top: 5, right: 10, left: 10, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} pas`, "Pas"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {renderQuote()}
      </div>
    </div>
  );
};

export default Dashboard;
