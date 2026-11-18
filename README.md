# NAWE

**Second-hand goods, things to rent from neighbours, and rooms and houses (gueto), all in one place near you.**

Built by Steven IMANZI and BYIRINGIRO Innocent.

NAWE has two apps that share one brand and design system:

| App | Folder | Stack | Data |
|---|---|---|---|
| **Mobile app (Android)** | `mobile/` | Flutter 3, Riverpod, go_router | **Firebase only**: Authentication and Cloud Firestore |
| Web app | `frontend/` + `backend/` | React 19 + Vite, Laravel 13 | Laravel API and its own database |

The mobile app does **not** use the Laravel backend. Everything it stores lives in the Firebase project `nawe-621a6`.

```
nawe/
├── mobile/     Flutter app: clients and sellers in one app
├── firebase/   Firestore security rules, indexes and Hosting config
├── frontend/   React web app (also deployed to Firebase Hosting)
└── backend/    Laravel API used by the web app
```

---

## Mobile app

### What it does

One app, two experiences. People register as a **customer** or a **seller**, and a seller can switch between the Seller dashboard and shopping at any time.

**Everyone**
- Animated splash, three-step onboarding, sign-up, sign-in and password reset.
- Light and dark mode (or follow the phone), saved on the device.
- Home feed with categories, search with category, condition and sort filters.
- Product details: photo gallery, price, rating, seller, description and a tidy details table.
- Houses and rooms: filters for type, district and budget; details with facts, amenities, a details table and one-tap **Call** or **WhatsApp** to the owner.
- Saved items, notifications, help and support (FAQ plus a contact form), terms and privacy pages.
- **NAWE assistant**: type "a phone under 150k" or "2 bedroom house in Kicukiro" and it searches the live listings.

**Customers**
- Cart, checkout (address, phone, payment on delivery), order history and order details with a progress timeline. A pending order can be cancelled.

**Sellers**
- Dashboard with product and house counts, pending orders and delivered sales.
- Add products (photos, price, stock, details table) and houses (photos, rent, rooms, amenities).
- Listings screen with delete, sold-out status and a taken / available switch for houses.
- Customer orders with Confirm, Ship, Deliver and Cancel actions. Buyers are notified at each step.

### Design

The mobile app uses the same tokens as the web dashboard (`frontend/src/styles/index.css`), plus a light theme.

| Role | Dark | Light |
|---|---|---|
| Page | `#0D0F12` | `#F3F4F2` |
| Surface | `#16181D` | `#FFFFFF` |
| Raised surface | `#1F2229` | `#E9EAE7` |
| Text | `#F7F7F5` | `#16181D` |
| Actions, prices | Emerald `#0B6E4F` | Emerald `#0B6E4F` |
| Highlights | Gold `#C9A227` | Gold `#C9A227` |
| Errors | `#B3261E` | `#B3261E` |

Primary buttons are high-contrast pills. Cards are rounded and flat. Font: Plus Jakarta Sans. The logo and app icon come from `frontend/src/assets/brand` and `frontend/public/favicon.svg`.

### Project structure

```
mobile/lib/
├── main.dart, app.dart        entry point and MaterialApp
├── core/
│   ├── theme/                 colours, light and dark ThemeData, theme controller
│   ├── router/                go_router with sign-in and role-aware redirects
│   ├── widgets/               shared widgets (images, empty and error states, tags)
│   ├── utils/                 formatters, validators, photo compression
│   └── constants/             categories, districts, amenities
├── data/
│   ├── models/                User, Product, House, Cart item, Order, Notification
│   └── repositories/          one class per Firestore area, exposed as Riverpod providers
└── features/                  one folder per screen group
    splash, onboarding, auth, home, products, search, houses, cart, checkout,
    orders, favorites, notifications, support, legal, account, assistant, seller, shell
```

Screens read data only through providers from `data/repositories`, so Firebase calls live in one place.

### Firestore data model

| Path | Contents |
|---|---|
| `users/{uid}` | name, email, phone, address, role (`client` or `seller`) |
| `users/{uid}/cart/{productId}` | product snapshot and quantity |
| `users/{uid}/favorites/{type:id}` | saved product or house |
| `users/{uid}/notifications/{id}` | title, body, read |
| `products/{id}` | seller, title, description, price, category, condition, stock, specs, cover thumbnail |
| `products/{id}/photos/{n}` | full-size photo (compressed JPEG as a data URI) |
| `houses/{id}` | owner, rent per month, type, rooms, size, district, amenities, availability |
| `houses/{id}/photos/{n}` | full-size photo |
| `orders/{id}` | buyer, line items, `sellerIds`, total, status, delivery details |
| `tickets/{id}` | support requests |

Security rules are in `firebase/firestore.rules`. In short: users read and edit only their own profile, cart, favorites and notifications; only a seller can change their own listings; a buyer's order may only lower a product's stock; only the buyer and the sellers in an order can read it; sellers move order status forward and buyers can cancel while pending.

**Photos.** Firebase Storage needs a paid plan, so listing photos are compressed (900 px, quality 70) and kept in Firestore. A small thumbnail sits on the listing so feeds load fast; full-size photos load on the detail screen. Move them to Storage if you upgrade the plan.

### Run it

You need Flutter 3.44+, JDK 17 and an Android phone with USB debugging on.

```bash
cd mobile
flutter pub get
flutter run                     # debug build on the connected phone
flutter build apk --release     # installable APK in build/app/outputs/flutter-apk/
```

`mobile/android/app/google-services.json` holds the public Firebase client config for `nawe-621a6`. The Android package is `com.nawe.app`.

### One-time Firebase setup

1. **Authentication**: in the Firebase console open *Build, Authentication, Sign-in method* and enable **Email/Password**. Sign-up and sign-in fail with "Email sign-in is not enabled" until this is done.
2. **Rules**: deploy the security rules (they are required, without them every request is denied):

```bash
cd firebase
firebase deploy --only firestore --project nawe-621a6
```

3. **First data**: register a seller account, open *Listings*, tap the menu and choose **Add sample listings** to load demo products and houses.

### Tests

```bash
cd mobile
flutter analyze
flutter test        # assistant, validators and formatters
```

### Known limits

- Payment is on delivery. There is no online card or Mobile Money payment yet.
- The assistant is a keyword and budget matcher over your listings. It does not call an AI service.
- Cancelling an order does not put the items back in stock. Sellers can edit stock themselves.
- There is no in-app chat yet. Buyers contact house owners by phone or WhatsApp.
- The terms and privacy texts are drafts. Have a lawyer review them before launch.
- Sample listings use keyword photos from loremflickr, so images match the topic but not the exact item.

---

## Web app

- **Marketplace**: buy and sell second-hand items, or rent them out by the day, week or month. Search, filter, sort, "near me".
- **Shelter & Gueto**: rooms, studios and houses with a live map, a "houses around me" distance filter, and room, budget and amenity filters.
- **Trust**: sellers and landlords verify a national ID. An admin reviews the documents.
- **Messaging**, **wishlist**, **reports**, **contact form**, and an **admin** area.

Browsing listings is public. Messaging, saving, posting and everything under `/account` need an account.

### Run it locally

You need PHP 8.3+, Composer, Node 20+ and a database (MySQL, or SQLite for a quick start).

**API**

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

**Web app**

```bash
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

The dev server proxies `/api` and `/storage` to `http://localhost:8000`. If the API runs elsewhere:

```bash
API_TARGET=http://localhost:8001 npm run dev
```

For a build that talks to a hosted API, set `VITE_API_URL` to its origin (no trailing slash, no `/api`) before `npm run build`.

**Deploy the web app to Firebase Hosting**

```bash
cd frontend && npm run build
cd ../firebase && firebase deploy --only hosting --project nawe-621a6
```

The live web build at https://nawe-621a6.web.app needs a hosted Laravel API to show data.

### Demo accounts (after `--seed`)

All use the password `Password@123`.

| Email | Role | Notes |
|---|---|---|
| `admin@nawe.rw` | Admin | Reviews ID checks and reports at `/admin` |
| `landlord@nawe.rw` | Landlord | ID verified, can list rooms |
| `seller@nawe.rw` | Member | ID verified |
| `buyer@nawe.rw` | Member | Has a conversation and saved listings |
| `pending@nawe.rw` | Member | ID check waiting for the admin |

### Tests

```bash
cd backend && php artisan test      # 28 tests: public browsing, filters, distance, uploads, messaging, KYC
cd frontend && npm run build        # type-checks and builds
cd frontend && npm run lint
```

---

## Before launch

- The terms, privacy and cookie pages are drafts written for how the apps work today. Have them reviewed by a lawyer.
- OpenStreetMap's public tile server is for light use. For real traffic, use a tile provider with an API key.
- Replace the placeholder email address `support@nawe.rw` and the social links in `frontend/src/lib/contact.ts` and `frontend/src/components/shared/socials.tsx`.
- The web contact form saves messages to the `contact_messages` table. Mobile support requests go to the Firestore `tickets` collection. Add an email notification or an inbox if you want to be alerted when one arrives.
- Build the mobile app with a release signing key before publishing it to Google Play.
