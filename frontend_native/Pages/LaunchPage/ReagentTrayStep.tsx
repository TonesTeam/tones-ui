import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import Txt from '../../components/Txt';
import { AppStyles } from '../../constants/styles';
import { Box, HStack, VStack } from '@gluestack-ui/themed';
import { getRequest } from '../../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { ReagentStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { CARTRIDGE_CONFIG } from '../../common/cartridgeConfig';

interface ReagentInfo {
    name: string;
    usage: number;
    type: string;
    cells?: number;
    volumePerCell?: number;
    cellIndex?: number;
    trayPosition?: number; // Position in the tray within its section
}

// Tray visual component for a specific section (S or M)
function ReagentTray(props: {
    reagents: ReagentInfo[];
    selectedSlots: Set<number>;
    onSlotClick: (position: number) => void;
    rows: number;
    cols: number;
    color: string;
    slotSize: number;
    slotMargin: number;
    startNumber?: number;
}) {
    const renderSlot = (row: number, col: number) => {
        const slotNumber = row * props.cols + col + (props.startNumber || 1); // Row-major order
        const reagent = props.reagents.find(
            (r) => r.trayPosition === slotNumber,
        );
        const isUsed = !!reagent;
        const isSelected = props.selectedSlots.has(slotNumber);

        // Determine background color and border
        let backgroundColor: string;
        let borderColor: string | undefined;
        let borderWidth: number | undefined;
        let textColor: string;

        if (isSelected) {
            // Selected: green background, white text
            backgroundColor = '#089A26';
            textColor = '#FFFFFF';
        } else if (isUsed) {
            // Used in protocol: black with 40% opacity, white text
            backgroundColor = 'rgba(0, 0, 0, 0.4)';
            textColor = '#FFFFFF';
        } else {
            // Not used: white background, #1F2832 border and text
            backgroundColor = '#FFFFFF';
            borderColor = '#1F2832';
            borderWidth = 1;
            textColor = '#1F2832';
        }

        return (
            <TouchableOpacity
                key={`${row}-${col}`}
                style={[
                    {
                        width: props.slotSize,
                        height: props.slotSize,
                        margin: props.slotMargin / 2,
                        borderRadius: props.slotSize / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor,
                        borderColor,
                        borderWidth,
                    },
                ]}
                onPress={() => props.onSlotClick(slotNumber)}
                disabled={!isUsed}
            >
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: props.slotSize / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Txt
                        style={{
                            color: textColor,
                            fontSize: 14,
                            fontFamily: 'Roboto-bold',
                        }}
                    >
                        {slotNumber}
                    </Txt>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={s.trayContainer}>
            {Array(props.rows)
                .fill(null)
                .map((_, row) => (
                    <View key={row} style={s.trayRow}>
                        {Array(props.cols)
                            .fill(null)
                            .map((_, col) => renderSlot(row, col))}
                    </View>
                ))}
        </View>
    );
}

// Table component for reagent display (S and M sections only, no Washing)
function Table(props: {
    config: { x: number; y: number };
    color: string;
    reagents: ReagentInfo[];
    startIndex: number;
    slots: number;
    title: string;
    selectedCells: Set<number>;
    onCellClick: (cellIndex: number) => void;
    highlightedCell?: number;
}) {
    return (
        <View style={s.table}>
            <View style={s.table_title}>
                <Txt style={s.title_text}>{props.title}</Txt>
            </View>
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
                                        row_index * props.config.x + col_index;
                                    const reagentIndex =
                                        props.startIndex + cellIndex;
                                    const reagent =
                                        reagentIndex < props.reagents.length
                                            ? props.reagents[reagentIndex]
                                            : null;

                                    const isSelected =
                                        reagent &&
                                        props.selectedCells.has(cellIndex);
                                    const isHighlighted =
                                        props.highlightedCell === cellIndex;

                                    return (
                                        <TouchableOpacity
                                            key={col_index}
                                            style={[
                                                s.cell,
                                                {
                                                    backgroundColor:
                                                        props.color,
                                                },
                                                (isSelected ||
                                                    isHighlighted) && {
                                                    borderWidth: 4,
                                                    borderColor:
                                                        AppStyles.color
                                                            .elem_back,
                                                },
                                            ]}
                                            onPress={() =>
                                                reagent &&
                                                props.onCellClick(cellIndex)
                                            }
                                            disabled={!reagent}
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
                                                        {reagent.volumePerCell
                                                            ? reagent.volumePerCell.toFixed(
                                                                  2,
                                                              ) + ' ml'
                                                            : '---'}
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
                                        </TouchableOpacity>
                                    );
                                })}
                        </View>
                    );
                })}
        </View>
    );
}

export function ReagentTrayStep(props: {
    slots: number;
    protocolId?: number;
    onSelectionChange?: (allSelected: boolean) => void;
}) {
    const table_config = CARTRIDGE_CONFIG;
    const [reagents, setReagents] = useState<ReagentInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlotsS, setSelectedSlotsS] = useState<Set<number>>(
        new Set(),
    );
    const [selectedSlotsM, setSelectedSlotsM] = useState<Set<number>>(
        new Set(),
    );

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
            if ('data' in response) {
                const protocol = response.data;

                const reagentUsage = new Map<
                    string,
                    { name: string; usage: number; type: string }
                >();

                // Go through each step and find liquid steps (exclude washing)
                const allSteps =
                    protocol.stepBatches?.flatMap(
                        (batch: any) => batch.steps,
                    ) || [];
                allSteps.forEach((step: any) => {
                    if (step.type === StepType.REAGENT) {
                        const reagentStep = step.params as ReagentStep;
                        const liquidName = reagentStep.liquid.name;
                        const typeName = reagentStep.liquid.type.name;

                        // Skip washing liquids
                        if (typeName === 'Washing') return;

                        const stepUsage = 1;

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

                const reagentsList = Array.from(reagentUsage.values());
                setReagents(reagentsList);
            }
        } catch (error) {
            console.error('Error loading reagents:', error);
        } finally {
            setLoading(false);
        }
    };

    // Distribute reagents between S and M sections
    const { smallReagents, mediumReagents } = useMemo(() => {
        const small: ReagentInfo[] = [];
        const medium: ReagentInfo[] = [];
        let trayPositionS = 1; // S section: positions 1-32
        let trayPositionM = 33; // M section: positions 33-52

        reagents.forEach((reagent) => {
            const totalVolume = reagent.usage * props.slots * 0.25;

            if (totalVolume <= 2) {
                // S section
                small.push({
                    ...reagent,
                    cells: 1,
                    volumePerCell: totalVolume,
                    trayPosition: trayPositionS++,
                });
            } else {
                // Distribute between M and S sections
                let remainingVolume = totalVolume;

                // M section
                while (remainingVolume > 2) {
                    const volumeForMCell = Math.min(remainingVolume, 5);
                    medium.push({
                        ...reagent,
                        name: reagent.name,
                        cells: Math.ceil(totalVolume / 5),
                        volumePerCell: volumeForMCell,
                        trayPosition: trayPositionM++,
                    });
                    remainingVolume -= volumeForMCell;
                }

                // Remaining in S section
                if (remainingVolume > 0 && remainingVolume <= 2) {
                    small.push({
                        ...reagent,
                        name: reagent.name,
                        cells: 1,
                        volumePerCell: remainingVolume,
                        trayPosition: trayPositionS++,
                    });
                }
            }
        });

        return { smallReagents: small, mediumReagents: medium };
    }, [reagents, props.slots]);

    const handleTraySlotClick = (section: 'S' | 'M', position: number) => {
        const selectedSlots = section === 'S' ? selectedSlotsS : selectedSlotsM;
        const setSelectedSlots =
            section === 'S' ? setSelectedSlotsS : setSelectedSlotsM;

        const isCurrentlySelected = selectedSlots.has(position);
        const newSelected = new Set(selectedSlots);
        if (isCurrentlySelected) {
            newSelected.delete(position);
        } else {
            newSelected.add(position);
        }
        setSelectedSlots(newSelected);
    };

    const handleTableCellClick = (section: 'S' | 'M', cellIndex: number) => {
        const reagent =
            section === 'S'
                ? smallReagents[cellIndex]
                : mediumReagents[cellIndex];
        const selectedSlots = section === 'S' ? selectedSlotsS : selectedSlotsM;
        const setSelectedSlots =
            section === 'S' ? setSelectedSlotsS : setSelectedSlotsM;

        if (reagent && reagent.trayPosition) {
            const isCurrentlySelected = selectedSlots.has(reagent.trayPosition);
            // Toggle selection
            const newSelected = new Set(selectedSlots);
            if (isCurrentlySelected) {
                newSelected.delete(reagent.trayPosition);
            } else {
                newSelected.add(reagent.trayPosition);
            }
            setSelectedSlots(newSelected);
        }
    };

    const allReagentsWithTrayPos = [...smallReagents, ...mediumReagents];

    // Check if all required slots are selected
    useEffect(() => {
        if (props.onSelectionChange && allReagentsWithTrayPos.length > 0) {
            const allRequiredPositions = allReagentsWithTrayPos
                .filter((r) => r.trayPosition)
                .map((r) => r.trayPosition!);

            const allSelected = allRequiredPositions.every(
                (pos) => selectedSlotsS.has(pos) || selectedSlotsM.has(pos),
            );

            props.onSelectionChange(allSelected);
        }
    }, [selectedSlotsS, selectedSlotsM, allReagentsWithTrayPos]);

    // Calculate which table cells should show white border (selected cells)
    const selectedCellsS = new Set<number>(
        smallReagents
            .filter((r) => r.trayPosition && selectedSlotsS.has(r.trayPosition))
            .map((r) => smallReagents.indexOf(r)),
    );
    const selectedCellsM = new Set<number>(
        mediumReagents
            .filter((r) => r.trayPosition && selectedSlotsM.has(r.trayPosition))
            .map((r) => mediumReagents.indexOf(r)),
    );

    return (
        <HStack flex={1} gap={15} padding="$4">
            {/* Left panel: Instructions + Tray */}
            <VStack flex={0.5} space="md">
                {/* Instructions */}
                <Box
                    backgroundColor={AppStyles.color.primary_faded}
                    padding="$4"
                    borderRadius="$lg"
                >
                    <Txt
                        style={{
                            fontSize: 20,
                            fontFamily: 'Roboto-bold',
                            marginBottom: 5,
                        }}
                    >
                        Add Reagents
                    </Txt>
                    <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                        1. Open tray with reagents
                    </Txt>
                    <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                        2. Insert exact reagents as per their numbers into the
                        tray
                    </Txt>
                    <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                        3. Mark each inserted reagent in checkbox
                    </Txt>
                    <Txt style={{ fontSize: 14, lineHeight: 20 }}>
                        4. When done, close the tray with reagents
                    </Txt>
                </Box>

                {/* Trays */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center' }}
                >
                    <HStack space="mg">
                        <ReagentTray
                            reagents={smallReagents}
                            selectedSlots={selectedSlotsS}
                            onSlotClick={(pos) => handleTraySlotClick('S', pos)}
                            rows={table_config.size_S.y}
                            cols={table_config.size_S.x}
                            color="#FFFFFF"
                            slotSize={30}
                            slotMargin={4.23}
                            startNumber={1}
                        />
                        <ReagentTray
                            reagents={mediumReagents}
                            selectedSlots={selectedSlotsM}
                            onSlotClick={(pos) => handleTraySlotClick('M', pos)}
                            rows={table_config.size_M.y}
                            cols={table_config.size_M.x}
                            color={AppStyles.color.secondary}
                            slotSize={45}
                            slotMargin={5}
                            startNumber={33}
                        />
                    </HStack>
                </ScrollView>
            </VStack>

            {/* Right panel: Reagent tables (S and M sections only) */}
            <Box flex={1}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                >
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        persistentScrollbar={true}
                        contentContainerStyle={{ alignItems: 'flex-start' }}
                        nestedScrollEnabled={true}
                    >
                        <Table
                            config={table_config.size_S}
                            color={AppStyles.color.primary}
                            reagents={smallReagents}
                            startIndex={0}
                            slots={props.slots}
                            title="S section"
                            selectedCells={selectedCellsS}
                            onCellClick={(cellIndex) =>
                                handleTableCellClick('S', cellIndex)
                            }
                            highlightedCell={undefined}
                        />
                        <Table
                            config={table_config.size_M}
                            color={AppStyles.color.secondary}
                            reagents={mediumReagents}
                            startIndex={0}
                            slots={props.slots}
                            title="M section"
                            selectedCells={selectedCellsM}
                            onCellClick={(cellIndex) =>
                                handleTableCellClick('M', cellIndex)
                            }
                            highlightedCell={undefined}
                        />
                    </ScrollView>
                </ScrollView>
            </Box>
        </HStack>
    );
}

const s = StyleSheet.create({
    // Tray styles
    trayContainer: {
        padding: 8,
        marginBottom: 8,
    },
    trayRow: {
        flexDirection: 'row',
    },
    traySlot: {
        width: 40,
        height: 40,
        margin: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    traySlotInner: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Table styles
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
        alignItems: 'center',
        justifyContent: 'center',
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
