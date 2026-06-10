# Skyvora — Precision Agriculture Booking App

Drone-assisted agricultural services booking platform for farmers. Built per
[`SKYVORA_APP_SPEC.md`](./SKYVORA_APP_SPEC.md).

- **Mobile:** React Native (Expo), TypeScript, Reanimated 4 + Moti animations, Zustand, React Query, NativeStack + Bottom Tabs.
- **Backend:** Node.js 20, Express on Firebase Cloud Functions v2, Firestore, Razorpay, FCM.

## Monorepo layout

```
skyvora/
├── apps/mobile/        # Expo React Native app
└── backend/functions/  # Firebase Cloud Functions (Express API)
```

## Mobile app

```bash
cd apps/mobile
npm install
npm start           # then press a (Android) / i (iOS) / w (web)
```

Copy `.env.example` to `.env` and fill in Firebase + Razorpay + API values.

### What's implemented

- **Auth flow:** Splash (logo fade-scale + typewriter tagline + flying drone), 3-slide Onboarding, phone Login, animated 6-box OTP. _OTP is mocked — enter any 6 digits to continue._
- **Home dashboard:** greeting header, active-booking banner, animated `CountUp` stats, 2-column services grid, recent activity, promo banner, pulsing drone FAB.
- **5-step booking flow:** Location (cascading State → District → Mandal → Village searchable bottom-sheets with Fuse.js fuzzy search) → Crop & Area (chips + segmented unit control + live acre conversion) → Service selection → Date & time (calendar + slots) → Review & confirm with animated cost breakdown.
- **Payment:** method picker + mocked Razorpay checkout → confetti success screen.
- **Bookings list** with filter tabs, **Booking detail** with animated status timeline, **Reports**, **Profile/Settings**.

### Animated UI primitives (`src/components/ui/`)

21st.dev-inspired, implemented natively with Reanimated 4 + Moti:
`AnimatedButton` (shimmer), `AnimatedCard` (lift), `CountUp`, `PulseRing`, `TypewriterText`,
`FadeScale`, `OTPInput`, `ChipSelector`, `SegmentedControl`, `ServiceCard`, `SearchableDropdown`,
`StepProgress`, `StatusBadge`, `Timeline`, `SuccessBlast`, `PriceTag`, `DroneLogo`.

### Local data layer

Bookings are kept in an in-memory store (`src/store/bookingsRepo.ts`) so the app is fully
navigable without a live backend. `src/services/api.ts` contains the typed Axios client to
swap in the real Cloud Functions API.

## Backend

```bash
cd backend/functions
npm install
npm run build              # tsc → lib/
npm run serve             # Firebase emulator (functions)
npm run deploy            # firebase deploy --only functions
```

Set Razorpay secrets before deploy:

```bash
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
```

### API (all routes require a Firebase ID token: `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking (+ Razorpay order) |
| GET | `/api/bookings?status=` | List user bookings |
| GET | `/api/bookings/:id` | Booking detail |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | HMAC-verify payment + confirm booking |
| GET | `/api/reports` | List completed reports |
| GET | `/api/reports/:id` | Signed PDF download URL |

## Notes / next steps

- Wire Firebase Phone Auth in `OTPScreen` (currently mocked).
- Integrate `react-native-razorpay` in `PaymentScreen` and call `/payments/verify`.
- Expand `india_locations.json` (Telangana, AP, Maharashtra prioritized today).
- Add FCM device-token registration + push handling.
