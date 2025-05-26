import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import screens from './screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { theme } = useTheme();
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName="Register"
                >
                    <Stack.Screen name="OnBoarding" component={screens.OnBoarding} />
                    <Stack.Screen name="Register" component={screens.Register} />
                    <Stack.Screen name="Login" component={screens.Login} />
                    <Stack.Screen name="Home" component={screens.Home} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
