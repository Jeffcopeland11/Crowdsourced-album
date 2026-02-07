# Vercel Deployment Guide

This guide will help you deploy the Deliverance Toolkit application to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- GitHub account connected to Vercel
- Your API keys for:
  - Anthropic Claude API
  - ElevenLabs API
  - Mockuuups.studio API

## Deployment Steps

### 1. Import Project to Vercel

1. Go to https://vercel.com and log in with your GitHub account
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Find and select the `Jeffcopeland11/Crowdsourced-album` repository
5. Click "Import"

### 2. Configure Project Settings

When importing the project, you'll see the project configuration screen. Use these settings:

#### Framework Preset
- **Select**: "Other" (this is a static HTML/CSS/JS site)

#### Build & Development Settings
- **Build Command**: Leave empty (no build required)
- **Output Directory**: Leave as `.` (current directory)
- **Install Command**: Leave empty (no dependencies to install)

#### Root Directory
- Leave as `.` (root of repository)

### 3. Add Environment Variables

In the "Environment Variables" section, add the following variables:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key (starts with `sk-ant-api03-...`) |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key (starts with `sk_...`) |
| `MOCKUUUPS_API_KEY` | Your Mockuuups.studio API key |

**Note**: Replace the placeholder values with your actual API keys. See the `.env.example` file for the variable names.

**Important**: These environment variables are configured but note that the current application code does not use server-side API calls. If you plan to add backend functionality that uses these APIs, you'll need to create API routes or serverless functions.

### 4. Deploy

1. Review your configuration
2. Click "Deploy"
3. Wait for the deployment to complete (usually takes 1-2 minutes)
4. Once complete, you'll get a production URL like `https://your-project-name.vercel.app`

### 5. Configure Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the instructions to update your DNS settings

## Vercel Account Setup

To deploy this application, you'll need:
- A Vercel account (free tier available)
- Your GitHub account connected to Vercel
- Access to your API keys for the services you want to integrate

Visit https://vercel.com to create an account if you don't have one.

## Post-Deployment

### Verify Deployment
1. Visit your deployment URL
2. Test the application functionality
3. Check browser console for any errors

### Managing Environment Variables
To update environment variables after deployment:
1. Go to project "Settings" → "Environment Variables"
2. Edit or add new variables
3. Redeploy for changes to take effect

### Automatic Deployments
Vercel automatically deploys:
- **Production**: When you push to the main branch
- **Preview**: When you create a pull request

## Local Development with Environment Variables

If you need to test with environment variables locally:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual API keys

3. The `.env.local` file is gitignored and will not be committed to your repository

## Security Notes

⚠️ **Important Security Information**:

1. **Never commit `.env` files** with real API keys to your repository
2. The `.gitignore` file is configured to exclude all `.env` files
3. **Keep `VERCEL_SETUP.md` private** - This file contains your actual API keys and is automatically excluded from git commits
4. **API Key Security**: If you received API keys through a public issue or documentation:
   - These keys may have been exposed publicly
   - Rotate/regenerate them immediately after your first deployment
   - Use Vercel's dashboard to update the environment variables with new keys
5. For production applications, consider:
   - Rotating the API keys after initial setup
   - Using Vercel's environment variable encryption (enabled by default)
   - Implementing rate limiting for API calls
   - Creating a backend API to proxy requests (keeps keys server-side only)

## Current Application Architecture

The current application is a **client-side static site** that:
- Runs entirely in the browser
- Does not currently make external API calls
- Does not use the configured API keys in the current code

### To Use the API Keys

If you want to integrate the APIs mentioned (Anthropic Claude, ElevenLabs, Mockuuups):

1. **Create Vercel Serverless Functions** (recommended):
   - Create an `api/` directory in your project
   - Add serverless function files (Node.js)
   - Access environment variables in those functions
   - Call these API endpoints from your frontend

2. **Example**: Create `api/generate-text.js`:
   ```javascript
   export default async function handler(req, res) {
     const anthropicKey = process.env.ANTHROPIC_API_KEY;
     // Use the API key to make requests
     // Return results to frontend
   }
   ```

3. **Update Frontend**: Call `/api/generate-text` from your JavaScript

## Support

For issues with Vercel deployment:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

For issues with the application:
- Check the GitHub repository issues
- Review browser console for errors

## Quick Reference

### Vercel CLI Commands (Optional)

Install Vercel CLI:
```bash
npm i -g vercel
```

Deploy from command line:
```bash
vercel
```

Deploy to production:
```bash
vercel --prod
```

View logs:
```bash
vercel logs
```
