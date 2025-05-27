import React from 'react';
import { Text, StyleSheet, ViewStyle, Dimensions, ScrollView, Alert } from 'react-native';
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

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
    ,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const screenWidth = Dimensions.get('window').width;
const defaultWidth = screenWidth - 40;
const Register = () => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const saveUserData = async (userData: Omit<RegisterFormData, 'confirmPassword'>) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userHabits', JSON.stringify([]));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      console.log('User data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.safeAreaBackground }]}>
      <ScrollView>
        <View style={styles.centeredContent}>
          <Logo style={{ marginBottom: 40, marginTop: 40 }} width={120} />
          <Text style={getTextStyles(theme).heading}>Create Account</Text>
          <Text style={getTextStyles(theme).subheading}>
            Track your habits, achieve your goals
          </Text>
        </View>
        <View style={{ width: '100%', marginTop: 40, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TextInput
              width={defaultWidth / 2 - 10}
              label="first name"
              placeholder='First name'
              onChangeText={text => {
                setValue('firstName', text);
              }}
              {...register('firstName')}
            />
            <TextInput
              width={defaultWidth / 2 - 10}
              label="last name"
              placeholder='Last name'
              onChangeText={text => {
                setValue('lastName', text);
              }}
              {...register('lastName')}
            />
          </View>
          {errors.firstName && (
            <Text style={getTextStyles(theme).error}>
              {errors.firstName.message}
            </Text>
          )}
          <TextInput
            label="email"
            placeholder='Enter your email'
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
            secureTextEntry
            placeholder='Enter your password'
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

          <TextInput
            label="confirm password"
            secureTextEntry
            placeholder='Confirm your password'
            onChangeText={text => {
              setValue('confirmPassword', text);
            }}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <Text style={getTextStyles(theme).error}>
              {errors.confirmPassword.message}
            </Text>
          )}
          <Button
            title="Register"
            variant="primary"
            width={defaultWidth}
            mt={20}
            onPress={handleSubmit(async (data) => {
              console.log('Form Data:', data);

              // Remove confirmPassword before saving
              const { confirmPassword, ...userDataToSave } = data;

              // Save user data to AsyncStorage
              const saved = await saveUserData(userDataToSave);

              if (saved) {
                Alert.alert(
                  "Success",
                  "Account created successfully!",
                  [{ text: "OK", onPress: () => navigation.navigate('Home') }]
                );
              } else {
                Alert.alert(
                  "Error",
                  "There was a problem creating your account. Please try again."
                );
              }
            })}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40
            }}
          >
            <Text style={[
              getTextStyles(theme).body,
              { textAlign: 'center', marginTop: 4 },
            ]}>Already have an account?{' '}</Text>
            <Text
              style={[getTextStyles(theme).bold, { color: theme.primary }]}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
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

export default Register;
