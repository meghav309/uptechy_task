# TalentDesk — Candidate Management Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A modern, full-featured Candidate Management Dashboard built with React and Tailwind CSS.**  
Track applicants, manage hiring pipelines, and streamline your recruitment workflow — all in one place.

</div>

---

## 📸 Preview

> Login with `admin@talentdesk.com` / `admin123` to explore the full dashboard.

---

## 🚀 Features

### Core Features
- **Dashboard Home** — Live stat cards (Total Applicants, Shortlisted, Rejected, Interview), pipeline breakdown chart, and recent applicants list
- **Candidates Listing** — Responsive card grid fetched from DummyJSON API with real avatar images, skill tags, and colored status badges
- **Search & Filter** — Real-time name search + status dropdown filter (Applied / Shortlisted / Interview / Rejected)
- **Candidate Detail Panel** — Slide-in drawer from the right with full profile: avatar (with shimmer loading), contact info, bio, skills, address, university, and a status change dropdown
- **Add Candidate Form** — Multi-field form with tag-based skill input, live bio character counter, per-status color-coded buttons, inline validation, and a 1-second simulated submit spinner
- **Pagination** — 6 candidates per page with smart page number indicators, prev/next controls, and item count summary

### Bonus Features
- 🌙 **Dark / Light Mode** — Toggled via Tailwind's `dark:` class on `<html>`; preference persisted to `localStorage`
- 🔐 **Authentication** — Login page with hardcoded credentials, `localStorage` session persistence, and a logout button in the navbar
- ✨ **Animations** — Staggered card entrance, page fade transitions, slide-in panel drawer, avatar shimmer skeleton, pulse-glow on success states
- 📱 **Mobile-First Responsive** — Sidebar collapses to a hamburger menu on mobile; all layouts adapt across breakpoints
- 🧠 **Global State** — `CandidatesContext` + `AppContext` + `AuthContext` using React Context API — no Redux needed
- 🎨 **Premium UI** — Dark navy/slate theme with electric cyan accents, `Syne` headings, `DM Sans` body text, glassmorphism cards

---

## 🔐 Login Credentials

| Field    | Value                      |
|----------|----------------------------|
| Email    | `admin@talentdesk.com`     |
| Password | `admin123`                 |

> These are hardcoded for demo purposes. No backend or Firebase is used.

---

## 🛠 Tech Stack

| Technology        | Purpose                                      |
|-------------------|----------------------------------------------|
| **React 18**      | UI library, component architecture           |
| **Vite**          | Lightning-fast dev server and bundler        |
| **Tailwind CSS**  | Utility-first styling with dark mode support |
| **React Context** | Global state (auth, app, candidates)         |
| **DummyJSON API** | Fake user data for candidate seeding         |
| **Lucide React**  | Icon library                                 |
| **Google Fonts**  | Syne (headings) + DM Sans (body)             |

---

## 📡 API Used

**[DummyJSON Users API](https://dummyjson.com/users)**  
`GET https://dummyjson.com/users?limit=20`

DummyJSON was chosen because:
- ✅ Free, no API key required
- ✅ Returns realistic user data: name, email, phone, address, company, university, avatar image
- ✅ Avatar images are real hosted URLs — no placeholder needed
- ✅ Consistent structure perfect for normalizing into a candidate shape

Each user is enriched with a randomly assigned **skill** (React, Node, Python, Java, CSS, Go) and **pipeline status** (Applied, Shortlisted, Interview, Rejected) on fetch — stored in component state so assignments persist for the session.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>

# 2. Navigate into the project
cd talentdesk

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Folder Structure

```
talentdesk/
├── public/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ApiCandidateCard.jsx   # Card for API-fetched candidates
│   │   ├── CandidateDetail.jsx    # Full detail view (page route)
│   │   ├── CandidatePanel.jsx     # Slide-in detail drawer
│   │   ├── Navbar.jsx             # Top navigation bar
│   │   ├── Pagination.jsx         # Page controls
│   │   ├── Sidebar.jsx            # Fixed sidebar navigation
│   │   ├── SkeletonCard.jsx       # Loading skeleton
│   │   ├── StatCard.jsx           # Dashboard stat widget
│   │   └── Toast.jsx              # Notification toasts
│   │
│   ├── context/                 # React Context providers
│   │   ├── AppContext.jsx         # Dark mode, navigation, toast, sidebar
│   │   ├── AuthContext.jsx        # Login/logout + localStorage auth state
│   │   └── CandidatesContext.jsx  # All candidate data, CRUD, stats
│   │
│   ├── data/
│   │   └── candidates.js          # Static seed data + status/department constants
│   │
│   ├── hooks/
│   │   └── useCandidates.js       # Search, filter, and pagination logic
│   │
│   ├── pages/                   # Top-level route views
│   │   ├── AddCandidate.jsx       # Add candidate form
│   │   ├── Candidates.jsx         # Candidates listing page
│   │   ├── Dashboard.jsx          # Home dashboard
│   │   └── Login.jsx              # Authentication page
│   │
│   ├── App.jsx                  # Root component + auth gate + routing
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Tailwind base + custom component classes
│
├── .vscode/
│   └── settings.json            # Disables CSS @apply lint warnings
├── index.html                   # HTML entry (Google Fonts loaded here)
├── tailwind.config.js           # Custom theme: navy colors, Syne/DM Sans, animations
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

| Token        | Value                          |
|--------------|-------------------------------|
| Primary font | `Syne` (headings)             |
| Body font    | `DM Sans`                     |
| Accent color | Electric Cyan `#00e5ff`       |
| Background   | Navy `#060d1f` (dark mode)    |
| Card style   | Glassmorphism (`backdrop-blur` + `bg-white/70`) |

---

## 🏗 Architecture

```
<AuthProvider>              ← Session persistence
  <AuthGate>                ← Renders Login or App
    <AppProvider>           ← Dark mode, navigation, toast
      <CandidatesProvider>  ← DummyJSON fetch + manual candidates + CRUD
        <AppShell />        ← Sidebar + Navbar + page router
      </CandidatesProvider>
    </AppProvider>
  </AuthGate>
</AuthProvider>
```

Routing is handled with `useState` in `App.jsx` — no `react-router` dependency needed.

---

## 📄 License

MIT — free to use and modify for personal or commercial projects.

---

<div align="center">
  Built with ❤️ using React + Tailwind CSS
</div>
