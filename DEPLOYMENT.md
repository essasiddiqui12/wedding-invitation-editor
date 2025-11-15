# Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `wedding-invitation-editor` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in your terminal (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation-editor.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/wedding-invitation-editor.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in (use GitHub to sign in)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`wedding-invitation-editor`)
4. Vercel will auto-detect the settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Click "Deploy"
6. Your site will be live in ~30 seconds!

### Option B: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Link to existing project? **No**
   - Project name? `wedding-invitation-editor`
   - Directory? `./`
   - Override settings? **No**

5. For production deployment:
```bash
vercel --prod
```

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Update production on merge

## Troubleshooting

### If images don't load:
- Make sure all image paths are relative (e.g., `images/portrait1.svg`)
- Check that images are committed to git

### If fonts don't load:
- Google Fonts should work automatically
- Check browser console for any CORS errors

### If deployment fails:
- Check Vercel build logs
- Ensure `index.html` is in the root directory
- Verify all file paths are correct

## Need Help?

- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com

