import { DimensionValue, View } from "react-native";
import { StyleSheet } from "react-native";

export const AppStyles = {
  color: {
    primary: "#2d4cc9",
    secondary: "#26b65c",
    warning: "#d14633",
    text_primary: "#3b3d44",
    text_faded: "#838488",
    background: "#ebeced",
    accent_back: "#EBECED",
    elem_back: "#ffffffff",
    primary_faded: "#DFF2FF",
    block_washing: "#2d4cc9",
    block_washing_faded: "#dff2ff",
    block_temperature: "#f49e1e",
    block_temperature_faded: "#fde9c8",
    block_reagent: "#26b65c",
    block_reagent_faded: "#ddffed",
  },

  sizes: {
    regular: 16,
    small: 14,
    big: 20,
  },

  layout: {
    border_radius: 10,
    elem_padding: 10,
    box_padding: 20,
    main_flex: 10,
    nav_flex: 1,
    nav_width_closed: "9%" as DimensionValue,
    nav_width_opened: "20%" as DimensionValue,
    main_width: "91%" as DimensionValue,
  },
};

export const globalElementStyle = StyleSheet.create({
  page_container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    width: AppStyles.layout.main_width,
    height: "100%",
    paddingTop: 15,
  },
});

export function MainContainer(props: any) {
  return (
    <View style={{ flexDirection: "row", flex: 1, backgroundColor: AppStyles.color.background }}>
      {props.children}
    </View>
  );
}
