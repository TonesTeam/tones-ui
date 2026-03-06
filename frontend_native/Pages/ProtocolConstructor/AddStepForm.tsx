import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import {
    Box,
    Text,
    VStack,
    ButtonText,
    Button,
    ButtonIcon,
    HStack,
    Input,
    InputField,
    Icon,
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from '@gluestack-ui/themed';
import { useState, useEffect } from 'react';
import {
    X,
    FlaskConical,
    Plus,
    ChevronDown,
    Droplet,
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { makeRequest } from '../../common/util';
import { Method } from 'axios';
import { PermanentLiquidDTO } from 'common/dto/liquid.dto';
import { StepDTO } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import ConfirmationModal from '../../components/ConfirmationModal';

interface AddStepFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setActiveStepGroup: (sequenceNumber: number) => void;
    selectedWashingLiquid: number | null;
    setSelectedWashingLiquid: (id: number | null) => void;
    washingIncubationTime: number | null;
    setWashingIncubationTime: (time: number | null) => void;
}

const AddStepForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setActiveStepGroup,
    selectedWashingLiquid,
    setSelectedWashingLiquid,
    washingIncubationTime,
    setWashingIncubationTime,
}: AddStepFormProps) => {
    const [state, setState] = useState(
        'Select' as 'Select' | 'Add liquid' | 'Add washing' | 'Edit washing',
    );

    if (state === 'Select') {
        return (
            <SelectForm
                setFormState={setState}
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                setActiveStepGroup={setActiveStepGroup}
                selectedWashingLiquid={selectedWashingLiquid}
                washingIncubationTime={washingIncubationTime}
                liquids={[]}
            />
        );
    } else if (state === 'Add liquid') {
        return (
            <AddLiquidForm
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                activeStepGroup={activeStepGroup}
                setFormState={setState}
            />
        );
    } else if (state === 'Add washing') {
        return (
            <AddWashingForm
                selectedWashingLiquid={selectedWashingLiquid}
                setSelectedWashingLiquid={setSelectedWashingLiquid}
                washingIncubationTime={washingIncubationTime}
                setWashingIncubationTime={setWashingIncubationTime}
                setFormState={setState}
            />
        );
    } else {
        return (
            <EditWashingForm
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                activeStepGroup={activeStepGroup}
                selectedWashingLiquid={selectedWashingLiquid}
                washingIncubationTime={washingIncubationTime}
                setWashingIncubationTime={setWashingIncubationTime}
                setFormState={setState}
            />
        );
    }
};

interface SelectFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    setFormState: (
        state: 'Select' | 'Add liquid' | 'Add washing' | 'Edit washing',
    ) => void;
    setActiveStepGroup: (sequenceNumber: number) => void;
    selectedWashingLiquid?: number | null;
    washingIncubationTime?: number | null;
    liquids?: PermanentLiquidDTO[];
}

const SelectForm = ({
    stepGroups,
    setStepGroups,
    setFormState,
    setActiveStepGroup,
    selectedWashingLiquid,
    washingIncubationTime,
    liquids: externalLiquids,
}: SelectFormProps) => {
    const [liquids, setLiquids] = useState(
        externalLiquids || ([] as PermanentLiquidDTO[]),
    );
    const [showWashingRequiredModal, setShowWashingRequiredModal] =
        useState(false);

    useEffect(() => {
        if (!externalLiquids || externalLiquids.length === 0) {
            makeRequest('GET' as Method, '/liquids')
                .then((response) => {
                    setLiquids(response.data as PermanentLiquidDTO[]);
                })
                .catch((error) => {
                    console.error('Failed to fetch liquids', error);
                });
        }
    }, [externalLiquids]);

    const findNextSequenceNumber = () => {
        let biggest = 0;
        for (let stepGroup of stepGroups) {
            biggest = Math.max(biggest, stepGroup.step_group.sequence_number);
        }
        return biggest + 1;
    };

    return (
        <VStack height={300} alignItems="center" gap={40}>
            {selectedWashingLiquid && liquids ? (
                <HStack
                    width={250}
                    height={44}
                    borderRadius={7}
                    alignItems="center"
                    justifyContent="center"
                    bg="#f0f0f0"
                    px={16}
                >
                    <Icon as={Droplet} size={16} color="black" mr={8} />
                    <Text
                        fontSize={14}
                        color="black"
                        fontFamily="Manrope-SemiBold"
                    >
                        Selected washing:{' '}
                        {liquids.find((l) => l.id === selectedWashingLiquid)
                            ?.name || 'Unknown'}
                    </Text>
                </HStack>
            ) : (
                <Button
                    bg="transparent"
                    width={250}
                    height={44}
                    style={{ borderStyle: 'dashed' }}
                    borderWidth={1}
                    borderColor="rgba(0, 0, 0, 0.3)"
                    borderRadius={7}
                    onPress={() => {
                        setFormState('Add washing');
                    }}
                >
                    <ButtonText fontSize={16} color="black">
                        Select washing
                    </ButtonText>
                    <ButtonIcon as={Droplet} size={15} color="black" ml="$3" />
                </Button>
            )}
            <Text fontSize={16} opacity={0.5} color="black">
                Add to step:
            </Text>
            <Button
                bg="transparent"
                width={250}
                height={44}
                style={{ borderStyle: 'dashed' }}
                borderWidth={1}
                borderColor="rgba(0, 0, 0, 0.3)"
                borderRadius={7}
                onPress={() => {
                    let newSequenceNumber = findNextSequenceNumber();
                    setStepGroups([
                        ...stepGroups,
                        {
                            step_group: {
                                id: 1,
                                name: `Step Group ${stepGroups.length + 1}`,
                                protocol_id: 1,
                                sequence_number: newSequenceNumber,
                            },
                            steps: [],
                        },
                    ]);
                    setActiveStepGroup(newSequenceNumber);
                }}
            >
                <ButtonIcon as={Plus} size={20} color="black" mr="$1" />
                <ButtonText fontSize={16} color="black">
                    New step
                </ButtonText>
            </Button>
            <Button
                bg="transparent"
                width={250}
                height={44}
                style={{ borderStyle: 'dashed' }}
                borderWidth={1}
                borderColor="rgba(0, 0, 0, 0.3)"
                borderRadius={7}
                onPress={() => {
                    if (!selectedWashingLiquid) {
                        setShowWashingRequiredModal(true);
                    } else {
                        setFormState('Add liquid');
                    }
                }}
            >
                <ButtonIcon as={Plus} size={20} color="black" mr="$1" />
                <ButtonText fontSize={16} color="black">
                    Reagent
                </ButtonText>
                <ButtonIcon as={FlaskConical} size={15} color="black" ml="$3" />
            </Button>
            <Button
                bg="transparent"
                width={250}
                height={44}
                style={{ borderStyle: 'dashed' }}
                borderWidth={1}
                borderColor="rgba(0, 0, 0, 0.3)"
                borderRadius={7}
                onPress={() => {
                    if (!selectedWashingLiquid) {
                        setShowWashingRequiredModal(true);
                    } else {
                        setFormState('Edit washing');
                    }
                }}
                disabled={!selectedWashingLiquid}
            >
                <ButtonIcon
                    as={Plus}
                    size={20}
                    color={selectedWashingLiquid ? 'black' : 'rgba(0,0,0,0.3)'}
                    mr="$1"
                />
                <ButtonText
                    fontSize={16}
                    color={selectedWashingLiquid ? 'black' : 'rgba(0,0,0,0.3)'}
                >
                    Washing
                </ButtonText>
                <ButtonIcon
                    as={Droplet}
                    size={15}
                    color={selectedWashingLiquid ? 'black' : 'rgba(0,0,0,0.3)'}
                    ml="$3"
                />
            </Button>
            <ConfirmationModal
                isOpen={showWashingRequiredModal}
                onClose={() => setShowWashingRequiredModal(false)}
                headline="Washing Liquid Required"
                text="Please select a washing liquid first before adding reagents."
                actionButtonText="Select Washing"
                action={() => {
                    setShowWashingRequiredModal(false);
                    setFormState('Add washing');
                }}
            />
        </VStack>
    );
};

interface AddLiquidFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setFormState: (state: 'Select' | 'Add liquid' | 'Add washing') => void;
}

const AddLiquidForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setFormState,
}: AddLiquidFormProps) => {
    const [categories, setCategories] = useState(
        [] as { id: number; name: string }[],
    );
    const [liquids, setLiquids] = useState([] as PermanentLiquidDTO[]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null,
    );
    const [selectedLiquid, setSelectedLiquid] = useState<number | null>(null);
    const [incubationTime, setIncubationTime] = useState<string>('');
    const [targetTemperature, setTargetTemperature] = useState<string>('');
    const [washingIterations, setWashingIterations] = useState<string>('');

    const findNextSequenceNumberForSteps = (
        stepGroups: StepGroupWithStepsDTO[],
        activeStepGroup: number,
    ) => {
        const currentGroup = stepGroups.find(
            (sg) => sg.step_group.sequence_number === activeStepGroup,
        );
        if (!currentGroup) return 1;
        let biggest = 0;
        for (let step of currentGroup.steps) {
            biggest = Math.max(biggest, step.sequence_number);
        }
        return biggest + 1;
    };

    useEffect(() => {
        makeRequest('GET' as Method, '/liquids/types')
            .then((response) => {
                setCategories(response.data as { id: number; name: string }[]);
            })
            .catch((error) => {
                console.error('Failed to fetch liquid categories', error);
            });

        makeRequest('GET' as Method, '/liquids')
            .then((response) => {
                setLiquids(response.data as PermanentLiquidDTO[]);
            })
            .catch((error) => {
                console.error('Failed to fetch liquids', error);
            });
    }, []);

    return (
        <Box>
            <HStack
                mb={24}
                alignItems="center"
                borderBottomWidth={1}
                borderColor="rgba(0, 0, 0, 0.2)"
                height={48}
            >
                <Icon as={FlaskConical} size={16} color="black" mr="$1" />
                <Text fontSize={16} color="black">
                    Add Reagent
                </Text>
                <Box ml="auto">
                    <Pressable
                        onPress={() => {
                            setFormState('Select');
                        }}
                    >
                        <Icon as={X} size={24} color="black" />
                    </Pressable>
                </Box>
            </HStack>
            <VStack gap={8}>
                {/* Reagent category */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Category
                    </Text>
                    <Select
                        selectedValue={
                            selectedCategory
                                ? selectedCategory.toString()
                                : null
                        }
                        onValueChange={(value) =>
                            setSelectedCategory(parseInt(value))
                        }
                    >
                        <SelectTrigger
                            borderWidth={0}
                            bg="#F1F1F1"
                            height={48}
                            borderRadius={16}
                        >
                            <SelectInput placeholder="Select cateogry" />
                            <SelectIcon className="mr-3" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        label={category.name}
                                        value={category.id.toString()}
                                    />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>

                {/* Reagent */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Reagent name
                    </Text>
                    <Select
                        selectedValue={
                            selectedLiquid ? selectedLiquid.toString() : null
                        }
                        onValueChange={(value) =>
                            setSelectedLiquid(parseInt(value))
                        }
                    >
                        <SelectTrigger
                            borderWidth={0}
                            bg="#F1F1F1"
                            height={48}
                            borderRadius={16}
                        >
                            <SelectInput placeholder="Select reagent" />
                            <SelectIcon className="mr-3" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {liquids
                                    .filter(
                                        (liquid) =>
                                            !selectedCategory ||
                                            liquid.liquid_type_id ===
                                                selectedCategory,
                                    )
                                    .map((liquid) => (
                                        <SelectItem
                                            key={liquid.id}
                                            label={liquid.name}
                                            value={liquid.id.toString()}
                                        />
                                    ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>

                {/* Incubation time */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Incubation time (minutes)
                    </Text>
                    <Input
                        height={48}
                        borderRadius={16}
                        bg="#F1F1F1"
                        borderWidth={0}
                        value={incubationTime}
                        onChange={(e: any) =>
                            setIncubationTime(e.nativeEvent.text)
                        }
                    >
                        <InputField
                            color="black"
                            fontSize={16}
                            placeholder="Time in minutes"
                            keyboardType="numeric"
                            ml={16}
                        />
                    </Input>
                </VStack>

                {/* Target temperature */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Target temperature (degrees, celsius)
                    </Text>
                    <Input
                        height={48}
                        borderRadius={16}
                        bg="#F1F1F1"
                        borderWidth={0}
                        value={targetTemperature}
                        onChange={(e: any) =>
                            setTargetTemperature(e.nativeEvent.text)
                        }
                    >
                        <InputField
                            color="black"
                            fontSize={16}
                            placeholder="Degrees in celsius"
                            keyboardType="numeric"
                            ml={16}
                        />
                    </Input>
                </VStack>

                {/* Washing iterations */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Washing iterations
                    </Text>
                    <Input
                        height={48}
                        borderRadius={16}
                        bg="#F1F1F1"
                        borderWidth={0}
                        value={washingIterations}
                        onChange={(e: any) =>
                            setWashingIterations(e.nativeEvent.text)
                        }
                    >
                        <InputField
                            color="black"
                            fontSize={16}
                            placeholder="Number of iterations"
                            keyboardType="numeric"
                            ml={16}
                        />
                    </Input>
                </VStack>
            </VStack>
            <HStack gap={24} mt={30}>
                <Button
                    height={40}
                    width={95}
                    borderWidth={1}
                    borderColor="rgba(31, 40, 50, 0.2)"
                    borderRadius={999}
                    bg="transparent"
                >
                    <ButtonText
                        onPress={() => {
                            setFormState('Select');
                        }}
                        fontSize={14}
                        color="#1F2832"
                        fontFamily="Manrope-SemiBold"
                    >
                        Cancel
                    </ButtonText>
                </Button>
                <Button
                    bg={
                        selectedLiquid &&
                        incubationTime &&
                        targetTemperature &&
                        washingIterations
                            ? '#1F2832'
                            : '#CCCCCC'
                    }
                    height={40}
                    width={170}
                    borderRadius={999}
                    disabled={
                        !selectedLiquid ||
                        !incubationTime ||
                        !targetTemperature ||
                        !washingIterations
                    }
                >
                    <ButtonText
                        fontSize={14}
                        color="white"
                        fontFamily="Manrope-SemiBold"
                        onPress={() => {
                            if (
                                !selectedLiquid ||
                                !incubationTime ||
                                !targetTemperature ||
                                !washingIterations
                            )
                                return;
                            const newStep: StepDTO = {
                                id: Date.now(), // Temporary ID, replace with actual ID from backend
                                type: 'Liquid Application' as StepType,
                                applied_liquid_id: selectedLiquid!,
                                incubation_time: parseInt(incubationTime) * 60, // Convert minutes to seconds
                                targetTemperature: parseInt(targetTemperature),
                                iterations: 1,
                                washing_iterations: parseInt(washingIterations),
                                sequence_number: findNextSequenceNumberForSteps(
                                    stepGroups,
                                    activeStepGroup,
                                ),
                            };

                            const updatedStepGroups = stepGroups.map(
                                (stepGroup) => {
                                    if (
                                        stepGroup.step_group.sequence_number ===
                                        activeStepGroup
                                    ) {
                                        return {
                                            ...stepGroup,
                                            steps: [
                                                ...stepGroup.steps,
                                                newStep,
                                            ],
                                        };
                                    }
                                    return stepGroup;
                                },
                            );

                            setStepGroups(updatedStepGroups);
                            setFormState('Select');
                        }}
                    >
                        Add to step
                    </ButtonText>
                </Button>
            </HStack>
        </Box>
    );
};

interface AddWashingFormProps {
    selectedWashingLiquid: number | null;
    setSelectedWashingLiquid: (id: number | null) => void;
    washingIncubationTime: number | null;
    setWashingIncubationTime: (time: number | null) => void;
    setFormState: (state: 'Select' | 'Add liquid' | 'Add washing') => void;
}

const AddWashingForm = ({
    selectedWashingLiquid,
    setSelectedWashingLiquid,
    washingIncubationTime,
    setWashingIncubationTime,
    setFormState,
}: AddWashingFormProps) => {
    const [liquids, setLiquids] = useState([] as PermanentLiquidDTO[]);
    const [tempSelectedLiquid, setTempSelectedLiquid] = useState<number | null>(
        null,
    );
    const [tempIncubationTime, setTempIncubationTime] = useState<string>(
        washingIncubationTime ? (washingIncubationTime / 60).toString() : '',
    );
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        makeRequest('GET' as Method, '/liquids')
            .then((response) => {
                // Filter only washing liquids (Buffer type)
                const washingLiquids = (
                    response.data as PermanentLiquidDTO[]
                ).filter(
                    (liquid: PermanentLiquidDTO) =>
                        liquid.liquid_type_name === 'washing',
                );
                setLiquids(washingLiquids);
            })
            .catch((error) => {
                console.error('Failed to fetch liquids', error);
            });
    }, []);

    const selectedLiquidName = liquids.find(
        (l) => l.id === tempSelectedLiquid,
    )?.name;

    return (
        <Box>
            <HStack
                mb={24}
                alignItems="center"
                borderBottomWidth={1}
                borderColor="rgba(0, 0, 0, 0.2)"
                height={48}
            >
                <Icon as={Droplet} size={16} color="black" mr="$1" />
                <Text fontSize={16} color="black">
                    Select Washing Liquid
                </Text>
                <Box ml="auto">
                    <Pressable
                        onPress={() => {
                            setFormState('Select');
                        }}
                    >
                        <Icon as={X} size={24} color="black" />
                    </Pressable>
                </Box>
            </HStack>
            <VStack gap={8}>
                {/* Liquid name */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Washing Liquid
                    </Text>
                    <Select
                        selectedValue={
                            tempSelectedLiquid
                                ? tempSelectedLiquid.toString()
                                : null
                        }
                        onValueChange={(value) =>
                            setTempSelectedLiquid(parseInt(value))
                        }
                    >
                        <SelectTrigger
                            borderWidth={0}
                            bg="#F1F1F1"
                            height={48}
                            borderRadius={16}
                        >
                            <SelectInput placeholder="Select washing liquid" />
                            <SelectIcon className="mr-3" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {liquids.map((liquid) => (
                                    <SelectItem
                                        key={liquid.id}
                                        label={liquid.name}
                                        value={liquid.id.toString()}
                                    />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>
                {/* Incubation time */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Incubation Time (minutes)
                    </Text>
                    <Input
                        borderWidth={0}
                        bg="#F1F1F1"
                        height={48}
                        borderRadius={16}
                    >
                        <InputField
                            placeholder="Enter time in minutes"
                            value={tempIncubationTime}
                            onChangeText={setTempIncubationTime}
                            keyboardType="numeric"
                        />
                    </Input>
                </VStack>
            </VStack>
            <HStack gap={24} mt={30}>
                <Button
                    height={40}
                    width={95}
                    borderWidth={1}
                    borderColor="rgba(31, 40, 50, 0.2)"
                    borderRadius={999}
                    bg="transparent"
                >
                    <ButtonText
                        onPress={() => {
                            setFormState('Select');
                        }}
                        fontSize={14}
                        color="#1F2832"
                        fontFamily="Manrope-SemiBold"
                    >
                        Cancel
                    </ButtonText>
                </Button>
                <Button
                    bg={
                        tempSelectedLiquid && tempIncubationTime
                            ? '#1F2832'
                            : '#CCCCCC'
                    }
                    height={40}
                    width={170}
                    borderRadius={999}
                    disabled={!tempSelectedLiquid || !tempIncubationTime}
                >
                    <ButtonText
                        fontSize={14}
                        color="white"
                        fontFamily="Manrope-SemiBold"
                        onPress={() => {
                            if (!tempSelectedLiquid || !tempIncubationTime)
                                return;
                            setShowConfirmModal(true);
                        }}
                    >
                        Confirm
                    </ButtonText>
                </Button>
            </HStack>
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                headline="Set Washing Liquid"
                text={`Set "${selectedLiquidName}" as the washing liquid for this protocol? This cannot be changed later. You will have to create a new protocol. Time can be changed later in "+ Washing" `}
                actionButtonText="Confirm"
                action={() => {
                    setSelectedWashingLiquid(tempSelectedLiquid);
                    setWashingIncubationTime(parseInt(tempIncubationTime) * 60);
                    setShowConfirmModal(false);
                    setFormState('Select');
                }}
            />
        </Box>
    );
};

interface EditWashingFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    selectedWashingLiquid: number | null;
    washingIncubationTime: number | null;
    setWashingIncubationTime: (time: number | null) => void;
    setFormState: (
        state: 'Select' | 'Add liquid' | 'Add washing' | 'Edit washing',
    ) => void;
}

const EditWashingForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    selectedWashingLiquid,
    washingIncubationTime,
    setWashingIncubationTime,
    setFormState,
}: EditWashingFormProps) => {
    const [tempIncubationTime, setTempIncubationTime] = useState<string>(
        washingIncubationTime ? (washingIncubationTime / 60).toString() : '',
    );
    const [tempWashingIterations, setTempWashingIterations] =
        useState<string>('1');

    const findNextSequenceNumberForSteps = (
        stepGroups: StepGroupWithStepsDTO[],
        activeStepGroup: number,
    ) => {
        const currentGroup = stepGroups.find(
            (sg) => sg.step_group.sequence_number === activeStepGroup,
        );
        if (!currentGroup) return 1;
        let biggest = 0;
        for (let step of currentGroup.steps) {
            biggest = Math.max(biggest, step.sequence_number);
        }
        return biggest + 1;
    };

    return (
        <Box>
            <HStack
                mb={24}
                alignItems="center"
                borderBottomWidth={1}
                borderColor="rgba(0, 0, 0, 0.2)"
                height={48}
            >
                <Icon as={Droplet} size={16} color="black" mr="$1" />
                <Text fontSize={16} color="black">
                    Edit Washing
                </Text>
                <Box ml="auto">
                    <Pressable
                        onPress={() => {
                            setFormState('Select');
                        }}
                    >
                        <Icon as={X} size={24} color="black" />
                    </Pressable>
                </Box>
            </HStack>
            <VStack gap={8}>
                {/* Incubation time */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Incubation Time (minutes)
                    </Text>
                    <Input
                        borderWidth={0}
                        bg="#F1F1F1"
                        height={48}
                        borderRadius={16}
                    >
                        <InputField
                            placeholder="Enter time in minutes"
                            value={tempIncubationTime}
                            onChangeText={setTempIncubationTime}
                            keyboardType="numeric"
                        />
                    </Input>
                </VStack>
                {/* Washing iterations */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Washing Iterations
                    </Text>
                    <Input
                        borderWidth={0}
                        bg="#F1F1F1"
                        height={48}
                        borderRadius={16}
                    >
                        <InputField
                            placeholder="Number of iterations"
                            value={tempWashingIterations}
                            onChangeText={setTempWashingIterations}
                            keyboardType="numeric"
                        />
                    </Input>
                </VStack>
            </VStack>
            <HStack gap={24} mt={30}>
                <Button
                    height={40}
                    width={95}
                    borderWidth={1}
                    borderColor="rgba(31, 40, 50, 0.2)"
                    borderRadius={999}
                    bg="transparent"
                >
                    <ButtonText
                        onPress={() => {
                            setFormState('Select');
                        }}
                        fontSize={14}
                        color="#1F2832"
                        fontFamily="Manrope-SemiBold"
                    >
                        Cancel
                    </ButtonText>
                </Button>
                <Button
                    bg={
                        tempIncubationTime && tempWashingIterations
                            ? '#1F2832'
                            : '#CCCCCC'
                    }
                    height={40}
                    width={170}
                    borderRadius={999}
                    disabled={!tempIncubationTime || !tempWashingIterations}
                >
                    <ButtonText
                        fontSize={14}
                        color="white"
                        fontFamily="Manrope-SemiBold"
                        onPress={() => {
                            if (
                                !tempIncubationTime ||
                                !tempWashingIterations ||
                                !selectedWashingLiquid
                            )
                                return;
                            const newStep: StepDTO = {
                                id: Date.now(),
                                type: 'Washing' as StepType,
                                applied_liquid_id: selectedWashingLiquid,
                                incubation_time:
                                    parseInt(tempIncubationTime) * 60,
                                targetTemperature: 25,
                                iterations: parseInt(tempWashingIterations),
                                washing_iterations: parseInt(
                                    tempWashingIterations,
                                ),
                                sequence_number: findNextSequenceNumberForSteps(
                                    stepGroups,
                                    activeStepGroup,
                                ),
                            };

                            const updatedStepGroups = stepGroups.map(
                                (stepGroup) => {
                                    if (
                                        stepGroup.step_group.sequence_number ===
                                        activeStepGroup
                                    ) {
                                        return {
                                            ...stepGroup,
                                            steps: [
                                                ...stepGroup.steps,
                                                newStep,
                                            ],
                                        };
                                    }
                                    return stepGroup;
                                },
                            );

                            setStepGroups(updatedStepGroups);
                            setFormState('Select');
                        }}
                    >
                        Add Washing Step
                    </ButtonText>
                </Button>
            </HStack>
        </Box>
    );
};

export default AddStepForm;
