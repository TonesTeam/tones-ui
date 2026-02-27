import {
    HStack,
    Pressable,
    Icon,
    VStack,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { Copy, Pencil, Trash } from 'lucide-react-native';
import Step from './Step';

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
                        <Pressable
                            onPress={() => {
                                const current_sn =
                                    stepGroup.step_group.sequence_number;
                                allStepGroups.forEach((group) => {
                                    if (
                                        group.step_group.sequence_number >
                                        current_sn
                                    ) {
                                        ++group.step_group.sequence_number;
                                    }
                                });

                                const newStepGroup: StepGroupWithStepsDTO = {
                                    step_group: {
                                        name: `${stepGroup.step_group.name} Copy`,
                                        id: 1,
                                        protocol_id: 1,
                                        sequence_number: current_sn + 1,
                                    },
                                    steps: stepGroup.steps,
                                };
                                console.log(
                                    `New step group: ${JSON.stringify(newStepGroup)}`,
                                );
                                setStepGroups(
                                    [...allStepGroups, newStepGroup].sort(
                                        (a, b) =>
                                            a.step_group.sequence_number -
                                            b.step_group.sequence_number,
                                    ),
                                );
                            }}
                        >
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
                    return (
                        <Step
                            key={index}
                            index={index + 1}
                            step={step}
                            setStepGroups={setStepGroups}
                            allStepGroups={allStepGroups}
                            stepGroupSequenceNumber={
                                stepGroup.step_group.sequence_number
                            }
                        />
                    );
                })}
            </VStack>
        </VStack>
    );
};

export default StepGroup;
