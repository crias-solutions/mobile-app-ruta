# AGENTS.md

> RUTA Mobile - citizen science sensor data collection (v2.1.1)

## Dev Commands

```bash
npm run dev          # Expo tunnel (recommended)
npm run android      # Android
npm run ios         # iOS
npm run web        # Web
npm run build:web  # Export + Workbox SW
npm run build:android  # Prebuild Android
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript strict
```

## Verified Defaults

- **Expo SDK 54**, RN 0.81, TypeScript strict
- `EXPO_NO_TELEMETRY=1` set in all scripts
- No test framework — add before writing tests
- `console.log()` for errors, wrap async in try-catch
- `@style` alias defined in babel.config.js (NOT in tsconfig.json)

## Tech Stack

- expo-router (file-based routing)
- Supabase REST API (upload)
- i18n-js with JSON locale files
- React Native Reanimated 4.x

## File Structure

```
app/              # Expo Router pages
  _layout.tsx     # Root layout with providers
  index.tsx       # Main redirect
  terms.tsx       # Consent/terms screen
  vehicle.tsx     # Vehicle selection
  record.tsx      # Recording screen
  feedback.tsx    # Trip summary dashboard
  settings.tsx    # Settings screen
hooks/            # Custom hooks (use prefix)
services/         # API/Supabase integrations
utils/            # Utilities (tripSummary.ts, storage.ts, etc.)
components/       # Reusable UI components
locales/          # i18n JSON (en.json, es.json)
style/            # Style utilities
```

## Data Collection

| Sensor | CSV Column | File |
|--------|-----------|------|
| Accelerometer | x, y, z | sensor.csv |
| Gyroscope | x, y, z | sensor.csv |
| Magnetometer | x, y, z | sensor.csv |
| GPS | latitude, longitude, speed | gps.csv |

Data stored at: `${FileSystem.documentDirectory}rides/${rideId}/`

## Trip Summary (v2.1.0)

Implemented in `utils/tripSummary.ts`:
- Distance: Haversine formula between GPS points
- Duration: last_timestamp - first_timestamp
- Speed: average = distance/duration, max = max(speed)
- Stops: speed < 0.5 m/s triggers stop detection

## Important Notes

1. Background GPS — requires `ACCESS_BACKGROUND_LOCATION` (Android)
2. GPS speed unit — Expo Location returns m/s, convert to km/h
3. No component libraries — custom UI using React Native primitives only

## Path Aliases

| Alias | Resolution |
|-------|------------|
| `@/*` | `./` |
| `@components` | `./components` |
| `@hooks` | `./hooks` |
| `@utils` | `./utils` |
| `@style` | `./style` |

## Disabled ESLint Rules

```
@typescript-eslint/no-unused-vars
@typescript-eslint/no-explicit-any
react/react-in-jsx-scope
prefer-const
```