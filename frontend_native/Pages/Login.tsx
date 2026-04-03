import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GeneratedAvatar from '../components/GeneratedAvatar';
import {
    Modal,
    Button,
    ButtonText,
    Text,
    Input,
    InputField,
    Heading,
    Image,
    Pressable,
    ModalFooter,
    ModalBody,
    ModalHeader,
    ModalContent,
    ModalBackdrop,
    ButtonIcon,
    HStack,
    FlatList,
    Switch,
    VStack,
} from '@gluestack-ui/themed';
import { useEffect, useState } from 'react';
import { getRequest, makeRequest } from '../common/util';
import { useAppSelector } from '../state/hooks';
import { Status } from '../state/progress';
import { useUser } from '../contexts/UserContext';
import { Plus, Save, Trash } from 'lucide-react-native';
import ConfirmationModal from '../components/ConfirmationModal';

type User = {
    id: number;
    first_name: string;
    last_name: string;
    is_deleted: boolean;
    institution: string;
    role: string;
    avatar: string | null;
};

export default function Login({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const [users, setUsers] = useState<User[]>([]);
    const [loginClicks, setLoginClicks] = useState(0);
    const activeProtocols = useAppSelector((state) => state.protocols);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            console.log('[Login] Fetching users from backend...');
            const res = await getRequest<User[]>('/users');

            console.log('[Login] /users success', {
                status: res.status,
                url: res.config?.url,
                method: res.config?.method,
                responseHeaders: res.headers,
                dataType: typeof res.data,
                dataLength: Array.isArray(res.data)
                    ? res.data.length
                    : undefined,
                // preview so you don't spam logcat:
                dataPreview: Array.isArray(res.data)
                    ? res.data.slice(0, 3)
                    : res.data,
            });

            setUsers(res.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error('[Login] /users axios error', {
                    message: err.message,
                    code: err.code,
                    url: err.config?.url,
                    method: err.config?.method,
                    timeout: err.config?.timeout,
                    requestHeaders: err.config?.headers,
                    // Present only if server responded (HTTP error codes etc.)
                    status: err.response?.status,
                    responseHeaders: err.response?.headers,
                    responseData: err.response?.data,
                });
            } else {
                console.error('[Login] /users non-axios error', err);
            }
        }
    };

    return (
        <VStack bg="#E5E7F0" flex={1}>
            {/* Edit mode toggle */}
            <HStack justifyContent="flex-end" padding={16} alignItems="center">
                <Text fontSize={12} color="gray" mr={8}>
                    Edit mode
                </Text>
                <Switch
                    size="md"
                    value={editMode}
                    onToggle={() => setEditMode(!editMode)}
                />
            </HStack>

            {/* 'Login' text */}
            <Header />

            {/* User cards */}
            <UserGrid
                users={users}
                navigation={navigation}
                activeProtocols={activeProtocols}
                editMode={editMode}
                refreshUsers={fetchUsers}
            />

            {/* Tones logo */}
            <Image
                source={require('../assets/pics/tones-logo.png')}
                style={s.bottomLogo}
                resizeMode="contain"
            />
        </VStack>
    );
}

const Header = () => {
    return (
        <HStack alignItems="center" justifyContent="center" pt={30}>
            <Text
                fontSize={32}
                fontFamily="Orbitron-Medium"
                fontWeight="400"
                color="black"
            >
                Login
            </Text>
        </HStack>
    );
};

//Сетка пользователей
type UserGridProps = {
    users: User[];
    navigation: any;
    activeProtocols: any[];
    editMode: boolean;
    refreshUsers: () => void;
};

const UserGrid: React.FC<UserGridProps> = ({
    users,
    navigation,
    activeProtocols,
    editMode,
    refreshUsers,
}) => {
    const [usersWithPlaceholder, setUsersWithPlaceholder] = useState<User[]>(
        [],
    );
    const [biggestUserId, setBiggestUserId] = useState(0);

    const isUserActive = (username: string) => {
        const isActive = activeProtocols.some(
            (protocol) =>
                protocol.protocol.author === username &&
                protocol.status === Status.Ongoing,
        );
    };
    const { setUser } = useUser();

    useEffect(() => {
        const user: User = {
            id: Math.max(...users.map((u) => u.id), 0) + 1,
            first_name: 'Add New User',
            last_name: 'Placeholder',
            is_deleted: false,
            institution: 'System',
            role: 'System',
            avatar: null,
        };
        setUsersWithPlaceholder([...users, user]);
        setBiggestUserId(user.id);
    }, [users]);

    return (
        <View style={s.gridContainer}>
            {/* сетка из карточек пользователей (3 колонки) */}
            <FlatList
                showsVerticalScrollIndicator={false}
                data={usersWithPlaceholder}
                numColumns={3}
                keyExtractor={(_item: User, index: number) => index.toString()}
                renderItem={({ item, i }: { item: User; i: number }) => {
                    return item.id === biggestUserId && editMode ? (
                        <AddUserCard refreshUsers={refreshUsers} />
                    ) : (
                        item.id !== biggestUserId && (
                            <UserCard
                                user={item}
                                isActive={isUserActive(item.username)}
                                onPress={() => {
                                    console.log(
                                        `Logging in as ${item.first_name} ${item.last_name}`,
                                    );
                                    setUser(item);
                                    navigation.replace('Dashboard');
                                }}
                                editMode={editMode}
                                refreshUsers={refreshUsers}
                            />
                        )
                    );
                }}
                columnWrapperStyle={s.row}
                contentContainerStyle={s.gridContent}
            />
        </View>
    );
};

interface AddUserCardProps {
    refreshUsers: () => void;
}

const AddUserCard = ({ refreshUsers }: AddUserCardProps) => {
    const [addUserModal, setAddUserModal] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [institution, setInstitution] = useState('');

    const handleAddUser = () => {
        makeRequest(
            'POST',
            '/users',
            JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                institution,
                role: 'Regular User',
            }),
        )
            .then((res) => {
                console.log('User added successfully:', res.data);
                setAddUserModal(false);
                refreshUsers();
            })
            .catch((err) => {
                console.error('Error adding user:', err);
            });
    };

    return (
        <>
            <Button
                bg="transparent"
                borderRadius={12}
                p={20}
                width={200}
                height={204}
                m={10}
                alignItems="center"
                justifyContent="center"
                borderStyle="dashed"
                borderColor="rgba(0, 0, 0, 0.3)"
                borderWidth={2}
                onPress={() => setAddUserModal(true)}
            >
                <ButtonIcon as={Plus} color="black" mr="$1" />
                <ButtonText fontSize={16} color="black">
                    Add New User
                </ButtonText>
            </Button>

            <Modal isOpen={addUserModal} onClose={() => setAddUserModal(false)}>
                <ModalBackdrop />
                <ModalContent p={10}>
                    <ModalHeader mb={20}>
                        <Text
                            fontSize={20}
                            color="black"
                            fontFamily="Manrope-SemiBold"
                        >
                            🌱 Add New User
                        </Text>
                    </ModalHeader>

                    <ModalBody>
                        <VStack space="md">
                            <HStack
                                space="md"
                                alignItems="center"
                                justifyContent="center"
                                mb={10}
                            >
                                <GeneratedAvatar name={firstName} size={100} />
                            </HStack>

                            <HStack space="md" alignItems="center">
                                <Text>First Name</Text>
                                <Input width="80%">
                                    <InputField
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.nativeEvent.text)
                                        }
                                        placeholder="e.g. Alice"
                                    ></InputField>
                                </Input>
                            </HStack>

                            <HStack space="md" alignItems="center">
                                <Text>Last Name</Text>
                                <Input width="80%">
                                    <InputField
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.nativeEvent.text)
                                        }
                                        placeholder="e.g. Roberts"
                                    ></InputField>
                                </Input>
                            </HStack>

                            <HStack space="md" alignItems="center">
                                <Text>Institution</Text>
                                <Input width="80%">
                                    <InputField
                                        value={institution}
                                        onChange={(e) =>
                                            setInstitution(e.nativeEvent.text)
                                        }
                                        placeholder="e.g. Transport and Telecommunication Institute"
                                    ></InputField>
                                </Input>
                            </HStack>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="outline"
                            mr="$2"
                            onPress={() => setAddUserModal(false)}
                            borderColor="black"
                        >
                            <ButtonText color="black">Cancel</ButtonText>
                        </Button>
                        <Button
                            bg="#1F2832"
                            color="white"
                            onPress={handleAddUser}
                        >
                            <ButtonIcon as={Save} color="white" mr="$1" />
                            <ButtonText>Add User</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

type UserCardProps = {
    user: User;
    isActive: boolean;
    onPress: () => void;
    editMode: boolean;
    refreshUsers: () => void;
};

const UserCard: React.FC<UserCardProps> = ({
    user,
    isActive,
    onPress,
    editMode,
    refreshUsers,
}) => {
    return (
        <Pressable onPress={onPress} style={s.card}>
            {/* Avatar */}
            <View style={s.cardHeader}>
                <GeneratedAvatar name={user.first_name} size={64} />
            </View>

            {/* User info */}
            <View style={s.cardContent}>
                <Text style={s.userNameText}>
                    {user.first_name}
                    {'\n'}
                    {user.last_name}
                </Text>
                <Text style={s.userRole}>{user.institution}</Text>
                {isActive && (
                    <View style={s.activeProtocol}>
                        <View style={s.activeDot} />
                        <Text style={s.activeText}>Active protocol</Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
};

const s = StyleSheet.create({
    bottomLogo: {
        width: '100%',
        height: 10.69,
        marginBottom: 50,
    },

    gridContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    row: {
        marginBottom: 20,
        gap: 10,
    },

    gridContent: {
        paddingVertical: 20,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: 200,
        height: 204,
        margin: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 7.5,
        elevation: 7,
    },

    cardHeader: {
        marginBottom: 12,
    },

    cardContent: {
        alignItems: 'flex-start',
        flex: 1,
    },

    activeProtocol: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00FF00',
        marginRight: 6,
    },

    activeText: {
        fontSize: 12,
        color: '#666',
    },

    userNameText: {
        fontFamily: 'Manrope-Medium',
        fontSize: 16,
        color: '#1F2832',
        marginBottom: 4,
    },

    userRole: {
        fontFamily: 'Manrope',
        fontSize: 12,
        color: 'rgba(31, 40, 50, 0.4)',
    },
});
