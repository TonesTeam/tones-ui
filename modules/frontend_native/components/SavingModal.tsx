import { useEffect, useRef, useState } from "react";
import { Modal, View, StyleSheet, Animated, TouchableOpacity, Easing } from "react-native";
import { AppStyles } from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import Txt from "./Txt";
import Success_icon from "../assets/icons/save_success.svg";
import Fail_icon from "../assets/icons/save_fail.svg";

export default function SavingModal(props: {
  result: boolean; //True = success, False = fail
  text: string;
  unsetVisible: () => void;
}) {
  const [modalVisible, setModalVisible] = useState(true);
  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    bounceAnim.setValue(-70);
    Animated.timing(bounceAnim, {
      toValue: 30,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  }, []);

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <LinearGradient colors={["#001f6d98", "transparent"]} style={s.modal_container}>
        <Animated.View style={[s.modal_body, { top: bounceAnim }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 50,
              paddingVertical: 10,
            }}
          >
            {props.result == true ? (
              <Success_icon height={40} width={40} />
            ) : (
              <Fail_icon height={40} width={40} />
            )}
            <Txt style={{ marginLeft: 10, fontFamily: "Roboto-bold" }}>
              {props.result == true
                ? `${props.text} was successfully saved `
                : `Error occured while saving ${props.text.toLowerCase()}`}
            </Txt>
          </View>
          <View></View>
        </Animated.View>
      </LinearGradient>
    </Modal>
  );
}

const s = StyleSheet.create({
  modal_container: {
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },

  modal_body: {
    backgroundColor: AppStyles.color.elem_back,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
