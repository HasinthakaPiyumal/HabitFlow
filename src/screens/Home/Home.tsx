import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { getTextStyles } from '../../assets/styles/TextStyles';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../components/Logo';
import Icon from 'react-native-vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

const statusBarHeight = getStatusBarHeight();

// Define the Habit interface
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

interface HabitCompletion {
    habitId: string;
    date: string;
    completed: boolean;
}

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [dailyHabits, setDailyHabits] = useState<Habit[]>([]);
    const [weeklyHabits, setWeeklyHabits] = useState<Habit[]>([]);
    const [monthlyHabits, setMonthlyHabits] = useState<Habit[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>(
        [],
    );

    const loadHabits = async () => {
        try {
            const habitsJson = await AsyncStorage.getItem('userHabits');
            const completionsJson = await AsyncStorage.getItem('habitCompletions');

            console.log('Loading habits from AsyncStorage...');
            console.log('Habits JSON:', habitsJson);
            console.log('Completions JSON:', completionsJson);

            if (habitsJson) {
                let loadedCompletions: HabitCompletion[] = [];
                let loadedHabits: Habit[] = JSON.parse(habitsJson);
                if (completionsJson) {
                    loadedCompletions = JSON.parse(completionsJson);
                    setHabitCompletions(loadedCompletions);
                }

                console.log('Loaded Completions:', loadedCompletions);
                console.log('Loaded habits:', loadedHabits);
                if (completionsJson && habitsJson) {
                    console.log('Updating daily habits with completion status...');
                    loadedHabits = loadedHabits.map(habit => {
                        const today = new Date().toISOString().split('T')[0];
                        console.log('Today:', today);
                        let todayCompletion = false;

                        if (habit.frequency === 'daily') {
                            todayCompletion = loadedCompletions.find(
                                c => c.habitId === habit.id && c.date === today,
                            )?.completed || false;
                        } else if (habit.frequency === 'weekly') {
                            // Get today's date
                            const todayDate = new Date();

                            // Calculate start date of current week (Sunday)
                            const currentWeekStart = new Date(todayDate);
                            currentWeekStart.setDate(todayDate.getDate() - todayDate.getDay()); // Go back to Sunday
                            currentWeekStart.setHours(0, 0, 0, 0); // Set to beginning of day

                            // Calculate end date of current week (Saturday)
                            const currentWeekEnd = new Date(currentWeekStart);
                            currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
                            currentWeekEnd.setHours(23, 59, 59, 999); // Set to end of day

                            // Find completions for this habit within current week
                            const completionsThisWeek = loadedCompletions.filter(c => {
                                const completionDate = new Date(c.date);
                                return (
                                    c.habitId === habit.id &&
                                    completionDate >= currentWeekStart &&
                                    completionDate <= currentWeekEnd &&
                                    c.completed
                                );
                            });

                            // Mark as completed if any completion records exist for this week
                            todayCompletion = completionsThisWeek.length > 0;
                        } else if (habit.frequency === 'monthly') {
                            // Get today's date
                            const todayDate = new Date();
                            const currentMonthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
                            const currentMonthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);

                            // Find completions for this habit within current month
                            const completionsThisMonth = loadedCompletions.filter(c => {
                                const completionDate = new Date(c.date);
                                return (
                                    c.habitId === habit.id &&
                                    completionDate >= currentMonthStart &&
                                    completionDate <= currentMonthEnd &&
                                    c.completed
                                );
                            });

                            // Mark as completed if any completion records exist for this month
                            todayCompletion = completionsThisMonth.length > 0;
                        }

                        return {
                            ...habit,
                            completed: todayCompletion,
                        };
                    });
                }
                setHabits(loadedHabits);
                setDailyHabits(
                    loadedHabits.filter(habit => habit.frequency === 'daily'),
                );
                setWeeklyHabits(
                    loadedHabits.filter(habit => habit.frequency === 'weekly'),
                );
                setMonthlyHabits(
                    loadedHabits.filter(habit => habit.frequency === 'monthly'),
                );

                const completed = loadedHabits.filter(habit => habit.completed && habit.frequency === 'daily').length;
                setCompletedCount(completed);
            }
        } catch (error) {
            console.error('Error loading habits:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHabits();
        setRefreshing(false);
    };

    const toggleHabitCompletion = async (habit: Habit) => {
        console.log('Toggling completion for habit:', habit);
        const today = new Date().toISOString().split('T')[0];
        const newCompletion: HabitCompletion = {
            habitId: habit.id,
            date: today,
            completed: !habit.completed,
        };
        console.log('New completion record:', newCompletion);
        const completedHabitsString = JSON.stringify(
            habit.completed ? habitCompletions.filter(c =>
                !(c.habitId === habit.id && c.date === today)
            ) : habitCompletions.concat(newCompletion),
        );
        console.log('Updated completions:', completedHabitsString);
        await AsyncStorage.setItem(
            'habitCompletions',
            // '[]'
            completedHabitsString
        );
        await loadHabits();
        // try {
        //     const currentDate = new Date().toISOString();
        //     const updatedHabit = { ...habit, completed: !habit.completed };
        //     const today = currentDate.split('T')[0]; // Get just the date part (YYYY-MM-DD)

        //     // Update streak logic
        //     if (!habit.completed) {
        //         updatedHabit.streak += 1;
        //     } else {
        //         updatedHabit.streak = Math.max(0, updatedHabit.streak - 1);
        //     }

        //     // Update habits array
        //     const updatedHabits = habits.map(h =>
        //         h.id === habit.id ? updatedHabit : h
        //     );

        //     // Create a new completion record
        // const newCompletion: HabitCompletion = {
        //     habitId: habit.id,
        //     date: currentDate,
        //     completed: !habit.completed,
        // };

        //     // Get existing completions for this habit today
        //     const existingTodayCompletionIndex = habitCompletions.findIndex(
        //         c => c.habitId === habit.id && c.date.split('T')[0] === today
        //     );

        //     let updatedCompletions: HabitCompletion[];

        //     if (existingTodayCompletionIndex >= 0) {
        //         // Update existing completion for today
        //         updatedCompletions = [...habitCompletions];
        //         updatedCompletions[existingTodayCompletionIndex] = newCompletion;
        //     } else {
        //         // Add new completion record
        //         updatedCompletions = [...habitCompletions, newCompletion];
        //     }

        //     // Save both updated habits and completions to AsyncStorage
        //     await Promise.all([
        //         AsyncStorage.setItem('userHabits', JSON.stringify(updatedHabits)),
        //         AsyncStorage.setItem('habitCompletions', JSON.stringify(updatedCompletions))
        //     ]);

        //     // Update state
        //     setHabits(updatedHabits);
        //     setHabitCompletions(updatedCompletions);
        //     setDailyHabits(updatedHabits.filter(h => h.frequency === 'daily'));
        //     setWeeklyHabits(updatedHabits.filter(h => h.frequency === 'weekly'));
        //     setMonthlyHabits(updatedHabits.filter(h => h.frequency === 'monthly'));

        //     const completed = updatedHabits.filter(h => h.completed).length;
        //     setCompletedCount(completed);
        // } catch (error) {
        //     console.error('Error updating habit:', error);
        // }
    };

    // // Reset daily habits at the start of a new day
    // const checkAndResetDailyHabits = async () => {
    //     try {
    //         const lastResetDateJson = await AsyncStorage.getItem('lastResetDate');
    //         const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    //         if (!lastResetDateJson || JSON.parse(lastResetDateJson) !== currentDate) {
    //             // It's a new day, reset all daily habits
    //             const updatedHabits = habits.map(habit => {
    //                 if (habit.frequency === 'daily') {
    //                     return { ...habit, completed: false };
    //                 }
    //                 return habit;
    //             });

    //             await AsyncStorage.setItem('userHabits', JSON.stringify(updatedHabits));
    //             await AsyncStorage.setItem('lastResetDate', JSON.stringify(currentDate));

    //             setHabits(updatedHabits);
    //             setDailyHabits(updatedHabits.filter(h => h.frequency === 'daily'));
    //             const completed = updatedHabits.filter(h => h.completed).length;
    //             setCompletedCount(completed);
    //         }
    //     } catch (error) {
    //         console.error('Error checking or resetting daily habits:', error);
    //     }
    // };

    useFocusEffect(
        React.useCallback(() => {
            loadHabits();
            // checkAndResetDailyHabits();
        }, []),
    );

    useEffect(() => {
        loadHabits();
        // checkAndResetDailyHabits();;
    }, []);

    const renderHabit = ({ item }: { item: Habit }) => {
        return (
            <View
                style={{
                    marginVertical: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.card,
                    padding: 10,
                    borderRadius: 10,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View
                        style={{
                            backgroundColor: `${theme.primary}20`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 60,
                            height: 60,
                            borderRadius: 10,
                        }}>
                        <Icon
                            name={item.icon || 'checkbox-outline'}
                            size={32}
                            color={theme.primary}
                        />
                    </View>
                    <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text style={[getTextStyles(theme).subheading, { marginBottom: 0 }]}>
                            {item.title}
                        </Text>
                        <Text
                            style={[getTextStyles(theme).body, { marginTop: 0 }]}
                            numberOfLines={1}>
                            {item.description || 'No description'}
                        </Text>
                        {item.streak > 0 && (
                            <Text
                                style={[getTextStyles(theme).caption, { color: theme.primary }]}>
                                🔥 {item.streak} day streak
                            </Text>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => toggleHabitCompletion(item)}
                    style={{
                        borderWidth: 2,
                        borderColor: item.completed ? theme.primary : theme.border,
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: item.completed ? theme.primary : 'transparent',
                    }}>
                    {item.completed && (
                        <Icon name="checkmark" size={18} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const totalHabits = habits.length;
    const progressPercentage =
        totalHabits > 0 ? (completedCount / dailyHabits.length) * 100 : 0;

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: statusBarHeight,
                backgroundColor: theme.background,
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>
                <Logo width={80} />
                {/* <TouchableOpacity onPress={() => navigation.navigate('NewHabit')}>
                    <View
                        style={{
                            backgroundColor: theme.primary,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Icon name="add" size={24} color="#FFFFFF" />
                    </View>
                </TouchableOpacity> */}
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                    }}>
                    <Text style={getTextStyles(theme).subheading}>Today Progress</Text>
                    <Text style={getTextStyles(theme).body}>
                        {completedCount}/{dailyHabits.length}
                    </Text>
                </View>

                <View
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        width: '100%',
                        height: 10,
                        backgroundColor: `${theme.primary}30`,
                        borderRadius: 10,
                        marginVertical: 10,
                    }}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${progressPercentage}%`,
                            height: 10,
                            backgroundColor: theme.primary,
                            borderRadius: 10,
                        }}
                    />
                </View>

                {habits.length === 0 ? (
                    <View
                        style={{
                            padding: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50,
                        }}>
                        <Icon
                            name="create-outline"
                            size={60}
                            color={`${theme.textSecondary}50`}
                        />
                        <Text
                            style={[
                                getTextStyles(theme).title,
                                { textAlign: 'center', marginTop: 20 },
                            ]}>
                            No Habits Yet
                        </Text>
                        <Text
                            style={[
                                getTextStyles(theme).body,
                                { textAlign: 'center', marginTop: 10 },
                            ]}>
                            Create your first habit to start tracking your progress
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('NewHabit')}
                            style={{
                                backgroundColor: theme.primary,
                                paddingVertical: 12,
                                paddingHorizontal: 24,
                                borderRadius: 8,
                                marginTop: 20,
                            }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                                Create Habit
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {dailyHabits.length > 0 && (
                            <>
                                <Text style={[getTextStyles(theme).title, { marginTop: 20 }]}>
                                    Daily Habits
                                </Text>
                                <FlatList
                                    data={dailyHabits}
                                    keyExtractor={item => item.id}
                                    scrollEnabled={false}
                                    renderItem={renderHabit}
                                />
                            </>
                        )}

                        {weeklyHabits.length > 0 && (
                            <>
                                <Text style={[getTextStyles(theme).title, { marginTop: 20 }]}>
                                    Weekly Habits
                                </Text>
                                <FlatList
                                    data={weeklyHabits}
                                    keyExtractor={item => item.id}
                                    scrollEnabled={false}
                                    renderItem={renderHabit}
                                />
                            </>
                        )}

                        {monthlyHabits.length > 0 && (
                            <>
                                <Text style={[getTextStyles(theme).title, { marginTop: 20 }]}>
                                    Monthly Habits
                                </Text>
                                <FlatList
                                    data={monthlyHabits}
                                    keyExtractor={item => item.id}
                                    scrollEnabled={false}
                                    renderItem={renderHabit}
                                />
                            </>
                        )}
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

export default Home;
