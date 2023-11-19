import Login from "../Pages/Login";
import ProtocolList from "../Pages/ProtocolList";
import Constructor from "../Pages/Constructor";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Settings from "../Pages/Settings";
import History from "../Pages/History";
import { SvgProps } from "react-native-svg";

import List_icon from "../assets/icons/list.svg";
import Create_icon from "../assets/icons/create.svg";
import Clock_icon from "../assets/icons/clock.svg";
import Setting_icon from "../assets/icons/setting.svg";
import Logout_icon from "../assets/icons/logout.svg";
import Launch from "../Pages/LaunchPage/Launch";

export type Page = {
  name: string;
  component: ({ route, navigation }: NativeStackScreenProps<any>) => React.JSX.Element;
  icon?: React.FC<SvgProps>;
};

export const Pages: Page[] = [
  {
    name: "Protocol List",
    component: ProtocolList,
    icon: List_icon,
  },
  {
    name: "Create protocol",
    component: Constructor,
    icon: Create_icon,
  },
  {
    name: "History",
    component: History,
    icon: Clock_icon,
  },
  {
    name: "Settings",
    component: Settings,
    icon: Setting_icon,
  },
  {
    name: "Logout",
    component: Login,
    icon: Logout_icon,
  },
  {
    name: "Launch",
    component: Launch,
  },
];
