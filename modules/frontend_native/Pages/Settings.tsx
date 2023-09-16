import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { AppStyles, MainContainer, globalElementStyle } from "../constants/styles";
import NavBar from "../navigation/CustomNavigator";

export default function Settings(props: any) {
  return (
    <MainContainer>
      <NavBar />
      <View style={[globalElementStyle.page_container, { backgroundColor: "#7768ffff" }]}>
        <Text>Settings</Text>
      </View>
    </MainContainer>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: "#e02793",
    alignItems: "center",
    justifyContent: "center",
  },
});
