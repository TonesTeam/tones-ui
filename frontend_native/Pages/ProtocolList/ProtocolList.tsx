import { StyleSheet, View, Image } from 'react-native';
import {
    getRequest,
    makeRequest,
    formatSocialMediaTime,
} from '../../common/util';
import Animated, {
    FadeInDown,
    LinearTransition,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import { ProtocolDto } from 'common/dto/protocol.dto';
import { useEffect, useState, useRef } from 'react';
import Txt from '../../components/Txt';
import NotFound_Icon from '../assets/icons/question.svg';
import { ScrollView } from 'react-native-gesture-handler';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Icon, Box, VStack, Text, Spinner } from '@gluestack-ui/themed';
import { X } from 'lucide-react-native';

import ListItem from './ListItem';
import Header from './Header';
import EmptyListPlaceholder from './EmptyListPlaceholder';
import ConfirmationModal from '../../components/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../contexts/UserContext';

export default function ProtocolList({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const { user } = useUser();
    const scrollViewRef = useRef<ScrollView>(null);
    const isFocused = useIsFocused();
    const [networkError, setNetworkError] = useState(false);

    const [protocols, setProtocols] = useState<ProtocolDto[] | undefined>(
        undefined,
    );

    const getWarningStorageKey = () => `dontShowWashingWarning_${user?.id}`;

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
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [active, setActive] = useState(false);
    const [showWashingWarning, setShowWashingWarning] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Проверяем при загрузке был ли checkbox отмечен ранее
    useEffect(() => {
        const checkWashingWarning = async () => {
            const storageKey = getWarningStorageKey();
            const dontShow = await AsyncStorage.getItem(storageKey);
            if (dontShow === 'true') {
                setDontShowAgain(true);
            }
        };

        if (user?.id) {
            checkWashingWarning();
        }
    }, [user?.id]);

    useEffect(() => {
        if (!protocols) return;

        let authors = Array.from(
            new Set(
                protocols.map(
                    (protocol) =>
                        `${protocol.author_first_name} ${protocol.author_last_name}`,
                ),
            ),
        ).sort();

        setAuthorList(authors);
    }, [protocols]);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleSortingStrategyChange = (strategy: string) => {
        setSortingStrategy(strategy);
        setSortColumn('');
    };

    function filterAndSort() {
        if (!protocols) return [] as ProtocolDto[];

        const query = searchPrompt.trim().toLowerCase();
        let filteredList = protocols.filter((e) => {
            return (
                e.name.toLowerCase().includes(query) ||
                e.description?.toLowerCase().includes(query) ||
                e.author_first_name?.toLowerCase().includes(query) ||
                e.author_last_name?.toLowerCase().includes(query)
            );
        });

        filteredList = filteredList.filter((e) => {
            if (authorFilter === 'All authors') return true;

            return (
                `${e.author_first_name} ${e.author_last_name}` == authorFilter
            );
        });

        let sortedList = filteredList.sort((a, b) => {
            if (sortColumn) {
                let comparison = 0;

                switch (sortColumn) {
                    case 'id':
                        comparison = a.id - b.id;
                        break;
                    case 'name':
                        comparison = a.name.localeCompare(b.name);
                        break;
                    case 'author':
                        comparison = (a.author_first_name || '').localeCompare(
                            b.author_first_name || '',
                        );
                        break;
                    case 'created':
                        comparison =
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime();
                        break;
                    case 'status':
                        comparison = 0;
                        break;
                    default:
                        comparison = 0;
                }

                return sortDirection === 'asc' ? comparison : -comparison;
            }

            if (sortingStrategy === 'Oldest first') {
                return (
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                );
            } else if (sortingStrategy === 'Newest first') {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            } else if (sortingStrategy === 'Last updated') {
                // Sort by lastUpdate if available, otherwise by creationDate
                const aDate = a.last_updated
                    ? new Date(a.last_updated).getTime()
                    : new Date(a.created_at).getTime();
                const bDate = b.last_updated
                    ? new Date(b.last_updated).getTime()
                    : new Date(b.created_at).getTime();
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
            <Box flex={1} p={24}>
                <Text
                    color="black"
                    fontSize={32}
                    fontFamily="Orbitron-Medium"
                    mb="$8"
                    mt={16}
                >
                    Protocols{' '}
                    {protocols && (
                        <Text
                            fontSize={20}
                            color="rgba(0, 0, 0, 0.3)"
                            fontFamily="Orbitron-Medium"
                        >
                            ({protocols.length})
                        </Text>
                    )}
                </Text>
                <Header
                    protocolCount={0}
                    navigation={navigation}
                    searchPrompt={searchPrompt}
                    setSearchPrompt={setSearchPrompt}
                    authorFilter={authorFilter}
                    setAuthorFilter={setAuthorFilter}
                    authorList={authorList}
                    sortingStrategy={sortingStrategy}
                    setSortingStrategy={handleSortingStrategyChange}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onCreateProtocol={() => {
                        if (dontShowAgain) {
                            // Если checkbox был отмечен - прямо переходим
                            navigation.navigate('Create protocol');
                        } else {
                            // Иначе показываем модал
                            setShowWashingWarning(true);
                        }
                    }}
                />
                <Box flex={9} width="100%" mt="0">
                    {protocols == undefined && (
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            flex={1}
                        ></Box>
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
                                            <EmptyListPlaceholder
                                                navigation={navigation}
                                            />
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
                                            (protocol, index) => (
                                                <Animated.View
                                                    key={protocol.id}
                                                    entering={FadeInDown.delay(
                                                        index * 60,
                                                    )
                                                        .springify()
                                                        .damping(0)}
                                                    layout={LinearTransition.springify()}
                                                >
                                                    <ListItem
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
                                                        protocol={protocol}
                                                        navigation={navigation}
                                                    />
                                                </Animated.View>
                                            ),
                                        )}
                                    </ScrollView>
                                )}
                            </View>
                        </>
                    )}
                </Box>
            </Box>
            <ConfirmationModal
                isOpen={showWashingWarning}
                onClose={() => setShowWashingWarning(false)}
                headline="Single Washing Liquid Required"
                text={`1. Each protocol can use only ONE washing liquid TYPE.\n2. We RECOMMEND recording the name of the washing liquid in the Description field ,when you will be saving the protocol. \n3. You may need to change the washing bottle during launch if necessary.`}
                actionButtonText="Continue"
                showCheckbox={true}
                checkboxLabel="Don't show this message again"
                checkboxValue={dontShowAgain}
                onCheckboxChange={async (isChecked) => {
                    setDontShowAgain(isChecked);
                    const storageKey = getWarningStorageKey();
                    if (isChecked) {
                        await AsyncStorage.setItem(storageKey, 'true');
                    } else {
                        await AsyncStorage.removeItem(storageKey);
                    }
                }}
                action={() => {
                    setShowWashingWarning(false);
                    navigation.navigate('Create protocol');
                }}
            />
        </MainContainer>
    );
}
