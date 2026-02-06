import { MessageCircle, Phone, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingBarProps {
  whatsapp: string;
  phone: string;
  mapUrl?: string;
  onShare?: () => void;
  className?: string;
}

export function FloatingBar({ whatsapp, phone, mapUrl, onShare, className }: FloatingBarProps) {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleMap = () => {
    if (mapUrl) {
      window.open(mapUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      className={cn('floating-bar flex items-center gap-1', className)}
    >
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-whatsapp text-white font-medium hover:bg-whatsapp-hover transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>
      
      <button
        onClick={handleCall}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline">Call</span>
      </button>
      
      {mapUrl && (
        <button
          onClick={handleMap}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
        >
          <MapPin className="w-5 h-5" />
          <span className="hidden sm:inline">Map</span>
        </button>
      )}
      
      {onShare && (
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}
