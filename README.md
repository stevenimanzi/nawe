# NAWE — Dual-Pillar Campus Platform

**Built by IMANZI Labs (Steven & Yannick)**
Target: Rwanda Polytechnic Musanze College

NAWE solves two "zero-to-one" problems for university ecosystems:

- **Dwell** — Off-campus housing discovery (Gueto layer)
- **Trade** — Peer-to-peer campus marketplace

---

## Architecture

```
nawe/
├── backend/    # Laravel 13 — Headless REST API
└── frontend/   # React 18 SPA / PWA — Vite + TypeScript + Tailwind
```

### Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Laravel 13, Sanctum, Redis, Laravel Horizon     |
| Database   | MySQL 9.7, highly normalised schema             |
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS        |
| State      | TanStack Query (server-state), React Router v7  |
| Media      | AWS S3 / Cloudflare R2 + CDN                    |
| CI/CD      | GitHub Actions → Laravel Forge / Envoyer        |

---

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Design System

| Token                     | Value          |
|---------------------------|----------------|
| Canvas / Background       | `#050B14`      |
| Dwell accent (Housing)    | Laterite Red   |
| Trade action (Marketplace)| `#39FF14`      |
| Typography                | `#FFFFFF`      |

- Default: **Dark Mode**
- Housing layer: full-bleed maps, vertical scroll, deep cards
- Marketplace layer: translucent masonry grid, horizontally scrolling, visually elevated

---

## Engineering Rules

- **No N+1 queries** — all Eloquent relations must use `with()` eager loading.
- **Async uploads** — images are queued via Laravel Horizon; API responds instantly.
- **Cache first** — TanStack Query caches server state; switching layers never re-fetches cold.
- **Verified users only** — no housing or marketplace interaction before identity is confirmed.
- **API-first** — Laravel never serves Blade views; all output is JSON (JSON:API spec).
