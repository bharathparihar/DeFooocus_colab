import React, { useState, useEffect, useRef, useCallback, createContext, useContext, ReactNode } from "react";
import {
  Upload, Loader2, X, Image as ImageIcon, Video, Plus, Trash2, Printer, Download,
  GripVertical, RotateCcw, Instagram, Facebook, Youtube, Twitter, Linkedin,
  MessageCircle, Send, Camera, MapPin, Link as LinkIcon, ExternalLink, Globe,
  Search, AlertTriangle, Code, Phone, Mail, Clock, CheckCircle, XCircle,
  Calendar, List, Star, ShoppingBag, HelpCircle, Briefcase, Music, Gift,
  Plane, Heart, Images, Play, Quote, ChevronLeft, ChevronRight, Copy, Check,
  Contact, Share2, Eye, EyeOff, Save, Settings, LayoutDashboard, FileText, Zap,
  Store, Lock, User, Edit, Menu, Home,
  Cloud
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- UTILITY FUNCTIONS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isVideo = (url: string) => {
  if (!url) return false;
  const path = url.split('?')[0];
  return path.match(/\.(mp4|webm|ogg|mov)$/i);
};

// --- TYPES ---
import {
  Product, Service, BusinessHours, Category, FAQ, ShopStats, SocialEmbed, SectionVisibility,
  Testimonial, SocialLinks, CustomLink, Inquiry, Appointment, Template, ShopConfig
} from "@/types/legacy";






























// --- DEFAULT SHOP CONFIG ---
const defaultShopConfig: ShopConfig = {
  id: "call2growth-profile",
  shopName: "call2growth",
  tagline: "We Create World Advancing Software With Vision and Passion",
  ownerName: "call2growth Team",
  description: "Transforming ideas into high-impact digital solutions. Specializing in top-tier software engineering, cloud architecture, and modern application development for forward-thinking enterprises.",
  email: "hello@call2growth.co",
  phone: "+1 (555) TECH-PRO",
  whatsappNumber: "15551234567",
  address: "Silicon Valley, CA | Global Remote",
  bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
  template: "modern",
  businessHours: [
    { day: "Monday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
    { day: "Tuesday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
    { day: "Wednesday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
    { day: "Thursday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
    { day: "Friday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
    { day: "Saturday", open: "10:00 AM", close: "02:00 PM", isClosed: true },
    { day: "Sunday", open: "09:00 AM", close: "05:00 PM", isClosed: true },
  ],
  jobTitle: "Technology Partner",
  occupation: "Software Development Firm",
  dateOfBirth: "2020-01-01",
  alternatePhone: "",
  alternateEmail: "support@call2growth.co",
  privacyPolicy: "We value your data privacy and follow industry-standard security protocols.",
  termsConditions: "Our engagement terms follow standard software-as-a-service and consulting agreements.",
  customLinks: [
    { id: "1", label: "View Portfolio", url: "/portfolio", icon: "Briefcase" },
    { id: "2", label: "Tech Stack", url: "/tech", icon: "Code" },
    { id: "3", label: "Schedule a Demo", url: "#appointment", icon: "Zap" },
  ],
  socialEmbeds: [
    { id: "1", type: "youtube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Engineering Excellence at call2growth" },
  ],
  socialLinks: {
    instagram: "https://instagram.com/call2growth",
    facebook: "https://facebook.com/call2growth",
    youtube: "https://youtube.com/call2growth",
  },
  services: [
    { id: "1", title: "Custom Software", description: "Tailored enterprise solutions designed for scalability and performance.", icon: "Code", price: "Starting at $5k" },
    { id: "2", title: "Mobile Applications", description: "iOS and Android apps with seamless UX and high-performance backends.", icon: "Plane", price: "Starting at $3k" },
    { id: "3", title: "Cloud Architecture", description: "Expert cloud migration and infrastructure optimization services.", icon: "Plane", price: "Consultation based" },
    { id: "4", title: "AI Integrations", description: "Empower your business with cutting-edge artificial intelligence.", icon: "Zap", price: "Custom" },
  ],
  products: [
    { id: "1", name: "SaaS Starter Kit", description: "Full-stack Next.js boilerplate with auth and payments.", price: 299, imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", status: 'ready-stock', stock: 1000 },
    { id: "2", name: "UI Component Library", description: "Premium React components for rapid development.", price: 99, imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop", status: 'ready-stock', stock: 1000 },
    { id: "3", name: "Architecture Review", description: "Deep dive into your system's architecture with actionable feedback.", price: 499, imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop", status: 'made-to-order', stock: 10 },
    { id: "4", name: "DevOps Automation", description: "Full CI/CD pipeline setup for your repository.", price: 799, imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop", status: 'made-to-order', stock: 5 },
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  ],
  testimonials: [
    { id: "1", name: "Cyberdyne Systems", comment: "call2growth didn't just write code; they engineered our future. Their cloud architecture scale is unmatched.", rating: 5, imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop" },
    { id: "2", name: "Initech Innovations", comment: "The AI integration streamlined our workflow beyond expectations. A truly premium engineering partner.", rating: 5, imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" },
    { id: "3", name: "Rekall Tech", comment: "Speed, precision, and vision. Their mobile application redefined our user engagement metrics.", rating: 5, imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
  ],
  categories: [
    { id: "1", name: "Software", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop" },
    { id: "2", name: "Consulting", imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&auto=format&fit=crop" },
    { id: "3", name: "Products", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop" },
  ],
  faq: [
    { id: "1", question: "What is your typical project timeline?", answer: "Most custom software projects range from 2 to 6 months depending on complexity." },
    { id: "2", question: "Do you offer post-launch support?", answer: "Yes, we offer ongoing maintenance and support packages tailored to your needs." },
    { id: "3", question: "Which technologies do you specialize in?", answer: "We are experts in React, Node.js, Python, AWS, and modern DevOps practices." },
  ],
  stats: { clients: "50+", photos: "100+", rating: "5.0", views: 0, clicks: 0, ctaClicks: 0 },
  sectionVisibility: {
    announcement: true, banner: true, stats: true, actionButtons: true, categories: true,
    gallery: true, featuredVideo: true, products: true, services: true, socialEmbeds: true,
    testimonials: true, faq: true, businessHours: true, socialLinks: true, about: true,
    visitUs: false, shareProfile: true, inquiry: true, appointment: true,
  },
  inquiries: [],
  appointments: [],
  createdAt: new Date().toISOString(),
};

// --- LOCAL STORAGE KEYS ---
const STORAGE_KEYS = {
  SHOP_CONFIG: 'b_catalog_shop_config',
  INQUIRIES: 'b_catalog_inquiries',
  APPOINTMENTS: 'b_catalog_appointments',
  IS_LOGGED_IN: 'b_catalog_is_logged_in',
};

// --- LOCAL STORAGE HOOKS ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      toast.error(`Auto-save failed: Storage is full. Please remove some images.`);
    }
  };

  return [storedValue, setValue];
};

// --- SHOP CONTEXT ---
interface ShopContextType {
  shopConfig: ShopConfig;
  updateShopConfig: (updates: Partial<ShopConfig>) => void;
  saveShop: () => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (value: boolean) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'shop_id' | 'created_at' | 'status'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'shop_id' | 'created_at' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: string) => void;
  updateAppointmentStatus: (id: string, status: string) => void;
  deleteInquiry: (id: string) => void;
  deleteAppointment: (id: string) => void;
  incrementStats: (type: 'views' | 'clicks' | 'ctaClicks') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [shopConfig, setShopConfig] = useLocalStorage<ShopConfig>(STORAGE_KEYS.SHOP_CONFIG, defaultShopConfig);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const updateShopConfig = useCallback((updates: Partial<ShopConfig>) => {
    setShopConfig(prev => ({ ...prev, ...updates }));
  }, [setShopConfig]);

  const saveShop = useCallback(() => {
    try {
      // Force a save by re-setting the current config
      setShopConfig(prev => ({ ...prev }));

      // Verify it was saved
      const saved = window.localStorage.getItem(STORAGE_KEYS.SHOP_CONFIG);
      if (saved) {
        toast.success("Shop saved successfully!");
      } else {
        toast.error("Failed to save - please try again");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Save failed - storage may be full");
    }
  }, [setShopConfig]);

  const addInquiry = useCallback((inquiry: Omit<Inquiry, 'id' | 'shop_id' | 'created_at' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now().toString(),
      shop_id: shopConfig.id || 'default',
      created_at: new Date().toISOString(),
      status: 'new',
    };
    setShopConfig(prev => ({
      ...prev,
      inquiries: [...(prev.inquiries || []), newInquiry],
    }));
    toast.success("Inquiry submitted successfully!");
  }, [setShopConfig, shopConfig.id]);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'shop_id' | 'created_at' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      shop_id: shopConfig.id || 'default',
      created_at: new Date().toISOString(),
      status: 'pending',
    };
    setShopConfig(prev => ({
      ...prev,
      appointments: [...(prev.appointments || []), newAppointment],
    }));
    toast.success("Appointment booked successfully!");
  }, [setShopConfig, shopConfig.id]);

  const updateInquiryStatus = useCallback((id: string, status: string) => {
    setShopConfig(prev => ({
      ...prev,
      inquiries: (prev.inquiries || []).map(i => i.id === id ? { ...i, status } : i),
    }));
  }, [setShopConfig]);

  const updateAppointmentStatus = useCallback((id: string, status: string) => {
    setShopConfig(prev => ({
      ...prev,
      appointments: (prev.appointments || []).map(a => a.id === id ? { ...a, status } : a),
    }));
  }, [setShopConfig]);

  const deleteInquiry = useCallback((id: string) => {
    setShopConfig(prev => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter(i => i.id !== id),
    }));
    toast.success("Inquiry deleted");
  }, [setShopConfig]);

  const deleteAppointment = useCallback((id: string) => {
    setShopConfig(prev => ({
      ...prev,
      appointments: (prev.appointments || []).filter(a => a.id !== id),
    }));
    toast.success("Appointment deleted");
  }, [setShopConfig]);

  const incrementStats = useCallback((type: 'views' | 'clicks' | 'ctaClicks') => {
    setShopConfig(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [type]: ((prev.stats[type] as number) || 0) + 1,
      },
    }));
  }, [setShopConfig]);

  return (
    <ShopContext.Provider value={{
      shopConfig,
      updateShopConfig,
      saveShop,
      isPreviewMode,
      setIsPreviewMode,
      addInquiry,
      addAppointment,
      updateInquiryStatus,
      updateAppointmentStatus,
      deleteInquiry,
      deleteAppointment,
      incrementStats,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};

// --- HELPER FUNCTIONS ---
const getDayName = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

const parseTime = (timeStr: string): number => {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const isCurrentlyOpen = (hours: BusinessHours[]): { isOpen: boolean; closingTime?: string; openingTime?: string } => {
  const today = getDayName();
  const todayHours = hours.find(h => h.day === today);
  if (!todayHours || todayHours.isClosed) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = days.indexOf(today);
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayHours = hours.find(h => h.day === days[nextDayIndex]);
      if (nextDayHours && !nextDayHours.isClosed) {
        return { isOpen: false, openingTime: `${days[nextDayIndex]} ${nextDayHours.open}` };
      }
    }
    return { isOpen: false };
  }
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTime(todayHours.open);
  const closeMinutes = parseTime(todayHours.close);
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return { isOpen: true, closingTime: todayHours.close };
  } else if (currentMinutes < openMinutes) {
    return { isOpen: false, openingTime: `Today ${todayHours.open}` };
  } else {
    return { isOpen: false };
  }
};

// --- IMAGE UPLOAD (LOCAL BASE64) ---
interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: "square" | "banner" | "video";
  acceptVideo?: boolean;
}

const ImageUpload = ({ label, value, onChange, aspectRatio = "square", acceptVideo = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      toast.error('File size must be less than 800KB for cloud synchronization');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
      setUploading(false);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => onChange("");

  const acceptTypes = acceptVideo
    ? "image/jpeg,image/png,image/webp,video/mp4,video/webm"
    : "image/jpeg,image/png,image/webp";

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "banner": return "aspect-[3/1]";
      case "video": return "aspect-video w-full";
      default: return "aspect-square w-24";
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className={`relative border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/50 transition-all duration-200 hover:border-primary/50 ${getAspectRatioClass()}`}>
        {value ? (
          <>
            {isVideo(value) ? (
              <video src={value} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            ) : (
              <img src={value} alt={label} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
            )}
            <button onClick={handleRemove} className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-6 h-6" /><span className="text-xs">Upload</span></>}
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" />
    </div>
  );
};

// --- SELLER DASHBOARD COMPONENTS ---

// Products Manager
const ProductsManager = ({ products, onChange, maxItems = 8 }: { products: Product[]; onChange: (products: Product[]) => void; maxItems?: number }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [status, setStatus] = useState<Product['status']>("ready-stock");

  const handleAdd = () => {
    if (!name.trim() || !price) { toast.error("Please fill in product name and price"); return; }
    if (products.length >= maxItems) { toast.error(`Maximum ${maxItems} products allowed`); return; }
    const newProduct: Product = { id: Date.now().toString(), name: name.trim(), price: parseFloat(price), imageUrl: "", stock: parseInt(stock) || 10, status };
    onChange([...products, newProduct]);
    setName(""); setPrice(""); setStock("10"); setStatus("ready-stock");
    toast.success("Product added!");
  };

  const handleDelete = (id: string) => { onChange(products.filter(p => p.id !== id)); toast.success("Product removed"); };
  const handleUpdateImage = (id: string, url: string) => { onChange(products.map(p => p.id === id ? { ...p, imageUrl: url } : p)); };

  const generateCatalog = async () => {
    if (products.length === 0) { toast.error("No products to generate catalog"); return; }
    const toastId = toast.loading("Generating catalog...");
    try {
      const doc = new jsPDF();
      doc.setFontSize(24); doc.text("Product Catalog", 105, 20, { align: 'center' });
      doc.setFontSize(10); doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
      const tableData = products.map(p => [p.name, `₹${p.price}`, p.status === 'ready-stock' ? `${p.stock} in stock` : p.status === 'made-to-order' ? 'Made on Order' : 'Coming Soon']);
      autoTable(doc, { head: [['Product', 'Price', 'Status']], body: tableData, startY: 40, theme: 'striped', headStyles: { fillColor: [59, 130, 246] } });
      doc.save("product-catalog.pdf");
      toast.dismiss(toastId); toast.success("Catalog downloaded!");
    } catch (error) { toast.dismiss(toastId); toast.error("Failed to generate PDF"); }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div><Label>Product Name</Label><Input placeholder="e.g., Premium Album" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Price (₹)</Label><Input placeholder="e.g., 15000" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Stock</Label><Input type="number" placeholder="e.g., 10" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1.5" /></div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Product['status'])}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="ready-stock">Ready Stock</SelectItem><SelectItem value="made-to-order">Made on Order</SelectItem><SelectItem value="coming-soon">Coming Soon</SelectItem></SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} disabled={products.length >= maxItems} className="w-full gap-2"><Plus className="w-4 h-4" />Add Product ({products.length}/{maxItems})</Button>
      </div>
      {products.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="relative bg-muted rounded-lg p-2">
              <ImageUpload label="" value={product.imageUrl} onChange={(url) => handleUpdateImage(product.id, url)} acceptVideo={true} />
              <div className="mt-2">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-primary">₹{product.price}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${product.status === 'coming-soon' ? 'bg-amber-100 text-amber-800' : product.status === 'made-to-order' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {product.status === 'ready-stock' ? `${product.stock} in stock` : product.status === 'made-to-order' ? 'Made on Order' : 'Coming Soon'}
                  </span>
                </div>
              </div>
              <button onClick={() => handleDelete(product.id)} className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs">×</button>
            </div>
          ))}
        </div>
      )}
      {products.length > 0 && <Button onClick={generateCatalog} variant="outline" className="w-full gap-2 mt-4 border-dashed"><Download className="w-4 h-4" />Download Catalog PDF</Button>}
    </div>
  );
};

// Services Manager
const iconOptions = [
  { value: "camera", label: "📷 Camera" }, { value: "video", label: "🎥 Video" }, { value: "heart", label: "❤️ Heart" },
  { value: "star", label: "⭐ Star" }, { value: "gift", label: "🎁 Gift" }, { value: "music", label: "🎵 Music" },
  { value: "plane", label: "✈️ Travel" }, { value: "briefcase", label: "💼 Business" },
];

const ServicesManager = ({ services, onChange, maxItems = 9 }: { services: Service[]; onChange: (services: Service[]) => void; maxItems?: number }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [icon, setIcon] = useState("camera");

  const handleAdd = () => {
    if (!title.trim()) { toast.error("Please enter service title"); return; }
    if (services.length >= maxItems) { toast.error(`Maximum ${maxItems} services allowed`); return; }
    const newService: Service = { id: Date.now().toString(), title: title.trim(), description: description.trim(), icon, price };
    onChange([...services, newService]);
    setTitle(""); setDescription(""); setPrice(""); setIcon("camera");
    toast.success("Service added!");
  };

  const handleDelete = (id: string) => { onChange(services.filter(s => s.id !== id)); toast.success("Service removed"); };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div><Label>Service Title</Label><Input placeholder="e.g., Wedding Photography" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Description</Label><Input placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Price (₹)</Label><Input placeholder="e.g., 25000" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1.5" /></div>
        <div>
          <Label>Icon</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} disabled={services.length >= maxItems} className="w-full gap-2"><Plus className="w-4 h-4" />Add Service ({services.length}/{maxItems})</Button>
      </div>
      {services.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{service.title}</p>
                <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                {service.price && <p className="text-xs text-primary">₹{service.price}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="flex-shrink-0 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Categories Manager
const CategoriesManager = ({ categories, onChange, maxItems = 6 }: { categories: Category[]; onChange: (categories: Category[]) => void; maxItems?: number }) => {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) { toast.error("Please enter category name"); return; }
    if (categories.length >= maxItems) { toast.error(`Maximum ${maxItems} categories allowed`); return; }
    const newCategory: Category = { id: Date.now().toString(), name: name.trim(), imageUrl: "" };
    onChange([...categories, newCategory]);
    setName("");
    toast.success("Category added!");
  };

  const handleDelete = (id: string) => { onChange(categories.filter(c => c.id !== id)); toast.success("Category removed"); };
  const handleUpdateImage = (id: string, url: string) => { onChange(categories.map(c => c.id === id ? { ...c, imageUrl: url } : c)); };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div><Label>Category Name</Label><Input placeholder="e.g., Wedding" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
        <Button onClick={handleAdd} disabled={categories.length >= maxItems} className="w-full gap-2"><Plus className="w-4 h-4" />Add Category ({categories.length}/{maxItems})</Button>
      </div>
      {categories.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="relative">
              <ImageUpload label="" value={category.imageUrl} onChange={(url) => handleUpdateImage(category.id, url)} />
              <p className="text-xs text-center text-muted-foreground mt-1 truncate">{category.name}</p>
              <button onClick={() => handleDelete(category.id)} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Gallery Manager
const GalleryManager = ({ images, onChange, maxItems = 9 }: { images: string[]; onChange: (images: string[]) => void; maxItems?: number }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= maxItems) { toast.error(`Maximum ${maxItems} images allowed`); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be less than 5MB'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { onChange([...images, reader.result as string]); setUploading(false); toast.success("Image added to gallery!"); };
    reader.onerror = () => { toast.error('Failed to read file'); setUploading(false); };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => { onChange(images.filter((_, i) => i !== index)); toast.success("Image removed"); };

  return (
    <div className="space-y-4">
      <Button onClick={() => fileInputRef.current?.click()} disabled={uploading || images.length >= maxItems} className="w-full gap-2">
        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Plus className="w-4 h-4" />Add Image ({images.length}/{maxItems})</>}
      </Button>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={handleFileChange} className="hidden" />
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square">
              {isVideo(img) ? <video src={img} className="w-full h-full object-cover rounded-lg" autoPlay loop muted playsInline /> : <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />}
              <button onClick={() => handleRemove(idx)} className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Testimonials Manager
const TestimonialsManager = ({ testimonials, onChange, maxItems = 9 }: { testimonials: Testimonial[]; onChange: (testimonials: Testimonial[]) => void; maxItems?: number }) => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !text.trim()) { toast.error("Please fill in name and testimonial text"); return; }
    if (testimonials.length >= maxItems) { toast.error(`Maximum ${maxItems} testimonials allowed`); return; }
    const newTestimonial: Testimonial = { id: Date.now().toString(), name: name.trim(), comment: text.trim(), rating, imageUrl };
    onChange([...testimonials, newTestimonial]);
    setName(""); setText(""); setRating(5); setImageUrl("");
    toast.success("Testimonial added!");
  };

  const handleDelete = (id: string) => { onChange(testimonials.filter(t => t.id !== id)); toast.success("Testimonial removed"); };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div><Label>Customer Name</Label><Input placeholder="e.g., Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${star <= rating ? "bg-yellow-400 text-yellow-900 shadow-glow" : "bg-muted text-muted-foreground"}`}>★</button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-24 shrink-0">
            <ImageUpload label="Photo" value={imageUrl} onChange={setImageUrl} />
          </div>
        </div>
        <div><Label>Review Text</Label><Textarea placeholder="What did they say about your business?" value={text} onChange={(e) => setText(e.target.value)} className="mt-1.5" rows={3} /></div>
        <Button onClick={handleAdd} disabled={testimonials.length >= maxItems} className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-glow"><Plus className="w-4 h-4" />Add Testimonial ({testimonials.length}/{maxItems})</Button>
      </div>
      {testimonials.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex items-center gap-3 p-3 bg-muted/50 border border-white/5 rounded-2xl">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-background shrink-0 border border-white/10">
                {testimonial.imageUrl ? (
                  <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">{testimonial.name.charAt(0)}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">{testimonial.name} <span className="text-yellow-400 ml-1">{"★".repeat(testimonial.rating)}</span></p>
                <p className="text-[10px] text-muted-foreground truncate">{testimonial.comment}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)} className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// FAQ Manager
const FAQManager = ({ faq, onChange, maxItems = 10 }: { faq: FAQ[]; onChange: (faq: FAQ[]) => void; maxItems?: number }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = () => {
    if (!question.trim() || !answer.trim()) { toast.error("Please fill in question and answer"); return; }
    if (faq.length >= maxItems) { toast.error(`Maximum ${maxItems} FAQs allowed`); return; }
    const newFaq: FAQ = { id: Date.now().toString(), question: question.trim(), answer: answer.trim() };
    onChange([...faq, newFaq]);
    setQuestion(""); setAnswer("");
    toast.success("FAQ added!");
  };

  const handleDelete = (id: string) => { onChange(faq.filter(f => f.id !== id)); toast.success("FAQ removed"); };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div><Label>Question</Label><Input placeholder="e.g., How do I book?" value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Answer</Label><Textarea placeholder="Your answer..." value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-1.5" rows={3} /></div>
        <Button onClick={handleAdd} disabled={faq.length >= maxItems} className="w-full gap-2"><Plus className="w-4 h-4" />Add FAQ ({faq.length}/{maxItems})</Button>
      </div>
      {faq.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {faq.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.question}</p>
                <p className="text-xs text-muted-foreground truncate">{item.answer}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="flex-shrink-0 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Business Hours Manager
const BusinessHoursManager = ({ hours, onChange }: { hours: BusinessHours[]; onChange: (hours: BusinessHours[]) => void }) => {
  const updateHour = (index: number, updates: Partial<BusinessHours>) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], ...updates };
    onChange(newHours);
  };

  const resetToDefault = () => {
    onChange([
      { day: "Monday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
      { day: "Tuesday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
      { day: "Wednesday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
      { day: "Thursday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
      { day: "Friday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
      { day: "Saturday", open: "09:00 AM", close: "06:00 PM", isClosed: false },
      { day: "Sunday", open: "09:00 AM", close: "06:00 PM", isClosed: true },
    ]);
  };

  return (
    <div className="space-y-3">
      {hours.map((hour, index) => (
        <div key={hour.day} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="w-20 flex-shrink-0"><span className="text-sm font-medium">{hour.day}</span></div>
          <div className="flex-1 flex items-center gap-2">
            {hour.isClosed ? <span className="text-sm text-muted-foreground">Closed</span> : (
              <>
                <Input value={hour.open} onChange={(e) => updateHour(index, { open: e.target.value })} className="w-28 text-xs" placeholder="09:00 AM" />
                <span className="text-muted-foreground">-</span>
                <Input value={hour.close} onChange={(e) => updateHour(index, { close: e.target.value })} className="w-28 text-xs" placeholder="06:00 PM" />
              </>
            )}
          </div>
          <Switch checked={!hour.isClosed} onCheckedChange={(checked) => updateHour(index, { isClosed: !checked })} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={resetToDefault} className="w-full"><RotateCcw className="w-4 h-4 mr-2" />Reset to Default Hours</Button>
    </div>
  );
};

// Social Links Manager
const socialFields = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/page' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/channel' },
  { key: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { key: 'telegram', label: 'Telegram', icon: Send, placeholder: 'https://t.me/username' },
] as const;

const SocialLinksManager = ({ socialLinks, onChange }: { socialLinks: SocialLinks; onChange: (socialLinks: SocialLinks) => void }) => {
  const updateLink = (key: keyof SocialLinks, value: string) => { onChange({ ...socialLinks, [key]: value }); };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Add links to your social media profiles.</p>
      {socialFields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-muted-foreground" /></div>
            <Input placeholder={field.placeholder} value={(socialLinks[field.key as keyof SocialLinks] as string) || ""} onChange={(e) => updateLink(field.key as keyof SocialLinks, e.target.value)} className="flex-1" />
          </div>
        );
      })}
    </div>
  );
};

// Custom Links Manager
const CustomLinksManager = ({ links = [], onChange }: { links: CustomLink[]; onChange: (links: CustomLink[]) => void }) => {
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newLabel || !newUrl) return;
    let formattedUrl = newUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = `https://${formattedUrl}`;
    const newLink: CustomLink = { id: Date.now().toString(), label: newLabel, url: formattedUrl };
    onChange([...links, newLink]);
    setNewLabel(""); setNewUrl("");
    toast.success("Link added!");
  };

  const handleDelete = (id: string) => { onChange(links.filter(l => l.id !== id)); toast.success("Link removed"); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 p-4 border rounded-lg bg-muted/20">
        <Label>Add New Link</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input placeholder="Label (e.g. My Portfolio)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Input placeholder="URL (e.g. portfolio.com)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
        <Button onClick={handleAdd} disabled={!newLabel || !newUrl || links.length >= 6} size="sm" className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Link {links.length >= 6 && "(Max)"}</Button>
      </div>
      <div className="space-y-2">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><LinkIcon className="w-4 h-4 text-primary" /></div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{link.label}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">{link.url} <ExternalLink className="w-3 h-3" /></p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inquiries Manager
const InquiriesManager = () => {
  const { shopConfig, updateInquiryStatus, deleteInquiry } = useShop();
  const inquiries = shopConfig.inquiries || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'responded': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No inquiries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{inquiry.name}</span>
                <Badge className={`${getStatusColor(inquiry.status)} text-white text-xs`}>{inquiry.status}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{inquiry.phone}</span>
                {inquiry.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{inquiry.email}</span>}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteInquiry(inquiry.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <p className="text-sm bg-background/50 p-3 rounded-md">{inquiry.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(inquiry.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
            <div className="flex gap-1">
              {inquiry.status !== 'responded' && <Button variant="ghost" size="sm" onClick={() => updateInquiryStatus(inquiry.id, 'responded')} className="h-7 text-xs gap-1 text-green-600"><CheckCircle className="w-3 h-3" /> Responded</Button>}
              {inquiry.status !== 'closed' && <Button variant="ghost" size="sm" onClick={() => updateInquiryStatus(inquiry.id, 'closed')} className="h-7 text-xs gap-1"><XCircle className="w-3 h-3" /> Close</Button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Appointments Manager
const AppointmentsManager = () => {
  const { shopConfig, updateAppointmentStatus, deleteAppointment } = useShop();
  const appointments = shopConfig.appointments || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No appointments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{appointment.name}</span>
                <Badge className={`${getStatusColor(appointment.status)} text-white text-xs`}>{appointment.status}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appointment.phone}</span>
                {appointment.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{appointment.email}</span>}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteAppointment(appointment.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="bg-background/50 p-3 rounded-md space-y-1">
            {appointment.service && <p className="text-sm"><span className="font-medium">Service:</span> {appointment.service}</p>}
            <p className="text-sm"><span className="font-medium">Date:</span> {appointment.preferred_date}</p>
            <p className="text-sm"><span className="font-medium">Time:</span> {appointment.preferred_time}</p>
            {appointment.notes && <p className="text-sm"><span className="font-medium">Notes:</span> {appointment.notes}</p>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(appointment.created_at), "MMM d, yyyy")}</span>
            <div className="flex gap-1">
              {appointment.status === 'pending' && <Button variant="ghost" size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')} className="h-7 text-xs gap-1 text-green-600"><CheckCircle className="w-3 h-3" /> Confirm</Button>}
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && <Button variant="ghost" size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'completed')} className="h-7 text-xs gap-1 text-blue-600"><Check className="w-3 h-3" /> Complete</Button>}
              {appointment.status !== 'cancelled' && <Button variant="ghost" size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')} className="h-7 text-xs gap-1 text-red-600"><XCircle className="w-3 h-3" /> Cancel</Button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- BUYER VIEW COMPONENTS ---

// Open Status Badge
const OpenStatusBadge = ({ businessHours }: { businessHours: BusinessHours[] }) => {
  if (!businessHours || businessHours.length === 0) return null;
  const status = isCurrentlyOpen(businessHours);

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.isOpen ? 'bg-green-500/20 text-green-600 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
        <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        {status.isOpen ? 'Open Now' : 'Closed'}
      </span>
      {status.isOpen && status.closingTime && <span className="text-xs text-muted-foreground">Closes {status.closingTime}</span>}
      {!status.isOpen && status.openingTime && <span className="text-xs text-muted-foreground">Opens {status.openingTime}</span>}
    </div>
  );
};

// Shop Banner
const ShopBanner = ({ config }: { config: ShopConfig }) => {
  return (
    <section className="relative w-full bg-background overflow-hidden">
      <div className="relative w-full aspect-[21/9] md:aspect-[3/1]">
        {config.bannerUrl ? (
          isVideo(config.bannerUrl) ? (
            <video src={config.bannerUrl} className="w-full h-full object-cover opacity-60" autoPlay loop muted playsInline />
          ) : (
            <img src={config.bannerUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-background via-primary/20 to-accent/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative px-6 -mt-24 md:-mt-32 text-center pb-8">
        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 group-hover:bg-primary/30 transition-all duration-500" />
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-2xl border-4 border-background bg-card shadow-2xl mx-auto overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 ring-1 ring-primary/20">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground text-5xl font-extrabold tracking-tighter">
                {config.shopName?.charAt(0) || "C"}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4 px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
            {config.shopName}
          </h1>
          {config.tagline && (
            <p className="text-accent font-bold text-sm md:text-lg uppercase tracking-[0.2em] transform scale-95 opacity-90 drop-shadow-sm">
              {config.tagline}
            </p>
          )}
          {config.description && (
            <p className="text-muted-foreground/90 text-sm md:text-base leading-relaxed font-medium line-clamp-3">
              {config.description}
            </p>
          )}
          <div className="pt-2">
            <OpenStatusBadge businessHours={config.businessHours} />
          </div>
        </div>
      </div>
    </section>
  );
};

// Shop Stats Section
const ShopStatsSection = ({ stats }: { stats: ShopStats }) => {
  return (
    <section className="grid grid-cols-3 gap-3 px-6 py-8 border-y border-primary/10 bg-card/40 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-primary/5 transition-all duration-300">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-1"><Briefcase className="w-5 h-5" /></div>
        <span className="text-2xl font-black tracking-tighter">{stats.clients || "50+"}</span>
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Enterprises</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-primary/5 transition-all duration-300 border-x border-primary/10">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-1"><Code className="w-5 h-5" /></div>
        <span className="text-2xl font-black tracking-tighter">{stats.photos || "100+"}</span>
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Solutions</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-primary/5 transition-all duration-300">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-1"><Star className="w-5 h-5" /></div>
        <span className="text-2xl font-black tracking-tighter">{stats.rating || "5.0"}</span>
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Excellence</span>
      </div>
    </section>
  );
};

// Action Buttons
const ActionButtons = ({ config }: { config: ShopConfig }) => {
  const handleSaveContact = () => {
    const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.shopName}\nTEL:${config.phone}\nEMAIL:${config.email}\nURL:${window.location.href}\nADR:;;${config.address};;;;\nEND:VCARD`;
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.shopName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Contact saved!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: config.shopName, text: `Check out ${config.shopName}`, url: window.location.href }); } catch (error) { console.error("Share failed", error); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <section className="grid grid-cols-4 gap-4 px-6 py-6">
      <button onClick={handleSaveContact} className="flex flex-col items-center gap-2 group">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-glow">
          <Contact className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center leading-tight group-hover:text-foreground">Save</span>
      </button>
      <a href={`tel:${config.phone}`} className="flex flex-col items-center gap-2 group">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500 shadow-glow">
          <Phone className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
        </div>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center leading-tight group-hover:text-foreground">Call</span>
      </a>
      <a href={config.socialLinks?.maps || `https://maps.google.com/?q=${config.address}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-glow">
          <MapPin className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center leading-tight group-hover:text-foreground">Visit</span>
      </a>
      <button onClick={handleShare} className="flex flex-col items-center gap-2 group">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500 shadow-glow">
          <Share2 className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
        </div>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center leading-tight group-hover:text-foreground">Share</span>
      </button>
    </section>
  );
};

// Categories Section
const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-4">
      <h2 className="text-lg font-bold px-4 mb-3 flex items-center gap-2"><List className="w-5 h-5 text-primary" />Categories</h2>
      <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <div key={category.id} className="flex-shrink-0 w-20 text-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-all shadow-sm">
              {category.imageUrl ? <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">{category.name.charAt(0)}</div>}
            </div>
            <p className="mt-2 text-xs font-medium truncate">{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Products Grid
const ProductsGrid = ({ products, whatsappNumber }: { products: Product[]; whatsappNumber: string }) => {
  if (!products || products.length === 0) return null;

  const handleOrder = (product: Product) => {
    const message = encodeURIComponent(`Hi! I'm interested in: ${product.name}`);
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <section className="py-8 px-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2"><div className="w-2 h-6 bg-accent rounded-full" />Solutions</h2>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md">Catalog</span>
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3">
              <div className="tech-card h-full group">
                <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                  {product.imageUrl ? (
                    isVideo(product.imageUrl) ? <video src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay loop muted playsInline /> :
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80 transition-opacity" />
                  ) : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground/30" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 w-full">
                  <div className="mb-3">
                    <Badge className={`text-[9px] font-black uppercase tracking-widest h-5 px-2 ${product.status === 'coming-soon' ? 'bg-amber-500' : product.status === 'made-to-order' ? 'bg-primary' : 'bg-accent'} border-none shadow-glow text-white`}>
                      {product.status === 'ready-stock' ? 'Available' : product.status === 'made-to-order' ? 'Custom' : 'Soon'}
                    </Badge>
                  </div>
                  <h3 className="font-black text-lg tracking-tight mb-2 text-white leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-primary tracking-tighter text-xl">${product.price}</span>
                    <Button size="sm" className="h-8 px-5 text-[10px] font-black uppercase tracking-widest rounded-full bg-primary hover:bg-primary/90 shadow-glow" onClick={() => handleOrder(product)}>Acquire</Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

// Services List
const ServicesList = ({ services }: { services: Service[] }) => {
  if (!services || services.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "camera": return Code;
      case "video": return Video;
      case "heart": return Heart;
      case "plane": return Cloud;
      case "music": return Music;
      case "gift": return Gift;
      case "star": return Star;
      case "briefcase": return Briefcase;
      default: return Zap;
    }
  };

  return (
    <section className="py-10 px-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-1.5 h-8 bg-primary rounded-full" />
        <h2 className="text-2xl font-black tracking-tighter">Core Services</h2>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => {
          const Icon = getIcon(service.icon || 'zap') as any;
          return (
            <div key={service.id} className="tech-card group">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-glow">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-xl tracking-tight">{service.title}</h3>
                    {service.price && <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded-md">{service.price}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{service.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  if (!images || images.length === 0) return null;

  return (
    <section className="p-4 group/section">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Images className="w-5 h-5 text-primary" />Gallery <span className="text-xs text-muted-foreground font-normal">({images.length})</span></h2>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.slice(0, 9).map((image, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
              <div className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative bg-muted" onClick={() => setSelectedImage(image)}>
                {isVideo(image) ? <video src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" autoPlay loop muted playsInline /> : <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block"><CarouselPrevious className="-left-4 opacity-0 group-hover/section:opacity-100 transition-opacity" /><CarouselNext className="-right-4 opacity-0 group-hover/section:opacity-100 transition-opacity" /></div>
      </Carousel>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"><X className="w-5 h-5" /></button>
          {selectedImage && (isVideo(selectedImage) ? <video src={selectedImage} className="w-full h-full object-contain" controls autoPlay /> : <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />)}
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Featured Video Section
const FeaturedVideoSection = ({ videoUrl }: { videoUrl: string }) => {
  if (!videoUrl) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const isDirectVideo = isVideo(videoUrl);
  if (!videoId && !isDirectVideo && !videoUrl.includes('youtube.com')) return null;

  return (
    <section className="py-4 px-4">
      <h2 className="text-base font-bold mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-primary rounded-full"></span>Featured Film</h2>
      <div className="bg-card rounded-lg overflow-hidden shadow-soft border border-border">
        <div className="aspect-video relative bg-black w-full">
          {isDirectVideo ? <video src={videoUrl} controls className="absolute inset-0 w-full h-full" /> : <iframe src={videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl} title="Featured Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />}
        </div>
      </div>
    </section>
  );
};

// Testimonials Slider
const TestimonialsSlider = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, isAnimating]);

  if (!testimonials || testimonials.length === 0) return null;
  const testimonial = testimonials[currentIndex];

  return (
    <section className="p-4">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2"><div className="w-1 h-5 bg-accent rounded-full" />Testimonials</h2>
      <div className="relative overflow-hidden mb-4">
        <div className={`tech-card transition-all duration-500 min-h-[320px] ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          <div className="flex flex-col gap-6 w-full text-left">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full scale-125" />
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 bg-muted shrink-0 rotate-3 transition-transform hover:rotate-0">
                  {testimonial.imageUrl ? (
                    <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-black">{testimonial.name.charAt(0)}</div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1.5 px-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3.5 h-3.5", i < testimonial.rating ? "text-yellow-400 fill-yellow-400 shadow-glow" : "text-white/10")} />
                  ))}
                </div>
                <h3 className="font-black text-xl tracking-tight text-white">{testimonial.name}</h3>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">Verified Customer</p>
              </div>
            </div>
            <blockquote className="text-base md:text-lg font-bold leading-relaxed italic text-white/90 border-l-4 border-primary/20 pl-6 py-2">
              "{testimonial.comment}"
            </blockquote>
          </div>
        </div>
      </div>
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2">
          {testimonials.map((_, i) => (<button key={i} onClick={() => setCurrentIndex(i)} className={`w-8 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-primary' : 'bg-white/10'}`} />))}
        </div>
      )}
    </section>
  );
};

// FAQ Section
const FAQSection = ({ faq }: { faq: FAQ[] }) => {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" />FAQ</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faq.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">{item.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

// Business Hours Section
const BusinessHoursSection = ({ hours }: { hours: BusinessHours[] }) => {
  if (!hours || hours.length === 0) return null;
  const today = getDayName();

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Business Hours</h2>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {hours.map((hour) => (
          <div key={hour.day} className={`flex items-center justify-between px-4 py-3 border-b border-border/50 last:border-0 ${hour.day === today ? 'bg-primary/5' : ''}`}>
            <div className="flex items-center gap-2">
              {hour.day === today && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              <span className={`text-sm ${hour.day === today ? 'font-semibold' : ''}`}>{hour.day}</span>
            </div>
            <span className={`text-sm ${hour.isClosed ? 'text-red-500' : 'text-muted-foreground'}`}>
              {hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

// Social Links Section
const SocialLinksSection = ({ socialLinks, whatsappNumber, customLinks }: { socialLinks: SocialLinks; whatsappNumber?: string; customLinks?: CustomLink[] }) => {
  const socialConfig = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-500' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { key: 'telegram', label: 'Telegram', icon: Send, color: 'bg-sky-400' },
  ];

  const activeLinks = socialConfig.filter(s => socialLinks[s.key as keyof SocialLinks]);
  const hasWhatsapp = !!whatsappNumber && whatsappNumber.length > 4;

  if (activeLinks.length === 0 && !hasWhatsapp && (!customLinks || customLinks.length === 0)) return null;

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Connect With Us</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {hasWhatsapp && (
          <a href={`https://wa.me/${whatsappNumber?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </a>
        )}
        {activeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a key={link.key} href={socialLinks[link.key as keyof SocialLinks] as string} target="_blank" rel="noopener noreferrer" className={`w-14 h-14 rounded-2xl ${link.color} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6" />
            </a>
          );
        })}
      </div>
      {customLinks && customLinks.length > 0 && (
        <div className="mt-4 space-y-2">
          {customLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><LinkIcon className="w-5 h-5 text-primary" /></div>
              <span className="font-medium">{link.label}</span>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

// Share Profile Section
const ShareProfileSection = ({ config }: { config: ShopConfig }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shopUrl = `${window.location.origin}/shop/${config.slug || 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: config.shopName, url: shopUrl }); } catch { /* ignore */ }
    } else {
      handleCopy();
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    const toastId = toast.loading("Generating card...");
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.shopName}-card.png`;
      a.click();
      toast.dismiss(toastId);
      toast.success("Card downloaded!");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed");
    }
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2 justify-center">Share Shop</h2>
      <div className="flex flex-col gap-3 max-w-sm mx-auto items-center">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 mb-2">
          <QRCodeSVG value={shopUrl} size={160} level="H" includeMargin />
        </div>
        <div className="flex gap-3 w-full">
          <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2 rounded-xl h-12 border-dashed">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy Link"}
          </Button>
          <Button onClick={handleShare} className="flex-1 gap-2 rounded-xl h-12 shadow-soft"><Share2 className="w-4 h-4" /> Share</Button>
        </div>
        <Button onClick={handleDownloadCard} variant="secondary" className="w-full gap-2 rounded-xl h-12 shadow-soft"><Contact className="w-4 h-4" /> Download Visiting Card</Button>
      </div>

      {/* Hidden Card Template */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={cardRef} className="w-[600px] h-[350px] bg-white text-slate-900 border-4 border-slate-900 relative overflow-hidden flex font-sans">
          <div className="w-[20px] h-full bg-slate-900"></div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-800 uppercase">{config.shopName}</h1>
              {config.tagline && <p className="text-xl text-slate-500 font-medium">{config.tagline}</p>}
              <div className="mt-8 space-y-2 text-slate-600">
                {config.phone && <p className="flex items-center gap-2"><span className="font-bold">Tel:</span> {config.phone}</p>}
                {config.email && <p className="flex items-center gap-2"><span className="font-bold">Email:</span> {config.email}</p>}
              </div>
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest">Available on B-Catalog</p>
          </div>
          <div className="w-[200px] bg-slate-50 flex flex-col items-center justify-center p-4 border-l border-slate-100">
            <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
              <QRCodeSVG value={shopUrl} size={140} level="H" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700 text-center uppercase tracking-wide">Scan to<br />Visit</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Inquiry Form
const InquiryForm = ({ shopName }: { shopName: string }) => {
  const { addInquiry } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) { toast.error("Please fill in all required fields"); return; }
    setSubmitting(true);
    addInquiry({ name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() });
    setName(""); setPhone(""); setEmail(""); setMessage("");
    setSubmitting(false);
  };

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" />Send Inquiry</h2>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1.5" /></div>
        <div><Label>Phone *</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="mt-1.5" /></div>
        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email (optional)" className="mt-1.5" /></div>
        <div><Label>Message *</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." className="mt-1.5" rows={3} /></div>
        <Button type="submit" disabled={submitting} className="w-full gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Send Inquiry</Button>
      </form>
    </section>
  );
};

// Appointment Form
const AppointmentForm = ({ services }: { services: Service[] }) => {
  const { addAppointment } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !time) { toast.error("Please fill in all required fields"); return; }
    setSubmitting(true);
    addAppointment({ name: name.trim(), phone: phone.trim(), email: email.trim(), service, preferred_date: date, preferred_time: time, notes: notes.trim() });
    setName(""); setPhone(""); setEmail(""); setService(""); setDate(""); setTime(""); setNotes("");
    setSubmitting(false);
  };

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Book Appointment</h2>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1.5" /></div>
        <div><Label>Phone *</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="mt-1.5" /></div>
        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email (optional)" className="mt-1.5" /></div>
        {services.length > 0 && (
          <div>
            <Label>Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>{services.map((s) => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Preferred Date *</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Preferred Time *</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5" /></div>
        </div>
        <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." className="mt-1.5" rows={2} /></div>
        <Button type="submit" disabled={submitting} className="w-full gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}Book Appointment</Button>
      </form>
    </section>
  );
};

// Floating Menu
const FloatingMenu = ({ whatsappNumber, phone, shopName }: { whatsappNumber: string; phone: string; shopName: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${shopName}, I'm interested in your services!`)}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: shopName, url: window.location.href }); } catch { /* ignore */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"} mb-2`}>
        <Button size="icon" className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg border-2 border-white" onClick={handleShare}><Share2 className="w-5 h-5" /></Button>
        <Button size="icon" className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-900 text-white shadow-lg border-2 border-white" onClick={() => window.open(`tel:${phone}`, "_self")}><Phone className="w-5 h-5" /></Button>
        <Button size="icon" className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg border-2 border-white" onClick={handleWhatsApp}><MessageCircle className="w-6 h-6" /></Button>
      </div>
      <Button size="icon" className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ${isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-primary hover:bg-primary/90"}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Plus className="w-7 h-7 text-white" />}
      </Button>
    </div>
  );
};

// Welcome Popup
const WelcomePopup = ({ config }: { config: ShopConfig }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (config.socialLinks?.popup?.enabled) {
      const key = `welcome_popup_shown_${config.id}`;
      const lastShown = localStorage.getItem(key);
      const today = new Date().toDateString();
      if (lastShown !== today) {
        setOpen(true);
        localStorage.setItem(key, today);
      }
    }
  }, [config.socialLinks?.popup?.enabled, config.id]);

  if (!config.socialLinks?.popup?.enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader className="sr-only"><DialogTitle>Welcome</DialogTitle><DialogDescription>Welcome Message</DialogDescription></DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {config.socialLinks.popup.image && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <img src={config.socialLinks.popup.image} alt="Welcome" className="w-full h-full object-cover" />
            </div>
          )}
          {config.socialLinks.popup.text && <p className="text-center text-lg font-medium whitespace-pre-wrap">{config.socialLinks.popup.text}</p>}
          <Button onClick={() => setOpen(false)} className="w-full">Continue to Shop</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENTS ---

// Seller Dashboard
const SellerDashboard = () => {
  const { shopConfig, updateShopConfig, saveShop, isPreviewMode, setIsPreviewMode } = useShop();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    saveShop();
    setIsSaving(false);
  };

  const todayLeadsCount = (shopConfig.inquiries?.filter(i => {
    const today = new Date().toDateString();
    return new Date(i.created_at).toDateString() === today;
  }).length || 0) + (shopConfig.appointments?.filter(a => a.status === 'pending').length || 0);

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium">Preview Mode</span>
          <Button size="sm" variant="secondary" onClick={() => setIsPreviewMode(false)}><EyeOff className="w-4 h-4 mr-2" />Exit Preview</Button>
        </div>
        <BuyerCatalogView config={shopConfig} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight">Console</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{shopConfig.shopName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(true)} className="gap-2 border-white/10 hover:bg-white/5"><Eye className="w-4 h-4" /><span className="hidden md:inline">Preview</span></Button>
              <Link to={`/shop/${shopConfig.slug || 'demo'}`}><Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/5"><ExternalLink className="w-4 h-4" /><span className="hidden md:inline">Live</span></Button></Link>
              <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2 bg-primary hover:bg-primary/90 shadow-glow"><Save className="w-4 h-4" /><span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-start md:justify-center items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {[
              { id: 'profile', label: 'Identity', icon: User },
              { id: 'content', label: 'Ecosystem', icon: FileText },
              { id: 'leads', label: 'Testimonials', icon: MessageCircle, badge: todayLeadsCount },
              { id: 'advanced', label: 'Engine', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-accent-foreground shadow-glow">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Shop Information</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Shop Name</Label><Input value={shopConfig.shopName} onChange={(e) => updateShopConfig({ shopName: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Owner Name</Label><Input value={shopConfig.ownerName} onChange={(e) => updateShopConfig({ ownerName: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Tagline</Label><Input value={shopConfig.tagline} onChange={(e) => updateShopConfig({ tagline: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Slug (URL Alias)</Label><Input value={shopConfig.slug || ''} onChange={(e) => updateShopConfig({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="mt-1.5" placeholder="my-shop" /></div>
              </div>
              <div><Label>Description</Label><Textarea value={shopConfig.description} onChange={(e) => updateShopConfig({ description: e.target.value })} className="mt-1.5" rows={3} /></div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Branding</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload label="Logo" value={shopConfig.logoUrl || ''} onChange={(url) => updateShopConfig({ logoUrl: url })} />
                <ImageUpload label="Banner" value={shopConfig.bannerUrl || ''} onChange={(url) => updateShopConfig({ bannerUrl: url })} aspectRatio="banner" acceptVideo />
              </div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Contact Details</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Phone</Label><Input value={shopConfig.phone} onChange={(e) => updateShopConfig({ phone: e.target.value })} className="mt-1.5" /></div>
                <div><Label>WhatsApp Number</Label><Input value={shopConfig.whatsappNumber} onChange={(e) => updateShopConfig({ whatsappNumber: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Email</Label><Input type="email" value={shopConfig.email} onChange={(e) => updateShopConfig({ email: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Address</Label><Input value={shopConfig.address} onChange={(e) => updateShopConfig({ address: e.target.value })} className="mt-1.5" /></div>
              </div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Business Hours</CardTitle></CardHeader><CardContent>
              <BusinessHoursManager hours={shopConfig.businessHours} onChange={(hours) => updateShopConfig({ businessHours: hours })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Social Links</CardTitle></CardHeader><CardContent>
              <SocialLinksManager socialLinks={shopConfig.socialLinks} onChange={(socialLinks) => updateShopConfig({ socialLinks })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Custom Links</CardTitle></CardHeader><CardContent>
              <CustomLinksManager links={shopConfig.customLinks || []} onChange={(customLinks) => updateShopConfig({ customLinks })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Stats Display</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Clients</Label><Input value={shopConfig.stats.clients} onChange={(e) => updateShopConfig({ stats: { ...shopConfig.stats, clients: e.target.value } })} className="mt-1.5" /></div>
                <div><Label>Projects</Label><Input value={shopConfig.stats.photos} onChange={(e) => updateShopConfig({ stats: { ...shopConfig.stats, photos: e.target.value } })} className="mt-1.5" /></div>
                <div><Label>Rating</Label><Input value={shopConfig.stats.rating} onChange={(e) => updateShopConfig({ stats: { ...shopConfig.stats, rating: e.target.value } })} className="mt-1.5" /></div>
              </div>
            </CardContent></Card>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Categories</CardTitle></CardHeader><CardContent>
              <CategoriesManager categories={shopConfig.categories} onChange={(categories) => updateShopConfig({ categories })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Gallery</CardTitle></CardHeader><CardContent>
              <GalleryManager images={shopConfig.galleryImages} onChange={(galleryImages) => updateShopConfig({ galleryImages })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Featured Video</CardTitle></CardHeader><CardContent>
              <div><Label>YouTube URL or Video URL</Label><Input value={shopConfig.featuredVideo || ''} onChange={(e) => updateShopConfig({ featuredVideo: e.target.value })} className="mt-1.5" placeholder="https://www.youtube.com/watch?v=..." /></div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Products</CardTitle></CardHeader><CardContent>
              <ProductsManager products={shopConfig.products} onChange={(products) => updateShopConfig({ products })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Services</CardTitle></CardHeader><CardContent>
              <ServicesManager services={shopConfig.services} onChange={(services) => updateShopConfig({ services })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Testimonials</CardTitle></CardHeader><CardContent>
              <TestimonialsManager testimonials={shopConfig.testimonials} onChange={(testimonials) => updateShopConfig({ testimonials })} />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>FAQ</CardTitle></CardHeader><CardContent>
              <FAQManager faq={shopConfig.faq} onChange={(faq) => updateShopConfig({ faq })} />
            </CardContent></Card>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" />Inquiries</CardTitle></CardHeader><CardContent>
              <InquiriesManager />
            </CardContent></Card>

            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Appointments</CardTitle></CardHeader><CardContent>
              <AppointmentsManager />
            </CardContent></Card>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <Card><CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader><CardContent className="space-y-4">
              <div><Label>SEO Title</Label><Input value={shopConfig.socialLinks.seo?.title || ''} onChange={(e) => updateShopConfig({ socialLinks: { ...shopConfig.socialLinks, seo: { ...shopConfig.socialLinks.seo, title: e.target.value } } })} className="mt-1.5" placeholder="Page title for search engines" /></div>
              <div><Label>SEO Description</Label><Textarea value={shopConfig.socialLinks.seo?.description || ''} onChange={(e) => updateShopConfig({ socialLinks: { ...shopConfig.socialLinks, seo: { ...shopConfig.socialLinks.seo, description: e.target.value } } })} className="mt-1.5" rows={3} placeholder="Description for search engines" /></div>
              <div><Label>Keywords</Label><Input value={shopConfig.socialLinks.seo?.keywords || ''} onChange={(e) => updateShopConfig({ socialLinks: { ...shopConfig.socialLinks, seo: { ...shopConfig.socialLinks.seo, keywords: e.target.value } } })} className="mt-1.5" placeholder="keyword1, keyword2, keyword3" /></div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Welcome Popup</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Popup</Label>
                <Switch checked={shopConfig.socialLinks.popup?.enabled || false} onCheckedChange={(checked) => updateShopConfig({ socialLinks: { ...shopConfig.socialLinks, popup: { ...shopConfig.socialLinks.popup, enabled: checked } } })} />
              </div>
              {shopConfig.socialLinks.popup?.enabled && (
                <>
                  <div><Label>Popup Message</Label><Textarea value={shopConfig.socialLinks.popup?.text || ''} onChange={(e) => updateShopConfig({ socialLinks: { ...shopConfig.socialLinks, popup: { ...shopConfig.socialLinks.popup, text: e.target.value } } })} className="mt-1.5" rows={3} placeholder="Welcome message..." /></div>
                  <ImageUpload label="Popup Image" value={shopConfig.socialLinks.popup?.image || ''} onChange={(url) => updateShopConfig({ socialLinks: { ...shopConfig.socialLinks, popup: { ...shopConfig.socialLinks.popup, image: url } } })} />
                </>
              )}
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Custom Code</CardTitle></CardHeader><CardContent className="space-y-4">
              <div><Label>Custom CSS</Label><Textarea value={shopConfig.customCss || ''} onChange={(e) => updateShopConfig({ customCss: e.target.value })} className="mt-1.5 font-mono text-sm" rows={5} placeholder="/* Your custom CSS */" /></div>
              <div><Label>Custom JavaScript</Label><Textarea value={shopConfig.customJs || ''} onChange={(e) => updateShopConfig({ customJs: e.target.value })} className="mt-1.5 font-mono text-sm" rows={5} placeholder="// Your custom JavaScript" /></div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Legal</CardTitle></CardHeader><CardContent className="space-y-4">
              <div><Label>Privacy Policy</Label><Textarea value={shopConfig.privacyPolicy || ''} onChange={(e) => updateShopConfig({ privacyPolicy: e.target.value })} className="mt-1.5" rows={4} /></div>
              <div><Label>Terms & Conditions</Label><Textarea value={shopConfig.termsConditions || ''} onChange={(e) => updateShopConfig({ termsConditions: e.target.value })} className="mt-1.5" rows={4} /></div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Analytics</CardTitle></CardHeader><CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold">{shopConfig.stats.views || 0}</p><p className="text-xs text-muted-foreground">Views</p></div>
                <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold">{shopConfig.stats.clicks || 0}</p><p className="text-xs text-muted-foreground">Clicks</p></div>
                <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold">{shopConfig.stats.ctaClicks || 0}</p><p className="text-xs text-muted-foreground">CTA Clicks</p></div>
              </div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Storage Debug</CardTitle></CardHeader><CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">Current localStorage status:</p>
              <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                <p>Shop Name: <span className="text-primary">{shopConfig.shopName}</span></p>
                <p>Last Modified: <span className="text-primary">{new Date().toLocaleString()}</span></p>
                <p>Storage Key: <span className="text-primary">{STORAGE_KEYS.SHOP_CONFIG}</span></p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const data = window.localStorage.getItem(STORAGE_KEYS.SHOP_CONFIG);
                  console.log("Current localStorage data:", data ? JSON.parse(data) : "No data");
                  toast.success("Check browser console for full data");
                }}
              >
                <Code className="w-4 h-4 mr-2" /> View Full Data in Console
              </Button>
            </CardContent></Card>

            <Card className="border-destructive/20 mt-6"><CardHeader><CardTitle className="text-destructive font-bold">Danger Zone</CardTitle></CardHeader><CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">Resetting will permanently delete all your customizations and restore the default tech profile configuration. Use this if your storage is full.</p>
              <Button
                variant="destructive"
                className="w-full gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground border-destructive/20 h-11"
                onClick={() => {
                  if (confirm("Are you sure you want to reset all data to defaults? This will erase everything.")) {
                    localStorage.removeItem(STORAGE_KEYS.SHOP_CONFIG);
                    window.location.reload();
                  }
                }}
              >
                <Trash2 className="w-4 h-4" /> Reset All Data to Defaults
              </Button>
            </CardContent></Card>
          </div>
        )}
      </main>
    </div>
  );
};

// Buyer Catalog View (Reusable)
const BuyerCatalogView = ({ config }: { config: ShopConfig }) => {
  const visibility = config.sectionVisibility || defaultShopConfig.sectionVisibility!;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Custom CSS */}
      {config.customCss && <style>{config.customCss}</style>}

      {/* Announcement Bar */}
      {visibility.announcement && config.socialLinks?.announcement && (
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">{config.socialLinks.announcement}</div>
        </div>
      )}

      <WelcomePopup config={config} />

      {visibility.banner && <ShopBanner config={config} />}
      {visibility.stats && <ShopStatsSection stats={config.stats} />}
      {visibility.actionButtons && <ActionButtons config={config} />}
      {visibility.categories && <CategoriesSection categories={config.categories} />}
      {visibility.featuredVideo && <FeaturedVideoSection videoUrl={config.featuredVideo || ''} />}
      {visibility.gallery && <GallerySection images={config.galleryImages} />}
      {visibility.products && <ProductsGrid products={config.products} whatsappNumber={config.whatsappNumber} />}
      {visibility.services && <ServicesList services={config.services} />}
      {visibility.testimonials && <TestimonialsSlider testimonials={config.testimonials} />}
      {visibility.faq && <FAQSection faq={config.faq} />}
      {visibility.businessHours && <BusinessHoursSection hours={config.businessHours} />}
      {visibility.socialLinks && <SocialLinksSection socialLinks={config.socialLinks} whatsappNumber={config.whatsappNumber} customLinks={config.customLinks} />}
      {visibility.shareProfile && <ShareProfileSection config={config} />}
      {visibility.inquiry && <InquiryForm shopName={config.shopName} />}
      {visibility.appointment && <AppointmentForm services={config.services} />}

      <FloatingMenu whatsappNumber={config.whatsappNumber} phone={config.phone} shopName={config.shopName} />

      {/* Footer */}
      <footer className="mt-8 py-6 px-4 border-t border-border text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {config.shopName}. All rights reserved.</p>
        <p className="mt-1">Powered by B Catalog</p>
      </footer>
    </div>
  );
};

// Buyer Catalog Page
const BuyerCatalog = () => {
  const { shopConfig, incrementStats } = useShop();

  useEffect(() => {
    incrementStats('views');
  }, [incrementStats]);

  return <BuyerCatalogView config={shopConfig} />;
};

// Home/Index Page
const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Store className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">B Catalog</h1>
          <p className="text-muted-foreground">Create beautiful digital catalogs with WhatsApp commerce integration</p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate('/shop/demo')} variant="outline" size="lg" className="w-full gap-2">
            <Eye className="w-5 h-5" />
            View Demo Catalog
          </Button>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Features included:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: ShoppingBag, label: 'Products' },
              { icon: Briefcase, label: 'Services' },
              { icon: MessageCircle, label: 'WhatsApp' },
              { icon: Calendar, label: 'Appointments' },
              { icon: Images, label: 'Gallery' },
              { icon: Star, label: 'Reviews' },
              { icon: Share2, label: 'QR Code' },
              { icon: Download, label: 'PDF Catalog' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <feature.icon className="w-4 h-4 text-primary" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Not Found Page
const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">Return to Home</Link>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShopProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background w-full">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<div className="max-w-[576px] mx-auto min-h-screen bg-background shadow-2xl relative"><IndexPage /></div>} />
              <Route path="/dashboard" element={<SellerDashboard />} />
              <Route path="/shop/:slug" element={<div className="max-w-[576px] mx-auto min-h-screen bg-background shadow-2xl relative"><BuyerCatalog /></div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ShopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
