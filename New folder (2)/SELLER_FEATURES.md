# Seller Features Guide

This document defines the capabilities available to a **Seller** when logged into the dashboard.

## Visual Dashboard Map

A quick overview of the dashboard structure:

```mermaid
graph TD
    Dash[Dashboard] --> Profile
    Dash --> Content
    Dash --> Leads
    Dash --> Advanced

    subgraph Profile_Tab
        Profile --> Stats[Shop Stats]
        Profile --> Announce[Announcement Banner]
        Profile --> Info[Shop Info & Branding]
        Profile --> Contact
        Profile --> Hours[Business Hours]
        Profile --> Social[Social & Custom Links]
    end

    subgraph Content_Tab
        Content --> Cats[Categories]
        Content --> Gallery
        Content --> Video[Featured Film (YouTube)]
        Content --> Prods[Products]
        Content --> Servs[Services]
        Content --> Trust[Testimonials & FAQ]
        Content --> Embeds[Social Embeds]
    end

    subgraph Leads_Tab
        Leads --> Inq[Inquiries]
        Leads --> Appt[Appointments]
    end

    subgraph Advanced_Tab
        Advanced --> Code[Custom Code & URL Alias]
        Advanced --> SEO
    end
```

## 1. Profile Tab
Manage the core identity or "Face" of the shop.

- **Shop Statistics**: Edit displayed stats (Clients, Photos, Rating).
- **Share Shop**: **Set Custom Alias** (e.g., `my-shop`), Generate QR Code **Print Out**, and copy shop link.
- **Welcome Popup**: Configure a popup message/image that appears on shop load.
- **Announcement Banner**: Specific scrolling banner at the top of the shop.
- **Shop Info**:
  - **Core**: Shop Name, Owner Name, Tagline, Description.
  - **Personal**: Job Title, Occupation, Date of Birth.
- **Branding**: Upload **Logo** (used as Favicon) and **Banner** (JPG/PNG/WebP/MP4).
- **Contact Details**: 
  - **Primary**: Email, Phone, WhatsApp (with "Same as Phone" toggle).
  - **Alternate**: Secondary Email and Phone.
  - **Location**: Address, Map Link (Action Button), and Map Embed (Visual Map).
- **Business Hours**: Set opening/closing times per day.
- **Social Links**:
  - **Social Media**: Icons for Instagram, Facebook, YouTube, X, LinkedIn, Pinterest, Snapchat (2 Rows), Telegram.
  - **Custom Links**: Add arbitrary links (Label + URL) with generic link icon. Limits to 6 links (1 Row).

## 2. Content Tab
Manage what you sell and show.

- **Categories**: Organize offerings - Max 6 (1 Row).
- **Gallery**: Upload image or **video** collections (Square 1:1) - Max 9.
- **Featured Film**: Embed a YouTube video (1 Row).
- **Products**: Manage items with images or **videos** (Square 1:1), prices, and status (Ready/Made-to-order) - Max 8 (4 Rows).
- **Services**: List services with descriptions - Max 9 (9 Rows).
- **Testimonials**: Customer reviews and ratings - Max 9 (Slider).
- **FAQ**: Frequently Asked Questions - Max 9 (9 Rows).
- **Social Embeds**: Show live feeds from Instagram/Facebook/YouTube/Maps - Max 9 (9 Rows).

## 3. Leads Tab
Manage interactions with customers.

- **Inquiries**: View and manage customer messages.
  - **Dynamic List**: Interactive list of messages with sender name, email, phone, and date.
  - **Status Management**: Track progress with statuses: `New`, `Responded`, `Resolved`, or `Archived`.
  - **Actions**: Quick-access buttons to change status or permanently delete inquiries.
- **Appointments**: Manage service bookings.
  - **Schedule View**: See requested services, preferred dates, and times.
  - **Status Tracking**: Manage lifecycle using `Pending`, `Confirmed`, `Cancelled`, or `Completed`.
  - **Actions**: Update booking status to keep customers informed via WhatsApp follow-ups.

## 4. WhatsApp Commerce
Built-in features to drive sales directly to WhatsApp.

- **One-Click Ordering**: Customers click "Order" on any product to open a pre-filled WhatsApp message with item details.
- **Catalog Requests**: Dedicated button for customers to request a PDF catalog via WhatsApp.
- **Direct Support**: Floating WhatsApp button for instant customer chat.
- **Share Logic**: "Share" button on products generates a WhatsApp-ready link with product details.

## 5. Dashboard Power Tools
Features to help you manage your shop efficiently.

- **Instant Live Preview**: Toggle between **Seller Mode** (Edit) and **Buyer Mode** (View) instantly to see changes as customers do.
- **Section Visibility**: Use the **Eye Icon** toggle on any section header to hide/show that section on your public shop without deleting data.
- **Real-Time Updates**: Changes to text and settings are applied immediately (Save to publish).
- **QR Code Generator**: Download a high-res QR code for your shop to use on business cards or flyers.

## 6. Advanced Tab
Technical controls and settings.

- **Analytics & Performance**:
  - **Engagement Chart**: Real-time Line/Area charts showing `Views` vs `Clicks` trends.
  - **Smart Metrics**: Calculated **CTR (Click-Through Rate)** to measure shop effectiveness.
  - **Stat Cards**: Instant view of total visits, total engagement, and top-performing actions.
- **Server Usage**:
  - **Quota Monitoring**: Real-time visual progress bar showing estimated media storage (Images ~0.5MB, Videos ~5MB).
  - **Hard Limit**: 50MB storage quota per URL Alias to ensure lightning-fast load times.
  - **Optimization Tips**: Automatically provides advice on reducing media weight for optimal performance.
- **Custom Code**:
  - **CSS/JS Injection**: Advanced styling and tracking script support (for Pro users).
- **SEO Settings**:
  - **Meta Optimization**: Custom Title, Description, and Keywords for search engines.
  - **Social Sharing**: Upload a custom `Share Image` used when the link is shared on SM.
- **Support & Services**:
  - **Order NFC / PVC**: Direct request form for premium physical networking cards and PVC QR stands.
  - **Feedback Loop**: Integrated history of submitted requests with status updates (Pending/In-Progress/Resolved).