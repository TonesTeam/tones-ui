import {
    View,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
} from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import Txt from '../../components/Txt';
import { AppStyles } from '../../constants/styles';
import { Box, HStack, VStack } from '@gluestack-ui/themed';
import { getRequest } from '../../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { ReagentStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { PermanentLiquidDTO } from 'common/dto/liquid.dto';
import { CARTRIDGE_CONFIG } from '../../common/cartridgeConfig';

interface WashingInfo {
    name: string;
    volume: number;
    washingTrayPosition?: number;
}

// Washing liquid table component (2x2 orange table)
function WashingTable(props: { washingLiquids: WashingInfo[] }) {
    return (
        <View style={s.washingContainer}>
            <View style={s.washing_title}>
                <Txt style={s.washing_title_text}>WASHING LIQUID SECTION</Txt>
            </View>

            {/* Header row */}
            <View style={s.washing_header_row}>
                <View style={{ width: 45 }}></View>
                <View style={s.washing_header_cell}>
                    <Txt style={s.header_text}>1</Txt>
                </View>
                <View style={s.washing_header_cell}>
                    <Txt style={s.header_text}>2</Txt>
                </View>
            </View>

            {/* Data rows */}
            {[0, 1].map((rowIndex) => (
                <View key={rowIndex} style={s.washing_row}>
                    <View style={s.washing_row_header}>
                        <Txt style={s.header_text}>{rowIndex + 1}</Txt>
                    </View>
                    {[0, 1].map((colIndex) => {
                        const cellIndex = rowIndex * 2 + colIndex;
                        const washing = props.washingLiquids[cellIndex];

                        return (
                            <View key={colIndex} style={s.washing_cell}>
                                {washing ? (
                                    <VStack space="xs" alignItems="center">
                                        <Txt style={s.washing_cell_title}>
                                            {washing.name}
                                        </Txt>
                                        <Txt style={s.washing_cell_volume}>
                                            {washing.volume.toFixed(2)} ml
                                        </Txt>
                                    </VStack>
                                ) : (
                                    <Txt style={s.washing_cell_empty}>---</Txt>
                                )}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

// Waste container toggle component
function WasteContainerToggle(props: {
    number: number;
    type: string;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={props.onToggle}
            style={s.wasteToggleContainer}
        >
            <View style={s.wasteIconContainer}>
                <Txt style={s.wasteIcon}>🗑</Txt>
                <Txt style={s.wasteNumber}>#{props.number}</Txt>
            </View>
            <Txt style={s.wasteType}>{props.type}</Txt>
            <Txt style={s.wasteStatus}>half empty</Txt>
            <Switch
                value={props.checked}
                onValueChange={props.onToggle}
                trackColor={{ false: '#D1D5DB', true: '#089A26' }}
                thumbColor={props.checked ? '#FFFFFF' : '#F3F4F6'}
            />
        </TouchableOpacity>
    );
}

export function WashingLiquidsStep(props: {
    slots: number;
    protocolId?: number;
    liquids?: any[];
    onCompletionChange?: (allSwitchesOn: boolean) => void;
}) {
    const [washingLiquids, setWashingLiquids] = useState<WashingInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [washingChecked, setWashingChecked] = useState<Map<string, boolean>>(
        new Map(),
    );
    const [generalWasteChecked, setGeneralWasteChecked] = useState(false);
    const [hazardWasteChecked, setHazardWasteChecked] = useState(false);

    // Check if all switches are on
    useEffect(() => {
        if (props.onCompletionChange) {
            const allWashingOn = washingLiquids.every(
                (liquid) => washingChecked.get(liquid.name) === true,
            );
            const allOn =
                allWashingOn && generalWasteChecked && hazardWasteChecked;
            props.onCompletionChange(allOn);
        }
    }, [
        washingChecked,
        generalWasteChecked,
        hazardWasteChecked,
        washingLiquids,
    ]);

    useEffect(() => {
        if (props.protocolId) {
            loadWashingLiquids();
        }
    }, [props.protocolId, props.slots]);

    const loadWashingLiquids = async () => {
        setLoading(true);
        try {
            const response = await getRequest<ProtocolWithStepsDTO>(
                `/protocols/${props.protocolId}`,
            );
            if ('data' in response) {
                const protocol = response.data;

                const washingUsage = new Map<
                    string,
                    {
                        name: string;
                        count: number;
                        washingTrayPosition?: number;
                    }
                >();

                // Go through each step and collect washing liquids
                const allSteps =
                    protocol.step_groups?.flatMap(
                        (group: any) => group.steps,
                    ) || [];

                allSteps.forEach((step: any) => {
                    // Определяем мойка это или реагент по типу жидкости
                    const liquid = props.liquids?.find(
                        (l: any) => l.id === step.applied_liquid_id,
                    );
                    const isWashing =
                        liquid?.liquid_type_name?.includes('Washing') ||
                        liquid?.liquid_type_name === 'Washing Liquid' ||
                        liquid?.liquid_type_name === 'Washing Buffer';

                    if (isWashing && liquid) {
                        const washName = liquid.name;
                        const iterations = step.iterations || 1;

                        if (washingUsage.has(washName)) {
                            washingUsage.get(washName)!.count += iterations;
                        } else {
                            washingUsage.set(washName, {
                                name: washName,
                                count: iterations,
                            });
                        }
                    }
                });

                // Convert to WashingInfo list
                const washingList: WashingInfo[] = [];
                washingUsage.forEach((value) => {
                    const volume = value.count * props.slots * 0.25;

                    washingList.push({
                        name: value.name,
                        volume: volume,
                        washingTrayPosition: value.washingTrayPosition,
                    });
                });

                setWashingLiquids(washingList);
            }
        } catch (error) {
            console.error('Error loading washing liquids:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack flex={1} padding="$4" space="lg">
            {/* Top Section: Washing Liquids */}
            <HStack flex={1} gap={34}>
                {/* Left: Instructions */}
                <VStack flex={1} space="md">
                    <Box
                        backgroundColor={AppStyles.color.primary_faded}
                        padding="$4"
                        borderRadius="$lg"
                    >
                        <Txt
                            style={{
                                fontSize: 20,
                                fontFamily: 'Roboto-bold',
                                marginBottom: 12,
                            }}
                        >
                            Add Washing Liquids
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            1. Open tray with liquids
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            2. Check if there is enough liquid
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            3. If there is not enough liquid. Insert liquids as
                            per instructions into the tray
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            4. When done, close the tray with liquids
                        </Txt>
                    </Box>
                </VStack>

                {/* Right: Washing Liquids List */}
                <Box flex={1}>
                    <ScrollView style={{ flex: 1 }}>
                        <VStack space="md">
                            {washingLiquids.map((liquid, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        const newChecked = new Map(
                                            washingChecked,
                                        );
                                        const currentValue =
                                            washingChecked.get(liquid.name) ||
                                            false;
                                        newChecked.set(
                                            liquid.name,
                                            !currentValue,
                                        );
                                        setWashingChecked(newChecked);
                                    }}
                                >
                                    <Box
                                        backgroundColor={
                                            AppStyles.color.elem_back
                                        }
                                        padding="$4"
                                        borderRadius="$lg"
                                        borderWidth={1}
                                        borderColor={AppStyles.color.background}
                                    >
                                        <HStack
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <VStack flex={1} space="xs">
                                                <Txt
                                                    style={{
                                                        fontSize: 18,
                                                        fontFamily:
                                                            'Roboto-bold',
                                                        color: AppStyles.color
                                                            .text_primary,
                                                    }}
                                                >
                                                    {liquid.name}
                                                </Txt>
                                                <HStack space="md">
                                                    <Txt
                                                        style={{
                                                            fontSize: 14,
                                                            color: AppStyles
                                                                .color
                                                                .text_faded,
                                                        }}
                                                    >
                                                        Tray Position:{' '}
                                                        {liquid.washingTrayPosition ??
                                                            '-'}
                                                    </Txt>
                                                    <Txt
                                                        style={{
                                                            fontSize: 14,
                                                            color: AppStyles
                                                                .color
                                                                .text_faded,
                                                        }}
                                                    >
                                                        Volume:{' '}
                                                        {liquid.volume.toFixed(
                                                            2,
                                                        )}{' '}
                                                        ml
                                                    </Txt>
                                                </HStack>
                                            </VStack>
                                            <Switch
                                                value={
                                                    washingChecked.get(
                                                        liquid.name,
                                                    ) || false
                                                }
                                                onValueChange={(val) => {
                                                    const newChecked = new Map(
                                                        washingChecked,
                                                    );
                                                    newChecked.set(
                                                        liquid.name,
                                                        val,
                                                    );
                                                    setWashingChecked(
                                                        newChecked,
                                                    );
                                                }}
                                                trackColor={{
                                                    false: '#D1D5DB',
                                                    true: '#089A26',
                                                }}
                                                thumbColor={
                                                    washingChecked.get(
                                                        liquid.name,
                                                    )
                                                        ? '#FFFFFF'
                                                        : '#F3F4F6'
                                                }
                                            />
                                        </HStack>
                                    </Box>
                                </TouchableOpacity>
                            ))}
                            {washingLiquids.length === 0 && (
                                <Box padding="$6" alignItems="center">
                                    <Txt
                                        style={{
                                            color: AppStyles.color.text_faded,
                                        }}
                                    >
                                        No washing liquids required
                                    </Txt>
                                </Box>
                            )}
                        </VStack>
                    </ScrollView>
                </Box>
            </HStack>

            {/* Bottom Section: Waste Containers */}
            <HStack flex={1} gap={34}>
                {/* Left: Instructions */}
                <VStack flex={1} space="md">
                    <Box
                        backgroundColor={AppStyles.color.primary_faded}
                        padding="$4"
                        borderRadius="$lg"
                    >
                        <Txt
                            style={{
                                fontSize: 20,
                                fontFamily: 'Roboto-bold',
                                marginBottom: 12,
                            }}
                        >
                            Check Wastes Containers
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            1. Find container with{' '}
                            <Txt style={{ fontFamily: 'Roboto-bold' }}>
                                general
                            </Txt>{' '}
                            wastes
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            2. Empty it if it is more than half full.
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            3. Find container with{' '}
                            <Txt style={{ fontFamily: 'Roboto-bold' }}>
                                hazard
                            </Txt>{' '}
                            wastes
                        </Txt>
                        <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                            4. Empty it if it is more than half full.
                        </Txt>
                    </Box>
                </VStack>

                {/* Right: Waste Container Toggles */}
                <Box flex={1}>
                    <VStack space="md" padding="$4">
                        <WasteContainerToggle
                            number={1}
                            type="General waste"
                            checked={generalWasteChecked}
                            onToggle={() =>
                                setGeneralWasteChecked(!generalWasteChecked)
                            }
                        />
                        <WasteContainerToggle
                            number={2}
                            type="Hazard waste"
                            checked={hazardWasteChecked}
                            onToggle={() =>
                                setHazardWasteChecked(!hazardWasteChecked)
                            }
                        />
                    </VStack>
                </Box>
            </HStack>
        </VStack>
    );
}

const s = StyleSheet.create({
    // Washing table styles
    washingContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        minWidth: 400,
    },
    washing_title: {
        backgroundColor: AppStyles.color.accent_dark,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    washing_title_text: {
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    washing_header_row: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: AppStyles.color.accent_dark,
    },
    washing_header_cell: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
        alignItems: 'center',
        justifyContent: 'center',
    },
    washing_row: {
        flexDirection: 'row',
        height: 80,
    },
    washing_row_header: {
        width: 45,
        backgroundColor: AppStyles.color.accent_dark,
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
        alignItems: 'center',
        justifyContent: 'center',
    },
    washing_cell: {
        flex: 1,
        backgroundColor: AppStyles.color.block.main_temperature,
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    washing_cell_title: {
        color: AppStyles.color.background,
        fontFamily: 'Roboto-bold',
        fontSize: 14,
        textAlign: 'center',
    },
    washing_cell_volume: {
        color: AppStyles.color.background,
        fontSize: 12,
        textAlign: 'center',
    },
    washing_cell_empty: {
        color: AppStyles.color.background,
        fontSize: 12,
        textAlign: 'center',
    },
    header_text: {
        textTransform: 'uppercase',
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
        textAlign: 'center',
        fontSize: 14,
    },

    // Waste container toggle styles
    wasteToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppStyles.color.elem_back,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppStyles.color.background,
        gap: 12,
    },
    wasteIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    wasteIcon: {
        fontSize: 24,
    },
    wasteNumber: {
        fontSize: 16,
        fontFamily: 'Roboto-bold',
    },
    wasteType: {
        fontSize: 16,
        flex: 1,
    },
    wasteStatus: {
        fontSize: 14,
        color: AppStyles.color.text_faded,
    },
});
