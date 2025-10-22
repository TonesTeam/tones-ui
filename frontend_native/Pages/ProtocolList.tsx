import { StyleSheet, View, Image } from 'react-native';
import { getRequest, makeRequest, formatSocialMediaTime } from '../common/util';
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
import {
    Heading,
    Button,
    ButtonIcon,
    Icon,
    Box,
    VStack,
    HStack,
    Text,
    Spinner,
    Badge,
    BadgeText,
    BadgeIcon,
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
    Pressable,
    Menu,
    MenuItem,
    MenuItemLabel,
    MenuSeparator,
} from '@gluestack-ui/themed';
import {
    X,
    EllipsisVertical,
    ChevronDown,
    Plus,
    Trash,
} from 'lucide-react-native';
import { Method } from 'axios';
import ConfirmationModal from '../components/ConfirmationModal';

import GeneratedAvatar from '../components/GeneratedAvatar';
import SearchBar from '../components/SearchBar';
import { ButtonText } from '@gluestack-ui/themed';

function ProtocolItem({
    protocol,
    navigation,
    removeProtocolFromList,
}: {
    protocol: ProtocolDto;
    navigation: NativeStackNavigationProp<any>;
    removeProtocolFromList: (id: number) => void;
}) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const deleteProtocol = (id: number) => {
        makeRequest('DELETE' as Method, `/protocol/delete/${id}`)
            .then((_) => {
                removeProtocolFromList(id);
                setDeleteModal(false);
            })
            .catch((err) => {
                console.log(err.message);
                setDeleteModal(false);
            });
    };

    return (
        <Box
            rounded="$xl"
            bg="$white"
            p="$4"
            mb="$3"
            shadowColor="$borderLight100"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.05}
            shadowRadius={2}
            flexDirection="row"
        >
            <HStack
                alignItems="center"
                justifyContent="space-between"
                width="100%"
            >
                <Text flex={1} textAlign="left" size="lg" color="$black">
                    # {protocol.id}
                </Text>
                <Text flex={6} textAlign="left" size="lg" color="$black">
                    {protocol.name}
                </Text>

                <HStack flex={3} alignItems="center" space="sm">
                    <GeneratedAvatar name={'Jefferey'} size={40} />
                    <Text color="$black" size="lg">
                        {protocol.author}
                    </Text>
                </HStack>

                <Text size="lg" color="$black" flex={2} textAlign="center">
                    {formatSocialMediaTime(protocol.creationDate)}
                </Text>

                <Text color="$black" size="lg" flex={3} textAlign="center">
                    Ready
                </Text>

                <Box flex={3}>
                    <Menu
                        minWidth={150}
                        placement="top"
                        padding="$3"
                        rounded="$xl"
                        offset={5}
                        isOpen={menuOpen}
                        onClose={() => setMenuOpen(false)}
                        trigger={({ ...triggerProps }) => {
                            return (
                                <Pressable
                                    {...triggerProps}
                                    alignItems="center"
                                    justifyContent="center"
                                    onPress={() => {
                                        console.log(`menuOpen was ${menuOpen}`);
                                        requestAnimationFrame(() =>
                                            setMenuOpen(!menuOpen),
                                        );
                                        console.log(
                                            `Now menuOpen is ${menuOpen}`,
                                        );
                                    }}
                                >
                                    <Icon
                                        as={EllipsisVertical}
                                        color="$black"
                                        size={40}
                                    />
                                </Pressable>
                            );
                        }}
                    >
                        <MenuItem
                            key="Duplicate"
                            textValue="Duplicate"
                            rounded="$md"
                        >
                            <MenuItemLabel
                                onPress={() =>
                                    navigation.navigate('Create protocol', {
                                        protocol_ID: protocol.id,
                                        preserveID: false,
                                    })
                                }
                                size="lg"
                                color="$black"
                            >
                                Duplicate
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem
                            key="Edit"
                            textValue="Edit"
                            rounded="$md"
                            onPress={() =>
                                navigation.navigate('Create protocol', {
                                    protocol_ID: protocol.id,
                                    preserveID: true,
                                })
                            }
                        >
                            <MenuItemLabel size="lg" color="$black">
                                Edit
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem
                            onPress={() =>
                                navigation.navigate('ProtocolView', {
                                    protocol_ID: protocol.id,
                                })
                            }
                            key="Info"
                            textValue="Info"
                            rounded="$md"
                        >
                            <MenuItemLabel size="lg" color="$black">
                                Info
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem key="Delete" textValue="Delete" rounded="$md">
                            <MenuItemLabel
                                onPress={() => {
                                    setMenuOpen(false); // Otherwise the menu stays open
                                    setDeleteModal(true);
                                }}
                                size="lg"
                                color="$error500"
                            >
                                Delete
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </Box>

                <HStack flex={2} justifyContent="flex-end" space="sm">
                    <Button
                        size="md"
                        bg="$black"
                        px="$6"
                        rounded="$full"
                        onPress={() =>
                            navigation.navigate('ProtocolView', {
                                protocol_ID: protocol.id,
                            })
                        }
                    >
                        <ButtonText color="$white" fontWeight="500">
                            Launch
                        </ButtonText>
                    </Button>
                </HStack>
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
    const [networkError, setNetworkError] = useState(false);

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
                        console.log(
                            'No data field in response, error:',
                            r.toJSON(),
                        );
                        setNetworkError(true);
                        setProtocols([]);
                    }
                })
                .catch((err) => {
                    console.log(`Error fetching protocols: ${err.message}`);
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
    }, [isFocused]);
    const [searchPrompt, setSearchPrompt] = useState('');
    const [authorFilter, setAuthorFilter] = useState('All authors');
    const [authorList, setAuthorList] = useState<string[]>([]);
    const [sortingStrategy, setSortingStrategy] = useState('Oldest first');

    const [active, setActive] = useState(false);
    useEffect(() => {
        if (!protocols) return;

        let authors = Array.from(
            new Set(protocols.map((protocol) => protocol.author as string)),
        ).sort();

        setAuthorList(authors);
    }, [protocols]);

    function filterAndSort() {
        if (!protocols) return [] as ProtocolDto[];

        const query = searchPrompt.trim().toLowerCase();
        let filteredList = protocols.filter((e) => {
            return (
                e.name.toLowerCase().includes(query) ||
                e.description?.toLowerCase().includes(query) ||
                e.author?.toLowerCase().includes(query)
            );
        });

        filteredList = filteredList.filter((e) => {
            if (authorFilter === 'All authors') return true;

            return e.author == authorFilter;
        });

        let sortedList = filteredList.sort((a, b) => {
            if (sortingStrategy === 'Oldest first') {
                return (
                    new Date(a.creationDate).getTime() -
                    new Date(b.creationDate).getTime()
                );
            } else if (sortingStrategy === 'Newest first') {
                return (
                    new Date(b.creationDate).getTime() -
                    new Date(a.creationDate).getTime()
                );
            } else if (sortingStrategy === 'Last updated') {
                // Sort by lastUpdate if available, otherwise by creationDate
                const aDate = a.lastUpdate
                    ? new Date(a.lastUpdate).getTime()
                    : new Date(a.creationDate).getTime();
                const bDate = b.lastUpdate
                    ? new Date(b.lastUpdate).getTime()
                    : new Date(b.creationDate).getTime();
                return bDate - aDate; // Most recently updated first
            } else {
                return 0;
            }
        });

        return sortedList;
    }

    return (
        <MainContainer>
            <NavBar />
            <View style={[globalElementStyle.page_container]}>
                <VStack alignItems="start" width="95%" space="lg" mt="$4">
                    <HStack alignItems="center" justifyContent="flex-start">
                        <Heading size="3xl">Protocols</Heading>
                        <Text size="lg" color="$textLight500" ml="$2" mt="$2">
                            ({protocols ? protocols.length : 0})
                        </Text>
                    </HStack>
                    <HStack justifyContent="space-between" width="100%">
                        <HStack>
                            <SearchBar
                                onChangeText={(e) => setSearchPrompt(e)}
                                value={searchPrompt}
                            />
                            <AuthorSelector
                                value={authorFilter}
                                onChange={(e) => setAuthorFilter(e)}
                                authors={authorList}
                            />
                            <SortingSelector
                                value={sortingStrategy}
                                onChange={(e) => setSortingStrategy(e)}
                            />
                        </HStack>
                        <Button
                            variant="outline"
                            rounded="$full"
                            borderColor="$black"
                            onPress={() =>
                                navigation.navigate('Create protocol')
                            }
                            alignItems="center"
                            justifyContent="center"
                        >
                            <ButtonIcon color="$black" as={Plus} mr="$1" />
                            <ButtonText color="$black">
                                Create New Protocol
                            </ButtonText>
                        </Button>
                    </HStack>
                </VStack>
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
                                                    height: '100%',
                                                    width: '100%',
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <VStack
                                                    space="md"
                                                    alignItems="center"
                                                >
                                                    <Box
                                                        rounded="$full"
                                                        p="$3"
                                                        bg="$red100"
                                                    >
                                                        <Icon
                                                            as={X}
                                                            color="red"
                                                            size="xl"
                                                        />
                                                    </Box>
                                                    <Text>
                                                        Network error, cannot
                                                        find Tones device.
                                                        Please contact technical
                                                        support at
                                                        support@example.org.
                                                    </Text>
                                                </VStack>
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
                                                        removeProtocolFromList={(
                                                            id: number,
                                                        ) => {
                                                            setProtocols(
                                                                (protocols) =>
                                                                    protocols
                                                                        ? protocols.filter(
                                                                              (
                                                                                  p,
                                                                              ) =>
                                                                                  p.id !==
                                                                                  id,
                                                                          )
                                                                        : protocols,
                                                            );
                                                        }}
                                                        key={protocol.id}
                                                        protocol={protocol}
                                                        navigation={navigation}
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
        </MainContainer>
    );
}

interface AuthorSelectorProps {
    value: string;
    onChange: (text: string) => void;
    authors: string[];
}

const AuthorSelector = ({ value, onChange, authors }: AuthorSelectorProps) => {
    return (
        <Select flex={3} ml="$5" onValueChange={onChange} selectedValue={value}>
            <SelectTrigger variant="rounded" borderColor="$borderLight400">
                <SelectInput placeholder="Author" />
                <SelectIcon mr="$3" as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent maxHeight={300}>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem value="All authors" label="All Authors" />
                    {authors.map((author) => (
                        <SelectItem
                            key={author}
                            value={author}
                            label={author}
                        />
                    ))}
                </SelectContent>
            </SelectPortal>
        </Select>
    );
};

interface SortingSelectorProps {
    value: string;
    onChange: (text: string) => void;
}

const SortingSelector = ({ value, onChange }: SortingSelectorProps) => {
    return (
        <Select flex={3} ml="$5" onValueChange={onChange} selectedValue={value}>
            <SelectTrigger variant="rounded" borderColor="$borderLight400">
                <SelectInput placeholder="Oldest first" />
                <SelectIcon mr="$3" as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent maxHeight={300}>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem value="Oldest first" label="Oldest first" />
                    <SelectItem value="Newest first" label="Newest first" />
                    <SelectItem value="Last updated" label="Last updated" />
                </SelectContent>
            </SelectPortal>
        </Select>
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
});
