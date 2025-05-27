import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
    Dimensions,
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
import LottieView from 'lottie-react-native';

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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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

    const animationRef = useRef<LottieView>(null);
    const [visible, setVisible] = useState(false);

    const playAnimation = () => {
        setVisible(true);
        animationRef.current?.play();
    };

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

                        // Calculate streak for this habit
                        let currentStreak = 0;

                        if (habit.frequency === 'daily') {
                            // Check today's completion
                            todayCompletion = loadedCompletions.find(
                                c => c.habitId === habit.id && c.date === today,
                            )?.completed || false;

                            // Calculate streak for daily habits
                            if (todayCompletion) {
                                currentStreak = 1; // Start with 1 for today
                                let checkDate = new Date();

                                // Look back to find consecutive completions
                                for (let i = 1; i <= 365; i++) { // Check up to a year back (limit to avoid infinite loops)
                                    checkDate.setDate(checkDate.getDate() - 1);
                                    const dateStr = checkDate.toISOString().split('T')[0];

                                    // Check if there's a completion for this date
                                    const completed = loadedCompletions.find(
                                        c => c.habitId === habit.id && c.date === dateStr && c.completed
                                    );

                                    if (completed) {
                                        currentStreak++;
                                    } else {
                                        break; // Streak ends at first missed day
                                    }
                                }
                            }
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

                            // Calculate streak for weekly habits (in weeks)
                            if (todayCompletion) {
                                currentStreak = 1; // Start with 1 for this week
                                let checkWeekStart = new Date(currentWeekStart);
                                checkWeekStart.setDate(checkWeekStart.getDate() - 7); // Previous week

                                // Check up to 52 weeks back (a year)
                                for (let i = 1; i <= 52; i++) {
                                    const checkWeekEnd = new Date(checkWeekStart);
                                    checkWeekEnd.setDate(checkWeekStart.getDate() + 6);

                                    // Check if there's any completion in this week
                                    const completedThisWeek = loadedCompletions.find(c => {
                                        const completionDate = new Date(c.date);
                                        return (
                                            c.habitId === habit.id &&
                                            completionDate >= checkWeekStart &&
                                            completionDate <= checkWeekEnd &&
                                            c.completed
                                        );
                                    });

                                    if (completedThisWeek) {
                                        currentStreak++;
                                        // Move to previous week
                                        checkWeekStart.setDate(checkWeekStart.getDate() - 7);
                                    } else {
                                        break; // Streak ends at first missed week
                                    }
                                }
                            }
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

                            // Calculate streak for monthly habits (in months)
                            if (todayCompletion) {
                                currentStreak = 1; // Start with 1 for this month
                                let currentYear = todayDate.getFullYear();
                                let currentMonth = todayDate.getMonth();

                                // Check up to 12 months back (a year)
                                for (let i = 1; i <= 12; i++) {
                                    // Move to previous month
                                    currentMonth--;
                                    if (currentMonth < 0) {
                                        currentMonth = 11; // December
                                        currentYear--;
                                    }

                                    const checkMonthStart = new Date(currentYear, currentMonth, 1);
                                    const checkMonthEnd = new Date(currentYear, currentMonth + 1, 0);

                                    // Check if there's any completion in this month
                                    const completedThisMonth = loadedCompletions.find(c => {
                                        const completionDate = new Date(c.date);
                                        return (
                                            c.habitId === habit.id &&
                                            completionDate >= checkMonthStart &&
                                            completionDate <= checkMonthEnd &&
                                            c.completed
                                        );
                                    });

                                    if (completedThisMonth) {
                                        currentStreak++;
                                    } else {
                                        break; // Streak ends at first missed month
                                    }
                                }
                            }
                        }

                        return {
                            ...habit,
                            completed: todayCompletion,
                            streak: currentStreak, // Update streak value
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
        if (!habit.completed) { playAnimation(); }
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
                    marginVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: item.completed ? `${theme.primary}10` : theme.card,
                    padding: 14,
                    borderRadius: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: item.completed ? theme.primary : 'transparent',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View
                        style={{
                            backgroundColor: item.completed ? `${theme.primary}30` : `${theme.primary}15`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 60,
                            height: 60,
                            borderRadius: 12,
                        }}>
                        <Icon
                            name={item.icon || 'checkbox-outline'}
                            size={32}
                            color={item.completed ? theme.primary : theme.textSecondary}
                        />
                    </View>
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <Text
                            style={[
                                getTextStyles(theme).subheading,
                                {
                                    marginBottom: 0,
                                    fontWeight: item.completed ? '700' : '600',
                                    color: item.completed ? theme.textPrimary : theme.textPrimary,
                                },
                            ]}>
                            {item.title}
                        </Text>
                        <Text
                            style={[
                                getTextStyles(theme).body,
                                {
                                    marginTop: 3,
                                    color: item.completed ? theme.textPrimary : theme.textSecondary,
                                },
                            ]}
                            numberOfLines={1}>
                            {item.description || 'No description'}
                        </Text>
                        {item.streak > 0 && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 4,
                                    backgroundColor: `${theme.primary}15`,
                                    paddingHorizontal: 8,
                                    paddingVertical: 3,
                                    borderRadius: 12,
                                    alignSelf: 'flex-start',
                                }}
                            >
                                <Text style={{ color: theme.primary, fontSize: 12 }}>🔥</Text>
                                <Text
                                    style={[
                                        getTextStyles(theme).caption,
                                        {
                                            color: theme.primary,
                                            fontWeight: '600',
                                            marginLeft: 4,
                                        },
                                    ]}>
                                    {item.streak} {item.frequency === 'daily' ? 'day' :
                                        item.frequency === 'weekly' ? 'week' : 'month'} streak
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => toggleHabitCompletion(item)}
                    style={{
                        borderWidth: 2,
                        borderColor: item.completed ? theme.primary : theme.border,
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: item.completed ? theme.primary : 'transparent',
                        shadowColor: item.completed ? theme.primary : 'transparent',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: item.completed ? 3 : 0,
                    }}>
                    {item.completed ? (
                        <Icon name="checkmark" size={20} color="#FFFFFF" />
                    ) : (
                        <Icon name="add" size={20} color={theme.textSecondary} style={{ opacity: 0.6 }} />
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

            <LottieView
                ref={animationRef}
                source={require('./../../assets/animations/congratulations.json')}
                autoPlay={false}
                loop={false}
                style={[styles.lottie, { height: visible ? screenWidth - 40 : 0 }]}
                onAnimationFinish={() => setVisible(false)}
            />

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
                            color={`${theme.textSecondary}`}
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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    lottie: {
        width: screenWidth - 40,
        height: 200,
        position: 'absolute',
        zIndex: 1000,
        top: (screenHeight / 2) - 200,
        marginLeft: 10,
        pointerEvents: 'auto',
    },
});

export default Home;
