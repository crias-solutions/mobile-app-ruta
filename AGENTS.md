# AGENTS.md

> Expo/React Native mobile app for citizen science sensor data collection (accelerometer, gyroscope, magnetometer, GPS).

## Build Commands

```bash
npm run dev          # Start Expo with tunnel (Recommended)
npm run android      # Start for Android
npm run ios         # Start for iOS
npm run web         # Start for web
npm run build:web   # Build web app (exports to web/ then Workbox SW)
npm run build:android # Prebuild Android native project
npm run lint        # Run ESLint
```

## Verify Code

```bash
npm run lint        # ESLint (eslint-config-expo)
npx tsc --noEmit   # TypeScript strict check
```

## Tech Stack

- **Expo SDK 54**, React Native 0.81, TypeScript (strict)
- React Native Reanimated 4.x
- expo-router (file-based routing)
- Supabase REST API (upload)
- i18n-js with JSON locale files

## File Structure

```
app/              # Expo Router pages (file-based routing)
  _layout.tsx     # Root layout with providers
  index.tsx       # Main redirect
  terms.tsx       # Consent/terms screen
  vehicle.tsx     # Vehicle selection
  record.tsx     # Recording screen
  feedback.tsx    # Trip Summary Dashboard (v2.1.0)
hooks/            # Custom hooks (use prefix)
services/         # API/Supabase integrations
utils/            # Utilities (tripSummary.ts, storage.ts, etc.)
components/       # Reusable UI components
locales/          # i18n JSON (en.json, es.json)
```

## Data Collection

| Sensor | CSV Column | File |
|--------|-----------|------|
| Accelerometer | x, y, z | sensor.csv |
| Gyroscope | x, y, z | sensor.csv |
| Magnetometer | x, y, z | sensor.csv |
| GPS (lat, lon, speed) | latitude, longitude, speed | gps.csv |

Data stored at: `${FileSystem.documentDirectory}rides/${rideId}/`

## Trip Summary (v2.1.0)

Implemented in `utils/tripSummary.ts`:
- Distance: Haversine formula between consecutive GPS points
- Duration: last_timestamp - first_timestamp
- Speed: average = distance/duration, max = max(speed)
- Acceleration: computed from speed deltas
- Stops: speed < 0.5 m/s triggers stop detection

## Important Notes

1. **No tests** — Add Jest/Vitest before creating test files
2. **Background GPS** — requires `ACCESS_BACKGROUND_LOCATION` permission (Android)
3. **GPS speed unit** — Expo Location returns m/s, convert to km/h
4. **No component libraries** — custom UI using React Native primitives only
5. **Error handling** — use `console.log()` not `console.error()`, wrap async in try-catch

## Path Aliases

| Alias | Resolution |
|-------|------------|
| `@/*` | `./` |
| `@components` | `./components` |
| `@hooks` | `./hooks` |
| `@utils` | `./utils` |

## Disabled ESLint Rules

```
@typescript-eslint/no-unused-vars
@typescript-eslint/no-explicit-any
react/react-in-jsx-scope
prefer-const
```