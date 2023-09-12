import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { View, Text, ImageBackground } from "react-native";
import Logo from "../assets/pics/tones_logo.svg";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";

export default function CustomDrawer(props: {
  drawerProps: DrawerContentComponentProps;
  open: boolean;
  openHandler: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const menuStatus = useDrawerStatus();

  useEffect(() => {
    console.log("'Open' state in NavMenu -> ", menuStatus);
    if (menuStatus == "open") {
      props.openHandler(true);
    } else {
      props.openHandler(false);
    }
  }, [menuStatus]);

  //console.log(props.drawerProps);
  let navigator = props.drawerProps.navigation as DrawerNavigationHelpers;
  return (
    <View style={{ flex: 1, height: "100%", width: "100%", justifyContent: "space-between" }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Logo
          height={40}
          style={{ alignSelf: "flex-start", marginBottom: 10, marginLeft: "10%" }}
          onPress={() => {
            props.openHandler(true);
            navigator.openDrawer();
          }}
        ></Logo>

        <TouchableOpacity
          onPress={() => {
            props.openHandler(false);
            navigator.closeDrawer();
          }}
        >
          <Text style={{ color: "#123123", fontSize: 30 }}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 10 }}>
        {/*backgroundColor: `${props.open ? "red" : "green"}`  */}
        <DrawerContentScrollView {...props.drawerProps} contentContainerStyle={{}}>
          <DrawerItemList {...props.drawerProps} />
        </DrawerContentScrollView>
      </View>

      <View style={{ flex: 1, backgroundColor: "blue" }}>
        <Text>Custom text</Text>
      </View>
    </View>
  );
}
