
# RUTA Mobile App Logos

This document describes the implementation of RUTA Mobile App logos with different resolutions for both Android and iOS platforms.

## Logo Files

The following 5 logo files are available with different resolutions:

1. **eb0dc417-c307-4234-bba7-5445f45f296b.png** - Smallest resolution (used for 'small' size)
2. **bece3d82-8669-4205-a2de-f8e04ec1b98a.png** - Medium resolution (used for 'medium' size)
3. **5eafd586-5369-46d4-8355-a213a11cba4e.png** - Large resolution (used for 'large' size)
4. **4c90ad4b-09ad-4245-94d0-56b1fc84080e.png** - Largest resolution (used for 'xlarge' size)
5. **b8ffb960-e288-4fb3-90d4-37234491e70a.png** - Default medium-large resolution (used as default)

## Implementation

### RUTALogo Component

The `RUTALogo` component (`components/RUTALogo.tsx`) handles the display of RUTA logos with different sizes:

- **small**: 32x32 pixels
- **medium**: 48x48 pixels  
- **large**: 80x80 pixels
- **xlarge**: 120x120 pixels

### Platform Support

The RUTA logos are now supported on **both Android and iOS platforms**, unlike the previous Android-only implementation.

### Usage

The logos are used in:

1. **App header** - Small logo in the top navigation bar
2. **Screen headers** - Medium logo at the top of main screens
3. **Splash screen** - Large logo for app startup
4. **App icons** - Various resolutions for different device densities

### Integration

The logos are integrated through:

- `RUTAAppLogo` component in `app/_layout.tsx`
- Direct usage of `RUTALogo` component in individual screens
- App configuration in `app.json` for splash screen and icons

## Configuration

The app configuration (`app.json`) has been updated to use the RUTA logos for:

- Splash screen background and image
- Android adaptive icon
- iOS app icon
- Theme set to dark mode to match the logo design

## Cross-Platform Consistency

The implementation ensures consistent branding across both Android and iOS platforms while respecting platform-specific design guidelines and icon requirements.
