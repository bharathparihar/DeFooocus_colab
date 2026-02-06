import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Twitter, ExternalLink, Users, ShoppingBag, Star, Clock } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnnouncementBar } from '@/components/catalog/AnnouncementBar';
import { WelcomePopup } from '@/components/catalog/WelcomePopup';
import { FloatingBar } from '@/components/catalog/FloatingBar';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ServiceCard } from '@/components/catalog/ServiceCard';
import { TestimonialCard } from '@/components/catalog/TestimonialCard';
import { CategoryScroll } from '@/components/catalog/CategoryScroll';
import { GalleryGrid } from '@/components/catalog/GalleryGrid';
import { BusinessHours } from '@/components/catalog/BusinessHours';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
};

export function BuyerCatalog() {
  const { shopData } = useShop();
  const { recordView, recordWhatsAppClick, recordPhoneClick, recordMapClick } = useAnalytics();
  const { info, contact, categories, products, services, testimonials, faqs, gallery, businessHours, socialLinks, announcement, welcomePopup, sectionVisibility } = shopData;

  const [selectedCategory, setSelectedCategory] = useState('');

  // Track page view on mount
  useEffect(() => {
    recordView();
  }, [recordView]);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory && p.isVisible)
    : products.filter(p => p.isVisible);

  const visibleServices = services.filter(s => s.isVisible);
  const visibleTestimonials = testimonials.filter(t => t.isVisible);
  const visibleFaqs = faqs.filter(f => f.isVisible);

  // Stats
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '500+' },
    { icon: ShoppingBag, label: 'Products', value: products.length.toString() },
    { icon: Star, label: 'Rating', value: '4.9' },
    { icon: Clock, label: 'Years', value: '5+' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="app-container">
        <WelcomePopup popup={welcomePopup} />

        {/* Announcement Bar */}
        {sectionVisibility.banner && (
          <AnnouncementBar text={announcement.text} isEnabled={announcement.isEnabled} />
        )}

        {/* Hero/Banner Section */}
        <section className="relative">
          {info.banner && (
            <div className="h-48 sm:h-56 overflow-hidden">
              <img
                src={info.banner}
                alt={info.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          )}

          {/* Shop Info */}
          <div className="px-4 relative -mt-16 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start gap-4"
            >
              {info.logo && (
                <div className="w-24 h-24 rounded-2xl border-4 border-background shadow-lg overflow-hidden bg-card">
                  <img
                    src={info.logo}
                    alt={info.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {info.name}
                </h1>
                {info.tagline && (
                  <p className="text-muted-foreground mt-1 text-sm">{info.tagline}</p>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-2 mt-3">
                  {socialLinks.map((link) => {
                    const IconComponent = socialIcons[link.platform] || ExternalLink;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {info.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground text-sm"
              >
                {info.description}
              </motion.p>
            )}
          </div>
        </section>

        {/* Stats Section */}
        {sectionVisibility.stats && (
          <section className="px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="stat-card text-center p-4"
                >
                  <stat.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {sectionVisibility.categories && categories.length > 0 && (
          <section className="py-2">
            <CategoryScroll
              categories={categories}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </section>
        )}

        {/* Featured Film */}
        {sectionVisibility.featuredFilm && shopData.featuredFilm && (
          <section className="px-4 py-6">
            <h2 className="text-lg font-display font-bold mb-3">Featured Video</h2>
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
              <iframe
                src={shopData.featuredFilm.url}
                title={shopData.featuredFilm.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Gallery */}
        {sectionVisibility.gallery && gallery.length > 0 && (
          <section className="px-4 py-6">
            <h2 className="text-lg font-display font-bold mb-3">Gallery</h2>
            <GalleryGrid items={gallery} />
          </section>
        )}

        {/* Products */}
        {sectionVisibility.products && filteredProducts.length > 0 && (
          <section className="px-4 py-6">
            <h2 className="text-lg font-display font-bold mb-3">Products</h2>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsapp={contact.whatsapp}
                />
              ))}
            </div>
          </section>
        )}

        {/* Services */}
        {sectionVisibility.services && visibleServices.length > 0 && (
          <section className="px-4 py-6">
            <h2 className="text-lg font-display font-bold mb-3">Services</h2>
            <div className="grid grid-cols-1 gap-4">
              {visibleServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  whatsapp={contact.whatsapp}
                />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {sectionVisibility.testimonials && visibleTestimonials.length > 0 && (
          <section className="px-4 py-6">
            <h2 className="text-lg font-display font-bold mb-3">What Customers Say</h2>
            <div className="grid grid-cols-1 gap-4">
              {visibleTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {sectionVisibility.faq && visibleFaqs.length > 0 && (
          <section className="px-4 py-6">
            <h2 className="text-lg font-display font-bold mb-3">FAQ</h2>
            <Accordion type="single" collapsible className="w-full">
              {visibleFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-border">
                  <AccordionTrigger className="text-left py-4 text-sm font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600 dark:text-neutral-400 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Business Hours & Location */}
        {(sectionVisibility.businessHours || sectionVisibility.location) && (
          <section className="px-4 py-6">
            <div className="grid grid-cols-1 gap-6">
              {sectionVisibility.businessHours && (
                <BusinessHours hours={businessHours} />
              )}

              {sectionVisibility.location && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 border border-border/50"
                >
                  <h3 className="font-display font-semibold text-lg mb-4">Location</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {contact.address}<br />
                    {contact.city}, {contact.state} {contact.zipCode}<br />
                    {contact.country}
                  </p>
                  {contact.mapUrl && (
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Map
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Bottom Padding for Floating Bar */}
        <div className="h-28" />

        {/* Floating Action Bar */}
        <FloatingBar
          whatsapp={contact.whatsapp}
          phone={contact.primaryPhone}
          mapUrl={contact.mapUrl}
        />
      </div>
    </div>
  );
}
