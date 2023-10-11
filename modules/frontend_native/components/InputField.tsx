import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ViewStyle,
  InputModeOptions,
  TextProps,
} from "react-native";
import { AppStyles } from "../constants/styles";
import { useState } from "react";

type InputFieldProps = TextProps & {
  placeholder?: string;
  label?: string;
  containerStyle?: ViewStyle;
  type?: InputModeOptions;
  disabled?: boolean;
  value?: any;
  onInputChange?: (inp: string) => void;
  multiline?: boolean;
};

export default function InputField({ ...props }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editable = props.disabled ? !props.disabled : true;
  const [value, setValue] = useState(String(props.value != undefined ? props.value : ""));

  return (
    <View style={[s.container, props.containerStyle]}>
      {props.label && <Text style={s.span}>{props.label}</Text>}
      <TextInput
        value={value}
        placeholder={props.placeholder || ""}
        multiline={props.multiline || false}
        style={[
          s.input,
          { borderWidth: 1 },
          isFocused
            ? { borderColor: AppStyles.color.primary }
            : { borderColor: AppStyles.color.accent_back },
        ]}
        blurOnSubmit={true}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        inputMode={props.type || "text"}
        editable={editable}
        onChangeText={(text) => setValue(text)}
        onSubmitEditing={({ nativeEvent }) => {
          props.onInputChange && props.onInputChange(nativeEvent.text);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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
    width: "100%",
  },
});
