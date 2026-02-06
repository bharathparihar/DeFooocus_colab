# B Catalog - Project Tasks

This checklist tracks the implementation status of features defined in `SELLER_FEATURES.md` and `BUYER_FEATURES.md`.

## 1. Project Setup & Core
- [x] **Infrastructure**
    - [x] Initialize Vite + React + TypeScript project
    - [x] Configure Tailwind CSS
    - [x] Install shadcn-ui components
    - [x] Set up Routing (Buyer vs Seller routes)

## 2. Seller Dashboard Features

### Profile Tab
- [x] **Share Shop**: Custom Alias logic, QR Code generation, Copy Link
- [x] **Welcome Popup**: Configuration UI
- [x] **Announcement Banner**: Configuration UI
- [x] **Shop Info**:
    - [x] Core details (Name, Owner, Tagline, Desc)
    - [x] Personal details (Job, DOB, etc.)
- [x] **Branding**: Logo and Banner management (Static Images + Banner Video)
- [x] **Contact Details**: 
    - [x] Primary & Alternate Contact inputs
    - [x] Location/Address management
- [x] **Business Hours**: Logic for Opening/Closing times per day
- [x] **Social Links**: 
    - [x] Social Media Predefined Icons
    - [x] Custom Links (Label + URL)

### Content Tab
- [x] **Categories**: Management (Max 6)
- [x] **Gallery**: Image uploads (Max 8-9)
- [x] **Featured Film**: Youtube Embed (Upload removed)
- [x] **Products**: 
    - [x] CRUD operations
    - [x] Image support (Video removed)
    - [x] Status (Ready/Made-to-order) toggle
- [x] **Services**:
    - [x] CRUD operations (Max 9)
    - [x] Image support (Video removed)
    - [x] Status (Ready/Made-to-order) toggle
- [x] **Testimonials**: Review management
- [x] **FAQ**: Management
- [x] **Social Embeds**: Configuration

### Leads Tab
- [x] **Inquiries**: 
    - [x] View list (Badge for 'Today')
    - [x] Mark Responded / Delete actions
- [x] **Appointments**: 
    - [x] View requests
    - [x] Schedule tracking
    - [x] Mark Responded / Delete actions

### WhatsApp Commerce
- [x] **One-Click Ordering**: Generate WhatsApp message for products
- [x] **PDF Catalog**:
    - [x] PDF Generation logic (Product list)
    - [ ] WhatsApp Request button (Need to verify)
- [x] **Direct Support**: Floating WhatsApp chat button
- [x] **Share Logic**: Product specific WhatsApp links

### Dashboard Power Tools
- [x] **Instant Live Preview**: Toggle Seller/Buyer mode
- [x] **Section Visibility**: "Eye Icon" toggle implementation
- [x] **Real-Time Updates**: Immediate save/publish logic
- [x] **QR Code Generator**: Downloadable high-res QR

### Advanced Tab
- [x] **Analytics**: View Views, Clicks, CTR (Partial implementation?)
- [x] **Server Usage**: Quota monitoring
- [x] **Custom Code**: CSS/JS injection inputs
- [x] **SEO Settings**: Meta tags, Title, Share Image
- [x] **Legal Compliance**:
    - [x] Privacy Policy input
    - [x] Terms & Conditions input
- [x] **Support & Services**:
    - [x] NFC/PVC Order from Super admin
    - [x] Feedback Form for super admin
- [x] **Danger Zone**: Reset Shop and Delete Account logic

## 3. Buyer Catalog Features

### Essentials & Navigation
- [x] **Welcome Popup**: Display on first visit
- [x] **Announcement Bar**: Scrolling marquee
- [x] **Banner & Logo**: Header display
- [x] **Floating Bottom Bar**: Sticky actions (Call, WA, Map)
- [x] **Navigation Menu**: Routing links

### Shop Content Display
- [x] **Stats Section**: Display trusted signals
- [x] **Categories**: Horizontal scroll component
- [x] **Featured Film**: Video player (YouTube only)
- [x] **Gallery Grid**: Image display (Video removed)
- [x] **Social Embeds**: Iframe/Embed rendering
- [x] **Business Hours**: Open/Closed indicator
- [x] **Location**: Map integration

### Products & Services Display
- [x] **Product Grid**: 
    - [x] 2-column layout
    - [x] Image display (Video removed)
- [x] **Service List**: Detailed view (2-column)
- [x] **Order Actions**: WhatsApp integration hooks

### Interaction
- [x] **Inquiry Form**: Submission logic
- [x] **Appointment Booking**: Date/Time picker & submission
- [x] **Testimonials**: Slider/Grid display
- [ ] **PWA Features**: "Install App" prompt
- [ ] **Offline Capability**: Service worker / Local caching
- [ ] **Multi-Language**: English/Spanish toggle
- [ ] (Minimal CSS)
