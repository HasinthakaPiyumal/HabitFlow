import { createContext, ReactNode, useContext, useState } from 'react';
import { darkTheme, lightTheme } from '../themes/theme';

type ThemeContextType = {
  theme: typeof lightTheme,
  toggleTheme: () => void,
};
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  return (
    <ThemeContext.Provider
      value={{
        theme: isDarkTheme ? darkTheme : lightTheme,
        toggleTheme: toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
