import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn('bg-card rounded-2xl p-6 border border-border/50', className)}
    >
      <div className="flex items-center gap-3 mb-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < testimonial.rating
                    ? 'text-warning fill-warning'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
    </motion.div>
  );
}
