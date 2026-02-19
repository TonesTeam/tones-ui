import {
    HStack,
    Text,
    Pressable,
    Icon,
    Box,
    VStack,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { StepDTO } from 'common/dto/step.dto';
import { Clock, Copy, FlaskConical, Pencil, Trash } from 'lucide-react-native';
import { AlignJustify } from 'lucide-react-native';

interface StepGroupProps {
    key: number;
    stepGroup: StepGroupWithStepsDTO;
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    allStepGroups: StepGroupWithStepsDTO[];
    activeStepGroup: number;
    setActiveStepGroup: (id: number) => void;
}

const StepGroup = ({
    stepGroup,
    setStepGroups,
    allStepGroups,
    activeStepGroup,
    setActiveStepGroup,
}: StepGroupProps) => {
    console.log(
        `activeStepGroup: ${activeStepGroup}, stepGroupId: ${stepGroup.step_group.name}`,
    );
    return (
        <VStack>
            <Pressable
                onPress={() =>
                    setActiveStepGroup(stepGroup.step_group.sequence_number)
                }
            >
                <HStack
                    width="100%"
                    borderBottomWidth={1}
                    borderBottomColor="rgba(0, 0, 0, 0.1)"
                    pb={16}
                    mt={30}
                    bg={
                        activeStepGroup === stepGroup.step_group.sequence_number
                            ? '#eeeeee'
                            : 'transparent'
                    }
                >
                    <Input flex={1} borderWidth={0} width={300}>
                        <InputField
                            onFocus={() => {
                                setActiveStepGroup(
                                    stepGroup.step_group.sequence_number,
                                );
                            }}
                            onChange={(e: any) => {
                                const updatedStepGroups = allStepGroups.map(
                                    (group) => {
                                        if (
                                            group.step_group.sequence_number ===
                                            stepGroup.step_group.sequence_number
                                        ) {
                                            return {
                                                ...group,
                                                step_group: {
                                                    ...group.step_group,
                                                    name: e.nativeEvent.text,
                                                },
                                            };
                                        }
                                        return group;
                                    },
                                );
                                setStepGroups(updatedStepGroups);
                            }}
                            value={stepGroup.step_group.name}
                            fontSize={24}
                            color="#1F2832"
                            fontFamily="Orbitron-Regular"
                            placeholder="Step group name"
                        />
                    </Input>
                    <HStack
                        ml="auto"
                        alignItems="center"
                        justifyContent="center"
                        gap={16}
                    >
                        <Pressable>
                            <Icon
                                as={Pencil}
                                opacity={0.7}
                                color="#1F2832"
                                size={21}
                            />
                        </Pressable>
                        <Pressable>
                            <Icon
                                as={Copy}
                                opacity={0.7}
                                color="#1F2832"
                                size={21}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                const updatedStepGroups = allStepGroups.filter(
                                    (group) =>
                                        group.step_group.sequence_number !==
                                        stepGroup.step_group.sequence_number,
                                );
                                setStepGroups(updatedStepGroups);
                            }}
                        >
                            <Icon
                                as={Trash}
                                opacity={0.7}
                                color="#1F2832"
                                size={21}
                            />
                        </Pressable>
                    </HStack>
                </HStack>
            </Pressable>
            <VStack gap={8} mt={24}>
                {stepGroup.steps.map((step, index) => {
                    console.log(
                        `Rendering step ${JSON.stringify(step)} of group ${stepGroup.step_group.name}`,
                    );
                    return <Step key={index} index={index + 1} step={step} />;
                })}
            </VStack>
        </VStack>
    );
};

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

export default StepGroup;
