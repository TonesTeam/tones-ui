import {
    View,
    TouchableOpacity,
    Animated,
    Image,
    Pressable,
} from 'react-native';
import { AppStyles } from '../constants/styles';
import { Pages } from './Screens';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../state/hooks';
import CircularProgress, {
    ProgressRef,
} from 'react-native-circular-progress-indicator';

import Txt from '../components/Txt';
import Arrow from '../assets/icons/arrow_menu.svg';
import Logo from '../assets/pics/tones_logo.svg';
import { OpacityText } from '../components/AnimatedTxt';
import ConfirmationModal from '../components/ConfirmationModal';
import { LogOutIcon } from 'lucide-react-native';
import GeneratedAvatar from '../components/GeneratedAvatar';
import { Icon, Text } from '@gluestack-ui/themed';

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
    const [logoutConfirmModal, setLogoutConfirmModal] = useState(false);
    const translation = useRef(new Animated.Value(0)).current;

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
            <ConfirmationModal
                isOpen={logoutConfirmModal}
                onClose={() => setLogoutConfirmModal(false)}
                action={() => {
                    navigation.navigate('Logout');
                }}
                headline="Are you sure you want to log out?"
                text="You’ll need to sign in again to access your account."
                icon={LogOutIcon}
                type="warning"
                actionButtonText="Log out"
            />

            <Logo
                width={70}
                height={70}
                style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10 }}
            ></Logo>

            <View style={s.section_links}>
                {Pages.filter((page) => page.icon != undefined).map(
                    (page, index) => {
                        return (
                            <TouchableOpacity
                                style={[
                                    s.link,
                                    activePage == page && s.link_active,
                                    {
                                        justifyContent: 'center',
                                        paddingLeft: 0,
                                    },
                                ]}
                                key={index}
                                onPress={() => {
                                    if (page.isLogout) {
                                        setLogoutConfirmModal(true);
                                    } else {
                                        navigation.navigate(page.name);
                                    }
                                }}
                            >
                                <View>
                                    {page.icon && (
                                        <Icon size="xl" as={page.icon} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    },
                )}
            </View>

            <View style={s.section_footer}>
                <Pressable 
                    style={[s.progress, { borderWidth: 0 }]}
                    onPress={() => navigation.navigate('ProtocolLogs')}
                >
                    <CircularProgress
                        ref={progressRef}
                        value={count === 0 ? 0 : 90} 
                        valueSuffix={'%'}
                        allowFontScaling={false}
                        radius={40}
                        duration={0}
                        progressValueColor={AppStyles.color.text_primary}
                        activeStrokeColor={AppStyles.color.secondary}
                        inActiveStrokeColor={AppStyles.color.background}
                        inActiveStrokeOpacity={0.5}
                        inActiveStrokeWidth={10}
                        activeStrokeWidth={6}
                    />
                </Pressable>
                <Pressable
                    style={s.profile}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <GeneratedAvatar name="Jacob Goldberg" size={50} />
                </Pressable>
            </View>
        </Animated.View>
    );
}

const s = StyleSheet.create({
    container: {
        backgroundColor: '#ffffffff',
        zIndex: 10,
        borderRightWidth: 10,
        borderRightColor: AppStyles.color.background,
    },

    section_header: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '100%',
    },

    section_links: { flex: 6, width: '101%' },

    section_footer: {
        flex: 5,
    },

    btn_toggleMenu: {
        backgroundColor: '#fff',
        borderColor: AppStyles.color.background,
        borderWidth: 2,
        borderRadius: 60,
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 12,
    },

    link: {
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
        fontFamily: 'Roboto-regular',
    },

    progress: {
        flex: 2,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: AppStyles.color.background,
        borderRadius: 20,
    },

    profile: {
        flex: 1,
        width: '101%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-evenly',
        borderTopWidth: 2,
        borderTopColor: '#eee',
    },

    profile_img: {
        //flex: 1,
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
});
