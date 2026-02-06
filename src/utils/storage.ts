import { ShopData } from '@/types/catalog';

/**
 * Storage management utilities
 */

const STORAGE_KEY = 'b_catalog_shop_data';

/**
 * Clear all app data from localStorage
 */
export function clearAllData(): void {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
    }
}

/**
 * Export shop data as JSON file
 */
export function exportShopData(shopData: ShopData, filename?: string): void {
    const dataStr = JSON.stringify(shopData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${shopData.info.alias || 'shop'}-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Import shop data from JSON file
 */
export function importShopData(file: File): Promise<ShopData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Check localStorage quota usage
 */
export function getStorageInfo(): {
    used: number;
    total: number;
    percentage: number;
} {
    if (typeof window === 'undefined') {
        return { used: 0, total: 0, percentage: 0 };
    }

    let total = 0;

    // Calculate total size of all localStorage items
    for (let key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            total += window.localStorage[key].length + key.length;
        }
    }

    // Most browsers limit localStorage to 5-10MB
    // We'll assume 5MB (5 * 1024 * 1024 bytes)
    const limit = 5 * 1024 * 1024;
    const percentage = (total / limit) * 100;

    return {
        used: total,
        total: limit,
        percentage: Math.min(percentage, 100),
    };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
