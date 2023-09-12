import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { AppStyles, MainContainer, globalElementStyle } from "../constants/styles";
import NavBar from "../navigation/CustomNavigator";

export default function ProtocolList(props: any) {
  return (
    <MainContainer>
      <NavBar />
      <View style={[globalElementStyle.page_container, { backgroundColor: "#fa5dabff" }]}>
        <Text>List</Text>
      </View>
    </MainContainer>
  );
}
