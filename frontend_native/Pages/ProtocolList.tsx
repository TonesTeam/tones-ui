import { StyleSheet, View, Image } from 'react-native';
import { getRequest, makeRequest } from '../common/util';
import { useIsFocused } from '@react-navigation/native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';
import { ProtocolDto } from 'common/dto/protocol.dto';
import { useEffect, useState, useRef } from 'react';
import Txt from '../components/Txt';
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
    Icon,
    Box,
    VStack,
    HStack,
    Text,
    Spinner,
} from '@gluestack-ui/themed';
import GeneratedAvatar from '../components/GeneratedAvatar';
import { X, SearchIcon, Trash, ArrowRight } from 'lucide-react-native';

function ProtocolItem({
    protocol,
    navigation,
}: {
    protocol: ProtocolDto;
    navigation: NativeStackNavigationProp<any>;
    toggleDeletionModal: (val: boolean) => void;
}) {
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
            flexDirection="row"
        >
            <VStack space="md" mb="$2" flex={1}>
                {/* Header */}
                <HStack alignItems="center" space="md">
                    <GeneratedAvatar name={protocol.name} size={40} />
                    <VStack flex={1} space="xs">
                        <Text bold size="md">
                            {protocol.name}
                        </Text>
                        <Text size="xs" color="$textLight500">
                            by {protocol.author} ·{' '}
                            {new Date(
                                protocol.creationDate,
                            ).toLocaleDateString()}
                        </Text>
                    </VStack>
                </HStack>

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
            </VStack>
            <HStack space="sm" alignItems="center" ml="$2">
                <Box
                    px="$2.5"
                    py="$1"
                    rounded="$full"
                    bg="$primary100"
                    justifyContent="center"
                >
                    <Text size="xs" bold color="$primary600">
                        Ready to launch
                    </Text>
                </Box>
                <Button
                    onPress={() =>
                        navigation.navigate('ProtocolView', {
                            protocol_ID: protocol.id,
                        })
                    }
                    rounded="$full"
                    px="$2.5"
                    py="$1"
                >
                    <Icon as={ArrowRight} color="white" />
                </Button>
            </HStack>
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

    const [searchPrompt, setSearchPrompt] = useState('');
    const [active, setActive] = useState(false);

    let inputHandler = (e: string) => {
        var lowerCase = e.toLowerCase();
        setSearchPrompt(lowerCase);
    };

    function filterAndSort() {
        if (!protocols) return [] as ProtocolDto[];

        const query = searchPrompt.trim().toLowerCase();
        const filteredList = protocols.filter((e) => {
            return (
                e.name.toLowerCase().includes(query) ||
                e.description?.toLowerCase().includes(query) ||
                e.author?.toLowerCase().includes(query)
            );
        });

        // TODO: Implement protocol sorting options
        let sortedList = filteredList;

        return sortedList;
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
                        value={searchPrompt}
                    />
                </View>
                <View style={s.section_list}>
                    {protocols == undefined && (
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            flex={1}
                        >
                            <Spinner size="large" color="grey" />
                        </Box>
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
