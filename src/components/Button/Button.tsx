import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';


export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

const Button = ({ onPress, title, width, variant = 'outline', mt }: { onPress: ((event: GestureResponderEvent) => void) | undefined, title: String, variant?: ButtonVariant, mt?: number, width?: number | string }) => {
    const { theme } = useTheme();
    const themedStyles = {
        ...styles,
        button: {
            ...styles.button,
            width: width,
            marginTop: mt || 0,
            backgroundColor: variant === 'primary' ? theme.primary : variant === 'secondary' ? theme.secondary : 'transparent',
            borderWidth: variant === 'outline' ? 1 : 0,
            borderColor: variant === 'outline' ? theme.primary : 'transparent',
        },
        text: {
            ...styles.text,
            paddingHorizontal: variant === 'link' ? 0 : 24,
            fontWeight: variant === 'link' ? 'normal' as 'normal' : 'bold' as 'bold',
            color: variant === 'outline' ? theme.primary : variant === 'primary' ? '#fff' : variant === 'secondary' ? theme.textSecondary : theme.primary,
        }
    };
    return (
        <TouchableOpacity style={themedStyles.button} onPress={onPress}>
            <Text style={themedStyles.text}>{title}</Text>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        // width: '100%',
        height: 44,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default Button;