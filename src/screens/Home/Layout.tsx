import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Text } from 'react-native';
import { getTextStyles } from '../../assets/styles/TextStyles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import Settings from './Settings';
import Habits from './Habits';
import Stats from './Stats';

const Tab = createBottomTabNavigator();

const Layout = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color }) => {
                    if (route.name === 'Add') {
                        return null; // Custom button is handled separately
                    }
                    return <Icon name={route.name === "Add" ? 'add' : route.name === "Habits" ? 'apps-outline' : route.name === "Stats" ? 'analytics-outline' : route.name === "Home" ? 'home-outline' : 'settings-outline'} size={24} color={color} />;
                },
                tabBarStyle: { height: 90, backgroundColor: theme.card, borderColor: theme.card, filter: '', paddingTop: 10, elevation: 0, justifyContent: 'center', alignItems: 'center' },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.text,
                tabBarLabel: ({ color, children }) => (<Text style={[getTextStyles(theme).caption, { color: color }]}>{children}</Text>),
            })}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Habits" component={Habits} />
            <Tab.Screen
                name="Add"
                component={Home}
                options={{
                    tabBarButton: () => (
                        <View
                            style={{ width: "100%", alignItems: 'center', justifyContent: 'center', }}>
                            <TouchableOpacity onPress={() => navigation.navigate('NewHabit')}
                                style={{
                                    height: '90%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: theme.primary,
                                    width: 60,
                                    aspectRatio: 1,
                                    borderRadius: 100
                                }}>
                                <Icon name="add" size={32} style={{ color: "#fff", opacity: 0.8 }} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Tab.Screen name="Stats" component={Stats} />
            < Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator >
    );
};

export default Layout;
