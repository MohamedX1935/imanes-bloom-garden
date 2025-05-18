
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { getUserProfile } from '@/components/settings/UserSettings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Butterfly from '@/components/effects/Butterfly';

interface CollectedButterfly {
  id: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  collected: string;
}

const ButterflyCollection = () => {
  const [butterflies, setButterflies] = useState<CollectedButterfly[]>([]);
  const [userName, setUserName] = useState("Imane");
  const [selectedButterflies, setSelectedButterflies] = useState<string[]>([]);
  
  useEffect(() => {
    // Charger les papillons collectionnés
    const savedButterflies = localStorage.getItem('collectedButterflies');
    if (savedButterflies) {
      setButterflies(JSON.parse(savedButterflies));
    }
    
    // Charger les papillons favoris
    const savedFavorites = localStorage.getItem('favoriteButterflies');
    if (savedFavorites) {
      setSelectedButterflies(JSON.parse(savedFavorites));
    }
    
    // Charger le profil utilisateur
    const profile = getUserProfile();
    setUserName(profile.name);
  }, []);
  
  const toggleFavorite = (id: string) => {
    setSelectedButterflies(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      // Sauvegarder les favoris
      localStorage.setItem('favoriteButterflies', JSON.stringify(newSelection));
      return newSelection;
    });
  };
  
  // Grouper par couleur pour l'affichage
  const groupedByColor = butterflies.reduce((acc, butterfly) => {
    const color = butterfly.color;
    if (!acc[color]) acc[color] = [];
    acc[color].push(butterfly);
    return acc;
  }, {} as Record<string, CollectedButterfly[]>);
  
  return (
    <div className="pb-24">
      <PageHeader 
        title={`Collection de Papillons de ${userName}`}
        subtitle="Admire et personnalise tes papillons collectionnés"
      />
      
      <div className="px-4 space-y-4">
        <Tabs defaultValue="collection">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collection" className="mt-4">
            {Object.keys(groupedByColor).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tu n'as pas encore de papillons dans ta collection.</p>
                <p className="text-gray-500 mt-2">Continue à accomplir des habitudes pour en collecter !</p>
              </div>
            ) : (
              Object.entries(groupedByColor).map(([color, colorButterflies]) => (
                <Card key={color} className="bloom-card mb-4">
                  <h3 className="text-lg font-medium capitalize mb-2">{color}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {colorButterflies.map(butterfly => {
                      const isFavorite = selectedButterflies.includes(butterfly.id);
                      return (
                        <div 
                          key={butterfly.id} 
                          className={`relative h-24 flex items-center justify-center rounded-lg border-2 ${isFavorite ? 'border-bloom-purple' : 'border-transparent'} transition-all`}
                          onClick={() => toggleFavorite(butterfly.id)}
                        >
                          <Butterfly 
                            color={butterfly.color}
                            size={butterfly.size}
                            position={{ x: 0, y: 0 }}
                            className="!relative !left-0 !top-0"
                          />
                          {isFavorite && (
                            <div className="absolute bottom-1 right-1 bg-bloom-purple text-white rounded-full w-5 h-5 flex items-center justify-center">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            <Card className="bloom-card">
              <h3 className="text-lg font-medium mb-3">Tes Papillons Favoris</h3>
              
              {selectedButterflies.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Tu n'as pas encore de papillons favoris. Clique sur tes papillons pour les ajouter !
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {butterflies
                    .filter(b => selectedButterflies.includes(b.id))
                    .map(butterfly => (
                      <div key={butterfly.id} className="h-24 flex items-center justify-center">
                        <Butterfly 
                          color={butterfly.color}
                          size={butterfly.size}
                          position={{ x: 0, y: 0 }}
                          className="!relative !left-0 !top-0"
                        />
                      </div>
                    ))
                  }
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ButterflyCollection;
