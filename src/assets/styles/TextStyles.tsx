import { TextStyle } from 'react-native';
import { Theme } from '../../themes/theme';

export interface TextStyles {
    heading: TextStyle;
    subheading: TextStyle;
    body: TextStyle;
    caption: TextStyle;
    bold: TextStyle;
    title: TextStyle;
    label: TextStyle;
    error: TextStyle;
}

export const getTextStyles = (theme: Theme): TextStyles => ({
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.textSecondary,
        marginBottom: 8,
    },
    subheading: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.textSecondary,
        marginBottom: 6,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    caption: {
        fontSize: 12,
        fontWeight: '300',
        color: theme.textSecondary,
        marginBottom: 2,
    },
    bold: {
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary,
        textTransform: 'capitalize'
    },
    error: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.textError,
        marginBottom: 8,
    },
});
