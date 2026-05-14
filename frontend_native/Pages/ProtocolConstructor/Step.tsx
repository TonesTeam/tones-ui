import { HStack, Text, Icon, Box, Pressable } from '@gluestack-ui/themed';
import { StepDTO } from 'common/dto/step.dto';
import {
    Clock,
    X,
    FlaskConical,
    AlignJustify,
    Thermometer,
    Droplet,
    Repeat,
} from 'lucide-react-native';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { formatDuration } from '../../common/util';

interface StepProps {
    key: number;
    index: number;
    step: StepDTO;
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    allStepGroups: StepGroupWithStepsDTO[];
    stepGroupSequenceNumber: number;
    type: 'liquid' | 'wash' | 'cooling' | 'heating';
    liquidMap?: Map<number, string>;
}

const Step = ({
    index,
    step,
    setStepGroups,
    allStepGroups,
    stepGroupSequenceNumber,
    type,
    liquidMap,
}: StepProps) => {
    const trimLiquidName = (name: string) => {
        const trimThreshold = 13;
        if (name.length > trimThreshold) {
            return name.substring(0, trimThreshold) + '...';
        }
        return name;
    };

    let stepName = '';
    let icon = null;
    let iterations = 0;
    let incubationTime = 0;
    let color = 'black';
    let temperature = 0;
    let automaticStep = false;

    switch (type) {
        case 'liquid':
            stepName =
                trimLiquidName(liquidMap?.get(step.applied_liquid_id)) ||
                'Unknown Liquid';
            icon = FlaskConical;
            iterations = step.iterations || 0;
            incubationTime = step.incubation_time || 0;
            color = 'black';
            temperature = step.target_temperature || 0;
            automaticStep = false;
            break;
        case 'wash':
            stepName = 'Washing';
            icon = Droplet;
            iterations = step.washing_iterations || 0;
            incubationTime = step.single_wash_duration || 0;
            color = '#1193CF';
            temperature = 25;
            automaticStep = true;
            break;
        case 'cooling':
            stepName = 'Cooling';
            icon = Thermometer;
            incubationTime = 60 * 7;
            color = '#0D26B0';
            temperature = step.target_temperature || 0;
            automaticStep = true;
            break;
        case 'heating':
            stepName = 'Heating';
            icon = Thermometer;
            incubationTime = 60 * 7;
            color = '#BE0707';
            temperature = 25;
            automaticStep = true;
            break;
    }

    return (
        <HStack gap={8} alignItems="center" width="100%">
            <Box>
                <Icon as={AlignJustify} opacity={0.6} size={20} />
            </Box>
            <HStack
                flex={1}
                height={50}
                bg={automaticStep ? '#F0F0F0' : '#FFFFFF'}
                width="92%"
                borderRadius={12}
                alignItems="center"
                px={16}
            >
                <Text color="black" fontSize={12} flex={0.7}>
                    #{index}
                </Text>
                <HStack justifyContent="center" flex={3}>
                    <Icon as={icon} color={color} size={16} />
                    <Text color={color} fontSize={12} ml={6}>
                        {stepName}
                    </Text>
                </HStack>
                <HStack flex={3} justifyContent="center" alignItems="center">
                    <Icon as={Clock} size={16} />
                    <Text color="black" fontSize={12} ml={6}>
                        {formatDuration(incubationTime)}
                    </Text>
                </HStack>
                <HStack flex={2} justifyContent="center" alignItems="center">
                    <Icon as={Thermometer} size={16} />
                    <Text color="black" fontSize={12} ml={6}>
                        {temperature} °C
                    </Text>
                </HStack>
                {iterations > 1 ? (
                    <HStack
                        flex={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Icon as={Repeat} size={16} />
                        <Text color="black" fontSize={12} ml={6}>
                            {iterations}
                        </Text>
                    </HStack>
                ) : (
                    <Box flex={2}></Box>
                )}
                {type == 'liquid' ? (
                    <Pressable
                        onPress={() => {
                            const updatedStepGroups = allStepGroups.map(
                                (group) => {
                                    if (
                                        group.step_group.sequence_number ===
                                        stepGroupSequenceNumber
                                    ) {
                                        return {
                                            ...group,
                                            steps: group.steps.filter(
                                                (s) =>
                                                    s.sequence_number !==
                                                    step.sequence_number,
                                            ),
                                        };
                                    }
                                    return group;
                                },
                            );
                            setStepGroups(updatedStepGroups);
                        }}
                    >
                        <Icon as={X} />
                    </Pressable>
                ) : (
                    <Box flex={0.5}></Box>
                )}
            </HStack>
        </HStack>
    );
};

export default Step;
