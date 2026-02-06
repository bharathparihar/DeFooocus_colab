import { MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Service } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  whatsapp: string;
  className?: string;
}

export function ServiceCard({ service, whatsapp, className }: ServiceCardProps) {
  const handleInquire = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to inquire about: ${service.name}`
    );
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getPriceDisplay = () => {
    if (service.priceType === 'contact') return 'Contact for Price';
    if (service.priceType === 'starting') return `From $${service.price}`;
    if (service.priceType === 'hourly') return `$${service.price}/hr`;
    return `$${service.price}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300', className)}
    >
      {service.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-semibold text-lg text-foreground">
            {service.name}
          </h3>
          {service.status === 'made-to-order' && (
            <span className="badge-warning flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Custom
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {service.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {getPriceDisplay()}
          </span>
          <button
            onClick={handleInquire}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-whatsapp text-white font-medium hover:bg-whatsapp-hover transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Inquire
          </button>
        </div>
      </div>
    </motion.div>
  );
}
