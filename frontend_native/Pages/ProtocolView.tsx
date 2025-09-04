import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainContainer } from '../constants/styles';
import { StyleSheet } from 'react-native';
import { Box, Heading, Text, VStack, HStack } from '@gluestack-ui/themed';
import NavBar from '../navigation/CustomNavigator';
import { Button, ButtonText, Icon, Spinner } from '@gluestack-ui/themed';
import { Edit3, File, Rocket, Trash } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { getRequest, makeRequest } from '../common/util';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import ConfirmationModal from '../common/TonesModal';

const ProtocolView = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const protocol_ID = route.params?.protocol_ID;
    const [protocol, setProtocol] = useState<ProtocolWithStepsDTO | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (protocol_ID) {
            console.log('Fetching protocol data...');
            getRequest<ProtocolWithStepsDTO>(`/protocol/${protocol_ID}`)
                .then((r) => setProtocol(r.data))
                .catch((err) => console.error(err));
        }
    }, [protocol_ID]);

    const deleteProtocol = (id: number) => {
        makeRequest('DELETE' as Method, `/protocol/delete/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    toggleDeletionModal(true);
                } else {
                    toggleDeletionModal(false);
                }
            })
            .catch((err) => {
                console.log(err.message);
                toggleDeletionModal(false);
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
                alignItems="stretch"
                justifyContent="flex-start"
                style={styles.wrapper}
            >
                <Heading size="2xl">
                    {protocol ? protocol.name : 'Loading...'}
                </Heading>
                <HStack justifyContent="flex-end" space="sm">
                    <Button
                        size="sm"
                        bg="$primary500"
                        onPress={() =>
                            navigation.navigate('Launch', {
                                protocol_ID: protocol.id,
                            })
                        }
                    >
                        <Icon as={Rocket} mr="$2" color="white" />
                        <ButtonText color="white">Launch</ButtonText>
                    </Button>
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
                        <ButtonText>Template</ButtonText>
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
                        <ButtonText color="$error500">Delete</ButtonText>
                    </Button>
                </HStack>
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
        backgroundColor: '#fff',
    },
});

export default ProtocolView;
