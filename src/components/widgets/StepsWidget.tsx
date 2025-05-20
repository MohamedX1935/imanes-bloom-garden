
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StepsWidgetProps {
  steps: number;
  distance: number;
  calories: number;
  className?: string;
  compact?: boolean;
}

const StepsWidget: React.FC<StepsWidgetProps> = ({ 
  steps, 
  distance, 
  calories, 
  className = '',
  compact = false
}) => {
  // Widget compact pour l'écran d'accueil du téléphone
  if (compact) {
    return (
      <div className={`rounded-lg bg-white shadow-sm p-3 flex items-center ${className}`}>
        <div className="bg-bloom-purple-light/30 p-2 rounded-full mr-3">
          <TrendingUp className="h-4 w-4 text-bloom-purple" />
        </div>
        <div>
          <p className="text-sm font-bold">{steps.toLocaleString()}</p>
          <p className="text-xs text-gray-500">pas aujourd'hui</p>
        </div>
      </div>
    );
  }
  
  // Widget standard
  return (
    <div className={`rounded-lg bg-white shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">Activité</h3>
        <div className="bg-bloom-purple-light/30 p-2 rounded-full">
          <TrendingUp className="h-4 w-4 text-bloom-purple" />
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-2xl font-bold">{steps.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mb-3">Pas aujourd'hui</p>
        
        <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-gray-100">
          <div>
            <p className="text-sm font-semibold">{distance.toFixed(2)} km</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
          <div>
            <p className="text-sm font-semibold">{calories}</p>
            <p className="text-xs text-gray-500">Calories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsWidget;
