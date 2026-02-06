import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { MediaItem } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
  items: MediaItem[];
  className?: string;
}

export function GalleryGrid({ items, className }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  return (
    <>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-3', className)}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedItem(item)}
            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
          >
            {item.type === 'video' ? (
              <>
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-foreground ml-0.5" />
                  </div>
                </div>
              </>
            ) : (
              <img
                src={item.url}
                alt={item.title || ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/90 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-xl"
                />
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title || ''}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
