
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { notificationService } from '@/services/NotificationService';
import { toast } from 'sonner';

interface HabitReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: {
    id: string;
    name: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    notificationId?: number;
  };
  onSaveReminder: (habitId: string, reminderEnabled: boolean, reminderTime: string, notificationId?: number) => void;
}

const HabitReminderDialog: React.FC<HabitReminderDialogProps> = ({ 
  open, 
  onOpenChange, 
  habit,
  onSaveReminder 
}) => {
  const [reminderEnabled, setReminderEnabled] = useState(habit.reminderEnabled || false);
  const [reminderTime, setReminderTime] = useState(habit.reminderTime || '09:00');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSave = async () => {
    setIsProcessing(true);
    
    try {
      let notificationId = habit.notificationId;
      
      // Vérifier d'abord les permissions
      const permStatus = await notificationService.checkPermissions();
      
      if (permStatus.display !== 'granted') {
        toast.error("Notifications non autorisées. Veuillez activer les notifications dans les paramètres.");
        onOpenChange(false);
        return;
      }
      
      if (reminderEnabled) {
        // Extraire l'heure et les minutes
        const [hour, minute] = reminderTime.split(':').map(Number);
        
        // Programmer la notification
        notificationId = await notificationService.scheduleHabitReminder(
          habit.id, 
          habit.name, 
          { hour, minute }
        );
        
        toast.success(`Rappel programmé pour ${habit.name} à ${reminderTime}`);
      } else if (notificationId) {
        // Annuler la notification existante
        await notificationService.cancelHabitReminder(notificationId);
        toast.success(`Rappel désactivé pour ${habit.name}`);
      }
      
      onSaveReminder(habit.id, reminderEnabled, reminderTime, notificationId);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la configuration du rappel:', error);
      toast.error("Une erreur s'est produite lors de la configuration du rappel");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurer un rappel</DialogTitle>
          <DialogDescription>
            Programmez un rappel quotidien pour votre habitude "{habit.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-toggle" className="flex-1">Activer le rappel quotidien</Label>
            <Switch 
              id="reminder-toggle"
              checked={reminderEnabled} 
              onCheckedChange={setReminderEnabled}
            />
          </div>
          
          {reminderEnabled && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-input" className="text-right col-span-1">
                Heure
              </Label>
              <Input
                id="time-input"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="col-span-3"
                disabled={!reminderEnabled}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline" disabled={isProcessing}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isProcessing}>
            {isProcessing ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitReminderDialog;
