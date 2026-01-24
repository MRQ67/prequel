import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { THEME } from "../theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';
type ThemeColors = typeof THEME.dark;

interface ThemeContextType {
    theme: ThemeType;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme(); // Gets system theme (light/dark)
  const [theme, setThemeState] = useState<ThemeType>('light'); // Default to light initially
  const [userHasSetPreference, setUserHasSetPreference] = useState<boolean>(false);

  // Load theme after component mounts and listen for system theme changes
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const loadAndListenForChanges = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          // If user has explicitly set a theme preference, use that
          if (isMounted) {
            setThemeState(savedTheme as ThemeType);
            setUserHasSetPreference(true);
          }
        } else {
          // Otherwise, use system preference
          if (isMounted) {
            setThemeState(systemColorScheme as ThemeType || 'light');
            setUserHasSetPreference(false);
          }
        }
      } catch (error) {
        console.error('Failed to load theme from storage:', error);
        // Fallback to system theme or light
        if (isMounted) {
          setThemeState(systemColorScheme as ThemeType || 'light');
          setUserHasSetPreference(false);
        }
      }
    };

    loadAndListenForChanges();

    // Clean up function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for system theme changes only if user hasn't set a preference
  useEffect(() => {
    if (!userHasSetPreference) {
      setThemeState(systemColorScheme as ThemeType || 'light');
    }
  }, [systemColorScheme, userHasSetPreference]);

  const colors = theme === 'dark' ? THEME.dark : THEME.light;

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    setUserHasSetPreference(true); // Mark that user has set a preference
    try {
      // Explicitly save the user's choice to override system theme
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    setUserHasSetPreference(true); // Mark that user has set a preference
    try {
      // Explicitly save the user's choice to override system theme
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);

        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        }
    }, [theme, colors]);

    const contextValue: ThemeContextType = {
        theme,
        colors,
        toggleTheme,
        setTheme,
  };
    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
