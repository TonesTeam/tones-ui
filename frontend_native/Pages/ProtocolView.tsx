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
import StepBlock from '../components/StepBlock';
import { Method } from 'axios';

const ProtocolView = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const protocol_ID = route.params?.protocol_ID;
    const [protocol, setProtocol] = useState<ProtocolWithStepsDTO | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (protocol_ID) {
            console.log('Fetching protocol data...');
            getRequest<ProtocolWithStepsDTO>(`/protocols/${protocol_ID}`)
                .then((r) => {
                    if ('data' in r) {
                        setProtocol(r.data);
                        console.log('Protocol data fetched:', r.data.steps);
                    }
                })
                .catch((err) => console.error(err));
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
                    <VStack>
                        <HStack justifyContent="flex-end" space="sm">
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
                                <ButtonText color="$error500">
                                    Delete
                                </ButtonText>
                            </Button>
                        </HStack>

                        <HStack>
                            <VStack flex={1} mr="$2">
                                {protocol.step_groups.map((group) =>
                                    group.steps.map((step, index) => (
                                        <StepBlock
                                            key={step.id}
                                            renderParams={{
                                                item: step,
                                                drag: () => {},
                                                isActive: false,
                                                getIndex: () => index,
                                            }}
                                            settings={{
                                                autoWashConfig:
                                                    protocol.defaultWash,
                                                description:
                                                    protocol.description,
                                            }}
                                            edit={false}
                                        />
                                    )),
                                )}
                            </VStack>

                            <VStack flex={1} ml="$2">
                                <HStack>
                                    <Text fontWeight="bold">Author:</Text>
                                    <Text ml="$2">
                                        {`${protocol?.metadata.author_first_name} ${protocol?.metadata.author_last_name}`}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Text fontWeight="bold">Created:</Text>
                                    <Text ml="$2">
                                        {protocol?.metadata.created_at
                                            ? formatSocialMediaTime(
                                                  protocol.metadata.created_at,
                                              )
                                            : ''}
                                    </Text>
                                </HStack>
                                {protocol?.metadata.last_updated && (
                                    <HStack>
                                        <Text fontWeight="bold">
                                            Last Updated:
                                        </Text>
                                        <Text ml="$2">
                                            {formatSocialMediaTime(
                                                protocol.metadata.last_updated,
                                            )}
                                        </Text>
                                    </HStack>
                                )}
                                <Text>
                                    <Text fontWeight="bold">Description: </Text>
                                    <Text fontWeight="normal" ml="$2">
                                        {protocol?.metadata.description ?? ''}
                                    </Text>
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>

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
                action={() => deleteProtocol(protocol.id)}
                icon={Trash}
                headline={`Delete protocol "${protocol.metadata.name}"?`}
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
