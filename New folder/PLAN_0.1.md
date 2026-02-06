# Shoplink Creator - Project Plan v0.1

This document outlines the roadmap for the **Shoplink Creator** React application, deployment strategies for Netlify, and security best practices.

## 1. Project Overview
A comprehensive digital presence platform for sellers (EnBizCard style) featuring a rich dashboard, product/service listings, and WhatsApp-driven commerce.

### Tech Stack
- **Framework**: React 18 (Vite + TypeScript)
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **State/Data**: TanStack Query (React Query) + React Hook Form + Zod
- **Utilities**: Framer Motion (Animations), Lucide (Icons), Recharts (Analytics)

## 2. Roadmap (Phase 0.1)

### Phase 1: Core Infrastructure
- [ ] Finalize the monolithic `Index.tsx` vs. Modular extraction (already in progress).
- [ ] Set up global branding state (Logo, Banner, Shop Info).
- [ ] Implement Mobile-first responsive layout for Buyer View.

### Phase 2: Content & Leads
- [ ] **WhatsApp Commerce**: Implement "One-Click Order" and Catalog request flow.
- [ ] **Content Management**: Enable Category filtering and Gallery (Image/Video support).
- [ ] **Leads Dashboard**: Interactive list for Inquiries and Appointment management.

### Phase 3: Advanced Features
- [ ] **Real-time Preview**: Ensure seamless toggle between Edit and View modes.
- [ ] **Analytics**: Implement Engagement charts and CTR metrics.
- [ ] **SEO**: Dynamic meta tag updates for social sharing.

## 3. Netlify Deployment Guide

To deploy this React project to Netlify (Free Version):

1. **Push to GitHub**: Initialize a Git repository and push your code to a GitHub/GitLab/Bitbucket repo.
2. **Connect to Netlify**:
   - Log in to [Netlify](https://app.netlify.com/).
   - Click **"Add new site"** -> **"Import an existing project"**.
   - Select your repository.
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - If you have an `.env` file, go to **Site settings > Environment variables** and add them there.

## 4. Code Security: "Hiding Your Code"

> [!CAUTION]
> **Important Note on React Security**:
> In a React/Vite application (Client-side), your JavaScript is bundled and sent to the user's browser. While it is minified, it is never 100% "hidden."

### How to protect your intellectual property:

1. **Minification & Obfuscation (Default)**:
   - When you run `npm run build`, Vite automatically **minifies** your code. This renames your variables (e.g., `const userPassword` becomes `const a`) and removes all comments, making it very hard to read.
   
2. **Hide Sensitive Data (Secrets)**:
   - **DO NOT** put API keys or secrets in your React code.
   - Use **Netlify Functions** (Serverless). These run on the "back-end" where users cannot see the code.
   - Call your sensitive logic via an API endpoint (e.g., `/.netlify/functions/my-secret-logic`).

3. **Source Maps**:
   - Ensure `sourcemap: false` is set in your `vite.config.ts` for production. This prevents users from seeing your original source code in the browser's developer tools.

4. **Premium "Obfuscation"**:
   - If you need extreme protection, tools like [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) can be added to your build pipeline, but they can slow down your app.

---
*Created by Antigravity AI*
