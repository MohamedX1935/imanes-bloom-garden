
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Flower, 
  BookOpen, 
  Activity, 
  Butterfly, 
  Brush
} from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-full max-w-lg mx-auto bg-white border-t shadow-md">
      <div className="flex items-center justify-around px-2 py-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `flex flex-col items-center p-2 ${
            isActive ? 'text-bloom-purple' : 'text-gray-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Accueil</span>
        </NavLink>

        <NavLink
          to="/garden"
          className={({ isActive }) => `flex flex-col items-center p-2 ${
            isActive ? 'text-bloom-purple' : 'text-gray-500'
          }`}
        >
          <Flower className="w-6 h-6" />
          <span className="text-xs mt-1">Jardin</span>
        </NavLink>

        <NavLink
          to="/journal"
          className={({ isActive }) => `flex flex-col items-center p-2 ${
            isActive ? 'text-bloom-purple' : 'text-gray-500'
          }`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs mt-1">Journal</span>
        </NavLink>

        <NavLink
          to="/activity"
          className={({ isActive }) => `flex flex-col items-center p-2 ${
            isActive ? 'text-bloom-purple' : 'text-gray-500'
          }`}
        >
          <Activity className="w-6 h-6" />
          <span className="text-xs mt-1">Activité</span>
        </NavLink>

        <NavLink
          to="/creative"
          className={({ isActive }) => `flex flex-col items-center p-2 ${
            isActive ? 'text-bloom-purple' : 'text-gray-500'
          }`}
        >
          <Brush className="w-6 h-6" />
          <span className="text-xs mt-1">Créatif</span>
        </NavLink>

        <NavLink
          to="/butterflies"
          className={({ isActive }) => `flex flex-col items-center p-2 ${
            isActive ? 'text-bloom-purple' : 'text-gray-500'
          }`}
        >
          <Butterfly className="w-6 h-6" />
          <span className="text-xs mt-1">Papillons</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
