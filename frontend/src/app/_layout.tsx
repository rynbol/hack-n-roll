import {Stack} from 'expo-router';
import '../../global.css';
import {useFonts} from 'expo-font';
import {useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Light': require('../../assets/fonts/SpaceGrotesk-Light.ttf'),
    'SpaceGrotesk-Regular': require('../../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'SpaceGrotesk-Medium': require('../../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceGrotesk-SemiBold': require('../../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
    'SpaceGrotesk-Bold': require('../../assets/fonts/SpaceGrotesk-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{headerShown: false}}></Stack>;
}
