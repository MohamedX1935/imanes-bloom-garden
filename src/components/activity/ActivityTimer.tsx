
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ActivityTimerProps {
  className?: string;
  onSessionComplete?: (duration: number) => void;
}

const ActivityTimer: React.FC<ActivityTimerProps> = ({ 
  className, 
  onSessionComplete 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  const handleStartStop = () => {
    if (isRunning) {
      // Stop the timer
      setIsRunning(false);
      if (onSessionComplete && seconds > 0) {
        onSessionComplete(seconds);
      }
    } else {
      // Start the timer
      setIsRunning(true);
    }
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  // Calculate progress for visualization (circular progress would be ideal)
  // For simplicity, we'll use a linear progress that completes at 30 mins
  const progress = Math.min(100, (seconds / (30 * 60)) * 100);
  
  return (
    <Card className={`bloom-card ${className || ''}`}>
      <div className="text-center">
        <h3 className="text-lg font-handwriting text-bloom-purple-dark mb-3">
          Chronomètre d'Activité
        </h3>
        
        <div className="text-4xl font-mono mb-4">
          {formatTime(seconds)}
        </div>
        
        <Progress 
          value={progress} 
          className="h-2 bg-bloom-green-light mb-4" 
        />
        
        <div className="flex justify-between gap-4">
          <Button
            onClick={handleStartStop}
            className={isRunning 
              ? "bg-red-500 hover:bg-red-600 flex-1" 
              : "bg-bloom-green hover:bg-bloom-green-dark flex-1"
            }
          >
            {isRunning ? "Arrêter" : "Démarrer"}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-300 flex-1"
            disabled={isRunning || seconds === 0}
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTimer;
