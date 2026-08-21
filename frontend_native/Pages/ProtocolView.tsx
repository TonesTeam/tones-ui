import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainContainer } from '../constants/styles';
import { StyleSheet } from 'react-native';
import { Box, Heading, Text, VStack, HStack } from '@gluestack-ui/themed';
import NavBar from '../navigation/NavBar';
import {
    Button,
    ButtonText,
    Icon,
    Spinner,
    ScrollView,
} from '@gluestack-ui/themed';
import {
    Edit3,
    File,
    Rocket,
    Trash,
    Clock,
    FlaskConical,
    Thermometer,
    Droplet,
    Repeat,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
    getRequest,
    makeRequest,
    formatSocialMediaTime,
    formatDuration,
} from '../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import ConfirmationModal from '../components/ConfirmationModal';
import { Method } from 'axios';
import { PermanentLiquidDTO } from 'common/dto/liquid.dto';
import { StepDTO } from 'common/dto/step.dto';
import { isWashingLiquidCategory } from 'common/enums';
import GeneratedAvatar from '../components/GeneratedAvatar';

const ProtocolView = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const protocol_ID = route.params?.protocol_ID;
    const [protocol, setProtocol] = useState<ProtocolWithStepsDTO | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [liquids, setLiquids] = useState<PermanentLiquidDTO[]>([]);

    useEffect(() => {
        if (protocol_ID) {
            console.log('Fetching protocol data...');
            getRequest<ProtocolWithStepsDTO>(`/protocols/${protocol_ID}`)
                .then((r) => {
                    if ('data' in r) {
                        setProtocol(r.data);
                        console.log('Protocol data fetched:', r.data);
                        console.log('Step groups:', r.data.step_groups);
                        if (
                            r.data.step_groups &&
                            r.data.step_groups.length > 0
                        ) {
                            console.log(
                                'First step group:',
                                r.data.step_groups[0],
                            );
                            console.log(
                                'First step:',
                                r.data.step_groups[0].steps[0],
                            );
                        }
                    }
                })
                .catch((err) => console.error(err));

            // Загружаем жидкости
            getRequest<any[]>('/liquids')
                .then((r) => {
                    if ('data' in r) {
                        setLiquids(r.data);
                        console.log('Liquids loaded:', r.data);
                    }
                })
                .catch((err) => console.error('Failed to load liquids:', err));
        }
    }, [protocol_ID]);

    const deleteProtocol = (id: number) => {
        makeRequest('DELETE' as Method, `/protocols/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    setDeleteModal(false);
                    navigation.goBack();
                } else {
                    setDeleteModal(false);
                }
            })
            .catch((err) => {
                console.log(err.message);
                setDeleteModal(false);
            });
    };

    if (!protocol) {
        return (
            <MainContainer>
                <NavBar />
                <Box
                    alignItems="center"
                    justifyContent="center"
                    flex={1}
                    p={24}
                >
                    <Spinner size="large" color="grey" />
                </Box>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <Text
                    color="black"
                    fontSize={32}
                    fontFamily="Orbitron-Medium"
                    mb="$8"
                    mt={16}
                >
                    {protocol?.metadata.name ?? 'Loading...'}
                </Text>
                <ScrollView>
                    <HStack justifyContent="flex-end" space="sm" mb="$6">
                        <Button
                            size="sm"
                            variant="outline"
                            onPress={() =>
                                navigation.navigate('Create protocol', {
                                    protocol_ID: protocol.metadata.id,
                                    preserveID: false,
                                })
                            }
                        >
                            <Icon as={File} mr="$2" />
                            <ButtonText>Duplicate</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onPress={() =>
                                navigation.navigate('Create protocol', {
                                    protocol_ID: protocol.metadata.id,
                                    preserveID: true,
                                })
                            }
                        >
                            <Icon as={Edit3} mr="$2" />
                            <ButtonText>Edit</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            borderColor="$error500"
                            onPress={() => setDeleteModal(true)}
                        >
                            <Icon as={Trash} mr="$2" color="$error500" />
                            <ButtonText color="$error500">Delete</ButtonText>
                        </Button>
                    </HStack>

                    <HStack gap={30} alignItems="flex-start">
                        <StepsColumn protocol={protocol} liquids={liquids} />
                        <MetadataColumn protocol={protocol} />
                    </HStack>

                    <Button
                        size="sm"
                        bg="$primary500"
                        alignSelf="center"
                        onPress={() =>
                            navigation.navigate('Launch', {
                                protocol_ID: protocol.metadata.id,
                                protocol_name: protocol.metadata.name,
                            })
                        }
                    >
                        <Icon as={Rocket} mr="$2" color="white" />
                        <ButtonText color="white">Launch</ButtonText>
                    </Button>
                </ScrollView>
            </Box>

            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                action={() => deleteProtocol(protocol.metadata.id)}
                headline={`Delete protocol "${protocol.metadata.name}"?`}
                text="Are you sure you want to delete this protocol? This action cannot be undone."
                actionButtonText="Delete"
            />
        </MainContainer>
    );
};

const StepsColumn = ({
    protocol,
    liquids,
}: {
    protocol: ProtocolWithStepsDTO;
    liquids: PermanentLiquidDTO[];
}) => {
    const getLiquidName = (liquidId: number) => {
        const liquid = liquids.find((l) => l.id === liquidId);
        return liquid?.name?.trim() || null;
    };

    const isWashingStep = (step: StepDTO) => {
        const liquid = liquids.find((l) => l.id === step.applied_liquid_id);
        return isWashingLiquidCategory(liquid?.liquid_type_name);
    };

    // Repeated washes are saved as separate consecutive identical steps
    // (see Constructor.tsx's expandStepsForSave) — collapse them back into  single row with a repeat count for display.
    const groupConsecutiveSteps = (steps: StepDTO[]) => {
        const groups: { step: StepDTO; count: number }[] = [];
        for (const step of steps) {
            const last = groups[groups.length - 1];
            if (
                last &&
                last.step.applied_liquid_id === step.applied_liquid_id &&
                last.step.incubation_time === step.incubation_time &&
                last.step.target_temperature === step.target_temperature &&
                last.step.washing_iterations === step.washing_iterations &&
                last.step.single_wash_duration === step.single_wash_duration
            ) {
                last.count += 1;
            } else {
                groups.push({ step, count: 1 });
            }
        }
        return groups;
    };

    return (
        <VStack flex={1}>
            <VStack mb="$6">
                <Heading size="lg" mb="$4">
                    Protocol Steps
                </Heading>
                {protocol.step_groups && protocol.step_groups.length > 0 ? (
                    protocol.step_groups.map((group) => {
                        let stepNumber = 0;
                        return (
                            <VStack key={group.step_group.id} mb="$4">
                                <Text fontWeight="bold" fontSize={16} mb="$2">
                                    {group.step_group.name}
                                </Text>
                                <VStack>
                                    {groupConsecutiveSteps(group.steps).map(
                                        ({ step, count }) => {
                                            const stepIsWashing =
                                                isWashingStep(step);
                                            return (
                                                <VStack
                                                    key={step.id}
                                                    p={0}
                                                    m={0}
                                                >
                                                    <StepListItem
                                                        key={step.id}
                                                        step={step}
                                                        index={++stepNumber}
                                                        isWashing={
                                                            stepIsWashing
                                                        }
                                                        repeatCount={count}
                                                        getLiquidName={
                                                            getLiquidName
                                                        }
                                                    />
                                                    {!stepIsWashing &&
                                                        step.washing_iterations >
                                                            0 && (
                                                            <StepListItem
                                                                key={`${step.id}-wash`}
                                                                step={
                                                                    {
                                                                        type: step.type,
                                                                        id: step.id,
                                                                        iterations:
                                                                            step.washing_iterations,
                                                                        incubation_time:
                                                                            step.single_wash_duration,
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
                                                                isWashing={true}
                                                                repeatCount={
                                                                    step.washing_iterations
                                                                }
                                                                getLiquidName={
                                                                    getLiquidName
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
                ) : (
                    <Text>No steps in this protocol</Text>
                )}
            </VStack>
        </VStack>
    );
};

const StepListItem = ({
    step,
    index,
    isWashing,
    getLiquidName,
    repeatCount = 1,
}: {
    step: StepDTO;
    index: number;
    isWashing: boolean;
    getLiquidName: (liquidId: number) => string | null;
    repeatCount?: number;
}) => {
    const liquidName = getLiquidName(step.applied_liquid_id);
    const displayName =
        liquidName ??
        (isWashing ? 'Washing' : `Liquid #${step.applied_liquid_id}`);

    return (
        <HStack
            key={step.id}
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
                    {displayName}
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
                            {step.target_temperature} °C
                        </Text>
                    </HStack>
                )}

                <HStack alignItems="center" justifyContent="center">
                    <Icon as={Repeat} size="xs" />
                    <Text ml={4} fontSize={12}>
                        {repeatCount}
                    </Text>
                </HStack>
            </HStack>
        </HStack>
    );
};

const MetadataColumn = ({ protocol }: { protocol: ProtocolWithStepsDTO }) => {
    return (
        <VStack flex={0.3} minWidth={250}>
            <VStack>
                <Heading size="md" mb="$4">
                    Protocol Information
                </Heading>
                <HStack mb="$3">
                    <Text fontWeight="bold" flex={0.4}>
                        Author:
                    </Text>
                    <HStack flex={0.6}>
                        <GeneratedAvatar
                            name={protocol.metadata.author_first_name}
                            size={26}
                        />
                        <Text ml="$2">
                            {`${protocol?.metadata.author_first_name} ${protocol?.metadata.author_last_name}`}
                        </Text>
                    </HStack>
                </HStack>
                <HStack mb="$3">
                    <Text fontWeight="bold" flex={0.4}>
                        Created:
                    </Text>
                    <Text flex={0.6}>
                        {protocol?.metadata.created_at
                            ? formatSocialMediaTime(
                                  protocol.metadata.created_at,
                              )
                            : ''}
                    </Text>
                </HStack>
                {protocol?.metadata.last_updated && (
                    <HStack mb="$3">
                        <Text fontWeight="bold" flex={0.4}>
                            Last Updated:
                        </Text>
                        <Text flex={0.6}>
                            {formatSocialMediaTime(
                                protocol.metadata.last_updated,
                            )}
                        </Text>
                    </HStack>
                )}
                <VStack>
                    <Text fontWeight="bold" mb="$1">
                        Description:{' '}
                    </Text>
                    <Text fontWeight="normal" fontSize="$sm">
                        {protocol?.metadata.description ?? ''}
                    </Text>
                </VStack>
            </VStack>
        </VStack>
    );
};

export default ProtocolView;
