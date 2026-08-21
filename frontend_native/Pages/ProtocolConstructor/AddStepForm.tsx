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
import { StepType, isWashingLiquidCategory } from 'common/enums';

interface EditingStep {
    step: StepDTO;
    stepGroupSequenceNumber: number;
}

type FormState = 'Select' | 'Add liquid' | 'Add washing';

interface AddStepFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setActiveStepGroup: (sequenceNumber: number) => void;
    editingStep?: EditingStep | null;
    setEditingStep?: (editingStep: EditingStep | null) => void;
    liquidCategoryMap?: Map<number, string>;
}

const AddStepForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setActiveStepGroup,
    editingStep,
    setEditingStep,
    liquidCategoryMap,
}: AddStepFormProps) => {
    const [state, setState] = useState<FormState>('Select');

    useEffect(() => {
        if (editingStep) {
            const isWashing =
                editingStep.step.type === StepType.WASHING ||
                isWashingLiquidCategory(
                    liquidCategoryMap?.get(editingStep.step.applied_liquid_id),
                );
            setState(isWashing ? 'Add washing' : 'Add liquid');
        }
    }, [editingStep]);

    const closeForm = () => {
        setEditingStep?.(null);
        setState('Select');
    };

    if (state === 'Select') {
        return (
            <SelectForm
                setFormState={setState}
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                setActiveStepGroup={setActiveStepGroup}
            />
        );
    } else if (state === 'Add liquid') {
        return (
            <AddLiquidForm
                key={editingStep ? `edit-${editingStep.step.id}` : 'add'}
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                activeStepGroup={activeStepGroup}
                setFormState={closeForm}
                editingStep={editingStep || null}
            />
        );
    } else {
        return (
            <AddWashingForm
                key={editingStep ? `edit-${editingStep.step.id}` : 'add'}
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                activeStepGroup={activeStepGroup}
                setFormState={closeForm}
                editingStep={editingStep || null}
            />
        );
    }
};

interface SelectFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    setFormState: (state: FormState) => void;
    setActiveStepGroup: (sequenceNumber: number) => void;
}

const SelectForm = ({
    stepGroups,
    setStepGroups,
    setFormState,
    setActiveStepGroup,
}: SelectFormProps) => {
    const findNextSequenceNumber = () => {
        let biggest = 0;
        for (let stepGroup of stepGroups) {
            biggest = Math.max(biggest, stepGroup.step_group.sequence_number);
        }
        return biggest + 1;
    };

    return (
        <VStack height={300} alignItems="center" gap={20}>
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
                    New step group
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
                    //!Add retrieving templates from step group library
                }}
            >
                <ButtonIcon
                    as={Plus}
                    size={20}
                    color="rgba(0, 0, 0, 0.3)"
                    mr="$1"
                />
                <ButtonText fontSize={16} color="rgba(0, 0, 0, 0.3)">
                    Template
                </ButtonText>
            </Button>

            <Text fontSize={16} opacity={0.5} color="black">
                Add to step group:
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
                    setFormState('Add liquid');
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
                    setFormState('Add washing');
                }}
            >
                <ButtonIcon as={Plus} size={20} color="black" mr="$1" />
                <ButtonText fontSize={16} color="black">
                    Washing
                </ButtonText>
                <ButtonIcon as={Droplet} size={15} color="black" ml="$3" />
            </Button>
        </VStack>
    );
};

interface WashingParamsFieldsProps {
    iterations: string;
    setIterations: (value: string) => void;
    duration: string;
    setDuration: (value: string) => void;
}

const WashingParamsFields = ({
    iterations,
    setIterations,
    duration,
    setDuration,
}: WashingParamsFieldsProps) => (
    <HStack gap={8} alignItems="center">
        <VStack gap={8} flex={1}>
            <Text fontSize={11} color="black" opacity={0.7}>
                Washing iterations
            </Text>
            <Input height={48} borderRadius={16} bg="#F1F1F1" borderWidth={0}>
                <InputField
                    color="black"
                    fontSize={12}
                    placeholder="Number of washing iterations"
                    keyboardType="numeric"
                    ml={16}
                    value={iterations}
                    onChange={(e: any) => setIterations(e.nativeEvent.text)}
                />
            </Input>
        </VStack>
        <VStack gap={8} flex={1}>
            <Text fontSize={11} color="black" opacity={0.7}>
                Single wash duration
            </Text>
            <Input height={48} borderRadius={16} bg="#F1F1F1" borderWidth={0}>
                <InputField
                    color="black"
                    fontSize={12}
                    placeholder="Minutes"
                    keyboardType="numeric"
                    ml={16}
                    value={duration}
                    onChange={(e: any) => setDuration(e.nativeEvent.text)}
                />
            </Input>
        </VStack>
    </HStack>
);

interface AddLiquidFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setFormState: () => void;
    editingStep: EditingStep | null;
}

const AddLiquidForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setFormState,
    editingStep,
}: AddLiquidFormProps) => {
    const isEditing = !!editingStep;
    const [categories, setCategories] = useState(
        [] as { id: number; name: string }[],
    );
    const [liquids, setLiquids] = useState([] as PermanentLiquidDTO[]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null,
    );
    const [selectedLiquid, setSelectedLiquid] = useState<number | null>(
        editingStep?.step.applied_liquid_id ?? null,
    );
    const [incubationTime, setIncubationTime] = useState<string>(
        editingStep ? (editingStep.step.incubation_time / 60).toString() : '',
    );
    const [targetTemperature, setTargetTemperature] = useState<string>(
        editingStep ? editingStep.step.target_temperature.toString() : '',
    );
    const [washingIterations, setWashingIterations] = useState<string>(
        editingStep
            ? (editingStep.step.washing_iterations ?? 0).toString()
            : '0',
    );
    const [singleWashDuration, setSingleWashDuration] = useState<string>(
        editingStep?.step.single_wash_duration
            ? (editingStep.step.single_wash_duration / 60).toString()
            : '',
    );

    const [error, setError] = useState<string>('');

    const validate = (): boolean => {
        if (!selectedLiquid) {
            setError('Please select a reagent');
            return false;
        }

        const incubation = parseFloat(incubationTime);
        if (!incubationTime.trim() || isNaN(incubation) || incubation <= 0) {
            setError('Incubation time must be a positive number');
            return false;
        }

        const temperature = parseFloat(targetTemperature);
        if (!targetTemperature.trim() || isNaN(temperature)) {
            setError('Target temperature must be a number');
            return false;
        } else if (temperature < 10 || temperature > 100) {
            setError('Temperature must be between 10°C and 100°C');
            return false;
        }

        const iterations = parseInt(washingIterations);
        if (!washingIterations.trim() || isNaN(iterations) || iterations < 0) {
            setError('Washing iterations must be a non-negative whole number');
            return false;
        }

        if (iterations > 0) {
            const washDuration = parseFloat(singleWashDuration);
            if (
                !singleWashDuration.trim() ||
                isNaN(washDuration) ||
                washDuration <= 0
            ) {
                setError(
                    'Wash duration must be a positive number when iterations > 0',
                );
                return false;
            }
        }

        setError('');
        return true;
    };

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
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch liquid categories', error);
            });

        makeRequest('GET' as Method, '/liquids')
            .then((response) => {
                setLiquids(response.data);
                if (editingStep) {
                    const liquid = (response.data as PermanentLiquidDTO[]).find(
                        (l) => l.id === editingStep.step.applied_liquid_id,
                    );
                    if (liquid) {
                        setSelectedCategory(liquid.liquid_type_id);
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to fetch liquids', error);
            });
    }, []);

    useEffect(() => {
        if (isEditing) return;

        if (selectedLiquid) {
            const liquid = liquids.find((l) => l.id === selectedLiquid);
            if (liquid) {
                console.log(liquid);
                setIncubationTime(
                    (liquid.default_incubation_time / 60).toString(),
                );
                setTargetTemperature(
                    liquid.default_target_temperature.toString(),
                );
            }
        }
    }, [selectedLiquid]);

    const selectedCategoryName =
        categories.find((c) => c.id === selectedCategory)?.name ?? '';
    const selectedLiquidName =
        liquids.find((l) => l.id === selectedLiquid)?.name ?? '';

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
                    {isEditing ? 'Edit Reagent' : 'Add Reagent'}
                </Text>
                <Box ml="auto">
                    <Pressable
                        onPress={() => {
                            setFormState();
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
                        key={`category-${selectedCategoryName}`}
                        selectedValue={
                            selectedCategory
                                ? selectedCategory.toString()
                                : null
                        }
                        initialLabel={selectedCategoryName}
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
                        key={`liquid-${selectedLiquidName}`}
                        selectedValue={
                            selectedLiquid ? selectedLiquid.toString() : null
                        }
                        initialLabel={selectedLiquidName}
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
                    >
                        <InputField
                            color="black"
                            fontSize={16}
                            placeholder="Time in minutes"
                            keyboardType="numeric"
                            ml={16}
                            value={incubationTime}
                            onChange={(e: any) =>
                                setIncubationTime(e.nativeEvent.text)
                            }
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
                    >
                        <InputField
                            color="black"
                            fontSize={16}
                            placeholder="Degrees in celsius"
                            keyboardType="numeric"
                            ml={16}
                            value={targetTemperature}
                            onChange={(e: any) =>
                                setTargetTemperature(e.nativeEvent.text)
                            }
                        />
                    </Input>
                </VStack>

                {/* Washing iterations */}
                <WashingParamsFields
                    iterations={washingIterations}
                    setIterations={setWashingIterations}
                    duration={singleWashDuration}
                    setDuration={setSingleWashDuration}
                />
            </VStack>
            <Box height={30} alignItems="center" justifyContent="center">
                {error ? (
                    <Text fontSize={12} color="red" flex={1}>
                        {error}
                    </Text>
                ) : null}
            </Box>
            <HStack gap={24} mt={10}>
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
                            setFormState();
                        }}
                        fontSize={14}
                        color="#1F2832"
                        fontFamily="Manrope-SemiBold"
                    >
                        Cancel
                    </ButtonText>
                </Button>
                <Button bg="#1F2832" height={40} width={170} borderRadius={999}>
                    <ButtonText
                        fontSize={14}
                        color="white"
                        fontFamily="Manrope-SemiBold"
                        onPress={() => {
                            if (!validate()) return;

                            if (editingStep) {
                                const updatedStep: StepDTO = {
                                    ...editingStep.step,
                                    applied_liquid_id: selectedLiquid!,
                                    incubation_time:
                                        parseInt(incubationTime) * 60,
                                    target_temperature:
                                        parseInt(targetTemperature),
                                    washing_iterations:
                                        parseInt(washingIterations),
                                    single_wash_duration:
                                        parseInt(singleWashDuration) * 60 || 0,
                                };

                                const updatedStepGroups = stepGroups.map(
                                    (stepGroup) => {
                                        if (
                                            stepGroup.step_group
                                                .sequence_number ===
                                            editingStep.stepGroupSequenceNumber
                                        ) {
                                            return {
                                                ...stepGroup,
                                                steps: stepGroup.steps.map(
                                                    (s) =>
                                                        s.sequence_number ===
                                                        editingStep.step
                                                            .sequence_number
                                                            ? updatedStep
                                                            : s,
                                                ),
                                            };
                                        }
                                        return stepGroup;
                                    },
                                );

                                setStepGroups(updatedStepGroups);
                                setFormState();
                                return;
                            }

                            const newStep: StepDTO = {
                                id: Date.now(), // Temporary ID, replace with actual ID from backend
                                type: 'Liquid Application' as StepType,
                                applied_liquid_id: selectedLiquid!,
                                incubation_time: parseInt(incubationTime) * 60, // Convert minutes to seconds
                                target_temperature: parseInt(targetTemperature),
                                iterations: 1,
                                sequence_number: findNextSequenceNumberForSteps(
                                    stepGroups,
                                    activeStepGroup,
                                ),
                                washing_iterations: parseInt(washingIterations),
                                single_wash_duration:
                                    parseInt(singleWashDuration) * 60 || 0,
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
                            setFormState();
                        }}
                    >
                        {isEditing ? 'Save' : 'Add to step'}
                    </ButtonText>
                </Button>
            </HStack>
        </Box>
    );
};

interface AddWashingFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setFormState: () => void;
    editingStep: EditingStep | null;
}

const AddWashingForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setFormState,
    editingStep,
}: AddWashingFormProps) => {
    const isEditing = !!editingStep;
    const [liquids, setLiquids] = useState([] as PermanentLiquidDTO[]);
    const [selectedLiquid, setSelectedLiquid] = useState<number | null>(
        editingStep?.step.applied_liquid_id ?? null,
    );
    const [washingTemperature, setWashingTemperature] = useState<string>(
        editingStep ? editingStep.step.target_temperature.toString() : '25',
    );
    const [washingDuration, setWashingDuration] = useState<string>(
        editingStep ? (editingStep.step.incubation_time / 60).toString() : '',
    );
    const [washingIterations, setWashingIterations] = useState<string>(
        editingStep ? (editingStep.step.iterations ?? 1).toString() : '1',
    );

    const [error, setError] = useState<string>('');

    const validate = (): boolean => {
        if (!selectedLiquid) {
            setError('Please select a washing liquid');
            return false;
        }

        const temperature = parseFloat(washingTemperature);
        if (!washingTemperature.trim() || isNaN(temperature)) {
            setError('Washing temperature must be a number');
            return false;
        } else if (temperature < 10 || temperature > 100) {
            setError('Temperature must be between 10°C and 100°C');
            return false;
        }

        const duration = parseFloat(washingDuration);
        if (!washingDuration.trim() || isNaN(duration) || duration <= 0) {
            setError('Washing duration must be a positive number');
            return false;
        }

        const iterations = parseInt(washingIterations);
        if (!washingIterations.trim() || isNaN(iterations) || iterations <= 0) {
            setError('Washing iterations must be a positive whole number');
            return false;
        }

        setError('');
        return true;
    };

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
        makeRequest('GET' as Method, '/liquids')
            .then((response) => {
                setLiquids(
                    (response.data as PermanentLiquidDTO[]).filter((liquid) =>
                        isWashingLiquidCategory(liquid.liquid_type_name),
                    ),
                );
            })
            .catch((error) => {
                console.error('Failed to fetch liquids', error);
            });
    }, []);

    const selectedLiquidName =
        liquids.find((l) => l.id === selectedLiquid)?.name ?? '';

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
                    {isEditing ? 'Edit Washing' : 'Add Washing'}
                </Text>
                <Box ml="auto">
                    <Pressable
                        onPress={() => {
                            setFormState();
                        }}
                    >
                        <Icon as={X} size={24} color="black" />
                    </Pressable>
                </Box>
            </HStack>
            <VStack gap={8}>
                {/* Washing liquid */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Washing name
                    </Text>
                    <Select
                        key={`washing-liquid-${selectedLiquidName}`}
                        selectedValue={
                            selectedLiquid ? selectedLiquid.toString() : null
                        }
                        initialLabel={selectedLiquidName}
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

                {/* Washing temperature */}
                <VStack gap={8}>
                    <Text fontSize={12} color="black" opacity={0.7}>
                        Washing temperature (degrees, celsius)
                    </Text>
                    <Input
                        height={48}
                        borderRadius={16}
                        bg="#F1F1F1"
                        borderWidth={0}
                    >
                        <InputField
                            color="black"
                            fontSize={16}
                            placeholder="Degrees in celsius"
                            keyboardType="numeric"
                            ml={16}
                            value={washingTemperature}
                            onChange={(e: any) =>
                                setWashingTemperature(e.nativeEvent.text)
                            }
                        />
                    </Input>
                </VStack>

                {/* Washing duration and iterations */}
                <WashingParamsFields
                    iterations={washingIterations}
                    setIterations={setWashingIterations}
                    duration={washingDuration}
                    setDuration={setWashingDuration}
                />
            </VStack>
            <Box height={30} alignItems="center" justifyContent="center">
                {error ? (
                    <Text fontSize={12} color="red" flex={1}>
                        {error}
                    </Text>
                ) : null}
            </Box>
            <HStack gap={24} mt={10}>
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
                            setFormState();
                        }}
                        fontSize={14}
                        color="#1F2832"
                        fontFamily="Manrope-SemiBold"
                    >
                        Cancel
                    </ButtonText>
                </Button>
                <Button bg="#1F2832" height={40} width={170} borderRadius={999}>
                    <ButtonText
                        fontSize={14}
                        color="white"
                        fontFamily="Manrope-SemiBold"
                        onPress={() => {
                            if (!validate()) return;

                            const durationSeconds =
                                parseInt(washingDuration) * 60;

                            if (editingStep) {
                                const updatedStep: StepDTO = {
                                    ...editingStep.step,
                                    type: StepType.WASHING,
                                    applied_liquid_id: selectedLiquid!,
                                    target_temperature:
                                        parseInt(washingTemperature),
                                    incubation_time: durationSeconds,
                                    iterations: parseInt(washingIterations),
                                    washing_iterations: 0,
                                    single_wash_duration: 0,
                                };

                                const updatedStepGroups = stepGroups.map(
                                    (stepGroup) => {
                                        if (
                                            stepGroup.step_group
                                                .sequence_number ===
                                            editingStep.stepGroupSequenceNumber
                                        ) {
                                            return {
                                                ...stepGroup,
                                                steps: stepGroup.steps.map(
                                                    (s) =>
                                                        s.sequence_number ===
                                                        editingStep.step
                                                            .sequence_number
                                                            ? updatedStep
                                                            : s,
                                                ),
                                            };
                                        }
                                        return stepGroup;
                                    },
                                );

                                setStepGroups(updatedStepGroups);
                                setFormState();
                                return;
                            }

                            const newStep: StepDTO = {
                                id: Date.now(),
                                type: StepType.WASHING,
                                applied_liquid_id: selectedLiquid!,
                                incubation_time: durationSeconds,
                                target_temperature:
                                    parseInt(washingTemperature),
                                iterations: parseInt(washingIterations),
                                sequence_number: findNextSequenceNumberForSteps(
                                    stepGroups,
                                    activeStepGroup,
                                ),
                                washing_iterations: 0,
                                single_wash_duration: 0,
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
                            setFormState();
                        }}
                    >
                        {isEditing ? 'Save' : 'Add to step'}
                    </ButtonText>
                </Button>
            </HStack>
        </Box>
    );
};

export default AddStepForm;
