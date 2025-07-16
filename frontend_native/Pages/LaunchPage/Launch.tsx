import {
    StyleSheet,
    Text,
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
import NavBar from '../../navigation/CustomNavigator';
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
import { SLOT_QUANTITY } from '../../common/cartridgeConfig';
import { Confirmations } from './Confirmations';
import { getRequest } from '../../common/util';

enum LaunchStage {
    STEP_ONE = 1,
    STEP_TWO = 2,
    STEP_THREE = 3,
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
                    Step 1
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
                    Step 2
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
                    Step 3
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

    const [stage, setStage] = useState<LaunchStage>(LaunchStage.STEP_ONE);
    const [slotNumber, setSlotNumber] = useState<number | ''>(1);
    const [slotActivityMap, setSlotActivityMap] = useState<boolean[]>(
        Array(SLOT_QUANTITY).fill(false),
    );
    const [confirmations, setConfirmations] = useState(0);

    function toggleSlotActivity(idx: number) {
        const newSlotActivityMap = slotActivityMap.map((slot, index) => {
            return index === idx ? !slot : slot;
        });
        setSlotActivityMap(newSlotActivityMap);
    }

    return (
        <MainContainer>
            <NavBar />
            <View style={[globalElementStyle.page_container, s.container]}>
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
                        {stage == LaunchStage.STEP_ONE && (
                            <View
                                style={{
                                    alignSelf: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Txt
                                    style={{
                                        fontFamily: 'Roboto-bold',
                                        fontSize: 16,
                                        flex: 1,
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    Choose quantity of slots used for current
                                    deployment:
                                </Txt>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderRadius: 8,
                                        backgroundColor:
                                            AppStyles.color.background,
                                        height: 60,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: AppStyles.color.background,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            paddingHorizontal: 45,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() =>
                                            Number(slotNumber) > 1 &&
                                            setSlotNumber(
                                                Number(slotNumber) - 1,
                                            )
                                        }
                                    >
                                        <Txt style={{ fontSize: 50 }}>-</Txt>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            backgroundColor:
                                                AppStyles.color.elem_back,
                                            height: '100%',
                                            width: 80,
                                        }}
                                    >
                                        <TextInput
                                            textAlign={'center'}
                                            maxLength={1}
                                            value={slotNumber.toString()}
                                            onChangeText={(text) =>
                                                setSlotNumber(
                                                    Number(text) == 0 ||
                                                        isNaN(Number(text)) ||
                                                        Number(text) >
                                                            SLOT_QUANTITY
                                                        ? ''
                                                        : Number(text),
                                                )
                                            }
                                            onBlur={(e) => {
                                                if (slotNumber == '')
                                                    setSlotNumber(1);
                                            }}
                                            inputMode={
                                                'numeric' as InputModeOptions
                                            }
                                            style={{ flex: 1, fontSize: 30 }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            paddingHorizontal: 45,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() =>
                                            setSlotNumber(
                                                slotNumber == ''
                                                    ? 1
                                                    : Number(slotNumber) + 1 <=
                                                        SLOT_QUANTITY
                                                      ? Number(slotNumber) + 1
                                                      : Number(slotNumber),
                                            )
                                        }
                                    >
                                        <Txt style={{ fontSize: 40 }}>+</Txt>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
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
                                <Txt style={{ fontSize: 20 }}>Selected </Txt>
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
                                <Txt style={{ fontSize: 20 }}>
                                    {' '}
                                    slots out of{' '}
                                </Txt>
                                <Txt
                                    style={{
                                        fontSize: 26,
                                        fontFamily: 'Roboto-bold',
                                    }}
                                >
                                    {Number(slotNumber)}
                                </Txt>
                            </View>
                        )}
                        {stage == LaunchStage.STEP_THREE && (
                            <Txt
                                style={{
                                    fontSize: 18,
                                }}
                            >
                                This is final step before launching protocol.
                                Please go through check-up points and confirm
                                all before launching protocol.
                            </Txt>
                        )}
                    </View>
                </View>
                <View style={s.body}>
                    {stage == LaunchStage.STEP_ONE && (
                        <LiquidTable
                            slots={slotNumber == '' ? 1 : Number(slotNumber)}
                        />
                    )}
                    {stage == LaunchStage.STEP_TWO && (
                        <SlotMap
                            slotsMap={slotActivityMap}
                            limitReached={
                                slotActivityMap.filter((slot) => slot == true)
                                    .length == Number(slotNumber)
                            }
                            changeActiveSlots={(idx) => toggleSlotActivity(idx)}
                        />
                    )}
                    {stage == LaunchStage.STEP_THREE && (
                        <Confirmations
                            updateConfirmations={(state: boolean) =>
                                state == true
                                    ? setConfirmations(confirmations + 1)
                                    : confirmations > 0
                                      ? setConfirmations(confirmations - 1)
                                      : setConfirmations(0)
                            }
                        />
                    )}
                </View>
                <View style={s.footer}>
                    <TouchableOpacity
                        style={s.footer_btn_back}
                        onPress={() => {
                            if (stage == 1)
                                navigation.navigate('Protocol List');
                            else setStage(stage - 1);
                        }}
                    >
                        <Txt style={{ fontFamily: 'Roboto-bold' }}>
                            {stage == 1 ? 'Cancel' : 'Back'}
                        </Txt>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.footer_btn_next}
                        onPress={() => {
                            if (
                                stage == LaunchStage.STEP_TWO &&
                                slotActivityMap.filter((slot) => slot == true)
                                    .length == Number(slotNumber)
                            ) {
                                setStage(stage + 1);
                            }
                            if (
                                stage == LaunchStage.STEP_ONE &&
                                Number(slotNumber)
                            )
                                setStage(stage + 1);
                            if (
                                stage == LaunchStage.STEP_THREE &&
                                confirmations == 4
                            )
                                getRequest(
                                    `/protocol/${protocol_ID}/test-steps`,
                                );
                        }}
                    >
                        <Txt
                            style={{
                                color: AppStyles.color.elem_back,
                                fontFamily: 'Roboto-bold',
                            }}
                        >
                            {stage == 3 ? 'Launch' : 'Next'}
                        </Txt>
                    </TouchableOpacity>
                </View>
            </View>
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
});
