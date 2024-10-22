import { StyleSheet, View, TextInput, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';
import { useEffect, useState, useRef } from 'react';
import { getRequest } from '../common/util';
import Txt from '../components/Txt';
import Search_Icon from '../assets/icons/search.svg';
import NotFound_Icon from '../assets/icons/question.svg';
import { useIsFocused } from '@react-navigation/native';
import { Calendar } from '@react-native-calendars';

export default function History(props: any) {
    const scrollViewRef = useRef<ScrollView>(null);
    const isFocused = useIsFocused();

    // Error state
    const [networkError, setNetworkError] = useState(false);

    // Protocols and liquids data
    const [protocols, setProtocols] = useState<any[] | undefined>(undefined);
    const [liquids, setLiquids] = useState<any[] | undefined>(undefined);

    // Search bar input
    const [filterInput, setFilterInput] = useState('');
    const [active, setActive] = useState(false);

    // Selected date
    const [selectedDate, setSelectedDate] = useState<string | undefined>(
        undefined,
    );

    // Sort field
    const [sortField, setSortField] = useState<string>('name');

    const inputHandler = (e: string) => {
        setFilterInput(e.toLowerCase());
    };

    const filterAndSort = () => {
        if (protocols) {
            let filteredList = protocols.filter((record) => {
                const matchesDate = selectedDate
                    ? new Date(record.creationDate)
                          .toISOString()
                          .split('T')[0] === selectedDate
                    : true;
                const matchesSearch =
                    filterInput === ''
                        ? record
                        : record.name
                              .toLowerCase()
                              .includes(filterInput.toLowerCase());
                return matchesDate && matchesSearch;
            });
            let sortedList = filteredList.sort((a, b) => {
                if (sortField === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortField === 'creationDate') {
                    return (
                        new Date(b.creationDate).getTime() -
                        new Date(a.creationDate).getTime()
                    );
                } else if (sortField === 'author') {
                    return a.author.localeCompare(b.author);
                }
                return 0;
            });
            return sortedList;
        } else return [];
    };

    const listInitializer = () => {
        setNetworkError(false);
        // Fetching protocols
        getRequest<any[]>('/protocols')
            .then((r) => {
                if ('data' in r) {
                    setProtocols(r.data);
                } else {
                    setNetworkError(true);
                    setProtocols([]);
                }
            })
            .catch((err) => {
                console.log(err.message);
                setNetworkError(true);
            });

        // Fetching liquids
        getRequest<any[]>('/liquids')
            .then((r) => {
                if ('data' in r) {
                    setLiquids(r.data);
                } else {
                    setNetworkError(true);
                    setLiquids([]);
                }
            })
            .catch((err) => {
                console.log(err.message);
                setNetworkError(true);
            });
    };

    useEffect(listInitializer, []);
    useEffect(() => {
        if (isFocused) {
            listInitializer();
        } else {
            setProtocols(undefined);
            setLiquids(undefined);
        }
    }, [isFocused]);

    return (
        <MainContainer>
            <NavBar />
            <View
                style={[
                    globalElementStyle.page_container,
                    { padding: 10, flexDirection: 'row' },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <View style={s.section_calendar}>
                        <Calendar
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                            }}
                            markedDates={
                                protocols &&
                                protocols.reduce(
                                    (acc, record) => {
                                        const date = new Date(
                                            record.creationDate,
                                        )
                                            .toISOString()
                                            .split('T')[0];
                                        if (!acc[date]) {
                                            acc[date] = {
                                                marked: true,
                                                dotColor:
                                                    AppStyles.color.primary,
                                            };
                                        }
                                        if (selectedDate === date) {
                                            acc[date].selected = true;
                                            acc[date].selectedColor =
                                                AppStyles.color.primary;
                                        }
                                        return acc;
                                    },
                                    selectedDate
                                        ? {
                                              [selectedDate]: {
                                                  selected: true,
                                                  selectedColor:
                                                      AppStyles.color.primary,
                                              },
                                          }
                                        : {},
                                )
                            }
                            style={{ borderRadius: 15 }}
                        />
                    </View>
                    <View style={s.sort_container}>
                        <Txt
                            style={{
                                fontFamily: 'Roboto-bold',
                                fontSize: 16,
                                marginBottom: 5,
                            }}
                        >
                            Sort By:
                        </Txt>
                        <Picker
                            selectedValue={sortField}
                            style={s.picker}
                            onValueChange={(itemValue) =>
                                setSortField(itemValue)
                            }
                        >
                            <Picker.Item label="Name" value="name" />
                            <Picker.Item
                                label="Creation Date"
                                value="creationDate"
                            />
                            <Picker.Item label="Author" value="author" />
                        </Picker>
                    </View>
                </View>

                <View style={{ flex: 3 }}>
                    <View style={s.section_search}>
                        <Txt
                            style={{ fontFamily: 'Roboto-bold', fontSize: 24 }}
                        >
                            History
                        </Txt>
                        <View
                            style={[
                                s.search_bar,
                                active && {
                                    borderWidth: 2,
                                    borderColor: AppStyles.color.primary,
                                },
                            ]}
                        >
                            <Search_Icon
                                height={30}
                                width={60}
                                stroke={AppStyles.color.text_faded}
                            />
                            <TextInput
                                placeholder="Search history"
                                value={filterInput}
                                style={{
                                    width: '80%',
                                    fontFamily: 'Roboto-regular',
                                }}
                                onFocus={() => setActive(true)}
                                onBlur={() => setActive(false)}
                                onChangeText={(e) => inputHandler(e)}
                            />
                        </View>
                    </View>

                    <View style={s.section_list}>
                        {(protocols == undefined || liquids == undefined) && (
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
                                    Loading...
                                </Txt>
                            </View>
                        )}

                        {protocols != undefined && liquids != undefined && (
                            <>
                                <View style={{ flex: 1 }}>
                                    {filterAndSort().length == 0 && (
                                        <View style={{ flex: 1 }}>
                                            {networkError && (
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    <Txt
                                                        style={{
                                                            color: AppStyles
                                                                .color
                                                                .text_faded,
                                                            fontSize: 30,
                                                            marginTop: 30,
                                                        }}
                                                    >
                                                        Cannot connect to
                                                        server. Please contact
                                                        tech support.
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
                                                        justifyContent:
                                                            'center',
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
                                                            color: AppStyles
                                                                .color
                                                                .text_faded,
                                                            fontSize: 30,
                                                            marginTop: 30,
                                                        }}
                                                    >
                                                        No records found
                                                    </Txt>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                    {filterAndSort().length != 0 && (
                                        <ScrollView
                                            contentContainerStyle={{
                                                flexGrow: 1,
                                            }}
                                            scrollEnabled={true}
                                            ref={scrollViewRef}
                                            showsVerticalScrollIndicator={true}
                                        >
                                            {filterAndSort().map(
                                                function (record, index) {
                                                    return (
                                                        <View
                                                            key={index}
                                                            style={
                                                                s.history_item
                                                            }
                                                        >
                                                            <Txt
                                                                style={
                                                                    s.history_item_text
                                                                }
                                                            >
                                                                ID: {record.id}
                                                            </Txt>
                                                            <Txt
                                                                style={
                                                                    s.history_item_text
                                                                }
                                                            >
                                                                {record.name}
                                                            </Txt>
                                                            <Txt
                                                                style={
                                                                    s.history_item_author
                                                                }
                                                            >
                                                                Author:{' '}
                                                                {record.author}
                                                            </Txt>
                                                        </View>
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
            </View>
        </MainContainer>
    );
}

const s = StyleSheet.create({
    section_calendar: {
        padding: 10,
        bottom: 100,
        borderRadius: 15,
        overflow: 'hidden',
    },
    sort_container: {
        padding: 10,
    },
    section_search: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    section_list: {
        flex: 9,
        width: '100%',
    },
    search_bar: {
        flexDirection: 'row',
        backgroundColor: AppStyles.color.elem_back,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 20,
        flex: 1,
    },
    history_item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: AppStyles.color.text_faded,
    },
    history_item_text: {
        fontFamily: 'Roboto-regular',
        fontSize: 18,
    },
    history_item_author: {
        fontFamily: 'Roboto-regular',
        fontSize: 16,
        color: AppStyles.color.text_faded,
    },
    picker: {
        height: 50,

        width: 300,
    },
    container: {
        flex: 10,
        backgroundColor: '#888888',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
