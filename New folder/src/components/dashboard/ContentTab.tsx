import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, Trash2, GripVertical, Image as ImageIcon, Video, Edit2, Package, Wrench, Star, HelpCircle, MessageSquare } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product, Service } from '@/types/catalog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ContentTab() {
  const {
    shopData,
    updateShopData,
    updateSectionVisibility,
    addProduct,
    updateProduct,
    deleteProduct,
    addService,
    updateService,
    deleteService,
  } = useShop();
  const { categories, gallery, products, services, testimonials, faqs, sectionVisibility } = shopData;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'product' | 'service'; id: string } | null>(null);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      images: [],
      status: 'ready',
      isVisible: true,
      order: products.length + 1,
    };
    setEditingProduct(newProduct);
  };

  const handleSaveProduct = (product: Product) => {
    const exists = products.find(p => p.id === product.id);
    if (exists) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `s-${Date.now()}`,
      name: '',
      description: '',
      priceType: 'fixed',
      currency: 'USD',
      status: 'ready',
      isVisible: true,
      order: services.length + 1,
    };
    setEditingService(newService);
  };

  const handleSaveService = (service: Service) => {
    const exists = services.find(s => s.id === service.id);
    if (exists) {
      updateService(service.id, service);
    } else {
      addService(service);
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    deleteService(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Visibility Controls */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card overflow-hidden"
      >
        <h2 className="text-lg font-display font-semibold mb-4">Section Visibility</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(sectionVisibility).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
            >
              <span className="text-sm capitalize truncate min-w-0">{key.replace(/([A-Z])/g, ' $1')}</span>
              <button
                onClick={() => updateSectionVisibility(key as keyof typeof sectionVisibility, !value)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Categories ({categories.length}/6)</h2>
          </div>
          {categories.length < 6 && (
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 group"
            >
              <div className="p-2 rounded-lg bg-background">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold">{category.name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Gallery */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Gallery ({gallery.length}/9)</h2>
          </div>
          {gallery.length < 9 && (
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Media
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {gallery.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group bg-background border border-border">
              <img
                src={item.url}
                alt={item.title || ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                <button className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all hover:scale-110">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-full bg-destructive/80 hover:bg-destructive text-white backdrop-blur-md transition-all hover:scale-110">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {item.type === 'video' && (
                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/50 backdrop-blur-sm">
                  <Video className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
          {gallery.length < 9 && (
            <button className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary group">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Add Media</span>
            </button>
          )}
        </div>
      </motion.section>

      {/* Featured Film */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Featured Film</h2>
        </div>

        <div className="space-y-3">
          <div>
            <Label>YouTube Embed URL</Label>
            <Input
              placeholder="https://www.youtube.com/embed/..."
              value={shopData.featuredFilm?.url || ''}
              onChange={(e) => updateShopData({
                featuredFilm: {
                  id: 'ff-1',
                  type: 'video',
                  url: e.target.value,
                  title: shopData.featuredFilm?.title || 'Featured Video'
                }
              })}
            />
          </div>
          {shopData.featuredFilm?.url && (
            <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
              <iframe
                src={shopData.featuredFilm.url}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </motion.section>

      {/* Products */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Products ({products.length})</h2>
          </div>
          <Button onClick={handleAddProduct} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        <div className="space-y-3">
          {products.sort((a, b) => (a.order || 0) - (b.order || 0)).map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 group"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-background border border-border flex-shrink-0">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{product.name || 'Untitled Product'}</h3>
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold',
                    product.status === 'ready' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  )}>
                    {product.status === 'ready' ? 'Stock' : 'Order'}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/80 mt-0.5">${product.price}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const updated = products.map(p =>
                      p.id === product.id ? { ...p, isVisible: !p.isVisible } : p
                    );
                    updateShopData({ products: updated });
                    toast.success(product.isVisible ? 'Product hidden' : 'Product visible');
                  }}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    product.isVisible ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {product.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Services */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Services ({services.length}/9)</h2>
          </div>
          {services.length < 9 && (
            <Button onClick={handleAddService} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {service.image ? (
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{service.name || 'Untitled Service'}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.priceType === 'contact' ? 'Contact for Price' :
                    service.priceType === 'starting' ? `From $${service.price}` :
                      `$${service.price}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const updated = services.map(s =>
                      s.id === service.id ? { ...s, isVisible: !s.isVisible } : s
                    );
                    updateShopData({ services: updated });
                  }}
                  className={cn(
                    'p-2 rounded-lg',
                    service.isVisible ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {service.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'service', id: service.id })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Testimonials ({testimonials.length})</h2>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info('Adding testimonial')}>
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-background border-2 border-border flex-shrink-0">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary/40">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3 h-3',
                          i < testimonial.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">"{testimonial.text}"</p>
                <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-tight font-medium">{testimonial.date}</p>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dashboard-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">FAQ ({faqs.length})</h2>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 rounded-xl bg-secondary/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Product Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct?.name ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value: 'ready' | 'made-to-order') =>
                      setEditingProduct({ ...editingProduct, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">In Stock</SelectItem>
                      <SelectItem value="made-to-order">Made to Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                <Button onClick={() => handleSaveProduct(editingProduct)}>Save Product</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService?.name ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  placeholder="Service name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price Type</Label>
                  <Select
                    value={editingService.priceType}
                    onValueChange={(value: 'fixed' | 'starting' | 'hourly' | 'contact') =>
                      setEditingService({ ...editingService, priceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="starting">Starting From</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="contact">Contact for Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingService.priceType !== 'contact' && (
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={editingService.price || ''}
                      onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editingService.image || ''}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingService(null)}>Cancel</Button>
                <Button onClick={() => handleSaveService(editingService)}>Save Service</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        title={`Delete ${deleteConfirm?.type === 'product' ? 'Product' : 'Service'}?`}
        description="This action cannot be undone. This will permanently delete this item."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteConfirm) {
            if (deleteConfirm.type === 'product') {
              handleDeleteProduct(deleteConfirm.id);
            } else {
              handleDeleteService(deleteConfirm.id);
            }
          }
        }}
      />
    </div>
  );
}
