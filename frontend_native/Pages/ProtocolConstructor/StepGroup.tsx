import { useRef, useState, useEffect } from 'react';
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
import ConfirmationModal from '../../components/ConfirmationModal';

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
    const inputRef = useRef<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (isEditing) {
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [isEditing]);

    console.log(
        `activeStepGroup: ${activeStepGroup}, stepGroupId: ${stepGroup.step_group.name}`,
    );

    let index = 0;
    return (
        <VStack>
            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => {
                    setDeleteModal(false);
                }}
                action={() => {
                    const updatedStepGroups = allStepGroups.filter(
                        (group) =>
                            group.step_group.sequence_number !==
                            stepGroup.step_group.sequence_number,
                    );
                    setStepGroups(updatedStepGroups);
                    if (updatedStepGroups.length > 0) {
                        // Find group with smaller sequence_number (previous step)
                        const previousGroup = updatedStepGroups
                            .filter(
                                (g) =>
                                    g.step_group.sequence_number <
                                    stepGroup.step_group.sequence_number,
                            )
                            .sort(
                                (a, b) =>
                                    b.step_group.sequence_number -
                                    a.step_group.sequence_number,
                            )[0];

                        // If no previous group exists, use the first available
                        const nextActiveGroup =
                            previousGroup || updatedStepGroups[0];
                        setActiveStepGroup(
                            nextActiveGroup.step_group.sequence_number,
                        );
                    }
                }}
                headline={`Delete step group "${stepGroup.step_group.name}"?`}
                text={`Are you sure you want to delete this step group? It has ${stepGroup.steps.length} steps. This action cannot be undone.`}
                actionButtonText="Delete"
            />
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
                    <Input
                        flex={1}
                        borderWidth={0}
                        width={300}
                        isReadOnly={!isEditing}
                    >
                        <InputField
                            ref={inputRef}
                            onFocus={() => {
                                setActiveStepGroup(
                                    stepGroup.step_group.sequence_number,
                                );
                            }}
                            onBlur={() => {
                                setIsEditing(false);
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
                        <Pressable
                            onPress={() => {
                                setActiveStepGroup(
                                    stepGroup.step_group.sequence_number,
                                );
                                setIsEditing(true);
                            }}
                        >
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
                                setDeleteModal(true);
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
                {stepGroup.steps.map((step) => {
                    console.log(
                        `Rendering step ${JSON.stringify(step)} of group ${stepGroup.step_group.name}`,
                    );
                    return (
                        <>
                            {step.target_temperature > 2500 && (
                                <Step
                                    key={index}
                                    index={++index}
                                    step={step}
                                    setStepGroups={setStepGroups}
                                    allStepGroups={allStepGroups}
                                    stepGroupSequenceNumber={
                                        stepGroup.step_group.sequence_number
                                    }
                                    type={'heating'}
                                />
                            )}
                            <Step
                                key={index}
                                index={++index}
                                step={step}
                                setStepGroups={setStepGroups}
                                allStepGroups={allStepGroups}
                                stepGroupSequenceNumber={
                                    stepGroup.step_group.sequence_number
                                }
                                type={'liquid'}
                            />
                            {step.target_temperature > 2500 && (
                                <Step
                                    key={index}
                                    index={++index}
                                    step={step}
                                    setStepGroups={setStepGroups}
                                    allStepGroups={allStepGroups}
                                    stepGroupSequenceNumber={
                                        stepGroup.step_group.sequence_number
                                    }
                                    type={'cooling'}
                                />
                            )}
                            {step.washing_iterations > 0 && (
                                <Step
                                    key={index}
                                    index={++index}
                                    step={step}
                                    setStepGroups={setStepGroups}
                                    allStepGroups={allStepGroups}
                                    stepGroupSequenceNumber={
                                        stepGroup.step_group.sequence_number
                                    }
                                    type={'wash'}
                                />
                            )}
                        </>
                    );
                })}
            </VStack>
        </VStack>
    );
};

export default StepGroup;
