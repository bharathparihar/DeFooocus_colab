
export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    stock?: number;
    status: 'ready-stock' | 'made-to-order' | 'coming-soon';
    categoryId?: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon?: string;
    imageUrl?: string;
    price?: string;
    categoryId?: string;
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
    description?: string; // Added optional to match potential usage or just keep exact
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

export interface Testimonial {
    id: string;
    name: string;
    comment: string;
    rating: number;
    imageUrl?: string;
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
    seo?: {
        title?: string;
        description?: string;
        image?: string;
        siteTitle?: string;
        keywords?: string;
    };
    announcement?: string;
    popup?: {
        enabled: boolean;
        image?: string;
        text?: string;
    };
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

export interface ShopConfig {
    id?: string;
    shopName: string;
    ownerName: string;
    jobTitle?: string;
    occupation?: string;
    dateOfBirth?: string;
    phone: string;
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
    privacyPolicy?: string;
    termsConditions?: string;
    slug?: string;
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
    template: Template;
    customCss?: string;
    customJs?: string;
    customDomain?: string;
    sectionVisibility?: SectionVisibility;
    createdAt?: string;
    inquiries?: Inquiry[];
    appointments?: Appointment[];
}
