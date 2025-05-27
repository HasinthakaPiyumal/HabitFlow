import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import screens from './screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { theme } = useTheme();
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
                const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
                setInitialRoute(onboardingComplete === 'true' ? isLoggedIn === 'true' ? 'Home' : 'Login' : 'OnBoarding');
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setInitialRoute('OnBoarding');
            } finally {
                setIsLoading(false);
            }
        };

        checkOnboardingStatus();
    }, []);

    // Show loading screen while checking AsyncStorage
    if (isLoading || initialRoute === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={initialRoute}
                >
                    <Stack.Screen name="OnBoarding" component={screens.OnBoarding} />
                    <Stack.Screen name="Register" component={screens.Register} />
                    <Stack.Screen name="Login" component={screens.Login} />
                    <Stack.Screen name="Home" component={screens.Home} />
                    <Stack.Screen name="NewHabit" component={screens.NewHabit} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
