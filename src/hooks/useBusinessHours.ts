import { useMemo } from 'react';
import { BusinessHours } from '@/types/catalog';
import { isShopOpen } from '@/utils/datetime';

/**
 * Custom hook for business hours calculations
 */
export function useBusinessHours(businessHours: BusinessHours[]) {
    const status = useMemo(() => {
        return isShopOpen(businessHours);
    }, [businessHours]);

    return {
        isOpen: status.isOpen,
        closingTime: status.closingTime,
        openingTime: status.openingTime,
        nextOpenDay: status.nextOpenDay,
        statusText: status.isOpen
            ? `Open now • Closes at ${status.closingTime}`
            : status.openingTime
                ? `Closed • Opens at ${status.openingTime}`
                : status.nextOpenDay
                    ? `Closed • Opens ${status.nextOpenDay} at ${status.openingTime}`
                    : 'Closed',
    };
}
