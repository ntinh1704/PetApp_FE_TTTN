## Pet App – Expo React Native

**Pet App** is a mobile application built with Expo, React Native, and `expo-router` that helps users manage their pets and discover pet-related services.

The UI content is primarily in Vietnamese.

---

## Tech stack

- **Framework**: Expo (React Native)
- **Navigation**: `expo-router`, `@react-navigation/*`
- **Language**: TypeScript
- **State management**: React Context (`PetsContext`) for pet management
- **UI**: `react-native`, `react-native-safe-area-context`, `@expo/vector-icons`
- **Media**: `expo-image-picker` for selecting pet photos

---

## Features

- **Authentication flow**
  - Splash screen and login screen
  - Basic login that navigates to the home tab
  - Screens for registration and password recovery

- **Pet management**
  - Global `PetsContext` to store and update the pet list
  - Add a new pet with: name, breed, gender, age, color, height, weight, and image
  - View pet details and delete pets

- **Home & services**
  - Personalized greeting on the **Home** screen
  - Quick access to notifications
  - “Thú cưng của tôi” (My Pets) section showing pets
  - Pet-related services list (vet, grooming, hotel, walking, etc.) defined in `services.ts`

- **Navigation**
  - Auth stack: `(auth)` group with login, register, forget password, splash
  - User stack: `(user)` group with bottom tabs (Home, Pets, History, Profile, Services)
  - Nested stack screens for notifications and pet detail

---

## Project structure (main parts)

- `app/_layout.tsx` – root stack with `(auth)` and `(user)` groups
- `app/index.tsx` – entry pointing to the splash screen
- `app/screens/auth/*` – authentication-related screens
- `app/screens/user/tabs/*` – main tab screens (Home, Pets, History, Profile, Service)
- `app/screens/user/stack/*` – nested stack screens (notifications, pet detail)
- `app/utils/contexts/PetsContext.tsx` – pet context provider and hook
- `app/utils/data/services.ts` – static list of pet services
- `app/utils/models/pet.ts` – `Pet` model definition

---

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Run on device / emulator**

   - Scan the QR code with the Expo Go app, **or**
   - Use:

     ```bash
     npm run android
     npm run ios
     npm run web
     ```

---

## Development notes

- The app uses **file-based routing** via `expo-router`.
- Wrap your app with `PetsProvider` (from `PetsContext`) if you create new entry points.
- Most UI text is in Vietnamese; keep this consistent when adding new screens.

---

## Scripts

- `npm start` – start the Expo dev server
- `npm run android` – run on Android emulator / device
- `npm run ios` – run on iOS simulator (macOS only)
- `npm run web` – run in the browser
- `npm run lint` – run ESLint checks

