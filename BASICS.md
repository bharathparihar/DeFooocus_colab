# B Catalogue Standard Operating Procedures (SOP)

## 1. Role Definitions
 - **Admin**: Super-user managing all sellers and platform-wide statistics.
 - **Seller**: Business owners managing their branding, products, services, and leads (Accessible via `/seller`).
 - **Buyer**: Public customers browsing the marketplace or dedicated catalogues.

## 2. Branding Guidelines
 - **Standard Name**: **B Catalogue** (strictly with the 'ue' suffix).
 - **Styling**: All custom component classes must use the `ec-` prefix. No inline styles.
 - **Aesthetics**: Premium, high-contrast, emerald-green tech theme. Glassmorphism and smooth micro-animations are standard.

## 3. Core UX Rules
 - **Dedicated Catalogue View**: When viewing a specific seller's link, all platform navigation (Marketplace search, Global login/signup, "Create your own" CTAs) must be hidden to provide a distraction-free branded experience.
 - **Persistence**: Data is persistent via LocalStorage in this version (based on `shoplink-creator-main` architecture).
