# Synthica Portal — GEMINI.md

This file provides architectural context, development standards, and operational guidelines for the Synthica Portal project.

---

## 1. Project Overview

Synthica Portal is a web application designed to empower high school researchers worldwide. It consists of two main parts:
1.  **Marketing Site:** A high-performance static site (HTML/CSS) and React application describing Synthica's mission and programs.
2.  **Member Portal:** A React-based dashboard for researchers, leaders, and admins to manage projects, tasks, and applications.

### Core Tech Stack
- **Frontend:** React (Vite), Framer Motion (animations), Tailwind-like Vanilla CSS.
- **Backend/Auth:** Supabase (Authentication, PostgreSQL, Realtime, Storage).
- **Deployment:** Vercel.
- **Database:** Supabase PostgreSQL.

---

## 2. Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- Supabase Project (see `supabase-schema.sql` for table definitions)

### Commands
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (Runs at `http://localhost:5173`)
- **Build for Production:** `npm run build`
- **Preview Build:** `npm run preview`
- **Post-build processing:** `npm run postbuild` (Node script for custom build steps)

### Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 3. Architecture & Structure

### Key Directories
- `public/`: Static assets (logos, images, university logos).
- `scripts/`: Build-related scripts (e.g., `postbuild.mjs`).
- `src/components/`: Reusable React components (Navbar, Footer, ProtectedRoute, etc.).
- `src/hooks/`: Custom React hooks (`useUserAuth`, `useAuth`, `useArticles`).
- `src/pages/`: Main application pages.
    - `dashboard/`: Role-specific dashboards (Lead, Associate, Independent, Chapter Leader).
- `src/lib/`: Library initializations (Supabase).

### Role-Based Access Control (RBAC)
User roles are managed in the `profiles` table in Supabase.
| Role | Dashboard Logic |
|------|-----------------|
| `chapter_leader` | Manages chapter-specific resources. |
| `lead_researcher` | Manages projects and announcements. |
| `associate_researcher` | Updates task statuses for joined projects. |
| `independent_researcher` | Tracks personal research progress. |
| `pending` | Limited access until role is assigned by admin. |

---

## 4. Development Conventions

### Styling & Brand
- **Font:** 'Garet' (Primary).
- **Visuals:** Follow `BRANDING.md` strictly. Use glassmorphism patterns (`rgba(255, 255, 255, 0.15)` + `backdrop-filter: blur(20px)`).
- **Colors:** Sky Blue Gradients (`#2589ed` to `#99ccff`) and Gold Accents (`#FFD700`).
- **CSS:** Primary styles are in `styles.css` (static) and `src/index.css` (React). Always check both when making brand changes.

### Coding Standards
- **Functional Components:** Use React functional components with hooks.
- **Animations:** Use `framer-motion` for transitions and interactive elements.
- **Data Fetching:** Use custom hooks (e.g., `useUserAuth`, `useArticles`) to abstract Supabase logic.
- **Security:** Use Supabase Row Level Security (RLS) policies. Never expose service role keys in the frontend.

### Adding New Pages
1.  Create the page component in `src/pages/`.
2.  Add the route to `src/App.jsx`.
3.  Ensure the page follows the hierarchy: `section-badge` -> `section-title` -> `section-subtitle`.
4.  Update the `Navbar.jsx` if the page is a top-level navigation item.

---

## 5. Deployment Workflow
1.  **Vercel:** Auto-deploys on push to `main` branch.
2.  **Environment Variables:** Must be manually added to Vercel Project Settings for production (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
3.  **Supabase Policies:** Ensure RLS policies are applied in the Supabase dashboard.

---

*Last generated: June 10, 2026*
