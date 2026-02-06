import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { ShopData, Product, Service, Category, MediaItem, Testimonial, FAQ, Inquiry, Appointment, SocialLink } from '@/types/catalog';
import { mockShopData } from '@/data/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ShopContextType {
  shopData: ShopData;
  isPreviewMode: boolean;
  setIsPreviewMode: (value: boolean) => void;

  // General updates
  updateShopData: (updates: Partial<ShopData>) => void;
  updateShopInfo: (updates: Partial<ShopData['info']>) => void;
  updateContact: (updates: Partial<ShopData['contact']>) => void;
  updateSectionVisibility: (section: keyof ShopData['sectionVisibility'], value: boolean) => void;

  // Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (products: Product[]) => void;

  // Services
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  reorderServices: (services: Service[]) => void;

  // Categories
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;

  // Gallery
  addGalleryItem: (item: MediaItem) => void;
  updateGalleryItem: (id: string, updates: Partial<MediaItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // Testimonials
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // FAQs
  addFAQ: (faq: FAQ) => void;
  updateFAQ: (id: string, updates: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  reorderFAQs: (faqs: FAQ[]) => void;

  // Business Hours
  updateBusinessHours: (hours: ShopData['businessHours']) => void;

  // Social Links
  addSocialLink: (link: SocialLink) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;

  // Inquiries
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => void;
  deleteInquiry: (id: string) => void;

  // Appointments
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Analytics
  trackView: () => void;
  trackClick: (type: 'whatsapp' | 'phone' | 'map' | 'product' | 'service') => void;

  // Data management
  resetToDefaults: () => void;
  importData: (data: ShopData) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shopData, setShopData] = useLocalStorage<ShopData>('b_catalog_shop_data', mockShopData);
  const [isPreviewMode, setIsPreviewMode] = useLocalStorage<boolean>('b_catalog_preview_mode', false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save notification with debouncing
  const notifyAutoSave = () => {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      toast.success('Changes saved', { duration: 2000 });
    }, 500);
  };

  // General updates
  const updateShopData = (updates: Partial<ShopData>) => {
    setShopData(prev => ({ ...prev, ...updates }));
    notifyAutoSave();
  };

  const updateShopInfo = (updates: Partial<ShopData['info']>) => {
    setShopData(prev => ({
      ...prev,
      info: { ...prev.info, ...updates },
    }));
    notifyAutoSave();
  };

  const updateContact = (updates: Partial<ShopData['contact']>) => {
    setShopData(prev => ({
      ...prev,
      contact: { ...prev.contact, ...updates },
    }));
    notifyAutoSave();
  };

  const updateSectionVisibility = (section: keyof ShopData['sectionVisibility'], value: boolean) => {
    setShopData(prev => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [section]: value },
    }));
    notifyAutoSave();
  };

  // Products
  const addProduct = (product: Product) => {
    setShopData(prev => ({
      ...prev,
      products: [...prev.products, product],
    }));
    toast.success('Product added');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setShopData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
    notifyAutoSave();
  };

  const deleteProduct = (id: string) => {
    setShopData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    }));
    toast.success('Product deleted');
  };

  const reorderProducts = (products: Product[]) => {
    setShopData(prev => ({ ...prev, products }));
    notifyAutoSave();
  };

  // Services
  const addService = (service: Service) => {
    setShopData(prev => ({
      ...prev,
      services: [...prev.services, service],
    }));
    toast.success('Service added');
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setShopData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
    notifyAutoSave();
  };

  const deleteService = (id: string) => {
    setShopData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id),
    }));
    toast.success('Service deleted');
  };

  const reorderServices = (services: Service[]) => {
    setShopData(prev => ({ ...prev, services }));
    notifyAutoSave();
  };

  // Categories
  const addCategory = (category: Category) => {
    setShopData(prev => ({
      ...prev,
      categories: [...prev.categories, category],
    }));
    toast.success('Category added');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setShopData(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
    notifyAutoSave();
  };

  const deleteCategory = (id: string) => {
    setShopData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }));
    toast.success('Category deleted');
  };

  const reorderCategories = (categories: Category[]) => {
    setShopData(prev => ({ ...prev, categories }));
    notifyAutoSave();
  };

  // Gallery
  const addGalleryItem = (item: MediaItem) => {
    setShopData(prev => ({
      ...prev,
      gallery: [...prev.gallery, item],
    }));
    toast.success('Gallery item added');
  };

  const updateGalleryItem = (id: string, updates: Partial<MediaItem>) => {
    setShopData(prev => ({
      ...prev,
      gallery: prev.gallery.map(g => g.id === id ? { ...g, ...updates } : g),
    }));
    notifyAutoSave();
  };

  const deleteGalleryItem = (id: string) => {
    setShopData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(g => g.id !== id),
    }));
    toast.success('Gallery item deleted');
  };

  // Testimonials
  const addTestimonial = (testimonial: Testimonial) => {
    setShopData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, testimonial],
    }));
    toast.success('Testimonial added');
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setShopData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
    notifyAutoSave();
  };

  const deleteTestimonial = (id: string) => {
    setShopData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id),
    }));
    toast.success('Testimonial deleted');
  };

  // FAQs
  const addFAQ = (faq: FAQ) => {
    setShopData(prev => ({
      ...prev,
      faqs: [...prev.faqs, faq],
    }));
    toast.success('FAQ added');
  };

  const updateFAQ = (id: string, updates: Partial<FAQ>) => {
    setShopData(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
    notifyAutoSave();
  };

  const deleteFAQ = (id: string) => {
    setShopData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id),
    }));
    toast.success('FAQ deleted');
  };

  const reorderFAQs = (faqs: FAQ[]) => {
    setShopData(prev => ({ ...prev, faqs }));
    notifyAutoSave();
  };

  // Business Hours
  const updateBusinessHours = (hours: ShopData['businessHours']) => {
    setShopData(prev => ({ ...prev, businessHours: hours }));
    notifyAutoSave();
  };

  // Social Links
  const addSocialLink = (link: SocialLink) => {
    setShopData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, link],
    }));
    toast.success('Social link added');
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setShopData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(l => l.id === id ? { ...l, ...updates } : l),
    }));
    notifyAutoSave();
  };

  const deleteSocialLink = (id: string) => {
    setShopData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(l => l.id !== id),
    }));
    toast.success('Social link deleted');
  };

  // Inquiries
  const addInquiry = (inquiry: Inquiry) => {
    setShopData(prev => ({
      ...prev,
      inquiries: [...prev.inquiries, inquiry],
    }));
    toast.success('Inquiry received');
  };

  const updateInquiry = (id: string, updates: Partial<Inquiry>) => {
    setShopData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(i => i.id === id ? { ...i, ...updates } : i),
    }));
    notifyAutoSave();
  };

  const deleteInquiry = (id: string) => {
    setShopData(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(i => i.id !== id),
    }));
    toast.success('Inquiry deleted');
  };

  // Appointments
  const addAppointment = (appointment: Appointment) => {
    setShopData(prev => ({
      ...prev,
      appointments: [...prev.appointments, appointment],
    }));
    toast.success('Appointment booked');
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setShopData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
    notifyAutoSave();
  };

  const deleteAppointment = (id: string) => {
    setShopData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id),
    }));
    toast.success('Appointment deleted');
  };

  // Analytics (stored in shopData for persistence)
  const trackView = () => {
    setShopData(prev => {
      // Initialize analytics if not present
      const analytics = (prev as any).analytics || { views: 0, clicks: {} };
      return {
        ...prev,
        analytics: {
          ...analytics,
          views: (analytics.views || 0) + 1,
        },
      } as ShopData;
    });
  };

  const trackClick = (type: 'whatsapp' | 'phone' | 'map' | 'product' | 'service') => {
    setShopData(prev => {
      const analytics = (prev as any).analytics || { views: 0, clicks: {} };
      return {
        ...prev,
        analytics: {
          ...analytics,
          clicks: {
            ...analytics.clicks,
            [type]: ((analytics.clicks?.[type] || 0) + 1),
          },
        },
      } as ShopData;
    });
  };

  // Data management
  const resetToDefaults = () => {
    setShopData(mockShopData);
    toast.success('Reset to default data');
  };

  const importData = (data: ShopData) => {
    setShopData(data);
    toast.success('Data imported successfully');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shopData,
        isPreviewMode,
        setIsPreviewMode,
        updateShopData,
        updateShopInfo,
        updateContact,
        updateSectionVisibility,
        addProduct,
        updateProduct,
        deleteProduct,
        reorderProducts,
        addService,
        updateService,
        deleteService,
        reorderServices,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        reorderFAQs,
        updateBusinessHours,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        addInquiry,
        updateInquiry,
        deleteInquiry,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        trackView,
        trackClick,
        resetToDefaults,
        importData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
