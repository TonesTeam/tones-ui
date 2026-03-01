import { HStack, Text, Icon, Box, Pressable } from '@gluestack-ui/themed';
import { StepDTO } from 'common/dto/step.dto';
import { AlignJustify, Thermometer } from 'lucide-react-native';
import { Clock, X, FlaskConical } from 'lucide-react-native';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';

interface StepProps {
    key: number;
    index: number;
    step: StepDTO;
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    allStepGroups: StepGroupWithStepsDTO[];
    stepGroupSequenceNumber: number;
}

const Step = ({
    index,
    step,
    setStepGroups,
    allStepGroups,
    stepGroupSequenceNumber,
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
                    <Box flex={2}></Box>
                    <Pressable onPress={() => setDeleteModal(true)}>
                        <Icon as={X} />
                    </Pressable>
                </HStack>
            </HStack>
        </>
    );
};

export default Step;
