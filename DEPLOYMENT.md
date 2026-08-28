# Reckon — Vercel Deployment Guide

## Step 1: Prepare Environment Variables

Create a `.env.production` file with production values:

```bash
# Database (Supabase Production)
DATABASE_URL="postgresql://user:password@host:5432/reckon_prod"
DIRECT_URL="postgresql://user:password@host:5432/reckon_prod"

# Authentication
AUTH_SECRET="generate-with: openssl rand -hex 32"
NEXTAUTH_URL="https://yourdomain.com"

# Google OAuth (Update these in Google Cloud Console)
GOOGLE_CLIENT_ID="your-production-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-production-secret"

# Anthropic (Claude API)
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxx"

# Cron Secret
CRON_SECRET="your-secure-cron-secret"
```

## Step 2: Create Supabase Production Database

1. Go to supabase.com → Sign in
2. Create a new project (production database)
3. Copy CONNECTION STRING → `DATABASE_URL`
4. Copy DIRECT CONNECTION → `DIRECT_URL`
5. Run migrations:
   ```bash
   npx prisma migrate deploy
   npx ts-node prisma/seed.ts
   ```

## Step 3: Update Google OAuth

1. Go to Google Cloud Console
2. Update OAuth consent screen (if needed)
3. Add production domain to Authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
4. Generate new credentials for production domain
5. Copy CLIENT_ID and CLIENT_SECRET

## Step 4: Deploy to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts to link project
```

### Option B: Via GitHub Integration

1. Go to vercel.com → Log in
2. Click "New Project"
3. Import your GitHub repository
4. Select "reckon" repository
5. Configure:
   - Framework: Next.js ✓ (auto-detected)
   - Root Directory: ./ ✓
   - Build Command: `npm run build`
   - Environment Variables: (Add all from `.env.production`)
6. Click "Deploy"

## Step 5: Configure Environment Variables in Vercel

1. Go to Vercel Project Settings → Environment Variables
2. Add each variable:
   - DATABASE_URL
   - DIRECT_URL
   - AUTH_SECRET
   - NEXTAUTH_URL (set to your production domain)
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - ANTHROPIC_API_KEY
   - CRON_SECRET

3. Set scopes: Production, Preview, Development (as needed)

## Step 6: Verify Production Deployment

```bash
# Test production site
curl https://yourdomain.com
```

Check:
- ✅ Landing page loads
- ✅ Signin page accessible
- ✅ Google OAuth works
- ✅ Dashboard loads after login
- ✅ Goals can be created
- ✅ AI assistant works
- ✅ Dark mode works
- ✅ PWA manifest serves

## Step 7: Enable Custom Domain (Optional)

1. Vercel Project Settings → Domains
2. Add custom domain
3. Update DNS records (Vercel provides instructions)
4. Wait for DNS propagation (~24 hours)

## Step 8: Set Up Production Monitoring

1. Enable Vercel Analytics:
   - Vercel Project Settings → Analytics
   - Enable Web Analytics
   - Enable Edge Middleware Monitoring

2. Configure Error Tracking (optional):
   - Sentry or similar service
   - Add environment variable: `SENTRY_DSN="xxx"`

## Step 9: Update OAuth Redirect URLs

After deployment, update all OAuth providers with production URLs:

**Google Cloud Console:**
- Authorized redirect URIs:
  - `https://yourdomain.com/api/auth/callback/google`

**NextAuth Configuration:**
- `NEXTAUTH_URL="https://yourdomain.com"`

## Step 10: Final Production Checklist

- [ ] Site loads without errors
- [ ] Authentication works (Google Sign-In)
- [ ] Database connection verified
- [ ] API endpoints respond
- [ ] AI assistant responds with data
- [ ] PWA installs correctly
- [ ] Mobile responsive
- [ ] All pages load
- [ ] Goals workflow complete
- [ ] Consequences system works

## Troubleshooting

**"Database connection failed"**
- Verify DATABASE_URL is correct
- Check Supabase firewall settings
- Ensure DIRECT_URL uses proper connection string

**"OAuth redirect URL mismatch"**
- Update Google Cloud Console with exact production URL
- Ensure NEXTAUTH_URL matches deployed domain

**"Claude API key invalid"**
- Verify ANTHROPIC_API_KEY is correctly set
- Check no extra whitespace in environment variable

**"Service worker not registering"**
- Ensure manifest.json is served
- Check HTTPS is enabled
- Verify service worker file is accessible

---

**Deployment complete! 🚀**
