# 🚀 Quick Start - Deploying to Vercel

## What's Been Set Up

Your repository is now fully configured for Vercel deployment! Here's what was added:

### Public Files (In Git Repository)
1. **`vercel.json`** - Vercel configuration for static site deployment
2. **`.env.example`** - Template showing required environment variables
3. **`.gitignore`** - Protects sensitive files from being committed
4. **`DEPLOYMENT.md`** - Complete deployment guide with instructions
5. **`README.md`** - Updated with project information and deployment links

### Private Files (NOT in Git - For Your Eyes Only)
6. **`VERCEL_SETUP.md`** - Contains your actual API keys and account details
   - ⚠️ This file is automatically excluded from git commits
   - Keep it safe and private
   - All your actual keys and IDs are in here

## 🎯 Next Steps - Deploy in 5 Minutes

### Step 1: Go to Vercel
Visit: https://vercel.com/new

### Step 2: Import Your Repository
1. Log in with your GitHub account
2. Click "Import" next to `Jeffcopeland11/Crowdsourced-album`

### Step 3: Configure Settings
- **Framework Preset**: Select `Other`
- **Build Command**: Leave empty
- **Output Directory**: Leave as `.`
- **Install Command**: Leave empty

### Step 4: Add Environment Variables
Open the `VERCEL_SETUP.md` file in this directory (it's private, not in git).
Copy the three environment variables from that file:

1. `ANTHROPIC_API_KEY` = [your key from VERCEL_SETUP.md]
2. `ELEVENLABS_API_KEY` = [your key from VERCEL_SETUP.md]
3. `MOCKUUUPS_API_KEY` = [your key from VERCEL_SETUP.md]

For each variable:
- Enter the name
- Paste the value
- Select all three environments (Production, Preview, Development)
- Click "Add"

### Step 5: Deploy!
Click the "Deploy" button and wait ~1-2 minutes.

## 📍 Your Deployment URLs

After deployment completes, you'll get:
- **Production URL**: `https://[project-name].vercel.app`
- **Dashboard**: Your Vercel dashboard to manage the deployment

## 🔒 Important Security Notes

### ⚠️ CRITICAL - Rotate Your API Keys!
The API keys provided in the initial request may have been exposed in a public issue/comment. **You should rotate them ASAP**:

1. **Anthropic Claude**: 
   - Go to https://console.anthropic.com/settings/keys
   - Create a new API key
   - Delete the old one
   - Update in Vercel dashboard

2. **ElevenLabs**:
   - Go to http://elevenlabs.io (account settings)
   - Regenerate your API key
   - Update in Vercel dashboard

3. **Mockuuups.studio**:
   - Check their dashboard for API key management
   - Regenerate if possible
   - Update in Vercel dashboard

### How to Update Keys in Vercel
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Find the variable you want to update
4. Click the three dots → "Edit"
5. Paste the new value
6. Save and redeploy

## 📖 Need More Help?

- **Detailed Guide**: See `DEPLOYMENT.md` for comprehensive instructions
- **Your Settings**: See `VERCEL_SETUP.md` for your specific configuration
- **Vercel Docs**: https://vercel.com/docs

## 🎨 About This Application

This is the **Deliverance Toolkit** - a Christ-centered web application for generating personalized deliverance prayers. It's a static HTML/CSS/JavaScript site that runs entirely in the browser.

### Current Features:
- Standard prayer templates
- Custom prayer builder
- Guided session flow

### API Integration (Future)
The API keys you configured are for future features. The current app doesn't make external API calls yet. To integrate them:
- Create Vercel serverless functions in an `api/` directory
- Access the environment variables server-side
- Keep API keys secure (never expose in client-side code)

## ✅ Verification Checklist

After deploying, verify:
- [ ] Site loads at your Vercel URL
- [ ] All three tabs work (Standard Prayers, Custom Builder, Guided Session)
- [ ] Prayers generate correctly
- [ ] No console errors in browser DevTools
- [ ] Environment variables are set in Vercel dashboard

## 🆘 Troubleshooting

**Deployment failed?**
- Check that all settings match Step 3 above
- Ensure you selected "Other" as framework
- Make sure build/install commands are empty

**Site not loading?**
- Check Vercel deployment logs
- Verify the build succeeded
- Check for any DNS issues if using custom domain

**Need to redeploy?**
- Just push changes to your GitHub repository
- Vercel will auto-deploy
- Or click "Redeploy" in the Vercel dashboard

---

**Ready to deploy? Start at Step 1 above! 🚀**
