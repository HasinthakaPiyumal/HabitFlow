import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

interface AlertProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
}

const PaperAlert = ({
    visible,
    onClose,
    title = 'Success',
    message = 'Operation completed successfully!',
    type = 'success'
}: AlertProps) => {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const iconAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0.5);
            opacityAnim.setValue(0);
            iconAnim.setValue(0);

            // Start animations
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 80,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.spring(iconAnim, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [iconAnim, opacityAnim, scaleAnim, visible]);

    const getAlertConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    color: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.15)'
                };
            case 'error':
                return {
                    icon: 'close-circle',
                    color: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.15)'
                };
            case 'warning':
                return {
                    icon: 'warning',
                    color: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.15)'
                };
            case 'info':
                return {
                    icon: 'information-circle',
                    color: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.15)'
                };
            default:
                return {
                    icon: 'checkmark-circle',
                    color: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.15)'
                };
        }
    };

    const alertConfig = getAlertConfig();

    const iconScale = iconAnim.interpolate({
        inputRange: [0, 0.5, 0.8, 1],
        outputRange: [0, 1.2, 0.9, 1]
    });

    const handleClose = () => {
        // Animate out
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0.5,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(() => {
            onClose();
        });
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={[
                styles.overlay,
                { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }
            ]}>
                <Animated.View
                    style={[
                        styles.alertBox,
                        {
                            backgroundColor: theme.card,
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim
                        }
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: alertConfig.backgroundColor }]}>
                        <Animated.View style={{
                            transform: [{ scale: iconScale }]
                        }}>
                            <Icon name={alertConfig.icon} size={44} color={alertConfig.color} />
                        </Animated.View>
                    </View>

                    <Text style={[styles.title, { color: alertConfig.color }]}>
                        {title}
                    </Text>

                    <Text style={[styles.message, { color: theme.textPrimary }]}>
                        {message}
                    </Text>

                    <TouchableOpacity
                        onPress={handleClose}
                        style={[styles.button, { backgroundColor: alertConfig.color }]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PaperAlert;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: width * 0.85,
        maxWidth: 320,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    }
});
