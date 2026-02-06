import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessHours as BusinessHoursType } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface BusinessHoursProps {
  hours: BusinessHoursType[];
  className?: string;
}

export function BusinessHours({ hours, className }: BusinessHoursProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  const getCurrentStatus = () => {
    const todayHours = hours.find(h => h.day === today);
    if (!todayHours || !todayHours.isOpen) return { isOpen: false, text: 'Closed Today' };
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.openTime.replace(':', ''));
    const closeTime = parseInt(todayHours.closeTime.replace(':', ''));
    
    if (currentTime >= openTime && currentTime < closeTime) {
      return { isOpen: true, text: `Open until ${todayHours.closeTime}` };
    } else if (currentTime < openTime) {
      return { isOpen: false, text: `Opens at ${todayHours.openTime}` };
    }
    return { isOpen: false, text: 'Closed' };
  };

  const status = getCurrentStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('bg-card rounded-2xl p-6 border border-border/50', className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-display font-semibold text-lg">Business Hours</h3>
      </div>
      
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-secondary">
        {status.isOpen ? (
          <CheckCircle className="w-5 h-5 text-success" />
        ) : (
          <XCircle className="w-5 h-5 text-destructive" />
        )}
        <span className={cn(
          'font-medium',
          status.isOpen ? 'text-success' : 'text-destructive'
        )}>
          {status.text}
        </span>
      </div>
      
      <div className="space-y-2">
        {hours.map((day) => (
          <div
            key={day.day}
            className={cn(
              'flex justify-between text-sm py-1.5',
              day.day === today && 'font-medium text-primary'
            )}
          >
            <span>{day.day}</span>
            <span className={day.isOpen ? '' : 'text-muted-foreground'}>
              {day.isOpen ? `${day.openTime} - ${day.closeTime}` : 'Closed'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
