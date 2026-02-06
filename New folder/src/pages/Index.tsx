import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Store, Users, Zap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="section-container py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Your Business,{' '}
              <span className="text-gradient">One Link Away</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create a stunning digital catalog for your products and services. 
              Share via WhatsApp, accept orders, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="btn-accent gap-2 w-full sm:w-auto">
                  Open Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/shop/artisan-crafts">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  View Demo Catalog
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Store, title: 'Digital Storefront', desc: 'Beautiful catalog for your products & services' },
            { icon: MessageCircle, title: 'WhatsApp Commerce', desc: 'One-click ordering via WhatsApp' },
            { icon: Users, title: 'Lead Management', desc: 'Track inquiries and appointments' },
            { icon: Zap, title: 'Instant Updates', desc: 'Real-time preview and publishing' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="dashboard-card text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
