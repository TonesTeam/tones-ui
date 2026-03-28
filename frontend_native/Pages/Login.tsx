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
import { VStack } from '@gluestack-ui/themed';

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

    useEffect(() => {
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

        fetchUsers();
    }, []);

    return (
        <VStack bg="#E5E7F0" flex={1}>
            <Header />
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
        </VStack>
    );
}

const Header = () => {
    return (
        <View style={s.header}>
            <Heading size="2xl" style={s.loginHeading}>
                Login
            </Heading>
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
                showsVerticalScrollIndicator={false}
                data={users}
                numColumns={3}
                keyExtractor={(item: User) => item.id.toString()}
                renderItem={({ item }: { item: User }) => {
                    return (
                        <UserCard
                            user={item}
                            isActive={isUserActive(item.username)}
                            onPress={() => {
                                console.log(
                                    `Logging in as ${item.first_name} ${item.last_name}`,
                                );
                                setUser(item);
                                navigation.navigate('Dashboard');
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

const s = StyleSheet.create({
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
