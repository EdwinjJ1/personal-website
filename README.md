# Evan Lin - Personal Portfolio

A modern, responsive personal portfolio website built with Next.js 15, showcasing my projects, skills, and experience as a Computer Science student and entrepreneur.

## 🚀 Live Demo

Visit the live site: [https://edwinjia1.github.io/personal-website/](https://edwinjia1.github.io/personal-website/)

## ✨ Features

- **Modern Design**: Clean, professional design with dark theme and teal accents
- **Multi-page Architecture**: Separate pages for Blog, Projects, About, Photography, and main portfolio
- **Real GitHub Activity**: Live GitHub contribution graph powered by GitHub API
- **Photography Portfolio**: Dedicated page showcasing photography work with modal gallery
- **Dynamic Projects**: Automatically updated project showcase with real data
- **Responsive**: Fully responsive design that works on all devices
- **Smooth Animations**: Powered by Framer Motion for delightful user experience
- **Static Export**: Optimized for GitHub Pages deployment
- **Real Profile**: Features actual profile photo and current information

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Deployment**: GitHub Pages with GitHub Actions

## 📱 Pages

- **Home** (`/`): Modular card-based layout with personal info, skills, GitHub activity, photography preview, and projects
- **Blog** (`/blog`): Blog posts about technology, entrepreneurship, and personal growth
- **Projects** (`/projects`): Detailed showcase of 9 technical projects with filtering by category
- **About** (`/about`): Comprehensive background, timeline, skills, and interests
- **Photography** (`/photography`): Portfolio gallery with category filtering and detailed photo modals

## 🚀 GitHub Pages Deployment Guide

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `personal-website` (or any name you prefer)
3. Make it **public**
4. Don't initialize with README (we already have one)

### Step 2: Push Your Code

```bash
# Add all files
git add .
git commit -m "Initial commit: Personal portfolio website"

# Set up remote repository (replace YourUsername with your actual GitHub username)
git branch -M main
git remote add origin https://github.com/YourUsername/personal-website.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click the **Settings** tab
3. Scroll down to **Pages** section in the sidebar
4. Under **Source**, select **"GitHub Actions"**
5. The GitHub Actions workflow will automatically run

### Step 4: Wait for Deployment

- The first deployment takes 2-5 minutes
- Check the **Actions** tab to see the deployment progress
- Once complete, your site will be live at: `https://YourUsername.github.io/personal-website/`

### Step 5: Future Updates

Every time you push changes to the `main` branch:
1. GitHub Actions automatically builds and deploys your site
2. Updates go live in 1-2 minutes
3. No manual intervention required!

## 🎨 Customization

### Update Your Information

1. **Profile Photo**: Replace `public/profile.jpg` with your photo (same filename)
2. **Personal Details**: Edit your information in:
   - `src/app/page.tsx` (main homepage)
   - `src/app/about/page.tsx` (about page)
3. **Projects**: Update project data in `src/data/projects.ts`
4. **Blog Posts**: Modify posts in `src/data/posts.ts`
5. **Photography**: Add your photos to `src/app/photography/page.tsx`

### Configure GitHub Activity

To display your real GitHub activity:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. (Optional) Add your GitHub Personal Access Token for higher API rate limits:
   - Without token: 60 requests/hour
   - With token: 5000 requests/hour
   - Create token at: https://github.com/settings/tokens
   - Add to `.env.local`: `GITHUB_TOKEN=your_token_here`

3. Update your GitHub username in `src/app/api/github-activity/route.ts`:
   ```typescript
   const username = 'YourGitHubUsername';
   ```

### Change Repository Name

If you want a different repository name:
1. Update `basePath` and `assetPrefix` in `next.config.js`
2. Replace `/personal-website` with `/your-repo-name`

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/YourUsername/personal-website.git
cd personal-website

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

## 📦 Build Commands

```bash
# Build for production
npm run build

# Test the build locally
npx serve out
```

## 🤝 Support

If you need help with setup or customization:
- Check the GitHub Issues for common problems
- Review the GitHub Actions logs for deployment errors
- Feel free to fork and modify as needed!

## 📄 License

Open source - feel free to use as a template for your own portfolio!

---

**Built with ❤️ by Evan Lin**
