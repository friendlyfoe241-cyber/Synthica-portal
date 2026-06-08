# Synthica Dashboard — Firebase Setup Guide

This guide walks you through setting up the free Firebase backend for the Synthica member dashboard system.

---

## Overview — What's Free

Firebase **Spark (free) plan** gives you everything needed:

| Service | Free Limit | What it's used for |
|---------|-----------|-------------------|
| **Authentication** | Unlimited users | Google Sign-In for all roles |
| **Firestore** | 1 GB storage, 50K reads/day, 20K writes/day | All dashboard data |
| **Hosting** | 10 GB/month | Optional (site already on Vercel) |

No credit card required. All limits are generous for a student organization.

---

## Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it `synthica-portal` (or anything you like)
4. Enable Google Analytics if desired → **Continue**
5. Wait for project creation → **Continue**

---

## Step 2 — Enable Google Authentication

1. In the Firebase Console sidebar → **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method** tab → click **Google**
4. Toggle **Enable**
5. Set **Project support email** to your email (e.g., `quang@synthica.org`)
6. Click **Save**

**Add your domain to Authorized domains:**
- Still in Authentication → **Settings** tab → **Authorized domains**
- Add: `synthica.org`, `www.synthica.org`, and your Vercel preview URL
- `localhost` is already there for dev

---

## Step 3 — Create Firestore Database

1. Sidebar → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (you'll apply proper rules next)
4. Select a region (e.g., `us-east1` or `europe-west1`) → **Enable**

**Apply Security Rules:**
1. In Firestore → **Rules** tab
2. Copy the entire contents of `firestore.rules` in this project
3. Paste over the existing rules
4. Click **Publish**

---

## Step 4 — Register a Web App & Get Config

1. In Firebase Console → ⚙️ Project Settings (gear icon) → **General**
2. Scroll to **"Your apps"** section
3. Click **"</>"** (Web) icon → **Add app**
4. App nickname: `Synthica Dashboard`
5. Check **"Also set up Firebase Hosting"** only if you want (Vercel is fine)
6. Click **Register app**
7. Copy the `firebaseConfig` values shown

---

## Step 5 — Configure Environment Variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Fill it in with the values from Step 4:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

---

## Step 6 — Add Vercel Environment Variables (Production)

1. In Vercel → your project → **Settings → Environment Variables**
2. Add each `VITE_FIREBASE_*` variable from your `.env.local`
3. Redeploy

---

## Step 7 — Assign Roles to Users

When a user signs in with Google for the first time, their role is set to `pending`. You assign roles manually in Firebase:

1. Firebase Console → **Firestore → users collection**
2. Find the user document (it uses their Firebase UID as the document ID)
3. Edit the `role` field to one of:
   - `chapter_leader`
   - `lead_researcher`
   - `associate_researcher`
   - `independent_researcher`

**Role Matrix:**

| Role | Dashboard View |
|------|---------------|
| `chapter_leader` | Chapter info form + resources |
| `lead_researcher` | Create/manage projects, assign tasks, post announcements |
| `associate_researcher` | View joined projects, update task status |
| `independent_researcher` | Personal research tracker + resources |
| `pending` | Welcome screen + Application Hub access |

---

## Database Structure (Firestore Collections)

```
users/{uid}
  displayName, email, photoURL, role, createdAt

projects/{projectId}
  title, description, subject, status, leadResearcherId,
  leadResearcherName, memberIds[], memberNames{}, maxMembers, createdAt

  tasks/{taskId}
    title, description, status (todo|in_progress|done), dueDate, createdBy, createdAt

  announcements/{annId}
    content, authorId, authorName, createdAt

  readings/{readingId}
    title, url, description, addedBy, createdAt

chapters/{uid}  (keyed by Chapter Leader's uid)
  name, school, location, memberCount, meetings,
  projectsCompleted, notes, leaderId, leaderName, updatedAt

independentProgress/{uid}
  goals [{id, text, done}], readings [{id, title, url, done}],
  notes, updatedAt

applications/{appId}
  userId, userName, userEmail, roleApplied, projectId,
  projectTitle, statement, status (pending|approved|rejected), createdAt
```

---

## Application Workflow (Application Hub)

1. New user signs in → sees **Pending** dashboard
2. They visit **Application Hub** → fill out a role application
3. Application saved to `applications` collection with `status: "pending"`
4. You review in Firebase Console → manually update `users/{uid}.role`
5. User refreshes → dashboard updates to their assigned role

**To approve an application:**
1. Firestore → `applications` → find their doc → change `status` to `approved`
2. Firestore → `users` → find their uid doc → change `role` to the applied role
3. User will see their new dashboard on next page load

---

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Google Sign-In requires the domain to be in Authorized Domains — `localhost` is allowed by default.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Google sign-in popup blocked | Allow popups for localhost in browser |
| "Permission denied" in Firestore | Check firestore.rules are published correctly |
| User stuck on Pending | Manually set `role` field in Firestore Console |
| Auth domain error | Add your domain to Firebase Auth → Settings → Authorized domains |
| Environment variables not loading | Ensure `.env.local` exists and restart `npm run dev` |
