import { motion } from 'framer-motion';
import { Category } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface CategoryScrollProps {
  categories: Category[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function CategoryScroll({ categories, selectedId, onSelect, className }: CategoryScrollProps) {
  return (
    <div className={cn('overflow-x-auto scrollbar-hide py-2', className)}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-3 px-4"
      >
        <button
          onClick={() => onSelect?.('')}
          className={cn(
            'category-pill',
            !selectedId && 'category-pill-active'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect?.(category.id)}
            className={cn(
              'category-pill',
              selectedId === category.id && 'category-pill-active'
            )}
          >
            {category.name}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
