# Security & Code Protection

This document outlines the measures taken to protect the source code and data integrity of **B Catalog**.

## 1. Code Obfuscation & Hiding
- **Source Maps Disabled**: Production builds do not generate `.map` files. This prevents browser developer tools from reconstructing the original TypeScript source code.
- **Minification**: All JavaScript is minified using ESBuild (via Vite), which renames variables and removes comments and white space.
- **Environment Variables**: Sensitive keys are kept in `.env` files and never committed to the repository.

## 2. Netlify Deployment Security
- **Secure Redirects**: The `netlify.toml` file ensures that all requests are correctly routed through the secure entry point.
- **Environment Management**: API keys and secrets should be managed via the Netlify Dashboard's "Environment variables" section.

## 3. Best Practices for Sellers
- **Do not share your .env file**.
- **Use Serverless Functions** for any logic that requires high confidentiality (e.g., integrating with a private database).

---
*Created by Antigravity AI*
