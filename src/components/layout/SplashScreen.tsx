
import React, { useEffect, useState } from 'react';

type FlowerProps = {
  delay: number;
  left: string;
  size: string;
  color: string;
}

const Flower: React.FC<FlowerProps> = ({ delay, left, size, color }) => {
  return (
    <div 
      className={`absolute bottom-0 ${left}`} 
      style={{ 
        animationDelay: `${delay}s`,
      }}
    >
      <div 
        className="animate-flower-rise" 
        style={{ 
          width: size,
          height: size,
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,15 C55,5 65,5 70,15 C80,5 90,10 90,20 C100,25 95,40 85,40 C95,50 90,65 80,65 C85,80 70,85 60,75 C50,85 35,80 35,65 C25,70 15,60 20,50 C10,45 10,30 20,25 C15,15 30,5 40,15 C45,5 50,10 50,15 Z" fill={color} stroke="#68A87C" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
};

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Attendre que l'animation de fade-out soit terminée
    }, 3500); // Durée totale du splash screen

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Configuration des fleurs
  const flowers = [
    { delay: 0.1, left: 'left-1/4', size: '60px', color: '#E5F1E9' },
    { delay: 0.3, left: 'left-1/2', size: '80px', color: '#9FD0AE' },
    { delay: 0.5, left: 'left-3/4', size: '50px', color: '#E5F1E9' },
    { delay: 0.7, left: 'left-[10%]', size: '70px', color: '#9FD0AE' },
    { delay: 0.9, left: 'left-[85%]', size: '60px', color: '#E5F1E9' },
    { delay: 1.1, left: 'left-[30%]', size: '90px', color: '#9FD0AE' },
    { delay: 1.3, left: 'left-[70%]', size: '65px', color: '#E5F1E9' },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-b from-[#1a3a24] to-[#2c5738] flex items-center justify-center overflow-hidden
        ${!isVisible ? 'animate-fade-out' : ''}`}
    >
      {flowers.map((flower, index) => (
        <Flower 
          key={index} 
          delay={flower.delay} 
          left={flower.left} 
          size={flower.size}
          color={flower.color}
        />
      ))}
      
      {/* Logo au centre */}
      <div className="relative z-10 animate-logo-appear" style={{ animationDelay: '1s' }}>
        <img 
          src="/lovable-uploads/87708aa7-f344-4f11-b4d6-46ebfe33f620.png" 
          alt="Imane's Bloom Logo" 
          className="w-48 h-48"
        />
        <h1 className="text-center text-white font-greatvibes text-4xl mt-4">
          Imane's Bloom
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
