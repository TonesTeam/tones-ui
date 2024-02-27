import { Text, View, TouchableOpacity, Animated, Image } from "react-native";
import { AppStyles } from "../constants/styles";
import { Pages } from "./Screens";
import { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector } from "../state/hooks";
import CircularProgress, { ProgressRef } from "react-native-circular-progress-indicator";

import Txt from "../components/Txt";
import Arrow from "../assets/icons/arrow_menu.svg";
import Logo from "../assets/pics/tones_logo.svg";
import { OpacityText } from "../components/AnimatedTxt";

export default function NavBar() {
  //Navigation stuff
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>(); //any for params for page, TODO: define
  const activePage = Pages.find((p) => p.name == route.name);

  //System state
  const count = useAppSelector((state) => state.protocols.length);
  const activeProtocols = useAppSelector((state) => state.protocols);
  const progressRef = useRef<ProgressRef>(null);

  //Animation stuff
  const [open, setOpen] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: open ? 100 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    //if (open && count != 0) progressRef?.current?.reAnimate();
    if (open) progressRef?.current?.reAnimate();
  }, [open]);

  return (
    <Animated.View
      style={[
        {
          width: translation.interpolate({
            inputRange: [0, 100],
            outputRange: [
              AppStyles.layout.nav_width_closed!.toString(),
              AppStyles.layout.nav_width_opened!.toString(),
            ],
          }),
        },
        s.container,
      ]}
    >
      <TouchableOpacity
        style={s.section_header}
        activeOpacity={0.2}
        delayPressIn={0} //TODO: edit prop config or make component? + test
        onPress={() => setOpen(!open)}
      >
        {open && <Logo width={100} height={80} style={{ marginRight: 20 }}></Logo>}

        <Animated.View
          style={[
            s.btn_toggleMenu,
            {
              transform: [
                {
                  rotate: translation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Arrow width={50} height={50} stroke={AppStyles.color.primary}></Arrow>
        </Animated.View>
      </TouchableOpacity>

      <View style={s.section_links}>
        {Pages.filter((page) => page.icon != undefined).map((page, index) => {
          return (
            <TouchableOpacity
              style={[
                s.link,
                activePage == page && s.link_active,
                { justifyContent: open ? "flex-start" : "center", paddingLeft: open ? "5%" : 0 },
              ]}
              key={index}
              onPress={() => {
                setOpen(false);
                navigation.navigate(page.name);
              }}
            >
              <View>
                {page.icon && (
                  <page.icon
                    height={30}
                    stroke={
                      activePage == page ? AppStyles.color.primary : AppStyles.color.text_primary
                    }
                  />
                )}
              </View>
              {open && (
                <View style={s.link_label}>
                  <OpacityText
                    numberOfLines={1}
                    style={[
                      s.link_label_text,
                      activePage?.name == page.name && {
                        fontWeight: "bold",
                      },
                      {
                        color:
                          activePage == page
                            ? AppStyles.color.primary
                            : AppStyles.color.text_primary,
                      },
                    ]}
                    opacityFunc={translation}
                  >
                    {page.name}
                  </OpacityText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.section_footer}>
        <View style={[s.progress, { borderWidth: open ? 1 : 0 }]}>
          <CircularProgress
            ref={progressRef}
            value={90} //count == 0 ? 0 : 90
            valueSuffix={"%"}
            allowFontScaling={false}
            radius={open ? 50 : 40}
            duration={open ? 800 : 0}
            progressValueColor={AppStyles.color.text_primary}
            activeStrokeColor={AppStyles.color.secondary}
            inActiveStrokeColor={AppStyles.color.background}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={open ? 15 : 10}
            activeStrokeWidth={open ? 8 : 6}
          />
          {open && (
            <OpacityText numberOfLines={1} opacityFunc={translation}>
              {count == 0 ? "No active protocols" : activeProtocols[0].protocol.name}
            </OpacityText>
          )}
        </View>
        <View style={s.profile}>
          <Image
            source={require("../assets/pics/user.png")}
            resizeMode="cover"
            style={s.profile_img}
          />
          {open && (
            <View>
              <OpacityText opacityFunc={translation}>Lab Worker 1</OpacityText>
              <OpacityText
                style={{ fontSize: 12, color: AppStyles.color.text_faded }}
                opacityFunc={translation}
              >
                @UppsalaLab
              </OpacityText>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffff",
    zIndex: 10,
    borderRightWidth: 10,
    borderRightColor: AppStyles.color.background,
  },

  section_header: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },

  section_links: { flex: 6, width: "101%" },

  section_footer: {
    flex: 5,
  },

  btn_toggleMenu: {
    backgroundColor: "#fff",
    borderColor: AppStyles.color.background,
    borderWidth: 2,
    borderRadius: 60,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 12,
  },

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

  progress: {
    flex: 2,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: AppStyles.color.background,
    borderRadius: 20,
  },

  profile: {
    flex: 1,
    width: "101%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    backgroundColor: AppStyles.color.background,
  },

  profile_img: {
    //flex: 1,
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
