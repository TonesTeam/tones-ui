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
import Animated, {
    FadeInDown,
    LinearTransition,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';

const Dashboard = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const [protocolCount, setProtocolCount] = useState(0);
    const [liquidCount, setLiquidCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [protocols, setProtocols] = useState([] as ProtocolDto[]);

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
                        onPress={() => navigation.navigate('Create protocol')}
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
                        <InfoCard
                            title="Protocols"
                            value={protocolCount}
                            index={1}
                        />
                        <InfoCard title="Launches" value={jobCount} index={2} />
                        <InfoCard
                            title="Library"
                            value={liquidCount}
                            index={3}
                        />
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
                                <Animated.View
                                    key={protocol.id}
                                    entering={FadeInDown.delay(i * 60)
                                        .springify()
                                        .damping(0)}
                                    layout={LinearTransition.springify()}
                                >
                                    <ListItem
                                        key={i}
                                        navigation={navigation}
                                        protocol={protocol}
                                        removeProtocolFromList={() => {}}
                                    />
                                </Animated.View>
                            );
                        })}
                    </VStack>
                </VStack>
            </Box>
        </MainContainer>
    );
};

const InfoCard = ({
    title,
    value,
    index,
}: {
    title: string;
    value: number;
    index: number;
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-20);

    useEffect(() => {
        const delay = index * 100;
        opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={animatedStyle}>
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
        </Animated.View>
    );
};

export default Dashboard;
