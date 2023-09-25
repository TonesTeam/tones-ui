import { StyleSheet, Text, View, TextInput, ViewStyle, InputModeOptions } from "react-native";
import { AppStyles } from "../constants/styles";
import { useState } from "react";

export default function InputField(props: {
  placeholder?: string;
  label?: string;
  containerStyle?: ViewStyle;
  type?: InputModeOptions;
  disabled?: boolean;
  value?: any;
  onInputChange?: (inp: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const editable = props.disabled ? !props.disabled : true;

  return (
    <View style={[s.container, props.containerStyle]}>
      {props.label && <Text style={s.span}>{props.label}</Text>}
      <TextInput
        value={props.value || undefined}
        placeholder={props.placeholder || ""}
        style={[
          s.input,
          { borderWidth: 1 },
          isFocused
            ? { borderColor: AppStyles.color.primary }
            : { borderColor: AppStyles.color.accent_back },
        ]}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        inputMode={props.type || "text"}
        editable={editable}
        //onChangeText={(text) => props.onInputChange(text)}
        onSubmitEditing={({ nativeEvent }) => {
          console.log("OnSubmitEditing with text: ", nativeEvent.text);
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
  },
});
