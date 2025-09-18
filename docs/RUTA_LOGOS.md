
# RUTA Mobile App Logos for Android

This document explains how the RUTA Mobile App logos are implemented specifically for Android devices.

## Logo Files

The following 5 RUTA logo files with different resolutions are available:

1. **26fb2f8c-55c0-48c6-98fd-3d740e74f3f4.png** - Small resolution (used for small UI elements)
2. **cd71a84d-7eeb-453b-9ef2-ba38ad16759b.png** - Medium resolution (used for medium UI elements)
3. **e1b7fb25-1490-407c-84a0-9d592d1d7078.png** - Large resolution (used for large UI elements)
4. **6f799448-25a2-43b0-b365-09640a4b90d2.png** - Medium-large resolution (default fallback)
5. **03c3eb6d-4b62-45d1-8c7d-df8b589efe1e.png** - Extra large resolution (used for app icon and splash screen)

## Implementation

### App Icon Configuration (app.json)
- **Android App Icon**: Uses the largest resolution logo (03c3eb6d-4b62-45d1-8c7d-df8b589efe1e.png)
- **Adaptive Icon**: Configured with RUTA brand color background (#4A5A7A)
- **Splash Screen**: Uses the same high-resolution logo

### RUTALogo Component
The `RUTALogo` component automatically selects the appropriate resolution based on the requested size:
- `small`: 32x32px using smallest resolution logo
- `medium`: 48x48px using medium resolution logo  
- `large`: 80x80px using large resolution logo
- `xlarge`: 120x120px using largest resolution logo

### Platform Restriction
- RUTA logos are **only displayed on Android devices**
- On iOS, the component returns null and doesn't render
- This ensures brand consistency per platform requirements

### Usage in App
- Header logo in main layout (Android only)
- Available as `RUTAAppLogo` export from `_layout.tsx`
- Can be imported and used in any screen via the `RUTALogo` component

## App Configuration Changes
- App name changed to "RUTA Mobile"
- Package name: `com.rutamobile.app`
- Scheme: `ruta-mobile`
- Light theme implementation
- Android-specific permissions added for location and storage access
