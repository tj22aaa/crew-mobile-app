# Crew

Crew is a basic Expo React Native MVP for a travel and collaborative planning app.

Tagline: **Roll with your crew.**

## Screens

- Welcome / Splash
- Login / Signup
- Dashboard
- Create Trip
- Create Crew
- My Trips
- Trip Details

## Install and Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or run it on an Android/iOS simulator.

If you were creating the project yourself from an empty folder, the matching commands would be:

```bash
npx create-expo-app crew --template blank
cd crew
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack
```

## Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Open your project dashboard.
3. Go to **SQL Editor**.
4. Copy the SQL from `supabase/schema.sql`.
5. Paste it into the SQL editor and click **Run**.
6. Go to **Authentication > Providers > Email**.
7. For a classroom demo, you can turn off email confirmation so signup logs in immediately.
8. Go to **Project Settings > API** or the project **Connect** dialog.
9. Copy your Project URL and publishable key. A legacy anon key also works for this MVP.
10. Create a `.env` file in the project root using `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

11. Restart Expo after editing `.env`.

In terminal, that looks like this:

```bash
copy .env.example .env
npx expo start
```

Then edit `.env` in VS Code and replace the placeholder values with your real Supabase values.

Note: if VS Code shows red lines in `supabase/schema.sql`, check the SQL dialect shown in the bottom bar. Supabase uses PostgreSQL, but VS Code may open the file as MSSQL/T-SQL. The schema should be run inside the Supabase SQL Editor.

## How Supabase Connects to the App

The Supabase client is created in `src/lib/supabase.js`.

The app uses:

- `supabase.auth.signUp()` for signup
- `supabase.auth.signInWithPassword()` for login
- `supabase.from('trips').insert()` to create trips
- `supabase.from('trips').select()` to load trips
- Row Level Security policies so users only see their own trips and crews

## Viva Explanation

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
