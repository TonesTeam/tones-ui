import Login from '../Pages/Login';
import ProtocolList from '../Pages/ProtocolList/ProtocolList';
import Constructor from '../Pages/ProtocolConstructor/Constructor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CategoryGrid from '../Pages/LiquidLibrary/CategoryGrid';
import Library from '../Pages/LiquidLibrary/Library';
import Jobs from '../Pages/Jobs';
import Profile from '../Pages/UserProfile';
import ProtocolLogs from '../Pages/ProtocolLogs';
import Loading from '../Pages/Loading';
import Settings from '../Pages/Settings';
import Dashboard from '../Pages/Dashboard';

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
        name: 'Dashboard',
        component: Dashboard,
        isNavigatableFromNavBar: true,
    },
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
        component: CategoryGrid,
        isNavigatableFromNavBar: true,
    },
    {
        name: 'Liquid list',
        component: Library,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'Jobs',
        component: Jobs,
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
        isNavigatableFromNavBar: false,
    },
    {
        name: 'Loading',
        component: Loading,
        isNavigatableFromNavBar: false,
    },
    {
        name: 'Settings',
        component: Settings,
        isNavigatableFromNavBar: true,
    },
];
