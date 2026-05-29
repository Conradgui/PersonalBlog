# 🖥️ Windows 95 Personal Blog & Portfolio

> A retro Windows 95-themed personal blog and portfolio, powered by React and GitHub Issues as CMS

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?style=flat-square&logo=github)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Live Demo:** <https://conradgui.github.io/PersonalBlog/>

---

## Overview

This project transforms the classic Windows 95 desktop experience into a fully functional personal blog and portfolio. All content is managed through GitHub Issues — no backend, no database, no CMS fees. Just write a GitHub Issue, add a label, and it appears on your site.

### Why This Approach?

- **Zero maintenance cost** — Static site hosted on GitHub Pages, content managed via GitHub Issues
- **Instant content updates** — Write an Issue, refresh the page, done
- **Developer-friendly** — Markdown-native, version-controlled, collaborative
- **Unique presentation** — Windows 95 nostalgia meets modern web development

---

## Features

### Content Management (via GitHub Issues)

| Feature    | Description                                                           |
| :--------- | :-------------------------------------------------------------------- |
| 📝 Blog    | Articles rendered from GitHub Issues with category filtering and search |
| 📂 Portfolio | Project cards with thumbnails, tech stack, demo links, and iframe preview |
| 👤 Profile | Personal info, skills, social links, and resume images                |
| 🌐 Browser | Built-in IE-style web browser that can browse the internet            |

### Desktop Experience

| Feature        | Description                                           |
| :------------- | :---------------------------------------------------- |
| 🪟 Window System | Draggable, resizable, minimizable windows with Win95 styling |
| 📋 Taskbar     | Start menu, window tabs, system tray with clock       |
| 🖱️ Context Menu | Right-click for sorting, properties, and settings     |
| ₿ BTC Tracker  | Real-time Bitcoin price via Coinbase WebSocket        |
| 🌤️ Weather     | Location-based weather display                        |
| 🎨 Themes      | Customizable wallpaper and title bar colors           |
| 🔐 Login Screen | Win95-style login with animations                     |
| 📎 Clippy      | Animated assistant with motivational messages         |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Conradgui/PersonalBlog.git
cd PersonalBlog

# 2. Install
npm install

# 3. Configure
# Edit src/data/config.js with your GitHub username and repo

# 4. Run
npm run dev
```

Then open `http://localhost:5173/PersonalBlog/`

---

## Content Management

All content is managed through **GitHub Issues** — no coding required.

### Setup

Create these labels in your repository:

| Label    | Color | Purpose       |
| :------- | :---- | :------------ |
| `blog`   | Blue  | Blog articles |
| `project` | Green | Portfolio projects |
| `profile` | Purple | Personal information |

### Blog Post

Create an Issue with label `blog`:

```markdown
# Article Title

Content in full Markdown...

## Code blocks, images, tables — all supported
```

### Portfolio Project

Create an Issue with label `project`:

```markdown
<!-- meta
thumbnail: https://screenshot.png
tech: React, FastAPI, Neo4j
demo: https://demo.vercel.app
github: https://github.com/you/project
featured: true
-->

## Project description...
```

### Personal Profile

Create one Issue with label `profile`:

```markdown
<!-- meta
name: Your Name
title: AI Product Manager
location: Shanghai, China
github: https://github.com/you
linkedin: https://linkedin.com/in/you
-->

## About Me
Your bio...

## Skills
- Python, TypeScript, React

## Resume
![Resume](https://image-url.png)
```

---

## Deployment

### GitHub Pages (Recommended)

1. Update `src/data/config.js` with your repo info
2. Update `vite.config.js` → `base: '/your-repo-name/'`
3. Push to `main` branch
4. Enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions
5. Done! Your site deploys automatically on every push

### Other Platforms

| Platform | Build Command | Output Dir |
| :------- | :------------ | :--------- |
| Vercel   | `npm run build` | `dist`   |
| Netlify  | `npm run build` | `dist`   |

---

## Project Architecture

```text
src/
├── components/
│   ├── BlogWindow.jsx        # Blog list + article detail
│   ├── ProjectWindow.jsx     # Project cards + iframe preview
│   ├── ProfileWindow.jsx     # Personal info from GitHub Issues
│   ├── ResumeWindow.jsx      # Resume image viewer
│   ├── MarkdownRenderer.jsx  # Win95-styled Markdown rendering
│   ├── Footer.jsx            # Taskbar with Start menu
│   ├── Dragdrop.jsx          # Desktop icon system
│   ├── OpenProject.jsx       # IE-style web browser
│   ├── BTC.jsx               # Bitcoin price tracker
│   └── ...                   # Other UI components
├── services/
│   └── github.js             # GitHub API layer with caching
├── hooks/
│   └── useGitHubIssues.js    # Data fetching hooks
├── data/
│   └── config.js             # Repository configuration
├── css/                      # Win95-styled CSS files
└── App.jsx                   # Main application
```

### Data Flow

```text
GitHub Issues (CMS)
    ↓ GitHub REST API
github.js (Service Layer)
    ↓ useGitHubIssues.js (Hooks)
Window Components (UI)
    ↓ React Context
App.jsx (State Management)
```

---

## Tech Stack

| Category   | Technology               |
| :--------- | :----------------------- |
| Frontend   | React 18.2, Vite 5       |
| Styling    | Pure CSS (Win95 theme)   |
| Data       | GitHub Issues API        |
| Drag & Drop | react-draggable         |
| Animation  | framer-motion            |
| Markdown   | react-markdown           |
| Deployment | GitHub Pages + Actions   |

---

## Customization

### Change Desktop Icons

Edit `src/icon.json`:

```json
{
  "name": "IconName",
  "pic": "ImageName",
  "folderId": "Desktop",
  "type": ".exe",
  "x": 1,
  "y": 1
}
```

### Win95 CSS Reference

```css
/* Raised border (buttons, window frame) */
border: 2px solid;
border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;

/* Sunken border (input fields, content area) */
border: 2px solid;
border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;

/* Window background */
background: #c5c4c4;

/* Title bar */
background: #000080;
color: white;
```

---

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

---

## License

MIT License — feel free to use this as a template for your own portfolio.

## Acknowledgments

- [Windows 95 Icons](https://oldwindowsicons.tumblr.com/) — Icon resources
- [React](https://reactjs.org/) — UI framework
- [Vite](https://vitejs.dev/) — Build tool
- Original project by [Yuteoctober](https://github.com/Yuteoctober/wins95Portfolio) — Base architecture
