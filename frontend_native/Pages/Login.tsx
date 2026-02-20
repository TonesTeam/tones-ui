import { StyleSheet, View, FlatList } from 'react-native';
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
} from '@gluestack-ui/themed';
import { Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    setBackdoorAddress,
    getBackdoorAddress,
    getRequest,
} from '../common/util';
import { useAppSelector } from '../state/hooks';
import { Status } from '../state/progress';
import { useUser } from '../contexts/UserContext';

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
    const [backdoorModal, setBackdoorModal] = useState(false);
    const [loginClicks, setLoginClicks] = useState(0);
    const activeProtocols = useAppSelector((state) => state.protocols);

    useEffect(() => {
        console.log('Fetching users from backend...');
        getRequest<User[]>('/users')
            .then((response) => {
                console.log('Response received:', response);
                if (response.data) {
                    console.log('Users data:', response.data);
                    setUsers(response.data);
                } else {
                    console.log('No data in response');
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useEffect(() => {
        if (loginClicks === 5) {
            setBackdoorModal(true);
        }
    }, [loginClicks]);

    const handleSetBackdoor = (address: string) => {
        setBackdoorAddress(address);
        setBackdoorModal(false);
        setLoginClicks(0);
        navigation.navigate('Loading');
    };

    const handleCancelBackdoor = () => {
        setLoginClicks(0);
        setBackdoorModal(false);
    };

    return (
        <View style={s.container}>
            <Header onLoginClick={() => setLoginClicks(loginClicks + 1)} />
            <UserGrid
                users={users}
                navigation={navigation}
                activeProtocols={activeProtocols}
            />

            {/* Логотип внизу страницы */}
            <Image
                source={require('../assets/pics/tones-logo.png')}
                style={s.bottomLogo}
                resizeMode="contain"
            />

            <BackdoorModal
                isOpen={backdoorModal}
                onClose={handleCancelBackdoor}
                onSet={handleSetBackdoor}
                initialAddress={getBackdoorAddress() ?? ''}
            />
        </View>
    );
}

//Заголовок
type HeaderProps = {
    onLoginClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    return (
        <View style={s.header}>
            {/* Нажми 5 раз на "Login" чтобы открыть настройки IP */}
            <Pressable onPress={onLoginClick}>
                <Heading size="2xl" style={s.loginHeading}>
                    Login
                </Heading>
            </Pressable>
        </View>
    );
};

//Сетка пользователей
type UserGridProps = {
    users: User[];
    navigation: any;
    activeProtocols: any[];
};

const UserGrid: React.FC<UserGridProps> = ({
    users,
    navigation,
    activeProtocols,
}) => {
    console.log('UserGrid rendering with users:', users);
    const isUserActive = (username: string) => {
        const isActive = activeProtocols.some(
            (protocol) =>
                protocol.protocol.author === username &&
                protocol.status === Status.Ongoing,
        );
    };
    const { setUser } = useUser();

    return (
        <View style={s.gridContainer}>
            {/* сетка из карточек пользователей (3 колонки) */}
            <FlatList
                data={users}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <UserCard
                            user={item}
                            isActive={isUserActive(item.username)}
                            onPress={() => {
                                console.log(
                                    `Logging in as ${item.first_name} ${item.last_name}`,
                                );
                                setUser(item);
                                navigation.navigate('Protocols');
                            }}
                        />
                    );
                }}
                columnWrapperStyle={s.row}
                contentContainerStyle={s.gridContent}
            />
        </View>
    );
};
//Карточка пользователя
type UserCardProps = {
    user: User;
    isActive: boolean;
    onPress: () => void;
};

const UserCard: React.FC<UserCardProps> = ({ user, isActive, onPress }) => {
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

//(BackdoorModal)

type BackdoorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCancel?: () => void;
    onSet?: (address: string) => void;
    initialAddress?: string;
};

const BackdoorModal: React.FC<BackdoorModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onSet,
    initialAddress = '',
}) => {
    const [addressInput, setAddressInput] = useState<string>(initialAddress);

    useEffect(() => {
        if (isOpen) setAddressInput(initialAddress);
    }, [isOpen, initialAddress]);

    const handleCancel = () => {
        setAddressInput('');
        if (onCancel) onCancel();
        onClose();
    };

    const handleSet = () => {
        const trimmed = addressInput.trim();
        console.log(`Setting backdoor address to: ${trimmed}`);
        if (onSet) onSet(trimmed);
        setAddressInput('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} avoidKeyboard>
            <ModalBackdrop />
            <ModalContent p="$3" bg="black">
                <ModalHeader>
                    <Heading size="xl" color="lightgreen">
                        Enter backend address 😈
                    </Heading>
                </ModalHeader>

                <ModalBody>
                    <Text mb="$4" color="lightgreen">
                        Enter the backend host (without protocol or port).
                        Example: 192.168.1.10
                    </Text>

                    <HStack alignItems="center">
                        <Text color="lightgreen" flex={0.7}>
                            http://
                        </Text>
                        <Input
                            variant="outline"
                            borderColor="lightgreen"
                            color="lightgreen"
                            flex={4}
                        >
                            <InputField
                                value={addressInput}
                                onChangeText={setAddressInput}
                                color="lightgreen"
                                placeholder="e.g. 192.168.1.10 or some domain"
                            />
                        </Input>
                        <Text color="lightgreen" ml="$2" flex={1}>
                            :8080
                        </Text>
                    </HStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="outline"
                        borderColor="lightgreen"
                        onPress={handleCancel}
                        mr="$4"
                    >
                        <ButtonText color="lightgreen">Cancel</ButtonText>
                    </Button>

                    <Button bg="lightgreen" onPress={handleSet}>
                        <ButtonIcon as={Save} color="black" mr="$2" />
                        <ButtonText color="black">Set</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#E5E7F0',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    loginHeading: {
        fontFamily: 'Orbitron-Medium',
        fontWeight: '400',
        fontSize: 32,
    },

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
        justifyContent: 'space-around',
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
