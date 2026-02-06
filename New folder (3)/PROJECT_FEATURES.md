# PROJECT FEATURES: CartChat Platform

This document provides a unified overview of all capabilities within the CartChat platform, covering both the **Seller Dashboard** and the **Buyer Catalog**.

---

## 1. SELLER DASHBOARD (Managing the Shop)
The Seller Dashboard is the control center where business owners design their brand, manage content, and track customer interactions.

### A. Core Identity & Branding
- **Shop Info**: Manage Shop Name, Tagline, Description, and personal professional details.
- **Branding**: Upload **Logos** (Favicon) and **Banners** (Supports JPG/PNG/WebP and **MP4 Videos**).
- **Contact Hub**: Configure primary/alternate emails, phone numbers, and WhatsApp integration.
- **Business Hours**: Micro-management of opening/closing times throughout the week.
- **URL Alias**: Set a custom, human-readable slug (e.g., `cartchat.in/v/my-shop`).

### B. Content & Catalog Management
- **Smart Categories**: Organize offerings into a sleek, scrollable carousel (Max 6).
- **Dynamic Gallery**: Upload image or **video** portfolios in 1:1 square format (Max 9).
- **Featured Film**: Full-width cinematic YouTube embed for brand storytelling.
- **Products Catalog**: Manage items with images/videos, dynamic pricing, and inventory status (Max 8).
- **Services List**: Detailed breakdown of professional offerings with rich descriptions (Max 9).

### C. Leads & CRM
- **Inquiry Management**: Browse customer messages with a dynamic status loop (`New` → `Responded` → `Resolved`).
- **Appointment Booking**: Manage a schedule of pending and confirmed service requests.
- **Support History**: Track physical card orders (NFC/PVC) and feedback submissions in one place.

### D. Advanced Power Tools
- **Analytics & Metrics**: Visual Line/Area charts for Views vs. Clicks and auto-calculated **CTR**.
- **Server Quota**: Real-time progress bar monitoring media storage (Images ~0.5MB, Videos ~5MB) with a 50MB hard limit.
- **SEO & Social**: Meta Title/Description optimization and custom Social Share Image management.
- **Interaction Rules**: Toggle section visibility with a single click (Eye Icon) and inject custom CSS/JS.
- **Danger Zone**: One-tap tools for **Resetting Content** or **Deleting the Account** permanently.

---

## 2. BUYER CATALOG (Customer Experience)
The Buyer Catalog is a mobile-first, high-performance storefront designed to convert visitors into customers.

### A. First Impressions
- **Welcome Popup**: Interactive full-screen greeting with custom branding on first visit.
- **Announcement Bar**: High-visibility fixed updates for sales or important news.
- **Floating Actions**: Persistent glassmorphism bar for **Instant Call**, **WhatsApp Chat**, and **Navigation**.
- **PWA Ready**: "Install App" capability for Android and iOS home screen access.

### B. Browsing & Trust
- **Premium Grid**: Products and services displayed in a high-density, **2-column Mobile Layout**.
- **Live Status**: Real-time indicator showing if the shop is currently "Open" or "Closed".
- **Social Proof**: Integrated Testimonial sliders and live feeds from Instagram, Facebook, and YouTube.
- **Interactive Search**: Character-by-character search to find products or services instantly.
- **Visual Maps**: Seamless Google Maps integration for one-click physical navigation.

### C. Conversions & Sharing
- **WhatsApp Commerce**: "Order Now" buttons generate pre-filled chat messages with item details.
- **Catalog Requests**: One-tap button for customers to request a full PDF price list via WhatsApp.
- **SEO Optimized**: Lightning-fast load times with structured data for maximum Google visibility.
- **Social Cards**: Custom branding automatically appears when the storefront link is shared on social media.

---

## 3. DEVELOPER GUIDELINES (Coding Standards)
To maintain the platform's speed and portability, developers must follow these architectural rules:

- **Single-File Architecture**: All core shop logic, UI components, and styles should be contained within a single main file (e.g., `Index.tsx`) to ensure zero-dependency portability and easier maintenance by AI agents.
- **Inlined CSS**: Use utility classes (Tailwind) or scoped Vanilla CSS within the same file. Avoid external `.css` files unless they are global base styles.
- **Modular Hooks**: Business logic that can be reused (like `useLeads`) should be extracted into the `src/hooks/` directory, but kept as lean as possible.

---

> [!IMPORTANT]
> This platform is optimized for speed and conversion. Sellers are encouraged to keep their total media usage under the **50MB quota** to ensure the best possible experience for buyers on mobile networks.