# TalentDesk — Candidate Management Dashboard

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deploy-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

A candidate management dashboard built with React and Tailwind CSS. Manage applicants, track hiring stages, and keep your recruitment pipeline organized.

---

## Login

| Field    | Value                  |
|----------|------------------------|
| Email    | admin@talentdesk.com   |
| Password | admin123               |

---

## Features

- Dashboard with live stat cards, pipeline breakdown, and recent applicants
- Candidate listing fetched from DummyJSON API with avatars, skill tags, and status badges
- Real-time search by name and filter by application status
- Slide-in candidate detail panel with full profile and inline status update
- Add candidate form with skill tag input, character counter, validation, and submit feedback
- Pagination — 6 cards per page
- Dark and light mode with preference saved to localStorage
- Login page with session persistence via localStorage
- Mobile-responsive layout with collapsible sidebar
- Global state managed through React Context (no Redux)

---

## Tech Stack

| Technology        | Purpose                                      |
|-------------------|----------------------------------------------|
| React 18          | UI library                                   |
| Vite              | Dev server and build tool                    |
| Tailwind CSS      | Styling with dark mode support               |
| React Context     | Auth, app state, and candidates state        |
| DummyJSON API     | Candidate seed data                          |
| Lucide React      | Icons                                        |
| Google Fonts      | Syne (headings) and DM Sans (body)           |

---

## API

**DummyJSON Users API**
`GET https://dummyjson.com/users?limit=20`

No API key required. Returns realistic user data including name, email, phone, address, company, university, and avatar. Each user is assigned a random skill and pipeline status on fetch, stored in state for the session.

---

## Setup

**Requirements:** Node.js 16+, npm 8+

```bash
git clone <repo-url>
cd talentdesk
npm install
npm run dev
```

App runs at `http://localhost:5173`

**Production build:**
```bash
npm run build
```

---

## Folder Structure

```
talentdesk/
├── public/
├── src/
│   ├── components/
│   │   ├── ApiCandidateCard.jsx
│   │   ├── CandidateDetail.jsx
│   │   ├── CandidatePanel.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── StatCard.jsx
│   │   └── Toast.jsx
│   ├── context/
│   │   ├── AppContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── CandidatesContext.jsx
│   ├── data/
│   │   └── candidates.js
│   ├── hooks/
│   │   └── useCandidates.js
│   ├── pages/
│   │   ├── AddCandidate.jsx
│   │   ├── Candidates.jsx
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## Architecture

```
<AuthProvider>
  <AuthGate>
    <AppProvider>
      <CandidatesProvider>
        <AppShell />
      </CandidatesProvider>
    </AppProvider>
  </AuthGate>
</AuthProvider>
```

Routing is handled with `useState` in `App.jsx` — no react-router dependency.

