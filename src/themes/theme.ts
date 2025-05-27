export const lightTheme = {
  isDark: false,
  background: '#f5f5f5', // Very light lavender (almost white)
  text: '#311b92', // Deepest dark purple
  primary: '#8c52ff', // Medium royal purple
  secondary: '#9575cd', // Lighter pastel purple
  card: '#ffffff', // Clean white
  border: '#af91c4', // Soft lavender border
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
  background: '#221f29', // Very deep, dark purple
  text: '#e0e0e0', // Light gray
  primary: '#9661ff', // Vibrant dark orchid
  secondary: '#ffffffdd', // Lighter purple
  card: '#2c1e40', // Darker muted purple
  border: '#724fdb', // Deep purple border
  safeAreaBackground: '#1a1030', // Consistent base
  statusBarStyle: 'light',

  // Text Colors
  textPrimary: '#fafafa',
  textSecondary: '#fff', // Muted deep purple
  textTitle: '#4527a0', // Darker royal purple
  textSuccess: '#4caf50', // Forest green
  textWarning: '#ffb300', // Amber yellow
  textError: '#d32f2f', // Muted red
  textInfo: '#0288d1', // Bright blue
  textMuted: '#9575cd', // Muted pastel purple
};
export type Theme = typeof lightTheme | typeof darkTheme;
