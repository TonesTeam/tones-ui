import { StyleSheet, View, Image } from 'react-native';
import {
    getRequest,
    makeRequest,
    formatSocialMediaTime,
} from '../../common/util';
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
import { Icon } from '../../components/ui/icon';
import { Box } from '../../components/ui/box';
import { VStack } from '../../components/ui/vstack';
import { Text } from '../../components/ui/text';
import { Spinner } from '../../components/ui/spinner';
import { X } from 'lucide-react-native';

import ListItem from './ListItem';
import Header from './Header';
import EmptyListPlaceholder from './EmptyListPlaceholder';

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
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [active, setActive] = useState(false);
    useEffect(() => {
        if (!protocols) return;

        let authors = Array.from(
            new Set(protocols.map((protocol) => protocol.author as string)),
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
                e.author?.toLowerCase().includes(query)
            );
        });

        filteredList = filteredList.filter((e) => {
            if (authorFilter === 'All authors') return true;

            return e.author == authorFilter;
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
                        comparison = (a.author || '').localeCompare(
                            b.author || '',
                        );
                        break;
                    case 'created':
                        comparison =
                            new Date(a.creationDate).getTime() -
                            new Date(b.creationDate).getTime();
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
                <Header
                    protocolCount={protocols ? protocols.length : 0}
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
                />
                <Box flex={9} width="95%" mt="$4">
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
                                        {filterAndSort().map(function (
                                            protocol,
                                            index,
                                        ) {
                                            return (
                                                <ListItem
                                                    removeProtocolFromList={(
                                                        id: number,
                                                    ) => {
                                                        setProtocols(
                                                            (protocols) =>
                                                                protocols
                                                                    ? protocols.filter(
                                                                          (p) =>
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
                                        })}
                                    </ScrollView>
                                )}
                            </View>
                        </>
                    )}
                </Box>
            </View>
        </MainContainer>
    );
}
