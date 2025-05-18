
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import CreativeWorkshop from '@/components/creative/CreativeWorkshop';
import { getUserProfile } from '@/components/settings/UserSettings';

const Creative = () => {
  const [drawings, setDrawings] = useState<string[]>([]);
  const [userName, setUserName] = useState("Imane");
  
  // Charger les dessins et le nom d'utilisateur
  React.useEffect(() => {
    const savedDrawings = localStorage.getItem('creativeDrawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
    
    const profile = getUserProfile();
    setUserName(profile.name);
  }, []);
  
  return (
    <div className="pb-24">
      <PageHeader 
        title={`Espace Créatif de ${userName}`}
        subtitle="Libère ton imagination"
      />
      
      <div className="px-4">
        <Tabs defaultValue="create">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-0">
            <CreativeWorkshop 
              onSave={(imageData) => {
                setDrawings(prev => [imageData, ...prev]);
              }}
            />
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-0">
            {drawings.length === 0 ? (
              <Card className="bloom-card p-4 text-center">
                <p className="text-gray-500">Tu n'as pas encore de créations.</p>
                <p className="text-gray-500 mt-2">Crée ton premier dessin dans l'onglet "Créer" !</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {drawings.map((drawing, index) => (
                  <Card key={index} className="bloom-card p-2 overflow-hidden">
                    <img 
                      src={drawing} 
                      alt={`Création ${index + 1}`} 
                      className="w-full h-auto rounded"
                    />
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Creative;
