
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface StepsTrackerProps {
  className?: string;
}

const StepsTracker: React.FC<StepsTrackerProps> = ({ className }) => {
  const [steps, setSteps] = useState(0);
  const [goal] = useState(10000); // Default goal of 10,000 steps
  const [progress, setProgress] = useState(0);

  // Simulate steps increasing over time for demo purposes
  useEffect(() => {
    // Start with a random number of steps between 2000-6000
    const initialSteps = Math.floor(Math.random() * 4000) + 2000;
    setSteps(initialSteps);
    
    const interval = setInterval(() => {
      setSteps(current => {
        const newSteps = current + Math.floor(Math.random() * 10) + 1;
        return newSteps;
      });
    }, 5000); // Add steps every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Update progress whenever steps change
  useEffect(() => {
    setProgress(Math.min(100, (steps / goal) * 100));
  }, [steps, goal]);
  
  return (
    <Card className={`bloom-card ${className || ''}`}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-bloom-purple-light/30 p-3 rounded-full mb-4">
          <TrendingUp className="h-6 w-6 text-bloom-purple" />
        </div>
        <h3 className="text-2xl font-bold mb-1">{steps.toLocaleString()}</h3>
        <p className="text-sm text-gray-500 mb-3">Pas aujourd'hui</p>
        
        <Progress 
          value={progress} 
          className="h-2 bg-bloom-green-light mb-2" 
        />
        
        <p className="text-xs text-gray-500">
          {goal.toLocaleString()} pas objectif • 
          {progress < 100 
            ? ` ${Math.round(goal - steps).toLocaleString()} restants` 
            : ' Objectif atteint!'}
        </p>
      </div>
    </Card>
  );
};

export default StepsTracker;
