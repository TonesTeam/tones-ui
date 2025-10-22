import { View, StyleSheet, ScrollView as RNScrollView } from 'react-native';
import Txt from '../../components/Txt';
import { CARTRIDGE_CONFIG } from '../../common/cartridgeConfig';
import { AppStyles } from '../../constants/styles';
import { StyleProps } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getRequest } from '../../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { StepDTO, ReagentStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { 
    Box, 
    VStack, 
    HStack, 
    Text, 
    ScrollView, 
    Heading,
    Badge,
    BadgeText,
    Divider
} from '@gluestack-ui/themed';
import { ReagentInstructions, ReagentInstruction } from './ReagentInstructions';

interface ReagentInfo {
    name: string;
    usage: number;
    type: string;
}
function ReagentsList(props: { protocolId?: number; slots: number }) {
    const [reagents, setReagents] = useState<ReagentInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [defaultWashingBuffer, setDefaultWashingBuffer] = useState<string>("---");
    const [defaultWashingIterations, setDefaultWashingIterations] = useState<number>(3);

    // Load reagents when protocol or slots change
    useEffect(() => {
        if (props.protocolId) {
            loadReagents();
        }
    }, [props.protocolId, props.slots]);

    const loadReagents = async () => {
        setLoading(true);
        try {
            const response = await getRequest<ProtocolWithStepsDTO>(`/protocol/${props.protocolId}`);
            const protocol = response.data;
            
            // Save default washing buffer name from protocol
            setDefaultWashingBuffer(protocol.defaultWash.liquid.name);
            setDefaultWashingIterations(protocol.defaultWash.iters);
            
            const reagentUsage = new Map<string, { name: string; usage: number; type: string }>();
            
            // Process each protocol step to extract liquid application steps
            protocol.steps.forEach((step: any) => {
                if (step.type === StepType.LIQUID_APPL) {
                    const reagentStep = step.params as ReagentStep;
                    const liquidName = reagentStep.liquid.name;
                    const typeName = reagentStep.liquid.type.name;
                    const stepUsage = reagentStep.iters || 1;
                    
                    // Accumulate usage for each reagent
                    if (reagentUsage.has(liquidName)) {
                        reagentUsage.get(liquidName)!.usage += stepUsage;
                    } else {
                        reagentUsage.set(liquidName, { 
                            name: liquidName, 
                            usage: stepUsage, 
                            type: typeName 
                        });
                    }
                }
            });

            const reagentsList = Array.from(reagentUsage.values());
            setReagents(reagentsList);
        } catch (error) {
            console.error('Error loading reagents:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInstructions = (): ReagentInstruction[] => {
        if (reagents.length === 0) return [];

        const instructions: ReagentInstruction[] = [];

        // Filter out washing liquids first (they go to L section)
        const nonWashingReagents = reagents.filter(r => r.type !== "Washing");
        const washingReagents = reagents.filter(r => r.type === "Washing");

        const smallReagents = nonWashingReagents
            .map(r => ({ ...r, volume: r.usage * props.slots * 0.25 }))
            .filter(r => r.volume < 2);

        if (smallReagents.length > 0) {
            instructions.push({
                table: "S section",
                reagents: smallReagents.map(r => ({ name: r.name, volume: r.volume })),
                color: AppStyles.color.primary
            });
        }

        const mediumReagents = nonWashingReagents
            .map(r => ({ ...r, volume: r.usage * props.slots * 0.25 }))
            .filter(r => r.volume >= 2 && r.volume <= 50);

        if (mediumReagents.length > 0) {
            instructions.push({
                table: "M section",
                reagents: mediumReagents.map(r => {
                    // Calculate number of tubes needed for larger volumes
                    const cells = r.volume > 5 ? Math.ceil(r.volume / 5) : 1;
                    return { name: r.name, volume: r.volume, cells };
                }),
                color: AppStyles.color.secondary
            });
        }
        
        // Always add washing liquid section
        const washingInstructions: { name: string; volume: number; cells?: number }[] = [];
        
        washingReagents.forEach(r => {
            const volume = r.usage * props.slots * 0.25;
            washingInstructions.push({ name: r.name, volume, cells: 1 });
        });

        if (washingReagents.length === 0) {
            const volume = props.slots * defaultWashingIterations * 0.25; 
            washingInstructions.push({ name: defaultWashingBuffer, volume, cells: 1 });
        }

        instructions.push({
            table: "Washing liquid",
            reagents: washingInstructions,
            color: AppStyles.color.block.main_temperature
        });

        return instructions;
    };

    const instructions = getInstructions();

    return (
        <ReagentInstructions 
            instructions={instructions}
            loading={loading}
            protocolId={props.protocolId}
        />
    );
}

function Table(props: {
    config: { x: number; y: number };
    color: string;
    letterOffset: number;
    reagents?: ReagentInfo[];
    startIndex?: number;
}) {
    return (
        <View style={s.table}>
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
                                    {String.fromCharCode(
                                        header_index +
                                            props.letterOffset +
                                            'A'.charCodeAt(0),
                                    )}
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
                                    const cellIndex = col_index * props.config.y + row_index;
                                    const reagentIndex = (props.startIndex || 0) + cellIndex;
                                    const reagent = props.reagents && reagentIndex < props.reagents.length 
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
                                                <VStack space="xs" alignItems="center">
                                                    <Txt
                                                        style={{
                                                            color: AppStyles.color.background,
                                                            fontWeight: 'bold',
                                                            fontSize: 12,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {reagent.name}
                                                    </Txt>
                                                    <Txt
                                                        style={{
                                                            color: AppStyles.color.background,
                                                            fontSize: 10,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {(reagent.usage * 0.25).toFixed(2)} ml
                                                    </Txt>
                                                </VStack>
                                            ) : (
                                                <Txt
                                                    style={{
                                                        color: AppStyles.color.background,
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

/**
 * Main component combining reagent instructions and visual table representation
 * Left panel: Instructions for reagent preparation
 * Right panel: Visual representation of physical robot stand
 */
export function LiquidTable(props: { slots: number; protocolId?: number }) {
    const table_config = CARTRIDGE_CONFIG;
    const [reagents, setReagents] = useState<ReagentInfo[]>([]);
    const [defaultWashingBuffer, setDefaultWashingBuffer] = useState<string>("---");
    const [defaultWashingIterations, setDefaultWashingIterations] = useState<number>(3);

    useEffect(() => {
        if (props.protocolId) {
            loadReagents();
        }
    }, [props.protocolId, props.slots]);

    /**
     * Load and process reagent data from protocol
     * Similar to ReagentsList but used for table display
     */
    const loadReagents = async () => {
        try {
            const response = await getRequest<ProtocolWithStepsDTO>(`/protocol/${props.protocolId}`);
            const protocol = response.data;
            
            setDefaultWashingBuffer(protocol.defaultWash.liquid.name);
            setDefaultWashingIterations(protocol.defaultWash.iters);
            
            const reagentUsage = new Map<string, { name: string; usage: number; type: string }>();
            
            protocol.steps.forEach((step: any) => {
                if (step.type === StepType.LIQUID_APPL) {
                    const reagentStep = step.params as ReagentStep;
                    const liquidName = reagentStep.liquid.name;
                    const typeName = reagentStep.liquid.type.name;
                    const stepUsage = reagentStep.iters || 1;
                    
                    if (reagentUsage.has(liquidName)) {
                        reagentUsage.get(liquidName)!.usage += stepUsage;
                    } else {
                        reagentUsage.set(liquidName, { 
                            name: liquidName, 
                            usage: stepUsage * props.slots, 
                            type: typeName 
                        });
                    }
                }
            });

            const reagentsList = Array.from(reagentUsage.values());
            setReagents(reagentsList);
        } catch (error) {
            console.error('Error loading reagents:', error);
        }
    };

    const sizeS_cells = table_config.size_S.x * table_config.size_S.y;
    const sizeM_cells = table_config.size_M.x * table_config.size_M.y;

    const washingFromProtocol = reagents.filter(r => r.type === "Washing");
    const defaultWashing = washingFromProtocol.length === 0 ? [{
        name: defaultWashingBuffer,
        usage: props.slots * defaultWashingIterations,
        type: "Washing"
    }] : [];
    const washingLiquid: ReagentInfo[] = [...washingFromProtocol, ...defaultWashing];

    const nonWashingReagents = reagents.filter(r => r.type !== "Washing");

    return (
        <HStack flex={1}>
            {/* Left panel: Reagent setup instructions */}
            <ReagentsList protocolId={props.protocolId} slots={props.slots} />
            
            {/* Right panel: Visual representation of reagent tables */}
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
                        contentContainerStyle={{ alignItems: 'center' }}
                        nestedScrollEnabled={true}
                    >
                        <Table
                            config={table_config.size_S}
                            letterOffset={0}
                            color={AppStyles.color.primary}
                            reagents={nonWashingReagents}
                            startIndex={0}
                        />
                        <Table
                            config={table_config.size_M}
                            letterOffset={table_config.size_S.x}
                            color={AppStyles.color.secondary}
                            reagents={nonWashingReagents}
                            startIndex={sizeS_cells}
                        />
                        <Table
                            config={table_config.size_L}
                            letterOffset={table_config.size_M.x + table_config.size_S.x}
                            color={AppStyles.color.block.main_temperature}
                            reagents={washingLiquid}
                            startIndex={0}
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
        justifyContent: 'center',
        overflow: 'hidden',
    },

    row: {
        flexDirection: 'row',
        height: 90,
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
        width: 170,
        backgroundColor: AppStyles.color.elem_back,
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
    },
});
