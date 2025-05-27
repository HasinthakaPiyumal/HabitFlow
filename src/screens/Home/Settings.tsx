import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useTheme } from '../../context/ThemeContext';
import { getTextStyles } from '../../assets/styles/TextStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

const statusBarHeight = getStatusBarHeight();
const screenWidth = Dimensions.get('window').width;

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const slideAnim = useRef(new Animated.Value(theme.isDark ? 48 : 0)).current;

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: theme.isDark ? (screenWidth - 60) / 2 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [theme.isDark]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: statusBarHeight }]}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={[styles.avatar, { backgroundColor: theme.primary + '30' }]}>
                    <Text style={[styles.avatarText, { color: theme.primary }]}>JS</Text>
                </View>
                <Text style={[getTextStyles(theme).heading, styles.profileName]}>Hasinthaka Piyumal</Text>
                <Text style={[getTextStyles(theme).body, styles.profileEmail]}>john.smith@example.com</Text>
            </View>

            {/* Theme Toggle Section */}
            <Text style={[getTextStyles(theme).subheading, styles.sectionTitle]}>Appearance</Text>
            <TouchableOpacity
                style={[styles.toggleContainer, { backgroundColor: theme.card }]}
                onPress={toggleTheme}
                activeOpacity={0.9}
            >
                <Animated.View
                    style={[
                        styles.toggleIndicator,
                        {
                            backgroundColor: theme.primary,
                            transform: [{ translateX: slideAnim }],
                        },
                    ]}
                />
                <View style={styles.toggleOptionContainer}>
                    <View style={styles.toggleOption}>
                        <Icon
                            name="sunny-outline"
                            color={!theme.isDark ? '#FFF' : theme.textSecondary}
                            size={20}
                        />
                        <Text style={[
                            styles.toggleText,
                            { color: !theme.isDark ? '#FFF' : theme.textSecondary }
                        ]}>Light</Text>
                    </View>
                    <View style={styles.toggleOption}>
                        <Icon
                            name="moon-outline"
                            color={theme.isDark ? '#FFF' : theme.textSecondary}
                            size={20}
                        />
                        <Text style={[
                            styles.toggleText,
                            { color: theme.isDark ? '#FFF' : theme.textSecondary }
                        ]}>Dark</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Icon name="log-out-outline" size={20} color="#FF453A" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
    },
    profileName: {
        textAlign: 'center',
        marginBottom: 4,
    },
    profileEmail: {
        textAlign: 'center',
        color: '#888',
    },
    sectionTitle: {
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    toggleContainer: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        marginBottom: 40,
        overflow: 'hidden',
    },
    toggleIndicator: {
        position: 'absolute',
        width: '50%',
        height: 48,
        borderRadius: 24,
        top: 6,
        left: 6,
    },
    toggleOptionContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'center',
    },
    toggleText: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 40,
        left: 24,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 69, 58, 0.05)',
        borderColor: '#FF453A',
        borderWidth: 1,
    },
    logoutText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#FF453A',
    },
});

export default Settings;
