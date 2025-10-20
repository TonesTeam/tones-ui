import {
    StyleSheet,
    View,
    TouchableOpacity,
    Vibration,
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
import React, {
    ForwardedRef,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import { LiquidDTO } from 'common/dto/liquid.dto';
import DraggableFlatList, {
    DraggableFlatListProps,
} from 'react-native-draggable-flatlist';
import { ReagentStep, StepDTO, WashStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { LucideIcon } from 'lucide-react-native';
import WorkBlock from './Block';
import StepBlock from '../components/StepBlock';
import { ProtocolSettings } from '../common/constructorUtils';
import Point_icon from '../assets/icons/point.svg';
import {
    DEFAULT_TEMEPRATURE,
    DEFAULT_WASH_STEP,
} from '../constants/protocol_constants';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { getRequest, makeRequest } from '../common/util';
import { CustomSelect } from '../components/Select';
import RadioButton from '../components/RadioButton';
import { Method } from 'axios';
import InfoModal from '../components/InfoModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InfoType } from '../common/types';
import { LinearGradient } from 'expo-linear-gradient';
import App from '../App';
import {
    Heading,
    Box,
    VStack,
    Button,
    HStack,
    Text,
    Input,
    InputField,
    InputSlot,
    InputIcon,
    ButtonText,
    Icon,
} from '@gluestack-ui/themed';
import { Save } from 'lucide-react-native';
import { FlaskConical, Waves } from 'lucide-react-native';
import PreSaveModal from '../components/PreSaveModal';
import { Pencil } from 'lucide-react-native';

export const stepTypeClass = new Map<StepType, string>([
    [StepType.WASHING, 'washing'],
    [StepType.LIQUID_APPL, 'reagent'],
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
        icon: {} as LucideIcon,
    };
    switch (props.type) {
        case StepType.WASHING:
            {
                params.icon = Waves;
            }
            break;
        case StepType.LIQUID_APPL:
            {
                params.icon = FlaskConical;
            }
            break;
    }
    return (
        <TouchableOpacity
            style={[
                s.tab,
                {
                    backgroundColor: AppStyles.color.elem_back,
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
                <Icon
                    as={params.icon}
                    color={props.active ? 'white' : 'grey'}
                    size="md"
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

const Timeline = ({
    blocks,
    flatListRef,
    handleBlocksChange,
    settings,
    revealWorkBlock,
    deleteBlock,
}: any) => {
    return (
        <View style={s.timeline}>
            <Txt style={s.timelineHeader}>Protocol timeline</Txt>
            {blocks.length == 0 && (
                <Box alignItems="center" justifyContent="center" flex={1}>
                    <Text fontSize="$6xl">😇</Text>
                    <Text color="$grey" mt="$4" italic>
                        No steps added yet
                    </Text>
                </Box>
            )}
            <DraggableFlatList
                style={{ marginHorizontal: 20 }}
                containerStyle={{ paddingBottom: 60 }}
                data={blocks}
                ref={flatListRef}
                onScrollToIndexFailed={(info) => {
                    console.log('Failed to scroll to index: ', info.index);
                }}
                onContentSizeChange={() => {
                    if (flatListRef.current && blocks.length > 1) {
                        let index = blocks.length - 1;
                        flatListRef.current.scrollToIndex({
                            animated: true,
                            index,
                        });
                    }
                }}
                onDragEnd={({ data }) => handleBlocksChange(data)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(params) =>
                    StepBlock({
                        renderParams: params,
                        deleteStep: deleteBlock,
                        editStep: revealWorkBlock,
                        settings: settings,
                        edit: true,
                    })
                }
                onDragBegin={() => Vibration.vibrate([100])}
            />
        </View>
    );
};

export default function Constructor({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    let protocol_ID: undefined | number = undefined;
    let reference_ID: undefined | number = undefined;
    if (route.params && route.params.preserveID)
        protocol_ID = reference_ID = route.params.protocol_ID;
    else if (route.params && !route.params.preserveID)
        reference_ID = route.params.protocol_ID;
    const [blocks, setBlocks] = useState<StepDTO[]>([]); //All steps
    const [workBlock, setWorkBlock] = useState<StepDTO>({
        type: StepType.LIQUID_APPL,
        id: -1,
        params: {} as ReagentStep,
    });
    const [preSaveModal, setPreSaveModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>([]);
    const [protocolName, setProtocolName] = useState('Untitled protocol');
    const [protocolDescription, setProtocolDescription] = useState('');
    const [washingIterations, setWashingItertions] = useState(2);
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
    console.log(`blocks: ${JSON.stringify(blocks)}`);

    function initialization() {
        if (reference_ID) {
            getRequest<ProtocolWithStepsDTO>(
                `/protocol/${reference_ID.toString()}`,
            ).then((r) => {
                setCustomLiquids(r.data.customLiquids);
                setDefaultWashStep(r.data.defaultWash);
                setProtocolName(r.data.name);
                setProtocolDescription(r.data.description);
                setBlocks(r.data.steps);
            });
        }

        getRequest<LiquidDTO[]>(`/liquids`).then((r) => {
            setWashLiquids(r.data.filter((liq) => liq.type.id == 2));
            let defaultWashing = {
                iters: 1,
                incubation: 10,
                liquid: r.data.filter((liq) => liq.type.id == 2)[0],
            } as WashStep;
            setDefaultWashStep(defaultWashing);
        });
    }

    useEffect(() => {
        initialization();
    }, []);

    useEffect(() => {
        setSettings({
            autoWashConfig: defaultWashStep,
            description: '',
        } as ProtocolSettings);

        setTempSettings({
            autoWashConfig: defaultWashStep,
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
                params: newBlock.params,
            } as StepDTO,
        ];

        setBlocks(finalBlocks);
        setWorkBlock({
            type: newBlock.type,
            id: -1,
            params: {} as ReagentStep,
        });
    }

    function revealWorkBlock(step_data: StepDTO) {
        setWorkBlock(step_data);
    }

    function deleteBlock(blockToRemove: StepDTO) {
        const newBlocks = blocks.filter(
            (block) => block.id !== blockToRemove.id,
        );
        setBlocks(newBlocks);
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
            washingIterations: washingIterations,
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
                                <Input
                                    variant="underlined"
                                    size="md"
                                    width={250}
                                >
                                    <InputSlot mr="$2">
                                        <InputIcon size="lg" as={Pencil} />
                                    </InputSlot>
                                    <InputField
                                        value={protocolName}
                                        onChangeText={(text: string) =>
                                            setProtocolName(text)
                                        }
                                        color="$black"
                                        type="text"
                                        fontWeight="600"
                                        fontSize="$2xl"
                                    />
                                </Input>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button
                                        bg="$black"
                                        onPress={() => setPreSaveModal(true)}
                                        rounded="$md"
                                    >
                                        <Icon as={Save} color="white" />
                                        <ButtonText color="white" ml="$2">
                                            Save
                                        </ButtonText>
                                    </Button>
                                </View>
                            </View>
                            <View style={s.body_section}>
                                <View style={s.workspace_container}>
                                    <View style={s.workspace}>
                                        {workBlock != undefined && (
                                            <WorkBlock
                                                addBlock={addBlock}
                                                updateCustomLiquids={
                                                    updateCustomLiquids
                                                }
                                                customLiquids={customLiquids}
                                                block={workBlock}
                                                settings={settings}
                                                setSettings={setSettings}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Timeline
                                    blocks={blocks}
                                    flatListRef={flatListRef}
                                    handleBlocksChange={setBlocks}
                                    settings={settings}
                                    revealWorkBlock={revealWorkBlock}
                                    deleteBlock={deleteBlock}
                                />
                            </View>
                        </View>

                        <PreSaveModal
                            isOpen={preSaveModal}
                            onClose={() => setPreSaveModal(false)}
                            onSave={() => {
                                setPreSaveModal(false);
                                save();
                            }}
                            protocolName={protocolName}
                            setProtocolName={setProtocolName}
                            protocolDescription={protocolDescription}
                            setProtocolDescription={setProtocolDescription}
                            blocks={blocks}
                            settings={settings}
                            defaultWashStep={defaultWashStep}
                            protocol_ID={protocol_ID}
                        />
                        <View></View>
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
        paddingTop: 10,
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
