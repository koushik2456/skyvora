# SKYVORA — Full-Stack Mobile App Specification
> **For Cursor AI Agents** — React Native (iOS + Android) · Node.js + Firebase Backend · 21st.dev Animated Components

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Design System & Theming](#4-design-system--theming)
5. [Navigation Architecture](#5-navigation-architecture)
6. [Screen-by-Screen Specifications](#6-screen-by-screen-specifications)
   - 6.1 Splash / Onboarding
   - 6.2 Auth (Login / Register / OTP)
   - 6.3 Home Dashboard
   - 6.4 New Booking Flow (Multi-Step)
   - 6.5 My Bookings
   - 6.6 Booking Detail
   - 6.7 Payment
   - 6.8 Reports
   - 6.9 Profile / Settings
7. [Location Data Architecture](#7-location-data-architecture)
8. [Booking Flow — Detailed Logic](#8-booking-flow--detailed-logic)
9. [Services Catalogue & Pricing](#9-services-catalogue--pricing)
10. [Backend Architecture (Node.js + Firebase)](#10-backend-architecture-nodejs--firebase)
11. [Firebase Data Models](#11-firebase-data-models)
12. [API Endpoints](#12-api-endpoints)
13. [Payment Integration](#13-payment-integration)
14. [Push Notifications](#14-push-notifications)
15. [21st.dev Animated Components — Usage Guide](#15-21stdev-animated-components--usage-guide)
16. [State Management](#16-state-management)
17. [Environment Variables](#17-environment-variables)
18. [Development Phases & Milestones](#18-development-phases--milestones)
19. [Edge Cases & Validation Rules](#19-edge-cases--validation-rules)
20. [Testing Strategy](#20-testing-strategy)

---

## 1. Project Overview

**App Name:** Skyvora
**Tagline:** Precision Agriculture at Your Fingertips
**Platform:** React Native (iOS + Android)
**Purpose:** Enable Skyvora's customers (farmers) to book drone-assisted and expert agricultural services — from pesticide spraying to soil testing — with a seamless location-first booking flow.

### Core User Journeys

1. **Farmer registers / logs in** via phone OTP
2. **Browses the Home Dashboard** — sees available services, active bookings, quick-book CTA
3. **Starts a New Booking** — walks through a guided multi-step form:
   - Step 1: Location (State → District → Mandal → Village → Farmer Name)
   - Step 2: Crop Type + Area (with unit selection)
   - Step 3: Service Selection + automatic cost calculation
   - Step 4: Date & Time preference
   - Step 5: Order Review & Confirm
4. **Pays** via Razorpay (UPI, cards, net banking)
5. **Tracks booking status** in real time
6. **Receives a service report / PDF** after completion

---

## 2. Tech Stack

### Frontend (Mobile)
| Layer | Technology |
|---|---|
| Framework | React Native 0.74+ (New Architecture enabled) |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation v6 (Native Stack + Bottom Tabs) |
| State Management | Zustand + React Query (TanStack) |
| Animations | **21st.dev components** + React Native Reanimated 3 + Moti |
| UI Components | 21st.dev component library (animated), NativeWind (Tailwind for RN) |
| Forms | React Hook Form + Zod validation |
| Location Search | Fuse.js (fuzzy search over local JSON dataset) |
| PDF Viewer | react-native-pdf |
| Storage | MMKV (fast local key-value) |
| Notifications | Firebase Cloud Messaging (FCM) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js v4 |
| Database | Firebase Firestore (primary) |
| Auth | Firebase Authentication (Phone OTP) |
| File Storage | Firebase Storage (reports, receipts) |
| Functions | Firebase Cloud Functions v2 |
| Payments | Razorpay Node SDK |
| Email | Nodemailer + Gmail SMTP (optional) |
| Push Notifications | Firebase Admin SDK (FCM) |
| Hosting | Firebase Hosting (API via Cloud Functions) |

---

## 3. Folder Structure

```
skyvora/
├── apps/
│   └── mobile/                         # React Native app
│       ├── src/
│       │   ├── assets/
│       │   │   ├── images/
│       │   │   ├── icons/
│       │   │   └── data/
│       │   │       └── india_locations.json   # State > District > Mandal > Village
│       │   ├── components/
│       │   │   ├── ui/                        # 21st.dev animated primitives
│       │   │   │   ├── AnimatedButton.tsx
│       │   │   │   ├── AnimatedCard.tsx
│       │   │   │   ├── SearchableDropdown.tsx
│       │   │   │   ├── StepProgress.tsx
│       │   │   │   ├── ServiceCard.tsx
│       │   │   │   ├── PriceTag.tsx
│       │   │   │   └── StatusBadge.tsx
│       │   │   ├── booking/
│       │   │   │   ├── LocationStep.tsx
│       │   │   │   ├── CropAreaStep.tsx
│       │   │   │   ├── ServiceStep.tsx
│       │   │   │   ├── DateStep.tsx
│       │   │   │   └── ReviewStep.tsx
│       │   │   └── common/
│       │   │       ├── Header.tsx
│       │   │       ├── BottomSheet.tsx
│       │   │       └── LoadingOverlay.tsx
│       │   ├── screens/
│       │   │   ├── auth/
│       │   │   │   ├── SplashScreen.tsx
│       │   │   │   ├── OnboardingScreen.tsx
│       │   │   │   ├── LoginScreen.tsx
│       │   │   │   └── OTPScreen.tsx
│       │   │   ├── home/
│       │   │   │   └── HomeScreen.tsx
│       │   │   ├── booking/
│       │   │   │   ├── NewBookingScreen.tsx
│       │   │   │   ├── BookingListScreen.tsx
│       │   │   │   └── BookingDetailScreen.tsx
│       │   │   ├── payment/
│       │   │   │   ├── PaymentScreen.tsx
│       │   │   │   └── PaymentSuccessScreen.tsx
│       │   │   ├── reports/
│       │   │   │   └── ReportsScreen.tsx
│       │   │   └── profile/
│       │   │       └── ProfileScreen.tsx
│       │   ├── navigation/
│       │   │   ├── RootNavigator.tsx
│       │   │   ├── AuthNavigator.tsx
│       │   │   └── AppNavigator.tsx (Bottom Tabs)
│       │   ├── store/
│       │   │   ├── authStore.ts
│       │   │   ├── bookingStore.ts
│       │   │   └── locationStore.ts
│       │   ├── hooks/
│       │   │   ├── useLocationSearch.ts
│       │   │   ├── useBooking.ts
│       │   │   └── useAuth.ts
│       │   ├── services/
│       │   │   ├── api.ts              # Axios instance
│       │   │   ├── firebase.ts
│       │   │   └── razorpay.ts
│       │   ├── utils/
│       │   │   ├── pricing.ts
│       │   │   ├── areaConverter.ts
│       │   │   └── validators.ts
│       │   └── constants/
│       │       ├── services.ts
│       │       └── theme.ts
│       ├── App.tsx
│       ├── package.json
│       └── tsconfig.json
│
└── backend/
    ├── functions/
    │   ├── src/
    │   │   ├── bookings/
    │   │   │   ├── createBooking.ts
    │   │   │   ├── updateBooking.ts
    │   │   │   └── getBookings.ts
    │   │   ├── payments/
    │   │   │   ├── createOrder.ts
    │   │   │   └── verifyPayment.ts
    │   │   ├── notifications/
    │   │   │   └── sendPush.ts
    │   │   ├── reports/
    │   │   │   └── generateReport.ts
    │   │   └── index.ts               # Express app entry
    │   ├── package.json
    │   └── tsconfig.json
    └── firebase.json
```

---

## 4. Design System & Theming

### Color Palette
```ts
// src/constants/theme.ts
export const Colors = {
  primary:      '#1A6B3C',   // Deep agricultural green — brand primary
  primaryLight: '#2E9E5B',   // Lighter green for CTAs
  secondary:    '#F5A623',   // Harvest amber — accents, highlights
  danger:       '#E84040',   // Errors, cancellations
  success:      '#27AE60',   // Confirmations, success states
  warning:      '#F39C12',   // Pending states
  background:   '#F4F7F5',   // Off-white green tint
  surface:      '#FFFFFF',
  surfaceAlt:   '#EEF4F0',   // Card backgrounds
  textPrimary:  '#1A2E23',   // Near-black green tint
  textSecondary:'#5A7565',
  textMuted:    '#9EB5A5',
  border:       '#D5E5DC',
  sky:          '#3B82F6',   // Drone/sky element
}
```

### Typography
```ts
export const Typography = {
  fontDisplay:  'Poppins-Bold',       // Headers, service names
  fontBody:     'Inter-Regular',      // Body copy
  fontMono:     'JetBrainsMono',      // Prices, area values
  sizes: {
    xs: 11, sm: 13, base: 15, md: 17,
    lg: 20, xl: 24, '2xl': 30, '3xl': 38,
  }
}
```

### Spacing Scale
```ts
export const Spacing = {
  xs: 4, sm: 8, md: 12, base: 16,
  lg: 20, xl: 24, '2xl': 32, '3xl': 48
}
```

### Border Radius
```ts
export const Radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 }
```

---

## 5. Navigation Architecture

```
RootNavigator
├── AuthNavigator (Stack)  — shown when user not authenticated
│   ├── SplashScreen
│   ├── OnboardingScreen
│   ├── LoginScreen
│   └── OTPScreen
│
└── AppNavigator (Bottom Tab Navigator)  — shown when authenticated
    ├── Tab: Home          → HomeScreen
    ├── Tab: Bookings      → BookingListScreen
    ├── Tab: + (FAB)       → NewBookingScreen (Stack starts here)
    │                          ├── Step1: LocationStep
    │                          ├── Step2: CropAreaStep
    │                          ├── Step3: ServiceStep
    │                          ├── Step4: DateStep
    │                          └── Step5: ReviewStep
    │                              └── PaymentScreen
    │                                  └── PaymentSuccessScreen
    ├── Tab: Reports       → ReportsScreen
    └── Tab: Profile       → ProfileScreen
```

### Bottom Tab Icons
- Home: house icon
- Bookings: clipboard-list icon
- + (center FAB): drone icon (animated pulse) — this is the primary CTA
- Reports: file-text icon
- Profile: user-circle icon

---

## 6. Screen-by-Screen Specifications

---

### 6.1 Splash Screen
- Full-screen green gradient (`#1A6B3C` → `#2E9E5B`)
- Skyvora logo fades + scales in using **21st.dev `FadeScale` animation**
- Tagline "Precision Agriculture at Your Fingertips" types in using **21st.dev `TypewriterText`**
- After 2.5s: check auth state → navigate accordingly
- **Lottie animation:** drone flying across screen (bottom to top, subtle)

---

### 6.2 Auth — Login Screen
**Layout:**
- Hero image: drone over green farmland (top 40% of screen)
- "Welcome to Skyvora" heading
- Phone number input with country code selector (+91 default)
- "Send OTP" button — **21st.dev `AnimatedButton` with shimmer effect on press**
- Terms & Privacy link at bottom

**OTP Screen:**
- 6-digit OTP input — individual boxes, auto-focus next on input
- **21st.dev `OTPInput` animated component**
- Resend OTP countdown timer (30s)
- On success: navigate to Home (or Onboarding if first time)

**Validation:**
- Phone: exactly 10 digits (Indian format), non-empty
- OTP: 6 digits

---

### 6.3 Home Dashboard

**Header:**
- "Good morning, [Farmer Name]" greeting with weather icon (based on location)
- Notification bell icon (badge if unread)
- Small Skyvora logo

**Sections (vertical scroll):**

1. **Active Booking Banner** (if any) — animated card with status indicator
   - Service name, location, scheduled date, status badge
   - "Track Booking" CTA

2. **Quick Stats Row** (3 cards, horizontal scroll)
   - Total Bookings | Acres Serviced | Reports Ready
   - **21st.dev `CountUp` animated numbers**

3. **Services Grid** — "Our Services" heading
   - 2-column grid of service cards
   - Each card: icon + name + price per acre
   - **21st.dev `AnimatedCard` with lift-on-press effect**
   - Tapping a service card pre-selects it and jumps to New Booking Step 3

4. **Recent Bookings** — "Recent Activity" heading
   - Last 3 bookings as list items
   - Status badge (Pending / Confirmed / In Progress / Completed / Cancelled)
   - "View All" link

5. **Promotional Banner** (optional) — seasonal offer, scrollable horizontally
   - **21st.dev `Carousel` animated component**

**Floating Action Button (center tab):**
- Drone icon with green background
- Animated pulse ring using **21st.dev `PulseRing`**
- Tapping opens New Booking flow

---

### 6.4 New Booking Flow (Multi-Step)

Persistent **`StepProgress` bar** at the top (5 steps). Animated fill using Reanimated.

---

#### Step 1: Location

**Fields (each is a searchable dropdown/autocomplete):**

| Field | Data Source | Behavior |
|---|---|---|
| State | `india_locations.json` — top-level keys | Searchable dropdown, all Indian states |
| District | Filtered by selected State | Re-renders when state changes; cleared if state changes |
| Mandal | Filtered by selected District | Re-renders when district changes |
| Village | Filtered by selected Mandal | Re-renders when mandal changes |
| Farmer Name | Free text input | Min 2 chars, max 80 chars |

**SearchableDropdown Component behavior:**
- On focus: opens a **bottom sheet** (using `@gorhom/bottom-sheet`)
- At top of sheet: search input with clear button
- List: `FlatList` of matching items, highlighted match using Fuse.js
- Selecting an item: closes sheet, fills field with animation
- Each field shows placeholder until parent field is selected
- **21st.dev `AnimatedDropdown`** for open/close transition

**UI details:**
- Each field row: label + selected value chip + chevron icon
- Completed fields show a green checkmark
- Incomplete dependent fields appear greyed out with "Select [Parent] first"

**Navigation:**
- "Next" button disabled until ALL 5 fields are filled
- Back arrow returns to previous step (or exits booking with confirmation dialog)

---

#### Step 2: Crop Type & Area

**Crop Type:**
- Horizontal scrollable chip list of crop types
- Chips: Rice, Wheat, Cotton, Sugarcane, Maize, Soybean, Groundnut, Chilli, Turmeric, Onion, Tomato, Mango, Banana, Coconut, Other
- "Other" chip reveals a text input
- **21st.dev `ChipSelector` animated selection effect**

**Area Input:**
- Numeric input (decimal allowed)
- Unit Selector (toggle/segmented):
  - Acres
  - Guntas
  - Square Feet (Sq.ft)
  - Square Meters (Sq.m)
  - Cents
  - Hectares
- **21st.dev `SegmentedControl` animated component**
- Display: show auto-converted value in Acres (canonical unit for pricing)
  - e.g., "40 Guntas = 1.0 Acres"
- Min area: 0.25 Acres equivalent; Max: 500 Acres equivalent
- Area conversion constants (see Section 8)

---

#### Step 3: Service Selection

**Layout:**
- Heading: "Select Service"
- Scrollable list of service cards (single-select)
- Each card shows:
  - Icon (drone, leaf, flask, ruler, water-drop, soil icons)
  - Service Name
  - Short description (1 line)
  - Price per Acre (e.g., ₹450/acre)
  - If selected: green border + checkmark, **21st.dev `SelectPulse` animation**

**At bottom (sticky):**
- Selected service summary
- Calculated total: `service_rate × area_in_acres`
- "Next" button

**Services list** (see Section 9 for full details):
1. Spray Pesticide — ₹450/acre
2. Spray Fertilizer — ₹450/acre
3. Crop Management — ₹350/acre
4. Land Survey — ₹350/acre
5. Water Management — ₹350/acre
6. Land & Soil Testing — ₹350/acre
7. Fertilizer Requirement Report — ₹350/acre

---

#### Step 4: Date & Time Preference

**Calendar:**
- Inline calendar using `react-native-calendars`
- Disabled: past dates, Sundays, public holidays
- Selected date highlights in brand green
- **21st.dev `CalendarFade` transition**

**Time Slot:**
- Morning: 6:00 AM – 11:00 AM
- Afternoon: 11:00 AM – 2:00 PM
- Evening: 2:00 PM – 5:00 PM
- Radio buttons with animated selection
- Note: "Actual time will be confirmed by our team"

**Special Instructions:**
- Optional multiline text input (max 300 chars)
- Character counter

---

#### Step 5: Review & Confirm

**Summary Card layout:**

```
┌─────────────────────────────────┐
│  📍 LOCATION                    │
│  Telangana > Khammam > Yellandu │
│  Mandal > Village               │
│  Farmer: [Name]                 │
├─────────────────────────────────┤
│  🌾 CROP & AREA                 │
│  Cotton · 3.5 Acres             │
├─────────────────────────────────┤
│  🚁 SERVICE                     │
│  Spray Pesticide                │
├─────────────────────────────────┤
│  📅 SCHEDULE                    │
│  15 June 2025 · Morning         │
├─────────────────────────────────┤
│  💰 COST BREAKDOWN              │
│  3.5 acres × ₹450 = ₹1,575     │
│  GST (18%):          ₹283.50   │
│  ─────────────────────────────  │
│  TOTAL:              ₹1,858.50  │
└─────────────────────────────────┘
```

- "Edit" buttons on each section row → navigate back to that step
- "Confirm & Pay" primary button → navigate to Payment Screen
- **21st.dev `SummaryReveal` — each section animates in on mount**

---

### 6.5 My Bookings

**Filter Tabs (horizontal scroll):**
All | Pending | Confirmed | In Progress | Completed | Cancelled

**Booking Card (per item):**
- Booking ID (short: `SKY-XXXXXX`)
- Service name + icon
- Location (Village, District)
- Date
- Area + Total Amount
- Status badge (color-coded)
- "View Details" button

**Empty state:** Illustration + "No bookings yet" + "Book a Service" CTA button

**Pull to refresh** supported.

---

### 6.6 Booking Detail

**Top section:**
- Booking ID, status badge, created date
- Large service icon

**Info sections (accordion-style):**
1. Location Details
2. Crop & Area Details
3. Service & Schedule
4. Team Assigned (shown once confirmed — agent name + phone)
5. Payment Info (amount, payment ID, status)

**Action buttons (context-sensitive):**
- If Pending: "Cancel Booking" (with confirmation dialog)
- If Completed: "Download Report" (PDF)
- Any status: "Contact Support" (opens WhatsApp or phone)

**Status Timeline:**
```
● Booking Placed
● Payment Confirmed
● Team Assigned
● Service In Progress
● Completed
```
Animated progress indicator using Reanimated.
**21st.dev `Timeline` animated component**

---

### 6.7 Payment Screen

- Booking summary at top (service, total)
- Razorpay Web View / SDK
- On success: POST to backend to verify payment signature
- On failure: retry option

**PaymentSuccessScreen:**
- Full-screen success animation (**21st.dev `SuccessBlast` confetti**)
- Booking ID displayed
- "View Booking" and "Go Home" buttons
- Auto-redirect to Home after 5s

---

### 6.8 Reports Screen

**List of completed service reports:**
- Sorted by date (newest first)
- Each item: service name, date, location, "View PDF" button
- PDF opens with `react-native-pdf` in-app viewer
- "Download" button saves to device gallery/files

**Empty state:** "Your service reports will appear here after completion"

---

### 6.9 Profile / Settings

**Profile Card:**
- Avatar (initials if no photo) with edit option
- Farmer name, phone number (verified badge)
- Member since date

**Settings Sections:**
1. **My Farm** — default location, default crop, farm size
2. **Notifications** — toggle: SMS alerts, Push notifications, Booking reminders
3. **Language** — Telugu, Hindi, English
4. **Support** — Call Support, WhatsApp Chat, FAQs
5. **Legal** — Terms of Service, Privacy Policy
6. **App Version** — current version
7. **Logout** — with confirmation

---

## 7. Location Data Architecture

### JSON Structure (`india_locations.json`)

```json
{
  "states": [
    {
      "id": "TG",
      "name": "Telangana",
      "districts": [
        {
          "id": "TG_KHM",
          "name": "Khammam",
          "mandals": [
            {
              "id": "TG_KHM_YLD",
              "name": "Yellandu",
              "villages": [
                { "id": "TG_KHM_YLD_001", "name": "Bhadrachalam" },
                { "id": "TG_KHM_YLD_002", "name": "Kothagudem" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Fuzzy Search Hook (`useLocationSearch.ts`)

```ts
import Fuse from 'fuse.js'

export function useLocationSearch<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  const fuse = useMemo(() => new Fuse(items, {
    keys: ['name'],
    threshold: 0.35,
    minMatchCharLength: 1,
  }), [items])

  return query.length > 0
    ? fuse.search(query).map(r => r.item)
    : items
}
```

### Data Loading Strategy
- JSON is bundled in the app — no network required for location selection
- `locationStore.ts` (Zustand) holds the cascading selections
- Each level clears downstream selections on change:
  - state change → clear district, mandal, village
  - district change → clear mandal, village
  - mandal change → clear village

---

## 8. Booking Flow — Detailed Logic

### Area Unit Conversion (to Acres)

```ts
// src/utils/areaConverter.ts
export const toAcres = (value: number, unit: AreaUnit): number => {
  const conversions: Record<AreaUnit, number> = {
    acres:        1,
    guntas:       1 / 40,        // 40 guntas = 1 acre
    sqft:         1 / 43560,     // 43,560 sqft = 1 acre
    sqm:          1 / 4046.86,   // 4046.86 sqm = 1 acre
    cents:        1 / 100,       // 100 cents = 1 acre
    hectares:     2.47105,       // 1 hectare = 2.47105 acres
  }
  return parseFloat((value * conversions[unit]).toFixed(4))
}
```

### Price Calculation

```ts
// src/utils/pricing.ts
const GST_RATE = 0.18

export function calculateBookingCost(
  serviceId: string,
  areaInAcres: number
): { base: number; gst: number; total: number } {
  const rate = SERVICE_RATES[serviceId]          // e.g., 450
  const base = parseFloat((rate * areaInAcres).toFixed(2))
  const gst  = parseFloat((base * GST_RATE).toFixed(2))
  return { base, gst, total: parseFloat((base + gst).toFixed(2)) }
}
```

### Booking State Machine

```
DRAFT → PENDING_PAYMENT → PAYMENT_CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED
                        ↘ PAYMENT_FAILED
PENDING_PAYMENT → CANCELLED (by user)
PAYMENT_CONFIRMED → CANCELLED (by admin, with refund)
```

---

## 9. Services Catalogue & Pricing

```ts
// src/constants/services.ts
export const SERVICES = [
  {
    id: 'spray_pesticide',
    name: 'Spray Pesticide',
    description: 'Drone-assisted pesticide spraying for precise pest control',
    icon: 'spray-can',
    ratePerAcre: 450,
    unit: 'acre',
    color: '#E74C3C',
    estimatedDuration: '1-2 hours/acre',
  },
  {
    id: 'spray_fertilizer',
    name: 'Spray Fertilizer',
    description: 'Uniform liquid fertilizer application via drone',
    icon: 'leaf',
    ratePerAcre: 450,
    unit: 'acre',
    color: '#27AE60',
    estimatedDuration: '1-2 hours/acre',
  },
  {
    id: 'crop_management',
    name: 'Crop Management',
    description: 'Expert advisory and monitoring for optimal crop yield',
    icon: 'seedling',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#2ECC71',
    estimatedDuration: '2-3 hours/visit',
  },
  {
    id: 'land_survey',
    name: 'Land Survey',
    description: 'Aerial drone survey with precise acreage mapping',
    icon: 'map',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#3498DB',
    estimatedDuration: '1 hour/5 acres',
  },
  {
    id: 'water_management',
    name: 'Water Management',
    description: 'Irrigation planning and water usage optimization',
    icon: 'droplets',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#1ABC9C',
    estimatedDuration: '2-4 hours/farm',
  },
  {
    id: 'soil_testing',
    name: 'Land & Soil Testing',
    description: 'Comprehensive soil health analysis and report',
    icon: 'flask',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#8B4513',
    estimatedDuration: '3-5 days (lab analysis)',
  },
  {
    id: 'fertilizer_report',
    name: 'Fertilizer Requirement Report',
    description: 'Personalized fertilizer plan based on soil and crop data',
    icon: 'file-chart',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#F39C12',
    estimatedDuration: '2-3 days (report delivery)',
  },
]

export const SERVICE_RATES: Record<string, number> = Object.fromEntries(
  SERVICES.map(s => [s.id, s.ratePerAcre])
)
```

---

## 10. Backend Architecture (Node.js + Firebase)

### Overview

```
Mobile App (React Native)
        │
        ▼
Firebase Auth (Phone OTP) ──────────────────────────────────┐
        │                                                     │
        ▼                                                     │
Cloud Functions (Express.js API)                             │
        │                                                     │
        ├── /bookings  ──────────────── Firestore            │
        ├── /payments  ──────────────── Razorpay API         │
        ├── /reports   ──────────────── Firebase Storage     │
        └── /notifications ──────────── FCM                  │
                                                              │
Firebase Auth Token validated on every protected route ──────┘
```

### Authentication Flow

1. User enters phone → Firebase Auth `signInWithPhoneNumber`
2. OTP sent by Firebase via SMS
3. User enters OTP → Firebase verifies → returns ID token
4. All subsequent API calls include: `Authorization: Bearer <idToken>`
5. Backend middleware validates token via `admin.auth().verifyIdToken()`

### Express App Entry (`functions/src/index.ts`)

```ts
import express from 'express'
import cors from 'cors'
import { bookingRoutes } from './bookings'
import { paymentRoutes } from './payments'
import { reportRoutes } from './reports'
import { authMiddleware } from './middleware/auth'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// All routes below require valid Firebase ID token
app.use('/api', authMiddleware)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reports', reportRoutes)

export const api = functions.https.onRequest(app)
```

---

## 11. Firebase Data Models

### Collection: `users`
```ts
interface UserDoc {
  uid: string
  phone: string           // +91XXXXXXXXXX
  name: string
  defaultState?: string
  defaultDistrict?: string
  defaultMandal?: string
  defaultVillage?: string
  fcmToken?: string
  language: 'en' | 'te' | 'hi'
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection: `bookings`
```ts
interface BookingDoc {
  bookingId: string           // SKY-XXXXXX (auto-generated)
  userId: string
  
  // Location
  state: string
  district: string
  mandal: string
  village: string
  farmerName: string
  
  // Crop & Area
  cropType: string
  areaValue: number           // as entered by user
  areaUnit: AreaUnit
  areaInAcres: number         // canonical, computed
  
  // Service
  serviceId: string
  serviceName: string
  ratePerAcre: number
  
  // Schedule
  preferredDate: string       // ISO date string
  preferredSlot: 'morning' | 'afternoon' | 'evening'
  specialInstructions?: string
  
  // Pricing
  baseAmount: number
  gstAmount: number
  totalAmount: number
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  
  // Booking Status
  status: BookingStatus       // see state machine above
  
  // Operations
  assignedAgent?: {
    name: string
    phone: string
  }
  
  // Report
  reportUrl?: string          // Firebase Storage URL
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection: `notifications`
```ts
interface NotificationDoc {
  userId: string
  title: string
  body: string
  type: 'booking_update' | 'payment' | 'report_ready' | 'promo'
  bookingId?: string
  read: boolean
  createdAt: Timestamp
}
```

---

## 12. API Endpoints

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking (returns bookingId + Razorpay orderId) |
| GET | `/api/bookings` | List user's bookings (paginated, filterable by status) |
| GET | `/api/bookings/:bookingId` | Get booking detail |
| PATCH | `/api/bookings/:bookingId/cancel` | Cancel booking |

**POST `/api/bookings` request body:**
```json
{
  "state": "Telangana",
  "district": "Khammam",
  "mandal": "Yellandu",
  "village": "Kothagudem",
  "farmerName": "Ravi Kumar",
  "cropType": "Cotton",
  "areaValue": 40,
  "areaUnit": "guntas",
  "serviceId": "spray_pesticide",
  "preferredDate": "2025-06-15",
  "preferredSlot": "morning",
  "specialInstructions": "Field has a pond on east side"
}
```

**Response:**
```json
{
  "bookingId": "SKY-A3B7C1",
  "totalAmount": 1858.50,
  "razorpayOrderId": "order_XXXXXXXXXXXXX",
  "currency": "INR"
}
```

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature + update booking |

**POST `/api/payments/verify` body:**
```json
{
  "bookingId": "SKY-A3B7C1",
  "razorpayOrderId": "order_XXX",
  "razorpayPaymentId": "pay_XXX",
  "razorpaySignature": "HMAC_SIGNATURE"
}
```

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | List user's reports |
| GET | `/api/reports/:bookingId` | Get signed download URL for PDF |

---

## 13. Payment Integration

### Razorpay Setup

```bash
# Backend
npm install razorpay

# Mobile
npm install react-native-razorpay
```

### Payment Flow

```
1. User taps "Confirm & Pay" on Review screen
2. App calls POST /api/bookings → gets razorpayOrderId
3. App opens Razorpay checkout (react-native-razorpay SDK)
4. User pays via UPI / Card / Net Banking / Wallet
5. Razorpay returns { razorpayPaymentId, razorpayOrderId, razorpaySignature }
6. App calls POST /api/payments/verify with all three values
7. Backend: HMAC-SHA256 verify signature
   expected = hmac(razorpayOrderId + "|" + razorpayPaymentId, secret)
8. If valid: update booking status → PAYMENT_CONFIRMED
9. Send push notification to user
10. App navigates to PaymentSuccessScreen
```

### Razorpay Checkout Config

```ts
const options = {
  description: `Skyvora - ${serviceName}`,
  image: 'https://your-logo-url.png',
  currency: 'INR',
  key: RAZORPAY_KEY_ID,
  amount: totalAmount * 100,        // paise
  name: 'Skyvora',
  order_id: razorpayOrderId,
  prefill: {
    email: '',
    contact: userPhone,
    name: farmerName,
  },
  theme: { color: '#1A6B3C' },
}
```

---

## 14. Push Notifications

### Triggers & Templates

| Event | Title | Body |
|---|---|---|
| Booking confirmed (payment done) | "Booking Confirmed! ✅" | "Your booking SKY-XXXXXX for [Service] has been confirmed." |
| Team assigned | "Team Assigned 👨‍🌾" | "[Agent Name] will visit on [Date] in the [Slot] slot." |
| Service in progress | "Service Started 🚁" | "Your [Service] is currently underway at [Village]." |
| Service completed | "Service Completed ✅" | "Your [Service] is done! Report will be available shortly." |
| Report ready | "Your Report is Ready 📄" | "Your service report for [Service] is ready to download." |
| Booking cancelled | "Booking Cancelled" | "Booking SKY-XXXXXX has been cancelled. Refund in 5-7 days." |

### Implementation (Cloud Function)

```ts
// functions/src/notifications/sendPush.ts
export async function sendBookingNotification(
  userId: string,
  type: NotificationType,
  booking: BookingDoc
) {
  const userDoc = await db.collection('users').doc(userId).get()
  const fcmToken = userDoc.data()?.fcmToken
  if (!fcmToken) return

  const { title, body } = getNotificationTemplate(type, booking)
  
  await admin.messaging().send({
    token: fcmToken,
    notification: { title, body },
    data: { bookingId: booking.bookingId, type },
    android: { priority: 'high' },
    apns: { payload: { aps: { sound: 'default', badge: 1 } } }
  })

  // Also save to notifications collection
  await db.collection('notifications').add({
    userId, title, body, type,
    bookingId: booking.bookingId,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })
}
```

---

## 15. 21st.dev Animated Components — Usage Guide

> All animated components should be sourced from **21st.dev**. Use the 21st.dev CLI or copy components directly from their registry.

### Installation

```bash
npx shadcn@latest add "https://21st.dev/r/[component-name]"
```

### Components to Use Per Screen

| Screen / Component | 21st.dev Component | Notes |
|---|---|---|
| Splash logo reveal | `FadeScale` | scale 0.7→1.0, opacity 0→1, spring |
| Splash tagline | `TypewriterText` | character-by-character reveal |
| Send OTP button | `AnimatedButton` with shimmer | shimmer sweep on press |
| OTP input boxes | `OTPInput` | 6 individual boxes, auto-jump |
| Home stat counters | `CountUp` | animate from 0 to value on mount |
| Home service cards | `AnimatedCard` | lift + shadow on press |
| Home drone FAB | `PulseRing` | repeating green pulse |
| Booking step progress | Custom with Reanimated | animated fill bar |
| Location dropdown | `AnimatedDropdown` | spring open/close with bottom sheet |
| Crop chip selector | `ChipSelector` | scale + color pop on select |
| Area unit selector | `SegmentedControl` | sliding indicator |
| Service card select | `SelectPulse` | green border + checkmark animation |
| Calendar transition | `CalendarFade` | fade between months |
| Review step reveal | `SummaryReveal` | staggered section entrance |
| Booking timeline | `Timeline` | progressive dot fill |
| Payment success | `SuccessBlast` | confetti + checkmark pop |
| Status badge | `StatusBadge` | pulse for in-progress states |
| Loading overlay | `SpinnerOverlay` | full-screen with blur |

### General Animation Principles

- Use **spring animations** (not timing) for all interactive elements
- Entrance animations: `opacity: 0→1` + `translateY: 20→0`
- Stagger list items by 50ms increments
- Respect `useReducedMotion` — disable animations if user has reduced motion ON
- Keep animation durations: micro (100-150ms), standard (250-350ms), entrance (400-500ms)

---

## 16. State Management

### Zustand Stores

**`authStore.ts`**
```ts
interface AuthStore {
  user: User | null
  idToken: string | null
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}
```

**`bookingStore.ts`** — holds multi-step form state
```ts
interface BookingStore {
  // Step 1
  state: string | null
  district: string | null
  mandal: string | null
  village: string | null
  farmerName: string
  
  // Step 2
  cropType: string | null
  areaValue: number | null
  areaUnit: AreaUnit
  areaInAcres: number | null
  
  // Step 3
  serviceId: string | null
  
  // Step 4
  preferredDate: string | null
  preferredSlot: TimeSlot | null
  specialInstructions: string
  
  // Derived
  costBreakdown: CostBreakdown | null
  
  // Actions
  setLocationField: (field, value) => void
  setCropArea: (crop, value, unit) => void
  setService: (serviceId) => void
  setSchedule: (date, slot) => void
  resetBooking: () => void
}
```

**`locationStore.ts`**
```ts
interface LocationStore {
  allStates: State[]
  selectedState: State | null
  availableDistricts: District[]
  selectedDistrict: District | null
  availableMandals: Mandal[]
  selectedMandal: Mandal | null
  availableVillages: Village[]
  selectedVillage: Village | null
  setSelectedState: (state: State) => void
  setSelectedDistrict: (district: District) => void
  setSelectedMandal: (mandal: Mandal) => void
  setSelectedVillage: (village: Village) => void
  reset: () => void
}
```

### React Query Usage

- `useQuery(['bookings', userId])` — list of bookings
- `useQuery(['booking', bookingId])` — single booking detail
- `useMutation(createBooking)` — create booking
- `useMutation(cancelBooking)` — cancel booking
- `useMutation(verifyPayment)` — verify Razorpay payment
- Stale time: 60 seconds for bookings list; 30 seconds for single booking

---

## 17. Environment Variables

### Mobile App (`.env`)
```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=skyvora-app
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
API_BASE_URL=https://us-central1-skyvora-app.cloudfunctions.net/api
```

### Backend (`functions/.env`)
```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_PROJECT_ID=skyvora-app
```

---

## 18. Development Phases & Milestones

### Phase 1 — Foundation (Week 1-2)
- [ ] Project setup: RN + TypeScript + ESLint + Prettier
- [ ] Firebase project creation + Auth setup
- [ ] Navigation skeleton (all screens stubbed)
- [ ] Design system / theme tokens
- [ ] `india_locations.json` dataset (all states, prioritize Telangana, Andhra Pradesh, Maharashtra)
- [ ] 21st.dev component library setup

### Phase 2 — Auth & Home (Week 2-3)
- [ ] Splash + Onboarding screens
- [ ] Phone OTP login flow (Firebase)
- [ ] Home Dashboard (static data)
- [ ] Bottom tab navigation
- [ ] Push notification setup (FCM)

### Phase 3 — Booking Flow (Week 3-5)
- [ ] Zustand booking store
- [ ] Step 1: Location step with SearchableDropdown + Fuse.js
- [ ] Step 2: Crop & Area step with unit conversion
- [ ] Step 3: Service selection + pricing
- [ ] Step 4: Date & time picker
- [ ] Step 5: Review screen
- [ ] Backend: POST /api/bookings endpoint
- [ ] Firestore booking creation

### Phase 4 — Payments (Week 5-6)
- [ ] Razorpay integration (backend order creation)
- [ ] react-native-razorpay SDK
- [ ] Payment verification endpoint
- [ ] Success/failure screens
- [ ] Booking status update on payment

### Phase 5 — Bookings & Reports (Week 6-7)
- [ ] My Bookings screen with filter tabs
- [ ] Booking Detail with status timeline
- [ ] Reports screen
- [ ] PDF viewer integration
- [ ] Cancel booking flow

### Phase 6 — Polish & Launch Prep (Week 7-8)
- [ ] All 21st.dev animations integrated
- [ ] Telugu / Hindi language support (i18n)
- [ ] Push notification templates (all events)
- [ ] Error handling + offline states
- [ ] Profile / Settings screen
- [ ] Performance profiling (Hermes, FlatList optimization)
- [ ] App icons, splash screens (iOS + Android)
- [ ] App Store / Play Store metadata
- [ ] Firebase Security Rules review
- [ ] Testing (unit + E2E with Detox)

---

## 19. Edge Cases & Validation Rules

### Booking Form
- Cannot book a date more than 30 days in advance
- Cannot book same service + same location + overlapping date (show warning)
- Area must be ≥ 0.25 acres (or equivalent) and ≤ 500 acres
- Farmer name: 2-80 characters, no special characters except spaces and dots
- If user navigates back on Step 3+, form state is preserved

### Payments
- If Razorpay SDK fails to load: show fallback "Contact us to book" message
- Payment timeout (>10 min): auto-cancel order, redirect to bookings
- Double-payment prevention: check booking payment status before opening Razorpay
- Refund: admin-side only (not in-app); show "Contact support" for refund requests

### Location Cascading
- If `india_locations.json` for a mandal has no villages: show free-text village input
- Search is case-insensitive and accent-insensitive

### Network
- All API calls: show loading state, error state, retry button
- Booking form data: persist to MMKV on each step so it survives app kill/restart
- Offline banner when no internet: "You're offline. Bookings require internet."

---

## 20. Testing Strategy

### Unit Tests (Jest + Testing Library)
- `areaConverter.ts` — all unit conversions
- `pricing.ts` — cost calculations with GST
- `useLocationSearch` hook — fuzzy search results
- Zustand stores — state transitions

### Integration Tests
- Booking creation flow (mock Firebase + Razorpay)
- Payment verification (HMAC signature test vectors)

### E2E Tests (Detox)
- Full booking flow: login → location → crop → service → date → review → mock payment
- Cancel booking flow
- View report PDF

### Manual QA Checklist
- [ ] OTP login on real device (iOS + Android)
- [ ] Location search with Telugu names
- [ ] Razorpay UPI on Android
- [ ] Offline mode behavior
- [ ] Push notification receipt
- [ ] PDF download on both platforms
- [ ] Back navigation on all booking steps
- [ ] Area unit conversions display correctly

---

## Quick Reference Card for Cursor Agent

### When creating a new screen:
1. Create file in `src/screens/[section]/[Name]Screen.tsx`
2. Add to navigator in `src/navigation/`
3. Use `Colors`, `Typography`, `Spacing` from `src/constants/theme.ts`
4. Wrap content in `<SafeAreaView>` + `<ScrollView>` unless it's a list (use `FlatList`)
5. Animations: import from `src/components/ui/` (21st.dev wrappers)

### When creating a new API endpoint:
1. Add route handler in `backend/functions/src/[section]/`
2. Register in `backend/functions/src/index.ts`
3. Validate Firebase ID token via `authMiddleware`
4. Use Zod for request body validation
5. Update `src/services/api.ts` in mobile with the new endpoint

### Naming Conventions
- Screens: `PascalCase` + `Screen` suffix
- Components: `PascalCase`
- Hooks: `camelCase` + `use` prefix
- Stores: `camelCase` + `Store` suffix
- Constants: `SCREAMING_SNAKE_CASE`
- Firestore collections: `camelCase` plural (`bookings`, `users`, `notifications`)

---

*This document is the single source of truth for Skyvora app development. All implementation decisions should reference this spec. Last updated: June 2025.*
