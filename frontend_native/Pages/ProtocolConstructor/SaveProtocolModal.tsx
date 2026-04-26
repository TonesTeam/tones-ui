import React from 'react';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    ButtonText,
    VStack,
    HStack,
    Text,
    Input,
    InputField,
    ScrollView,
    Icon,
} from '@gluestack-ui/themed';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { formatDuration } from '../../common/util';
import {
    FlaskConical,
    Droplet,
    Clock,
    Thermometer,
    Repeat,
} from 'lucide-react-native';
import { StepDTO } from 'common/dto/step.dto';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Dimensions } from 'react-native';
import { AppStyles } from '../../constants/styles';

const screenWidth = Dimensions.get('window').width;

interface SaveProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
    protocolName: string;
    setProtocolName: (name: string) => void;
    protocolDescription: string;
    setProtocolDescription: (description: string) => void;
    stepGroups: StepGroupWithStepsDTO[];
    liquidMap: Map<number, string>;
}

const SaveProtocolModal = ({
    isOpen,
    onClose,
    onSave,
    protocolName,
    setProtocolName,
    protocolDescription,
    setProtocolDescription,
    stepGroups,
    liquidMap,
}: SaveProtocolModalProps) => {
    const s = StyleSheet.create({
        modal_container: {
            borderRadius: 24,
            width: screenWidth * 0.9,
            maxHeight: '85%',
        },
        text_center: {
            textAlign: 'center',
        },
        flex_grow: {
            display: 'flex',
            flexGrow: 5,
            borderRadius: 75,
        },
        margin_left: {
            marginLeft: 40,
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent maxWidth="$full" w="70%" maxHeight="85%">
                <LinearGradient
                    colors={['#F4F9FF', '#D6E5F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 24, padding: 24 }}
                >
                    <ModalBody>
                        <Text
                            style={[
                                s.text_center,
                                {
                                    marginTop: 20,
                                    marginBottom: 24,
                                    fontSize: 25,
                                    fontFamily: 'Manrope-SemiBold',
                                    color: AppStyles.color.text_primary,
                                },
                            ]}
                        >
                            Save Protocol
                        </Text>

                        <ScrollView
                            maxHeight={350}
                            showsVerticalScrollIndicator={true}
                        >
                            <VStack space="lg">
                                {/* Protocol Name Input */}
                                <VStack space="sm">
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontFamily: 'Manrope-SemiBold',
                                            color: AppStyles.color.text_primary,
                                        }}
                                    >
                                        Protocol Name *
                                    </Text>
                                    <Input
                                        borderWidth="$0"
                                        rounded="$md"
                                        bg="white"
                                    >
                                        <InputField
                                            placeholder="Enter protocol name"
                                            value={protocolName}
                                            onChangeText={setProtocolName}
                                            fontSize={15}
                                            fontFamily="Manrope-Medium"
                                        />
                                    </Input>
                                </VStack>

                                {/* Protocol Description Input */}
                                <VStack space="sm">
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontFamily: 'Manrope-SemiBold',
                                            color: AppStyles.color.text_primary,
                                        }}
                                    >
                                        Description ( Add washing liquid name
                                        here )
                                    </Text>
                                    <Input
                                        borderWidth="$0"
                                        rounded="$md"
                                        h="$24"
                                        bg="white"
                                    >
                                        <InputField
                                            placeholder="Enter protocol description"
                                            value={protocolDescription}
                                            onChangeText={
                                                setProtocolDescription
                                            }
                                            fontSize={15}
                                            fontFamily="Manrope-Medium"
                                            multiline
                                            numberOfLines={4}
                                        />
                                    </Input>
                                </VStack>

                                {/* Steps Preview */}
                                <VStack space="md">
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontFamily: 'Manrope-SemiBold',
                                            color: AppStyles.color.text_primary,
                                        }}
                                    >
                                        Protocol Steps
                                    </Text>

                                    {stepGroups.length === 0 ? (
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                color: AppStyles.color
                                                    .text_primary,
                                                fontSize: 14,
                                                fontFamily: 'Manrope-Medium',
                                                padding: 16,
                                            }}
                                        >
                                            No steps added yet
                                        </Text>
                                    ) : (
                                        stepGroups.map((group) => {
                                            let stepNumber = 0;
                                            return (
                                                <VStack
                                                    key={group.step_group.id}
                                                    mb="$4"
                                                >
                                                    <Text
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: 15,
                                                            fontFamily:
                                                                'Manrope-SemiBold',
                                                            color: AppStyles
                                                                .color
                                                                .text_primary,
                                                            marginBottom: 8,
                                                        }}
                                                    >
                                                        {group.step_group.name}
                                                    </Text>
                                                    <VStack>
                                                        {group.steps.map(
                                                            (step: StepDTO) => {
                                                                return (
                                                                    <VStack
                                                                        key={
                                                                            step.id
                                                                        }
                                                                        p={0}
                                                                        m={0}
                                                                    >
                                                                        <StepListItem
                                                                            key={
                                                                                step.id
                                                                            }
                                                                            step={
                                                                                step
                                                                            }
                                                                            index={
                                                                                ++stepNumber
                                                                            }
                                                                            isWashing={
                                                                                false
                                                                            }
                                                                            liquidMap={
                                                                                liquidMap
                                                                            }
                                                                        />
                                                                        {step.washing_iterations >
                                                                            0 && (
                                                                            <StepListItem
                                                                                key={`${step.id}-wash`}
                                                                                step={
                                                                                    {
                                                                                        type: step.type,
                                                                                        id: step.id,
                                                                                        iterations:
                                                                                            step.washing_iterations,
                                                                                        incubation_time: 120,
                                                                                        target_temperature: 25,
                                                                                        applied_liquid_id: 0,
                                                                                        sequence_number:
                                                                                            step.sequence_number,
                                                                                        washing_iterations: 0,
                                                                                    } as StepDTO
                                                                                }
                                                                                index={
                                                                                    ++stepNumber
                                                                                }
                                                                                isWashing={
                                                                                    true
                                                                                }
                                                                                liquidMap={
                                                                                    liquidMap
                                                                                }
                                                                            />
                                                                        )}
                                                                    </VStack>
                                                                );
                                                            },
                                                        )}
                                                    </VStack>
                                                </VStack>
                                            );
                                        })
                                    )}
                                </VStack>
                            </VStack>
                        </ScrollView>
                    </ModalBody>

                    <ModalFooter style={{ marginTop: 20, gap: 16 }}>
                        <Button
                            action="secondary"
                            size="lg"
                            onPress={onClose}
                            style={[
                                s.flex_grow,
                                { backgroundColor: '#FFFFFF' },
                            ]}
                        >
                            <ButtonText
                                fontSize={16}
                                color={AppStyles.color.text_primary}
                                fontFamily="Manrope-SemiBold"
                            >
                                Cancel
                            </ButtonText>
                        </Button>
                        <Button
                            onPress={() => {
                                onSave(protocolName, protocolDescription);
                                onClose();
                            }}
                            size="lg"
                            isDisabled={!protocolName.trim()}
                            style={[
                                s.flex_grow,
                                s.margin_left,
                                {
                                    backgroundColor:
                                        AppStyles.color.text_primary,
                                },
                            ]}
                        >
                            <ButtonText
                                color="#FFFFFF"
                                fontSize={16}
                                fontFamily="Manrope-SemiBold"
                            >
                                Save Protocol
                            </ButtonText>
                        </Button>
                    </ModalFooter>
                </LinearGradient>
            </ModalContent>
        </Modal>
    );
};

const StepListItem = ({
    step,
    index,
    isWashing,
    liquidMap,
}: {
    step: StepDTO;
    index: number;
    isWashing: boolean;
    liquidMap: Map<number, string>;
}) => {
    const liquidName = isWashing
        ? 'Washing'
        : liquidMap.get(step.applied_liquid_id) || 'Reagent';
    return (
        <HStack
            bg="$white"
            borderRadius="$lg"
            p="$3"
            mb="$2"
            space="md"
            alignItems="center"
            shadowColor="$black"
            shadowOffset={{
                width: 0,
                height: 1,
            }}
            shadowOpacity={0.08}
            shadowRadius={2}
            elevation={1}
        >
            <Text fontWeight="bold" fontSize="$sm" minWidth={25}>
                #{index}
            </Text>

            <Icon
                as={isWashing ? Droplet : FlaskConical}
                color={isWashing ? '#1193CF' : '$purple500'}
                size="md"
            />

            <VStack flex={1}>
                <Text
                    fontWeight="600"
                    fontSize="$sm"
                    color={isWashing ? '#1193CF' : 'black'}
                >
                    {liquidName}
                </Text>
            </VStack>

            <HStack space="md" alignItems="center">
                <HStack justifyContent="center" alignItems="center">
                    <Icon as={Clock} size="xs" />
                    <Text ml={4} fontSize={12}>
                        {formatDuration(step.incubation_time)}
                    </Text>
                </HStack>

                {!isWashing && (
                    <HStack alignItems="center" justifyContent="center">
                        <Icon as={Thermometer} size="xs" />
                        <Text ml={4} fontSize={12}>
                            {step.target_temperature / 100} °C
                        </Text>
                    </HStack>
                )}

                <HStack alignItems="center" justifyContent="center">
                    <Icon as={Repeat} size="xs" />
                    <Text ml={4} fontSize={12}>
                        {step.iterations}
                    </Text>
                </HStack>
            </HStack>
        </HStack>
    );
};

export default SaveProtocolModal;
