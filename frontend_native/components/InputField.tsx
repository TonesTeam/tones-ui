import {
    StyleSheet,
    Text,
    TextInput,
    ViewStyle,
    InputModeOptions,
    TextProps,
    Animated,
    View,
} from 'react-native';
import { AppStyles } from '../constants/styles';
import { useRef, useState } from 'react';

type InputFieldProps = TextProps & {
    placeholder?: string;
    label?: string;
    containerStyle?: ViewStyle;
    type?: InputModeOptions;
    disabled?: boolean;
    value?: any;
    onInputChange?: (inp: string) => void;
    multiline?: boolean;
    limit_max?: number;
    limit_min?: number;
    decimals?: boolean;
    background?: string;
};

export default function InputField({ ...props }: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const editable = props.disabled ? !props.disabled : true;
    const [value, setValue] = useState(
        String(props.value != undefined ? props.value : ''),
    );
    const inputErrorAnim = useRef(new Animated.Value(0)).current;

    const backgroundColorInterpolation: any = inputErrorAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [
            props.background || AppStyles.color.background,
            AppStyles.color.warning_faded,
        ],
    });

    function handleNumericInput(input: string) {
        let final = input.replace(/[|&;$%@"<>\-()+, ]/g, '');

        //handling dots & decimals
        let idx = final.indexOf('.');
        if (idx != -1) {
            final = final.replace(/\./g, '');
            final = final.slice(0, idx) + '.' + final.slice(idx);

            if (props.decimals) {
                //dot is last character - don't do anything
                if (final[final.indexOf('.') + 1] != undefined) {
                    final = String(Number(final).toFixed(1));
                }
            } else {
                final = String(Math.round(Number(final)));
            }
        }

        return final;
    }

    function checkLimits(input: string) {
        if (
            (props.limit_max && Number(input) > props.limit_max) ||
            (props.limit_min && Number(input) < props.limit_min)
        ) {
            Animated.timing(inputErrorAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: false,
            }).start(() =>
                Animated.timing(inputErrorAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }).start(),
            );

            return props.limit_max && Number(input) > props.limit_max
                ? String(props.limit_max)
                : props.limit_min && Number(input) < props.limit_min
                  ? String(props.limit_min)
                  : input;
        } else return input;
    }

    return (
        <View style={[s.container, props.containerStyle]}>
            {props.label && <Text style={s.span}>{props.label}</Text>}

            <Animated.View
                style={{
                    //flex: 1,
                    backgroundColor: backgroundColorInterpolation,
                    marginVertical: AppStyles.layout.elem_padding,
                    borderRadius: AppStyles.layout.border_radius,
                }}
            >
                <TextInput
                    value={value}
                    placeholder={props.placeholder || ''}
                    multiline={props.multiline || false}
                    style={[
                        s.input,
                        { borderWidth: 1 },
                        isFocused
                            ? { borderColor: AppStyles.color.primary }
                            : { borderColor: AppStyles.color.accent_back },
                    ]}
                    blurOnSubmit={true}
                    onBlur={() => {
                        setIsFocused(false);
                        props.type == 'numeric' &&
                            setValue(checkLimits(value) || '');
                    }}
                    onFocus={() => setIsFocused(true)}
                    inputMode={props.type || 'text'}
                    editable={editable}
                    onChangeText={(text) => {
                        let input = text;
                        if (props.type == 'numeric') {
                            input = handleNumericInput(text);
                        }
                        setValue(input);
                        props.onInputChange && props.onInputChange(input);
                    }}
                />
            </Animated.View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    span: {
        color: AppStyles.color.text_faded,
    },

    input: {
        //flex: 1,
        backgroundColor: 'transparent',
        //marginVertical: AppStyles.layout.elem_padding,
        borderRadius: AppStyles.layout.border_radius,
        padding: AppStyles.layout.elem_padding,
        color: AppStyles.color.text_primary,
        fontSize: 18,
        width: '100%',
    },
});
