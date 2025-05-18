
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import StepsTracker from '@/components/activity/StepsTracker';
import ActivityTimer from '@/components/activity/ActivityTimer';
import UserSettings from '@/components/settings/UserSettings';
import { toast } from 'sonner';
import { getUserProfile } from '@/components/settings/UserSettings';

interface ActivitySession {
  id: string;
  date: Date;
  duration: number; // in seconds
  type: 'walk' | 'run' | 'other';
}

const Activity = () => {
  const [sessions, setSessions] = useState<ActivitySession[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("Imane");
  
  useEffect(() => {
    // Load saved sessions from localStorage
    const savedSessions = localStorage.getItem('activitySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    
    // Load user profile
    const profile = getUserProfile();
    setUserName(profile.name);
  }, []);
  
  useEffect(() => {
    // Calculate total minutes from all sessions
    const total = sessions.reduce((acc, session) => {
      return acc + Math.round(session.duration / 60);
    }, 0);
    setTotalMinutes(total);
    
    // Save sessions to localStorage whenever they change
    localStorage.setItem('activitySessions', JSON.stringify(sessions));
  }, [sessions]);
  
  const handleSessionComplete = (duration: number) => {
    const newSession: ActivitySession = {
      id: Date.now().toString(),
      date: new Date(),
      duration,
      type: 'walk' // Default to walk
    };
    
    setSessions(prev => [newSession, ...prev]);
    toast.success(`Activité de ${Math.round(duration / 60)} minutes enregistrée !`);
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };
  
  return (
    <div className="pb-24">
      <PageHeader 
        title={`Espace Activité de ${userName}`}
        subtitle="Suis tes pas et tes séances d'activité"
      />
      
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StepsTracker onOpenSettings={() => setSettingsOpen(true)} />
          <Card className="bloom-card text-center">
            <div className="inline-flex items-center justify-center bg-bloom-peach-light/30 p-3 rounded-full mb-2">
              <span className="text-xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalMinutes}</h3>
            <p className="text-sm text-gray-500">Minutes d'activité</p>
          </Card>
        </div>
        
        <ActivityTimer onSessionComplete={handleSessionComplete} />
        
        {sessions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Activités récentes</h3>
            <div className="space-y-3">
              {sessions.map(session => (
                <Card key={session.id} className="bloom-card p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {session.type === 'walk' ? 'Marche' : 
                         session.type === 'run' ? 'Course' : 'Activité'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className="font-medium text-bloom-purple">
                      {formatDuration(session.duration)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <UserSettings 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </div>
  );
};

export default Activity;
