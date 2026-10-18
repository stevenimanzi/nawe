# NAWE

**Second-hand goods, things to rent from neighbours, and rooms and houses (gueto), all from ID-verified people near you.**

Built by Steven IMANZI and BYIRINGIRO Innocent.

## What it does

- **Marketplace**: buy and sell second-hand items, or rent them out by the day, week or month. Search, filter, sort, "near me".
- **Shelter & Gueto**: find rooms, studios and houses with a live map, a "houses around me" distance filter, and room, budget and amenity filters.
- **Trust**: every seller and landlord verifies a national ID. An admin reviews the documents.
- **Messaging**, **wishlist**, **reports**, **contact form**, and an **admin** area for ID checks and reported listings.

## Architecture

```
nawe/
├── backend/    Laravel 13: JSON REST API (Sanctum token auth)
└── frontend/   React 19 + Vite + TypeScript + Tailwind 4, TanStack Query, React Router, Leaflet maps
```

Browsing listings is public. Messaging, saving, posting and everything under `/account` need an account.

## Run it locally

You need PHP 8.3+, Composer, Node 20+ and a database (MySQL, or SQLite for a quick start).

### 1. API

```bash
cd backend
cp .env.example .env        # then set DB_* (SQLite: DB_CONNECTION=sqlite and an empty database/database.sqlite)
composer install
php artisan key:generate
php artisan migrate --seed  # --seed adds DEMO data. Never seed a production database.
php artisan storage:link    # lets uploaded photos be served
php artisan serve           # http://127.0.0.1:8000
```

Photos are stored on Laravel's `public` disk. Set `APP_URL` to the address the API is served from so photo links are correct.

### 2. Web app

```bash
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

The dev server proxies `/api` and `/storage` to `http://localhost:8000`. If the API runs elsewhere:

```bash
API_TARGET=http://localhost:8001 npm run dev
```

### Demo accounts (after `--seed`)

All use the password `Password@123`.

| Email | Role | Notes |
|---|---|---|
| `admin@nawe.rw` | Admin | Reviews ID checks and reports at `/admin` |
| `landlord@nawe.rw` | Landlord | ID verified, can list rooms |
| `seller@nawe.rw` | Member | ID verified |
| `buyer@nawe.rw` | Member | Has a conversation and saved listings |
| `pending@nawe.rw` | Member | ID check waiting for the admin |

## Tests

```bash
cd backend && php artisan test      # 28 tests: public browsing, filters, distance, uploads, messaging, KYC
cd frontend && npm run build        # type-checks and builds
cd frontend && npm run lint
```

## Design system

Dark mode only.

| Role | Colour |
|---|---|
| Page (charcoal) | `#111111` |
| Surfaces (deep navy) | `#0A1F44`, raised `#0F2850` |
| Text (off-white) | `#F7F7F5` |
| Actions: sell, buy, rent, find | Emerald `#0B6E4F` |
| Verified badge only | Gold `#C9A227` |
| Reports and errors | Muted red `#B3261E` |

Fonts: Outfit (headings) and Plus Jakarta Sans (text). Maps use OpenStreetMap tiles; photos on the home page come from Unsplash.

## Before launch

- The terms, privacy and cookie pages are drafts written for how the app works today. Have them reviewed by a lawyer.
- OpenStreetMap's public tile server is for light use. For real traffic, use a tile provider with an API key.
- Replace the placeholder email address `support@nawe.rw` and the social links in `frontend/src/lib/contact.ts` and `frontend/src/components/shared/socials.tsx`.
- The contact form saves messages to the `contact_messages` table. Add an email notification or an admin inbox if you want to be alerted when one arrives.
