import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ShopData, Product, Service } from '@/types/catalog';

/**
 * Generate product catalog PDF
 */
export function generateProductCatalogPDF(shopData: ShopData): void {
    const doc = new jsPDF();
    const { info, products, contact } = shopData;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(info.name, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(info.tagline || '', 105, 28, { align: 'center' });

    // Contact info
    doc.setFontSize(9);
    doc.text(`${contact.primaryPhone} • ${contact.email || ''}`, 105, 35, { align: 'center' });

    // Products table
    const visibleProducts = products.filter(p => p.isVisible);

    if (visibleProducts.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Products', 14, 45);

        const tableData = visibleProducts.map(p => [
            p.name,
            `${p.currency} ${p.price.toFixed(2)}`,
            p.status === 'ready' ? 'Ready' : 'Made to Order',
            p.description.substring(0, 50) + (p.description.length > 50 ? '...' : ''),
        ]);

        autoTable(doc, {
            head: [['Product', 'Price', 'Status', 'Description']],
            body: tableData,
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9 },
        });
    }

    // Save PDF
    doc.save(`${info.alias || 'shop'}-catalog.pdf`);
}

/**
 * Generate services catalog PDF
 */
export function generateServicesCatalogPDF(shopData: ShopData): void {
    const doc = new jsPDF();
    const { info, services, contact } = shopData;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(info.name, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(info.tagline || '', 105, 28, { align: 'center' });

    // Contact info
    doc.setFontSize(9);
    doc.text(`${contact.primaryPhone} • ${contact.email || ''}`, 105, 35, { align: 'center' });

    // Services table
    const visibleServices = services.filter(s => s.isVisible);

    if (visibleServices.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Services', 14, 45);

        const tableData = visibleServices.map(s => {
            let priceText = 'Contact for pricing';
            if (s.priceType === 'fixed' && s.price) {
                priceText = `${s.currency} ${s.price.toFixed(2)}`;
            } else if (s.priceType === 'starting' && s.price) {
                priceText = `Starting at ${s.currency} ${s.price.toFixed(2)}`;
            } else if (s.priceType === 'hourly' && s.price) {
                priceText = `${s.currency} ${s.price.toFixed(2)}/hr`;
            }

            return [
                s.name,
                priceText,
                s.description.substring(0, 60) + (s.description.length > 60 ? '...' : ''),
            ];
        });

        autoTable(doc, {
            head: [['Service', 'Price', 'Description']],
            body: tableData,
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9 },
        });
    }

    // Save PDF
    doc.save(`${info.alias || 'shop'}-services.pdf`);
}

/**
 * Generate complete shop catalog PDF (products + services)
 */
export function generateCompleteCatalogPDF(shopData: ShopData): void {
    const doc = new jsPDF();
    const { info, products, services, contact } = shopData;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(info.name, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(info.tagline || '', 105, 28, { align: 'center' });

    // Contact info
    doc.setFontSize(9);
    doc.text(`${contact.primaryPhone} • ${contact.email || ''}`, 105, 35, { align: 'center' });

    let currentY = 45;

    // Products section
    const visibleProducts = products.filter(p => p.isVisible);
    if (visibleProducts.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Products', 14, currentY);

        const productTableData = visibleProducts.map(p => [
            p.name,
            `${p.currency} ${p.price.toFixed(2)}`,
            p.status === 'ready' ? 'Ready' : 'Made to Order',
        ]);

        autoTable(doc, {
            head: [['Product', 'Price', 'Status']],
            body: productTableData,
            startY: currentY + 5,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9 },
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Services section
    const visibleServices = services.filter(s => s.isVisible);
    if (visibleServices.length > 0) {
        // Add new page if needed
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Services', 14, currentY);

        const serviceTableData = visibleServices.map(s => {
            let priceText = 'Contact';
            if (s.priceType === 'fixed' && s.price) {
                priceText = `${s.currency} ${s.price.toFixed(2)}`;
            } else if (s.priceType === 'starting' && s.price) {
                priceText = `From ${s.currency} ${s.price}`;
            }

            return [s.name, priceText];
        });

        autoTable(doc, {
            head: [['Service', 'Price']],
            body: serviceTableData,
            startY: currentY + 5,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9 },
        });
    }

    // Save PDF
    doc.save(`${info.alias || 'shop'}-complete-catalog.pdf`);
}
