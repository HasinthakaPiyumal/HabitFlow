import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Animated,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useTheme } from '../../context/ThemeContext';
import { getTextStyles } from '../../assets/styles/TextStyles';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { Calendar, DateData } from 'react-native-calendars';
import styles from './StatsStyles';

const screenWidth = Dimensions.get('window').width;
const statusBarHeight = getStatusBarHeight();

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

interface DailyProgress {
    date: string;
    completedCount: number;
    totalCount: number;
}

const Stats = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completions, setCompletions] = useState<HabitCompletion[]>([]);
    const [weeklyProgress, setWeeklyProgress] = useState<DailyProgress[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
    const [selectedDateHabits, setSelectedDateHabits] = useState<Habit[]>([]);

    // Animation value for fade in effect
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Load data from AsyncStorage
    const loadData = async () => {
        setLoading(true);
        try {
            // Load habits
            const habitsJson = await AsyncStorage.getItem('userHabits');
            const habitsData = habitsJson ? JSON.parse(habitsJson) as Habit[] : [];
            setHabits(habitsData);

            // Load completions
            const completionsJson = await AsyncStorage.getItem('habitCompletions');
            const completionsData = completionsJson ? JSON.parse(completionsJson) as HabitCompletion[] : [];
            setCompletions(completionsData);

            // Process data
            processData(habitsData, completionsData);

            // Get completed habits for selected date
            findCompletedHabitsForDate(selectedDate, habitsData, completionsData);

        } catch (error) {
            console.error('Error loading stats data:', error);
        } finally {
            setLoading(false);
            startAnimation();
        }
    };

    // Start fade-in animation
    const startAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    // Process data for weekly progress and marked dates
    const processData = (habitsData: Habit[], completionsData: HabitCompletion[]) => {
        // Calculate weekly progress
        const today = new Date();
        const weeklyData: DailyProgress[] = [];

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Count daily habits
            const dailyHabits = habitsData.filter(h => h.frequency === 'daily');

            // Count completed habits for this date
            const completedCount = completionsData.filter(c =>
                c.date.split('T')[0] === dateStr &&
                c.completed &&
                dailyHabits.some(h => h.id === c.habitId)
            ).length;

            weeklyData.push({
                date: dateStr,
                completedCount,
                totalCount: dailyHabits.length
            });
        }

        setWeeklyProgress(weeklyData);

        // Process marked dates for calendar
        const markedDatesObj: { [date: string]: any } = {};

        completionsData.forEach(completion => {
            if (completion.completed) {
                const date = completion.date.split('T')[0];
                if (!markedDatesObj[date]) {
                    markedDatesObj[date] = {
                        marked: true,
                        dotColor: theme.primary
                    };
                }
            }
        });

        // Add selected date marker
        markedDatesObj[selectedDate] = {
            ...markedDatesObj[selectedDate],
            selected: true,
            selectedColor: theme.primary
        };

        setMarkedDates(markedDatesObj);
    };

    // Find habits completed on a specific date
    const findCompletedHabitsForDate = (date: string, habitsData: Habit[], completionsData: HabitCompletion[]) => {
        // Get completions for selected date
        const dateCompletions = completionsData.filter(c =>
            c.date.split('T')[0] === date && c.completed
        );

        // Find habits that were completed on this date
        const completedHabits = habitsData.filter(habit =>
            dateCompletions.some(c => c.habitId === habit.id)
        );

        setSelectedDateHabits(completedHabits);
    };

    // Handle date selection on calendar
    const handleDateSelect = (day: DateData) => {
        const selectedDateString = day.dateString;

        // Update selected date
        setSelectedDate(selectedDateString);

        // Update marked dates
        const updatedMarkedDates = { ...markedDates };

        // Remove selected state from previous date
        if (markedDates[selectedDate]) {
            updatedMarkedDates[selectedDate] = {
                ...markedDates[selectedDate],
                selected: false
            };

            if (!updatedMarkedDates[selectedDate].marked) {
                delete updatedMarkedDates[selectedDate];
            }
        }

        // Add selected state to new date
        updatedMarkedDates[selectedDateString] = {
            ...(updatedMarkedDates[selectedDateString] || {}),
            selected: true,
            selectedColor: theme.primary
        };

        setMarkedDates(updatedMarkedDates);

        // Find habits completed on this date
        findCompletedHabitsForDate(selectedDateString, habits, completions);
    };

    // Load data when component mounts or comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    // // Update data when theme changes
    // useEffect(() => {
    //     if (habits.length > 0 && completions.length > 0) {
    //         processData(habits, completions);
    //     }
    // }, [theme]);

    // Render completed habit item
    const renderCompletedHabit = ({ item }: { item: Habit }) => (
        <View style={[styles.habitItem, { backgroundColor: theme.card }]}>
            <View style={styles.habitItemContent}>
                <View style={[styles.habitIcon, { backgroundColor: `${theme.primary}20` }]}>
                    <Icon name={item.icon || 'checkmark-circle'} size={24} color={theme.primary} />
                </View>
                <View style={styles.habitDetails}>
                    <Text style={getTextStyles(theme).subheading}>{item.title}</Text>
                    {item.description && (
                        <Text style={[getTextStyles(theme).body, styles.habitDescription]} numberOfLines={1}>
                            {item.description}
                        </Text>
                    )}
                    {item.category && (
                        <View style={[styles.categoryTag, { backgroundColor: `${theme.primary}20` }]}>
                            <Text style={[getTextStyles(theme).caption, { color: theme.primary }]}>
                                {item.category}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={[styles.completedBadge, { backgroundColor: theme.success }]}>
                <Icon name="checkmark" size={14} color="#FFFFFF" />
                <Text style={styles.completedText}>Completed</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[getTextStyles(theme).subheading, { marginTop: 20 }]}>Loading stats...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={getTextStyles(theme).heading}>Your Stats</Text>
            </View>

            {/* Weekly Progress Chart */}
            <Animated.View style={[styles.sectionCard, { backgroundColor: theme.card, opacity: fadeAnim }]}>
                <Text style={[getTextStyles(theme).subheading, styles.sectionTitle]}>
                    Current Week Progress
                </Text>
                {weeklyProgress.length > 0 ? (
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={{
                                labels: weeklyProgress.map(item =>
                                    new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
                                ),
                                datasets: [
                                    {
                                        data: weeklyProgress.map(item =>
                                            item.totalCount > 0
                                                ? (item.completedCount / item.totalCount) * 100
                                                : 0
                                        ),
                                        color: (opacity = 1) => `rgba(${theme.primaryRGB || '46, 113, 229'}, ${opacity})`,
                                        strokeWidth: 2
                                    }
                                ],
                                legend: ["Completion %"]
                            }}
                            width={screenWidth - 80}
                            height={220}
                            yAxisSuffix="%"
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: theme.card,
                                backgroundGradientFrom: theme.card,
                                backgroundGradientTo: theme.card,
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(${'140, 82, 255'}, ${opacity})`,
                                labelColor: (opacity = 1) => theme.textPrimary,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: theme.primary,
                                }
                            }}
                            bezier
                            style={styles.chart}
                        />
                        <View style={styles.chartLegend}>
                            <View style={styles.chartLegendItem}>
                                <Text style={getTextStyles(theme).body}>
                                    Average completion rate: {' '}
                                    {Math.round(weeklyProgress.reduce((sum, day) =>
                                        sum + (day.totalCount > 0 ? (day.completedCount / day.totalCount) * 100 : 0),
                                        0) / weeklyProgress.length)}%
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Text style={getTextStyles(theme).body}>No data available for the current week.</Text>
                    </View>
                )}
            </Animated.View>

            {/* Calendar View */}
            <Animated.View style={[styles.sectionCard, { backgroundColor: theme.card, opacity: fadeAnim }]}>
                <Text style={[getTextStyles(theme).subheading, styles.sectionTitle]}>
                    Completion Calendar
                </Text>
                <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: theme.card,
                        calendarBackground: theme.card,
                        textSectionTitleColor: theme.textPrimary,
                        selectedDayBackgroundColor: theme.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: theme.primary,
                        dayTextColor: theme.textPrimary,
                        textDisabledColor: theme.textSecondary,
                        dotColor: theme.primary,
                        monthTextColor: theme.textPrimary,
                        arrowColor: theme.primary,
                        indicatorColor: theme.primary,
                    }}
                />
                <View style={styles.calendarLegend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
                        <Text style={getTextStyles(theme).caption}>Completed habits</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.primary, opacity: 0.5 }]} />
                        <Text style={getTextStyles(theme).caption}>Selected date</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Selected Date Habits */}
            <Animated.View style={[styles.sectionCard, { backgroundColor: theme.card, opacity: fadeAnim }]}>
                <View style={styles.dateHeaderContainer}>
                    <Text style={[getTextStyles(theme).subheading, styles.sectionTitle]}>
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                    <View style={[styles.dateBadge, { backgroundColor: theme.primary + '20' }]}>
                        <Text style={[getTextStyles(theme).caption, { color: theme.primary }]}>
                            {selectedDateHabits.length} completed
                        </Text>
                    </View>
                </View>

                {selectedDateHabits.length > 0 ? (
                    <View style={styles.tableContainer}>
                        {/* Table Header */}
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: theme.border }]}>
                            <View style={[styles.tableIconCell, { marginRight: 12 }]}>
                                <Text style={[getTextStyles(theme).caption, styles.tableHeaderText]}>Icon</Text>
                            </View>
                            <View style={styles.tableTitleCell}>
                                <Text style={[getTextStyles(theme).caption, styles.tableHeaderText]}>Habit</Text>
                            </View>
                            <View style={styles.tableCategoryCell}>
                                <Text style={[getTextStyles(theme).caption, styles.tableHeaderText]}>Category</Text>
                            </View>
                        </View>

                        {/* Table Rows */}
                        {selectedDateHabits.map(habit => (
                            <View
                                key={habit.id}
                                style={[
                                    styles.tableRow,
                                    { borderBottomColor: theme.border }
                                ]}
                            >
                                <View style={[styles.tableIconCell, { marginRight: 12 }]}>
                                    <View style={[styles.habitIconSmall, { backgroundColor: `${theme.primary}20` }]}>
                                        <Icon name={habit.icon || 'checkmark-circle'} size={20} color={theme.primary} />
                                    </View>
                                </View>
                                <View style={styles.tableTitleCell}>
                                    <Text style={getTextStyles(theme).body} numberOfLines={1}>
                                        {habit.title}
                                    </Text>
                                    {habit.description && (
                                        <Text
                                            style={[getTextStyles(theme).caption, { color: theme.textSecondary }]}
                                            numberOfLines={1}
                                        >
                                            {habit.description}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.tableCategoryCell}>
                                    {habit.category ? (
                                        <View style={[styles.categoryPill, { backgroundColor: `${theme.primary}20` }]}>
                                            <Text
                                                style={[getTextStyles(theme).caption, { color: theme.primary }]}
                                                numberOfLines={1}
                                            >
                                                {habit.category}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={[getTextStyles(theme).caption, { color: theme.textSecondary }]}>
                                            -
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Icon name="calendar-outline" size={48} color={theme.textSecondary + '50'} />
                        <Text style={[getTextStyles(theme).body, styles.emptyStateText]}>
                            No habits completed on this date
                        </Text>
                    </View>
                )}
            </Animated.View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

export default Stats;