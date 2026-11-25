# Mysa House — Vite + React

## Run locally

1. Install Node.js 20.19+ and npm.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` and open the local URL printed by Vite.

Run `npm run typecheck` to check TypeScript, `npm run build` to create a production bundle in `dist/`, and `npm run preview` to serve that bundle locally.

This is a frontend-only demo. Bookings and admin edits are stored in the current browser's localStorage. There is no shared database, payment processing, or protected staff sign-in.

## Main files

- `src/App.tsx` — customer booking, customer appointments, staff schedule, and admin views
- `src/index.css` — responsive styling and theme
- `src/main.tsx` — React entry point mounted into `index.html`
- `vite.config.ts` — Vite, React, and Tailwind CSS plugins

//Customer booking
GET /services?active=true — treatment options
GET /team?serviceId=... — therapists eligible for a treatment
GET /availability?serviceId=...&date=YYYY-MM-DD&therapistId=... — available times and alternatives; omit therapistId for “any therapist”
POST /bookings — create a booking; recheck availability on the server
GET /me/bookings — the signed-in customer’s bookings
PATCH /bookings/:bookingId — reschedule
POST /bookings/:bookingId/cancel — cancel

//Sign-in and profile
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /me
PATCH /me

//Admin appointments and reassignment
GET /admin/bookings?date=&therapistId=&serviceId=&status= — appointments and filters
PATCH /admin/bookings/:bookingId/status — update status
GET /admin/bookings/:bookingId/reassignment-options — available replacement therapists
POST /admin/bookings/:bookingId/reassign — confirm a replacement

//Admin team availability
GET /admin/team
POST /admin/team
PATCH /admin/team/:therapistId
GET /admin/team/:therapistId/availability?month=YYYY-MM
PATCH /admin/team/:therapistId/schedule — working days and hours
POST /admin/team/:therapistId/time-off — add one or more leave dates with a reason
DELETE /admin/team/:therapistId/time-off/:date

//Other frontend content and admin controls
GET /brands,
POST /admin/brands,
DELETE /admin/brands/:brandId

GET /reviews?limit=3, 
POST /bookings/:bookingId/review

GET /admin/services, 
POST /admin/services, 
PATCH /admin/services/:serviceId