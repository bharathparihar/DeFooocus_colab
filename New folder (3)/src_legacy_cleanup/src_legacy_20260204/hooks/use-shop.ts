import { useState, useEffect, useCallback } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/pages/integrations/supabase/client";
import { toast } from "sonner";
import {
    ShopConfig, BusinessHours, Category, Product,
    Service, Testimonial, SocialLinks, FAQ, ShopStats,
    SocialEmbed, SectionVisibility, Template, CustomLink
} from "@/types/shop";

export interface UseShopReturn {
    shop: ShopConfig | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    saveShop: (config: ShopConfig) => Promise<boolean>;
    createShop: (config: ShopConfig) => Promise<boolean>;
    refetchShop: () => Promise<void>;
    incrementStats: (type: 'views' | 'clicks' | 'ctaClicks') => Promise<void>;
}

export const defaultShopConfig: ShopConfig = {
    shopName: "",
    tagline: "",
    ownerName: "",
    description: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    bannerUrl: "",
    logoUrl: "",
    template: "modern",
    businessHours: [
        { day: "Monday", open: "09:00", close: "21:00", isClosed: false },
        { day: "Tuesday", open: "09:00", close: "21:00", isClosed: false },
        { day: "Wednesday", open: "09:00", close: "21:00", isClosed: false },
        { day: "Thursday", open: "09:00", close: "21:00", isClosed: false },
        { day: "Friday", open: "09:00", close: "21:00", isClosed: false },
        { day: "Saturday", open: "09:00", close: "21:00", isClosed: false },
        { day: "Sunday", open: "09:00", close: "21:00", isClosed: false },
    ],
    jobTitle: "",
    occupation: "",
    dateOfBirth: "",
    alternatePhone: "",
    alternateEmail: "",
    privacyPolicy: "",
    termsConditions: "",
    customLinks: [],
    socialEmbeds: [],
    services: [],
    products: [],
    galleryImages: [],
    testimonials: [],
    socialLinks: {
        instagram: "",
        facebook: "",
        website: "",
        seo: {
            title: "",
            description: "",
        }
    },
    categories: [],
    faq: [],
    featuredVideo: "",
    stats: {
        clients: "0",
        photos: "0",
        rating: "0",
        views: 0,
        clicks: 0,
        ctaClicks: 0,
    },
    customCss: "",
    customJs: "",
    slug: "",
    sectionVisibility: {
        announcement: true,
        banner: true,
        stats: true,
        actionButtons: true,
        categories: true,
        gallery: true,
        featuredVideo: true,
        products: true,
        services: true,
        socialEmbeds: true,
        testimonials: true,
        faq: true,
        businessHours: true,
        socialLinks: true,
        about: true,
        visitUs: true,
        shareProfile: true,
        inquiry: true,
        appointment: true,
    }
};

const parseJsonArray = <T,>(json: any | null, fallback: T[]): T[] => {
    if (!json) return fallback;
    if (Array.isArray(json)) return json as T[];
    return fallback;
};

const parseJsonObject = <T,>(json: any | null, fallback: T): T => {
    if (!json) return fallback;
    if (typeof json === 'object' && !Array.isArray(json)) return json as T;
    return fallback;
};

export const useShop = (user: User | null): UseShopReturn => {
    const [shop, setShop] = useState<ShopConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShop = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let query = supabase.from('shops').select('*');
            const urlParams = new URLSearchParams(window.location.search);
            let shopParam = urlParams.get('shop');

            if (!shopParam && window.location.pathname.startsWith('/v/')) {
                shopParam = window.location.pathname.split('/v/')[1]?.split('/')[0];
            }

            if (shopParam) {
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(shopParam);
                if (isUuid) {
                    query = query.eq('id', shopParam);
                } else {
                    query = query.eq('social_links->>slug', shopParam);
                }
            } else if (user) {
                query = query.eq('user_id', user.id);
            }

            const { data, error: fetchError } = await query.maybeSingle();

            if (fetchError) throw fetchError;

            if (data) {
                const shopConfig: ShopConfig = {
                    id: data.id,
                    createdAt: data.created_at,
                    shopName: data.shop_name,
                    tagline: data.tagline || '',
                    ownerName: data.owner_name || '',
                    description: data.description || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    whatsappNumber: data.whatsapp_number || '',
                    address: data.address || '',
                    bannerUrl: data.banner_url || '',
                    logoUrl: data.logo_url || '',
                    template: (data.template as ShopConfig['template']) || 'modern',
                    businessHours: parseJsonArray<BusinessHours>(data.business_hours, defaultShopConfig.businessHours),
                    services: parseJsonArray<Service>(data.services, []),
                    products: parseJsonArray<Product>((data as any).products, []).map((p: any) => ({
                        ...p,
                        stock: p.stock !== undefined ? p.stock : 10,
                        status: p.status || 'ready-stock'
                    })),
                    galleryImages: parseJsonArray<string>(data.gallery_images, []),
                    testimonials: parseJsonArray<Testimonial>(data.testimonials, []),
                    socialLinks: parseJsonObject<SocialLinks>(data.social_links, {}),
                    categories: parseJsonArray<Category>((data as any).categories, []),
                    faq: parseJsonArray<FAQ>((data as any).faq, []),
                    featuredVideo: (data.social_links as any)?.featured_video || (data as any).featured_video || '',
                    slug: (data.social_links as any)?.slug || '',
                    trialExtended: (data.social_links as any)?._trial_extended || false,
                    stats: parseJsonObject<ShopStats>((data as any).stats, { clients: "0", photos: "0", rating: "0", views: 0, clicks: 0, ctaClicks: 0 }),
                    customCss: (data as any).custom_css || '',
                    customJs: (data as any).custom_js || '',
                    socialEmbeds: parseJsonArray((data as any).social_embeds, []),
                    customDomain: (data as any).custom_domain || '',
                    sectionVisibility: (() => {
                        const socialLinks = data.social_links as any || {};
                        if (socialLinks._section_visibility) {
                            try {
                                return JSON.parse(socialLinks._section_visibility);
                            } catch (e) { console.error("Failed to parse section visibility", e); }
                        }
                        return parseJsonObject<SectionVisibility>((data as any).section_visibility, defaultShopConfig.sectionVisibility!);
                    })(),
                };
                setShop(shopConfig);
            } else {
                setShop(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch shop');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchShop();
    }, [fetchShop]);

    const createShop = useCallback(async (config: ShopConfig): Promise<boolean> => {
        if (!user) return false;
        setSaving(true);
        setError(null);
        try {
            const { error: insertError } = await supabase.from('shops').insert({
                user_id: user.id,
                shop_name: config.shopName,
                tagline: config.tagline,
                owner_name: config.ownerName,
                description: config.description,
                email: config.email,
                phone: config.phone,
                whatsapp_number: config.whatsappNumber,
                address: config.address,
                banner_url: config.bannerUrl,
                logo_url: config.logoUrl,
                template: config.template,
                business_hours: config.businessHours as unknown as any,
                services: config.services as unknown as any,
                gallery_images: config.galleryImages as unknown as any,
                testimonials: config.testimonials as unknown as any,
                social_links: {
                    ...config.socialLinks,
                    _section_visibility: JSON.stringify(config.sectionVisibility),
                    slug: config.slug,
                    _trial_extended: config.trialExtended,
                    featured_video: config.featuredVideo
                } as unknown as any,
                categories: config.categories as unknown as any,
                products: config.products as unknown as any,
                faq: config.faq as unknown as any,
                stats: config.stats as unknown as any,
                custom_css: config.customCss || '',
                custom_js: config.customJs || '',
                social_embeds: config.socialEmbeds as unknown as any,
            } as any);

            if (insertError) throw insertError;
            setShop(config);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to create shop');
            return false;
        } finally {
            setSaving(false);
        }
    }, [user]);

    const saveShop = useCallback(async (config: ShopConfig): Promise<boolean> => {
        if (!user) return false;
        setSaving(true);
        setError(null);
        try {
            const { error: updateError } = await supabase.from('shops').update({
                shop_name: config.shopName,
                tagline: config.tagline,
                owner_name: config.ownerName,
                description: config.description,
                email: config.email,
                phone: config.phone,
                whatsapp_number: config.whatsappNumber,
                address: config.address,
                banner_url: config.bannerUrl,
                logo_url: config.logoUrl,
                template: config.template,
                business_hours: config.businessHours as unknown as any,
                services: config.services as unknown as any,
                gallery_images: config.galleryImages as unknown as any,
                testimonials: config.testimonials as unknown as any,
                social_links: {
                    ...config.socialLinks,
                    _section_visibility: JSON.stringify(config.sectionVisibility),
                    slug: config.slug,
                    _trial_extended: config.trialExtended,
                    featured_video: config.featuredVideo
                } as unknown as any,
                categories: config.categories as unknown as any,
                products: config.products as unknown as any,
                faq: config.faq as unknown as any,
                stats: config.stats as unknown as any,
                custom_css: config.customCss || '',
                custom_js: config.customJs || '',
                social_embeds: config.socialEmbeds as unknown as any,
            } as any).eq('user_id', user.id);

            if (updateError) throw updateError;
            setShop(config);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to save shop');
            return false;
        } finally {
            setSaving(false);
        }
    }, [user]);

    const incrementStats = useCallback(async (type: 'views' | 'clicks' | 'ctaClicks') => {
        if (!shop?.id) return;
        try {
            const currentStats = shop.stats || { views: 0, clicks: 0, ctaClicks: 0, clients: "0", photos: "0", rating: "0" };
            const newStats = { ...currentStats, [type]: (currentStats[type] || 0) + 1 };
            await supabase.from('shops').update({ stats: newStats as unknown as any }).eq('id', shop.id);
        } catch (e) {
            console.error("Failed to track stat", e);
        }
    }, [shop?.id, shop?.stats]);

    return { shop, loading, saving, error, saveShop, createShop, refetchShop: fetchShop, incrementStats };
};
