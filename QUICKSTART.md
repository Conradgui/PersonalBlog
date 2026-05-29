# Quick Start

Get your personal blog and portfolio running in 5 minutes.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [Git](https://git-scm.com/)
- A GitHub account

## Steps

### 1. Get the code

```bash
git clone https://github.com/Conradgui/PersonalBlog.git
cd PersonalBlog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your repository

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

### 4. Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173/PersonalBlog/` in your browser.

### 5. Add content via GitHub Issues

Create labels in your repo: `blog`, `project`, `profile`

Then create Issues with the appropriate label:

- **Blog post** — New Issue + label `blog` + Markdown content
- **Project** — New Issue + label `project` + meta block (thumbnail, tech, demo, github)
- **Profile** — One Issue + label `profile` + personal info and resume images

### 6. Deploy

```bash
git add .
git commit -m "feat: my portfolio"
git push origin main
```

Enable GitHub Pages: Settings > Pages > Source: GitHub Actions

Your site is live at `https://your-username.github.io/your-repo-name/`

## Customization

- **Desktop icons** — Edit `src/icon.json`
- **Window styles** — Edit CSS files in `src/css/`
- **Theme colors** — Edit `themeDragBar` in `src/App.jsx`
- **Page title** — Edit `index.html`

## Need Help?

- [Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)
