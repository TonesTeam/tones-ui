import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { AppStyles, MainContainer, globalElementStyle } from "../constants/styles";
import NavBar from "../navigation/CustomNavigator";

export default function Constructor(props: any) {
  return (
    <MainContainer>
      <NavBar />
      <View style={[globalElementStyle.page_container, { backgroundColor: "#5da4faff" }]}>
        <Text>Constructor</Text>
      </View>
    </MainContainer>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: "#b4b5fd",
    alignItems: "center",
    justifyContent: "center",
  },
});
