import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
};

export default App;
