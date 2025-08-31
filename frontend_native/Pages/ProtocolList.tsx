import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TextInput,
    Animated,
    Easing,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';
import { ProtocolDto } from 'common/dto/protocol.dto';
import { useEffect, useState, useRef } from 'react';
import { getRequest, makeRequest } from '../common/util';
import Txt from '../components/Txt';
import ConfirmationModal from '../common/TonesModal';
import NotFound_Icon from '../assets/icons/question.svg';
import { ScrollView } from 'react-native-gesture-handler';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Method } from 'axios';
import InfoModal from '../components/InfoModal';
import { InfoType } from '../common/types';
import {
    Input,
    InputField,
    InputSlot,
    InputIcon,
    Pressable,
    Button,
    ButtonText,
    Icon,
    Box,
    VStack,
    HStack,
    Text,
    Divider,
} from '@gluestack-ui/themed';
import GeneratedAvatar from '../components/GeneratedAvatar';
import {
    X,
    SearchIcon,
    Rocket,
    File,
    Edit3,
    Trash,
    ArrowDown,
} from 'lucide-react-native';

function ProtocolItem({
    protocol,
    navigation,
    toggleDeletionModal,
}: {
    protocol: ProtocolDto;
    navigation: NativeStackNavigationProp<any>;
    toggleDeletionModal: (val: boolean) => void;
}) {
    const [deleteModal, setDeleteModal] = useState(false);

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

    return (
        <Box
            borderWidth={1}
            borderColor="$borderLight200"
            rounded="$lg"
            bg="$backgroundLight0"
            p="$4"
            mb="$3"
            shadowColor="$borderLight100"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.05}
            shadowRadius={2}
        >
            {/* Header */}
            <HStack alignItems="center" space="md">
                <GeneratedAvatar name={protocol.name} size={40} />
                <VStack flex={1} space="xs">
                    <Text bold size="md">
                        {protocol.name}
                    </Text>
                    <Text size="xs" color="$textLight500">
                        by {protocol.author} ·{' '}
                        {new Date(protocol.creationDate).toLocaleDateString()}
                    </Text>
                </VStack>
                <Box px="$2.5" py="$1" rounded="$full" bg="$primary100">
                    <Text size="xs" bold color="$primary600">
                        Ready to launch
                    </Text>
                </Box>
            </HStack>

            {/* Body */}
            {protocol.description && (
                <Text size="sm" color="$textLight600" mt="$3">
                    {protocol.description}
                </Text>
            )}
            {!protocol.description && (
                <Text size="sm" color="$textLight400" mt="$3" italic>
                    No description provided
                </Text>
            )}

            {/* Actions */}
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
        </Box>
    );
}

export default function ProtocolList({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const scrollViewRef = useRef<ScrollView>(null);
    const isFocused = useIsFocused();
    //Error state
    const [networkError, setNetworkError] = useState(false);

    //Deletion modal
    const [deletionModal, setDeletionModal] = useState<boolean | undefined>(
        undefined,
    );

    //Protocol data
    const [protocols, setProtocols] = useState<ProtocolDto[] | undefined>(
        undefined,
    );
    const listInitilizer = () => {
        setNetworkError(false);
        setTimeout(() => {
            getRequest<ProtocolDto[]>('/protocols')
                .then((r) => {
                    if ('data' in r) {
                        setProtocols(r.data);
                        console.log(r.data);
                    } else {
                        setNetworkError(true);
                        setProtocols([]);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setNetworkError(true);
                });
        }, 100);
    };
    useEffect(listInitilizer, []);
    useEffect(() => {
        if (isFocused) {
            listInitilizer();
        } else {
            setProtocols(undefined);
        }
    }, [isFocused, deletionModal]);

    //Search bar input
    const [filterInput, setfilterInput] = useState('');
    const [active, setActive] = useState(false);
    let inputHandler = (e: string) => {
        var lowerCase = e.toLowerCase();
        setfilterInput(lowerCase);
    };

    function filterAndSort() {
        if (protocols) {
            let filteredList = protocols.filter((e) =>
                filterInput === ''
                    ? e
                    : e.name.toLowerCase().includes(filterInput.toLowerCase()),
            );
            let sortedList = filteredList;
            return sortedList;
        } else return [] as ProtocolDto[];
    }

    return (
        <MainContainer>
            <NavBar />
            <View style={[globalElementStyle.page_container]}>
                <View style={s.section_search}>
                    <Txt
                        style={{
                            fontFamily: 'Roboto-bold',
                            fontSize: 24,
                            flex: 1,
                        }}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                    >
                        Protocol List
                    </Txt>
                    <SearchBar
                        onChangeText={(e) => inputHandler(e)}
                        value={filterInput}
                    />
                </View>
                <View style={s.section_list}>
                    {protocols == undefined && (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={require('../assets/pics/loading.gif')}
                            />
                            <Txt
                                style={{
                                    fontFamily: 'Roboto-thin',
                                    fontSize: 24,
                                }}
                            >
                                SEARCHING ...
                            </Txt>
                        </View>
                    )}
                    {protocols != undefined && (
                        <>
                            <View style={{ flex: 1 }}>
                                {filterAndSort().length == 0 && (
                                    <View style={{ flex: 1 }}>
                                        {networkError && (
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Txt
                                                    style={{
                                                        color: AppStyles.color
                                                            .text_faded,
                                                        fontSize: 30,
                                                        marginTop: 30,
                                                    }}
                                                >
                                                    Cannot connect to server.
                                                    Please contact tech support.
                                                </Txt>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        marginBottom: '5%',
                                                    }}
                                                >
                                                    <Image
                                                        source={require('../assets/pics/tech_support.jpg')}
                                                        style={{
                                                            flex: 1,
                                                            height: '100%',
                                                            resizeMode:
                                                                'contain',
                                                        }}
                                                    ></Image>
                                                </View>
                                            </View>
                                        )}
                                        {!networkError && (
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <NotFound_Icon
                                                    height={100}
                                                    width={100}
                                                    stroke={
                                                        AppStyles.color
                                                            .text_faded
                                                    }
                                                />

                                                <Txt
                                                    style={{
                                                        color: AppStyles.color
                                                            .text_faded,
                                                        fontSize: 30,
                                                        marginTop: 30,
                                                    }}
                                                >
                                                    No protocols were found
                                                </Txt>
                                            </View>
                                        )}
                                    </View>
                                )}
                                {filterAndSort().length != 0 && (
                                    <ScrollView
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        scrollEnabled={true}
                                        ref={scrollViewRef}
                                        showsVerticalScrollIndicator={true}
                                    >
                                        {filterAndSort().map(
                                            function (protocol, index) {
                                                return (
                                                    <ProtocolItem
                                                        key={protocol.id}
                                                        protocol={protocol}
                                                        navigation={navigation}
                                                        toggleDeletionModal={(
                                                            val,
                                                        ) =>
                                                            setDeletionModal(
                                                                val,
                                                            )
                                                        }
                                                    />
                                                );
                                            },
                                        )}
                                    </ScrollView>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </View>
            {deletionModal != undefined && (
                <InfoModal
                    type={InfoType.DELETE}
                    result={deletionModal}
                    text={'Protocol'}
                    unsetVisible={() => {
                        setDeletionModal(undefined);
                        //listInitilizer();
                    }}
                    actionDuring={() => listInitilizer()}
                />
            )}
        </MainContainer>
    );
}

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
    const styles = StyleSheet.create({
        search_bar: {
            paddingLeft: 10,
        },
        clear_button: {
            paddingRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
        },
    });

    return (
        <Input style={{ flex: 5 }}>
            <InputSlot style={styles.search_bar}>
                <InputIcon as={SearchIcon} />
            </InputSlot>

            <InputField
                onChangeText={onChangeText}
                value={value}
                type="text"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search..."
            />

            {value.length > 0 && (
                <Pressable
                    style={styles.clear_button}
                    onPress={() => onChangeText('')}
                >
                    <InputSlot>
                        <InputIcon color="#ef4444" as={X} />
                    </InputSlot>
                </Pressable>
            )}
        </Input>
    );
};

const s = StyleSheet.create({
    section_search: {
        flex: 1,
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        top: 10,
    },
    section_list: {
        marginTop: 20,
        flex: 9,
        width: '95%',
    },
    search_bar: {
        flexDirection: 'row',
        backgroundColor: AppStyles.color.elem_back,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 20,
    },
    no_description: {
        fontStyle: 'italic',
        color: AppStyles.color.text_faded,
    },
});
