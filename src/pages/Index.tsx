import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Globe, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center ec-shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">
                B Catalogue
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Benefits
              </a>
              <Link to="/auth/seller">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />

        {/* Animated blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6 md:mb-8">
              <span className="text-emerald-600 font-semibold text-sm">
                ✨ Welcome to B Catalogue
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-tight">
              Create Your Premium{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                Digital Catalog
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
              Build beautiful digital catalogs with WhatsApp commerce integration.
              Showcase your products and services with premium templates designed
              for modern businesses.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/seller">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 px-8 py-6 text-base"
                >
                  Create Your Catalog
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/shop/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-base"
                >
                  View Demo
                  <Globe className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  100%
                </div>
                <div className="text-sm text-gray-600 mt-2">Customizable</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  Free
                </div>
                <div className="text-sm text-gray-600 mt-2">Forever</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  1-Click
                </div>
                <div className="text-sm text-gray-600 mt-2">Deploy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-white border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to create the perfect digital storefront
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description:
                  "Optimized performance means faster load times and better customer engagement",
              },
              {
                icon: <ShoppingBag className="w-8 h-8" />,
                title: "E-Commerce Ready",
                description:
                  "WhatsApp integration and inquiry forms to convert visitors into customers",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Share Anywhere",
                description:
                  "Share your catalog link on social media, WhatsApp, or embed it on your website",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Launch Your Catalog?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of businesses showcasing their products beautifully
          </p>
          <Link to="/auth/seller">
            <Button
              size="lg"
              className="gap-2 bg-white text-emerald-600 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 px-8 py-6 text-base font-semibold"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">B Catalogue</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 B Catalogue. Built with precision and style.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
