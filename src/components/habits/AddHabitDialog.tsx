
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import * as icons from 'lucide-react';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (name: string, iconName: string) => void;
}

// Icons available for habits
const availableIcons = [
  { name: "Leaf", icon: icons.Leaf },
  { name: "Heart", icon: icons.Heart },
  { name: "Calendar", icon: icons.Calendar },
  { name: "BookOpen", icon: icons.BookOpen },
  { name: "Activity", icon: icons.Activity },
  { name: "Clock", icon: icons.Clock },
  { name: "Settings", icon: icons.Settings },
  { name: "Edit", icon: icons.Edit },
  { name: "List", icon: icons.List },
  { name: "CalendarDays", icon: icons.CalendarDays }
];

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddHabit 
}) => {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Leaf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), selectedIcon);
      setHabitName('');
      setSelectedIcon('Leaf');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-2xl text-bloom-purple">
            Planter une nouvelle habitude
          </DialogTitle>
          <DialogDescription>
            Donne un nom à ton habitude et choisis une icône pour la représenter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="Ex: Méditation quotidienne"
                className="col-span-3 bloom-input"
              />
            </div>
            
            <div>
              <Label className="block mb-2">Icône</Label>
              <div className="grid grid-cols-5 gap-2">
                {availableIcons.map(({ name, icon: Icon }) => (
                  <Button
                    key={name}
                    type="button"
                    variant={selectedIcon === name ? "default" : "outline"}
                    className={`p-2 h-12 w-12 flex items-center justify-center ${
                      selectedIcon === name ? 'bg-bloom-purple text-white' : 'hover:bg-bloom-purple-light/20'
                    }`}
                    onClick={() => setSelectedIcon(name)}
                  >
                    <Icon className="h-5 w-5" />
                    {selectedIcon === name && (
                      <div className="absolute bottom-1 right-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bloom-button"
            >
              Planter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
