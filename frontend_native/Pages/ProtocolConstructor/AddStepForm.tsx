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
import { X, FlaskConical, Plus, ChevronDown } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { makeRequest } from '../../common/util';
import { Method } from 'axios';
import { PermanentLiquidDTO } from 'common/dto/liquid.dto';
import { StepDTO } from 'common/dto/step.dto';
import { StepType } from 'common/enums';

interface AddStepFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setActiveStepGroup: (sequenceNumber: number) => void;
}

const AddStepForm = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setActiveStepGroup,
}: AddStepFormProps) => {
    const [state, setState] = useState('Select' as 'Select' | 'Add liquid');

    if (state === 'Select') {
        return (
            <SelectForm
                setFormState={setState}
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                setActiveStepGroup={setActiveStepGroup}
            />
        );
    } else {
        return (
            <AddLiquidForm
                stepGroups={stepGroups}
                setStepGroups={setStepGroups}
                activeStepGroup={activeStepGroup}
                setFormState={setState}
            />
        );
    }
};

interface SelectFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    setFormState: (state: 'Select' | 'Add liquid') => void;
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
        <VStack height={300} alignItems="center" gap={40}>
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
                                name: `Step ${stepGroups.length + 1}`,
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
                    setFormState('Add liquid');
                }}
            >
                <ButtonIcon as={Plus} size={20} color="black" mr="$1" />
                <ButtonText fontSize={16} color="black">
                    Reagent
                </ButtonText>
                <ButtonIcon as={FlaskConical} size={15} color="black" ml="$3" />
            </Button>
        </VStack>
    );
};

interface AddLiquidFormProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setFormState: (state: 'Select' | 'Add liquid') => void;
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
    const [washingIterations, setWashingIterations] = useState<string>('0');

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
                            placeholder="Number of washing iterations"
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
                <Button bg="#1F2832" height={40} width={170} borderRadius={999}>
                    <ButtonText
                        fontSize={14}
                        color="white"
                        fontFamily="Manrope-SemiBold"
                        onPress={() => {
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

export default AddStepForm;
