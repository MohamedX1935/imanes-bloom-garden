
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, BookOpen, Walk, FlowerIcon as Flower } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Jardin", path: "/garden", icon: <Leaf className="w-6 h-6" /> },
    { name: "Journal", path: "/journal", icon: <BookOpen className="w-6 h-6" /> },
    { name: "Activité", path: "/activity", icon: <Walk className="w-6 h-6" /> },
    { name: "Tableau", path: "/dashboard", icon: <Flower className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-bloom-green-light px-2 py-3 flex justify-around items-center">
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-full transition-all",
            location.pathname === item.path 
              ? "text-bloom-purple bg-bloom-purple-light/50" 
              : "text-gray-500"
          )}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
