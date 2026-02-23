# Mobile App Ruta

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)

A mobile application for tracking and visualizing GPS trip data, enabling users to analyze their routes and travel patterns.

---

## Why

This app enables developers and users to visualize GPS trip data instantly by parsing location data and rendering it on interactive maps.

## What

- Real-time GPS tracking and visualization
- Interactive map display of routes
- Trip data import and analysis
- Export capabilities for various formats

---

## How

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI
- Android Studio (for Android development)

### Installation

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Install project dependencies
npm install
```

### Run

```bash
# Start the development server
npm run start
# or
npx expo start
```

### Development

```bash
# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Check project health
npx expo doctor
```

### Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Build APK (preview)
eas build -p android --profile preview

# Build AAB (production/play store)
eas build -p android --profile production

# List builds
eas build:list
```

---

## Tech Stack

| Technology | Version |
|------------|---------|
| Expo | 52 |
| React Native | 0.76 |
| TypeScript | 5.6 |
| Node.js | 20+ |

---

## License

[MPL 2.0](./LICENSE)
