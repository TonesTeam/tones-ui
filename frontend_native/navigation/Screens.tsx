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

export type Page = {
    name: string;
    component: ({
        route,
        navigation,
    }: NativeStackScreenProps<any>) => React.JSX.Element;
    isNavigatableFromNavBar: boolean;
    isLogout?: boolean;
};

export const Pages: Page[] = [
    {
        name: 'Protocols',
        component: ProtocolList,
        isNavigatableFromNavBar: true,
    },
    {
        name: 'Create protocol',
        component: Constructor,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'Library',
        component: Settings,
        isNavigatableFromNavBar: true,
    },
    {
        name: 'History',
        component: History,
        isNavigatableFromNavBar: true,
    },
    {
        name: 'Logout',
        component: Login,
        isLogout: true,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'Launch',
        component: Launch,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'Profile',
        component: Profile,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'ProtocolView',
        component: ProtocolView,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'ProtocolLogs',
        component: ProtocolLogs,
    },
];
