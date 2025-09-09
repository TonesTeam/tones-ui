import {
    StyleSheet,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';
import { useEffect, useState } from 'react';
import {
    LiquidDTO,
    LiquidTypeDTO,
    PermanentLiquidDTO,
} from 'common/dto/liquid.dto';
import { getRequest, makeRequest } from '../common/util';
import User_s_Icon from '../assets/icons/user_settings.svg';
import System_s_Icon from '../assets/icons/system_settings.svg';
import Lib_s_Icon from '../assets/icons/reag_lib_settings.svg';
import InputField from '../components/InputField';
import { CustomSelect } from '../components/Select';
import { Switch } from 'react-native-switch';
import { Method } from 'axios';
import InfoModal from '../components/InfoModal';
import { InfoType } from '../common/types';
import { useIsFocused } from '@react-navigation/native';
import {
    Box,
    Heading,
    Icon,
    Text,
    Spinner,
    ScrollView,
    Button,
    ButtonText,
} from '@gluestack-ui/themed';
import { Trash, Pencil, CirclePlus } from 'lucide-react-native';
import ConfirmationModal from '../common/TonesModal';
import SearchBar from '../components/SearchBar';

enum SettingTabs {
    USER = 'User Settings',
    SYSTEM = 'System Settings',
    LIBRARY = 'Reagent Library',
}

function LiquidsModal(props: {
    liquid: PermanentLiquidDTO | null;
    categories: LiquidTypeDTO[];
    closeModal: () => void;
    saveLiquid: (liq: PermanentLiquidDTO) => void;
}) {
    const [newLiquid, setNewLiquid] = useState<PermanentLiquidDTO>(
        props.liquid
            ? props.liquid
            : ({
                  id: 0,
                  name: '',
                  type: props.categories[0],
                  usedCold: false,
                  toxic: false,
              } as PermanentLiquidDTO),
    );

    const ms = StyleSheet.create({
        modal_container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#001f6d42',
        },

        modal_body: {
            backgroundColor: AppStyles.color.elem_back,
            borderRadius: 8,
            paddingHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 15,
            height: Dimensions.get('window').height * 0.8,
            width: Dimensions.get('window').width * 0.35,
        },

        header: {
            flex: 2,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },

        form: {
            flex: 15,
            flexDirection: 'column',
        },
        footer: {
            flex: 3,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },

        modal_btn: {
            width: 150,
            height: 50,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginHorizontal: 20,
        },

        field: {
            flexDirection: 'column',
            marginVertical: 10,
            flex: 1,
        },
        label: {
            fontFamily: 'Roboto-thin',
            textTransform: 'uppercase',
            color: AppStyles.color.accent_dark,
            marginBottom: 5,
        },
    });
    return (
        <View style={ms.modal_container}>
            <ScrollView
                scrollEnabled={false}
                contentContainerStyle={{
                    marginTop: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View style={ms.modal_body}>
                    <View style={ms.header}>
                        <Text
                            style={{ fontFamily: 'Roboto-bold', fontSize: 20 }}
                        >
                            {props.liquid != null
                                ? 'Updating reagent data'
                                : 'Adding new reagent'}
                        </Text>
                    </View>
                    {props.categories && (
                        <View style={ms.form}>
                            <ScrollView>
                                <View style={ms.field}>
                                    <Text style={ms.label}>REAGENT NAME:</Text>
                                    <InputField
                                        value={newLiquid.name}
                                        onInputChange={(text) =>
                                            setNewLiquid({
                                                ...newLiquid,
                                                name: text,
                                            })
                                        }
                                    />
                                </View>
                                <View style={ms.field}>
                                    <Text style={ms.label}>CATEGORY:</Text>
                                    <CustomSelect
                                        list={props.categories}
                                        selected={newLiquid.type}
                                        canAdd={false}
                                        onChangeSelect={(cat) =>
                                            setNewLiquid({
                                                ...newLiquid,
                                                type: cat,
                                            })
                                        }
                                    />
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={ms.field}>
                                        <Text style={ms.label}>USED COLD:</Text>
                                        <Switch
                                            value={newLiquid.usedCold}
                                            onValueChange={(val) => {
                                                setNewLiquid({
                                                    ...newLiquid,
                                                    usedCold: val,
                                                });
                                            }}
                                            containerStyle={{ marginLeft: 10 }}
                                            activeText={'YES'}
                                            inActiveText={'NO'}
                                            circleSize={40}
                                            barHeight={40}
                                            circleBorderWidth={1}
                                            backgroundActive={
                                                AppStyles.color.primary
                                            }
                                            backgroundInactive={
                                                AppStyles.color.accent_dark
                                            }
                                            circleActiveColor={
                                                AppStyles.color.elem_back
                                            }
                                            circleInActiveColor={
                                                AppStyles.color.elem_back
                                            }
                                            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                                            innerCircleStyle={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }} // style for inner animated circle for what you (may) be rendering inside the circle
                                            outerCircleStyle={{}} // style for outer animated circle
                                            renderActiveText={true}
                                            renderInActiveText={true}
                                            switchLeftPx={1} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                            switchRightPx={1} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                            switchWidthMultiplier={3.1} // multiplied by the `circleSize` prop to calculate total width of the Switch
                                            switchBorderRadius={10} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                                        />
                                    </View>
                                    <View style={ms.field}>
                                        <Text style={ms.label}>TOXIC:</Text>
                                        <Switch
                                            value={newLiquid.toxic}
                                            onValueChange={(val) => {
                                                setNewLiquid({
                                                    ...newLiquid,
                                                    toxic: val,
                                                });
                                            }}
                                            activeText={'YES'}
                                            inActiveText={'NO'}
                                            circleSize={40}
                                            barHeight={40}
                                            circleBorderWidth={1}
                                            backgroundActive={
                                                AppStyles.color.primary
                                            }
                                            backgroundInactive={
                                                AppStyles.color.accent_dark
                                            }
                                            circleActiveColor={
                                                AppStyles.color.elem_back
                                            }
                                            circleInActiveColor={
                                                AppStyles.color.elem_back
                                            }
                                            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                                            innerCircleStyle={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }} // style for inner animated circle for what you (may) be rendering inside the circle
                                            outerCircleStyle={{}} // style for outer animated circle
                                            renderActiveText={true}
                                            renderInActiveText={true}
                                            switchLeftPx={1} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                            switchRightPx={1} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                            switchWidthMultiplier={3.1} // multiplied by the `circleSize` prop to calculate total width of the Switch
                                            switchBorderRadius={10} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    <View style={ms.footer}>
                        <TouchableOpacity
                            style={[
                                ms.modal_btn,
                                {
                                    backgroundColor: AppStyles.color.elem_back,
                                    borderWidth: 1,
                                    borderColor: AppStyles.color.accent_dark,
                                },
                            ]}
                            onPress={() => props.closeModal()}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                ms.modal_btn,
                                { backgroundColor: AppStyles.color.primary },
                            ]}
                            onPress={() => {
                                if (newLiquid.name.trim() != '') {
                                    props.saveLiquid(newLiquid);
                                    props.closeModal();
                                }
                            }}
                        >
                            <Text style={{ color: AppStyles.color.elem_back }}>
                                {props.liquid != null ? 'Update' : 'Save'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function Library(props: {
    toggleLiquidUpdateModal: (val: boolean) => void;
    toggleLiquidDeleteModal: (val: boolean) => void;
}) {
    const [liquids, setLiquids] = useState<PermanentLiquidDTO[]>([]);
    const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
    const [searchPrompt, setSearchPrompt] = useState('');
    const [active, setActive] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(-1);
    const [editedLiquid, setEditedLiquid] = useState<PermanentLiquidDTO | null>(
        null,
    );
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            listInitilizer();
        } else {
            setLiquids([]);
        }
    }, [isFocused]);

    const idToName = (id: number) => {
        console.log(id);
        for (const liquid of liquids) {
            if (liquid.id === id) return liquid.name;
        }
        return '';
    };

    const listInitilizer = () => {
        getRequest<PermanentLiquidDTO[]>('/liquids').then((r) => {
            setLiquids(r.data);
        });

        getRequest<LiquidTypeDTO[]>('/types').then((r) => {
            setCategories(r.data);
        });

        setEditedLiquid(null);
    };

    useEffect(listInitilizer, []);

    function saveOrUpdateLiquid(liq: PermanentLiquidDTO) {
        makeRequest('POST' as Method, '/liquid/save', JSON.stringify(liq))
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    props.toggleLiquidUpdateModal(true);
                    listInitilizer(); //workaround. buggy. TODO: pass rigger from parent (Settings)
                } else props.toggleLiquidUpdateModal(false);
            })
            .catch((err) => {
                console.log(err.message);
                props.toggleLiquidUpdateModal(false);
            });
    }

    function deleteLiquid(id: number) {
        makeRequest('DELETE' as Method, `/liquid/delete/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    props.toggleLiquidDeleteModal(true);
                    listInitilizer();
                } else {
                    props.toggleLiquidDeleteModal(false);
                }
            })
            .catch((err) => {
                console.log(err.message);
                props.toggleLiquidDeleteModal(false);
            });
    }

    function filterAndSort() {
        if (liquids) {
            let filteredList = liquids.filter((e) =>
                searchPrompt === ''
                    ? e
                    : e.name.toLowerCase().includes(searchPrompt.toLowerCase()),
            );
            let sortedList = filteredList;
            return sortedList;
        } else return [] as PermanentLiquidDTO[];
    }

    const lib_s = StyleSheet.create({
        header: {
            width: '100%',
            flex: 1,
            flexDirection: 'row',
        },
        list: {
            flex: 11,
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: AppStyles.color.accent_back,
            overflow: 'hidden',
            marginBottom: 30,
        },
        btn: {
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: '2%',
            backgroundColor: AppStyles.color.secondary,
            borderRadius: 8,
        },

        search_bar: {
            flex: 6,
            flexDirection: 'row',
            backgroundColor: AppStyles.color.elem_back,
            alignItems: 'center',
            borderRadius: 10,
            marginRight: 30,
        },

        row: {
            flexDirection: 'row',
            width: '100%',
            height: 50,
            borderBottomColor: AppStyles.color.accent_back,
            borderBottomWidth: 2,
        },

        cell: {
            alignItems: 'center',
            justifyContent: 'center',
            borderLeftWidth: 1,
            borderLeftColor: AppStyles.color.accent_back,
            borderRightWidth: 1,
            borderRightColor: AppStyles.color.accent_back,
        },

        option_cell: {
            flex: 1,
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    if (liquids.length === 0 || categories.length === 0) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" color="grey" />
            </Box>
        );
    }

    return (
        <>
            {liquids.length != 0 && categories.length != 0 && (
                <>
                    <View>
                        <View style={lib_s.header}>
                            <SearchBar
                                value={searchPrompt}
                                onChangeText={(e) => setSearchPrompt(e)}
                            />
                            <Button
                                ml="$2"
                                onPress={() => setEditModal(true)}
                                action="primary"
                                variant="solid"
                            >
                                <Icon as={CirclePlus} color="white" />
                                <ButtonText ml="$2" color="white">
                                    Add new reagent
                                </ButtonText>
                            </Button>
                        </View>
                        {filterAndSort().length == 0 && (
                            <View style={[lib_s.list, { borderWidth: 0 }]}>
                                <Text>No liquids found!</Text>
                            </View>
                        )}
                        {filterAndSort().length != 0 && (
                            <View style={lib_s.list}>
                                <View
                                    style={[
                                        lib_s.row,
                                        {
                                            backgroundColor:
                                                AppStyles.color.accent_dark,
                                            height: 40,
                                        },
                                    ]}
                                >
                                    <View style={[lib_s.cell, { flex: 3 }]}>
                                        <Text
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Reagent name
                                        </Text>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 2 }]}>
                                        <Text
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Categoty
                                        </Text>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 1 }]}>
                                        <Text
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Toxicity
                                        </Text>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 1 }]}>
                                        <Text
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Used cold
                                        </Text>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 3 }]}>
                                        <Text
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Options
                                        </Text>
                                    </View>
                                </View>
                                <ScrollView>
                                    {filterAndSort().map((liq, index) => {
                                        return (
                                            <View
                                                key={index}
                                                style={[
                                                    lib_s.row,
                                                    {
                                                        backgroundColor:
                                                            index % 2 != 0
                                                                ? AppStyles
                                                                      .color
                                                                      .background
                                                                : AppStyles
                                                                      .color
                                                                      .elem_back,
                                                    },
                                                    index ==
                                                        liquids.length - 1 && {
                                                        borderBottomLeftRadius: 10,
                                                        borderBottomRightRadius: 10,
                                                    },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 3 },
                                                    ]}
                                                >
                                                    <Text>{liq.name}</Text>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 2 },
                                                    ]}
                                                >
                                                    <Text>{liq.type.name}</Text>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Text>
                                                        {liq.toxic && 'X'}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Text>
                                                        {liq.usedCold && 'X'}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        {
                                                            flex: 3,
                                                            flexDirection:
                                                                'row',
                                                        },
                                                    ]}
                                                >
                                                    <TouchableOpacity
                                                        style={[
                                                            lib_s.option_cell,
                                                            {
                                                                borderRightColor:
                                                                    AppStyles
                                                                        .color
                                                                        .background,
                                                                borderRightWidth: 0.5,
                                                            },
                                                        ]}
                                                        onPress={() => {
                                                            setEditedLiquid(
                                                                liq,
                                                            );
                                                            setEditModal(true);
                                                        }}
                                                    >
                                                        <Icon
                                                            as={Pencil}
                                                            color="$primary500"
                                                        />
                                                        <Text
                                                            color="$primary500"
                                                            ml="$2"
                                                        >
                                                            Edit
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[
                                                            lib_s.option_cell,
                                                            {
                                                                borderLeftColor:
                                                                    AppStyles
                                                                        .color
                                                                        .accent_back,
                                                                borderLeftWidth: 0.5,
                                                            },
                                                        ]}
                                                        onPress={() =>
                                                            setDeleteModal(
                                                                liq.id,
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            as={Trash}
                                                            color="$error500"
                                                        />
                                                        <Text
                                                            ml="$2"
                                                            color="$error500"
                                                        >
                                                            Delete
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={editModal}
                            onRequestClose={() => {
                                setEditModal(!editModal);
                            }}
                        >
                            <LiquidsModal
                                liquid={editedLiquid}
                                categories={categories}
                                closeModal={() => setEditModal(false)}
                                saveLiquid={(liq) => saveOrUpdateLiquid(liq)}
                            />
                        </Modal>
                    </View>
                </>
            )}
            <ConfirmationModal
                isOpen={deleteModal != -1}
                onClose={() => setDeleteModal(-1)}
                action={() => deleteLiquid(deleteModal)}
                icon={Trash}
                headline={`Delete reagent "${idToName(deleteModal)}"`}
                text="Are you sure you want to delete this reagent? This action cannot be undone."
                actionButtonText="Delete"
                type="error"
            />
        </>
    );
}

export default function Settings(props: any) {
    const [currentTab, setCurrentTab] = useState<SettingTabs>(
        SettingTabs.LIBRARY,
    );
    const [liquidUpdateModal, setLiquidUpdateModal] = useState<
        boolean | undefined
    >(undefined);
    const [liquidDeleteModal, setLiquidDeleteModal] = useState<
        boolean | undefined
    >(undefined);

    return (
        <MainContainer>
            <NavBar />

            <Box style={s.wrapper}>
                <Heading size="2xl">Settings</Heading>
                <View style={[globalElementStyle.page_container]}>
                    <View style={{ flex: 1 }}>
                        <View style={s.tab_bar}>
                            <TouchableOpacity
                                style={[
                                    s.tab,
                                    currentTab == SettingTabs.USER && {
                                        backgroundColor:
                                            AppStyles.color.background,
                                    },
                                ]}
                                onPress={() => setCurrentTab(SettingTabs.USER)}
                            >
                                <View
                                    style={[
                                        s.tab_icon,
                                        currentTab == SettingTabs.USER && {
                                            backgroundColor:
                                                AppStyles.color.elem_back,
                                        },
                                    ]}
                                >
                                    <User_s_Icon
                                        height={20}
                                        width={20}
                                        fill={AppStyles.color.accent_dark}
                                    />
                                </View>
                                <Text
                                    style={[
                                        s.tab_text,
                                        currentTab == SettingTabs.USER && {
                                            color: AppStyles.color.primary,
                                            fontWeight: '700',
                                        },
                                    ]}
                                >
                                    User Settings
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    s.tab,
                                    currentTab == SettingTabs.SYSTEM && {
                                        backgroundColor:
                                            AppStyles.color.background,
                                    },
                                ]}
                                onPress={() =>
                                    setCurrentTab(SettingTabs.SYSTEM)
                                }
                            >
                                <View
                                    style={[
                                        s.tab_icon,
                                        currentTab == SettingTabs.SYSTEM && {
                                            backgroundColor:
                                                AppStyles.color.elem_back,
                                        },
                                    ]}
                                >
                                    <System_s_Icon
                                        height={22}
                                        width={22}
                                        fill={AppStyles.color.accent_dark}
                                    />
                                </View>
                                <Text
                                    style={[
                                        s.tab_text,
                                        currentTab == SettingTabs.SYSTEM && {
                                            color: AppStyles.color.primary,
                                            fontWeight: '700',
                                        },
                                    ]}
                                >
                                    System Settings
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    s.tab,
                                    currentTab == SettingTabs.LIBRARY && {
                                        backgroundColor:
                                            AppStyles.color.background,
                                    },
                                ]}
                                onPress={() =>
                                    setCurrentTab(SettingTabs.LIBRARY)
                                }
                            >
                                <View
                                    style={[
                                        s.tab_icon,
                                        currentTab == SettingTabs.LIBRARY && {
                                            backgroundColor:
                                                AppStyles.color.elem_back,
                                        },
                                    ]}
                                >
                                    <Lib_s_Icon
                                        height={20}
                                        width={20}
                                        fill={AppStyles.color.accent_dark}
                                    />
                                </View>
                                <Text
                                    style={[
                                        s.tab_text,
                                        currentTab == SettingTabs.LIBRARY && {
                                            color: AppStyles.color.primary,
                                            fontWeight: '700',
                                        },
                                    ]}
                                >
                                    Reagent Library
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.body}>
                            {currentTab == SettingTabs.LIBRARY && (
                                <Library
                                    toggleLiquidUpdateModal={(val) =>
                                        setLiquidUpdateModal(val)
                                    }
                                    toggleLiquidDeleteModal={(val) =>
                                        setLiquidDeleteModal(val)
                                    }
                                />
                            )}
                            {currentTab != SettingTabs.LIBRARY && (
                                <Text>Page under development</Text>
                            )}
                        </View>
                        {liquidUpdateModal != undefined && (
                            <InfoModal
                                type={InfoType.UPDATE}
                                result={liquidUpdateModal}
                                text={'Liquid'}
                                unsetVisible={() => {
                                    setLiquidUpdateModal(undefined);
                                }}
                                //actionDuring={() => listInitilizer()}
                            />
                        )}
                        {liquidDeleteModal != undefined && (
                            <InfoModal
                                type={InfoType.DELETE}
                                result={liquidDeleteModal}
                                text={'Liquid'}
                                unsetVisible={() => {
                                    setLiquidUpdateModal(undefined);
                                }}
                                //actionDuring={() => listInitilizer()}
                            />
                        )}
                    </View>
                </View>
            </Box>
        </MainContainer>
    );
}

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    tab_bar: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        marginRight: 18,
    },

    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: AppStyles.color.background,
        borderRightWidth: 1,
        borderRightColor: AppStyles.color.background,
        backgroundColor: AppStyles.color.elem_back,
    },

    tab_text: {
        textTransform: 'uppercase',
        color: AppStyles.color.text_primary,
        fontSize: 18,
        fontFamily: 'Roboto-thin',
    },

    tab_icon: {
        height: 40,
        width: 40,
        borderRadius: 40,
        backgroundColor: AppStyles.color.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    body: {
        width: '100%',
        flex: 10,
        alignItems: 'center',
        marginTop: 20,
        marginRight: 18,
        paddingHorizontal: '3%',
    },

    btn: {
        borderRadius: 8,
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        alignItems: 'center',
        borderWidth: 1,
    },
});
