import { useTheme } from './contexts/ThemeContext';

// Hook to get themed colors
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof import('./theme').THEME.light
) {
  const { colors, theme } = useTheme();
  
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[colorName];
  }
}