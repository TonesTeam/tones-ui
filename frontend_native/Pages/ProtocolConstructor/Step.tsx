import {
    HStack,
    Text,
    Icon,
    Box,
    Pressable,
    VStack,
} from '@gluestack-ui/themed';
import { StepDTO } from 'common/dto/step.dto';
import { AlignJustify, Thermometer } from 'lucide-react-native';
import {
    Clock,
    X,
    FlaskConical,
    Droplet,
    RotateCcw,
} from 'lucide-react-native';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import { PermanentLiquidDTO } from 'common/dto/liquid.dto';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

interface StepProps {
    key: number;
    index: number;
    step: StepDTO;
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    allStepGroups: StepGroupWithStepsDTO[];
    stepGroupSequenceNumber: number;
    liquids: PermanentLiquidDTO[];
    selectedWashingLiquid?: number | null;
    washingIncubationTime?: number | null;
    globalIndex?: number;
}

const Step = ({
    index,
    step,
    setStepGroups,
    allStepGroups,
    stepGroupSequenceNumber,
    liquids,
    selectedWashingLiquid,
    washingIncubationTime,
    globalIndex,
}: StepProps) => {
    const [deleteModal, setDeleteModal] = useState(false);

    const handleDeleteStep = () => {
        const updatedStepGroups = allStepGroups.map((group) => {
            if (group.step_group.sequence_number === stepGroupSequenceNumber) {
                return {
                    ...group,
                    steps: group.steps.filter(
                        (s) => s.sequence_number !== step.sequence_number,
                    ),
                };
            }
            return group;
        });
        setStepGroups(updatedStepGroups);
        setDeleteModal(false);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                action={handleDeleteStep}
                headline="Delete this step item?"
                text="Are you sure you want to delete this step item? This action cannot be undone."
                actionButtonText="Delete"
            />
            <VStack width="100%" gap={8}>
                <HStack gap={8} alignItems="center" width="100%">
                    <Box width={20} justifyContent="center" alignItems="center">
                        <Icon as={AlignJustify} opacity={0.6} size={20} />
                    </Box>
                    <HStack
                        flex={1}
                        height={50}
                        bg={'white'}
                        width="92%"
                        borderRadius={12}
                        alignItems="center"
                        px={16}
                        overflow="hidden"
                    >
                        <Text color="black" fontSize={12} flex={0.7}>
                            #{globalIndex || index}
                        </Text>
                        <HStack justifyContent="center" flex={3}>
                            {step.type === 'Washing' ? (
                                <Icon as={Droplet} size={16} />
                            ) : (
                                <Icon as={FlaskConical} size={16} />
                            )}
                            <Text color="black" fontSize={12} ml={6}>
                                {liquids.find(
                                    (liquid) =>
                                        liquid.id === step.applied_liquid_id,
                                )?.name ||
                                    (step.type === 'Washing'
                                        ? 'Washing'
                                        : 'Reagent')}
                            </Text>
                        </HStack>
                        <HStack
                            flex={3}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Icon as={Clock} size={16} />
                            <Text color="black" fontSize={12} ml={6}>
                                {step.incubation_time / 60} minutes
                            </Text>
                        </HStack>
                        <HStack
                            flex={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Icon as={Thermometer} size={16} />
                            <Text color="black" fontSize={12} ml={6}>
                                {step.targetTemperature} °C
                            </Text>
                        </HStack>
                        <HStack
                            flex={2}
                            justifyContent="center"
                            alignItems="center"
                        ></HStack>
                        <Pressable
                            width={28}
                            justifyContent="center"
                            alignItems="center"
                            onPress={() => setDeleteModal(true)}
                        >
                            <Icon as={X} />
                        </Pressable>
                    </HStack>
                </HStack>

                {/* Washing info block for Reagent steps */}
                {step.type === 'Liquid Application' &&
                    selectedWashingLiquid && (
                        <HStack gap={8} alignItems="center" width="100%">
                            <Box width={20}></Box>
                            <HStack
                                flex={1}
                                height={50}
                                bg="rgba(98,98,98,0.1)"
                                width="92%"
                                borderRadius={12}
                                alignItems="center"
                                px={16}
                                overflow="hidden"
                            >
                                <Text color="black" fontSize={12} flex={0.7}>
                                    #{(globalIndex || index) + 1}
                                </Text>
                                <HStack justifyContent="center" flex={3}>
                                    <Icon
                                        as={Droplet}
                                        size={16}
                                        color="#1193CF"
                                    />
                                    <Text color="#1193CF" fontSize={12} ml={6}>
                                        {liquids.find(
                                            (liquid) =>
                                                liquid.id ===
                                                selectedWashingLiquid,
                                        )?.name || 'Washing'}
                                    </Text>
                                </HStack>
                                <HStack
                                    flex={3}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Icon as={Clock} size={16} />
                                    <Text color="black" fontSize={12} ml={6}>
                                        {washingIncubationTime
                                            ? washingIncubationTime / 60
                                            : 0}{' '}
                                        minutes
                                    </Text>
                                </HStack>
                                <HStack
                                    flex={2}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Icon as={Thermometer} size={16} />
                                    <Text color="black" fontSize={12} ml={6}>
                                        25 °C
                                    </Text>
                                </HStack>
                                <HStack
                                    flex={2}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Icon as={RotateCcw} size={16} />
                                    <Text color="black" fontSize={12} ml={6}>
                                        {step.washing_iterations}
                                    </Text>
                                </HStack>
                                <Box width={28}></Box>
                            </HStack>
                        </HStack>
                    )}
            </VStack>
        </>
    );
};

export default Step;
