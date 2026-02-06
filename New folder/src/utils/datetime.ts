import { BusinessHours } from '@/types/catalog';

/**
 * Parse time string (e.g., "09:00", "14:30") to minutes since midnight
 */
export function parseTime(timeStr: string): number {
    if (!timeStr || timeStr.trim() === '') return 0;

    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Get current day name
 */
export function getCurrentDayName(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

/**
 * Get current time in minutes since midnight
 */
export function getCurrentTimeInMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

/**
 * Check if shop is currently open based on business hours
 */
export function isShopOpen(businessHours: BusinessHours[]): {
    isOpen: boolean;
    closingTime?: string;
    openingTime?: string;
    nextOpenDay?: string;
} {
    const currentDay = getCurrentDayName();
    const currentTime = getCurrentTimeInMinutes();

    // Find today's hours
    const todayHours = businessHours.find(h => h.day === currentDay);

    if (!todayHours || !todayHours.isOpen) {
        // Find next open day
        const dayIndex = new Date().getDay();
        for (let i = 1; i <= 7; i++) {
            const nextDayIndex = (dayIndex + i) % 7;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const nextDay = days[nextDayIndex];
            const nextDayHours = businessHours.find(h => h.day === nextDay);

            if (nextDayHours?.isOpen) {
                return {
                    isOpen: false,
                    nextOpenDay: nextDay,
                    openingTime: nextDayHours.openTime,
                };
            }
        }

        return { isOpen: false };
    }

    const openTime = parseTime(todayHours.openTime);
    const closeTime = parseTime(todayHours.closeTime);

    const isOpen = currentTime >= openTime && currentTime < closeTime;

    return {
        isOpen,
        closingTime: isOpen ? todayHours.closeTime : undefined,
        openingTime: !isOpen && currentTime < openTime ? todayHours.openTime : undefined,
    };
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format date and time to readable string
 */
export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();

    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

/**
 * Get relative time string (e.g., "2 hours ago", "just now")
 */
export function getRelativeTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(d);
}
