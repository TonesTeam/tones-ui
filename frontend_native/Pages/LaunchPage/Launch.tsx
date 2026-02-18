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
import Txt from '../../components/Txt';
import Step1 from '../../assets/pics/step1.svg';
import Step2 from '../../assets/pics/step2.svg';
import Step2_inactive from '../../assets/pics/step2_inactive.svg';
import Step3 from '../../assets/pics/step3.svg';
import Step3_inactive from '../../assets/pics/step3_inactive.svg';
import Slot_quantity_active_Icon from '../../assets/icons/slot_active_mark.svg';
import Slot_quantity_inactive_Icon from '../../assets/icons/slots_quantity_inactive.svg';
import { useEffect, useState } from 'react';
import { LiquidTable } from './LiquidTable';
import { SlotMap } from './SlotMap';
import { SlotSelection } from './SlotSelection';
import { ReagentTrayStep } from './ReagentTrayStep';
import { WashingLiquidsStep } from './WashingLiquidsStep';
import { SLOT_QUANTITY } from '../../common/cartridgeConfig';
import { Confirmations } from './Confirmations';
import { SetLaunchTime } from './SetLaunchTime';
import { getRequest, makeRequest } from '../../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { StepType } from 'common/enums';
import { Method } from 'axios';
import { useUser } from '../../contexts/UserContext';
import { Box, Text, HStack, Pressable, Icon } from '@gluestack-ui/themed';
import { ArrowLeft } from 'lucide-react-native';

enum LaunchStage {
    STEP_ONE = 1,
    STEP_TWO = 2,
    STEP_THREE = 3,
    STEP_FOUR = 4,
}

function StageMenu(props: {
    stage: LaunchStage;
    changeStage: (stage: LaunchStage) => void;
    prohibitStageThree: boolean;
}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                }}
                onPress={() => props.changeStage(LaunchStage.STEP_ONE)}
                activeOpacity={1}
            >
                <Step1 height={50} width={180} style={{ zIndex: 100 }} />
                <Txt
                    style={{
                        position: 'absolute',
                        zIndex: 110,
                        color: AppStyles.color.elem_back,
                        fontFamily: 'Roboto-bold',
                    }}
                >
                    1.Slots
                </Txt>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 90,
                }}
                onPress={() => props.changeStage(LaunchStage.STEP_TWO)}
                activeOpacity={1}
            >
                {props.stage.valueOf() > 1 ? (
                    <Step2_inactive
                        height={50}
                        width={180}
                        style={{ left: -30, zIndex: 90 }}
                    />
                ) : (
                    <Step2
                        height={50}
                        width={180}
                        style={{ left: -30, zIndex: 90 }}
                    />
                )}

                <Txt
                    style={{
                        position: 'absolute',
                        zIndex: 110,
                        color: AppStyles.color.elem_back,
                        fontFamily: 'Roboto-bold',
                        left: 40,
                    }}
                >
                    2.Reagents
                </Txt>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 80,
                }}
                onPress={() =>
                    !props.prohibitStageThree &&
                    props.changeStage(LaunchStage.STEP_THREE)
                }
                activeOpacity={1}
            >
                {props.stage.valueOf() > 2 ? (
                    <Step3_inactive
                        height={50}
                        width={180}
                        style={{ left: -70, zIndex: 80 }}
                    />
                ) : (
                    <Step3
                        height={50}
                        width={180}
                        style={{ left: -70, zIndex: 80 }}
                    />
                )}

                <Txt
                    style={{
                        position: 'absolute',
                        zIndex: 110,
                        color: AppStyles.color.elem_back,
                        fontFamily: 'Roboto-bold',
                        left: 20,
                    }}
                >
                    3.Liquids
                </Txt>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 70,
                }}
                onPress={() => props.changeStage(LaunchStage.STEP_FOUR)}
                activeOpacity={1}
            >
                {props.stage.valueOf() > 3 ? (
                    <Step3_inactive
                        height={50}
                        width={180}
                        style={{ left: -110, zIndex: 70 }}
                    />
                ) : (
                    <Step3
                        height={50}
                        width={180}
                        style={{ left: -110, zIndex: 70 }}
                    />
                )}

                <Txt
                    style={{
                        position: 'absolute',
                        zIndex: 110,
                        color: AppStyles.color.elem_back,
                        fontFamily: 'Roboto-bold',
                        left: -20,
                    }}
                >
                    4.Launch
                </Txt>
            </TouchableOpacity>
        </View>
    );
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
    const [slotActivityMap, setSlotActivityMap] = useState<boolean[]>(
        Array(SLOT_QUANTITY).fill(false),
    );
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
                `/protocol/${protocol_ID}`,
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
        const newSlotActivityMap = slotActivityMap.map((slot, index) => {
            return index === idx ? !slot : slot;
        });
        setSlotActivityMap(newSlotActivityMap);
        // Update slot count
        const selectedCount = newSlotActivityMap.filter((s) => s).length;
        setSlotNumber(selectedCount);
    }

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <HStack mb="$8" mt={16}>
                    <Pressable
                        onPress={() => {
                            if (stage != LaunchStage.STEP_ONE) {
                                setStage(stage.valueOf() - 1);
                            }
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
                <View style={s.header}>
                    <View style={{ flex: 1 }}>
                        <StageMenu
                            stage={stage}
                            changeStage={setStage}
                            prohibitStageThree={
                                slotActivityMap.filter((val) => val === true)
                                    .length < Number(slotNumber)
                            }
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        {stage == LaunchStage.STEP_TWO && (
                            <View
                                style={{
                                    alignSelf: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: AppStyles.color.background,
                                    padding: 10,
                                    justifyContent: 'center',
                                }}
                            >
                                {slotActivityMap.filter((slot) => slot == true)
                                    .length == Number(slotNumber) ? (
                                    <Slot_quantity_active_Icon height={30} />
                                ) : (
                                    <Slot_quantity_inactive_Icon height={30} />
                                )}
                                <Txt style={{ fontSize: 20 }}>
                                    Selected slots:{' '}
                                </Txt>
                                <Txt
                                    style={{
                                        fontSize: 26,
                                        fontFamily: 'Roboto-bold',
                                    }}
                                >
                                    {
                                        slotActivityMap.filter(
                                            (slot) => slot == true,
                                        ).length
                                    }
                                </Txt>
                            </View>
                        )}
                        {stage == LaunchStage.STEP_THREE}
                    </View>
                </View>
                <View style={s.body}>
                    {stage == LaunchStage.STEP_ONE && (
                        <SlotSelection
                            selectedSlots={
                                slotNumber == '' ? 0 : Number(slotNumber)
                            }
                            onSelectSlot={(num) => setSlotNumber(num)}
                            selectedSlotsList={slotActivityMap}
                            onToggleSlot={toggleSlotActivity}
                        />
                    )}
                    {stage == LaunchStage.STEP_TWO && (
                        <ReagentTrayStep
                            slots={slotNumber == '' ? 1 : Number(slotNumber)}
                            protocolId={protocol_ID}
                            onSelectionChange={(allSelected) =>
                                setAllReagentSlotsSelected(allSelected)
                            }
                        />
                    )}
                    {stage == LaunchStage.STEP_THREE && (
                        <WashingLiquidsStep
                            slots={slotNumber == '' ? 1 : Number(slotNumber)}
                            protocolId={protocol_ID}
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
                </View>
                <View style={s.footer}>
                    <TouchableOpacity
                        style={s.footer_btn_back}
                        onPress={() => {
                            if (stage == 1) {
                                navigation.navigate('ProtocolView', {
                                    protocol_ID: protocol_ID,
                                });
                            } else {
                                setStage(stage - 1);
                            }
                        }}
                    >
                        <Txt style={{ fontFamily: 'Roboto-bold' }}>
                            {stage == 1 ? 'Cancel' : 'Back'}
                        </Txt>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            s.footer_btn_next,
                            (stage == LaunchStage.STEP_ONE &&
                                !Number(slotNumber)) ||
                            (stage == LaunchStage.STEP_TWO &&
                                !allReagentSlotsSelected) ||
                            (stage == LaunchStage.STEP_THREE &&
                                !allWashingSwitchesOn) ||
                            (stage == LaunchStage.STEP_FOUR &&
                                !isLaunchTimeValid)
                                ? s.footer_btn_disabled
                                : {},
                        ]}
                        onPress={() => {
                            if (
                                stage == LaunchStage.STEP_ONE &&
                                Number(slotNumber)
                            ) {
                                setStage(stage + 1);
                            }
                            if (
                                stage == LaunchStage.STEP_TWO &&
                                allReagentSlotsSelected
                            ) {
                                setStage(stage + 1);
                            }
                            if (
                                stage == LaunchStage.STEP_THREE &&
                                allWashingSwitchesOn
                            ) {
                                setStage(stage + 1);
                            }
                            if (
                                stage == LaunchStage.STEP_FOUR &&
                                isLaunchTimeValid
                            ) {
                                makeRequest(
                                    'POST' as Method,
                                    '/jobs',
                                    JSON.stringify({
                                        protocol_id: protocol_ID,
                                        slots_used: [1, 2, 3],
                                        name: 'hello world',
                                        creator_id: current_user_id,
                                    }),
                                ).then((res) => {
                                    console.log(res.data);
                                });
                            }
                        }}
                        disabled={
                            (stage == LaunchStage.STEP_ONE &&
                                !Number(slotNumber)) ||
                            (stage == LaunchStage.STEP_TWO &&
                                !allReagentSlotsSelected) ||
                            (stage == LaunchStage.STEP_THREE &&
                                !allWashingSwitchesOn) ||
                            (stage == LaunchStage.STEP_FOUR &&
                                !isLaunchTimeValid)
                        }
                    >
                        <Txt
                            style={{
                                color: AppStyles.color.elem_back,
                                fontFamily: 'Roboto-bold',
                            }}
                        >
                            {stage == 4 ? 'Launch' : 'Next'}
                        </Txt>
                    </TouchableOpacity>
                </View>
            </Box>
        </MainContainer>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
    },

    header: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    body: {
        flex: 10,
        borderTopWidth: 2,
        borderTopColor: AppStyles.color.background,
        borderBottomWidth: 2,
        borderBottomColor: AppStyles.color.background,
        width: '100%',
    },

    footer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
    },

    footer_btn_back: {
        paddingVertical: 15,
        width: 200,
        backgroundColor: AppStyles.color.elem_back,
        borderWidth: 1,
        borderColor: AppStyles.color.accent_back,
        borderRadius: 8,
        alignItems: 'center',
    },

    footer_btn_next: {
        paddingVertical: 15,
        width: 200,
        backgroundColor: AppStyles.color.dark_btn,
        borderWidth: 1,
        borderColor: AppStyles.color.dark_btn,
        borderRadius: 8,
        alignItems: 'center',
    },

    footer_btn_disabled: {
        backgroundColor: AppStyles.color.background,
        borderColor: AppStyles.color.background,
        opacity: 0.5,
    },
});
