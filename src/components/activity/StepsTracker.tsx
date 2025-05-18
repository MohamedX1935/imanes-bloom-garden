import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Settings, TrendingUp } from 'lucide-react';
import { getUserProfile } from '../settings/UserSettings';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StepsTrackerProps {
  className?: string;
  onOpenSettings: () => void;
}

interface StepData {
  steps: number;
  distance: number;  // in km
  calories: number;
}

const StepsTracker: React.FC<StepsTrackerProps> = ({ className, onOpenSettings }) => {
  const [goal] = useState(10000); // Default goal of 10,000 steps
  const [progress, setProgress] = useState(0);
  const [stepData, setStepData] = useState<StepData>({
    steps: 0,
    distance: 0,
    calories: 0
  });
  const [sensorAvailable, setSensorAvailable] = useState(false);

  // Check if we have sensor access and initialize step counting
  useEffect(() => {
    // Try to access device motion sensors
    if (typeof DeviceMotionEvent !== 'undefined') {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        // iOS 13+ requires permission request
        toast.info("Appuyez sur 'Autoriser' pour activer le comptage de pas");
        
        const requestPermission = async () => {
          try {
            const permissionState = await (DeviceMotionEvent as any).requestPermission();
            if (permissionState === 'granted') {
              initializeStepCounting();
              setSensorAvailable(true);
            } else {
              console.log('Permission denied for motion sensors');
              useSimulatedSteps();
            }
          } catch (error) {
            console.error('Error requesting motion permission:', error);
            useSimulatedSteps();
          }
        };
        
        // Request permission when component mounts
        requestPermission();
      } else {
        // Other browsers that support DeviceMotionEvent without permission
        initializeStepCounting();
        setSensorAvailable(true);
      }
    } else {
      // Fallback for browsers/devices without motion sensors
      console.log('DeviceMotionEvent not supported');
      useSimulatedSteps();
    }
    
    // Load saved steps from localStorage
    const savedSteps = localStorage.getItem('todaySteps');
    if (savedSteps) {
      const data = JSON.parse(savedSteps);
      // Only use saved steps if they're from today
      const today = new Date().toDateString();
      if (data.date === today) {
        setStepData(data.stepData);
      } else {
        // Reset for new day
        const newData = { date: today, stepData: { steps: 0, distance: 0, calories: 0 } };
        localStorage.setItem('todaySteps', JSON.stringify(newData));
      }
    }
    
    return () => {
      // Cleanup event listeners if needed
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  // Update progress whenever steps change
  useEffect(() => {
    setProgress(Math.min(100, (stepData.steps / goal) * 100));
    
    // Save steps to localStorage
    const today = new Date().toDateString();
    localStorage.setItem('todaySteps', JSON.stringify({
      date: today,
      stepData
    }));
  }, [stepData.steps, goal]);

  // Initialize step counting with device motion sensors
  const initializeStepCounting = () => {
    // Variables for step detection algorithm
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    let lastTime = 0;
    let threshold = 10; // Threshold for step detection
    
    const handleMotion = (event: DeviceMotionEvent) => {
      if (!event.acceleration || !event.acceleration.x) return;
      
      const { x, y, z } = event.acceleration;
      const currentTime = new Date().getTime();
      
      // Only process if we have enough time difference (debounce)
      if (currentTime - lastTime < 300) return;
      
      // Calculate magnitude of acceleration change
      const deltaX = Math.abs(x - lastAcceleration.x);
      const deltaY = Math.abs(y - lastAcceleration.y);
      const deltaZ = Math.abs(z - lastAcceleration.z);
      
      const acceleration = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
      
      // Check if the acceleration exceeds our threshold for a step
      if (acceleration > threshold) {
        // Step detected!
        setStepData(prev => {
          const newSteps = prev.steps + 1;
          const profile = getUserProfile();
          const newDistance = parseFloat((newSteps * profile.strideLength / 1000).toFixed(2));
          
          // Calculate calories (MET * weight * hours)
          // MET = 3.5 for normal walking
          // Convert time from minutes to hours (assuming 1 step takes ~0.5 seconds)
          const timeInHours = (newSteps * 0.5) / 3600;
          const caloriesBurned = Math.round(3.5 * profile.weight * timeInHours);
          
          return {
            steps: newSteps,
            distance: newDistance,
            calories: caloriesBurned
          };
        });
        
        lastTime = currentTime;
      }
      
      // Update last acceleration values
      lastAcceleration = { x, y, z };
    };
    
    // Add event listener for motion detection
    window.addEventListener('devicemotion', handleMotion);
  };

  // Fallback for devices without motion sensors
  const useSimulatedSteps = () => {
    // Start with a random number of steps between 2000-6000
    const initialSteps = Math.floor(Math.random() * 4000) + 2000;
    const profile = getUserProfile();
    
    const initialDistance = parseFloat((initialSteps * profile.strideLength / 1000).toFixed(2));
    const timeInHours = (initialSteps * 0.5) / 3600;
    const initialCalories = Math.round(3.5 * profile.weight * timeInHours);
    
    setStepData({
      steps: initialSteps,
      distance: initialDistance,
      calories: initialCalories
    });
    
    const interval = setInterval(() => {
      setStepData(prev => {
        const newSteps = prev.steps + Math.floor(Math.random() * 5) + 1;
        const newDistance = parseFloat((newSteps * profile.strideLength / 1000).toFixed(2));
        const timeInHours = (newSteps * 0.5) / 3600;
        const caloriesBurned = Math.round(3.5 * profile.weight * timeInHours);
        
        return {
          steps: newSteps,
          distance: newDistance,
          calories: caloriesBurned
        };
      });
    }, 7000); // Slower interval for simulation
    
    return () => clearInterval(interval);
  };

  return (
    <Card className={`bloom-card ${className || ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-center flex-1">
          <div className="inline-flex items-center justify-center bg-bloom-purple-light/30 p-3 rounded-full mb-4">
            <TrendingUp className="h-6 w-6 text-bloom-purple" />
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onOpenSettings} 
          className="text-gray-400 hover:text-bloom-purple"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-1">{stepData.steps.toLocaleString()}</h3>
        <p className="text-sm text-gray-500 mb-3">Pas aujourd'hui</p>
        
        <Progress 
          value={progress} 
          className="h-2 bg-bloom-green-light mb-2" 
        />
        
        <p className="text-xs text-gray-500 mb-4">
          {goal.toLocaleString()} pas objectif • 
          {progress < 100 
            ? ` ${Math.round(goal - stepData.steps).toLocaleString()} restants` 
            : ' Objectif atteint!'}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-gray-100">
          <div>
            <p className="text-lg font-semibold">{stepData.distance.toFixed(2)} km</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{stepData.calories}</p>
            <p className="text-xs text-gray-500">Calories</p>
          </div>
        </div>
        
        {!sensorAvailable && (
          <p className="text-xs text-amber-500 mt-3">
            Mode simulation activé (capteurs non disponibles)
          </p>
        )}
      </div>
    </Card>
  );
};

export default StepsTracker;
