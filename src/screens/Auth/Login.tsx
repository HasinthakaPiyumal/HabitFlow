import React, { useState } from 'react';
import { Text, StyleSheet, ViewStyle, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { getTextStyles } from '../../assets/styles/TextStyles';
import { View } from 'react-native';
import { z } from 'zod';
import TextInput from '../../components/TextInput/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button/Button';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import Logo from '../../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginSchema = z
    .object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' }),
    });

type LoginFormData = z.infer<typeof loginSchema>;

const screenWidth = Dimensions.get('window').width;
const defaultWidth = screenWidth - 40;

const Login = () => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const verifyLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const userDataString = await AsyncStorage.getItem('userData');

            if (!userDataString) {
                Alert.alert("Error", "No account found. Please register first.");
                setIsLoading(false);
                return false;
            }

            const userData = JSON.parse(userDataString);

            if (userData.email === data.email && userData.password === data.password) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setIsLoading(false);
                return true;
            } else {
                Alert.alert("Error", "Invalid email or password");
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error('Error during login verification:', error);
            Alert.alert("Error", "An error occurred during login");
            setIsLoading(false);
            return false;
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.safeAreaBackground }]}>
            <View style={styles.centeredContent}>
                <Logo style={{ marginBottom: 40 }} width={120} />
                <Text style={getTextStyles(theme).heading}>Welcome Back</Text>
                <Text style={getTextStyles(theme).subheading}>
                    Login to continue tracking your habits
                </Text>
            </View>
            <View style={{ width: '100%', marginTop: 40, paddingHorizontal: 20 }}>
                <TextInput
                    label="email"
                    placeholder="Enter your email"
                    onChangeText={text => {
                        setValue('email', text);
                    }}
                    {...register('email')}
                />
                {errors.email && (
                    <Text style={getTextStyles(theme).error}>{errors.email.message}</Text>
                )}
                <TextInput
                    label="password"
                    placeholder="Enter your password"
                    secureTextEntry
                    onChangeText={text => {
                        setValue('password', text);
                    }}
                    {...register('password')}
                />
                {errors.password && (
                    <Text style={getTextStyles(theme).error}>
                        {errors.password.message}
                    </Text>
                )}
                <Button
                    title={isLoading ? "Logging in..." : "Login"}
                    variant="primary"
                    width={defaultWidth}
                    mt={20}
                    disabled={isLoading}
                    onPress={handleSubmit(async (data) => {
                        const success = await verifyLogin(data);
                        if (success) {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        }
                    })}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 40,
                    }}
                >
                    <Text style={[
                        getTextStyles(theme).body,
                        { textAlign: 'center', marginTop: 4 },
                    ]}>Don't have an account?{' '}</Text>
                    <Text
                        style={[getTextStyles(theme).bold, { color: theme.primary }]}
                        onPress={() => {
                            navigation.navigate('Register');
                        }}>
                        Signup
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    centeredContent: {
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
});

export default Login;
