
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface JournalEntryData {
  id: string;
  date: Date;
  content: string;
  mood?: string;
}

interface JournalEntryProps {
  entry?: JournalEntryData;
  onSave: (content: string) => void;
  className?: string;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ entry, onSave, className }) => {
  const [content, setContent] = useState(entry?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (content.trim()) {
      setIsSaving(true);
      // Simulate a slight delay for UX
      setTimeout(() => {
        onSave(content);
        setIsSaving(false);
      }, 500);
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <Card className={cn("bloom-card", className)}>
      <div className="flex flex-col h-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-handwriting text-bloom-purple-dark capitalize">
            {formattedDate}
          </h3>
          <p className="text-sm text-gray-500">Comment te sens-tu aujourd'hui?</p>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note tes pensées, idées ou sentiments ici..."
          className="bloom-input resize-none flex-grow min-h-[150px]"
        />
        
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleSave}
            className="bloom-button"
            disabled={!content.trim() || isSaving}
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JournalEntry;
