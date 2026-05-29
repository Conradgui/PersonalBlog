# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-05-29

### Added

- Blog system powered by GitHub Issues (category filter, search, Markdown rendering)
- Portfolio showcase with project cards, tech stack tags, and iframe preview
- Personal profile window with avatar, skills, social links, and resume viewer
- Built-in IE-style web browser for browsing the internet
- GitHub API service layer with 5-minute TTL caching
- Custom React hooks for data fetching (`useIssueList`, `useIssueDetail`, `useParsedIssue`)
- Win95-styled Markdown renderer with code highlighting and lazy-loaded images
- Beijing time (UTC+8) display in taskbar

### Changed

- Desktop icon layout streamlined to 7 core icons
- Taskbar time now displays Beijing time (UTC+8)
- Configuration moved to `src/data/config.js` for easy customization
- Deployment target updated to GitHub Pages

### Removed

- MSN chat (WebSocket backend dependency)
- Winamp music player
- Email contact form
- App Store
- Minesweeper game
- v86 x86 emulator
- Legacy personal information (original author's data)
- 20+ unused asset files and orphan components

### Fixed

- Infinite page reload loop caused by missing IE icon check
- Loading screen never dismissing
- BTC widget crash due to missing `showChart` state
- Typo bugs in Footer (`curremt` → `current`)
- Invalid useEffect dependency in EmptyFolder
- Duplicate entries in deleteIcon filter array

## [1.0.0] - 2024-08-25

### Added

- Windows 95 desktop environment with draggable windows
- Taskbar with Start menu and system tray
- Login page with animations
- Shutdown/Restart/Logout animations
- Right-click context menus
- Background and theme customization
- Clippy assistant
- Minesweeper game
- MSN live chat
- Winamp music player
- Bitcoin price tracker
- Weather widget
- News reader
- Paint application
- File explorer
- Task manager
- App store
