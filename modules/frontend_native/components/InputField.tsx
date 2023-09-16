import { StyleSheet, Text, View, TextInput } from "react-native";
import { AppStyles } from "../constants/styles";
import { useState } from "react";

export default function InputField(props: { placeholder: string; label: string }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={s.container}>
      <Text style={s.span}>{props.label}</Text>
      <TextInput
        placeholder={props.placeholder}
        style={[s.input, isFocused && { borderWidth: 1, borderColor: AppStyles.color.primary }]}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
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
    borderColor: "#fff",
  },
});
