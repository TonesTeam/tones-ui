import { StyleSheet, View, TextProps, TouchableOpacity } from 'react-native';
import { AppStyles } from '../constants/styles';
import Txt from './Txt';

type RadioProps = TextProps & {
    isChecked: boolean;
    onPress: () => void;
    radius?: number;
    label?: string;
    activeColor?: string;
};

export default function InputField({ ...props }: RadioProps) {
    const size = props.radius || 30;

    return (
        <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
                props.onPress();
            }}
        >
            <View
                style={{
                    height: size,
                    width: size,
                    borderRadius: size,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: size * 0.1,
                    borderColor: props.isChecked
                        ? AppStyles.color.secondary
                        : AppStyles.color.text_faded,
                }}
            >
                <View
                    style={{
                        backgroundColor: props.isChecked
                            ? AppStyles.color.secondary
                            : AppStyles.color.text_faded,
                        height: size * 0.5,
                        width: size * 0.5,
                        borderRadius: size,
                    }}
                ></View>
            </View>
            {props.label && (
                <Txt
                    style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-thin',
                        marginLeft: 10,
                    }}
                >
                    {props.label}
                </Txt>
            )}
        </TouchableOpacity>
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
        backgroundColor: AppStyles.color.background,
        marginVertical: AppStyles.layout.elem_padding,
        borderRadius: AppStyles.layout.border_radius,
        padding: AppStyles.layout.elem_padding,
        color: AppStyles.color.text_primary,
        fontSize: 18,
        width: '100%',
    },
});
