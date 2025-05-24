import { StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import {
    ReagentStep,
    StepDTO,
    TemperatureStep,
    WashStep,
} from 'sharedlib/dto/step.dto';
import Txt from '../components/Txt';
import { StepType } from 'sharedlib/enum/DBEnums';
import { AppStyles } from '../constants/styles';
import Washing_icon from '../assets/icons/washing_icon.svg';
import Reagent_icon from '../assets/icons/reagent_icon.svg';
import Temperature_icon from '../assets/icons/temperature_icon.svg';
import Edit_icon from '../assets/icons/edit_btn.svg';
import Delete_icon from '../assets/icons/delete_btn.svg';
import AW_icon from '../assets/icons/auto-wash.svg';
import Close_icon from '../assets/icons/X.svg';
import { useState } from 'react';
import { ProtocolSettings } from '../common/constructorUtils';

const iconSize = 18;

function ParamItem(props: { label: string; value: any; measurement?: string }) {
    const st = StyleSheet.create({
        text: {
            color: AppStyles.color.elem_back,
            fontFamily: 'Roboto-bold',
            flex: 1,
            justifyContent: 'flex-start',
        },
        supplementary: {
            fontSize: 13,
            color: '#ffffffcc',
            fontFamily: 'Roboto-thin',
        },
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: 180, //shady workaround for collapsed text
        },
    });
    return (
        <View style={st.container}>
            <Txt style={[st.supplementary, { textTransform: 'uppercase' }]}>
                {props.label}:{' '}
            </Txt>
            <Txt style={st.text} numberOfLines={1} ellipsizeMode={'tail'}>
                {props.value} {props.measurement}
            </Txt>
            {/* <Txt style={st.supplementary}> {props.measurement}</Txt> */}
        </View>
    );
}

interface timelineBlockProps {
    renderParams: RenderItemParams<StepDTO>;
    deleteStep: (step: StepDTO) => void;
    editStep: (step: StepDTO) => void;
    deleteAutoWash: (step: StepDTO) => void;
    settings: ProtocolSettings;
}

export const renderTimelineBlock = (props: timelineBlockProps) => {
    const { item, drag, isActive } = props.renderParams;
    const [deleteModal, setDeleteModal] = useState(false);

    let block = item;

    let blockColor = '';
    switch (block.type) {
        case StepType.WASHING:
            {
                blockColor = isActive
                    ? AppStyles.color.block.transp_washing
                    : AppStyles.color.block.main_washing;
            }
            break;
        case StepType.LIQUID_APPL:
            {
                blockColor = isActive
                    ? AppStyles.color.block.transp_reagent
                    : AppStyles.color.block.main_reagent;
            }
            break;
        case StepType.TEMP_CHANGE:
            {
                blockColor = isActive
                    ? AppStyles.color.block.transp_temperature
                    : AppStyles.color.block.main_temperature;
            }
            break;
    }

    let blockName =
        block.type == StepType.WASHING
            ? 'Washing'
            : block.type == StepType.LIQUID_APPL
              ? 'Reagent'
              : 'Temperature';

    let blockIcon =
        block.type == StepType.WASHING ? (
            <Washing_icon
                height={iconSize}
                width={iconSize}
                fill={AppStyles.color.elem_back}
            />
        ) : block.type == StepType.LIQUID_APPL ? (
            <Reagent_icon
                height={iconSize}
                width={iconSize}
                fill={AppStyles.color.elem_back}
            />
        ) : (
            <Temperature_icon
                height={iconSize}
                width={iconSize}
                fill={AppStyles.color.elem_back}
            />
        );

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onLongPress={drag}
                delayLongPress={220}
                disabled={isActive}
                style={[
                    s.block,
                    {
                        backgroundColor: blockColor,
                    },
                ]}
            >
                <View style={s.upper_part}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <View style={s.icon}>{blockIcon}</View>
                        <Txt
                            style={{
                                color: AppStyles.color.elem_back,
                                fontSize: 16,
                                fontFamily: 'Roboto-bold',
                            }}
                        >
                            {blockName}
                        </Txt>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={[
                                s.btn,
                                {
                                    borderColor: AppStyles.color.text_primary,
                                    borderWidth: 1,
                                },
                            ]}
                            onPress={() => setDeleteModal(true)}
                        >
                            <Delete_icon
                                height={iconSize * 0.8}
                                width={iconSize * 0.8}
                                stroke={AppStyles.color.elem_back}
                            />
                            <Txt
                                style={{
                                    color: AppStyles.color.elem_back,
                                    marginLeft: 8,
                                }}
                            >
                                Delete
                            </Txt>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={s.lower_part}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {block.type == StepType.WASHING && (
                            <>
                                <View style={s.col}>
                                    <ParamItem
                                        label={'With'}
                                        value={
                                            (block.params as WashStep).liquid
                                                .name
                                        }
                                    />
                                    <ParamItem
                                        label={'Incubate for'}
                                        value={
                                            (block.params as WashStep)
                                                .incubation
                                        }
                                        measurement={props.settings.timeUnits}
                                    />
                                </View>
                                <View style={s.col}>
                                    <ParamItem
                                        label={'Iterate for'}
                                        value={(block.params as WashStep).iters}
                                        measurement="time(s)"
                                    />
                                    <ParamItem
                                        label={'At'}
                                        value={
                                            (block.params as WashStep)
                                                .temperature
                                        }
                                        measurement="°C"
                                    />
                                </View>
                            </>
                        )}
                        {block.type == StepType.LIQUID_APPL && (
                            <>
                                <View style={s.col}>
                                    <ParamItem
                                        label={'With'}
                                        value={
                                            (block.params as ReagentStep).liquid
                                                .name
                                        }
                                    />
                                    <ParamItem
                                        label={'Incubate for'}
                                        value={
                                            (block.params as ReagentStep)
                                                .incubation
                                        }
                                        measurement={props.settings.timeUnits}
                                    />
                                </View>
                                <View style={s.col}>
                                    <ParamItem
                                        label={'At'}
                                        value={
                                            (block.params as ReagentStep)
                                                .temperature
                                        }
                                        measurement="°C"
                                    />
                                    {/* <ParamItem
                    label={"Autowash"}
                    value={
                      (block.params as ReagentStep).autoWash == true
                        ? "Yes"
                        : (block.params as ReagentStep).autoWash == undefined
                        ? "Undf"
                        : "No"
                    }
                  /> */}
                                </View>
                            </>
                        )}
                        {block.type == StepType.TEMP_CHANGE && (
                            <>
                                <View style={s.col}>
                                    <ParamItem
                                        label={'From'}
                                        value={
                                            (block.params as TemperatureStep)
                                                .source
                                        }
                                        measurement="°C"
                                    />
                                    <ParamItem
                                        label={'To'}
                                        value={
                                            (block.params as TemperatureStep)
                                                .target
                                        }
                                        measurement="°C"
                                    />
                                </View>
                            </>
                        )}
                        <View
                            style={[
                                s.col,
                                {
                                    alignItems: 'flex-end',
                                    paddingRight: 0,
                                    justifyContent: 'center',
                                    marginRight: 0,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    s.btn,
                                    {
                                        borderColor: AppStyles.color.elem_back,
                                        borderWidth: 1,
                                    },
                                ]}
                                onPress={() => props.editStep(item)}
                            >
                                <Edit_icon
                                    height={iconSize * 0.8}
                                    width={iconSize * 0.8}
                                    stroke={AppStyles.color.elem_back}
                                />
                                <Txt
                                    style={{
                                        color: AppStyles.color.elem_back,
                                        marginLeft: 8,
                                    }}
                                >
                                    Edit
                                </Txt>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {block.type == StepType.LIQUID_APPL &&
                    (block.params as ReagentStep).autoWash == true && (
                        <View style={s.autoWash}>
                            <AW_icon
                                height={20}
                                width={20}
                                style={{ marginRight: 5 }}
                            />
                            <Txt>
                                Auto Washing:{' '}
                                {props.settings.autoWashConfig.iters} x{' '}
                                {props.settings.autoWashConfig.incubation}{' '}
                                {props.settings.timeUnits}
                            </Txt>
                            <TouchableOpacity
                                onPress={() =>
                                    props.deleteAutoWash({
                                        ...block,
                                        params: {
                                            ...block.params,
                                            autoWash: false,
                                        },
                                    })
                                }
                            >
                                <Close_icon
                                    height={25}
                                    width={25}
                                    style={{ marginLeft: 30 }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModal}
                onRequestClose={() => {
                    setDeleteModal(!deleteModal);
                }}
            >
                <View style={s.modal_container}>
                    <View style={s.modal_body}>
                        <Txt style={s.modal_comment}>
                            Are you sure you want to delete this step?
                        </Txt>
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingTop: 40,
                                justifyContent: 'space-between',
                            }}
                        >
                            <TouchableOpacity
                                style={[
                                    s.modal_btn,
                                    {
                                        backgroundColor:
                                            AppStyles.color.primary,
                                    },
                                ]}
                                onPress={() => {
                                    setDeleteModal(false);
                                }}
                            >
                                <Txt style={s.modal_btn_text}>CANCEL</Txt>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    s.modal_btn,
                                    {
                                        backgroundColor:
                                            AppStyles.color.warning,
                                    },
                                ]}
                                onPress={() => {
                                    props.deleteStep(item);
                                    setDeleteModal(false);
                                }}
                            >
                                <Txt style={s.modal_btn_text}>Delete</Txt>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const s = StyleSheet.create({
    block: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        borderRadius: 8,
        paddingHorizontal: '2%',
        paddingVertical: '1%',
    },
    text: {
        color: AppStyles.color.elem_back,
    },
    icon: {
        height: iconSize * 2,
        width: iconSize * 2,
        borderRadius: iconSize * 2,
        backgroundColor: '#0000002b',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10%',
    },

    upper_part: {
        flex: 2,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#ffffff2d',
        borderBottomWidth: 1,
        paddingVertical: '1%',
    },

    lower_part: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '2%',
    },

    btn: {
        width: 120,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#0000003a', // transparent darker on top of block color
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 20,
    },

    col: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginRight: 10,
    },

    autoWash: {
        alignSelf: 'flex-start',
        flex: 1,
        backgroundColor: AppStyles.color.elem_back,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    modal_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#001f6d42',
    },

    modal_body: {
        backgroundColor: AppStyles.color.elem_back,
        borderRadius: 8,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
    },

    modal_comment: {
        color: AppStyles.color.text_primary,
        fontFamily: 'Roboto-bold',
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

    modal_btn_text: {
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
    },
});
