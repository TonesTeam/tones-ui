import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TextInput,
    Animated,
    Easing,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';
import { ProtocolDto } from 'sharedlib/dto/protocol.dto';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { getRequest, makeRequest } from '../common/util';
import Txt from '../components/Txt';
import Search_Icon from '../assets/icons/search.svg';
import Arrow_Icon from '../assets/icons/arrow-down.svg';
import NotFound_Icon from '../assets/icons/question.svg';
import Launch_btn_Icon from '../assets/icons/launch_btn.svg';
import Template_btn_Icon from '../assets/icons/template_btn.svg';
import Edit_btn_Icon from '../assets/icons/edit_btn.svg';
import Delete_btn_Icon from '../assets/icons/delete_btn.svg';
import { ScrollView } from 'react-native-gesture-handler';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Method } from 'axios';
import InfoModal from '../components/InfoModal';
import { useIsFocused } from '@react-navigation/native';
import { InfoType } from '../common/types';
import { LinearGradient } from 'expo-linear-gradient';

function ProtocolItem(props: {
    protocol: ProtocolDto;
    navigation: NativeStackNavigationProp<any>;
    toggleDeletionModal: (val: boolean) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    //const dispatch = useAppDispatch();
    let disableLaunch = useAppSelector((state) => state.isRunning);
    let protoInList = useAppSelector((state) => state.protocols).find(
        (e) => e.protocol.id == props.protocol.id,
    );

    let protocolStatus: string;
    if (protoInList != undefined) {
        switch (protoInList.status) {
            case 'ONGOING':
                protocolStatus = 'Ongoing';
                break;
            case 'ERROR':
                protocolStatus = 'Error occured';
                break;
            case 'FINISHED':
                protocolStatus = 'Finished';
                break;
            default:
                protocolStatus = 'Undefined';
        }
    } else if (useAppSelector((state) => state.protocols).length == 0) {
        protocolStatus = 'Ready to launch';
    } else {
        protocolStatus = 'Launch prohibited';
    }

    const animatedController = useRef(new Animated.Value(0)).current;
    const [bodySectionHeight, setBodySectionHeight] = useState(0);

    const bodyHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bodySectionHeight],
    });

    const arrowAngle = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: ['0rad', `${Math.PI}rad`],
    });

    const toggleListItem = () => {
        Animated.timing(animatedController, {
            toValue: expanded ? 0 : 1,
            duration: 400,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();

        setExpanded(!expanded);
    };

    const deleteProtocol = (id: number) => {
        makeRequest('DELETE' as Method, `/protocol/delete/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    props.toggleDeletionModal(true);
                } else {
                    props.toggleDeletionModal(false);
                }
            })
            .catch((err) => {
                console.log(err.message);
                props.toggleDeletionModal(false);
            });
    };

    const ps = StyleSheet.create({
        proto_box: {
            width: '100%',
            height: 'auto',
            borderRadius: 8,
            backgroundColor: AppStyles.color.elem_back,
            paddingHorizontal: '2%',
            paddingVertical: 1,
            marginBottom: 20,
        },
        header: {
            flexDirection: 'row',
            paddingVertical: '2%',
        },

        header_box: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },

        bold_label: {
            fontFamily: 'Roboto-bold',
            fontSize: 16,
            marginLeft: 5,
        },

        thin_label: {
            fontFamily: 'Roboto-thin',
            fontSize: 16,
        },

        status_span: {
            width: 'auto',
            backgroundColor: AppStyles.color.primary_faded,
            paddingVertical: '1%',
            paddingHorizontal: '4%',
            borderRadius: 15,
            marginLeft: 10,
            alignItems: 'center',
        },

        body_container: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            paddingVertical: 10,
        },

        body: {
            overflow: 'hidden',
            height: bodyHeight,
            alignItems: 'center',
            borderTopColor: AppStyles.color.background,
            borderTopWidth: 1,
            borderBottomColor: AppStyles.color.background,
            borderBottomWidth: 1,
        },

        button_panel: {
            flex: 1,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },

        button: {
            borderRadius: 8,
            padding: 10,
            width: '23%',
            backgroundColor: AppStyles.color.elem_back,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: AppStyles.color.background,
        },
    });

    return (
        <View
            style={[
                ps.proto_box,
                expanded && {
                    borderColor: AppStyles.color.primary,
                    borderWidth: 1,
                },
            ]}
        >
            <TouchableWithoutFeedback onPress={() => toggleListItem()}>
                <View style={ps.header}>
                    <View style={ps.header_box}>
                        <Txt style={ps.thin_label}>ID:</Txt>
                        <Txt style={ps.bold_label}>{props.protocol.id}</Txt>
                        <View style={ps.status_span}>
                            <Txt
                                style={{
                                    fontSize: 12,
                                    fontFamily: 'Roboto-bold',
                                    color: AppStyles.color.primary,
                                }}
                            >
                                Ready to launch
                            </Txt>
                        </View>
                    </View>
                    <View style={ps.header_box}>
                        <Txt style={ps.thin_label}>Name:</Txt>
                        <Txt style={ps.bold_label}>{props.protocol.name}</Txt>
                    </View>
                    <View style={ps.header_box}>
                        <Txt style={ps.thin_label}>Author:</Txt>
                        <Txt style={ps.bold_label}>{props.protocol.author}</Txt>
                    </View>
                    <View style={ps.header_box}>
                        <Txt style={ps.thin_label}>Date of creation:</Txt>
                        <Txt style={ps.bold_label}>
                            {new Date(
                                props.protocol.creationDate,
                            ).toLocaleDateString()}
                        </Txt>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Animated.View style={ps.body}>
                <View
                    onLayout={(event) => {
                        setBodySectionHeight(event.nativeEvent.layout.height);
                    }}
                    style={ps.body_container}
                >
                    {props.protocol.description ? (
                        <Txt>Description: {props.protocol.description}</Txt>
                    ) : (
                        <Txt style={s.no_description}>
                            no description provided
                        </Txt>
                    )}
                    <View style={ps.button_panel}>
                        <TouchableOpacity
                            style={[
                                ps.button,
                                { backgroundColor: AppStyles.color.primary },
                            ]}
                            onPress={() =>
                                props.navigation.navigate('Launch', {
                                    protocol_ID: props.protocol.id,
                                })
                            }
                        >
                            <Launch_btn_Icon
                                width={20}
                                height={20}
                                stroke={'#fff'}
                            />
                            <Txt
                                style={{
                                    marginLeft: 8,
                                    color: AppStyles.color.elem_back,
                                }}
                            >
                                Prepare to Launch
                            </Txt>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ps.button}
                            onPress={() =>
                                props.navigation.navigate('Create protocol', {
                                    protocol_ID: props.protocol.id,
                                    preserveID: false,
                                })
                            }
                        >
                            <Template_btn_Icon
                                width={20}
                                height={20}
                                stroke={AppStyles.color.text_primary}
                            />
                            <Txt style={{ marginLeft: 8 }}>Use as Template</Txt>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ps.button}
                            onPress={() =>
                                props.navigation.navigate('Create protocol', {
                                    protocol_ID: props.protocol.id,
                                    preserveID: true,
                                })
                            }
                        >
                            <Edit_btn_Icon
                                width={20}
                                height={20}
                                stroke={AppStyles.color.text_primary}
                            />
                            <Txt style={{ marginLeft: 8 }}>Edit protocol</Txt>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ps.button}
                            onPress={() => deleteProtocol(props.protocol.id)}
                        >
                            <Delete_btn_Icon
                                width={20}
                                height={20}
                                stroke={AppStyles.color.warning}
                            />
                            <Txt style={{ marginLeft: 8 }}>Delete</Txt>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
            <TouchableOpacity
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={() => toggleListItem()}
            >
                <Animated.View style={{ transform: [{ rotateX: arrowAngle }] }}>
                    <Arrow_Icon
                        height={40}
                        width={60}
                        stroke={AppStyles.color.text_faded}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
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
                    <View
                        style={[
                            s.search_bar,
                            active && {
                                borderWidth: 2,
                                borderColor: AppStyles.color.primary,
                            },
                            { flex: 5 },
                        ]}
                    >
                        <Search_Icon
                            height={30}
                            width={60}
                            stroke={AppStyles.color.text_faded}
                        />
                        <TextInput
                            placeholder="Search by protocol name"
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
