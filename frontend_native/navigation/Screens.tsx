import Login from '../Pages/Login';
import ProtocolList from '../Pages/ProtocolList/ProtocolList';
import Constructor from '../Pages/Constructor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Settings from '../Pages/Settings';
import History from '../Pages/History';
import Profile from '../Pages/UserProfile';
import { SvgProps } from 'react-native-svg';

import Launch from '../Pages/LaunchPage/Launch';
import ProtocolView from '../Pages/ProtocolView';
import {
    List,
    FilePlus,
    Clock,
    Settings as SettingsIcon,
    LogOut,
    LucideIcon,
} from 'lucide-react-native';

export type Page = {
    name: string;
    component: ({
        route,
        navigation,
    }: NativeStackScreenProps<any>) => React.JSX.Element;
    icon?: LucideIcon;
    isLogout?: boolean;
};

export const Pages: Page[] = [
    {
        name: 'Protocol List',
        component: ProtocolList,
        icon: List,
    },
    {
        name: 'Create protocol',
        component: Constructor,
        icon: FilePlus,
    },
    {
        name: 'History',
        component: History,
        icon: Clock,
    },
    {
        name: 'Settings',
        component: Settings,
        icon: SettingsIcon,
    },
    {
        name: 'Logout',
        component: Login,
        icon: LogOut,
        isLogout: true,
    },
    {
        name: 'Launch',
        component: Launch,
    },
    {
        name: 'Profile',
        component: Profile,
    },
    {
        name: 'ProtocolView',
        component: ProtocolView,
    },
];
