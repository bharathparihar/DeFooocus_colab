import { motion } from 'framer-motion';

interface AnnouncementBarProps {
  text: string;
  isEnabled: boolean;
}

export function AnnouncementBar({ text, isEnabled }: AnnouncementBarProps) {
  if (!isEnabled) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex">
        <motion.div
          className="flex whitespace-nowrap marquee"
          animate={{ x: [0, '-50%'] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'linear',
          }}
        >
          <span className="mx-8">{text}</span>
          <span className="mx-8">{text}</span>
        </motion.div>
      </div>
    </div>
  );
}
