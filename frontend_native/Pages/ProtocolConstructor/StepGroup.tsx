import { useRef, useState, useEffect } from 'react';
import {
    HStack,
    Pressable,
    Icon,
    VStack,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { PanResponder } from 'react-native';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { Copy, Pencil, Trash } from 'lucide-react-native';
import SavePlusIcon from '../../assets/icons/save-plus.svg';
import Step from './Step';
import ConfirmationModal from '../../components/ConfirmationModal';

interface StepGroupProps {
    key: number;
    stepGroup: StepGroupWithStepsDTO;
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    allStepGroups: StepGroupWithStepsDTO[];
    activeStepGroup: number;
    setActiveStepGroup: (id: number) => void;
    liquidMap: Map<number, string>;
}

const StepGroup = ({
    stepGroup,
    setStepGroups,
    allStepGroups,
    activeStepGroup,
    setActiveStepGroup,
    liquidMap,
}: StepGroupProps) => {
    const inputRef = useRef<any>(null);
    const didReorderRef = useRef(false);
    const localStepsRef = useRef(stepGroup.steps);
    const stepRefs = useRef<Record<number, any>>({});
    const stepLayouts = useRef<Record<number, { top: number; height: number }>>(
        {},
    );
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [draggingStepId, setDraggingStepId] = useState<number | null>(null);
    const [localSteps, setLocalSteps] = useState(stepGroup.steps);

    useEffect(() => {
        if (isEditing) {
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [isEditing]);

    useEffect(() => {
        if (draggingStepId === null) {
            setLocalSteps(stepGroup.steps);
            localStepsRef.current = stepGroup.steps;
        }
    }, [stepGroup.steps, draggingStepId]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            localSteps.forEach((step) => {
                const node = stepRefs.current[step.id];
                if (node?.measureInWindow) {
                    node.measureInWindow(
                        (
                            _x: number,
                            y: number,
                            _width: number,
                            height: number,
                        ) => {
                            stepLayouts.current[step.id] = {
                                top: y,
                                height,
                            };
                        },
                    );
                }
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [localSteps, draggingStepId]);

    const moveStepWithinGroup = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }

        const normalizedTargetIndex = Math.max(0, toIndex);

        setLocalSteps((prevSteps) => {
            const maxIndex = prevSteps.length - 1;
            const targetIndex = Math.min(normalizedTargetIndex, maxIndex);

            if (fromIndex === targetIndex) {
                return prevSteps;
            }

            didReorderRef.current = true;
            const nextSteps = [...prevSteps];
            const [movedStep] = nextSteps.splice(fromIndex, 1);
            nextSteps.splice(targetIndex, 0, movedStep);
            localStepsRef.current = nextSteps;
            return nextSteps;
        });
    };

    const commitLocalOrder = () => {
        if (!didReorderRef.current) {
            return;
        }

        const committedSteps = localStepsRef.current.map((step, index) => ({
            ...step,
            sequence_number: index + 1,
        }));

        const updatedStepGroups = allStepGroups.map((group) => {
            if (
                group.step_group.sequence_number !==
                stepGroup.step_group.sequence_number
            ) {
                return group;
            }

            return {
                ...group,
                steps: committedSteps,
            };
        });

        setStepGroups(updatedStepGroups);
        didReorderRef.current = false;
    };

    const createDragHandlers = (stepId: number) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                didReorderRef.current = false;
                setDraggingStepId(stepId);
            },
            onPanResponderMove: (_event, gestureState) => {
                const currentSteps = localStepsRef.current;
                const currentIndex = currentSteps.findIndex(
                    (step) => step.id === stepId,
                );

                if (currentIndex < 0) {
                    return;
                }

                const remainingSteps = currentSteps.filter(
                    (step) => step.id !== stepId,
                );

                let destinationIndex = remainingSteps.length;

                for (let index = 0; index < remainingSteps.length; index += 1) {
                    const step = remainingSteps[index];
                    const layout = stepLayouts.current[step.id];

                    if (!layout) {
                        continue;
                    }

                    const reorderThreshold = layout.top + layout.height * 0.25;

                    if (gestureState.moveY < reorderThreshold) {
                        destinationIndex = index;
                        break;
                    }
                }

                moveStepWithinGroup(currentIndex, destinationIndex);
            },
            onPanResponderRelease: () => {
                commitLocalOrder();
                setDraggingStepId(null);
            },
            onPanResponderTerminate: () => {
                commitLocalOrder();
                setDraggingStepId(null);
            },
        }).panHandlers;

    console.log(
        `activeStepGroup: ${activeStepGroup}, stepGroupId: ${stepGroup.step_group.name}`,
    );

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
                                size={'lg'}
                            />
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                //!Add to store templates (step group) in step group library
                            }}
                        >
                            <Icon
                                as={SavePlusIcon}
                                opacity={0.7}
                                color="#1F2832"
                                size={'lg'}
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
                                size={'lg'}
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
                                size={'lg'}
                            />
                        </Pressable>
                    </HStack>
                </HStack>
            </Pressable>
            <VStack gap={8} mt={24}>
                {(() => {
                    let currentIndex = 1;

                    return localSteps.map((step) => {
                        const hasHeating = step.target_temperature > 25;
                        const hasCooling = step.target_temperature > 25;
                        const hasWash = step.washing_iterations > 0;
                        const dragHandleProps = createDragHandlers(step.id);
                        const isDragging = draggingStepId === step.id;
                        const heatingIndex = hasHeating ? currentIndex++ : null;
                        const liquidIndex = currentIndex++;
                        const coolingIndex = hasCooling ? currentIndex++ : null;
                        const washIndex = hasWash ? currentIndex++ : null;

                        return (
                            <VStack
                                key={`${stepGroup.step_group.sequence_number}-${step.id}-block`}
                                ref={(node) => {
                                    stepRefs.current[step.id] = node;
                                }}
                                onLayout={() => {
                                    const node = stepRefs.current[step.id];
                                    if (node?.measureInWindow) {
                                        node.measureInWindow(
                                            (
                                                _x: number,
                                                y: number,
                                                _width: number,
                                                height: number,
                                            ) => {
                                                stepLayouts.current[step.id] = {
                                                    top: y,
                                                    height,
                                                };
                                            },
                                        );
                                    }
                                }}
                                opacity={isDragging ? 0.7 : 1}
                            >
                                {hasHeating && (
                                    <Step
                                        key={`${stepGroup.step_group.sequence_number}-${step.id}-heating`}
                                        index={heatingIndex as number}
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
                                    key={`${stepGroup.step_group.sequence_number}-${step.id}-liquid`}
                                    index={liquidIndex}
                                    step={step}
                                    setStepGroups={setStepGroups}
                                    allStepGroups={allStepGroups}
                                    stepGroupSequenceNumber={
                                        stepGroup.step_group.sequence_number
                                    }
                                    type={'liquid'}
                                    liquidMap={liquidMap}
                                    dragHandleProps={dragHandleProps}
                                    isDragging={isDragging}
                                />
                                {hasCooling && (
                                    <Step
                                        key={`${stepGroup.step_group.sequence_number}-${step.id}-cooling`}
                                        index={coolingIndex as number}
                                        step={step}
                                        setStepGroups={setStepGroups}
                                        allStepGroups={allStepGroups}
                                        stepGroupSequenceNumber={
                                            stepGroup.step_group.sequence_number
                                        }
                                        type={'cooling'}
                                    />
                                )}
                                {hasWash && (
                                    <Step
                                        key={`${stepGroup.step_group.sequence_number}-${step.id}-wash`}
                                        index={washIndex as number}
                                        step={step}
                                        setStepGroups={setStepGroups}
                                        allStepGroups={allStepGroups}
                                        stepGroupSequenceNumber={
                                            stepGroup.step_group.sequence_number
                                        }
                                        type={'wash'}
                                    />
                                )}
                            </VStack>
                        );
                    });
                })()}
            </VStack>
        </VStack>
    );
};

export default StepGroup;
