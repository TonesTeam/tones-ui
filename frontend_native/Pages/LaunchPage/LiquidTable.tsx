import { View, StyleSheet, ScrollView as RNScrollView } from 'react-native';
import Txt from '../../components/Txt';
import { CARTRIDGE_CONFIG } from '../../common/cartridgeConfig';
import { AppStyles } from '../../constants/styles';
import { StyleProps } from 'react-native-reanimated';
import { useEffect, useState, useMemo } from 'react';
import { getRequest } from '../../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { StepDTO, ReagentStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { Box, VStack, HStack } from '@gluestack-ui/themed';
import { ReagentInstructions, ReagentInstruction } from './ReagentInstructions';

interface ReagentInfo {
    name: string;
    usage: number;
    type: string;
    cells?: number;
    volumePerCell?: number;
    cellIndex?: number;
}

function Table(props: {
    config: { x: number; y: number };
    color: string;
    letterOffset: number;
    reagents?: ReagentInfo[];
    startIndex?: number;
    slots?: number;
    title?: string;
}) {
    return (
        <View style={s.table}>
            {props.title && (
                <View style={s.table_title}>
                    <Txt style={s.title_text}>{props.title}</Txt>
                </View>
            )}
            <View style={s.header_row}>
                <View style={{ width: 35 }}></View>
                {Array(props.config.x)
                    .fill(null)
                    .map((_, header_index) => {
                        return (
                            <View
                                key={header_index}
                                style={{
                                    flex: 1,
                                    borderWidth: 0.5,
                                    borderColor: AppStyles.color.elem_back,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Txt style={s.header_text}>
                                    {header_index + 1}
                                </Txt>
                            </View>
                        );
                    })}
            </View>
            {Array(props.config.y)
                .fill(null)
                .map((_, row_index) => {
                    return (
                        <View key={row_index} style={s.row}>
                            <View
                                style={{
                                    backgroundColor:
                                        AppStyles.color.accent_dark,
                                    width: 35,
                                    height: 80,
                                    borderWidth: 0.5,
                                    borderColor: AppStyles.color.elem_back,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Txt style={s.header_text}>{row_index + 1}</Txt>
                            </View>
                            {Array(props.config.x)
                                .fill(null)
                                .map((_, col_index) => {
                                    const cellIndex =
                                        col_index * props.config.y + row_index;
                                    const reagentIndex =
                                        (props.startIndex || 0) + cellIndex;
                                    const reagent =
                                        props.reagents &&
                                        reagentIndex < props.reagents.length
                                            ? props.reagents[reagentIndex]
                                            : null;

                                    return (
                                        <View
                                            key={col_index}
                                            style={[
                                                s.cell,
                                                {
                                                    backgroundColor:
                                                        props.color,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                },
                                            ]}
                                        >
                                            {reagent ? (
                                                <VStack
                                                    space="xs"
                                                    alignItems="center"
                                                >
                                                    <Txt
                                                        style={{
                                                            color: AppStyles
                                                                .color
                                                                .background,
                                                            fontWeight: 'bold',
                                                            fontSize: 12,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {reagent.name}
                                                    </Txt>
                                                    <Txt
                                                        style={{
                                                            color: AppStyles
                                                                .color
                                                                .background,
                                                            fontSize: 10,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {(() => {
                                                            if (
                                                                reagent.volumePerCell !==
                                                                undefined
                                                            ) {
                                                                return (
                                                                    reagent.volumePerCell.toFixed(
                                                                        2,
                                                                    ) + ' ml'
                                                                );
                                                            }
                                                            const totalVolume =
                                                                reagent.usage *
                                                                (props.slots ||
                                                                    1) *
                                                                0.25;
                                                            const cellCount =
                                                                reagent.cells ||
                                                                1;
                                                            const cellVolume =
                                                                totalVolume /
                                                                cellCount;
                                                            return (
                                                                cellVolume.toFixed(
                                                                    2,
                                                                ) + ' ml'
                                                            );
                                                        })()}
                                                    </Txt>
                                                </VStack>
                                            ) : (
                                                <Txt
                                                    style={{
                                                        color: AppStyles.color
                                                            .background,
                                                        fontSize: 10,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    ---
                                                </Txt>
                                            )}
                                        </View>
                                    );
                                })}
                        </View>
                    );
                })}
        </View>
    );
}

//Left panel: Instructions for reagent preparation
//Right panel: Visual representation of physical robot stand
export function LiquidTable(props: { slots: number; protocolId?: number }) {
    const table_config = CARTRIDGE_CONFIG;
    const [reagents, setReagents] = useState<ReagentInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [washingName, setWashingName] = useState<string>('---');
    const [defaultWashingIterations, setDefaultWashingIterations] =
        useState<number>(0);
    const [totalWashingIterations, setTotalWashingIterations] =
        useState<number>(0);

    useEffect(() => {
        if (props.protocolId) {
            loadReagents();
        }
    }, [props.protocolId, props.slots]);

    const loadReagents = async () => {
        setLoading(true);
        try {
            const response = await getRequest<ProtocolWithStepsDTO>(
                `/protocols/${props.protocolId}`,
            );
            console.log('Protocol data received:', response.data);
            const protocol = response.data;

            setWashingName(protocol.defaultWash.liquid.name);
            setDefaultWashingIterations(protocol.defaultWash.iters);

            const reagentUsage = new Map<
                string,
                { name: string; usage: number; type: string }
            >();
            let totalWashing = 0;

            // Go through each step and find liquid steps
            protocol.steps.forEach((step: any) => {
                if (step.type === StepType.LIQUID_APPL) {
                    const reagentStep = step.params as ReagentStep;
                    const liquidName = reagentStep.liquid.name;
                    const typeName = reagentStep.liquid.type.name;
                    const stepUsage = reagentStep.iters || 1;

                    let stepWashing = 0;

                    if (reagentStep.autoWash) {
                        stepWashing += protocol.defaultWash.iters;
                    }

                    if (reagentStep.washingIterations) {
                        stepWashing += reagentStep.washingIterations;
                    }

                    totalWashing += stepWashing * stepUsage * props.slots;

                    if (reagentUsage.has(liquidName)) {
                        reagentUsage.get(liquidName)!.usage += stepUsage;
                    } else {
                        reagentUsage.set(liquidName, {
                            name: liquidName,
                            usage: stepUsage,
                            type: typeName,
                        });
                    }
                }
            });

            setTotalWashingIterations(totalWashing);
            console.log('Get washing iterations:', totalWashing);
            const reagentsList = Array.from(reagentUsage.values());
            console.log('Reagents loaded:', reagentsList);
            setReagents(reagentsList);
        } catch (error) {
            console.error('Error loading reagents:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create reagents with smart distribution between S and M sections
    const { smallReagents, mediumReagents } = useMemo(() => {
        const small: ReagentInfo[] = [];
        const medium: ReagentInfo[] = [];

        const nonWashingReagents = reagents.filter((r) => r.type !== 'Washing');

        nonWashingReagents.forEach((reagent) => {
            const totalVolume = reagent.usage * props.slots * 0.25;

            if (totalVolume <= 2) {
                // s section
                small.push({
                    ...reagent,
                    cells: 1,
                    volumePerCell: totalVolume,
                });
            } else {
                // destribute between M and S sections
                let remainingVolume = totalVolume;
                let cellIndex = 1;

                // M section
                while (remainingVolume > 2) {
                    const volumeForMCell = Math.min(remainingVolume, 5);
                    medium.push({
                        ...reagent,
                        name: reagent.name,
                        cells:
                            Math.ceil(totalVolume / 5) +
                            (totalVolume % 5 <= 2 && totalVolume % 5 > 0
                                ? 1
                                : 0),
                        volumePerCell: volumeForMCell,
                        cellIndex: cellIndex,
                    });

                    remainingVolume -= volumeForMCell;
                    cellIndex++;
                }

                // remaining in S section
                if (remainingVolume > 0 && remainingVolume <= 2) {
                    small.push({
                        ...reagent,
                        name: reagent.name,
                        cells: 1,
                        volumePerCell: remainingVolume,
                        cellIndex: cellIndex,
                    });
                }
            }
        });

        return { smallReagents: small, mediumReagents: medium };
    }, [reagents, props.slots]);

    //Generate instructions for left panel using distributed reagents
    const instructions = useMemo((): ReagentInstruction[] => {
        if (reagents.length === 0) return [];

        const instructionsList: ReagentInstruction[] = [];

        const sInstructions = smallReagents.map((r) => ({
            name: r.name,
            volume: r.volumePerCell || 0,
        }));

        const mInstructions = mediumReagents.map((r) => ({
            name: r.name,
            volume: r.volumePerCell || 0,
        }));

        if (sInstructions.length > 0) {
            instructionsList.push({
                table: 'S section',
                reagents: sInstructions,
                color: AppStyles.color.primary,
            });
        }

        if (mInstructions.length > 0) {
            instructionsList.push({
                table: 'M section',
                reagents: mInstructions,
                color: AppStyles.color.secondary,
            });
        }

        const washingReagents = reagents.filter((r) => r.type === 'Washing');
        const washingInstructions: {
            name: string;
            volume: number;
            cells?: number;
        }[] = [];

        washingReagents.forEach((r) => {
            const volume = r.usage * props.slots * 0.25;
            washingInstructions.push({ name: r.name, volume, cells: 1 });
        });

        const volume = totalWashingIterations * 0.25;
        washingInstructions.push({ name: washingName, volume, cells: 1 });

        instructionsList.push({
            table: 'Washing liquid',
            reagents: washingInstructions,
            color: AppStyles.color.block.main_temperature,
        });

        return instructionsList;
    }, [
        smallReagents,
        mediumReagents,
        reagents,
        props.slots,
        totalWashingIterations,
        washingName,
    ]);

    // L section (only washing liquids, not reagents)
    const washingFromProtocol = reagents.filter((r) => r.type === 'Washing');
    const defaultWashing = [
        {
            name: washingName,
            usage: totalWashingIterations / props.slots,
            type: 'Washing',
        },
    ];
    const washingLiquid: ReagentInfo[] = [
        ...washingFromProtocol,
        ...defaultWashing,
    ];

    return (
        <HStack flex={1}>
            {/* Left panel */}
            <ReagentInstructions
                instructions={instructions}
                loading={loading}
                protocolId={props.protocolId}
            />

            {/* Right panel */}
            <Box flex={1}>
                <RNScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                >
                    <RNScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        persistentScrollbar={true}
                        contentContainerStyle={{ alignItems: 'flex-start' }}
                        nestedScrollEnabled={true}
                    >
                        <Table
                            config={table_config.size_S}
                            letterOffset={0}
                            color={AppStyles.color.primary}
                            reagents={smallReagents}
                            startIndex={0}
                            slots={props.slots}
                            title="S section"
                        />
                        <Table
                            config={table_config.size_M}
                            letterOffset={table_config.size_S.x}
                            color={AppStyles.color.secondary}
                            reagents={mediumReagents}
                            startIndex={0}
                            slots={props.slots}
                            title="M section"
                        />
                        <Table
                            config={table_config.size_L}
                            letterOffset={
                                table_config.size_M.x + table_config.size_S.x
                            }
                            color={AppStyles.color.block.main_temperature}
                            reagents={washingLiquid}
                            startIndex={0}
                            slots={props.slots}
                            title="Washing liquid section"
                        />
                    </RNScrollView>
                </RNScrollView>
            </Box>
        </HStack>
    );
}

const s = StyleSheet.create({
    table: {
        flexDirection: 'column',
        marginHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        overflow: 'hidden',
    },

    row: {
        flexDirection: 'row',
        height: 80,
    },

    header_row: {
        height: 30,
        flexDirection: 'row',
        backgroundColor: AppStyles.color.accent_dark,
    },

    header_text: {
        textTransform: 'uppercase',
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
        textAlign: 'center',
    },

    cell: {
        width: 150,
        height: 80,
        backgroundColor: AppStyles.color.elem_back,
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
    },

    table_title: {
        backgroundColor: AppStyles.color.accent_dark,
        paddingVertical: 8,
        alignItems: 'center',
        width: '100%',
    },

    title_text: {
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },
});
