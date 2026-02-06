export interface Product {
  id: string;
  name: string;
  price: number; // Changed to number to match usage
  imageUrl: string;
  description?: string;
  stock?: number;
  status: 'ready-stock' | 'made-to-order' | 'coming-soon';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  price?: string; // Added price
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}





export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ShopStats {
  clients: string;
  photos: string;
  rating: string;
  views?: number;
  clicks?: number;
  ctaClicks?: number;
}

export interface SocialEmbed {
  id: string;
  type: 'instagram' | 'facebook' | 'youtube' | 'twitter' | 'maps';
  url: string;
  title?: string;
}

export interface SectionVisibility {
  announcement: boolean;
  banner: boolean;
  stats: boolean;
  actionButtons: boolean;
  categories: boolean;
  gallery: boolean;
  featuredVideo: boolean;
  products: boolean;
  services: boolean;
  socialEmbeds: boolean;
  testimonials: boolean;
  faq: boolean;
  businessHours: boolean;
  socialLinks: boolean;
  about: boolean;
  visitUs: boolean;
  shareProfile: boolean;
  inquiry: boolean;
  appointment: boolean;
}

export interface ShopConfig {
  id?: string;
  shopName: string;
  ownerName: string;

  // Profile Additions
  jobTitle?: string;
  occupation?: string;
  dateOfBirth?: string;

  phone: string;
  // Contact Additions
  alternatePhone?: string;
  alternateEmail?: string;

  email: string;
  whatsappNumber: string;
  address: string;
  description: string;
  tagline: string;
  logoUrl?: string;
  bannerUrl?: string;
  featuredVideo?: string;


  // Legal
  privacyPolicy?: string;
  termsConditions?: string;
  slug?: string; // URL Alias

  socialLinks: SocialLinks;
  businessHours: BusinessHours[];
  categories: Category[];
  products: Product[];
  services: Service[];
  testimonials: Testimonial[];
  galleryImages: string[];
  faq: FAQ[];
  customLinks?: CustomLink[];
  socialEmbeds?: SocialEmbed[];

  stats: ShopStats;

  // Theme & Customization
  template: 'minimal' | 'modern' | 'grid';
  customCss?: string;
  customJs?: string;
  customDomain?: string; // Renamed UI to "URL Alias", keeping key for backward compat or rename? Let's keep key to minimize migration pain unless requested.
  // Actually, let's call it customDomain but treat it as alias in UI.

  // Section Visibility
  sectionVisibility?: SectionVisibility; // Changed to use specific type

  createdAt?: string;
  trialExtended?: boolean;
  coupons?: Coupon[];
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string; // Changed from text to comment to match usage
  rating: number;
  imageUrl?: string; // Added for user request
}

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  description?: string;
  isActive: boolean;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  website?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  pinterest?: string;
  snapchat?: string;
  whatsapp?: string;
  maps?: string;
  mapEmbed?: string;
  telegram?: string;
  threads?: string;
  justdial?: string;
  indiamart?: string;
  zomato?: string;
  swiggy?: string;
  behance?: string;
  dribbble?: string;
  paytm?: string;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    siteTitle?: string;
    keywords?: string;
  };
  announcement?: string;
  _admin_status?: 'active' | 'banned';
  _is_verified?: boolean;
  createdAt?: string; // Mapped from DB created_at for Trial Logic
  popup?: {
    enabled: boolean;
    image?: string;
    text?: string;
  };
  image?: string;
  text?: string;
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface Inquiry {
  id: string;
  shop_id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  shop_id: string;
  name: string;
  email?: string;
  phone: string;
  service?: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
  status: string;
  created_at: string;
}

export type Template = "modern" | "classic" | "minimal" | "elegant" | "grid";
