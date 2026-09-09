# Praman Jobs — India Tech Internship & Job Board

Praman Jobs is a high-performance, real-time job and internship platform built for Indian engineering students, fresh graduates, and recruiters.

The platform aggregates verified tech opportunities across India's top tech hubs (**Bangalore, Delhi NCR / Gurgaon, Mumbai, Hyderabad, Pune, and India-Remote**) and combines them with direct recruiter postings — with a strict **100% direct application policy (zero dead links)**.

---

## 🌟 Key Features

1. **Hybrid Job Aggregation & Live ATS APIs**:
   - Fetches live jobs directly from official ATS boards including **Greenhouse** (Postman, HackerRank, InMobi, Groww, Slice) and **Lever** (Meesho, CRED).
   - Curated high-priority roles from top employers (**Google India, Microsoft India, Swiggy, Zerodha**).
   - Direct-to-employer application links for every listing.

2. **Full Recruiter & Student Workflows**:
   - **Student Mode**: Search, filter by city (Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune, Remote), filter by role type (Internships vs Full-time), and apply directly on company portals.
   - **Recruiter Mode**: Post new job listings with external apply links, view and manage active postings, or delete expired roles in real-time.

3. **Enterprise Security & Real-Time Sync**:
   - **Supabase (PostgreSQL)** authentication and Row-Level Security (RLS).
   - Automated database trigger (`handle_new_user`) for role synchronization.
   - Server-side access enforcement ensuring students cannot tamper with recruiter listings.

4. **Modern, Responsive UI**:
   - High-contrast cyberpunk / dark theme with custom glassmorphism.
   - Official Praman branding with responsive mobile drawer navigation.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack) & React 19
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Database Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) and run it.

### 2. Environment Variables
Create a `.env.local` file in the root directory (based on [`.env.example`](./.env.example)):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install & Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
├── app/
│   ├── api/jobs/          # API route handlers for job creation and deletion
│   ├── jobs/              # Main interactive job & internship board
│   ├── login/             # Student & Recruiter login (Email & Google OAuth)
│   ├── signup/            # Account registration with role selection
│   ├── profile/           # Student & Recruiter profile dashboards & settings
│   ├── post-job/          # Recruiter job posting portal
│   ├── my-postings/       # Recruiter job management dashboard
│   ├── globals.css        # Core design tokens and theme styles
│   └── layout.tsx         # Root layout, favicon, and brand navbar
├── components/
│   ├── Navbar.tsx         # Responsive navbar with mobile drawer navigation
│   ├── JobCard.tsx        # Individual interactive job card component
│   └── JobCardList.tsx    # Search bar & city/role filter pills
├── lib/
│   ├── external-jobs.ts   # Live ATS API integration (Greenhouse, Lever, Arbeitnow)
│   ├── supabase-browser.ts# Client-side Supabase instance
│   ├── supabase-server.ts # Server-side Supabase instance
│   └── types.ts           # Type definitions
├── supabase-schema.sql    # Complete PostgreSQL schema & RLS policies
└── next.config.ts         # Next.js configuration
```

