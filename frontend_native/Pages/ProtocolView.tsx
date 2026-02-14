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
import { Edit3, File, Rocket, Trash } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { getRequest, makeRequest, formatSocialMediaTime } from '../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import ConfirmationModal from '../components/ConfirmationModal';
import { Timeline } from './Constructor/TimelineComponents';
import { Method } from 'axios';

const ProtocolView = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const protocol_ID = route.params?.protocol_ID;
    const [protocol, setProtocol] = useState<ProtocolWithStepsDTO | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (protocol_ID) {
            console.log('Fetching protocol data...');
            getRequest<ProtocolWithStepsDTO>(`/protocol/${protocol_ID}`)
                .then((r) => {
                    if ('data' in r) {
                        const protocolData = r.data;

                        // Временный fallback: конвертируем старую структуру в новую
                        if (
                            (!protocolData.stepBatches ||
                                protocolData.stepBatches.length === 0) &&
                            (protocolData as any).steps &&
                            (protocolData as any).steps.length > 0
                        ) {
                            console.log(
                                'Converting old steps[] to stepBatches[] format...',
                            );
                            protocolData.stepBatches = [
                                {
                                    id: 1,
                                    sequenceNumber: 1,
                                    steps: (protocolData as any).steps,
                                },
                            ];
                        }

                        setProtocol(protocolData);
                        console.log(
                            'Protocol stepBatches:',
                            protocolData.stepBatches,
                        );
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [protocol_ID]);

    const deleteProtocol = (id: number) => {
        makeRequest('DELETE' as Method, `/protocol/delete/${id}`)
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
                    style={styles.wrapper}
                >
                    <Spinner size="large" color="grey" />
                </Box>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <NavBar />
            <Box
                flex={1}
                minHeight="100%"
                alignItems="stretch"
                justifyContent="space-between"
                style={styles.wrapper}
            >
                <ScrollView>
                    <VStack>
                        <Heading size="2xl">
                            {protocol?.name ?? 'Loading...'}
                        </Heading>

                        <HStack justifyContent="flex-end" space="sm">
                            <Button
                                size="sm"
                                variant="outline"
                                onPress={() =>
                                    navigation.navigate('Create protocol', {
                                        protocol_ID: protocol.id,
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
                                        protocol_ID: protocol.id,
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
                                <ButtonText color="$error500">
                                    Delete
                                </ButtonText>
                            </Button>
                        </HStack>

                        <HStack space="md">
                            <VStack flex={1}>
                                {protocol.stepBatches &&
                                protocol.stepBatches.length > 0 ? (
                                    <Timeline
                                        stepBatches={protocol.stepBatches}
                                        onReorder={() => {}}
                                        onReorderSteps={() => {}}
                                        onEdit={() => {}}
                                        onCopy={() => {}}
                                        onDelete={() => {}}
                                        deleteBlock={() => {}}
                                        readonly={true}
                                    />
                                ) : (
                                    <Box
                                        p="$4"
                                        borderRadius="$lg"
                                        bg="$warmGray100"
                                    >
                                        <Text
                                            color="$warmGray600"
                                            textAlign="center"
                                        >
                                            No steps in this protocol
                                        </Text>
                                    </Box>
                                )}
                            </VStack>

                            <VStack flex={1}>
                                <HStack mb="$2">
                                    <Text fontWeight="bold">Author:</Text>
                                    <Text ml="$2">
                                        {protocol?.author ?? ''}
                                    </Text>
                                </HStack>
                                <HStack mb="$2">
                                    <Text fontWeight="bold">Created:</Text>
                                    <Text ml="$2">
                                        {protocol?.creationDate
                                            ? formatSocialMediaTime(
                                                  protocol.creationDate,
                                              )
                                            : ''}
                                    </Text>
                                </HStack>
                                {protocol?.lastUpdate && (
                                    <HStack mb="$2">
                                        <Text fontWeight="bold">
                                            Last Updated:
                                        </Text>
                                        <Text ml="$2">
                                            {formatSocialMediaTime(
                                                protocol.lastUpdate,
                                            )}
                                        </Text>
                                    </HStack>
                                )}
                                <Box>
                                    <Text fontWeight="bold">Description:</Text>
                                    <Text mt="$1">
                                        {protocol?.description ?? ''}
                                    </Text>
                                </Box>
                            </VStack>
                        </HStack>
                    </VStack>

                    <Button
                        size="sm"
                        bg="$primary500"
                        alignSelf="center"
                        onPress={() =>
                            navigation.navigate('Launch', {
                                protocol_ID: protocol.id,
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
                action={() => deleteProtocol(protocol.id)}
                icon={Trash}
                headline={`Delete protocol "${protocol.name}"`}
                text="Are you sure you want to delete this protocol? This action cannot be undone."
                actionButtonText="Delete"
                type="error"
            />
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 24,
    },
});

export default ProtocolView;
