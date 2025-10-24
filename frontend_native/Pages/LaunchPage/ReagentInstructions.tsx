import { AppStyles } from '../../constants/styles';
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

export interface InstructionReagent {
    name: string;
    volume: number;
    cells?: number;
}

export interface ReagentInstruction {
    table: string;
    reagents: InstructionReagent[];
    color: string;
}

interface ReagentInstructionsProps {
    instructions: ReagentInstruction[];
    loading: boolean;
    protocolId?: number;
}

export function ReagentInstructions({ instructions, loading, protocolId }: ReagentInstructionsProps) {
    return (
        <Box 
            width={270} 
            backgroundColor="$backgroundLight0" 
            borderRightWidth={2} 
            borderRightColor="$borderLight300"
        >
            <Box 
                backgroundColor="$primary600" 
                paddingVertical="$4" 
                paddingHorizontal="$5" 
                alignItems="center"
            >
                <Heading size="lg" color="$white">
                    Reagent Stand Setup
                </Heading>
            </Box>
            
            {/* Main content area with instructions */}
            <ScrollView 
                flex={1} 
                paddingHorizontal="$4" 
                paddingVertical="$3"
                showsVerticalScrollIndicator={true}
            >
                <VStack space="lg">
                    {loading ? (
                        <Text textAlign="center" color="$textLight400" marginTop="$5">
                            Loading instructions...
                        </Text>
                    ) : instructions.length > 0 ? (
                        <>
                            <Box 
                                backgroundColor="$backgroundLight50" 
                                borderRadius="$md" 
                                padding="$4"
                                borderLeftWidth={4}
                                borderLeftColor="$primary500"
                            >
                                <VStack space="sm">
                                    <Text fontSize="$md" fontWeight="$bold" color="$primary700">
                                        Instructions:
                                    </Text>
                                    <Text fontSize="$sm" color="$textLight700">
                                        1. Select number of slots to use (top right corner)
                                    </Text>
                                    <Text fontSize="$sm" color="$textLight700">
                                        2. The tables represent the physical reagent tray
                                    </Text>
                                    <Text fontSize="$sm" color="$textLight700">
                                        3. Fill tubes with reagents as shown and place them in corresponding positions
                                    </Text>
                                    <Text fontSize="$sm" color="$textLight700">
                                        4. Match tube positions exactly as displayed on screen
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Instructions for each reagent section (S, M, Washing) */}
                            {instructions.map((instruction, tableIndex) => (
                                <Box key={tableIndex}>
                                    {/* Section title */}
                                    <Heading size="md" color="$textLight900" marginBottom="$3">
                                        {instruction.table}
                                    </Heading>

                                    {instruction.table === "Washing liquid" && (
                                        <Text fontSize="$sm" color="$textLight500" fontStyle="italic" marginBottom="$3">
                                            Ensure that washing liquids are at least half full. Minimal needed amount of washing liquid is {instruction.reagents[0]?.volume.toFixed(2)} ml.
                                        </Text>
                                    )}
                                    
                                    {/* List of reagents in this section */}
                                    <VStack space="sm">
                                        {instruction.reagents.map((reagent, index) => (
                                            <Box 
                                                key={index}
                                                backgroundColor="$backgroundLight50"
                                                borderRadius="$md"
                                                padding="$3"
                                                borderWidth={1}
                                                borderColor="$borderLight200"
                                            >
                                                <VStack space="xs">
                                                    <HStack justifyContent="space-between" alignItems="center">
                                                        <Text 
                                                            fontWeight="$bold" 
                                                            fontSize="$sm" 
                                                            color="$textLight900"
                                                            flex={1}
                                                            numberOfLines={2}
                                                        >
                                                            {reagent.name}
                                                        </Text>
                                                        
                                                        <Badge 
                                                            size="sm" 
                                                            variant="solid" 
                                                            backgroundColor={instruction.color}
                                                        >
                                                            <BadgeText color="$white" fontSize="$xs">
                                                                {reagent.volume.toFixed(2)} ml
                                                            </BadgeText>
                                                        </Badge>
                                                    </HStack>
                                                    
                                                    <Text fontSize="$xs" color="$textLight600">
                                                        {reagent.cells && reagent.cells > 1 
                                                            ? `Fill ${reagent.cells} tubes (${(reagent.volume / reagent.cells).toFixed(2)} ml each)`
                                                            : "Fill 1 tube"
                                                        }
                                                    </Text>
                                                </VStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                    
                                    {tableIndex < instructions.length - 1 && <Divider marginVertical="$4" />}
                                </Box>
                            ))}
                        </>
                    ) : (
                        <Text 
                            textAlign="center" 
                            color="$textLight400" 
                            marginTop="$5"
                            fontStyle="italic"
                        >
                            {protocolId ? 'No reagents found in protocol' : 'No protocol selected'}
                        </Text>
                    )}
                </VStack>
            </ScrollView>
        </Box>
    );
}