import { Text, View, TouchableOpacity, Animated } from "react-native";
import { AppStyles } from "../constants/styles";
import { Pages } from "./Screens";
import { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector } from "../state/hooks";
import CircularProgress from "react-native-circular-progress-indicator";

import Txt from "../components/Txt";
import Arrow from "../assets/icons/arrow.svg";
import Logo from "../assets/pics/tones_logo.svg";

export default function NavBar() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>(); //any for params for page, TODO: define

  const activePage = Pages.find((p) => p.name == route.name);
  const [open, setOpen] = useState(false);

  const translation = useRef(new Animated.Value(0)).current;

  const count = useAppSelector((state) => state.protocols.length);
  const activeProtocols = useAppSelector((state) => state.protocols);

  useEffect(() => {
    Animated.timing(translation, {
      toValue: open ? 100 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open]);

  return (
    <Animated.View
      style={{
        width: translation.interpolate({
          inputRange: [0, 100],
          outputRange: [
            AppStyles.layout.nav_width_closed!.toString(),
            AppStyles.layout.nav_width_opened!.toString(),
          ],
        }),
        backgroundColor: "#ffffffff",
        zIndex: 10,
        borderRightWidth: 10,
        borderRightColor: AppStyles.color.background,
      }}
    >
      <TouchableOpacity
        style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingHorizontal: 20,
          alignItems: "center",
          width: "100%",
        }}
        activeOpacity={0.2}
        onPress={() => setOpen(!open)}
      >
        {open && <Logo width={120} height={50} style={{ marginRight: 20 }}></Logo>}

        <Animated.View
          style={{
            backgroundColor: "#fff",

            // shadowColor: "#000",
            // shadowOffset: {
            //   width: 60,
            //   height: 60,
            // },
            // shadowOpacity: 0.3,
            // shadowRadius: 10,
            // elevation: 5,
            borderColor: AppStyles.color.background,
            borderWidth: 2,

            borderRadius: 60,
            height: 60,
            width: 60,
            alignItems: "center",
            justifyContent: "center",
            transform: [
              {
                rotate: translation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
            zIndex: 12,
          }}
        >
          <Arrow width={300} height={50} stroke={AppStyles.color.primary}></Arrow>
        </Animated.View>
      </TouchableOpacity>

      <View style={{ flex: 6, width: "101%" }}>
        {Pages.map((page, index) => {
          return (
            <TouchableOpacity
              style={[
                s.link,
                activePage == page && s.link_active,
                { justifyContent: open ? "flex-start" : "center", paddingLeft: open ? "5%" : 0 },
              ]}
              key={index}
              onPress={() => {
                navigation.navigate(page.name);
              }}
            >
              <View>
                <page.icon
                  height={30}
                  stroke={
                    activePage == page ? AppStyles.color.primary : AppStyles.color.text_primary
                  }
                />
              </View>
              {open && (
                <View style={s.link_label}>
                  <Animated.Text
                    numberOfLines={1}
                    style={[
                      s.link_label_text,
                      activePage == page && {
                        color: AppStyles.color.primary,
                        fontWeight: "bold",
                      },
                      {
                        opacity: translation.interpolate({
                          inputRange: [0, 100],
                          outputRange: [0, 1],
                        }),
                      },
                    ]}
                  >
                    {page.name}
                  </Animated.Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          flex: 5,
          margin: 10,
          // padding: 20,
          borderColor: AppStyles.color.background,
          borderRadius: 20,
          borderWidth: 1,
        }}
      >
        <CircularProgress
          value={90}
          valueSuffix={"%"}
          radius={open ? 50 : 40}
          progressValueColor={AppStyles.color.text_primary}
          activeStrokeColor={AppStyles.color.secondary}
          inActiveStrokeColor={AppStyles.color.background}
          inActiveStrokeOpacity={0.5}
          inActiveStrokeWidth={open ? 15 : 10}
          activeStrokeWidth={open ? 10 : 8}
        />
        {open && <Txt>Protocol such and such</Txt>}
        {!open && <Text>Progress bar</Text>}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  link: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    overflowX: "hidden",
  },

  link_active: {
    backgroundColor: AppStyles.color.background,
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 60,
  },

  link_label: {
    marginLeft: 20,
  },

  link_label_text: {
    fontSize: 18,
    fontFamily: "Roboto-regular",
  },
});
