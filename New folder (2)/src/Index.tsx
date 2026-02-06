import React, { useState, useEffect } from 'react';

// --- TYPES ---
interface BusinessHours {
  [key: string]: { open: string; close: string; closed: boolean };
}

interface GalleryItem {
  id: string;
  url: string;
}

interface Category { id: string; name: string; imageUrl?: string; }

interface SEOConfig {
  title: string;
  description: string;
  image?: string;
}

interface PopupConfig {
  enabled: boolean;
  image?: string;
  text: string;
}

interface NFCRequest {
  id: number;
  name: string;
  address: string;
  qty: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface UserFeedback {
  id: number;
  text: string;
  date: string;
  status: 'new' | 'reviewed' | 'resolved';
}

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'new' | 'responded' | 'resolved' | 'archived';
  created_at: string;
}

interface Appointment {
  id: string;
  name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  service: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface ShopData {
  alias: string;
  stats: {
    clients: string;
    photos: string;
    rating: string;
    views: number;
    clicks: number;
  };
  info: {
    name: string;
    owner: string;
    tagline: string;
    description: string;
    jobTitle: string;
    occupation: string;
    dob: string;
  };
  branding: {
    logo: string;
    banner: string;
    bannerType: 'image' | 'video';
  };
  contact: {
    email: string;
    whatsapp: string;
    address: string;
    mapLink: string;
    alternatePhone?: string;
    alternateEmail?: string;
  };
  hours: BusinessHours;
  categories: Category[];
  gallery: GalleryItem[];
  products: { id: string; name: string; price: number; image: string; }[];
  services: { id: string; title: string; description: string; price: string; icon: string; imageUrl?: string; }[];
  testimonials: { id: string; name: string; comment: string; rating: number; imageUrl?: string; }[];
  faqs: { id: string; question: string; answer: string; }[];
  socials: Record<string, string>;
  advanced: {
    customCss: string;
    customJs: string;
    privacyPolicy: string;
    termsConditions: string;
    seo: SEOConfig;
    popup: PopupConfig;
    announcement: string;
    nfcRequests: NFCRequest[];
    feedbacks: UserFeedback[];
    isPaid: boolean;
    trialExtended: boolean;
    createdAt: string;
  };
  leads: {
    inquiries: Inquiry[];
    appointments: Appointment[];
  };
}

// --- MOCK DATA ---
const INITIAL_DATA: ShopData = {
  alias: "happy-frame-studios",
  stats: {
    clients: "250+",
    photos: "12k+",
    rating: "4.9",
    views: 1240,
    clicks: 450
  },
  info: {
    name: "Happy Frame Studios",
    owner: "Ranbir Dhaliwal",
    tagline: "Capturing Timeless Moments",
    description: "Pre-wedding, Wedding & Event Photography. We specialize in cinematic storytelling and artistic portraits. Every frame we capture tells a unique story of love and joy.",
    jobTitle: "Lead Photographer",
    occupation: "Cinematographer",
    dob: "1994-05-15"
  },
  branding: {
    logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=400&fit=crop",
    bannerType: 'image'
  },
  contact: {
    email: "hello@happyframe.com",
    whatsapp: "919914444007",
    address: "SCO 45, Second Floor, Sector 17, Chandigarh",
    mapLink: "https://goo.gl/maps/example",
    alternatePhone: "919876543210"
  },
  hours: {
    monday: { open: "09:00", close: "20:00", closed: false },
    tuesday: { open: "09:00", close: "20:00", closed: false },
    wednesday: { open: "09:00", close: "20:00", closed: false },
    thursday: { open: "09:00", close: "20:00", closed: false },
    friday: { open: "09:00", close: "20:00", closed: false },
    saturday: { open: "10:00", close: "18:00", closed: false },
    sunday: { open: "10:00", close: "14:00", closed: true }
  },
  categories: [
    { id: "1", name: "Wedding", imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=300&fit=crop" },
    { id: "2", name: "Pre-Wedding", imageUrl: "https://images.unsplash.com/photo-1519225495810-7512312285bb?w=300&h=300&fit=crop" }
  ],
  gallery: [
    { id: "1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop" },
    { id: "2", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop" }
  ],
  products: [
    { id: "1", name: "Wedding Album (Premium)", price: 15000, image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?w=300&h=300&fit=crop" },
    { id: "2", name: "Canvas Print (24x36)", price: 4500, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop" }
  ],
  services: [
    { id: "1", title: "Full Day Wedding", description: "Coverage from morning prep until late night party.", price: "85000", icon: "camera" },
    { id: "2", title: "Cinematic Reel", description: "30-second high quality reel for Instagram.", price: "5000", icon: "play" }
  ],
  testimonials: [
    { id: "1", name: "Amit & Priya", comment: "Ranbir captured our wedding beautifully! The cinematic film was breathtaking.", rating: 5 },
    { id: "2", name: "Sandeep Singh", comment: "Excellent professionalism and very creative shots.", rating: 5 }
  ],
  faqs: [
    { id: "1", question: "Do you travel for weddings?", answer: "Yes, we travel across India and internationally for destination weddings." }
  ],
  socials: {
    instagram: "https://instagram.com/happyframe",
    facebook: "https://facebook.com/happyframe"
  },
  advanced: {
    customCss: "",
    customJs: "",
    privacyPolicy: "We respect your privacy. Photos are used only with permission.",
    termsConditions: "50% advance to book dates.",
    seo: { title: "Happy Frame Studios | Best Wedding Photographer", description: "Expert cinematic wedding photography services." },
    popup: { enabled: true, text: "Special Offer: 10% off on Pre-wedding shoots this month!" },
    announcement: "🔥 Booking open for 2026 Wedding Season!",
    nfcRequests: [],
    feedbacks: [],
    isPaid: false,
    trialExtended: false,
    createdAt: new Date().toISOString()
  },
  leads: {
    inquiries: [
      { id: "1", name: "Rahul Verma", phone: "9876543210", email: "rahul@example.com", message: "Interested in a pre-wedding shoot.", status: 'new', created_at: new Date().toISOString() }
    ],
    appointments: [
      { id: "1", name: "Sneha Kapoor", phone: "9123456789", preferred_date: "2026-03-10", preferred_time: "11:00", service: "Meeting for Wedding Consultation", status: 'pending' }
    ]
  }
};

/**
 * CartChat Platform - Monolithic Single-File Architecture
 * Includes: Shop Logic, UI Components, and Custom Styles
 */

// --- CUSTOM CSS (Glassmorphism & Rich Aesthetics) ---
const STYLES = `
  :root {
    --primary: #6366f1;
    --primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(255, 255, 255, 0.3);
    --card-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    --text-main: #1f2937;
    --text-muted: #6b7280;
  }

  body {
    font-family: 'Outfit', 'Inter', sans-serif;
    background: #f8fafc;
    color: var(--text-main);
    overflow-x: hidden;
  }

  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: var(--card-shadow);
    transition: transform 0.3s ease;
  }

  .dashboard-sidebar {
    background: white;
    border-right: 1px solid #e5e7eb;
    height: 100vh;
    position: sticky;
    top: 0;
  }

  .nav-link-custom {
    color: var(--text-muted);
    padding: 12px 20px;
    border-radius: 12px;
    margin-bottom: 8px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    font-weight: 500;
  }

  .nav-link-custom.active {
    background: var(--primary-gradient);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .form-control-custom {
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 12px;
    font-size: 0.95rem;
  }

  .form-control-custom:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .nav-floating {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    height: 70px;
    z-index: 1000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
  }

  .tab-pane-animate {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Buyer Mode Specifics */
  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .animate-marquee {
    display: flex;
    animation: marquee 20s linear infinite;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const Index: React.FC = () => {
  const [mode, setMode] = useState<'seller' | 'buyer'>('seller');
  const [activeTab, setActiveTab] = useState<'profile' | 'content' | 'leads' | 'advanced'>('profile');
  const [shopData, setShopData] = useState<ShopData>(INITIAL_DATA);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);

    // Custom CSS Injection
    const customStyle = document.createElement("style");
    customStyle.id = "custom-shop-css";
    customStyle.innerText = shopData.advanced.customCss;
    document.head.appendChild(customStyle);

    // Custom JS Injection (Safe execution)
    if (shopData.advanced.customJs && mode === 'buyer') {
      try {
        const script = document.createElement("script");
        script.id = "custom-shop-js";
        script.text = shopData.advanced.customJs;
        document.head.appendChild(script);
      } catch (e) {
        console.error("Custom JS Error:", e);
      }
    }

    return () => { 
      document.head.removeChild(styleSheet);
      const cStyle = document.getElementById("custom-shop-css");
      if (cStyle) document.head.removeChild(cStyle);
      const cScript = document.getElementById("custom-shop-js");
      if (cScript) document.head.removeChild(cScript);
    };
  }, [shopData.advanced.customCss, shopData.advanced.customJs, mode]);

  const updateData = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...shopData } as any;
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setShopData(newData);
  };

  if (mode === 'buyer') {
    const isClosed = shopData.hours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()].closed;

    return (
      <div className="buyer-storefront min-vh-100 bg-white position-relative">
        {/* Welcome Popup */}
        {shopData.advanced.popup.enabled && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered mx-4">
              <div className="modal-content border-0 rounded-5 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="modal-body p-5 text-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                    <i className="bi bi-stars text-primary h1 m-0"></i>
                  </div>
                  <h3 className="fw-bold mb-3">Welcome to {shopData.info.name}</h3>
                  <p className="text-muted mb-4">{shopData.advanced.popup.text}</p>
                  <button
                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold"
                    onClick={() => updateData('advanced.popup.enabled', false)}
                  >
                    CONTINUE TO SHOP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcement */}
        {shopData.advanced.announcement && (
          <div className="bg-primary text-white py-2 overflow-hidden position-sticky top-0 z-3 shadow-sm">
            <div className="container-fluid px-0">
              <div className="d-flex animate-marquee whitespace-nowrap align-items-center">
                <span className="px-4 fw-bold small text-uppercase tracking-wider">{shopData.advanced.announcement}</span>
                <span className="px-4 fw-bold small text-uppercase tracking-wider">★</span>
                <span className="px-4 fw-bold small text-uppercase tracking-wider">{shopData.advanced.announcement}</span>
                <span className="px-4 fw-bold small text-uppercase tracking-wider">★</span>
                <span className="px-4 fw-bold small text-uppercase tracking-wider">{shopData.advanced.announcement}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setMode('seller')}
          className="btn btn-dark btn-sm position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3 shadow-lg rounded-pill px-4"
          style={{ backdropFilter: 'blur(8px)', opacity: 0.9 }}
        >
          <i className="bi bi-pencil-square me-2"></i>Edit Shop
        </button>

        {/* Main Storefront Body (Mobile Mockup) */}
        <div className="mx-auto bg-white shadow-lg position-relative overflow-hidden" style={{ maxWidth: '480px', minHeight: '100vh' }}>
          {/* Hero Section */}
          <section className="position-relative">
            <div className="ratio ratio-16x9">
              <img src={shopData.branding.banner} className="object-fit-cover w-100" />
            </div>
            <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-black text-white">
              <div className="d-flex align-items-end gap-3">
                <div className="bg-white p-1 rounded-circle shadow" style={{ width: '80px', height: '80px' }}>
                  <img src={shopData.branding.logo} className="w-100 h-100 rounded-circle object-fit-cover" />
                </div>
                <div className="flex-grow-1 pb-1">
                  <h4 className="fw-bold mb-0">{shopData.info.name}</h4>
                  <div className="d-flex align-items-center gap-2 small opacity-75">
                    <span className={`badge rounded-pill ${isClosed ? 'bg-danger' : 'bg-success'}`}>
                      {isClosed ? 'Closed' : 'Open Now'}
                    </span>
                    <span>• {shopData.stats.rating} Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <div className="p-4 d-flex justify-content-between text-center bg-light border-bottom">
            <a href={`tel:${shopData.contact.whatsapp}`} className="text-decoration-none text-dark flex-grow-1">
              <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-2"><i className="bi bi-telephone text-primary h5 m-0"></i></div>
              <div className="small fw-bold">Call</div>
            </a>
            <a href={`https://wa.me/${shopData.contact.whatsapp}`} className="text-decoration-none text-dark flex-grow-1">
              <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-2"><i className="bi bi-whatsapp text-success h5 m-0"></i></div>
              <div className="small fw-bold">WhatsApp</div>
            </a>
            <div className="text-decoration-none text-dark flex-grow-1 cursor-pointer" onClick={() => alert("Catalog requested!")}>
              <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-2"><i className="bi bi-journal-text text-warning h5 m-0"></i></div>
              <div className="small fw-bold">Catalog</div>
            </div>
            <div className="text-decoration-none text-dark flex-grow-1 cursor-pointer" onClick={() => navigator.share({ title: shopData.info.name, url: window.location.href })}>
              <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-2"><i className="bi bi-share text-info h5 m-0"></i></div>
              <div className="small fw-bold">Share</div>
            </div>
          </div>

          <div className="p-4">
            {/* Tagline & Description */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">About Us</h5>
              <p className="text-muted small leading-relaxed">{shopData.info.description}</p>
            </div>

            {/* Categories (Horizontal) */}
            <div className="mb-5 overflow-hidden">
              <h5 className="fw-bold mb-3">Collections</h5>
              <div className="d-flex gap-3 overflow-auto pb-3 no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
                {shopData.categories.map(cat => (
                  <div key={cat.id} className="text-center" style={{ minWidth: '80px', scrollSnapAlign: 'start' }}>
                    <div className="ratio ratio-1x1 rounded-circle overflow-hidden mb-2 border shadow-sm">
                      <img src={cat.imageUrl || 'https://via.placeholder.com/150'} className="object-fit-cover" />
                    </div>
                    <div className="small fw-bold text-truncate" style={{ width: '80px' }}>{cat.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products (2-column Grid) */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">Our Products</h5>
              <div className="row g-3">
                {shopData.products.map(prod => (
                  <div key={prod.id} className="col-6">
                    <div className="card border-0 glass-card h-100 shadow-sm overflow-hidden">
                      <div className="ratio ratio-1x1 bg-light">
                        <img src={prod.image} className="object-fit-cover" />
                      </div>
                      <div className="card-body p-3">
                        <h6 className="fw-bold small mb-1 text-truncate">{prod.name}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-primary fw-bold small">₹{prod.price}</span>
                          <button
                            className="btn btn-sm btn-link p-0 text-success"
                            onClick={() => window.open(`https://wa.me/${shopData.contact.whatsapp}?text=Hi, I'm interested in ${prod.name}`)}
                          >
                            <i className="bi bi-whatsapp"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            {shopData.services.length > 0 && (
              <div className="mb-5">
                <h5 className="fw-bold mb-3">Special Services</h5>
                <div className="d-flex flex-column gap-3">
                  {shopData.services.map(svc => (
                    <div key={svc.id} className="p-3 bg-light rounded-4 border d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <i className={`bi bi-${svc.icon || 'star'} text-primary h5 m-0`}></i>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h6 className="fw-bold mb-1 small">{svc.title}</h6>
                        <p className="text-muted small mb-0 text-truncate">{svc.description}</p>
                      </div>
                      {svc.price && <div className="fw-bold text-primary small">₹{svc.price}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">Moments Gallery</h5>
              <div className="row g-2">
                {shopData.gallery.map(item => (
                  <div key={item.id} className="col-4">
                    <div className="ratio ratio-1x1 border rounded overflow-hidden shadow-sm">
                      <img src={item.url} className="object-fit-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries / Leads Form */}
            <div className="glass-card p-4 mb-5 border-primary bg-primary bg-opacity-5">
              <h5 className="fw-bold mb-3 text-center">Inquire Now</h5>
              <div className="mb-3">
                <input type="text" className="form-control form-control-custom" placeholder="Your Name" />
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control form-control-custom" placeholder="WhatsApp Number" />
              </div>
              <div className="mb-3">
                <textarea className="form-control form-control-custom" rows={3} placeholder="How can we help?"></textarea>
              </div>
              <button
                className="btn btn-primary w-100 rounded-pill py-2 shadow-sm fw-bold"
                onClick={() => alert("Thank you! We will contact you soon.")}
              >
                SEND REQUEST
              </button>
            </div>

            {/* Footer / Socials */}
            <div className="py-5 text-center border-top">
              <div className="d-flex justify-content-center gap-4 h3 mb-4 opacity-75">
                {shopData.socials.instagram && <i className="bi bi-instagram cursor-pointer"></i>}
                {shopData.socials.facebook && <i className="bi bi-facebook cursor-pointer"></i>}
                <i className="bi bi-youtube cursor-pointer"></i>
                <i className="bi bi-linkedin cursor-pointer"></i>
              </div>
              <p className="text-muted small mb-2">Powered by CartChat Platform</p>
              <div className="d-flex justify-content-center gap-3 small text-muted">
                <span className="cursor-pointer hover:underline">Privacy</span>
                <span className="cursor-pointer hover:underline">Terms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-md-row bg-light">
      {/* SIDEBAR / NAV */}
      <div className="col-12 col-md-3 col-lg-2 dashboard-sidebar d-flex flex-column p-3">
        <div className="mb-4 d-flex align-items-center gap-2 px-2">
          <div className="bg-primary rounded-pill p-2 text-white">
            <i className="bi bi-cart-dash-fill h5 m-0"></i>
          </div>
          <span className="fw-bold h5 mb-0">CartChat</span>
        </div>

        <nav className="flex-grow-1">
          <button
            className={`w-100 text-start border-0 nav-link-custom ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-circle"></i> Profile
          </button>
          <button
            className={`w-100 text-start border-0 nav-link-custom ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <i className="bi bi-grid-1x2-fill"></i> Content
          </button>
          <button
            className={`w-100 text-start border-0 nav-link-custom ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <i className="bi bi-chat-dots-fill"></i> Leads
          </button>
          <button
            className={`w-100 text-start border-0 nav-link-custom ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            <i className="bi bi-sliders"></i> Advanced
          </button>
        </nav>

        <div className="mt-auto border-top pt-3">
          <button
            onClick={() => setMode('buyer')}
            className="btn btn-outline-primary w-100 rounded-pill mb-2"
          >
            <i className="bi bi-eye"></i> View Shop
          </button>
          <button className="btn btn-light w-100 rounded-pill text-danger small">
            <i className="bi bi-power"></i> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="col-12 col-md-9 col-lg-10 p-3 p-md-4 overflow-auto">
        <div className="max-width-900 mx-auto">
          <header className="mb-4 d-flex justify-content-between align-items-end">
            <div>
              <h2 className="fw-bold mb-1">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
              </h2>
              <p className="text-muted small m-0">Manage your shop's {activeTab} information</p>
            </div>
            <div className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill border border-success border-opacity-25">
              <i className="bi bi-cloud-check-fill me-1"></i> Autosaved
            </div>
          </header>

          <div className="tab-content tab-pane-animate">
            {activeTab === 'profile' && (
              <div className="row g-4">
                {/* Status Stats */}
                <section className="col-12">
                  <div className="glass-card p-4">
                    <h5 className="fw-bold mb-3"><i className="bi bi-bar-chart-fill text-primary me-2"></i>Shop Statistics</h5>
                    <div className="row g-3">
                      <div className="col-4">
                        <label className="small text-muted mb-1">Total Clients</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.stats.clients}
                          onChange={(e) => updateData('stats.clients', e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <label className="small text-muted mb-1">Photo count</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.stats.photos}
                          onChange={(e) => updateData('stats.photos', e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <label className="small text-muted mb-1">Star Rating</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.stats.rating}
                          onChange={(e) => updateData('stats.rating', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Shop Info */}
                <section className="col-12 col-lg-8">
                  <div className="glass-card p-4 h-100">
                    <h5 className="fw-bold mb-3"><i className="bi bi-info-circle-fill text-primary me-2"></i>Core Identity</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="small text-muted mb-1">Shop Name</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.info.name}
                          onChange={(e) => updateData('info.name', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small text-muted mb-1">Owner Name</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.info.owner}
                          onChange={(e) => updateData('info.owner', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small text-muted mb-1">Tagline</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.info.tagline}
                          onChange={(e) => updateData('info.tagline', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small text-muted mb-1">Description</label>
                        <textarea
                          className="form-control form-control-custom"
                          rows={3}
                          value={shopData.info.description}
                          onChange={(e) => updateData('info.description', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Alias / URL */}
                <section className="col-12 col-lg-4">
                  <div className="glass-card p-4 border-primary border-opacity-25 shadow-sm">
                    <h5 className="fw-bold mb-3"><i className="bi bi-link-45deg text-primary me-2"></i>URL Alias</h5>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 small">cartchat.in/v/</span>
                      <input
                        type="text"
                        className="form-control form-control-custom border-start-0"
                        value={shopData.alias}
                        onChange={(e) => updateData('alias', e.target.value)}
                      />
                    </div>
                    <p className="small text-muted mt-2 m-0 mt-3 p-2 bg-light rounded border">
                      This is your public link. Share it with clients to showcase your catalog.
                    </p>
                  </div>
                </section>

                {/* Personal Info */}
                <section className="col-12 col-md-6">
                  <div className="glass-card p-4 h-100">
                    <h5 className="fw-bold mb-3"><i className="bi bi-person-badge-fill text-primary me-2"></i>Personal Info</h5>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="small text-muted mb-1">Job Title / Designation</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.info.jobTitle}
                          onChange={(e) => updateData('info.jobTitle', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small text-muted mb-1">Occupation</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.info.occupation}
                          onChange={(e) => updateData('info.occupation', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small text-muted mb-1">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control form-control-custom"
                          value={shopData.info.dob}
                          onChange={(e) => updateData('info.dob', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Branding */}
                <section className="col-12 col-md-6">
                  <div className="glass-card p-4 h-100">
                    <h5 className="fw-bold mb-3"><i className="bi bi-palette-fill text-primary me-2"></i>Branding</h5>
                    <div className="mb-3">
                      <label className="small text-muted mb-1 d-block">Shop Logo (Favicon)</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-light rounded border d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                          {shopData.branding.logo ? <img src={shopData.branding.logo} className="img-fluid rounded" /> : <i className="bi bi-image text-muted h4 m-0"></i>}
                        </div>
                        <button className="btn btn-sm btn-light border rounded-pill">Upload Logo</button>
                      </div>
                    </div>
                    <div>
                      <label className="small text-muted mb-1 d-block">Shop Banner (Image/Video)</label>
                      <div className="bg-light rounded border mb-2 overflow-hidden position-relative" style={{ height: '100px' }}>
                        <img src={shopData.branding.banner} className="w-100 h-100 object-fit-cover" />
                        <div className="position-absolute top-0 end-0 p-2">
                          <span className="badge bg-dark rounded-pill small">JPG</span>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-light border rounded-pill flex-grow-1">Change Banner</button>
                        <select
                          className="form-select form-select-sm border rounded-pill w-auto"
                          value={shopData.branding.bannerType}
                          onChange={(e) => updateData('branding.bannerType', e.target.value)}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Hub */}
                <section className="col-12 col-lg-7">
                  <div className="glass-card p-4 h-100">
                    <h5 className="fw-bold mb-3"><i className="bi bi-telephone-fill text-primary me-2"></i>Contact Hub</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="small text-muted mb-1">Primary Email</label>
                        <input
                          type="email"
                          className="form-control form-control-custom"
                          value={shopData.contact.email}
                          onChange={(e) => updateData('contact.email', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small text-muted mb-1">WhatsApp Number</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.contact.whatsapp}
                          onChange={(e) => updateData('contact.whatsapp', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small text-muted mb-1">Physical Address</label>
                        <textarea
                          className="form-control form-control-custom"
                          rows={2}
                          value={shopData.contact.address}
                          onChange={(e) => updateData('contact.address', e.target.value)}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label className="small text-muted mb-1">Google Maps Link</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          placeholder="https://maps.google.com/..."
                          value={shopData.contact.mapLink}
                          onChange={(e) => updateData('contact.mapLink', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Business Hours */}
                <section className="col-12 col-lg-5">
                  <div className="glass-card p-4 h-100">
                    <h5 className="fw-bold mb-3"><i className="bi bi-clock-fill text-primary me-2"></i>Business Hours</h5>
                    <div className="d-flex flex-column gap-2">
                      {Object.entries(shopData.hours).map(([day, hrs]) => (
                        <div key={day} className="d-flex align-items-center gap-2 border-bottom pb-2">
                          <span className="text-capitalize small fw-bold" style={{ width: '80px' }}>{day}</span>
                          <div className="d-flex align-items-center gap-1 flex-grow-1">
                            <input
                              type="time"
                              className="form-control form-control-sm border-0 bg-light rounded-pill px-2"
                              disabled={hrs.closed}
                              value={hrs.open}
                              onChange={(e) => updateData(`hours.${day}.open`, e.target.value)}
                            />
                            <span className="small text-muted">-</span>
                            <input
                              type="time"
                              className="form-control form-control-sm border-0 bg-light rounded-pill px-2"
                              disabled={hrs.closed}
                              value={hrs.close}
                              onChange={(e) => updateData(`hours.${day}.close`, e.target.value)}
                            />
                          </div>
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!hrs.closed}
                              onChange={() => updateData(`hours.${day}.closed`, !hrs.closed)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="row g-4">
                {/* Categories */}
                <section className="col-12">
                  <div className="glass-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold m-0"><i className="bi bi-tags-fill text-primary me-2"></i>Categories (Max 6)</h5>
                      <button className="btn btn-sm btn-primary rounded-pill px-3" disabled={shopData.categories.length >= 6}>+ Add</button>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      {shopData.categories.map((cat) => (
                        <div key={cat.id} className="bg-light p-2 px-3 rounded-pill border d-flex align-items-center gap-2">
                          <span className="small fw-bold">{cat.name}</span>
                          <button className="btn btn-sm btn-link p-0 text-danger"><i className="bi bi-x-circle"></i></button>
                        </div>
                      ))}
                      {shopData.categories.length === 0 && <p className="text-muted small m-0">No categories added yet.</p>}
                    </div>
                  </div>
                </section>

                {/* Gallery */}
                <section className="col-12 col-md-6">
                  <div className="glass-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold m-0"><i className="bi bi-images text-primary me-2"></i>Gallery (Max 9)</h5>
                      <button className="btn btn-sm btn-light border rounded-pill" disabled={shopData.gallery.length >= 9}>Upload</button>
                    </div>
                    <div className="row g-2">
                      {shopData.gallery.map((item) => (
                        <div key={item.id} className="col-4">
                          <div className="bg-light rounded border overflow-hidden position-relative ratio ratio-1x1 shadow-sm">
                            <img src={item.url} className="object-fit-cover w-100 h-100" />
                            <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1 leading-none" style={{ fontSize: '10px' }}><i className="bi bi-trash"></i></button>
                          </div>
                        </div>
                      ))}
                      {[...Array(Math.max(0, 9 - shopData.gallery.length))].map((_, i) => (
                        <div key={i} className="col-4">
                          <div className="bg-light rounded border border-dashed d-flex align-items-center justify-content-center ratio ratio-1x1">
                            <i className="bi bi-plus h4 text-muted m-0"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Products */}
                <section className="col-12 col-md-6">
                  <div className="glass-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold m-0"><i className="bi bi-bag-check-fill text-primary me-2"></i>Products (Max 8)</h5>
                      <button className="btn btn-sm btn-light border rounded-pill" disabled={shopData.products.length >= 8}>Add Product</button>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {shopData.products.map((prod) => (
                        <div key={prod.id} className="bg-light p-2 rounded border d-flex align-items-center gap-3">
                          <img src={prod.image} className="rounded object-fit-cover shadow-sm" style={{ width: '45px', height: '45px' }} />
                          <div className="flex-grow-1 overflow-hidden">
                            <h6 className="small fw-bold m-0 text-truncate">{prod.name}</h6>
                            <span className="small text-primary">₹{prod.price}</span>
                          </div>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-light border p-1 rounded-circle px-2"><i className="bi bi-pencil small"></i></button>
                            <button className="btn btn-sm btn-light border p-1 rounded-circle px-2 text-danger"><i className="bi bi-trash small"></i></button>
                          </div>
                        </div>
                      ))}
                      {shopData.products.length === 0 && <p className="text-muted small m-0 py-3 text-center">Your catalog is empty.</p>}
                    </div>
                  </div>
                </section>

                {/* YouTube Link */}
                <section className="col-12">
                  <div className="glass-card p-4">
                    <h5 className="fw-bold mb-3"><i className="bi bi-youtube text-danger me-2"></i>Featured Film (YouTube)</h5>
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control form-control-custom border-start-0" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div className="bg-light rounded border border-dashed ratio ratio-16x9 d-flex align-items-center justify-content-center">
                      <span className="text-muted small">YouTube Preview will appear here</span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h6 className="text-secondary text-uppercase fw-bold small mb-2">Total Inquiries</h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="mb-0 fw-bold">{shopData.leads.inquiries.length}</h2>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3">
                          {shopData.leads.inquiries.filter(i => i.status === 'new').length} New
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h6 className="text-secondary text-uppercase fw-bold small mb-2">Appointments</h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="mb-0 fw-bold">{shopData.leads.appointments.length}</h2>
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">
                          {shopData.leads.appointments.filter(a => a.status === 'pending').length} Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="fw-bold mb-0">Recent Inquiries</h5>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">View All</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr className="small text-secondary">
                          <th>CLIENT</th>
                          <th>MESSAGE</th>
                          <th>STATUS</th>
                          <th>DATE</th>
                          <th className="text-end">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopData.leads.inquiries.map(inq => (
                          <tr key={inq.id}>
                            <td>
                              <div className="fw-bold">{inq.name}</div>
                              <div className="small text-muted">{inq.phone}</div>
                            </td>
                            <td><div className="text-truncate" style={{ maxWidth: '200px' }}>{inq.message}</div></td>
                            <td>
                              <select
                                className="form-select form-select-sm rounded-pill border-0 bg-light px-3"
                                value={inq.status}
                                onChange={(e) => {
                                  const newInq = shopData.leads.inquiries.map(i => i.id === inq.id ? { ...i, status: e.target.value as any } : i);
                                  updateData('leads', { ...shopData.leads, inquiries: newInq });
                                }}
                              >
                                <option value="new">New</option>
                                <option value="responded">Responded</option>
                                <option value="resolved">Resolved</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="small text-muted">{new Date(inq.created_at).toLocaleDateString()}</td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-light rounded-circle text-primary me-2"><i className="bi bi-chat-dots"></i></button>
                              <button className="btn btn-sm btn-light rounded-circle text-danger"><i className="bi bi-trash"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h5 className="fw-bold mb-4">Upcoming Appointments</h5>
                  <div className="row g-3">
                    {shopData.leads.appointments.map(appt => (
                      <div className="col-md-6" key={appt.id}>
                        <div className="p-3 border rounded-4 bg-light bg-opacity-50">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="fw-bold">{appt.name}</div>
                            <span className={`badge rounded-pill px-3 ${appt.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                              {appt.status}
                            </span>
                          </div>
                          <div className="small text-muted mb-2">
                            <i className="bi bi-calendar-event me-2"></i>{appt.preferred_date} at {appt.preferred_time}
                          </div>
                          <div className="small text-primary fw-bold mb-3">{appt.service}</div>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-pill w-100">Confirm</button>
                            <button className="btn btn-sm btn-outline-danger rounded-pill w-100">Cancel</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-card p-4 mb-4">
                  <h5 className="fw-bold mb-4">Analytics & Stats</h5>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div className="p-3 border rounded-4 text-center">
                        <h6 className="text-muted small text-uppercase mb-1">Total Views</h6>
                        <h3 className="fw-bold mb-0">{shopData.stats.views}</h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 border rounded-4 text-center">
                        <h6 className="text-muted small text-uppercase mb-1">Total Clicks</h6>
                        <h3 className="fw-bold mb-0">{shopData.stats.clicks}</h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 border rounded-4 text-center">
                        <h6 className="text-muted small text-uppercase mb-1">CTR</h6>
                        <h3 className="fw-bold mb-0 text-primary">{((shopData.stats.clicks / (shopData.stats.views || 1)) * 100).toFixed(1)}%</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 text-center bg-light rounded-4 border-dashed border">
                    <i className="bi bi-graph-up text-primary display-4 mb-3 opacity-25"></i>
                    <p className="text-muted">Real-time engagement charts will appear here as more data is collected.</p>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h5 className="fw-bold mb-4">SEO Settings</h5>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Meta Title</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          value={shopData.advanced.seo.title}
                          onChange={(e) => updateData('advanced.seo.title', e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Meta Description</label>
                        <textarea
                          className="form-control form-control-custom"
                          rows={3}
                          value={shopData.advanced.seo.description}
                          onChange={(e) => updateData('advanced.seo.description', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h5 className="fw-bold mb-4">Custom Code Injection</h5>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Custom CSS</label>
                        <textarea
                          className="form-control form-control-custom font-monospace small"
                          rows={3}
                          placeholder=".my-class { color: red; }"
                          value={shopData.advanced.customCss}
                          onChange={(e) => updateData('advanced.customCss', e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Custom Head JS</label>
                        <textarea
                          className="form-control form-control-custom font-monospace small"
                          rows={3}
                          placeholder="console.log('Hello');"
                          value={shopData.advanced.customJs}
                          onChange={(e) => updateData('advanced.customJs', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 mb-4">
                  <h5 className="fw-bold mb-3"><i className="bi bi-hdd-stack-fill text-primary me-2"></i>Server Usage</h5>
                  <div className="progress mb-2" style={{ height: '10px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '9%' }}></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>4.5 MB used</span>
                    <span>50 MB limit</span>
                  </div>
                </div>

                <div className="glass-card p-4 border-danger bg-danger bg-opacity-10 mb-5">
                  <h5 className="fw-bold text-danger mb-4">Danger Zone</h5>
                  <div className="d-flex flex-wrap gap-3">
                    <button
                      className="btn btn-outline-danger rounded-pill px-4"
                      onClick={() => { if (confirm("Reset all shop content?")) setShopData(INITIAL_DATA); }}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Content
                    </button>
                    <button className="btn btn-danger rounded-pill px-4">
                      <i className="bi bi-trash me-2"></i>Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;