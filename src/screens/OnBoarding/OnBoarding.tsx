import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { Text } from '@react-navigation/elements';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button/Button';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const OnBoardingOne = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [title, setTitle] = useState('Build Habits That Last');
    const [subTitle, setSubTitle] = useState('Small daily actions create big life changes. Let’s help you stay consistent.');

    const [onBoardingScreen, setOnBoardingScreen] = useState(0);

    const safeAreaBackgroundColor = useSharedValue('#8BCCFA');

    const firstAnimationStyleProps = useSharedValue({ x: 0, y: 0, scale: 1 });
    const secondAnimationStyleProps = useSharedValue({ x: 0, y: 0, scale: 1 });
    const thirdAnimationStyleProps = useSharedValue({ x: 0, y: 0, scale: 1 });

    const firstDotWidth = useSharedValue(20);
    const secondDotWidth = useSharedValue(8);
    const thirdDotWidth = useSharedValue(8);

    const titleSectionOpacity = useSharedValue(1);

    const titleSectionStyle = useAnimatedStyle(() => ({
        opacity: withTiming(titleSectionOpacity.value, { duration: 250 }),
        transform: [{ scale: withTiming(titleSectionOpacity.value === 1 ? 1 : 0.5, { duration: 250 }) }],
    }));

    const firstDotStyle = useAnimatedStyle(() => ({
        width: withTiming(firstDotWidth.value, { duration: 500 }),
        height: 8, backgroundColor: theme.primary, borderRadius: 20,
    }));
    const secondDotStyle = useAnimatedStyle(() => ({
        width: withTiming(secondDotWidth.value, { duration: 500 }),
        height: 8, backgroundColor: theme.primary, borderRadius: 20,
    }));
    const thirdDotStyle = useAnimatedStyle(() => ({
        width: withTiming(thirdDotWidth.value, { duration: 500 }),
        height: 8, backgroundColor: theme.primary, borderRadius: 20,
    }));
    const containerStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(safeAreaBackgroundColor.value, { duration: 500 }),
        flex: 1,
        width: '100%',
        position: 'relative',
    }));

    const firstAnimationStyle = useAnimatedStyle(() => (
        {
            position: 'absolute',
            left: screenWidth / 2 - 150,
            top: (((screenHeight - 340) - 300) / 2) + 50,
            transform: [
                { translateX: withTiming(firstAnimationStyleProps.value.x, { duration: 500 }) },
                { translateY: withTiming(firstAnimationStyleProps.value.y, { duration: 500 }) },
                { scale: withTiming(firstAnimationStyleProps.value.scale, { duration: 500 }) },
            ],
        }
    ));
    const secondAnimationStyle = useAnimatedStyle(() => (
        {
            position: 'absolute',
            left: screenWidth / 2 - 150,
            top: (((screenHeight - 340) - 300) / 2) + 50,
            transform: [
                { translateX: withTiming(secondAnimationStyleProps.value.x, { duration: 500 }) },
                { scale: withTiming(secondAnimationStyleProps.value.scale, { duration: 500 }) },
                { scale: withTiming(secondAnimationStyleProps.value.scale, { duration: 500 }) },
            ],
        }
    ));
    const thirdAnimationStyle = useAnimatedStyle(() => (
        {
            position: 'absolute',
            left: screenWidth / 2 - 150,
            top: (((screenHeight - 340) - 300) / 2) + 50,
            transform: [
                { translateX: withTiming(thirdAnimationStyleProps.value.x, { duration: 500 }) },
                { translateY: withTiming(thirdAnimationStyleProps.value.y, { duration: 500 }) },
                { scale: withTiming(thirdAnimationStyleProps.value.scale, { duration: 500 }) },
            ],
        }
    ));

    const themedStyles = {
        heading: {
            ...styles.heading,
            color: theme.textTitle,
        },
        subHeading: {
            ...styles.subHeading,
            color: theme.textSecondary,
        },
        bottomContainer: {
            ...styles.bottomContainer,
            backgroundColor: theme.card,
        },
    };

    const updateText = (title: string, subTitle: string) => {
        titleSectionOpacity.value = 0;
        setTimeout(() => {
            setTitle(title);
            setSubTitle(subTitle);
            titleSectionOpacity.value = 1;
        }, 250);
    };
    useEffect(() => {
        console.log('OnBoarding Screen:', onBoardingScreen);
        if (onBoardingScreen === 0) {
            firstAnimationStyleProps.value = { x: 0, y: 0, scale: 1 };
            secondAnimationStyleProps.value = { x: screenWidth, y: -100, scale: 0.5 };
            thirdAnimationStyleProps.value = { x: screenWidth, y: -100, scale: 0.5 };
            safeAreaBackgroundColor.value = '#8BCCFA';
            firstDotWidth.value = 20;
            secondDotWidth.value = 8;
            thirdDotWidth.value = 8;
            updateText('Build Habits That Last', 'Small daily actions create big life changes. Let’s help you stay consistent.');
        } else if (onBoardingScreen === 1) {
            firstAnimationStyleProps.value = { x: -screenWidth, y: -100, scale: 0.5 };
            secondAnimationStyleProps.value = { x: 0, y: 0, scale: 1 };
            thirdAnimationStyleProps.value = { x: screenWidth, y: -100, scale: 0.5 };
            safeAreaBackgroundColor.value = '#c0ffd8';
            firstDotWidth.value = 8;
            secondDotWidth.value = 20;
            thirdDotWidth.value = 8;
            updateText('Analyze Your Progress', 'Track your habits and see how you’re improving over time. Visualize your success.');
        } else {
            firstAnimationStyleProps.value = { x: -screenWidth, y: -100, scale: 0.5 };
            secondAnimationStyleProps.value = { x: -screenWidth, y: -100, scale: 0.5 };
            thirdAnimationStyleProps.value = { x: 0, y: 0, scale: 1 };
            safeAreaBackgroundColor.value = '#c0c4ff';
            firstDotWidth.value = 8;
            secondDotWidth.value = 8;
            thirdDotWidth.value = 20;
            updateText('Achieve Your Goals', 'Celebrate your achievements and stay motivated. Let’s make your dreams a reality.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onBoardingScreen, safeAreaBackgroundColor, firstAnimationStyleProps, secondAnimationStyleProps, thirdAnimationStyleProps, firstDotWidth, secondDotWidth, thirdDotWidth]);


    return (
        // <SafeAreaView style={themedStyles.safeArea}>
        <Animated.View style={containerStyle}>
            <Animated.View
                style={firstAnimationStyle}
            >
                <LottieView
                    source={require('../../assets/animations/checklist.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
            </Animated.View>
            <Animated.View
                style={secondAnimationStyle}
            >
                <LottieView
                    source={require('../../assets/animations/analyze.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 260 }}
                />
            </Animated.View>
            <Animated.View
                style={thirdAnimationStyle}
            >
                <LottieView
                    source={require('../../assets/animations/goal-archived.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
            </Animated.View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: screenHeight - 400, gap: 6 }}>
                <Animated.View style={firstDotStyle} />
                <Animated.View style={secondDotStyle} />
                <Animated.View style={thirdDotStyle} /></View>
            <View style={themedStyles.bottomContainer}>
                <Animated.View style={titleSectionStyle}>
                    <Text style={themedStyles.heading}>{title}</Text>
                    <Text style={themedStyles.subHeading}>{subTitle}</Text>
                </Animated.View>
                <View style={styles.bottomButtonWrapper}>
                    <Button
                        title="Skip"
                        variant="link"
                        onPress={() => {
                            navigation.navigate('Register');
                        }}
                    />
                    {onBoardingScreen === 2 ?
                        <Button
                            title="Get Started"
                            variant="primary"
                            onPress={() => {
                                navigation.navigate('Register');
                            }} />
                        : <Icon
                            name="circle-chevron-right"
                            size={48}
                            color={theme.textSecondary}
                            style={{ color: theme.primary }}
                            onPress={() => {
                                setOnBoardingScreen((prev) => (prev + 1) % 3);
                            }}
                        />}
                </View>
            </View>
        </Animated.View>
        // {/* </SafeAreaView> */ }
    );
};

const styles = StyleSheet.create({
    bottomContainer: {
        height: 340,
        position: 'absolute',
        alignItems: 'center',
        paddingTop: 80,
        bottom: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        textAlign: 'center',
    },
    subHeading: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    bottomButtonWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50,
    },
});
export default OnBoardingOne;
