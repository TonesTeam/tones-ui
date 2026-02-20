import { HStack, Text, Icon, Box } from '@gluestack-ui/themed';
import { StepDTO } from 'common/dto/step.dto';
import { AlignJustify, Thermometer } from 'lucide-react-native';
import { Clock, Copy, FlaskConical, Pencil, Trash } from 'lucide-react-native';

interface StepProps {
    key: number;
    index: number;
    step: StepDTO;
}

const Step = ({ index, step }: StepProps) => {
    return (
        <HStack gap={8} alignItems="center" width="100%">
            <Box>
                <Icon as={AlignJustify} opacity={0.6} size={20} />
            </Box>
            <HStack
                flex={1}
                height={50}
                bg="white"
                width="92%"
                borderRadius={12}
                alignItems="center"
                px={16}
            >
                <Text color="black" fontSize={12} flex={0.7}>
                    #{index}
                </Text>
                <HStack justifyContent="center" flex={3}>
                    <Icon as={FlaskConical} size={16} />
                    <Text color="black" fontSize={12} ml={6}>
                        Reagent
                    </Text>
                </HStack>
                <HStack flex={3} justifyContent="center" alignItems="center">
                    <Icon as={Clock} size={16} />
                    <Text color="black" fontSize={12} ml={6}>
                        {step.incubation_time / 60} minutes
                    </Text>
                </HStack>
                <HStack flex={2} justifyContent="center" alignItems="center">
                    <Icon as={Thermometer} size={16} />
                    <Text color="black" fontSize={12} ml={6}>
                        {step.targetTemperature} °C
                    </Text>
                </HStack>
                <Box flex={3}></Box>
            </HStack>
        </HStack>
    );
};

export default Step;
