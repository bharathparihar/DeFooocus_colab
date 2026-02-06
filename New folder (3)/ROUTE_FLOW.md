
# Application Route Flow

This document outlines the routing logic and navigation flow of the application.

## Overview

The application uses `react-router-dom` for client-side routing.
- **Root (`/`)**: Redirects to Auth.
- **Auth (`/auth`)**: Login / Register / Shop Routing.
- **Shop (`/v/:slug`)**: Main application page (Buyer Catalog / Seller Dashboard).
- **404 (`*`)**: Catch-all for undefined routes.

## Visual Flowchart

```mermaid
graph TD
    Start((Start)) --> Root{/"/" Route}
    
    Root --> RootRedirect[Root Redirect]
    RootRedirect --> AuthPage[/"auth" Route]
    
    subgraph Auth_Page
        AuthPage --> CheckAuth{Authenticated?}
        CheckAuth -->|No| LoginForms[Login/Register]
        CheckAuth -->|Yes| CheckShop{Has Shop?}
        CheckShop -->|Yes| ShopPage[/"v/:slug" Route]
        CheckShop -->|No| CreateShop[Create Shop Form]
        
        LoginForms -->|Success| CheckShop
    end

    subgraph Shop_Page
        ShopPage --> CheckMode{Mode & Auth?}
        CheckMode -->|Seller Mode & Authenticated| SellerDash[Seller Dashboard]
        CheckMode -->|Buyer Mode or Not Auth| BuyerCat[Buyer Catalog]
        
        SellerDash -->|Sign Out| AuthPage
        SellerDash -->|Switch to Buyer| BuyerCat
        BuyerCat -->|Switch to Seller (Auth)| SellerDash
        BuyerCat -->|Switch to Seller (Not Auth)| AuthPage
    end

    Start -->|Unknown Route| NotFound[404 Page]
```

## Detailed Navigation Logic

### 1. Root Route (`/`)
- **Logic**: Immediately redirects ALL users to `/auth`.

### 2. Auth Route (`/auth`) - `Auth` Component
- **Purpose**: Entry point for authentication and routing.
- **Logic**:
  - Checks authentication status.
  - **Authenticated**: Checks if user has a Shop.
    - **Has Shop**: Redirects to `/v/:slug`.
    - **No Shop**: Stays on page to allow Shop Creation.
  - **Not Authenticated**: Shows Login/Register forms.

### 3. Shop Route (`/v/:slug`) - `Shop` Component
- **Purpose**: The main interface for both Shop Owners (Sellers) and Customers (Buyers).
- **Logic**:
  - **State**: Manages a `mode` state (`seller` | `buyer`).
  - **Default**: Defaults to `buyer` mode if not logged in.
  - **Views**:
    - **Seller Dashboard**: Renders if `mode === 'seller'` AND user is authenticated. Allows editing shop config.
    - **Buyer Catalog**: Renders if `mode === 'buyer'` OR user is not authenticated. Displays the shop content.
  - **Navigation**:
    - **"Seller" Button**:
      - If logged in: Switches `mode` to `seller`.
      - If NOT logged in: Redirects to `/` (Auth page).
    - **"Buyer" Button**: Switches `mode` to `buyer`.
    - **Sign Out**: Logs the user out and redirects to `/`.

### 3. Catch-all Route (`*`) - `NotFound.tsx`
- **Purpose**: Handles invalid URLs.
- **Logic**: Displays a 404 error message.
