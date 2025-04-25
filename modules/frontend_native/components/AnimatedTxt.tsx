import { Animated, Text, TextProps, TextStyle } from 'react-native';
import { AppStyles } from '../constants/styles';

type OpacityTextProps = TextProps & {
    opacityFunc: Animated.Value;
};

export function OpacityText({
    style,
    children,
    ...otherProps
}: OpacityTextProps) {
    const font = (style as TextStyle)?.fontFamily || 'Roboto-regular';
    //   const color = (style as TextStyle)?.color
    //     ? (style as TextStyle)?.color
    //     : AppStyles.color.text_primary;

    const interpolatedOpacity = otherProps.opacityFunc?.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
    });

    return (
        <Animated.Text
            allowFontScaling={false}
            style={[
                style,
                {
                    fontFamily: font,
                    //color: color,
                    opacity: interpolatedOpacity,
                },
            ]}
            {...otherProps}
        >
            {children}
        </Animated.Text>
    );
}
