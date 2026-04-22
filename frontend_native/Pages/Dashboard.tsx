import {
    Box,
    Text,
    Button,
    ButtonText,
    ButtonIcon,
    HStack,
    VStack,
} from '@gluestack-ui/themed';
import { MainContainer, globalElementStyle } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowRight, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { makeRequest } from '../common/util';
import { Method } from 'axios';
import { ProtocolDto } from 'common/dto/protocol.dto';
import ListItem from './ProtocolList/ListItem';
import ConfirmationModal from '../components/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../contexts/UserContext';

const Dashboard = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const { user } = useUser();
    const [protocolCount, setProtocolCount] = useState(0);
    const [liquidCount, setLiquidCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [protocols, setProtocols] = useState([] as ProtocolDto[]);
    const [showWashingWarning, setShowWashingWarning] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const getWarningStorageKey = () => `dontShowWashingWarning_${user?.id}`;

    useEffect(() => {
        // Проверяем при загрузке был ли checkbox отмечен ранее для этого пользователя
        const checkWashingWarning = async () => {
            const storageKey = getWarningStorageKey();
            const dontShow = await AsyncStorage.getItem(storageKey);
            if (dontShow === 'true') {
                setDontShowAgain(true);
            }
        };

        if (user?.id) {
            checkWashingWarning();
        }
    }, [user?.id]);

    useEffect(() => {
        makeRequest('GET' as Method, '/protocols').then((response) => {
            setProtocolCount(response.data.length);
            setProtocols(response.data);
        });
        makeRequest('GET' as Method, '/liquids').then((response) => {
            setLiquidCount(response.data.length);
        });
        makeRequest('GET' as Method, '/jobs').then((response) => {
            setJobCount(response.data.length);
        });
    }, []);

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <HStack
                    alignItems="flex-start"
                    justifyContent="space-between"
                    width="100%"
                    space="lg"
                >
                    <Text
                        color="black"
                        fontSize={32}
                        fontFamily="Orbitron-Medium"
                        mb="$8"
                        mt={16}
                    >
                        Dashboard
                    </Text>
                    <Button
                        variant="outline"
                        rounded="$full"
                        borderColor="$black"
                        bg="#1F2832"
                        mt="$3"
                        mr="$1"
                        onPress={() => {
                            if (dontShowAgain) {
                                // Если checkbox был отмечен - прямо переходим
                                navigation.navigate('Create protocol');
                            } else {
                                // Иначе показываем модал
                                setShowWashingWarning(true);
                            }
                        }}
                        alignItems="center"
                        justifyContent="center"
                        height={48}
                    >
                        <Box
                            style={{
                                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                            }}
                        >
                            <ButtonIcon
                                bg="transparent"
                                color="white"
                                as={Plus}
                                mr="$1"
                            />
                        </Box>
                        <ButtonText color="white" fontSize={14}>
                            Create New Protocol
                        </ButtonText>
                    </Button>
                </HStack>
                <VStack gap={10}>
                    <Text
                        color="black"
                        fontSize={16}
                        fontFamily="Orbitron-SemiBold"
                        opacity={0.4}
                    >
                        Key metrics
                    </Text>
                    <HStack gap={30}>
                        <InfoCard title="Protocols" value={protocolCount} />
                        <InfoCard title="Launches" value={jobCount} />
                        <InfoCard title="Library" value={liquidCount} />
                    </HStack>
                </VStack>
                <VStack gap={10} mt={40}>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Text
                            color="black"
                            fontSize={16}
                            fontFamily="Orbitron-SemiBold"
                            opacity={0.4}
                        >
                            Latest protocols
                        </Text>
                        <Button
                            onPress={() => navigation.navigate('Protocols')}
                            bg="transparent"
                        >
                            <ButtonIcon
                                as={ArrowRight}
                                color="black"
                                size={12}
                            />
                            <ButtonText
                                ml="$1"
                                fontSize={12}
                                fontFamily="Manrope-Medium"
                                color="black"
                            >
                                View all
                            </ButtonText>
                        </Button>
                    </HStack>
                    <VStack>
                        {protocols.slice(0, 3).map((protocol, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    navigation={navigation}
                                    protocol={protocol}
                                    removeProtocolFromList={() => {}}
                                />
                            );
                        })}
                    </VStack>
                </VStack>
            </Box>
            <ConfirmationModal
                isOpen={showWashingWarning}
                onClose={() => setShowWashingWarning(false)}
                headline="Single Washing Solution Required"
                text={`1. Each protocol can use only ONE washing liquid TYPE.\n2. We RECOMMEND recording the name of the washing solution in the Description field,when you will be saving the protocol. \n3. You may need to change the washing bottle during launch if necessary.`}
                actionButtonText="Continue"
                showCheckbox={true}
                checkboxLabel="Don't show this message again"
                checkboxValue={dontShowAgain}
                onCheckboxChange={async (isChecked) => {
                    setDontShowAgain(isChecked);
                    const storageKey = getWarningStorageKey();
                    if (isChecked) {
                        await AsyncStorage.setItem(storageKey, 'true');
                    } else {
                        await AsyncStorage.removeItem(storageKey);
                    }
                }}
                action={() => {
                    setShowWashingWarning(false);
                    navigation.navigate('Create protocol');
                }}
            />
        </MainContainer>
    );
};

const InfoCard = ({ title, value }: { title: string; value: number }) => {
    return (
        <Box
            bg="white"
            borderRadius="$xl"
            p="$4"
            width={230}
            height={200}
            style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            }}
        >
            <Text color="black" fontSize={16} fontFamily="Manrope-SemiBold">
                {title}
            </Text>
            <Box alignSelf="center" justifyContent="center" height="100%">
                <Text
                    color="black"
                    mb={35}
                    fontSize={40}
                    fontFamily="Manrope-Medium"
                >
                    {value}
                </Text>
            </Box>
        </Box>
    );
};

export default Dashboard;
