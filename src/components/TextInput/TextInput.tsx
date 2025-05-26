
import { Dimensions, TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTextStyles } from '../../assets/styles/TextStyles';

interface Props {
    value?: string
    onChangeText: (text: string) => void
    placeholder?: string
    label?: string
    secureTextEntry?: boolean
    style?: object
    width?: number | string
}

const screenWidth = Dimensions.get('window').width;
const defaultWidth = screenWidth - 40;

const TextInput: React.FC<Props> = ({
    value,
    onChangeText,
    label,
    placeholder,
    width,
    secureTextEntry = false,
    style,
}) => {
    const { theme } = useTheme();

    return (
        <View style={{ width: width || defaultWidth }}>
            {label && <Text style={getTextStyles(theme).label}>{label}</Text>}
            <View style={[styles.container, { borderColor: theme.border, width: width }]}>
                <RNTextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={theme.secondary}
                    style={[
                        styles.input,
                        { color: theme.text, backgroundColor: theme.card },
                        style,
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        // padding: 4,
        marginVertical: 8,
        width: defaultWidth,
    },
    input: {
        width: '100%',
        height: 40,
        fontSize: 16,
        padding: 8,
        borderRadius: 8,
    },
});

export default TextInput;
