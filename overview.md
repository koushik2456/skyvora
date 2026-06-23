Skyvora is a drone-assisted precision agriculture booking platform that enables farmers to book agricultural drone services through a mobile application. The platform streamlines the process of scheduling drone-based farming operations such as crop spraying, monitoring, and agricultural surveys. It includes a farmer-friendly mobile app, payment integration, booking management, and a cloud-based backend.

Objective

The main goal of Skyvora is to connect farmers with agricultural drone services through a digital platform, making precision farming more accessible, efficient, and easier to manage.

Technology Stack
Mobile Application
React Native (Expo)
TypeScript
Reanimated 4
Moti Animations
Zustand (State Management)
React Query
Native Stack Navigation
Bottom Tabs Navigation
Backend
Node.js 20
Express.js
Firebase Cloud Functions v2
Firestore Database
Razorpay Payment Gateway
Firebase Cloud Messaging (FCM)
Major Features
1. User Authentication
Splash screen with animated drone branding
Onboarding screens
Phone number login
OTP verification flow (mock implementation)
2. Farmer Dashboard
Personalized greeting
Active booking banner
Statistics dashboard
Agricultural services grid
Recent activities
Promotional offers section
3. Drone Service Booking System

A complete 5-step booking workflow:

Select Location
State
District
Mandal
Village
Crop and Area Selection
Crop type
Land area
Acre conversion
Service Selection
Date and Time Slot Selection
Booking Review and Confirmation

The system also provides a dynamic cost calculation before confirmation.

4. Payment Integration
Razorpay payment gateway
Order creation
Payment verification
Booking confirmation
Success screen with animations and confetti effects
5. Booking Management
View all bookings
Filter bookings by status
Booking details page
Status tracking timeline
Cancellation support
6. Reports Module
View completed service reports
Download PDF reports
Access signed report URLs from backend services
7. Profile & Settings
User profile management
Application settings
Account preferences
UI/UX Highlights

Skyvora focuses heavily on modern mobile experience with:

Animated buttons
Animated cards
Count-up statistics
Pulse effects
Typewriter text animations
OTP input animations
Progress indicators
Status timelines
Success animations
Custom drone branding elements
Backend APIs

The backend exposes APIs for:

Creating bookings
Listing bookings
Viewing booking details
Cancelling bookings
Creating Razorpay orders
Payment verification
Report retrieval and downloads