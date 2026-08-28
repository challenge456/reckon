# Reckon — Final Testing & Deployment Checklist

## ✅ Pre-Deployment Testing

### Authentication Flow
- [ ] Google Sign-In works
- [ ] New user signup → onboarding
- [ ] Profession selection persists
- [ ] User can logout
- [ ] Protected routes redirect to signin
- [ ] Session persists on page refresh

### Goal Management
- [ ] Create goal with title + deadline
- [ ] Goal appears in My Goals list
- [ ] Goal status shows correctly (Active/Completed/Missed)
- [ ] Complete goal before deadline
- [ ] Streak increments on completion
- [ ] Reliability score updates
- [ ] Missed goals auto-transition to MISSED

### Consequence System
- [ ] Goal expires → shows missed status
- [ ] Consequence options appear (3-4 choices)
- [ ] Difficulty labels correct
- [ ] Weekly limits enforced (2 Easy, 2 Medium)
- [ ] Consequence selection works
- [ ] External link (LeetCode/TryHackMe) opens in new tab
- [ ] "Mark Complete" works
- [ ] Lifelines button appears when lifelines > 0

### Lifelines
- [ ] User starts with 7 lifelines
- [ ] Use lifeline button skips consequence
- [ ] Lifeline count decrements
- [ ] Cannot use lifeline when count = 0
- [ ] Lifeline counter shows in Goals header

### Achievements
- [ ] Achievements unlock automatically
- [ ] Achievement cards display with emoji, name, date
- [ ] Progress bar shows percentage
- [ ] Recent achievements highlighted

### Statistics
- [ ] All stat cards display correct data
- [ ] Progress bars show correct percentages
- [ ] Goal history displays correctly
- [ ] Trend indicators show up/down

### Dark/Light Mode
- [ ] Theme toggle works
- [ ] Dark mode applied to all pages
- [ ] Light mode applied to all pages
- [ ] Theme persists on refresh
- [ ] System preference respected on first visit

### AI Assistant
- [ ] Chat widget appears (🤖 button)
- [ ] Chat opens/closes
- [ ] Messages send
- [ ] AI responds with relevant data
- [ ] Chat history displays
- [ ] Tool-calling works (get_statistics, get_active_goals, etc.)

### Sidebar Navigation
- [ ] All nav items clickable
- [ ] Active state highlights correctly
- [ ] Sign out works
- [ ] Theme toggle works from sidebar

### PWA
- [ ] manifest.json serves correctly
- [ ] Service worker registers
- [ ] App icon displays
- [ ] Can "Add to Home Screen" (mobile)
- [ ] Standalone mode works (no browser UI)
- [ ] Offline shell loads

### Responsive Design
- [ ] Desktop (1920px) looks good
- [ ] Tablet (768px) responsive
- [ ] Mobile (375px) responsive
- [ ] Sidebar collapses on mobile
- [ ] Chat widget accessible on mobile
- [ ] No horizontal scrolling

### External Integrations
- [ ] LeetCode link opens correctly
- [ ] TryHackMe link opens correctly
- [ ] Links open in new tab
- [ ] Return to app works

---

## 🚀 Deployment Checklist

### Environment Setup
- [ ] Create Supabase production database
- [ ] Copy production DATABASE_URL
- [ ] Generate new AUTH_SECRET
- [ ] Set ANTHROPIC_API_KEY (Claude API)
- [ ] Update Google OAuth URLs (production domain)
- [ ] Set CRON_SECRET for deadline resolution

### Vercel Deployment
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repository
- [ ] Configure environment variables in Vercel
- [ ] Set production domain
- [ ] Enable automatic deployments from main
- [ ] Deploy to production

### Production Configuration
- [ ] Update Google OAuth redirect URIs
  * Add production domain
  * Update in Google Cloud Console
- [ ] Test OAuth login on production
- [ ] Verify database connection
- [ ] Check Anthropic API key works
- [ ] Verify email/auth works

### Production Testing
- [ ] Load production site
- [ ] Test full user flow (signup → goal → consequence)
- [ ] Verify dark mode works
- [ ] Test AI assistant
- [ ] Check PWA manifest serves
- [ ] Test on mobile device
- [ ] Verify external links work
- [ ] Check analytics/monitoring

---

## 📋 Go-Live Tasks

- [ ] Create README.md with setup instructions
- [ ] Add favicon to production build
- [ ] Verify 404 page displays
- [ ] Test error pages
- [ ] Create brief privacy policy
- [ ] Create brief terms of service
- [ ] Set up basic monitoring/alerting
- [ ] Create admin dashboard (optional)

---

**Status: Ready for final testing**
