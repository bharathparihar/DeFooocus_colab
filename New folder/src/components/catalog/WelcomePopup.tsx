import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { WelcomePopup as WelcomePopupType } from '@/types/catalog';
import { Button } from '@/components/ui/button';

interface WelcomePopupProps {
  popup: WelcomePopupType;
}

export function WelcomePopup({ popup }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (popup.isEnabled) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenWelcome');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [popup.isEnabled]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenWelcome', 'true');
  };

  if (!popup.isEnabled) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-card rounded-3xl shadow-xl overflow-hidden">
              {popup.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={popup.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 rounded-full bg-card/80 hover:bg-card transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-display font-bold mb-2">{popup.title}</h3>
                <p className="text-muted-foreground mb-6">{popup.message}</p>
                <Button
                  onClick={handleClose}
                  className="btn-accent w-full"
                >
                  {popup.buttonText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
