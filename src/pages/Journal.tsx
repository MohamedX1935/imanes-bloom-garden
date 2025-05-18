
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import JournalEntry, { JournalEntryData } from '@/components/journal/JournalEntry';
import Drawing from '@/components/journal/Drawing';
import { toast } from 'sonner';

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [drawings, setDrawings] = useState<string[]>([]);
  
  // Charger les entrées et dessins sauvegardés au chargement du composant
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Convertir les dates de string à Date
        const entriesWithDateObjects = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(entriesWithDateObjects);
      } catch (error) {
        console.error("Erreur lors du chargement des entrées du journal:", error);
      }
    }
    
    const savedDrawings = localStorage.getItem('journalDrawings');
    if (savedDrawings) {
      try {
        setDrawings(JSON.parse(savedDrawings));
      } catch (error) {
        console.error("Erreur lors du chargement des dessins:", error);
      }
    }
  }, []);
  
  const handleSaveEntry = (content: string) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date(),
      content
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    toast.success("Journal sauvegardé !");
  };
  
  const handleSaveDrawing = (imageData: string) => {
    const updatedDrawings = [imageData, ...drawings];
    setDrawings(updatedDrawings);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('journalDrawings', JSON.stringify(updatedDrawings));
    toast.success("Dessin sauvegardé !");
  };
  
  return (
    <div className="pb-24">
      <PageHeader 
        title="Mon Carnet Créatif" 
        subtitle="Capture tes pensées et inspirations"
      />
      
      <div className="px-4">
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="write">Écrire</TabsTrigger>
            <TabsTrigger value="draw">Dessiner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="mt-0">
            <JournalEntry onSave={handleSaveEntry} />
            
            {entries.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-3">Entrées précédentes</h3>
                <div className="space-y-4">
                  {entries.map(entry => (
                    <div key={entry.id} className="bloom-card">
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      <p className="whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="draw" className="mt-0">
            <Drawing onSave={handleSaveDrawing} />
            
            {drawings.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-3">Dessins précédents</h3>
                <div className="grid grid-cols-2 gap-3">
                  {drawings.map((drawing, index) => (
                    <div key={index} className="bloom-card p-2">
                      <img 
                        src={drawing} 
                        alt={`Dessin ${index + 1}`} 
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Journal;
