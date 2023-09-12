// import Login from "../Pages/Login";
// import ProtocolList from "../Pages/ProtocolList";
// import Constructor from "../Pages/Constructor";
// import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pages } from "./Screens";
// import Settings from "../Pages/Settings";
// import History from "../Pages/History";
// import { SvgProps } from "react-native-svg";
// import { useRoute } from "@react-navigation/native";

// import List_icon from "../assets/icons/list.svg";
// import Create_icon from "../assets/icons/create.svg";
// import Clock_icon from "../assets/icons/clock.svg";
// import Setting_icon from "../assets/icons/setting.svg";
// import Logout_icon from "../assets/icons/logout.svg";

// export const Pages: Page[] = [
//   {
//     name: "Protocol List",
//     component: ProtocolList,
//     icon: List_icon,
//   },
//   {
//     name: "Create protocol",
//     component: Constructor,
//     icon: Create_icon,
//   },
//   {
//     name: "History",
//     component: History,
//     icon: Clock_icon,
//   },
//   {
//     name: "Settings",
//     component: Settings,
//     icon: Setting_icon,
//   },
//   {
//     name: "Logout",
//     component: Login,
//     icon: Logout_icon,
//   },
// ];

const Stack = createNativeStackNavigator();

export function AppStack(props: any) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animationTypeForReplace: "pop",
        animation: "fade", //"none",
      }}
      initialRouteName="Logout"
    >
      {Pages.map((page, index) => {
        return <Stack.Screen key={index} name={page.name} component={page.component} />;
      })}
    </Stack.Navigator>
  );
}
