import {
    Box,
    Text,
    Button,
    ButtonText,
    VStack,
    HStack,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { MainContainer, globalElementStyle } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeRequest } from '../common/util';
import { useUser, User } from '../contexts/UserContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { useState, useEffect } from 'react';
import GeneratedAvatar from '../components/GeneratedAvatar';

const Settings = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const { user, setUser } = useUser();
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [firstName, setFirstName] = useState(user?.first_name);
    const [lastName, setLastName] = useState(user?.last_name);
    const [institution, setInstitution] = useState(user?.institution);

    const handleDeleteUser = () => {
        makeRequest('DELETE', `/users/${user?.id}`)
            .then((res) => {
                console.log('User deleted successfully:', res.data);
                navigation.push('Logout');
            })
            .catch((err) => {
                console.error('Error deleting user:', err);
            });
    };

    const handleEditProfile = () => {
        makeRequest(
            'PATCH',
            `/users/${user?.id}`,
            JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                institution: institution,
            }),
        )
            .then((res) => {
                console.log('User updated successfully:', res.data);

                const updatedUser: User = {
                    ...user,
                    first_name: firstName || user?.first_name || '',
                    last_name: lastName || user?.last_name || '',
                    institution: institution || user?.institution || '',
                };
                setUser(updatedUser);
            })
            .catch((err) => {
                console.error('Error updating user:', err);
            });
    };

    useEffect(() => {
        setFirstName(user?.first_name);
        setLastName(user?.last_name);
        setInstitution(user?.institution);
    }, [user]);

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
                    Settings
                </Text>

                <Text
                    fontFamily="Manrope-SemiBold"
                    fontSize={18}
                    color="black"
                    mb="$4"
                >
                    Edit account data
                </Text>

                {/* Divider */}
                <Box
                    height={1}
                    backgroundColor="$light300"
                    mb="$4"
                    width="80%"
                />

                <HStack mb="$3">
                    <VStack space="md" alignItems="flex-start" flex={1.5}>
                        <VStack alignItems="flex-start">
                            <Text fontSize={13} fontFamily="Manrope-SemiBold">
                                First Name
                            </Text>
                            <Input width="70%">
                                <InputField
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.nativeEvent.text)
                                    }
                                    placeholder="e.g. Alice"
                                ></InputField>
                            </Input>
                        </VStack>

                        <VStack alignItems="flex-start">
                            <Text fontSize={13} fontFamily="Manrope-SemiBold">
                                Last Name
                            </Text>
                            <Input width="70%">
                                <InputField
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.nativeEvent.text)
                                    }
                                    placeholder="e.g. Roberts"
                                ></InputField>
                            </Input>
                        </VStack>

                        <VStack alignItems="flex-start">
                            <Text fontSize={13} fontFamily="Manrope-SemiBold">
                                Institution
                            </Text>
                            <Input width="70%">
                                <InputField
                                    value={institution}
                                    onChange={(e) =>
                                        setInstitution(e.nativeEvent.text)
                                    }
                                    placeholder="e.g. Transport and Telecommunication Institute"
                                ></InputField>
                            </Input>
                        </VStack>
                    </VStack>

                    <Box
                        mt={20}
                        flex={1}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        <Text
                            fontSize={13}
                            fontFamily="Manrope-SemiBold"
                            mb="$3"
                            color="black"
                        >
                            Profile picture
                        </Text>
                        <GeneratedAvatar name={firstName || ''} size={128} />
                    </Box>
                </HStack>

                <Button
                    bg="transparent"
                    borderWidth={1}
                    borderColor="green"
                    width={200}
                    mb="$8"
                    onPress={handleEditProfile}
                >
                    <ButtonText color="green">Update profile</ButtonText>
                </Button>

                <Text
                    fontFamily="Manrope-SemiBold"
                    fontSize={18}
                    color="red"
                    mb="$4"
                >
                    Delete account
                </Text>

                {/* Divider */}
                <Box
                    height={1}
                    backgroundColor="$light300"
                    mb="$4"
                    width="80%"
                />

                <Text fontSize={12} color="$light500" mb="$4" width="80%">
                    Deleting your account will mark your account as deleted and
                    will remove your first name, last name, and your profile
                    picture, while keeping the protocol, liquid and job data
                    associated with your account. This action is irreversible
                    and will prevent you from logging back into your account.
                </Text>

                <Button
                    backgroundColor="transparent"
                    borderWidth={0}
                    bg="red"
                    width={200}
                    onPress={() => {
                        setDeleteUserModal(true);
                    }}
                >
                    <ButtonText color="white">Delete your account</ButtonText>
                </Button>

                <ConfirmationModal
                    isOpen={deleteUserModal}
                    onClose={() => {
                        setDeleteUserModal(false);
                    }}
                    action={() => {
                        handleDeleteUser();
                    }}
                    headline={`Delete User "${user.first_name} ${user.last_name}"?`}
                    text="Are you sure you want to delete this user? This action cannot be undone."
                    actionButtonText="Delete"
                />
            </Box>
        </MainContainer>
    );
};

export default Settings;
