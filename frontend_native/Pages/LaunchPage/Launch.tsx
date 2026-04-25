import {
    StyleSheet,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    InputModeOptions,
} from 'react-native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { SlotMap } from './SlotMap';
import { SlotSelection } from './SlotSelection';
import { ReagentTrayStep } from './ReagentTrayStep';
import { WashingLiquidsStep } from './WashingLiquidsStep';
import { SLOT_QUANTITY } from '../../common/cartridgeConfig';
import { SetLaunchTime } from './SetLaunchTime';
import { getRequest, makeRequest } from '../../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { StepType } from 'common/enums';
import { Method } from 'axios';
import { useUser } from '../../contexts/UserContext';
import {
    Box,
    Text,
    HStack,
    Pressable,
    Icon,
    Button,
    ButtonText,
    ButtonIcon,
} from '@gluestack-ui/themed';
import {
    ArrowLeft,
    ArrowRight,
    CheckSquare,
    ChevronRight,
    Square,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

enum LaunchStage {
    STEP_ONE = 1,
    STEP_TWO = 2,
    STEP_THREE = 3,
    STEP_FOUR = 4,
}

export default function Launch({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const protocol_ID = route.params
        ? (route.params as { protocol_ID: number }).protocol_ID
        : undefined;
    const protocol_name = route.params
        ? (route.params as { protocol_name: string }).protocol_name
        : undefined;

    const [stage, setStage] = useState<LaunchStage>(LaunchStage.STEP_ONE);
    const [slotNumber, setSlotNumber] = useState<number | ''>(0);
    const [selectedSlots, setSelectedSlots] = useState<Set<number>>(new Set());
    const [confirmations, setConfirmations] = useState(0);
    const [protocol, setProtocol] = useState<ProtocolWithStepsDTO | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string>('0:00:00');
    const [allReagentSlotsSelected, setAllReagentSlotsSelected] =
        useState(false);
    const [allWashingSwitchesOn, setAllWashingSwitchesOn] = useState(false);
    const [isLaunchTimeValid, setIsLaunchTimeValid] = useState(true);

    const { user } = useUser();
    const current_user_id = user ? user.id : null;

    useEffect(() => {
        if (protocol_ID) {
            loadProtocol();
        }
    }, [protocol_ID]);

    const loadProtocol = async () => {
        try {
            const response = await getRequest<ProtocolWithStepsDTO>(
                `/protocols/${protocol_ID}`,
            );
            if ('data' in response) {
                setProtocol(response.data);
                calculateEstimatedTime(response.data);
            }
        } catch (error) {
            console.error('Error loading protocol:', error);
        }
    };

    const calculateEstimatedTime = (protocol: ProtocolWithStepsDTO) => {
        let totalSeconds = 0;

        // Go through all steps and sum up incubation times
        const allSteps =
            protocol.stepBatches?.flatMap((batch: any) => batch.steps) || [];

        allSteps.forEach((step: any) => {
            if (step.type === StepType.REAGENT) {
                // ReagentStep has incubation time in seconds
                totalSeconds += step.params.incubation || 0;
            } else if (step.type === StepType.WASHING) {
                // WashStep has incubation * iters
                const incubation = step.params.incubation || 0;
                const iters = step.params.iters || 1;
                totalSeconds += incubation * iters;
            } else if (
                step.type === StepType.COOLING ||
                step.type === StepType.HEATING
            ) {
                // Temperature steps (cooling/heating) have duration in seconds
                totalSeconds += step.params.duration || 0;
            }
        });

        // Add some overhead time for liquid dispensing, washing operations, etc.
        // Estimate ~30 seconds per reagent step, ~20 seconds per wash iteration
        const reagentSteps = allSteps.filter(
            (s: any) => s.type === StepType.REAGENT,
        ).length;
        const washIterations = allSteps
            .filter((s: any) => s.type === StepType.WASHING)
            .reduce((sum: number, s: any) => sum + (s.params.iters || 1), 0);

        totalSeconds += reagentSteps * 30 + washIterations * 20;

        // Convert to H:MM:SS format
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formatted = `${hours}:${String(minutes).padStart(
            2,
            '0',
        )}:${String(seconds).padStart(2, '0')}`;
        setEstimatedTime(formatted);
    };

    function toggleSlotActivity(idx: number) {
        const newSlotActivityMap = selectedSlots.map((slot, index) => {
            return index === idx ? !slot : slot;
        });
        setSelectedSlots(newSlotActivityMap);
        // Update slot count
        const selectedCount = newSlotActivityMap.filter((s) => s).length;
        setSlotNumber(selectedCount);
    }

    const isNextDisabled = () => {
        if (stage === LaunchStage.STEP_ONE) {
            return selectedSlots.size === 0;
        } else if (stage === LaunchStage.STEP_TWO) {
            return !allReagentSlotsSelected;
        } else if (stage === LaunchStage.STEP_THREE) {
            return !allWashingSwitchesOn;
        } else if (stage === LaunchStage.STEP_FOUR) {
            return !isLaunchTimeValid;
        }
        return false;
    };

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <HStack mb="$8" mt={16}>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('ProtocolView', {
                                protocol_ID: protocol_ID,
                            });
                        }}
                        alignItems="flex-start"
                        justifyContent="center"
                        pr="$3"
                    >
                        <Icon
                            as={ArrowLeft}
                            width={20}
                            height={15}
                            color="#1F2832"
                        />
                    </Pressable>
                    <Text
                        fontSize={24}
                        color="rgba(31, 40, 50, 0.3)"
                        fontFamily="Orbitron-Medium"
                    >
                        Run protocol:{' '}
                    </Text>
                    <Text
                        color="black"
                        fontSize={24}
                        fontFamily="Orbitron-Medium"
                    >
                        {protocol_name}
                    </Text>
                </HStack>
                <LinearGradient
                    colors={[
                        'rgba(255, 255, 255, 0.7)',
                        'rgba(238, 240, 242, 0.07)',
                    ]}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#EEF0F2',
                        borderRadius: 16,
                    }}
                >
                    {/* Header */}
                    <HStack
                        py={20}
                        px={32}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <StageMenu stage={stage} changeStage={setStage} />
                        <HStack>
                            <Button
                                width={100}
                                bg="transparent"
                                borderWidth={1}
                                borderColor="#1F2832"
                                borderRadius={99}
                                onPress={() => setStage(stage - 1)}
                                isDisabled={stage == LaunchStage.STEP_ONE}
                            >
                                <ButtonIcon
                                    size={14}
                                    color="#1F2832"
                                    as={ArrowLeft}
                                />
                                <ButtonText
                                    ml={8}
                                    fontSize={14}
                                    fontFamily="Manrope-SemiBold"
                                    color="#1F2832"
                                >
                                    Back
                                </ButtonText>
                            </Button>
                            <Button
                                width={100}
                                ml={10}
                                bg="#1F2832"
                                borderWidth={1}
                                borderColor="#1F2832"
                                borderRadius={99}
                                onPress={() => {
                                    if (stage != LaunchStage.STEP_FOUR) {
                                        setStage(stage + 1);
                                    } else {
                                        makeRequest(
                                            'POST' as Method,
                                            '/jobs',
                                            JSON.stringify({
                                                protocol_id: protocol_ID,
                                                slots_used: [...selectedSlots],
                                                name: 'hello world',
                                                creator_id: current_user_id,
                                            }),
                                        ).then((res) => {
                                            console.log(res.data);
                                        });
                                    }
                                }}
                                isDisabled={isNextDisabled()}
                            >
                                <ButtonText
                                    fontSize={14}
                                    fontFamily="Manrope-SemiBold"
                                    color="white"
                                >
                                    {stage == LaunchStage.STEP_FOUR
                                        ? 'Launch'
                                        : 'Next'}
                                </ButtonText>
                                <ButtonIcon
                                    ml={8}
                                    size={14}
                                    color="white"
                                    as={ArrowRight}
                                />
                            </Button>
                        </HStack>
                    </HStack>

                    {/* Divider */}
                    <Box width="100%" height={1} bg="black" opacity={0.1} />

                    {/* Body */}
                    <Box p={24} flex={10} width="100%">
                        {stage == LaunchStage.STEP_ONE && (
                            <SlotSelection
                                selectedSlots={selectedSlots}
                                setSelectedSlots={setSelectedSlots}
                            />
                        )}
                        {stage == LaunchStage.STEP_TWO && (
                            <ReagentTrayStep
                                slots={
                                    slotNumber == '' ? 1 : Number(slotNumber)
                                }
                                protocolId={protocol_ID}
                                onSelectionChange={(allSelected) =>
                                    setAllReagentSlotsSelected(allSelected)
                                }
                            />
                        )}
                        {stage == LaunchStage.STEP_THREE && (
                            <WashingLiquidsStep
                                onCompletionChange={(allOn) =>
                                    setAllWashingSwitchesOn(allOn)
                                }
                            />
                        )}
                        {stage == LaunchStage.STEP_FOUR && (
                            <SetLaunchTime
                                estimatedDuration={estimatedTime}
                                onValidationChange={(isValid) =>
                                    setIsLaunchTimeValid(isValid)
                                }
                            />
                        )}
                    </Box>
                </LinearGradient>
            </Box>
        </MainContainer>
    );
}

const StageMenu = (props: {
    stage: LaunchStage;
    changeStage: (stage: LaunchStage) => void;
}) => {
    const SingleStage = ({
        stage,
        current,
        text,
    }: {
        stage: LaunchStage;
        current: LaunchStage;
        text: string;
    }) => {
        const isCompleted = current > stage;
        const wasViewed = current >= stage;

        return (
            <HStack alignItems="center" justifyContent="space-between">
                <Button
                    onPress={() => props.changeStage(stage)}
                    bg="transparent"
                    justifyContent="flex-start"
                    alignItems="center"
                    pl={0}
                    pr={8}
                >
                    <ButtonIcon
                        size={14}
                        color="#1F2832"
                        as={isCompleted ? CheckSquare : Square}
                        opacity={wasViewed ? 1 : 0.6}
                    />
                    <ButtonText
                        ml={8}
                        color="#1F2832"
                        fontSize={14}
                        fontFamily="Manrope-SemiBold"
                        opacity={wasViewed ? 1 : 0.6}
                    >
                        {text}
                    </ButtonText>
                </Button>
                {stage != LaunchStage.STEP_FOUR && (
                    <Icon
                        as={ChevronRight}
                        size={18}
                        opacity={0.7}
                        color="#1F2832"
                        mr={12}
                    />
                )}
            </HStack>
        );
    };

    return (
        <HStack>
            <SingleStage
                stage={LaunchStage.STEP_ONE}
                current={props.stage}
                text="1. Slots"
            />
            <SingleStage
                stage={LaunchStage.STEP_TWO}
                current={props.stage}
                text="2. Reagents"
            />
            <SingleStage
                stage={LaunchStage.STEP_THREE}
                current={props.stage}
                text="3. Liquids"
            />
            <SingleStage
                stage={LaunchStage.STEP_FOUR}
                current={props.stage}
                text="4. Launch"
            />
        </HStack>
    );
};
/*
                                    makeRequest(
                                        'POST' as Method,
                                        '/jobs',
                                        JSON.stringify({
                                            protocol_id: protocol_ID,
                                            slots_used: [0],
                                            name: 'hello world',
                                            creator_id: current_user_id,
                                        }),
                                    ).then((res) => {
                                        console.log(res.data);
                                    });
                                    */
