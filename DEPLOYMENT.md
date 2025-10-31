# Deployment Guide - Extensionless URLs

This site is configured to work with extensionless URLs (e.g., `/about` instead of `/about.html`) across multiple hosting platforms.

## 🌐 Hosting Platform Configuration

### Apache (cPanel, Traditional Hosting)
The `.htaccess` file is already configured. It should work automatically on Apache servers.

### Netlify
1. The `netlify.toml` and `_redirects` files are already configured
2. Deploy by connecting your GitHub repository or using Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

### Vercel
1. The `vercel.json` file is already configured
2. Deploy using Vercel CLI:
   ```bash
   vercel --prod
   ```
   Or connect your GitHub repository via Vercel dashboard

### Cloudflare Pages
1. The `_redirects` file is already configured
2. Deploy via Cloudflare Pages dashboard by connecting your GitHub repository

### GitHub Pages
⚠️ **GitHub Pages does not support server-side redirects**
- Users will need to use `.html` extensions
- Or use a client-side redirect solution

## 🧪 Local Testing

### Option 1: Node.js Server (Recommended)
```bash
node server.js 3000
```
Then visit: `http://localhost:3000/about`

### Option 2: Python HTTP Server
```bash
python3 -m http.server 8000
```
⚠️ This will NOT support extensionless URLs - use `.html` extensions

### Option 3: PHP Built-in Server
```bash
php -S localhost:8000
```
⚠️ This will NOT support extensionless URLs - use `.html` extensions

## 📋 Files Included

- `.htaccess` - For Apache servers
- `_redirects` - For Netlify and Cloudflare Pages
- `netlify.toml` - Additional Netlify configuration
- `vercel.json` - For Vercel hosting
- `server.js` - Local testing server with extensionless URL support
- `sitemap.xml` - SEO sitemap (uses extensionless URLs)

## ✅ Recommended Hosting

For best results with extensionless URLs, we recommend:
1. **Netlify** (Free tier available)
2. **Vercel** (Free tier available)
3. **Cloudflare Pages** (Free tier available)
4. **Apache hosting** (Most shared hosting)

## 🔗 URL Structure

All pages are accessible via:
- `/` → Home page
- `/about` → About page
- `/contact` → Contact page
- `/blog` → Blog page
- `/book-call` → Book a call page
- `/seo-for-recruiters` → SEO services
- `/ppc-for-recruiters` → PPC services

Legacy `.html` URLs will automatically redirect to extensionless versions.
