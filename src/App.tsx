import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import { PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <ThemeProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </ThemeProvider>
  );
};

export default App;
