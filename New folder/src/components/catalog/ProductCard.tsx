import { MessageCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  whatsapp: string;
  className?: string;
}

export function ProductCard({ product, whatsapp, className }: ProductCardProps) {
  const handleOrder = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ordering: ${product.name} ($${product.price})`
    );
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('product-card group', className)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.status === 'made-to-order' && (
          <span className="absolute top-3 left-3 badge-warning">
            Made to Order
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          onClick={handleOrder}
          className="absolute bottom-3 right-3 p-3 rounded-full bg-whatsapp text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-whatsapp"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ${product.price}
          </span>
          <button
            onClick={handleOrder}
            className="flex items-center gap-1.5 text-sm font-medium text-whatsapp hover:text-whatsapp-hover transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}
