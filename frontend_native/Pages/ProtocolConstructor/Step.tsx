import { HStack, Text, Icon, Box } from '@gluestack-ui/themed';
import { StepDTO } from 'common/dto/step.dto';
import { AlignJustify } from 'lucide-react-native';
import { Clock, Copy, FlaskConical, Pencil, Trash } from 'lucide-react-native';

interface StepProps {
    key: number;
    index: number;
    step: StepDTO;
}

const Step = ({ index, step }: StepProps) => {
    return (
        <HStack gap={4} alignItems="center" p={8} width="100%">
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
                <Text color="black" fontSize={12} flex={1}>
                    #{index}
                </Text>
                <Text
                    color="black"
                    fontSize={12}
                    justifyContent="center"
                    flex={3}
                >
                    <Icon as={FlaskConical} size={16} />
                    Reagent
                </Text>
                <Text color="black" fontSize={12} flex={3}>
                    <Icon as={Clock} size={16} />
                    {step.incubation_time}
                </Text>
                <Box flex={5}></Box>
            </HStack>
        </HStack>
    );
};

export default Step;
