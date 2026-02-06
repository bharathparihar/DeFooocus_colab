import { useShop } from '@/contexts/ShopContext';

/**
 * Custom hook for analytics tracking
 */
export function useAnalytics() {
    const { trackView, trackClick } = useShop();

    /**
     * Track page view (call on component mount)
     */
    const recordView = () => {
        trackView();
    };

    /**
     * Track WhatsApp click
     */
    const recordWhatsAppClick = () => {
        trackClick('whatsapp');
    };

    /**
     * Track phone call click
     */
    const recordPhoneClick = () => {
        trackClick('phone');
    };

    /**
     * Track map/location click
     */
    const recordMapClick = () => {
        trackClick('map');
    };

    /**
     * Track product click
     */
    const recordProductClick = () => {
        trackClick('product');
    };

    /**
     * Track service click
     */
    const recordServiceClick = () => {
        trackClick('service');
    };

    return {
        recordView,
        recordWhatsAppClick,
        recordPhoneClick,
        recordMapClick,
        recordProductClick,
        recordServiceClick,
    };
}
