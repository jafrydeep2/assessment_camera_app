# Camera App with Tamagui

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd camera-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

## Project Structure

```
camera-app/
├── app/
│   ├── _layout.tsx      # Root layout with Tamagui provider
│   ├── index.tsx        # Home screen with camera button
│   └── camera.tsx       # Camera screen with overlay
├── tamagui.config.ts    # Tamagui configuration
├── babel.config.js      # Babel configuration
├── metro.config.js      # Metro configuration
└── app.json            # Expo configuration
``` 