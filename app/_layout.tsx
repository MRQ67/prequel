import { ThemeProvider as AppThemeProvider } from "@/lib/contexts/ThemeContext";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import "../global.css";
import { initSchema } from "../lib/schema";
import { NAV_THEME } from "../lib/theme";


export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await initSchema();
      setIsReady(true);
    }
    prepare();
  }, []);
  
  const colorScheme = useColorScheme();

  if (!isReady) {
    return null;
  }

  return (
    <AppThemeProvider>
    <ThemeProvider value={NAV_THEME[colorScheme === 'dark' ? 'dark' : 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false}}/>
      <PortalHost />
    </ThemeProvider>
    </AppThemeProvider>
      );
}
