
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

// Icons disponibles pour les habitudes (bibliothèque étendue)
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
  { name: "CalendarDays", icon: icons.CalendarDays },
  // Icônes supplémentaires
  { name: "Flower", icon: icons.Flower },
  { name: "Music", icon: icons.Music },
  { name: "Bike", icon: icons.Bike },
  { name: "Dumbbell", icon: icons.Dumbbell },
  { name: "Coffee", icon: icons.Coffee },
  { name: "Brain", icon: icons.Brain },
  { name: "Flame", icon: icons.Flame },
  { name: "ShowerHead", icon: icons.ShowerHead },
  { name: "Smile", icon: icons.Smile },
  { name: "Sun", icon: icons.Sun },
  { name: "Moon", icon: icons.Moon },
  { name: "Water", icon: icons.Droplet },
  { name: "Book", icon: icons.BookText },
  { name: "Pen", icon: icons.Pen },
  { name: "Pizza", icon: icons.Pizza },
  { name: "Apple", icon: icons.Apple },
  { name: "Salad", icon: icons.Salad },
  { name: "Gamepad", icon: icons.Gamepad2 },
  { name: "Yoga", icon: icons.FlameIcon },
  { name: "Sleep", icon: icons.BedIcon }
];

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddHabit 
}) => {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Leaf');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les icônes selon le terme de recherche
  const filteredIcons = searchTerm 
    ? availableIcons.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableIcons;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), selectedIcon);
      setHabitName('');
      setSelectedIcon('Leaf');
      setSearchTerm('');
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
            Donne un nom à ton habitude et choisis une icône pour la représenter dans ton jardin.
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
              <div className="flex justify-between items-center mb-2">
                <Label>Icône</Label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une icône..."
                  className="w-[200px] h-8 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-1">
                {filteredIcons.map(({ name, icon: Icon }) => (
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
              
              {filteredIcons.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucune icône correspondante trouvée
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bloom-button"
              disabled={!habitName.trim()}
            >
              Planter dans mon jardin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
