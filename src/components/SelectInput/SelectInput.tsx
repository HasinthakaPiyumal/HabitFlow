import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTextStyles } from '../../assets/styles/TextStyles';
import Icon from 'react-native-vector-icons/Ionicons';

interface Option {
    label: string;
    value: string;
}

interface Props {
    options: Option[];
    value?: string | null;
    onSelect: (value: string) => void;
    placeholder?: string;
    label?: string;
    width?: number | string;
    style?: object;
}

const screenWidth = Dimensions.get('window').width;
const defaultWidth = screenWidth - 40;

const SelectInput: React.FC<Props> = ({
    options,
    value,
    onSelect,
    placeholder = 'Select...',
    label,
    width,
    style,
}) => {
    const [visible, setVisible] = useState(false);
    const { theme } = useTheme();

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || placeholder;

    return (
        <View style={{ width: width || defaultWidth }}>
            {label && <Text style={getTextStyles(theme).label}>{label}</Text>}

            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={[
                    styles.container,
                    { borderColor: theme.border, backgroundColor: theme.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                    { width: width || defaultWidth },
                    style,
                ]}
            >
                <Text style={{ color: value ? theme.text : theme.secondary, fontSize: 16 }}>
                    {selectedLabel}
                </Text>
                <Icon name='chevron-down' style={{ color: value ? theme.text : theme.secondary, fontSize: 16 }} />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item.value);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={{ color: theme.text, fontSize: 16 }}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        marginVertical: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: defaultWidth,
        borderRadius: 6,
        maxHeight: 300,
        paddingVertical: 8,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
});

export default SelectInput;
