import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Camera App',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="camera" 
          options={{ 
            title: 'Take Photo',
            headerShown: false 
          }} 
        />
      </Stack>
    </TamaguiProvider>
  );
} 