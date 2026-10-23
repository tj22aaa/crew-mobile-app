# Crew

Crew is a basic Expo React Native MVP project for a travel and collaborative planning app. It is built for my Final Year Computer Science Project.

Tagline: *Roll with your crew.*

## Screens

- Welcome / Splash
- Login
- Dashboard
- Create Trip
- Create Crew
- My Trips
- Trip Details

## Install and Run the following

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go mobile app on Android/iOS or run it on an Android/iOS simulator.

## Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create an account.
2. Create a new project.
3. Open project dashboard.
4. Go to **SQL Editor** from left navigation panel and create a new file.
5. Write PostgreSQL for project database schema and run once ready.
6. Go to **Authentication > Providers > Email**.
7. Go to **Project Settings > API** or project **Connect** dialog.
8. Copy Project URL and publishable key.
9. Create a new file in VS as .env for the following:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

10. Restart/Reload Expo after editing `.env`.

## How Supabase Connects to the App

The Supabase client is created in `src/lib/supabase.js` in VS.

The app uses:

- `supabase.auth.signUp()` for signup
- `supabase.auth.signInWithPassword()` for login
- `supabase.from('trips').insert()` to create trips
- `supabase.from('trips').select()` to load trips
- Row Level Security policies so users only see their own trips and crews

## Workflow:

The app starts in `App.js`. It checks whether a Supabase session exists.

If there is no logged-in user, the app shows:

- Welcome
- Login / Signup

If the user is logged in, the app shows:

- Dashboard
- Create Trip
- Create Crew
- My Trips
- Trip Details

React Navigation controls screen movement. Supabase handles authentication and database storage.

## App Screenshots

<img src="app_screenshots/Crew app screen 1.png" width="220" alt="Welcome screen">   <img src="app_screenshots/Crew app screen 2.png" width="220" alt="Login/Sign Up screen">
<img src="app_screenshots/Crew app screen 3.png" width="220" alt="Main Dashboard screen">   <img src="app_screenshots/Crew app screen 4.png" width="220" alt="Create Trip screen">
<img src="app_screenshots/Crew app screen 5.png" width="220" alt="Create Crew screen">   <img src="app_screenshots/Crew app screen 6.png" width="220" alt="My Trips screen">
<img src="app_screenshots/Crew app screen 7.png" width="220" alt="Trip Details screen">
