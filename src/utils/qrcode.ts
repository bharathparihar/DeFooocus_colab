import QRCode from 'qrcode';

/**
 * Generate QR code for shop URL
 */
export async function generateShopQRCode(
    shopUrl: string,
    options?: {
        size?: number;
        color?: string;
        backgroundColor?: string;
    }
): Promise<string> {
    const { size = 300, color = '#000000', backgroundColor = '#ffffff' } = options || {};

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(shopUrl, {
            width: size,
            margin: 2,
            color: {
                dark: color,
                light: backgroundColor,
            },
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Download QR code as PNG
 */
export function downloadQRCode(dataUrl: string, filename: string = 'shop-qr-code.png'): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generate and download QR code in one step
 */
export async function generateAndDownloadQRCode(
    shopUrl: string,
    filename?: string,
    options?: Parameters<typeof generateShopQRCode>[1]
): Promise<void> {
    const qrCodeDataUrl = await generateShopQRCode(shopUrl, options);
    downloadQRCode(qrCodeDataUrl, filename);
}
