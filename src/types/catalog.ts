// B Catalog Core Types

export interface ShopInfo {
  id: string;
  name: string;
  alias: string;
  owner: string;
  tagline: string;
  description: string;
  logo?: string;
  banner?: string;
  bannerVideo?: string;
  jobTitle?: string;
  dateOfBirth?: string;
}

export interface ContactDetails {
  primaryPhone: string;
  alternatePhone?: string;
  email?: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  isCustom?: boolean;
  label?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  video?: string;
  categoryId?: string;
  status: 'ready' | 'made-to-order';
  isVisible: boolean;
  order: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: number;
  priceType: 'fixed' | 'starting' | 'hourly' | 'contact';
  currency: string;
  image?: string;
  video?: string;
  categoryId?: string;
  status: 'ready' | 'made-to-order';
  isVisible: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  isVisible: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  date: string;
  isResponded: boolean;
  isToday?: boolean;
}

export interface Appointment {
  id: string;
  name: string;
  email?: string;
  phone: string;
  service?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
}

export interface AnalyticsData {
  views: number;
  clicks: {
    whatsapp: number;
    phone: number;
    email: number;
    map: number;
    social: Record<string, number>;
  };
}

export interface WelcomePopup {
  isEnabled: boolean;
  title: string;
  message: string;
  image?: string;
  buttonText: string;
  buttonUrl?: string;
}

export interface AnnouncementBanner {
  isEnabled: boolean;
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  shareImage?: string;
  keywords: string[];
}

export interface LegalSettings {
  privacyPolicy: string;
  termsConditions: string;
}

export interface CustomCode {
  css: string;
  js: string;
}

export interface SectionVisibility {
  banner: boolean;
  stats: boolean;
  categories: boolean;
  featuredFilm: boolean;
  gallery: boolean;
  products: boolean;
  services: boolean;
  testimonials: boolean;
  faq: boolean;
  socialEmbeds: boolean;
  businessHours: boolean;
  location: boolean;
}

export interface ShopData {
  info: ShopInfo;
  contact: ContactDetails;
  businessHours: BusinessHours[];
  socialLinks: SocialLink[];
  categories: Category[];
  gallery: MediaItem[];
  featuredFilm?: MediaItem;
  products: Product[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  inquiries: Inquiry[];
  appointments: Appointment[];
  welcomePopup: WelcomePopup;
  announcement: AnnouncementBanner;
  seo: SEOSettings;
  legal: LegalSettings;
  customCode: CustomCode;
  sectionVisibility: SectionVisibility;
  socialEmbeds: string[];
  analytics: AnalyticsData;
}

export type DashboardTab = 'profile' | 'content' | 'leads' | 'advanced';
