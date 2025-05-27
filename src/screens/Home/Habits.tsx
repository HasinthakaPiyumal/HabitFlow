import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    Dimensions,
    TextInput as RNTextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { getTextStyles } from '../../assets/styles/TextStyles';
import { useFocusEffect } from '@react-navigation/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import TextInput from '../../components/TextInput/TextInput';
import SelectInput from '../../components/SelectInput/SelectInput';
import Button from '../../components/Button/Button';

const statusBarHeight = getStatusBarHeight();
const screenWidth = Dimensions.get('window').width;

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

// Category chip component for filtering
const CategoryChip = ({
    label,
    isSelected,
    onPress,
}: {
    label: string;
    isSelected: boolean;
    onPress: () => void
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.categoryChip,
                {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: theme.primary,
                },
            ]}
        >
            <Text
                style={[
                    getTextStyles(theme).label,
                    {
                        color: isSelected ? '#FFFFFF' : theme.primary,
                        fontSize: 12,
                    },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const Habits = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Edit modal state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentHabit, setCurrentHabit] = useState<Habit | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedCategory, setEditedCategory] = useState<string | null>(null);
    const [editedFrequency, setEditedFrequency] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Available categories and frequencies
    const categoryOptions = [
        { label: 'Health', value: 'health' },
        { label: 'Fitness', value: 'fitness' },
        { label: 'Productivity', value: 'productivity' },
        { label: 'Mental Health', value: 'mental_health' },
        { label: 'Learning', value: 'learning' },
    ];

    const frequencyOptions = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ];

    // Load habits from AsyncStorage
    const loadHabits = async () => {
        setLoading(true);
        try {
            const habitsJson = await AsyncStorage.getItem('userHabits');

            if (habitsJson) {
                const habitsData = JSON.parse(habitsJson) as Habit[];
                setHabits(habitsData);
                setFilteredHabits(habitsData);

                // Extract unique categories from habits
                const uniqueCategories = Array.from(
                    new Set(
                        habitsData
                            .filter(habit => habit.category)
                            .map(habit => habit.category as string)
                    )
                );
                setCategories(uniqueCategories);
            } else {
                setHabits([]);
                setFilteredHabits([]);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error loading habits:', error);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters based on selected category and search query
    const applyFilters = () => {
        let result = habits;

        if (selectedCategory !== null) {
            result = result.filter(habit => habit.category === selectedCategory);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(habit =>
                habit.title.toLowerCase().includes(query) ||
                (habit.description && habit.description.toLowerCase().includes(query)) ||
                (habit.category && habit.category.toLowerCase().includes(query))
            );
        }

        setFilteredHabits(result);
    };

    // Reapply filters when selected category, search query, or habits change
    useEffect(() => {
        applyFilters();
    }, [selectedCategory, searchQuery, habits]);

    // Handle category filter
    const handleCategoryFilter = (category: string | null) => {
        setSelectedCategory(category);
    };

    // Handle deleting a habit
    const handleDeleteHabit = (habit: Habit) => {
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${habit.title}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Filter out the habit to delete
                            const updatedHabits = habits.filter(h => h.id !== habit.id);

                            // Save updated habits list
                            await AsyncStorage.setItem('userHabits', JSON.stringify(updatedHabits));

                            // Update state
                            setHabits(updatedHabits);

                            // Update filtered habits
                            if (selectedCategory === null) {
                                setFilteredHabits(updatedHabits);
                            } else {
                                setFilteredHabits(updatedHabits.filter(h => h.category === selectedCategory));
                            }

                            // Extract unique categories from updated habits
                            const uniqueCategories = Array.from(
                                new Set(
                                    updatedHabits
                                        .filter(h => h.category)
                                        .map(h => h.category as string)
                                )
                            );
                            setCategories(uniqueCategories);

                            // If current category no longer exists, reset to All
                            if (selectedCategory && !uniqueCategories.includes(selectedCategory)) {
                                setSelectedCategory(null);
                                setFilteredHabits(updatedHabits);
                            }

                            Alert.alert('Success', 'Habit deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting habit:', error);
                            Alert.alert('Error', 'Failed to delete habit. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    // Open edit modal
    const openEditModal = (habit: Habit) => {
        setCurrentHabit(habit);
        setEditedTitle(habit.title);
        setEditedDescription(habit.description || '');
        setEditedCategory(habit.category);
        setEditedFrequency(habit.frequency);
        setEditModalVisible(true);
    };

    // Save edited habit
    const saveEditedHabit = async () => {
        if (!currentHabit || !editedTitle.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        setIsSaving(true);
        try {
            const updatedHabit: Habit = {
                ...currentHabit,
                title: editedTitle.trim(),
                description: editedDescription.trim() || '',
                category: editedCategory,
                frequency: editedFrequency,
            };

            // Update habit in the list
            const updatedHabits = habits.map(h =>
                h.id === currentHabit.id ? updatedHabit : h
            );

            // Save updated habits to AsyncStorage
            await AsyncStorage.setItem('userHabits', JSON.stringify(updatedHabits));

            // Update state
            setHabits(updatedHabits);

            // Update filtered habits
            if (selectedCategory === null) {
                setFilteredHabits(updatedHabits);
            } else {
                setFilteredHabits(updatedHabits.filter(h => h.category === selectedCategory));
            }

            // Extract unique categories from updated habits
            const uniqueCategories = Array.from(
                new Set(
                    updatedHabits
                        .filter(h => h.category)
                        .map(h => h.category as string)
                )
            );
            setCategories(uniqueCategories);

            setEditModalVisible(false);
            Alert.alert('Success', 'Habit updated successfully!');
        } catch (error) {
            console.error('Error updating habit:', error);
            Alert.alert('Error', 'Failed to update habit. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await loadHabits();
        setRefreshing(false);
    };

    // Load habits when component mounts or when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadHabits();
        }, [])
    );

    // Render each habit item
    const renderHabitItem = ({ item }: { item: Habit }) => {
        return (
            <View style={[styles.habitCard, { backgroundColor: theme.card }]}>
                <View style={styles.habitHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
                        <Icon name={item.icon || 'water-outline'} size={24} color={theme.primary} />
                    </View>
                    <View style={styles.habitTitleContainer}>
                        <Text style={[getTextStyles(theme).subheading, { marginBottom: 2 }]}>
                            {item.title}
                        </Text>
                        {item.category && (
                            <View style={[styles.categoryTag, { backgroundColor: `${theme.primary}20` }]}>
                                <Text style={[getTextStyles(theme).label, { color: theme.primary, fontSize: 11 }]}>
                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Actions dropdown */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            onPress={() => openEditModal(item)}
                            style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
                        >
                            <Icon name="pencil-outline" size={16} color={theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteHabit(item)}
                            style={[styles.actionButton, { backgroundColor: '#FF595E20', marginLeft: 8 }]}
                        >
                            <Icon name="trash-outline" size={16} color="#FF595E" />
                        </TouchableOpacity>
                    </View>
                </View>

                {item.description && (
                    <Text style={[getTextStyles(theme).body, { marginTop: 10 }]}>
                        {item.description}
                    </Text>
                )}

                <View style={styles.habitFooter}>
                    <View style={styles.streakContainer}>
                        {item.streak > 0 && (
                            <View style={styles.streakWrapper}>
                                <Icon name="flame" size={14} color={theme.textSecondary} />
                                <Text style={[getTextStyles(theme).label, { marginLeft: 4 }]}>
                                    {item.streak} day streak
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.frequencyTagFooter}>
                        <Text style={[getTextStyles(theme).caption, { color: theme.textSecondary }]}>
                            {item.frequency?.charAt(0).toUpperCase() + item.frequency?.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // Edit Modal Component
    const renderEditModal = () => {
        return (
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={getTextStyles(theme).heading}>Edit Habit</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Icon name="close" size={24} color={theme.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ maxHeight: '80%' }} showsVerticalScrollIndicator={false}>
                            <TextInput
                                label="Title"
                                placeholder="Enter habit title"
                                value={editedTitle}
                                onChangeText={setEditedTitle}
                                width={screenWidth - 80}
                            />

                            <TextInput
                                label="Description"
                                placeholder="Enter habit description"
                                value={editedDescription}
                                onChangeText={setEditedDescription}
                                multiline
                                width={screenWidth - 80}
                            />

                            <SelectInput
                                label="Category"
                                options={categoryOptions}
                                value={editedCategory}
                                onSelect={setEditedCategory}
                                placeholder="Select a category"
                                width={screenWidth - 80}
                            />

                            <SelectInput
                                label="Frequency"
                                options={frequencyOptions}
                                value={editedFrequency}
                                onSelect={setEditedFrequency}
                                placeholder="Select a frequency"
                                width={screenWidth - 80}
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setEditModalVisible(false)}
                                width="48%"
                            />
                            <Button
                                title={isSaving ? 'Saving...' : 'Save'}
                                variant="primary"
                                onPress={saveEditedHabit}
                                width="48%"
                                disabled={isSaving}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    // Loading indicator
    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[getTextStyles(theme).subheading, { marginTop: 20 }]}>Loading habits...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={getTextStyles(theme).heading}>All Habits</Text>
            </View>

            {/* Search bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
                <Icon name="search-outline" size={20} color={theme.textSecondary} />
                <RNTextInput
                    style={[styles.searchInput, { color: theme.textPrimary }]}
                    placeholder="Search habits..."
                    placeholderTextColor={theme.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close-circle" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category filters */}
            <View style={{ marginBottom: 16 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScrollView}
                    contentContainerStyle={styles.categoryContainer}
                >
                    <CategoryChip
                        label="All"
                        isSelected={selectedCategory === null}
                        onPress={() => handleCategoryFilter(null)}
                    />
                    {categories.map((category) => (
                        <CategoryChip
                            key={category}
                            label={category.charAt(0).toUpperCase() + category.slice(1)}
                            isSelected={selectedCategory === category}
                            onPress={() => handleCategoryFilter(category)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Habit list */}
            {filteredHabits.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="search-outline" size={60} color={`${theme.textSecondary}50`} />
                    <Text style={[getTextStyles(theme).subheading, { marginTop: 20, textAlign: 'center' }]}>
                        {habits.length === 0
                            ? 'No habits found'
                            : searchQuery
                                ? 'No habits match your search'
                                : 'No habits in this category'}
                    </Text>
                    <Text style={[getTextStyles(theme).body, { textAlign: 'center', marginTop: 8 }]}>
                        {habits.length === 0
                            ? 'Create a new habit to start tracking your progress'
                            : searchQuery
                                ? 'Try a different search term or clear filters'
                                : 'Try selecting a different category'}
                    </Text>
                    {habits.length === 0 && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('NewHabit')}
                            style={[styles.createHabitButton, { backgroundColor: theme.primary }]}
                        >
                            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Create Habit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredHabits}
                    keyExtractor={(item) => item.id}
                    renderItem={renderHabitItem}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.primary]}
                        />
                    }
                />
            )}

            {/* Edit Habit Modal */}
            {renderEditModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: statusBarHeight,
        paddingHorizontal: 16,
    },
    header: {
        marginVertical: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 8,
        fontSize: 16,
    },
    categoryScrollView: {
        flexGrow: 0,
    },
    categoryContainer: {
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    categoryChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    listContainer: {
        paddingBottom: 80,
    },
    habitCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    habitHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    habitTitleContainer: {
        flex: 1,
        marginLeft: 12,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    frequencyTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    habitFooter: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    streakContainer: {
        flexDirection: 'row',
    },
    streakWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frequencyTagFooter: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        borderRadius: 12,
        padding: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    createHabitButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
    },
});

export default Habits;
