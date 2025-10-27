import { AppStyles } from '../constants/styles';
import { Pages } from './Screens';
import { useState, useRef, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../state/hooks';
import CircularProgress, {
    ProgressRef,
} from 'react-native-circular-progress-indicator';

import Logo from '../assets/pics/tones_logo.svg';
import ConfirmationModal from '../components/ConfirmationModal';
import { LogOut } from 'lucide-react-native';
import GeneratedAvatar from '../components/GeneratedAvatar';
import {
    VStack,
    Box,
    Pressable,
    Text,
    Divider,
    ButtonText,
    Icon,
    Button,
} from '@gluestack-ui/themed';

export default function NavBar() {
    //Navigation stuff
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<any>>(); //any for params for page, TODO: define
    const activePage = Pages.find((p) => p.name == route.name);

    //System state
    const count = useAppSelector((state) => state.protocols.length);
    const activeProtocols = useAppSelector((state) => state.protocols);
    const progressRef = useRef<ProgressRef>(null);

    const [logoutConfirmModal, setLogoutConfirmModal] = useState(false);

    return (
        <Box
            m="$4"
            bg="$white"
            rounded="$xl"
            style={{
                filter: 'drop-shadow(8px 0px 44px rgba(0, 0, 0, 0.12))',
            }}
            width="14%"
            alignItems="center"
            flex
        >
            <ConfirmationModal
                isOpen={logoutConfirmModal}
                onClose={() => setLogoutConfirmModal(false)}
                action={() => {
                    navigation.navigate('Logout');
                }}
                headline="Are you sure you want to log out?"
                text="You’ll need to sign in again to access your account."
                icon={LogOut}
                type="warning"
                actionButtonText="Log out"
            />

            {/* Top logo */}
            <Logo
                width={100}
                height={100}
                style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
            ></Logo>

            {/* Navigation links */}
            <VStack alignItems="center" width="80%" pb="$4" flex={5}>
                {Pages.filter((page) => page.isNavigatableFromNavBar).map(
                    (page, index) => {
                        return (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    if (page.isLogout) {
                                        setLogoutConfirmModal(true);
                                    } else {
                                        navigation.navigate(page.name);
                                    }
                                }}
                                width="100%"
                                px="$6"
                                py="$3"
                                rounded="$2xl"
                                bg={
                                    activePage?.name == page.name
                                        ? '#C8D3D6'
                                        : '$transparent'
                                }
                            >
                                <Text size="lg" color="#1F2832">
                                    {page.name}
                                </Text>
                            </Pressable>
                        );
                    },
                )}
            </VStack>

            <Divider width="60%" />

            {/* Version number */}
            <Text p="$5" color="$textLight500" flex={1}>
                Version 0.3.9
            </Text>

            <Box flex={3}>
                <CircularProgress
                    ref={progressRef}
                    value={90}
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
            </Box>

            {/* User info section */}
            <VStack flex={7} mt="$5" alignItems="flex-start">
                <Pressable
                    my="$2"
                    onPress={() => navigation.navigate('Profile')}
                    style={{
                        filter: `
                            drop-shadow(0px 4.75px 11.88px rgba(0, 0, 0, 0.15))
                            drop-shadow(2.38px 23.75px 23.75px rgba(0, 0, 0, 0.13))
                        `,
                    }}
                >
                    <GeneratedAvatar name="Jacob Goldberg" size={64} />
                </Pressable>
                <Text size="lg">Jefferey</Text>
                <Text size="sm" color="$textLight400">
                    TSI Laboratories
                </Text>
                <Button
                    variant="link"
                    onPress={() => setLogoutConfirmModal(true)}
                    mt="$4"
                >
                    <ButtonText color="#1F2832" mr="$2">
                        Log out
                    </ButtonText>
                    <Icon color="black" as={LogOut} />
                </Button>
            </VStack>
        </Box>
    );
}
