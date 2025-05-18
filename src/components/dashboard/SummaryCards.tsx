
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, BookOpen, Activity, Star } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  progress,
  className
}) => {
  return (
    <Card className={`p-4 ${className || ''}`}>
      <div className="flex items-center gap-3">
        <div className="bg-bloom-purple-light/30 p-2 rounded-full">
          {icon}
        </div>
        <div>
          <h4 className="text-sm text-gray-500">{title}</h4>
          <p className="text-xl font-semibold">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      
      {progress !== undefined && (
        <Progress value={progress} className="h-1 mt-3 bg-gray-100" />
      )}
    </Card>
  );
};

interface SummaryCardsProps {
  habitsCompleted: number;
  totalHabits: number;
  journalEntries: number;
  totalSteps: number;
  activityMinutes: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  habitsCompleted,
  totalHabits,
  journalEntries,
  totalSteps,
  activityMinutes
}) => {
  const habitProgress = totalHabits > 0 ? (habitsCompleted / totalHabits) * 100 : 0;
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={<Leaf className="h-4 w-4 text-bloom-purple" />}
        title="Habitudes"
        value={`${habitsCompleted}/${totalHabits}`}
        progress={habitProgress}
      />
      
      <StatCard
        icon={<BookOpen className="h-4 w-4 text-bloom-purple" />}
        title="Journal"
        value={journalEntries}
        subtitle="entrées"
      />
      
      <StatCard
        icon={<Activity className="h-4 w-4 text-bloom-purple" />}
        title="Pas"
        value={totalSteps.toLocaleString()}
      />
      
      <StatCard
        icon={<Star className="h-4 w-4 text-bloom-purple" />}
        title="Activité"
        value={`${activityMinutes} min`}
      />
    </div>
  );
};

export default SummaryCards;
