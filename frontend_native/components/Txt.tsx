import { Text, TextProps, TextStyle } from 'react-native';

export default function Txt({ style, children, ...otherProps }: TextProps) {
    const font = (style as TextStyle)?.fontFamily || 'Roboto-regular';

    return (
        <Text
            style={[style, { fontFamily: font }]}
            {...otherProps}
            allowFontScaling={
                otherProps.allowFontScaling == null
                    ? false
                    : otherProps.allowFontScaling
            }
        >
            {children}
        </Text>
    );
}
