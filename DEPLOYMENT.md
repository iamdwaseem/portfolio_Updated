# Deployment Guide

## Important Note About GitHub Pages

**GitHub Pages is designed for static websites only** and cannot host full-stack applications with a backend server. Your portfolio project has two parts:

1. **Frontend (Next.js)** - Can be deployed to various platforms
2. **Backend (Express + MongoDB)** - Requires a server environment

## Recommended Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Frontend Deployment:**

1. **Push to GitHub**
   ```bash
   cd Frontend/portfolio-website-design
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio-frontend.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js
   - Add environment variable: `NEXT_PUBLIC_API_BASE_URL=your-backend-url`
   - Click "Deploy"

**Backend Deployment:**

Use Render, Railway, or Heroku for the backend.

### Option 2: Netlify + Render

**Frontend on Netlify:**
1. Push frontend to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variable: `NEXT_PUBLIC_API_BASE_URL`
7. Deploy

**Backend on Render:**
1. Push backend to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect repository
5. Configure:
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables from `config.env`
7. Deploy

### Option 3: Full Stack on Railway

**Deploy Both Together:**

1. **Push to GitHub**
   ```bash
   cd Pr
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will detect both services
   - Add environment variables for both
   - Deploy

### Option 4: Static Export (Frontend Only)

If you want to deploy **only the public portfolio** (without admin dashboard) to GitHub Pages:

1. **Modify Next.js for Static Export**
   
   Update `next.config.mjs`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   
   export default nextConfig
   ```

2. **Remove Dynamic Routes**
   - Remove `/admin` pages (they need a backend)
   - Keep only public portfolio pages

3. **Build Static Site**
   ```bash
   cd Frontend/portfolio-website-design
   npm run build
   ```

4. **Deploy to GitHub Pages**
   ```bash
   # Install gh-pages
   npm install --save-dev gh-pages
   
   # Add to package.json scripts:
   "deploy": "gh-pages -d out"
   
   # Deploy
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository settings
   - Pages → Source → gh-pages branch
   - Save

## Database Hosting

For MongoDB, use one of these free options:

1. **MongoDB Atlas** (Recommended)
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string
   - Update `MONGO_URI` in backend config

2. **Railway MongoDB**
   - Add MongoDB plugin in Railway
   - Automatically configured

## Environment Variables Setup

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api/v1
```

### Backend (config.env)
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
PORTFOLIO_URI=https://your-frontend-url.com
DASHBOARD_URI=https://your-frontend-url.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET_KEY=your_random_secret_key
JWT_EXPIRES=10d
COOKIE_EXPIRES=10

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Pre-Deployment Checklist

- [ ] Update CORS origins in backend to match frontend URL
- [ ] Set strong JWT secret key
- [ ] Configure MongoDB Atlas connection
- [ ] Set up Cloudinary account
- [ ] Configure Gmail App Password for emails
- [ ] Test all API endpoints
- [ ] Update demo credentials
- [ ] Add custom domain (optional)

## Post-Deployment

1. **Test the deployed site**
   - Check all pages load
   - Test login/logout
   - Verify CRUD operations
   - Test contact form

2. **Monitor**
   - Check deployment logs
   - Monitor API errors
   - Track performance

3. **Custom Domain** (Optional)
   - Purchase domain
   - Configure DNS
   - Add to deployment platform

## Cost Estimate

- **Vercel**: Free tier available
- **Netlify**: Free tier available  
- **Render**: Free tier available (with limitations)
- **Railway**: $5/month credit (free tier)
- **MongoDB Atlas**: Free tier (512MB)
- **Cloudinary**: Free tier (25GB storage)

## Recommended Setup for Production

**Best combination for free/low-cost:**
- Frontend: Vercel (free)
- Backend: Render (free tier)
- Database: MongoDB Atlas (free tier)
- Storage: Cloudinary (free tier)

This gives you a fully functional portfolio with admin dashboard at minimal to no cost!
