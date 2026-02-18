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
import NavBar from '../navigation/NavBar';
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
import {
    ProtocolDto,
    ProtocolWithStepsDTO,
    StepGroupWithStepsDTO,
} from 'common/dto/protocol.dto';
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
    Pressable,
    ScrollView as GlueScrollView,
} from '@gluestack-ui/themed';
import { Save } from 'lucide-react-native';
import { FlaskConical, Waves, Plus, Trash } from 'lucide-react-native';
import PreSaveModal from '../components/PreSaveModal';
import { Pencil } from 'lucide-react-native';
import ConfirmationModal from '../components/ConfirmationModal';

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
                `main_${stepTypeClass.get(
                    props.type,
                )}` as keyof typeof AppStyles.color.block
            ],
        back_color:
            AppStyles.color.block[
                `faded_${stepTypeClass.get(
                    props.type,
                )}` as keyof typeof AppStyles.color.block
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
    stepGroups,
    activeGroupIndex,
    setActiveGroupIndex,
    flatListRef,
    handleStepsChange,
    settings,
    revealWorkBlock,
    deleteBlock,
    addStepGroup,
    deleteStepGroup,
}: {
    stepGroups: StepGroupWithStepsDTO[];
    activeGroupIndex: number;
    setActiveGroupIndex: (index: number) => void;
    flatListRef: MutableRefObject<any>;
    handleStepsChange: (data: StepDTO[]) => void;
    settings: ProtocolSettings;
    revealWorkBlock: (step: StepDTO) => void;
    deleteBlock: (step: StepDTO) => void;
    addStepGroup: () => void;
    deleteStepGroup: (index: number) => void;
}) => {
    const [deleteGroupIndex, setDeleteGroupIndex] = useState<number | null>(
        null,
    );
    const activeGroup = stepGroups[activeGroupIndex];
    const blocks = activeGroup?.steps ?? [];

    return (
        <View style={s.timeline}>
            <HStack
                justifyContent="space-between"
                alignItems="center"
                px="$4"
                pt="$2"
            >
                <Txt style={s.timelineHeader}>Protocol timeline</Txt>
                <Button
                    size="sm"
                    variant="outline"
                    action="primary"
                    onPress={addStepGroup}
                >
                    <Icon as={Plus} size="sm" mr="$1" />
                    <ButtonText size="sm">Add Group</ButtonText>
                </Button>
            </HStack>

            {/* Step Group Tabs */}
            <GlueScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="sm" px="$4" py="$2">
                    {stepGroups.map((group, index) => (
                        <Pressable
                            key={group.step_group.id}
                            onPress={() => setActiveGroupIndex(index)}
                        >
                            <HStack
                                bg={
                                    index === activeGroupIndex
                                        ? '$primary500'
                                        : '$white'
                                }
                                borderRadius="$lg"
                                px="$3"
                                py="$2"
                                alignItems="center"
                                space="sm"
                                borderWidth={1}
                                borderColor={
                                    index === activeGroupIndex
                                        ? '$primary500'
                                        : '$borderLight300'
                                }
                            >
                                <Text
                                    color={
                                        index === activeGroupIndex
                                            ? '$white'
                                            : '$textLight700'
                                    }
                                    fontWeight="$medium"
                                    size="sm"
                                >
                                    {group.step_group.name}
                                </Text>
                                <Text
                                    color={
                                        index === activeGroupIndex
                                            ? '$white'
                                            : '$textLight400'
                                    }
                                    size="xs"
                                >
                                    ({group.steps.length})
                                </Text>
                                {stepGroups.length > 1 && (
                                    <Pressable
                                        onPress={() => {
                                            setDeleteGroupIndex(index);
                                        }}
                                        p="$0.5"
                                    >
                                        <Icon
                                            as={Trash}
                                            size="xs"
                                            color={
                                                index === activeGroupIndex
                                                    ? '$white'
                                                    : '$error500'
                                            }
                                        />
                                    </Pressable>
                                )}
                            </HStack>
                        </Pressable>
                    ))}
                </HStack>
            </GlueScrollView>

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
                onScrollToIndexFailed={(info: any) => {
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
                onDragEnd={({ data }: { data: StepDTO[] }) =>
                    handleStepsChange(data)
                }
                keyExtractor={(item: StepDTO) => item.id.toString()}
                renderItem={(params: any) =>
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

            <ConfirmationModal
                isOpen={deleteGroupIndex !== null}
                onClose={() => setDeleteGroupIndex(null)}
                action={() => {
                    if (deleteGroupIndex !== null) {
                        deleteStepGroup(deleteGroupIndex);
                        setDeleteGroupIndex(null);
                    }
                }}
                icon={Trash}
                headline="Delete step group"
                text={
                    deleteGroupIndex !== null
                        ? `Are you sure you want to delete "${stepGroups[deleteGroupIndex]?.step_group.name}"? All steps in this group will be removed.`
                        : ''
                }
                actionButtonText="Delete"
                type="error"
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
    const defaultStepGroup = (): StepGroupWithStepsDTO => ({
        step_group: {
            id: 0,
            name: 'Group 1',
            protocol_id: protocol_ID ?? -1,
            sequence_number: 0,
        },
        steps: [],
    });

    const [stepGroups, setStepGroups] = useState<StepGroupWithStepsDTO[]>([
        defaultStepGroup(),
    ]);
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [workBlock, setWorkBlock] = useState<StepDTO>({
        type: StepType.LIQUID_APPL,
        id: -1,
        iterations: 1,
        incubation_time: 0,
    });
    const [preSaveModal, setPreSaveModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>([]);
    const [protocolName, setProtocolName] = useState('Untitled protocol');
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

    const allBlocks = stepGroups.flatMap((group) => group.steps);

    function initialization() {
        if (reference_ID) {
            getRequest<ProtocolWithStepsDTO>(
                `/protocols/${reference_ID.toString()}`,
            ).then((r) => {
                if ('data' in r) {
                    const data = r.data;
                    setProtocolName(data.metadata.name);
                    setProtocolDescription(data.metadata.description);
                    if (data.step_groups.length > 0) {
                        setStepGroups(data.step_groups);
                    }
                }
            });
        }

        getRequest<LiquidDTO[]>(`/liquids`).then((r) => {
            if ('data' in r) {
                setWashLiquids(r.data.filter((liq) => liq.type.id == 2));
                let defaultWashing = {
                    iters: 1,
                    incubation: 10,
                    liquid: r.data.filter((liq) => liq.type.id == 2)[0],
                } as WashStep;
                setDefaultWashStep(defaultWashing);
            }
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

    function updateActiveGroupSteps(newSteps: StepDTO[]) {
        setStepGroups((prev) =>
            prev.map((group, i) =>
                i === activeGroupIndex
                    ? { ...group, steps: newSteps }
                    : group,
            ),
        );
    }

    function addBlock(newBlock: StepDTO) {
        const activeSteps = stepGroups[activeGroupIndex]?.steps ?? [];
        const newID =
            allBlocks.length == 0
                ? 0
                : Math.max(...allBlocks.map((b) => b.id)) + 1;

        const updatedSteps = [
            ...activeSteps,
            {
                ...newBlock,
                id: newBlock.id == -1 ? newID : newBlock.id,
            },
        ];

        updateActiveGroupSteps(updatedSteps);
        setWorkBlock({
            type: newBlock.type,
            id: -1,
            iterations: 1,
            incubation_time: 0,
        });
    }

    function revealWorkBlock(step_data: StepDTO) {
        setWorkBlock(step_data);
    }

    function deleteBlock(blockToRemove: StepDTO) {
        const activeSteps = stepGroups[activeGroupIndex]?.steps ?? [];
        const newSteps = activeSteps.filter(
            (block) => block.id !== blockToRemove.id,
        );
        updateActiveGroupSteps(newSteps);
    }

    function addStepGroup() {
        const newId =
            stepGroups.length === 0
                ? 0
                : Math.max(...stepGroups.map((g) => g.step_group.id)) + 1;
        const newGroup: StepGroupWithStepsDTO = {
            step_group: {
                id: newId,
                name: `Group ${newId + 1}`,
                protocol_id: protocol_ID ?? -1,
                sequence_number: stepGroups.length,
            },
            steps: [],
        };
        setStepGroups((prev) => [...prev, newGroup]);
        setActiveGroupIndex(stepGroups.length);
    }

    function deleteStepGroup(index: number) {
        if (stepGroups.length <= 1) return;
        const updated = stepGroups.filter((_, i) => i !== index);
        setStepGroups(updated);
        if (activeGroupIndex >= updated.length) {
            setActiveGroupIndex(updated.length - 1);
        } else if (activeGroupIndex === index) {
            setActiveGroupIndex(0);
        }
    }

    function save() {
        const now = Math.floor(Date.now() / 1000);
        let new_protocol: ProtocolWithStepsDTO = {
            metadata: {
                id: protocol_ID ?? -1,
                name: protocolName,
                description: protocolDescription,
                created_at: now,
                last_launched: null,
                last_updated: now,
                version: now,
                is_deleted: false,
                author_id: 0,
                author_first_name: '',
                author_last_name: '',
                history_id: '',
            } as ProtocolDto,
            step_groups: stepGroups,
        };

        console.log(JSON.stringify(new_protocol));

        const method: Method = protocol_ID ? 'PUT' : 'POST';
        const path = protocol_ID
            ? `/protocols/${protocol_ID}`
            : '/protocols';

        makeRequest(method, path, JSON.stringify(new_protocol))
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
                                    stepGroups={stepGroups}
                                    activeGroupIndex={activeGroupIndex}
                                    setActiveGroupIndex={setActiveGroupIndex}
                                    flatListRef={flatListRef}
                                    handleStepsChange={updateActiveGroupSteps}
                                    settings={settings}
                                    revealWorkBlock={revealWorkBlock}
                                    deleteBlock={deleteBlock}
                                    addStepGroup={addStepGroup}
                                    deleteStepGroup={deleteStepGroup}
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
                            blocks={allBlocks}
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
                                    navigation.navigate('Protocols');
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
        borderWidth: 1,
        margin: 10,
        borderRadius: 8,
        borderColor: '#00000030',
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
