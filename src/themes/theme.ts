export const lightTheme = {
  isDark: false,
  background: '#f3e5f5', // Very light lavender (almost white)
  text: '#311b92', // Deepest dark purple
  primary: '#673ab7', // Medium royal purple
  secondary: '#9575cd', // Lighter pastel purple
  card: '#ffffff', // Clean white
  border: '#d1c4e9', // Soft lavender border
  safeAreaBackground: '#fff', // Gentle light purple
  statusBarStyle: 'dark',

  // Text Colors
  textPrimary: '#311b92',
  textSecondary: '#5e35b1', // Muted deep purple
  textTitle: '#4527a0', // Darker royal purple
  textSuccess: '#4caf50', // Forest green
  textWarning: '#ffb300', // Amber yellow
  textError: '#d32f2f', // Muted red
  textInfo: '#0288d1', // Bright blue
  textMuted: '#9575cd', // Muted pastel purple
};

export const darkTheme = {
  isDark: true,
  background: '#1a1030', // Very deep, dark purple
  text: '#e0e0e0', // Light gray
  primary: '#8e24aa', // Vibrant dark orchid
  secondary: '#ab47bc', // Lighter purple
  card: '#2c1e40', // Darker muted purple
  border: '#4527a0', // Deep purple border
  safeAreaBackground: '#1a1030', // Consistent base
  statusBarStyle: 'light',

  // Text Colors
  textPrimary: '#e0e0e0',
  textSecondary: '#ce93d8', // Light lavender
  textTitle: '#ba68c8', // Medium lavender
  textSuccess: '#69f0ae', // Light mint green
  textWarning: '#ffca28', // Lighter amber yellow
  textError: '#ef5350', // Soft red
  textInfo: '#64b5f6', // Soft blue
  textMuted: '#9fa8da', // Muted light blue-purple
};
export type Theme = typeof lightTheme | typeof darkTheme;
