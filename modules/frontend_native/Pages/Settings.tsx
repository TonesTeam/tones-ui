import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
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
} from 'sharedlib/dto/liquid.dto';
import { getRequest, makeRequest } from '../common/util';
import Txt from '../components/Txt';
import Search_Icon from '../assets/icons/search.svg';
import Edit_Icon from '../assets/icons/edit_btn.svg';
import Delete_Icon from '../assets/icons/delete_btn.svg';
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
                        <Txt
                            style={{ fontFamily: 'Roboto-bold', fontSize: 20 }}
                        >
                            {props.liquid != null
                                ? 'Updating reagent data'
                                : 'Adding new reagent'}
                        </Txt>
                    </View>
                    {props.categories && (
                        <View style={ms.form}>
                            <ScrollView>
                                <View style={ms.field}>
                                    <Txt style={ms.label}>REAGENT NAME:</Txt>
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
                                    <Txt style={ms.label}>CATEGORY:</Txt>
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
                                        <Txt style={ms.label}>USED COLD:</Txt>
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
                                        <Txt style={ms.label}>TOXIC:</Txt>
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
                            <Txt>Cancel</Txt>
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
                            <Txt style={{ color: AppStyles.color.elem_back }}>
                                {props.liquid != null ? 'Update' : 'Save'}
                            </Txt>
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
    const [filterInput, setFilterInput] = useState('');
    const [active, setActive] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
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
                filterInput === ''
                    ? e
                    : e.name.toLowerCase().includes(filterInput.toLowerCase()),
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

    return (
        <>
            {liquids.length != 0 && categories.length != 0 && (
                <>
                    <View>
                        <View style={lib_s.header}>
                            <View
                                style={[
                                    lib_s.search_bar,
                                    {
                                        borderWidth: 1,
                                        borderColor: active
                                            ? AppStyles.color.primary
                                            : AppStyles.color.elem_back,
                                    },
                                ]}
                            >
                                <Search_Icon
                                    height={30}
                                    width={50}
                                    stroke={AppStyles.color.text_faded}
                                />
                                <TextInput
                                    placeholder="Search by reagent name ..."
                                    value={filterInput}
                                    style={{
                                        fontFamily: 'Roboto-regular',
                                        fontSize: 18,
                                        width: '90%',
                                    }}
                                    onFocus={() => setActive(true)}
                                    onBlur={() => setActive(false)}
                                    onChangeText={(e) =>
                                        setFilterInput(e.toLowerCase())
                                    }
                                />
                            </View>
                            <TouchableOpacity
                                style={lib_s.btn}
                                onPress={() => setEditModal(true)}
                            >
                                <Txt
                                    style={{
                                        color: AppStyles.color.elem_back,
                                        fontFamily: 'Roboto-bold',
                                    }}
                                >
                                    Add New Reagent
                                </Txt>
                            </TouchableOpacity>
                        </View>
                        {filterAndSort().length == 0 && (
                            <View style={[lib_s.list, { borderWidth: 0 }]}>
                                <Txt>No liquids found!</Txt>
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
                                        <Txt
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Reagent name
                                        </Txt>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 2 }]}>
                                        <Txt
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Categoty
                                        </Txt>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 1 }]}>
                                        <Txt
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Toxicity
                                        </Txt>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 1 }]}>
                                        <Txt
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Used cold
                                        </Txt>
                                    </View>
                                    <View style={[lib_s.cell, { flex: 3 }]}>
                                        <Txt
                                            style={{
                                                color: AppStyles.color
                                                    .elem_back,
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Options
                                        </Txt>
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
                                                    <Txt>{liq.name}</Txt>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 2 },
                                                    ]}
                                                >
                                                    <Txt>{liq.type.name}</Txt>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Txt>
                                                        {liq.toxic && 'X'}
                                                    </Txt>
                                                </View>
                                                <View
                                                    style={[
                                                        lib_s.cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Txt>
                                                        {liq.usedCold && 'X'}
                                                    </Txt>
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
                                                        <Edit_Icon
                                                            height={15}
                                                            width={15}
                                                            stroke={
                                                                AppStyles.color
                                                                    .primary
                                                            }
                                                        />
                                                        <Txt
                                                            style={{
                                                                marginLeft: 10,
                                                                color: AppStyles
                                                                    .color
                                                                    .primary,
                                                                letterSpacing: 1.1,
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            EDIT
                                                        </Txt>
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
                                                            deleteLiquid(liq.id)
                                                        }
                                                    >
                                                        <Delete_Icon
                                                            height={15}
                                                            width={15}
                                                            stroke={
                                                                AppStyles.color
                                                                    .warning
                                                            }
                                                        />
                                                        <Txt
                                                            style={{
                                                                marginLeft: 10,
                                                                color: AppStyles
                                                                    .color
                                                                    .warning,
                                                                letterSpacing: 1.1,
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            DELETE
                                                        </Txt>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}
                    </View>

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
                </>
            )}
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

            <View style={[globalElementStyle.page_container]}>
                <View style={{ flex: 1 }}>
                    <View style={s.tab_bar}>
                        <TouchableOpacity
                            style={[
                                s.tab,
                                currentTab == SettingTabs.USER && {
                                    backgroundColor: AppStyles.color.background,
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
                            <Txt
                                style={[
                                    s.tab_text,
                                    currentTab == SettingTabs.USER && {
                                        color: AppStyles.color.primary,
                                        fontWeight: '700',
                                    },
                                ]}
                            >
                                User Settings
                            </Txt>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                s.tab,
                                currentTab == SettingTabs.SYSTEM && {
                                    backgroundColor: AppStyles.color.background,
                                },
                            ]}
                            onPress={() => setCurrentTab(SettingTabs.SYSTEM)}
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
                            <Txt
                                style={[
                                    s.tab_text,
                                    currentTab == SettingTabs.SYSTEM && {
                                        color: AppStyles.color.primary,
                                        fontWeight: '700',
                                    },
                                ]}
                            >
                                System Settings
                            </Txt>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                s.tab,
                                currentTab == SettingTabs.LIBRARY && {
                                    backgroundColor: AppStyles.color.background,
                                },
                            ]}
                            onPress={() => setCurrentTab(SettingTabs.LIBRARY)}
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
                            <Txt
                                style={[
                                    s.tab_text,
                                    currentTab == SettingTabs.LIBRARY && {
                                        color: AppStyles.color.primary,
                                        fontWeight: '700',
                                    },
                                ]}
                            >
                                Reagent Library
                            </Txt>
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
                            <Txt>Page under development</Txt>
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
        </MainContainer>
    );
}

const s = StyleSheet.create({
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
