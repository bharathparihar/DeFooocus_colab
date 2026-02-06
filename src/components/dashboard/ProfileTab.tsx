import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Copy, Check, Download, QrCode, Share2, Instagram, Facebook, Youtube, Twitter, Plus, Trash2, Image as ImageIcon, Clock, MapPin, Phone, Mail, User, Building, Sparkles } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { cn } from '@/lib/utils';

export function ProfileTab() {
  const { shopData, updateShopInfo, updateContact, updateShopData } = useShop();
  const { info, contact, businessHours, socialLinks, announcement, welcomePopup } = shopData;

  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const shopUrl = `${window.location.origin}/shop/${info.alias}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${info.alias}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const socialIcons: Record<string, React.FC<{ className?: string }>> = {
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    twitter: Twitter,
  };

  return (
    <div className="space-y-6">
      {/* Share Shop Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Share Your Shop</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shop Link */}
          <div className="space-y-3">
            <Label>Custom Alias</Label>
            <div className="flex gap-2">
              <Input
                value={info.alias}
                onChange={(e) => updateShopInfo({ alias: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="my-shop"
                className="font-mono"
              />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
              <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{shopUrl}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="ml-auto flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex items-center justify-center">
            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
              <DialogTrigger asChild>
                <button className="p-6 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors group">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeSVG value={shopUrl} size={80} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                    Click to enlarge
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>QR Code</DialogTitle>
                </DialogHeader>
                <div id="qr-code" className="flex flex-col items-center p-6">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <QRCodeSVG value={shopUrl} size={200} />
                  </div>
                  <Button onClick={handleDownloadQR} className="mt-4 gap-2">
                    <Download className="w-4 h-4" />
                    Download QR
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.section>

      {/* Welcome Popup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dashboard-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-semibold">Welcome Popup</h2>
          </div>
          <Switch
            checked={welcomePopup.isEnabled}
            onCheckedChange={(checked) =>
              updateShopData({ welcomePopup: { ...welcomePopup, isEnabled: checked } })
            }
          />
        </div>

        {welcomePopup.isEnabled && (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={welcomePopup.title}
                onChange={(e) => updateShopData({ welcomePopup: { ...welcomePopup, title: e.target.value } })}
                placeholder="Welcome!"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={welcomePopup.message}
                onChange={(e) => updateShopData({ welcomePopup: { ...welcomePopup, message: e.target.value } })}
                placeholder="Get 10% off your first order..."
                rows={2}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={welcomePopup.buttonText}
                onChange={(e) => updateShopData({ welcomePopup: { ...welcomePopup, buttonText: e.target.value } })}
                placeholder="Shop Now"
              />
            </div>
          </div>
        )}
      </motion.section>

      {/* Announcement Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="dashboard-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Announcement Banner</h2>
          <Switch
            checked={announcement.isEnabled}
            onCheckedChange={(checked) =>
              updateShopData({ announcement: { ...announcement, isEnabled: checked } })
            }
          />
        </div>

        {announcement.isEnabled && (
          <div>
            <Label>Banner Text</Label>
            <Input
              value={announcement.text}
              onChange={(e) => updateShopData({ announcement: { ...announcement, text: e.target.value } })}
              placeholder="Free shipping on orders over $50!"
            />
          </div>
        )}
      </motion.section>

      {/* Shop Info */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Shop Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Shop Name</Label>
            <Input
              value={info.name}
              onChange={(e) => updateShopInfo({ name: e.target.value })}
              placeholder="My Shop"
            />
          </div>
          <div>
            <Label>Owner Name</Label>
            <Input
              value={info.owner}
              onChange={(e) => updateShopInfo({ owner: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={info.tagline}
              onChange={(e) => updateShopInfo({ tagline: e.target.value })}
              placeholder="Your catchy tagline"
            />
          </div>
          <div>
            <Label>Job Title</Label>
            <Input
              value={info.jobTitle || ''}
              onChange={(e) => updateShopInfo({ jobTitle: e.target.value })}
              placeholder="Founder & CEO"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={info.description}
              onChange={(e) => updateShopInfo({ description: e.target.value })}
              placeholder="Tell your story..."
              rows={3}
            />
          </div>
        </div>
      </motion.section>

      {/* Branding */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Branding</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Shop Logo</Label>
            <div className="mt-2">
              <ImageUpload
                value={info.logo}
                onChange={(base64) => updateShopInfo({ logo: base64 })}
                aspectRatio="1/1"
                label="Upload Logo (1:1)"
                maxSizeMB={1}
              />
            </div>
          </div>
          <div>
            <Label>Shop Banner</Label>
            <div className="mt-2">
              <ImageUpload
                value={info.banner}
                onChange={(base64) => updateShopInfo({ banner: base64 })}
                aspectRatio="16/9"
                label="Upload Banner (16:9)"
                maxSizeMB={2}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Details */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Contact Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Primary Phone</Label>
            <Input
              value={contact.primaryPhone}
              onChange={(e) => updateContact({ primaryPhone: e.target.value })}
              placeholder="+1 555-123-4567"
            />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input
              value={contact.whatsapp}
              onChange={(e) => updateContact({ whatsapp: e.target.value })}
              placeholder="+15551234567"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={contact.email || ''}
              onChange={(e) => updateContact({ email: e.target.value })}
              placeholder="hello@myshop.com"
            />
          </div>
          <div>
            <Label>Alternate Phone</Label>
            <Input
              value={contact.alternatePhone || ''}
              onChange={(e) => updateContact({ alternatePhone: e.target.value })}
              placeholder="+1 555-987-6543"
            />
          </div>
        </div>
      </motion.section>

      {/* Location */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Location</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Street Address</Label>
            <Input
              value={contact.address}
              onChange={(e) => updateContact({ address: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={contact.city}
              onChange={(e) => updateContact({ city: e.target.value })}
              placeholder="San Francisco"
            />
          </div>
          <div>
            <Label>State/Province</Label>
            <Input
              value={contact.state}
              onChange={(e) => updateContact({ state: e.target.value })}
              placeholder="California"
            />
          </div>
          <div>
            <Label>ZIP/Postal Code</Label>
            <Input
              value={contact.zipCode}
              onChange={(e) => updateContact({ zipCode: e.target.value })}
              placeholder="94102"
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              value={contact.country}
              onChange={(e) => updateContact({ country: e.target.value })}
              placeholder="USA"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Google Maps URL</Label>
            <Input
              value={contact.mapUrl || ''}
              onChange={(e) => updateContact({ mapUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>
      </motion.section>

      {/* Business Hours */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Business Hours</h2>
        </div>

        <div className="space-y-3">
          {businessHours.map((day, index) => (
            <div key={day.day} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
              <div className="w-24 font-medium">{day.day}</div>
              <Switch
                checked={day.isOpen}
                onCheckedChange={(checked) => {
                  const updated = [...businessHours];
                  updated[index] = { ...day, isOpen: checked };
                  updateShopData({ businessHours: updated });
                }}
              />
              {day.isOpen && (
                <>
                  <Input
                    type="time"
                    value={day.openTime}
                    onChange={(e) => {
                      const updated = [...businessHours];
                      updated[index] = { ...day, openTime: e.target.value };
                      updateShopData({ businessHours: updated });
                    }}
                    className="w-28"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={day.closeTime}
                    onChange={(e) => {
                      const updated = [...businessHours];
                      updated[index] = { ...day, closeTime: e.target.value };
                      updateShopData({ businessHours: updated });
                    }}
                    className="w-28"
                  />
                </>
              )}
              {!day.isOpen && (
                <span className="text-muted-foreground">Closed</span>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Social Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="dashboard-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Social Links</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link, index) => {
            const IconComponent = socialIcons[link.platform] || Link2;
            return (
              <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{link.platform}</div>
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index] = { ...link, url: e.target.value };
                      updateShopData({ socialLinks: updated });
                    }}
                    placeholder="https://..."
                    className="text-sm mt-1"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
