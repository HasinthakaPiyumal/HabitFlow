import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getTextStyles } from '../../assets/styles/TextStyles';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../navigation/types';
import AppBarTitle from '../../components/AppBarTitle';

const statusBarHeight = getStatusBarHeight();

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Animation values for theme toggle
    const animatedValue = React.useRef(new Animated.Value(theme.isDark ? 1 : 0)).current;

    // Update animation when theme changes
    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: theme.isDark ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    }, [theme.isDark]);

    // Interpolate values for animations
    const toggleBackgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E0E0E0', '#333333']
    });

    const toggleTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [6, 64]
    });

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <AppBarTitle title="Settings" />

            {/* Profile Section */}
            <View style={styles.profileCard}>
                <View style={[styles.profileCardContent, { backgroundColor: theme.card }]}>
                    <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '30' }]}>
                        <Text style={[styles.avatarText, { color: theme.primary }]}>JS</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[getTextStyles(theme).subheading, styles.profileName]}>John Smith</Text>
                        <Text style={[getTextStyles(theme).body, styles.profileEmail, { color: theme.textSecondary }]}>
                            john.smith@example.com
                        </Text>
                    </View>
                </View>
            </View>

            {/* Theme Toggle Section - Enlarged */}
            <View style={styles.settingsSection}>
                <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
                    <View style={styles.themeToggleHeader}>
                        <Icon name="color-palette-outline" size={24} color={theme.primary} />
                        <Text style={[getTextStyles(theme).subheading, styles.themeToggleTitle]}>
                            Appearance
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={toggleTheme}
                        activeOpacity={0.8}
                        style={styles.enlargedToggleContainer}
                    >
                        <Animated.View
                            style={[
                                styles.enlargedToggleBackground,
                                { backgroundColor: toggleBackgroundColor }
                            ]}
                        >
                            <View style={styles.themeIconsContainer}>
                                <View style={[styles.themeIcon, { opacity: theme.isDark ? 0.5 : 1 }]}>
                                    <Icon name="sunny-outline" size={24} color={theme.isDark ? theme.textSecondary : "#FF9800"} />
                                    <Text style={[getTextStyles(theme).body, { color: theme.isDark ? theme.textSecondary : theme.textPrimary }]}>
                                        Light
                                    </Text>
                                </View>

                                <View style={[styles.themeIcon, { opacity: theme.isDark ? 1 : 0.5 }]}>
                                    <Icon name="moon-outline" size={24} color={theme.isDark ? "#9C27B0" : theme.textSecondary} />
                                    <Text style={[getTextStyles(theme).body, { color: theme.isDark ? theme.textPrimary : theme.textSecondary }]}>
                                        Dark
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.enlargedToggleCircle,
                                {
                                    backgroundColor: theme.isDark ? theme.primary : '#FFFFFF',
                                    transform: [{ translateX: toggleTranslateX }],
                                }
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Logout Button - with red background tint */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity
                    style={[
                        styles.logoutButton,
                        {
                            backgroundColor: theme.isDark ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 69, 58, 0.1)',
                            borderColor: 'rgba(255, 69, 58, 0.3)',
                            borderWidth: 1
                        }
                    ]}
                    onPress={handleLogout}
                >
                    <Icon name="log-out-outline" size={24} color="#FF453A" />
                    <Text style={[getTextStyles(theme).body, styles.logoutText, { color: "#FF453A" }]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: statusBarHeight,
        paddingHorizontal: 20,
    },
    profileCard: {
        marginTop: 20,
        marginBottom: 24,
    },
    profileCardContent: {
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
    },
    settingsSection: {
        marginBottom: 24,
    },
    settingsCard: {
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    themeToggleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    themeToggleTitle: {
        marginLeft: 8,
        fontSize: 18,
    },
    // Larger toggle styles
    enlargedToggleContainer: {
        height: 60,
        position: 'relative',
        padding: 6,
    },
    enlargedToggleBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        borderRadius: 30,
    },
    themeIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        height: '100%',
    },
    themeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    enlargedToggleCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    logoutContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Settings;