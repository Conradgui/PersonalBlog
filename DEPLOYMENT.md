# Deployment Guide

## GitHub Pages (Recommended)

### Step 1: Fork or Clone

```bash
git clone https://github.com/Conradgui/PersonalBlog.git
cd PersonalBlog
```

### Step 2: Configure

Edit `src/data/config.js`:

```javascript
export const config = {
  github: {
    owner: 'your-github-username',
    repo: 'your-repo-name',
  },
  // ...
};
```

Edit `vite.config.js` — update `base`:

```javascript
base: '/your-repo-name/',
```

### Step 3: Push

```bash
git add .
git commit -m "feat: configure for my portfolio"
git push origin main
```

### Step 4: Enable GitHub Pages

1. Go to repo **Settings > Pages**
2. Set **Source** to `GitHub Actions`
3. Wait for the deployment to complete

Your site will be live at `https://your-username.github.io/your-repo-name/`

---

## Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**

---

## Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **New site from Git**
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **Deploy site**

---

## Custom Domain

### GitHub Pages

1. Create a `CNAME` file in the repo root:

```text
your-domain.com
```

2. Add DNS records at your domain provider:

| Type | Name | Value                    |
| :--- | :--- | :----------------------- |
| CNAME | www | your-username.github.io |

3. In repo Settings > Pages, enter your custom domain and enable HTTPS

---

## Environment Variables

This project does not require environment variables. All configuration is in `src/data/config.js`.

For higher GitHub API rate limits (optional), you can add a Personal Access Token:

1. Create a `.env` file:

```text
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

2. The token only needs `public_repo` scope
3. Anonymous requests are limited to 60/hour; with a token: 5,000/hour

---

## Troubleshooting

**Blank page after deployment?**

- Check `vite.config.js` → `base` matches your repo name
- Check `src/data/config.js` → `owner` and `repo` are correct

**GitHub Issues not showing?**

- Ensure Issues are **Open** (not closed)
- Ensure labels are correct (`blog`, `project`, `profile`)
- Ensure the repository is **public**

**Build fails?**

- Run `npm install` to refresh dependencies
- Run `npm run build` locally to check for errors
- Check the GitHub Actions logs for details
