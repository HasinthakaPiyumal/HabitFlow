import React, { useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { getTextStyles } from '../../assets/styles/TextStyles';
import { useTheme } from '../../context/ThemeContext';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import TextInput from '../../components/TextInput/TextInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectInput from '../../components/SelectInput/SelectInput';
import Button from '../../components/Button/Button';
import AppBarTitle from '../../components/AppBarTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaperAlert from '../../components/PaperAlert';

const statusBarHeight = getStatusBarHeight();

const habitSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

// Define a type for Habit
interface Habit {
    id: string;
    title: string;
    description?: string;
    category: string | null;
    frequency: string | null;
    icon: string;
    createdAt: string;
    completed: boolean;
    streak: number;
}

const AddNewHabit = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [frequency, setFrequency] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string>('water-outline');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [showAlert, setShowAlert] = useState(false);

    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [frequencyError, setFrequencyError] = useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const handleCloseAlert = () => {
        setShowAlert(false);
        navigation.goBack(); // Or go somewhere else
    };

    const categories = [
        { label: 'Health', value: 'health' },
        { label: 'Fitness', value: 'fitness' },
        { label: 'Productivity', value: 'productivity' },
        { label: 'Mental Health', value: 'mental_health' },
        { label: 'Learning', value: 'learning' },
    ];

    const frequencies = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ];

    const icons = [
        { id: '1', title: 'water-outline', name: 'Water' },
        { id: '2', title: 'bicycle-outline', name: 'Bicycle' },
        { id: '3', title: 'medkit-outline', name: 'Medkit' },
        { id: '4', title: 'book-outline', name: 'Book' },
        { id: '5', title: 'heart-outline', name: 'Heart' },
        { id: '6', title: 'sunny-outline', name: 'Sunny' },
    ];

    const validateFields = () => {
        let isValid = true;

        if (!selectedCategory) {
            setCategoryError('Please select a category');
            isValid = false;
        } else {
            setCategoryError(null);
        }

        if (!frequency) {
            setFrequencyError('Please select a frequency');
            isValid = false;
        } else {
            setFrequencyError(null);
        }

        return isValid;
    };

    const saveHabit = async (data: HabitFormData) => {
        if (!validateFields()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const habitId = Date.now().toString();

            const newHabit: Habit = {
                id: habitId,
                title: data.title,
                description: data.description || '',
                category: selectedCategory,
                frequency: frequency,
                icon: selectedIcon,
                createdAt: new Date().toISOString(),
                completed: false,
                streak: 0
            };

            const existingHabitsJson = await AsyncStorage.getItem('userHabits');
            let existingHabits: Habit[] = [];

            if (existingHabitsJson) {
                existingHabits = JSON.parse(existingHabitsJson);
            }
            const updatedHabits = [...existingHabits, newHabit];

            await AsyncStorage.setItem('userHabits', JSON.stringify(updatedHabits));

            console.log('Habit saved successfully', newHabit);
            // Alert.alert(
            //     "Success",
            //     "Habit created successfully!",
            //     [{ text: "OK", onPress: () => navigation.goBack() }]
            // );
            setShowAlert(true);
        } catch (error) {
            console.error('Error saving habit:', error);
            Alert.alert(
                "Error",
                "There was a problem saving your habit. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const GridItem = ({ title, name, selected }: { title: string, name: string, selected: boolean }) => {
        const { theme } = useTheme();
        return (
            <TouchableOpacity
                onPress={() => setSelectedIcon(title)}
                activeOpacity={0.75}
                style={{
                    flex: 1,
                    margin: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.card,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: theme.primary,
                    borderWidth: 1,
                    opacity: selected ? 1 : 0.5
                }}
            >
                <Icon name={title} size={32} color={theme.primary} />
                <Text style={[getTextStyles(theme).body, { color: theme.primary, marginTop: 5 }]}>{name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: statusBarHeight, backgroundColor: theme.safeAreaBackground }}>
            <AppBarTitle title='Add New Habit' />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <TextInput
                    label="title"
                    placeholder="Enter a title"
                    onChangeText={text => setValue('title', text)}
                    {...register('title')}
                />
                {errors.title && (
                    <Text style={[getTextStyles(theme).error, { marginTop: 5 }]}>
                        {errors.title.message}
                    </Text>
                )}

                <TextInput
                    label="description"
                    placeholder="Enter a description"
                    multiline
                    onChangeText={text => setValue('description', text)}
                    {...register('description')}
                />

                <SelectInput
                    label="Category"
                    options={categories}
                    value={selectedCategory}
                    onSelect={(value) => {
                        setSelectedCategory(value);
                        setCategoryError(null); // Clear error on selection
                    }}
                    placeholder="Select a category"
                />
                {categoryError && (
                    <Text style={[getTextStyles(theme).error, { marginTop: 5 }]}>
                        {categoryError}
                    </Text>
                )}

                <SelectInput
                    label="Frequency"
                    options={frequencies}
                    value={frequency}
                    onSelect={(value) => {
                        setFrequency(value);
                        setFrequencyError(null);
                    }}
                    placeholder="Select a frequency"
                />
                {frequencyError && (
                    <Text style={[getTextStyles(theme).error, { marginTop: 5 }]}>
                        {frequencyError}
                    </Text>
                )}

                <View>
                    <Text style={[getTextStyles(theme).label, { marginBottom: 10, marginTop: 20 }]}>Choose an Icon</Text>
                    <FlatList
                        data={icons}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <GridItem title={item.title} name={item.name} selected={selectedIcon === item.title} />}
                        numColumns={3}
                    />
                </View>
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
                <Button
                    title={isSubmitting ? "Saving..." : "Add Habit"}
                    variant="primary"
                    width="100%"
                    mt={20}
                    disabled={isSubmitting}
                    onPress={handleSubmit(saveHabit)}
                />
            </View>
            <PaperAlert visible={showAlert} onClose={handleCloseAlert} />
        </View>
    );
};

export default AddNewHabit;
