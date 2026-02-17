import React from 'react';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Heading,
    Icon,
    Button,
    ButtonText,
    Box,
    VStack,
    HStack,
    Text,
    Input,
    InputField,
    ScrollView,
} from '@gluestack-ui/core/themed/creator';
import { StyleSheet, View } from 'react-native';
import { AppStyles } from '../constants/styles';
import {
    X,
    Save,
    Edit3,
    FlaskConical,
    Waves,
    Thermometer,
    AlertTriangle,
} from 'lucide-react-native';
import { StepDTO, ReagentStep, WashStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { ProtocolSettings } from '../common/constructorUtils';
import { formatDuration } from '../common/util';

type PreSaveModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    protocolName: string;
    setProtocolName: (name: string) => void;
    protocolDescription: string;
    setProtocolDescription: (description: string) => void;
    blocks: StepDTO[];
    settings: ProtocolSettings;
    defaultWashStep: WashStep;
    protocol_ID?: number;
};

export default function PreSaveModal({
    isOpen,
    onClose,
    onSave,
    protocolName,
    setProtocolName,
    protocolDescription,
    setProtocolDescription,
    blocks,
    settings,
    defaultWashStep,
    protocol_ID,
}: PreSaveModalProps) {
    const isNameEmpty = protocolName.trim() === '';

    const handleSave = () => {
        if (!isNameEmpty && blocks.length > 0) {
            onSave();
        }
    };

    const getStepIcon = (stepType: StepType) => {
        switch (stepType) {
            case StepType.WASHING:
                return Waves;
            case StepType.LIQUID_APPL:
                return FlaskConical;
            default:
                return FlaskConical;
        }
    };

    const getStepTypeName = (stepType: StepType) => {
        switch (stepType) {
            case StepType.WASHING:
                return 'Washing';
            case StepType.LIQUID_APPL:
                return 'Reagent';
            default:
                return 'Unknown';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalBackdrop />
            <ModalContent style={s.modalContent} padding="$3">
                <ModalHeader
                    borderBottomWidth="$1"
                    borderColor="$borderLight200"
                >
                    <HStack
                        flex={1}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Heading size="xl" color="$textLight900">
                            Protocol Preview
                        </Heading>
                        <Button
                            variant="link"
                            size="sm"
                            onPress={onClose}
                            rounded="$full"
                        >
                            <Icon as={X} size="xl" />
                        </Button>
                    </HStack>
                </ModalHeader>

                <ModalBody p="$6">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <VStack space="lg">
                            {/* Protocol Information Section */}
                            <Box>
                                <Heading
                                    mt="$4"
                                    size="md"
                                    mb="$2"
                                    color="$textLight900"
                                >
                                    Protocol Information
                                </Heading>
                                <VStack space="md">
                                    <VStack space="xs">
                                        <Text
                                            fontWeight="$medium"
                                            color="$textLight700"
                                        >
                                            Protocol Name *
                                        </Text>
                                        <Input
                                            variant="outline"
                                            isInvalid={isNameEmpty}
                                        >
                                            <InputField
                                                value={protocolName}
                                                onChangeText={setProtocolName}
                                                placeholder="Enter protocol name"
                                            />
                                        </Input>
                                        {isNameEmpty && (
                                            <HStack
                                                alignItems="center"
                                                space="xs"
                                            >
                                                <Icon
                                                    as={AlertTriangle}
                                                    size="sm"
                                                    color="$red500"
                                                />
                                                <Text size="sm" color="$red500">
                                                    Protocol name is required
                                                </Text>
                                            </HStack>
                                        )}
                                    </VStack>

                                    <VStack space="xs">
                                        <Text
                                            fontWeight="$medium"
                                            color="$textLight700"
                                        >
                                            Description
                                        </Text>
                                        <Input variant="outline">
                                            <InputField
                                                value={protocolDescription}
                                                onChangeText={
                                                    setProtocolDescription
                                                }
                                                placeholder="Enter description (optional)"
                                                multiline
                                                numberOfLines={2}
                                            />
                                        </Input>
                                    </VStack>
                                </VStack>
                            </Box>

                            {/* Steps Summary Section */}
                            <Box>
                                <Heading
                                    mt="$4"
                                    size="md"
                                    mb="$2"
                                    color="$textLight900"
                                >
                                    Steps Summary ({blocks.length} steps)
                                </Heading>

                                {blocks.length === 0 ? (
                                    <Box
                                        p="$6"
                                        bg="$backgroundLight50"
                                        rounded="$lg"
                                        borderWidth="$1"
                                        borderColor="$borderLight200"
                                        borderStyle="dashed"
                                    >
                                        <VStack alignItems="center" space="md">
                                            <Icon
                                                as={FlaskConical}
                                                size="xl"
                                                color="$textLight400"
                                            />
                                            <Text
                                                color="$textLight500"
                                                textAlign="center"
                                            >
                                                No steps added yet. Add some
                                                steps to your protocol.
                                            </Text>
                                        </VStack>
                                    </Box>
                                ) : (
                                    <Box
                                        borderWidth="$1"
                                        borderColor="$borderLight200"
                                        rounded="$lg"
                                        overflow="hidden"
                                    >
                                        {/* Table Header */}
                                        <HStack
                                            bg="$backgroundLight100"
                                            p="$3"
                                            borderBottomWidth="$1"
                                            borderColor="$borderLight200"
                                        >
                                            <Box flex={0.8}>
                                                <Text
                                                    fontWeight="$semibold"
                                                    size="sm"
                                                    color="$textLight600"
                                                >
                                                    Step
                                                </Text>
                                            </Box>
                                            <Box flex={1.5}>
                                                <Text
                                                    fontWeight="$semibold"
                                                    size="sm"
                                                    color="$textLight600"
                                                >
                                                    Type
                                                </Text>
                                            </Box>
                                            <Box flex={1.5}>
                                                <Text
                                                    fontWeight="$semibold"
                                                    size="sm"
                                                    color="$textLight600"
                                                >
                                                    Reagent
                                                </Text>
                                            </Box>
                                            <Box flex={1}>
                                                <Text
                                                    fontWeight="$semibold"
                                                    size="sm"
                                                    color="$textLight600"
                                                >
                                                    Temp (°C)
                                                </Text>
                                            </Box>
                                            <Box flex={1.2}>
                                                <Text
                                                    fontWeight="$semibold"
                                                    size="sm"
                                                    color="$textLight600"
                                                >
                                                    Time
                                                </Text>
                                            </Box>
                                            <Box flex={1}>
                                                <Text
                                                    fontWeight="$semibold"
                                                    size="sm"
                                                    color="$textLight600"
                                                >
                                                    Iterations
                                                </Text>
                                            </Box>
                                        </HStack>

                                        {/* Table Rows */}
                                        <ScrollView style={{ maxHeight: 300 }}>
                                            {blocks.map((block, index) => {
                                                const isOdd = index % 2 === 1;
                                                return (
                                                    <React.Fragment key={index}>
                                                        <HStack
                                                            p="$3"
                                                            bg={
                                                                isOdd
                                                                    ? '$backgroundLight50'
                                                                    : 'transparent'
                                                            }
                                                            borderBottomWidth={
                                                                index <
                                                                blocks.length -
                                                                    1
                                                                    ? '$1'
                                                                    : '$0'
                                                            }
                                                            borderColor="$borderLight100"
                                                        >
                                                            <Box
                                                                flex={0.8}
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    size="sm"
                                                                    color="$textLight900"
                                                                >
                                                                    {index + 1}
                                                                </Text>
                                                            </Box>
                                                            <Box flex={1.5}>
                                                                <HStack
                                                                    alignItems="center"
                                                                    space="xs"
                                                                >
                                                                    <Icon
                                                                        as={getStepIcon(
                                                                            block.type,
                                                                        )}
                                                                        size="sm"
                                                                        color={
                                                                            block.type ===
                                                                            StepType.WASHING
                                                                                ? '$blue500'
                                                                                : '$green500'
                                                                        }
                                                                    />
                                                                    <Text
                                                                        size="sm"
                                                                        color="$textLight900"
                                                                    >
                                                                        {getStepTypeName(
                                                                            block.type,
                                                                        )}
                                                                    </Text>
                                                                </HStack>
                                                            </Box>
                                                            <Box
                                                                flex={1.5}
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    size="sm"
                                                                    color="$textLight900"
                                                                >
                                                                    {
                                                                        (
                                                                            block.params as
                                                                                | ReagentStep
                                                                                | WashStep
                                                                        ).liquid
                                                                            .name
                                                                    }
                                                                </Text>
                                                            </Box>
                                                            <Box
                                                                flex={1}
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    size="sm"
                                                                    color="$textLight900"
                                                                >
                                                                    {block.type ===
                                                                    StepType.LIQUID_APPL
                                                                        ? `${(block.params as ReagentStep).targetTemperature}°C`
                                                                        : '-'}
                                                                </Text>
                                                            </Box>
                                                            <Box
                                                                flex={1.2}
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    size="sm"
                                                                    color="$textLight900"
                                                                >
                                                                    {formatDuration(
                                                                        (
                                                                            block.params as
                                                                                | ReagentStep
                                                                                | WashStep
                                                                        )
                                                                            .incubation,
                                                                    )}
                                                                </Text>
                                                            </Box>
                                                            <Box
                                                                flex={1}
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    size="sm"
                                                                    color="$textLight900"
                                                                >
                                                                    {
                                                                        block
                                                                            .params
                                                                            .iters
                                                                    }
                                                                </Text>
                                                            </Box>
                                                        </HStack>

                                                        {/* Auto-wash row for reagent steps */}
                                                        {block.type ===
                                                            StepType.LIQUID_APPL &&
                                                            (
                                                                block.params as ReagentStep
                                                            )
                                                                .washingIterations >
                                                                0 && (
                                                                <HStack
                                                                    p="$3"
                                                                    bg="$blue50"
                                                                    borderBottomWidth={
                                                                        index <
                                                                        blocks.length -
                                                                            1
                                                                            ? '$1'
                                                                            : '$0'
                                                                    }
                                                                    borderColor="$borderLight100"
                                                                >
                                                                    <Box
                                                                        flex={
                                                                            0.8
                                                                        }
                                                                        justifyContent="center"
                                                                    >
                                                                        <Text
                                                                            size="sm"
                                                                            color="$blue600"
                                                                        >
                                                                            *
                                                                        </Text>
                                                                    </Box>
                                                                    <Box
                                                                        flex={
                                                                            1.5
                                                                        }
                                                                    >
                                                                        <HStack
                                                                            alignItems="center"
                                                                            space="xs"
                                                                        >
                                                                            <Icon
                                                                                as={
                                                                                    Waves
                                                                                }
                                                                                size="sm"
                                                                                color="$blue500"
                                                                            />
                                                                            <Text
                                                                                size="sm"
                                                                                color="$blue600"
                                                                                fontStyle="italic"
                                                                            >
                                                                                Auto-washing
                                                                            </Text>
                                                                        </HStack>
                                                                    </Box>
                                                                    <Box
                                                                        flex={
                                                                            1.5
                                                                        }
                                                                        justifyContent="center"
                                                                    >
                                                                        <Text
                                                                            size="sm"
                                                                            color="$blue600"
                                                                        >
                                                                            {
                                                                                settings
                                                                                    .autoWashConfig
                                                                                    .liquid
                                                                                    .name
                                                                            }
                                                                        </Text>
                                                                    </Box>
                                                                    <Box
                                                                        flex={1}
                                                                        justifyContent="center"
                                                                    >
                                                                        <Text
                                                                            size="sm"
                                                                            color="$blue600"
                                                                        >
                                                                            {
                                                                                (
                                                                                    block.params as ReagentStep
                                                                                )
                                                                                    .targetTemperature
                                                                            }
                                                                            °C
                                                                        </Text>
                                                                    </Box>
                                                                    <Box
                                                                        flex={
                                                                            1.2
                                                                        }
                                                                        justifyContent="center"
                                                                    >
                                                                        <Text
                                                                            size="sm"
                                                                            color="$blue600"
                                                                        >
                                                                            {formatDuration(
                                                                                45,
                                                                            )}
                                                                        </Text>
                                                                    </Box>
                                                                    <Box
                                                                        flex={1}
                                                                        justifyContent="center"
                                                                    >
                                                                        <Text
                                                                            size="sm"
                                                                            color="$blue600"
                                                                        >
                                                                            {
                                                                                (
                                                                                    block.params as ReagentStep
                                                                                )
                                                                                    .washingIterations
                                                                            }
                                                                        </Text>
                                                                    </Box>
                                                                </HStack>
                                                            )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </ScrollView>
                                    </Box>
                                )}
                            </Box>
                        </VStack>
                    </ScrollView>
                </ModalBody>

                <ModalFooter borderTopWidth="$1" borderColor="$borderLight200">
                    <HStack space="md" flex={1} justifyContent="flex-end">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={onClose}
                            size="md"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            bg="$black"
                            onPress={handleSave}
                            isDisabled={isNameEmpty || blocks.length === 0}
                            size="md"
                        >
                            <Icon color="white" as={Save} mr="$2" />
                            <ButtonText>
                                {protocol_ID ? 'Update' : 'Save'}
                            </ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

const s = StyleSheet.create({
    modalContent: {
        maxWidth: '90%',
        maxHeight: '90%',
    },
});
