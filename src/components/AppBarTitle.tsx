import React from 'react'
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTextStyles } from '../assets/styles/TextStyles';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const AppBarTitle = ({ title }: { title: string }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, gap: 10 }}>
            <Icon name="arrow-back" size={28} color={theme.textPrimary} onPress={() => { navigation.goBack(); }} style={{ position: 'absolute', left: 0, fontWeight: 'bold' }} />
            <Text style={[getTextStyles(theme).heading, { marginBottom: 0 }]}>{title}</Text>
        </View>
    )
}

export default AppBarTitle