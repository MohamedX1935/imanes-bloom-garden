
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UserSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface UserProfile {
  name: string;
  height: number; // in cm
  weight: number; // in kg
  strideLength: number; // in meters
}

// Default profile for Imane
const defaultProfile: UserProfile = {
  name: "Imane",
  height: 165,
  weight: 60,
  strideLength: 0.7
};

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem('userProfile');
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultProfile;
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

const UserSettings: React.FC<UserSettingsProps> = ({ open, onOpenChange }) => {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());

  useEffect(() => {
    if (open) {
      setProfile(getUserProfile());
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const calculateStrideLength = () => {
    // Average stride length is approximately 42% of height
    const calculatedStrideLength = (profile.height * 0.42) / 100;
    setProfile(prev => ({
      ...prev,
      strideLength: parseFloat(calculatedStrideLength.toFixed(2))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    toast.success("Profil mis à jour !");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-2xl text-bloom-purple">
            Profil Personnel
          </DialogTitle>
          <DialogDescription>
            Ces informations permettent de personnaliser ton expérience et calculer avec précision les distances et calories.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Prénom
              </Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="col-span-3 bloom-input"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right">
                Taille (cm)
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleChange}
                className="col-span-3 bloom-input"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Poids (kg)
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleChange}
                className="col-span-3 bloom-input"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="strideLength" className="text-right">
                Longueur de foulée (m)
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="strideLength"
                  name="strideLength"
                  type="number"
                  step="0.01"
                  value={profile.strideLength}
                  onChange={handleChange}
                  className="bloom-input flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={calculateStrideLength}
                  className="whitespace-nowrap"
                >
                  Calculer
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="bloom-button"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
