import {
    StyleSheet,
    View,
    TouchableOpacity,
    Vibration,
    Modal,
    ScrollView,
    Dimensions,
    InputModeOptions,
    FlatList,
    FlatListProps,
    Animated,
    Easing,
} from 'react-native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';
import Txt from '../components/Txt';
import Washing_icon from '../assets/icons/washing_icon.svg';
import Reagent_icon from '../assets/icons/reagent_icon.svg';
import Temperature_icon from '../assets/icons/temperature_icon.svg';
import React, {
    ForwardedRef,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import { LiquidDTO } from 'sharedlib/dto/liquid.dto';
import DraggableFlatList, {
    DraggableFlatListProps,
} from 'react-native-draggable-flatlist';
import {
    ReagentStep,
    StepDTO,
    TemperatureStep,
    WashStep,
} from 'sharedlib/dto/step.dto';
import { StepType } from 'sharedlib/enum/DBEnums';
import { SvgProps } from 'react-native-svg';
import WorkBlock from './Block';
import { renderTimelineBlock } from './TimeLineBlock';
import {
    ProtocolSettings,
    updateTemperature,
} from '../common/constructorUtils';
import InputField from '../components/InputField';
import Close_icon from '../assets/icons/close.svg';
import Point_icon from '../assets/icons/point.svg';
import {
    DEFAULT_TEMEPRATURE,
    DEFAULT_WASH_STEP,
} from '../constants/protocol_constants';
import { ProtocolWithStepsDTO } from 'sharedlib/dto/protocol.dto';
import { getRequest, makeRequest } from '../common/util';
import { CustomSelect } from '../components/Select';
import RadioButton from '../components/RadioButton';
import { Method } from 'axios';
import InfoModal from '../components/InfoModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InfoType } from '../common/types';
import { LinearGradient } from 'expo-linear-gradient';
import App from '../App';

export const stepTypeClass = new Map<StepType, string>([
    [StepType.WASHING, 'washing'],
    [StepType.LIQUID_APPL, 'reagent'],
    [StepType.TEMP_CHANGE, 'temperature'],
]);

function StepTab(props: {
    type: StepType;
    active: boolean;
    onPress: () => void;
}) {
    let params = {
        main_color:
            AppStyles.color.block[
                `main_${stepTypeClass.get(props.type)}` as keyof typeof AppStyles.color.block
            ],
        back_color:
            AppStyles.color.block[
                `faded_${stepTypeClass.get(props.type)}` as keyof typeof AppStyles.color.block
            ],
        icon: {} as React.FC<SvgProps>,
    };
    switch (props.type) {
        case StepType.WASHING:
            {
                params.icon = Washing_icon;
            }
            break;
        case StepType.LIQUID_APPL:
            {
                params.icon = Reagent_icon;
            }
            break;
        case StepType.TEMP_CHANGE:
            {
                params.icon = Temperature_icon;
            }
            break;
    }
    return (
        <TouchableOpacity
            style={[
                s.tab,
                {
                    backgroundColor: props.active
                        ? params.back_color
                        : AppStyles.color.elem_back,
                },
            ]}
            onPressIn={props.onPress}
        >
            <View
                style={[
                    s.tab_icon,
                    {
                        backgroundColor: props.active
                            ? params.main_color
                            : AppStyles.color.background,
                    },
                ]}
            >
                <params.icon
                    height={25}
                    width={25}
                    fill={
                        props.active
                            ? AppStyles.color.elem_back
                            : AppStyles.color.text_faded
                    }
                />
            </View>
            <Txt
                style={[
                    s.tab_label,
                    {
                        color: props.active
                            ? AppStyles.color.text_primary
                            : AppStyles.color.text_faded,
                        fontWeight: props.active ? 'bold' : 'normal',
                    },
                ]}
            >
                {stepTypeClass.get(props.type)}
            </Txt>
        </TouchableOpacity>
    );
}

export default function Constructor({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const protocol_ID = route.params
        ? (route.params as { protocol_ID: number }).protocol_ID
        : undefined;
    const [blocks, setBlocks] = useState<StepDTO[]>([]); //All steps
    const [workBlock, setWorkBlock] = useState<StepDTO>(); //Currently edited block
    const [currentTemp, setCurrentTemp] = useState(DEFAULT_TEMEPRATURE); //Last temperature used in steps
    const [preSaveModal, setPreSaveModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>([]);
    const [protocolName, setProtocolName] = useState('');
    const [protocolDescription, setProtocolDescription] = useState('');
    const [defaultWashStep, setDefaultWashStep] = useState<
        WashStep | undefined
    >(undefined);
    const [settings, setSettings] = useState<ProtocolSettings>();
    const [tempSettings, setTempSettings] = useState<ProtocolSettings>();
    const [washLiquids, setWashLiquids] = useState<LiquidDTO[]>([]);
    const [successSaving, setSuccessSaving] = useState<boolean | undefined>(
        undefined,
    );
    const flatListRef: MutableRefObject<any> = useRef(null);

    function initialization() {
        if (protocol_ID) {
            getRequest<ProtocolWithStepsDTO>(
                `/protocol/${protocol_ID.toString()}`,
            ).then((r) => {
                setCustomLiquids(r.data.customLiquids);
                setDefaultWashStep(r.data.defaultWash);
                setProtocolName(r.data.name);
                handleBlocksChange(r.data.steps);
            });
        } else {
            getRequest<LiquidDTO[]>(`/liquids`).then((r) => {
                setWashLiquids(r.data.filter((liq) => liq.type.id == 2));
                let defaultWashing = {
                    iters: 1,
                    incubation: 10,
                    liquid: r.data.filter((liq) => liq.type.id == 2)[0],
                    temperature: null,
                } as WashStep;
                setDefaultWashStep(defaultWashing);
            });
        }
    }

    useEffect(() => {
        initialization();
    }, []);

    useEffect(() => {
        setSettings({
            autoWashConfig: defaultWashStep,
            timeUnits: 'sec',
            description: '',
        } as ProtocolSettings);

        setTempSettings({
            autoWashConfig: defaultWashStep,
            timeUnits: 'sec',
            description: '',
        } as ProtocolSettings);
    }, [defaultWashStep]);

    function updateCustomLiquids(newLiquids: LiquidDTO[]) {
        setCustomLiquids(newLiquids);
    }

    function addBlock(newBlock: StepDTO) {
        const newID =
            blocks.length == 0
                ? 0
                : blocks.length == 1
                  ? 1
                  : blocks.reduce((prev, current) =>
                        prev && prev.id > current.id ? prev : current,
                    ).id + 1;

        const finalBlocks = [
            ...blocks,
            {
                type: newBlock.type,
                id: newBlock.id == -1 ? newID : newBlock.id,
                params:
                    newBlock.type == StepType.TEMP_CHANGE
                        ? newBlock.params
                        : { ...newBlock.params, temperature: currentTemp },
            } as StepDTO,
        ];

        handleBlocksChange(finalBlocks);
        setWorkBlock(undefined);
    }

    function editBlock(editedBlock: StepDTO) {
        let index = blocks.findIndex((x) => x.id == editedBlock.id);
        let newBlocks = [...blocks];

        if (editedBlock.type == StepType.TEMP_CHANGE) {
            let newTemp = (editedBlock.params as TemperatureStep)
                .target as number;
            setCurrentTemp(newTemp);
        }

        let newEdited = { ...newBlocks[index] };
        newEdited.params = editedBlock.params;
        newEdited.type = editedBlock.type;

        newBlocks[index] = newEdited;
        handleBlocksChange(newBlocks);
        setWorkBlock(undefined);
    }

    function revealWorkBlock(step_data: StepDTO) {
        setWorkBlock(step_data);
    }

    function deleteBlock(blockToRemove: StepDTO) {
        const newBlocks = blocks.filter(
            (block) => block.id !== blockToRemove.id,
        );
        handleBlocksChange(newBlocks);
    }

    function handleBlocksChange(blocks: StepDTO[]) {
        let [newBlocks, newCurrentTemperature] = updateTemperature(blocks);
        setBlocks(newBlocks);
        setCurrentTemp(newCurrentTemperature);
    }

    function save() {
        let new_protocol = {
            id: protocol_ID ? protocol_ID : -1,
            name: protocolName,
            customLiquids: customLiquids.map((liq) => {
                return { ...liq, id: 0 };
            }),
            description: protocolDescription,
            steps: blocks,
            creationDate: new Date(),
            defaultWash: settings?.autoWashConfig,
            author: null,
        } as ProtocolWithStepsDTO;

        console.log(JSON.stringify(new_protocol));

        makeRequest(
            'POST' as Method,
            '/protocol/save',
            JSON.stringify(new_protocol),
        )
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) setSuccessSaving(true);
                else setSuccessSaving(false);
            })
            .catch((err) => {
                console.log(err.message);
                setSuccessSaving(false);
            });
    }

    return (
        <MainContainer>
            <NavBar />
            {settings != undefined &&
                defaultWashStep != undefined &&
                tempSettings != undefined &&
                tempSettings.autoWashConfig && (
                    <>
                        <View style={[globalElementStyle.page_container]}>
                            <View style={[s.header_section]}>
                                <Txt
                                    style={{
                                        fontSize: 24,
                                        fontFamily: 'Roboto-bold',
                                        alignSelf: 'center',
                                    }}
                                >
                                    Protocol Constructor
                                </Txt>
                                {/* <View style={{ flex: 1, paddingHorizontal: 20, alignContent: "center" }}>
                  <InputField
                    background={"#ffffff"}
                    value={protocolName}
                    placeholder="Type protocol name .."
                    onInputChange={(text) => setProtocolName(text)}
                  />
                </View> */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[
                                            s.save_proto_btn,
                                            {
                                                backgroundColor:
                                                    AppStyles.color.block
                                                        .faded_washing,
                                                borderColor:
                                                    AppStyles.color.background,
                                                borderWidth: 1,
                                                marginRight: 50,
                                            },
                                        ]}
                                        onPress={() => setSettingsModal(true)}
                                    >
                                        <Txt
                                            style={{
                                                fontFamily: 'Roboto-bold',
                                            }}
                                        >
                                            Workspace Settings
                                        </Txt>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            s.save_proto_btn,
                                            { backgroundColor: '#000' },
                                        ]}
                                        onPress={() => setPreSaveModal(true)}
                                    >
                                        <Txt
                                            style={{
                                                fontFamily: 'Roboto-bold',
                                                color: AppStyles.color
                                                    .elem_back,
                                            }}
                                        >
                                            Save Protocol
                                        </Txt>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={s.body_section}>
                                <View style={s.workspace_container}>
                                    <View style={s.tabs}>
                                        <StepTab
                                            type={StepType.WASHING}
                                            active={
                                                workBlock?.type ==
                                                StepType.WASHING
                                            }
                                            onPress={() =>
                                                revealWorkBlock({
                                                    type: StepType.WASHING,
                                                    id: -1,
                                                    params: {} as WashStep,
                                                } as StepDTO)
                                            }
                                        />
                                        <StepTab
                                            type={StepType.LIQUID_APPL}
                                            active={
                                                workBlock?.type ==
                                                StepType.LIQUID_APPL
                                            }
                                            onPress={() =>
                                                revealWorkBlock({
                                                    type: StepType.LIQUID_APPL,
                                                    id: -1,
                                                    params: {} as ReagentStep,
                                                } as StepDTO)
                                            }
                                        />
                                        <StepTab
                                            type={StepType.TEMP_CHANGE}
                                            active={
                                                workBlock?.type ==
                                                StepType.TEMP_CHANGE
                                            }
                                            onPress={() =>
                                                setWorkBlock({
                                                    type: StepType.TEMP_CHANGE,
                                                    id: -1,
                                                    params: {
                                                        source: currentTemp,
                                                    } as TemperatureStep,
                                                } as StepDTO)
                                            }
                                        />
                                    </View>
                                    <View style={s.workspace}>
                                        {workBlock != undefined && (
                                            <WorkBlock
                                                addBlock={addBlock}
                                                editBlock={editBlock}
                                                updateCustomLiquids={
                                                    updateCustomLiquids
                                                }
                                                customLiquids={customLiquids}
                                                block={workBlock}
                                                settings={settings}
                                            />
                                        )}
                                    </View>
                                </View>
                                <View style={s.timeline}>
                                    <Txt style={s.timelineHeader}>
                                        Protocol timeline
                                    </Txt>
                                    <DraggableFlatList
                                        style={{ marginHorizontal: 20 }}
                                        containerStyle={{ paddingBottom: 60 }}
                                        data={blocks}
                                        ref={flatListRef}
                                        onScrollToIndexFailed={(info) => {
                                            console.log(
                                                'Failed to scroll to index: ',
                                                info.index,
                                            );
                                        }}
                                        onContentSizeChange={() => {
                                            if (
                                                flatListRef.current &&
                                                blocks.length > 1
                                            ) {
                                                let index = blocks.length - 1;
                                                flatListRef.current.scrollToIndex(
                                                    { animated: true, index },
                                                );
                                            }
                                        }}
                                        onDragEnd={({ data }) =>
                                            handleBlocksChange(data)
                                        }
                                        keyExtractor={(item) =>
                                            item.id.toString()
                                        }
                                        renderItem={(params) =>
                                            renderTimelineBlock({
                                                renderParams: params,
                                                deleteStep: deleteBlock,
                                                editStep: revealWorkBlock,
                                                deleteAutoWash: editBlock,
                                                settings: settings,
                                            })
                                        }
                                        onDragBegin={() =>
                                            Vibration.vibrate([100])
                                        }
                                    />
                                </View>
                            </View>
                        </View>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={preSaveModal}
                            onRequestClose={() => {
                                setPreSaveModal(!preSaveModal);
                            }}
                        >
                            <View style={s.modal_overlay}>
                                <ScrollView
                                    contentContainerStyle={{
                                        height:
                                            Dimensions.get('screen').height *
                                            0.95,
                                    }}
                                    scrollEnabled={false}
                                >
                                    <View style={s.modal_body}>
                                        <View style={s.modal_header}>
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    direction: 'column',
                                                    flex: '5',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Txt
                                                        style={{
                                                            fontFamily:
                                                                'Roboto-bold',
                                                            marginRight: 20,
                                                        }}
                                                    >
                                                        Protocol Name:
                                                    </Txt>
                                                    <InputField
                                                        value={protocolName}
                                                        onInputChange={
                                                            setProtocolName
                                                        }
                                                        placeholder=""
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Txt
                                                        style={{
                                                            fontFamily:
                                                                'Roboto-bold',
                                                            marginRight: 20,
                                                        }}
                                                    >
                                                        Description:
                                                    </Txt>
                                                    <InputField
                                                        value={
                                                            protocolDescription
                                                        }
                                                        onInputChange={
                                                            setProtocolDescription
                                                        }
                                                        placeholder=""
                                                    />
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    alignItems: 'flex-end',
                                                    flex: 1,
                                                }}
                                            >
                                                <Close_icon
                                                    onPress={() =>
                                                        setPreSaveModal(false)
                                                    }
                                                    width={40}
                                                    height={40}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={s.modal_list}>
                                            <View
                                                style={[
                                                    s.list_row,
                                                    {
                                                        backgroundColor:
                                                            AppStyles.color
                                                                .accent_dark,
                                                    },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        s.list_cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Txt
                                                        style={
                                                            s.list_header_txt
                                                        }
                                                    >
                                                        Step #
                                                    </Txt>
                                                </View>

                                                <View
                                                    style={[
                                                        s.list_cell,
                                                        { flex: 2 },
                                                    ]}
                                                >
                                                    <Txt
                                                        style={
                                                            s.list_header_txt
                                                        }
                                                    >
                                                        Type
                                                    </Txt>
                                                </View>

                                                <View
                                                    style={[
                                                        s.list_cell,
                                                        { flex: 2 },
                                                    ]}
                                                >
                                                    <Txt
                                                        style={
                                                            s.list_header_txt
                                                        }
                                                    >
                                                        Reagent
                                                    </Txt>
                                                </View>

                                                <View
                                                    style={[
                                                        s.list_cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Txt
                                                        style={
                                                            s.list_header_txt
                                                        }
                                                    >
                                                        Temperature (°C)
                                                    </Txt>
                                                </View>

                                                <View
                                                    style={[
                                                        s.list_cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Txt
                                                        style={
                                                            s.list_header_txt
                                                        }
                                                    >
                                                        Inc. time (
                                                        {settings.timeUnits})
                                                    </Txt>
                                                </View>

                                                <View
                                                    style={[
                                                        s.list_cell,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    <Txt
                                                        style={
                                                            s.list_header_txt
                                                        }
                                                    >
                                                        Iterations
                                                    </Txt>
                                                </View>
                                            </View>
                                            <ScrollView
                                                style={{ maxHeight: 500 }}
                                                showsVerticalScrollIndicator={
                                                    true
                                                }
                                            >
                                                {blocks.map((block, index) => {
                                                    return (
                                                        <View key={index}>
                                                            <View
                                                                key={index}
                                                                style={[
                                                                    s.list_row,
                                                                    {
                                                                        backgroundColor:
                                                                            index %
                                                                                2 !=
                                                                            0
                                                                                ? AppStyles
                                                                                      .color
                                                                                      .background
                                                                                : AppStyles
                                                                                      .color
                                                                                      .elem_back,
                                                                    },
                                                                ]}
                                                            >
                                                                <View
                                                                    style={[
                                                                        s.list_cell_id,
                                                                        {
                                                                            flex: 1,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            flex: 1,
                                                                            backgroundColor:
                                                                                block.type ==
                                                                                StepType.LIQUID_APPL
                                                                                    ? AppStyles
                                                                                          .color
                                                                                          .block
                                                                                          .main_reagent
                                                                                    : block.type ==
                                                                                        StepType.TEMP_CHANGE
                                                                                      ? AppStyles
                                                                                            .color
                                                                                            .block
                                                                                            .main_temperature
                                                                                      : AppStyles
                                                                                            .color
                                                                                            .block
                                                                                            .main_washing,
                                                                        }}
                                                                    ></View>
                                                                    <View
                                                                        style={{
                                                                            flex: 11,
                                                                            alignItems:
                                                                                'center',
                                                                            justifyContent:
                                                                                'center',
                                                                        }}
                                                                    >
                                                                        <Txt
                                                                            style={[
                                                                                s.list_cell_txt,
                                                                            ]}
                                                                        >
                                                                            {index +
                                                                                1}
                                                                        </Txt>
                                                                    </View>
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        s.list_cell,
                                                                        {
                                                                            flex: 2,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Txt
                                                                        style={
                                                                            s.list_cell_txt
                                                                        }
                                                                    >
                                                                        {
                                                                            block.type
                                                                        }
                                                                    </Txt>
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        s.list_cell,
                                                                        {
                                                                            flex: 2,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Txt
                                                                        style={
                                                                            s.list_cell_txt
                                                                        }
                                                                    >
                                                                        {block.type !=
                                                                        StepType.TEMP_CHANGE
                                                                            ? (
                                                                                  block.params as
                                                                                      | ReagentStep
                                                                                      | WashStep
                                                                              )
                                                                                  .liquid
                                                                                  .name
                                                                            : '-'}
                                                                    </Txt>
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        s.list_cell,
                                                                        {
                                                                            flex: 1,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Txt
                                                                        style={
                                                                            s.list_cell_txt
                                                                        }
                                                                    >
                                                                        {block.type !=
                                                                        StepType.TEMP_CHANGE
                                                                            ? (
                                                                                  block.params as Partial<WashStep>
                                                                              )
                                                                                  .temperature
                                                                            : (
                                                                                  block.params as TemperatureStep
                                                                              )
                                                                                  .target}
                                                                        °C
                                                                    </Txt>
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        s.list_cell,
                                                                        {
                                                                            flex: 1,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Txt
                                                                        style={
                                                                            s.list_cell_txt
                                                                        }
                                                                    >
                                                                        {block.type !=
                                                                        StepType.TEMP_CHANGE
                                                                            ? settings.timeUnits ==
                                                                              'sec'
                                                                                ? (
                                                                                      block.params as
                                                                                          | ReagentStep
                                                                                          | WashStep
                                                                                  )
                                                                                      .incubation
                                                                                : Math.round(
                                                                                      ((
                                                                                          block.params as
                                                                                              | WashStep
                                                                                              | WashStep
                                                                                      )
                                                                                          .incubation /
                                                                                          60) *
                                                                                          100,
                                                                                  ) /
                                                                                  100
                                                                            : '-'}
                                                                    </Txt>
                                                                </View>

                                                                <View
                                                                    style={[
                                                                        s.list_cell,
                                                                        {
                                                                            flex: 1,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Txt
                                                                        style={
                                                                            s.list_cell_txt
                                                                        }
                                                                    >
                                                                        {block.type ==
                                                                        StepType.WASHING
                                                                            ? (
                                                                                  block.params as WashStep
                                                                              )
                                                                                  .iters
                                                                            : '-'}
                                                                    </Txt>
                                                                </View>
                                                            </View>
                                                            {block.type ==
                                                                StepType.LIQUID_APPL &&
                                                                (
                                                                    block.params as ReagentStep
                                                                ).autoWash ==
                                                                    true && (
                                                                    <View
                                                                        key={
                                                                            index +
                                                                            200
                                                                        }
                                                                        style={[
                                                                            s.list_row,
                                                                            {
                                                                                backgroundColor:
                                                                                    AppStyles
                                                                                        .color
                                                                                        .block
                                                                                        .faded_washing,
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <View
                                                                            style={[
                                                                                s.list_cell_id,
                                                                                {
                                                                                    flex: 1,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,
                                                                                    backgroundColor:
                                                                                        AppStyles
                                                                                            .color
                                                                                            .block
                                                                                            .main_washing,
                                                                                }}
                                                                            ></View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 11,
                                                                                    alignItems:
                                                                                        'center',
                                                                                    justifyContent:
                                                                                        'center',
                                                                                }}
                                                                            >
                                                                                <Txt
                                                                                    style={[
                                                                                        s.list_cell_txt,
                                                                                    ]}
                                                                                >
                                                                                    *
                                                                                </Txt>
                                                                            </View>
                                                                        </View>
                                                                        <View
                                                                            style={[
                                                                                s.list_cell,
                                                                                {
                                                                                    flex: 2,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Txt
                                                                                style={
                                                                                    s.list_cell_txt
                                                                                }
                                                                            >
                                                                                Auto-washing
                                                                            </Txt>
                                                                        </View>
                                                                        <View
                                                                            style={[
                                                                                s.list_cell,
                                                                                {
                                                                                    flex: 2,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Txt
                                                                                style={
                                                                                    s.list_cell_txt
                                                                                }
                                                                            >
                                                                                {' '}
                                                                                {
                                                                                    defaultWashStep
                                                                                        .liquid
                                                                                        .name
                                                                                }
                                                                            </Txt>
                                                                        </View>
                                                                        <View
                                                                            style={[
                                                                                s.list_cell,
                                                                                {
                                                                                    flex: 1,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Txt
                                                                                style={
                                                                                    s.list_cell_txt
                                                                                }
                                                                            >
                                                                                {
                                                                                    (
                                                                                        block.params as ReagentStep
                                                                                    )
                                                                                        .temperature
                                                                                }
                                                                            </Txt>
                                                                        </View>
                                                                        <View
                                                                            style={[
                                                                                s.list_cell,
                                                                                {
                                                                                    flex: 1,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Txt
                                                                                style={
                                                                                    s.list_cell_txt
                                                                                }
                                                                            >
                                                                                {
                                                                                    defaultWashStep.incubation
                                                                                }
                                                                            </Txt>
                                                                        </View>
                                                                        <View
                                                                            style={[
                                                                                s.list_cell,
                                                                                {
                                                                                    flex: 1,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Txt
                                                                                style={
                                                                                    s.list_cell_txt
                                                                                }
                                                                            >
                                                                                {
                                                                                    defaultWashStep.iters
                                                                                }
                                                                            </Txt>
                                                                        </View>
                                                                    </View>
                                                                )}
                                                        </View>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                        <View style={s.modal_footer}>
                                            <TouchableOpacity
                                                style={[
                                                    s.modal_btn,
                                                    {
                                                        backgroundColor:
                                                            AppStyles.color
                                                                .text_faded,
                                                    },
                                                ]}
                                                onPress={() => {
                                                    setPreSaveModal(false);
                                                }}
                                            >
                                                <Txt style={s.modal_btn_text}>
                                                    Cancel
                                                </Txt>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    s.modal_btn,
                                                    {
                                                        backgroundColor:
                                                            AppStyles.color
                                                                .primary,
                                                    },
                                                ]}
                                                onPress={() => {
                                                    if (blocks.length != 0) {
                                                        setPreSaveModal(false);
                                                        save();
                                                    }
                                                }}
                                            >
                                                <Txt style={s.modal_btn_text}>
                                                    {protocol_ID
                                                        ? `Update`
                                                        : `Save`}
                                                </Txt>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </Modal>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={settingsModal}
                            onRequestClose={() => {
                                setPreSaveModal(!settingsModal);
                            }}
                        >
                            <View style={stng.modal_container}>
                                <View style={stng.modal_body}>
                                    <ScrollView
                                        scrollEnabled={true}
                                        persistentScrollbar={true}
                                    >
                                        <View style={stng.section}>
                                            <View style={stng.topic_header}>
                                                <Point_icon
                                                    height={15}
                                                    width={15}
                                                    stroke={
                                                        AppStyles.color.primary
                                                    }
                                                />
                                                <Txt style={stng.topic}>
                                                    {' '}
                                                    Edit automatic washing step:
                                                </Txt>
                                            </View>
                                            <View style={{ marginRight: 10 }}>
                                                <CustomSelect
                                                    list={washLiquids}
                                                    label="Reagent: "
                                                    selected={
                                                        tempSettings
                                                            .autoWashConfig
                                                            .liquid
                                                    }
                                                    canAdd={false}
                                                    onChangeSelect={(liq) => {
                                                        setTempSettings({
                                                            ...tempSettings,
                                                            autoWashConfig: {
                                                                liquid: liq as LiquidDTO,
                                                                iters: tempSettings
                                                                    .autoWashConfig
                                                                    .iters,
                                                                incubation:
                                                                    tempSettings
                                                                        .autoWashConfig
                                                                        .incubation,
                                                                temperature:
                                                                    null,
                                                            } as WashStep,
                                                        } as ProtocolSettings);
                                                    }}
                                                />

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        marginTop: 25,
                                                    }}
                                                >
                                                    <InputField
                                                        placeholder="|"
                                                        containerStyle={{
                                                            marginRight: 100,
                                                        }}
                                                        label="Iterations:"
                                                        type={
                                                            'numeric' as InputModeOptions
                                                        }
                                                        value={
                                                            tempSettings
                                                                .autoWashConfig
                                                                .iters
                                                        }
                                                        onInputChange={(
                                                            iters,
                                                        ) => {
                                                            setTempSettings({
                                                                ...tempSettings,
                                                                autoWashConfig:
                                                                    {
                                                                        liquid: tempSettings
                                                                            .autoWashConfig
                                                                            .liquid,
                                                                        iters: Number(
                                                                            iters,
                                                                        ),
                                                                        incubation:
                                                                            tempSettings
                                                                                .autoWashConfig
                                                                                .incubation,
                                                                        temperature:
                                                                            null,
                                                                    } as WashStep,
                                                            } as ProtocolSettings);
                                                        }}
                                                    />
                                                    <InputField
                                                        placeholder="|"
                                                        label="Incubarion time:"
                                                        type={
                                                            'numeric' as InputModeOptions
                                                        }
                                                        value={
                                                            tempSettings
                                                                .autoWashConfig
                                                                .incubation
                                                        }
                                                        onInputChange={(
                                                            incub,
                                                        ) => {
                                                            setTempSettings({
                                                                ...tempSettings,
                                                                autoWashConfig:
                                                                    {
                                                                        liquid: tempSettings
                                                                            .autoWashConfig
                                                                            .liquid,
                                                                        iters: tempSettings
                                                                            .autoWashConfig
                                                                            .iters,
                                                                        incubation:
                                                                            Number(
                                                                                incub,
                                                                            ),
                                                                        temperature:
                                                                            null,
                                                                    } as WashStep,
                                                            } as ProtocolSettings);
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={stng.section}>
                                            <View style={stng.topic_header}>
                                                <Point_icon
                                                    height={15}
                                                    width={15}
                                                    stroke={
                                                        AppStyles.color.primary
                                                    }
                                                />
                                                <Txt style={stng.topic}>
                                                    {' '}
                                                    Default time units:
                                                </Txt>
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <RadioButton
                                                    isChecked={
                                                        tempSettings.timeUnits ==
                                                        'sec'
                                                    }
                                                    label="Seconds"
                                                    onPress={() => {
                                                        setTempSettings({
                                                            ...tempSettings,
                                                            timeUnits: 'sec',
                                                        });
                                                    }}
                                                />
                                                <RadioButton
                                                    isChecked={
                                                        tempSettings.timeUnits ==
                                                        'min'
                                                    }
                                                    label="Minutes"
                                                    onPress={() => {
                                                        setTempSettings({
                                                            ...tempSettings,
                                                            timeUnits: 'min',
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={stng.section}>
                                            <View style={stng.topic_header}>
                                                <Point_icon
                                                    height={15}
                                                    width={15}
                                                    stroke={
                                                        AppStyles.color.primary
                                                    }
                                                />
                                                <Txt style={stng.topic}>
                                                    {' '}
                                                    Add protocol description:
                                                </Txt>
                                            </View>
                                            <View style={{ marginRight: 10 }}>
                                                <InputField
                                                    multiline={true}
                                                    placeholder="Description..."
                                                    value={
                                                        tempSettings.description
                                                    }
                                                    onInputChange={(e) => {
                                                        setTempSettings({
                                                            ...tempSettings,
                                                            description: e,
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </ScrollView>

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
                                                        AppStyles.color
                                                            .text_faded,
                                                },
                                            ]}
                                            onPress={() => {
                                                setSettingsModal(false);
                                                setTempSettings(settings); //Drop all changes
                                            }}
                                        >
                                            <Txt style={s.modal_btn_text}>
                                                Cancel
                                            </Txt>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                s.modal_btn,
                                                {
                                                    backgroundColor:
                                                        AppStyles.color.primary,
                                                },
                                            ]}
                                            onPress={() => {
                                                setSettingsModal(false);
                                                setSettings(tempSettings); //Update settings
                                            }}
                                        >
                                            <Txt style={s.modal_btn_text}>
                                                Confirm
                                            </Txt>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        {successSaving != undefined && (
                            <InfoModal
                                type={
                                    protocol_ID == undefined
                                        ? InfoType.SAVE
                                        : InfoType.UPDATE
                                }
                                result={successSaving}
                                text={'Protocol'}
                                unsetVisible={() => {
                                    setSuccessSaving(undefined);
                                    navigation.navigate('Protocol List');
                                }}
                            />
                        )}
                    </>
                )}
        </MainContainer>
    );
}

const s = StyleSheet.create({
    header_section: {
        flex: 1,
        width: '100%',
        paddingHorizontal: '2%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: AppStyles.color.elem_back,
    },

    save_proto_btn: {
        width: 200,
        borderRadius: 8,
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        alignItems: 'center',
    },

    body_section: {
        flex: 11,
        flexDirection: 'row',
    },

    workspace_container: {
        flex: 1,
    },

    timeline: {
        backgroundColor: AppStyles.color.background,
        flex: 1,
        flexDirection: 'column',
    },

    timelineHeader: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 18,
        fontFamily: 'Roboto-bold',
        color: AppStyles.color.text_primary,
    },

    tabs: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: AppStyles.color.background,
    },

    tab_icon: {
        height: 45,
        width: 45,
        borderRadius: 23,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tab_label: {
        textTransform: 'uppercase',
        color: AppStyles.color.text_faded,
        fontFamily: 'Roboto-bold',
        fontSize: 10,
        letterSpacing: 1.5,
    },

    workspace: {
        flex: 7,
        backgroundColor: AppStyles.color.elem_back,
    },

    modal_overlay: {
        flex: 1,
        backgroundColor: '#001f6d42',
    },

    modal_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#001f6d42',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    modal_body: {
        flex: 1,
        flexDirection: 'column',
        borderRadius: 8,
        marginHorizontal: 50,
        marginTop: 50,
        marginBottom: 100, //For whatever reason margin 100 from bottom == 50 from top
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
        backgroundColor: AppStyles.color.elem_back,
    },

    modal_header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2%',
    },

    modal_list: {
        flex: 5,
    },

    modal_footer: {
        flex: 1,
        alignItems: 'center',
        borderTopColor: AppStyles.color.background,
        borderTopWidth: 1,
        paddingVertical: '1%',
        paddingHorizontal: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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

    list_row: {
        flexDirection: 'row',
        width: '100%',
        height: 40,
    },

    list_header: {
        backgroundColor: AppStyles.color.text_primary,
        borderWidth: 1,
        borderColor: AppStyles.color.elem_back,
    },

    list_cell: {
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
        alignItems: 'center',
        justifyContent: 'center',
    },

    list_cell_id: {
        borderWidth: 0.5,
        borderColor: AppStyles.color.elem_back,
        flexDirection: 'row',
    },

    list_cell_txt: {
        color: AppStyles.color.text_primary,
    },

    list_odd_cell: {
        backgroundColor: AppStyles.color.background,
    },
    list_even_cell: {
        backgroundColor: AppStyles.color.elem_back,
    },

    list_header_txt: {
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
    },
});

const stng = StyleSheet.create({
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
        // alignItems: "center",
        // justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
        height: Dimensions.get('screen').height * 0.6,
        width: Dimensions.get('screen').width * 0.4,
    },

    section: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        borderBottomColor: AppStyles.color.background,
        borderBottomWidth: 1,
        paddingVertical: 20,
    },

    topic: {
        fontFamily: 'Roboto-thin',
        fontSize: 18,
        marginLeft: 10,
    },

    topic_header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
});
