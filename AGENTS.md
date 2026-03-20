# AGENTS.md - Mobile App Ruta

> Expo/React Native app for citizen science sensor data collection (accelerometer, gyroscope, magnetometer, GPS).

**Tech Stack:** Expo SDK 54, React Native 0.81, TypeScript (strict), React Native Reanimated 4.x, Supabase REST API

## Build Commands

```bash
npm run dev          # Start Expo with tunnel (Recommended)
npm run android      # Start for Android
npm run ios          # Start for iOS
npm run web          # Start for web
npm run build:web    # Build web app (exports to web/ then Workbox SW)
npm run build:android # Prebuild Android native project
npm run lint         # Run ESLint on entire project
```

**No test framework is set up.** Add Jest/Vitest to run tests:
```bash
npx jest path/to/file.test.ts  # If configured
```

## Code Style

### TypeScript
- **Strict mode** — no implicit `any`, no implicit returns
- Use `interface` for component props; avoid `type` aliases for props
- Prefer explicit return types for exported functions
- Use `Record<string, T>` for map-like objects
- ESLint rules disabled: `no-unused-vars`, `no-explicit-any`

### Naming Conventions
| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `VehicleCard`, `Button` |
| Hooks | camelCase + `use` | `useConsent`, `useVehicles` |
| Utilities | camelCase | `getFreeStorageMB`, `uploadRide` |
| Constants | camelCase or SCREAMING_SNAKE | `ENABLED_KEY`, `colors` |
| Types/Interfaces | PascalCase | `VehicleCardProps`, `SensorSample` |
| Files/Directories | kebab-case | `use-sensor-recorder.ts`, `hooks/` |

### Import Order
```typescript
import { useEffect, useState } from 'react';           // 1. React/framework
import { router } from 'expo-router';                   // 2. Navigation
import { View, Text } from 'react-native';              // 3. RN core
import AsyncStorage from '@react-native-async-storage/async-storage'; // 4. Third-party
import { Ionicons } from '@expo/vector-icons';          // 4. Third-party
import { commonStyles } from '@/styles/commonStyles';   // 5. Internal aliases
import VehicleCard from '@/components/VehicleCard';     // 5. Internal aliases
import { useVehicles } from '@/hooks/useVehicles';       // 5. Internal aliases
import i18n from '@/utils/i18n';                        // 5. Internal aliases
import { foo } from '../utils/foo';                     // 6. Relative
```

### Path Aliases (babel.config.js)
```
@/ → ./        @components → ./components  @style → ./styles
@hooks → ./hooks  @types → ./types
```

### Component Patterns

**Page (`app/*.tsx`):**
```typescript
export default function VehicleScreen() {
  return <View>...</View>;
}
```

**UI (`components/*.tsx`):**
```typescript
interface VehicleCardProps {
  id: string;
  label: string;
  onPress?: () => void;
}
export default function VehicleCard({ id, label, onPress }: VehicleCardProps) {
  return <Pressable onPress={onPress}>...</Pressable>;
}
```

**Hook (`hooks/*.tsx`):**
```typescript
export function useConsent() {
  const [accepted, setAccepted] = useState(false);
  return { accepted, setAccepted };
}
```

### Error Handling
- Wrap async operations in try-catch blocks
- Log errors with `console.log('context error', e)` — not `console.error`
- Show user-friendly alerts via `Alert.alert()`
- Never expose sensitive data in error messages
- Use optional chaining (`?.`) for potentially undefined properties

```typescript
useEffect(() => {
  (async () => {
    try {
      const value = await AsyncStorage.getItem(KEY);
      setState(value);
    } catch (e) {
      console.log('load error', e);
    }
  })();
}, []);
```

### Styling
- Use `StyleSheet.create()` for all component styles
- Centralize shared styles in `styles/commonStyles.ts`
- Use the `colors` object for consistent theming
- Prefer inline styles for dynamic values
- Platform-agnostic flexbox layouts

### State Management
- Use React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- Use `useRef` for mutable values that don't trigger re-renders
- Keep state local; lift when needed

## File Structure
```
app/           # Expo Router pages (file-based routing)
  _layout.tsx  # Root layout with providers
  index.tsx    # Main redirect page
  terms.tsx    # Consent/terms screen
  vehicle.tsx  # Vehicle selection
  record.tsx   # Recording screen
  feedback.tsx # Feedback screen
components/    # Reusable UI components
hooks/         # Custom React hooks (camelCase, use prefix)
styles/        # Shared styles (commonStyles.ts)
utils/         # Utility functions (camelCase)
services/      # API/Supabase integrations
data/          # Static data (vehicles, etc.)
locales/       # i18n JSON files
```

## Expo Router Conventions
- `_layout.tsx` files define layout wrappers
- `router.push()`, `router.replace()` for navigation
- `useLocalSearchParams()` for route params
- `useGlobalSearchParams()` for global query params

## Important Notes
1. **No tests** — Add Jest/Vitest before adding test files
2. **Background GPS** requires native permissions on Android
3. **i18n** uses i18n-js with JSON locale files
4. **Platform checks**: `Platform.OS === 'web'` or `Platform.OS === 'android'`
5. **No component libraries** — custom UI using React Native primitives only
6. **SKILLS/** directory contains specialized guidelines (e.g., documentation-writing.md)
