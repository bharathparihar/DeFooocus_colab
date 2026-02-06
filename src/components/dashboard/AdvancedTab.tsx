import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Server, Code, Search, Shield, AlertTriangle, Trash2, FileDown, QrCode, Download, Upload } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { generateProductCatalogPDF, generateServicesCatalogPDF, generateCompleteCatalogPDF } from '@/utils/pdf';
import { generateAndDownloadQRCode } from '@/utils/qrcode';
import { exportShopData, importShopData, clearAllData } from '@/utils/storage';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { toast } from 'sonner';

export function AdvancedTab() {
  const { shopData, updateShopData, resetToDefaults, importData } = useShop();
  const { seo, legal, customCode, analytics, info } = shopData;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handleExportPDF = (type: 'products' | 'services' | 'complete') => {
    try {
      if (type === 'products') {
        generateProductCatalogPDF(shopData);
      } else if (type === 'services') {
        generateServicesCatalogPDF(shopData);
      } else {
        generateCompleteCatalogPDF(shopData);
      }
      toast.success('PDF generated successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const shopUrl = `${window.location.origin}/shop/${info.alias}`;
      await generateAndDownloadQRCode(shopUrl, `${info.alias}-qr-code.png`);
      // Generate again for display (without download)
      const { generateShopQRCode } = await import('@/utils/qrcode');
      const qrDataUrl = await generateShopQRCode(shopUrl);
      setQrCodeUrl(qrDataUrl);
      toast.success('QR code generated and downloaded');
    } catch (error) {
      toast.error('Failed to generate QR code');
      console.error(error);
    }
  };

  const handleExportData = () => {
    try {
      exportShopData(shopData, `${info.alias}-data.json`);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importShopData(file);
      importData(data);
      toast.success('Data imported successfully');
    } catch (error) {
      toast.error('Failed to import data');
      console.error(error);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    toast.success('Shop reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Analytics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <div className="text-3xl font-bold text-foreground">{analytics.views}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <div className="text-3xl font-bold text-foreground">{analytics.clicks.whatsapp}</div>
            <div className="text-sm text-muted-foreground">WhatsApp Clicks</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <div className="text-3xl font-bold text-foreground">
              {analytics.views > 0 ? ((analytics.clicks.whatsapp / analytics.views) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-muted-foreground">CTR</div>
          </div>
        </div>
      </motion.section>

      {/* Export & Tools */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileDown className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Export & Tools</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Export */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <h3 className="font-semibold mb-3">PDF Catalogs</h3>
            <div className="space-y-2">
              <Button
                onClick={() => handleExportPDF('products')}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export Products Catalog
              </Button>
              <Button
                onClick={() => handleExportPDF('services')}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export Services Catalog
              </Button>
              <Button
                onClick={() => handleExportPDF('complete')}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export Complete Catalog
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <h3 className="font-semibold mb-3">QR Code</h3>
            <Button
              onClick={handleGenerateQR}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 mb-3"
            >
              <QrCode className="w-4 h-4" />
              Generate Shop QR Code
            </Button>
            {qrCodeUrl && (
              <div className="mt-3 p-2 bg-white rounded-lg">
                <img src={qrCodeUrl} alt="Shop QR Code" className="w-full" />
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <h3 className="font-semibold mb-3">Data Management</h3>
            <div className="space-y-2">
              <Button
                onClick={handleExportData}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Download className="w-4 h-4" />
                Export Shop Data (JSON)
              </Button>
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-data"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => document.getElementById('import-data')?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Import Shop Data (JSON)
                </Button>
              </label>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SEO Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">SEO Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Meta Title</Label>
            <Input
              value={seo.metaTitle}
              onChange={(e) => updateShopData({ seo: { ...seo, metaTitle: e.target.value } })}
              placeholder="Page title for search engines"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground mt-1">{seo.metaTitle.length}/60 characters</p>
          </div>
          <div>
            <Label>Meta Description</Label>
            <Textarea
              value={seo.metaDescription}
              onChange={(e) => updateShopData({ seo: { ...seo, metaDescription: e.target.value } })}
              placeholder="Brief description for search results"
              rows={2}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground mt-1">{seo.metaDescription.length}/160 characters</p>
          </div>
          <div>
            <Label>Share Image</Label>
            <div className="mt-2">
              <ImageUpload
                value={seo.shareImage || ''}
                onChange={(base64) => updateShopData({ seo: { ...seo, shareImage: base64 } })}
                aspectRatio="1200/630"
                label="Upload Share Image (1200x630)"
                maxSizeMB={2}
              />
            </div>
          </div>
          <div>
            <Label>Keywords (comma separated)</Label>
            <Input
              value={seo.keywords.join(', ')}
              onChange={(e) => updateShopData({
                seo: { ...seo, keywords: e.target.value.split(',').map(k => k.trim()) }
              })}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </motion.section>

      {/* Custom Code */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Custom Code</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Custom CSS</Label>
            <Textarea
              value={customCode.css}
              onChange={(e) => updateShopData({ customCode: { ...customCode, css: e.target.value } })}
              placeholder="/* Your custom CSS here */"
              rows={4}
              className="font-mono text-sm"
            />
          </div>
          <div>
            <Label>Custom JavaScript</Label>
            <Textarea
              value={customCode.js}
              onChange={(e) => updateShopData({ customCode: { ...customCode, js: e.target.value } })}
              placeholder="// Your custom JavaScript here"
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </motion.section>

      {/* Legal Compliance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Legal Compliance</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Privacy Policy</Label>
            <Textarea
              value={legal.privacyPolicy}
              onChange={(e) => updateShopData({ legal: { ...legal, privacyPolicy: e.target.value } })}
              placeholder="Your privacy policy..."
              rows={4}
            />
          </div>
          <div>
            <Label>Terms & Conditions</Label>
            <Textarea
              value={legal.termsConditions}
              onChange={(e) => updateShopData({ legal: { ...legal, termsConditions: e.target.value } })}
              placeholder="Your terms and conditions..."
              rows={4}
            />
          </div>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="dashboard-card border-destructive/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-display font-semibold text-destructive">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div>
              <h3 className="font-semibold">Reset Shop</h3>
              <p className="text-sm text-muted-foreground">Clear all content and reset to defaults</p>
            </div>
            <Button
              onClick={() => setShowResetConfirm(true)}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Reset
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        title="Reset Shop to Defaults?"
        description="This will permanently delete all your content, settings, and data. This action cannot be undone."
        confirmLabel="Reset Everything"
        variant="destructive"
        onConfirm={handleReset}
      />
    </div>
  );
}
