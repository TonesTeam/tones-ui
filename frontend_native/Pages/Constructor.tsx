import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/NavBar';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { LiquidDTO, LiquidTypeDTO } from 'common/dto/liquid.dto';
import {
    ReagentStep,
    StepDTO,
    WashStep,
    StepBatchDTO,
} from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { ProtocolSettings } from '../common/constructorUtils';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { getRequest, makeRequest } from '../common/util';
import { Method } from 'axios';
import InfoModal from '../components/InfoModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InfoType } from '../common/types';
import {
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
import { Save, FlaskConical, Waves } from 'lucide-react-native';
import PreSaveModal from '../components/PreSaveModal';
import { Pencil } from 'lucide-react-native';
import { WashingStepForm, ReagentStepForm } from './Constructor/StepForms';
import { Timeline } from './Constructor/TimelineComponents';
import { useStepBatches } from './Constructor/Block';

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
    const [stepBatches, setStepBatches] = useState<StepBatchDTO[]>([]); //All step batches
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [editingBatchId, setEditingBatchId] = useState<number | null>(null);
    const [editingBatchName, setEditingBatchName] = useState<string>('');
    const [workBlock, setWorkBlock] = useState<StepDTO>({
        type: StepType.REAGENT,
        id: -1,
        sequenceNumber: 0,
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
    const [reagentLiquids, setReagentLiquids] = useState<LiquidDTO[]>([]);
    const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
    const [successSaving, setSuccessSaving] = useState<boolean | undefined>(
        undefined,
    );
    const [showStepForm, setShowStepForm] = useState<
        'washing' | 'reagent' | null
    >(null);
    const [washingFormData, setWashingFormData] = useState<WashStep>({
        liquid: undefined as any,
        incubation: 0,
        iters: 1,
        targetTemperature: 25,
    });
    const [reagentFormData, setReagentFormData] = useState<
        ReagentStep & { category?: LiquidTypeDTO }
    >({
        liquid: undefined as any,
        incubation: 0,
        targetTemperature: 25,
        category: undefined,
    });
    const flatListRef: MutableRefObject<any> = useRef(null);
    console.log(`stepBatches: ${JSON.stringify(stepBatches)}`);

    function initialization() {
        if (reference_ID) {
            getRequest<ProtocolWithStepsDTO>(
                `/protocol/${reference_ID.toString()}`,
            ).then((r) => {
                if ('data' in r) {
                    setCustomLiquids(r.data.customLiquids);
                    setDefaultWashStep(r.data.defaultWash);
                    setProtocolName(r.data.name);
                    setProtocolDescription(r.data.description);
                    setStepBatches(r.data.stepBatches);
                }
            });
        }

        getRequest<LiquidDTO[]>(`/liquids`).then((r) => {
            if ('data' in r) {
                const washLiquids = r.data.filter(
                    (liq: LiquidDTO) => liq.type.id == 2,
                );
                const reagentLiquids = r.data.filter(
                    (liq: LiquidDTO) => liq.type.id != 2,
                );

                setWashLiquids(washLiquids);
                setReagentLiquids(reagentLiquids);

                let defaultWashing = {
                    iters: 1,
                    incubation: 10,
                    targetTemperature: 25,
                    liquid: washLiquids[0],
                } as WashStep;
                setDefaultWashStep(defaultWashing);
            }
        });

        getRequest<LiquidTypeDTO[]>(`/types`).then((r) => {
            if ('data' in r) {
                const nonWashCategories = r.data.filter(
                    (cat: LiquidTypeDTO) => cat.id != 2,
                );
                setCategories(nonWashCategories);
            }
        });
    }

    useEffect(() => {
        initialization();
    }, []);

    useEffect(() => {
        // Для новых протоколов создаем первый batch автоматически
        if (
            protocol_ID === undefined &&
            !reference_ID &&
            stepBatches.length === 0 &&
            washLiquids.length > 0
        ) {
            const initialBatch: StepBatchDTO = {
                id: 1,
                sequenceNumber: 1,
                steps: [],
            };
            setStepBatches([initialBatch]);
            setSelectedBatchId(1);
        }
    }, [protocol_ID, reference_ID, stepBatches.length, washLiquids.length]);

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

    function addNewStepBatch() {
        const newBatchId =
            stepBatches.length === 0
                ? 1
                : Math.max(...stepBatches.map((b) => b.id)) + 1;

        const newBatch: StepBatchDTO = {
            id: newBatchId,
            sequenceNumber: stepBatches.length + 1,
            steps: [],
        };

        setStepBatches([...stepBatches, newBatch]);
        setSelectedBatchId(newBatchId);
    }

    function addBlock(newBlock: StepDTO) {
        const allSteps = stepBatches.flatMap((b) => b.steps);
        const newID =
            allSteps.length == 0
                ? 0
                : allSteps.length == 1
                ? 1
                : allSteps.reduce((prev, current) =>
                      prev && prev.id > current.id ? prev : current,
                  ).id + 1;

        const newStep = {
            type: newBlock.type,
            id: newBlock.id == -1 ? newID : newBlock.id,
            sequenceNumber: allSteps.length + 1,
            params: newBlock.params,
        } as StepDTO;

        // Add to first batch or create new one
        if (stepBatches.length === 0) {
            setStepBatches([
                {
                    id: 1,
                    sequenceNumber: 1,
                    steps: [newStep],
                },
            ]);
        } else {
            const updatedBatches = [...stepBatches];
            updatedBatches[0] = {
                ...updatedBatches[0],
                steps: [...updatedBatches[0].steps, newStep],
            };
            setStepBatches(updatedBatches);
        }
        setWorkBlock({
            type: newBlock.type,
            id: -1,
            sequenceNumber: 0,
            params: {} as ReagentStep,
        });
    }

    function revealWorkBlock(step_data: StepDTO) {
        setWorkBlock(step_data);
    }

    function deleteBlock(blockToRemove: StepDTO) {
        const updatedBatches = stepBatches
            .map((batch) => ({
                ...batch,
                steps: batch.steps.filter(
                    (step) => step.id !== blockToRemove.id,
                ),
            }))
            .filter((batch) => batch.steps.length > 0);
        setStepBatches(updatedBatches);
    }

    function save() {
        let new_protocol = {
            id: protocol_ID ? protocol_ID : -1,
            name: protocolName,
            customLiquids: customLiquids.map((liq) => {
                return { ...liq, id: 0 };
            }),
            description: protocolDescription,
            stepBatches: stepBatches,
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
                                <Timeline
                                    stepBatches={stepBatches}
                                    selectedBatchId={selectedBatchId}
                                    onSelectBatch={setSelectedBatchId}
                                    editingBatchId={editingBatchId}
                                    editingBatchName={editingBatchName}
                                    onBatchNameChange={(name: string) =>
                                        setEditingBatchName(name)
                                    }
                                    onBatchNameSave={() => {
                                        if (editingBatchId !== null) {
                                            const updated = stepBatches.map(
                                                (batch) =>
                                                    batch.id === editingBatchId
                                                        ? {
                                                              ...batch,
                                                              name: editingBatchName,
                                                          }
                                                        : batch,
                                            );
                                            setStepBatches(updated);
                                            setEditingBatchId(null);
                                        }
                                    }}
                                    onBatchNameCancel={() =>
                                        setEditingBatchId(null)
                                    }
                                    onReorder={(newBatches: StepBatchDTO[]) => {
                                        const reordered = newBatches.map(
                                            (batch, index) => ({
                                                ...batch,
                                                sequenceNumber: index + 1,
                                            }),
                                        );
                                        setStepBatches(reordered);
                                    }}
                                    onReorderSteps={(
                                        batchId: number,
                                        newSteps: StepDTO[],
                                    ) => {
                                        const updated = stepBatches.map(
                                            (batch) =>
                                                batch.id === batchId
                                                    ? {
                                                          ...batch,
                                                          steps: newSteps.map(
                                                              (
                                                                  step,
                                                                  index,
                                                              ) => ({
                                                                  ...step,
                                                                  sequenceNumber:
                                                                      index + 1,
                                                              }),
                                                          ),
                                                      }
                                                    : batch,
                                        );
                                        setStepBatches(updated);
                                    }}
                                    onEdit={(batchId: number) => {
                                        const batch = stepBatches.find(
                                            (b) => b.id === batchId,
                                        );
                                        setEditingBatchId(batchId);
                                        setEditingBatchName(
                                            batch?.name ||
                                                `Step ${
                                                    batch?.sequenceNumber || ''
                                                }`,
                                        );
                                    }}
                                    onCopy={(batchId: number) => {
                                        // Copy batch with all its steps
                                        const batchToCopy = stepBatches.find(
                                            (b) => b.id === batchId,
                                        );
                                        if (!batchToCopy) return;

                                        const allSteps = stepBatches.flatMap(
                                            (b) => b.steps,
                                        );
                                        const maxBatchId = Math.max(
                                            ...stepBatches.map((b) => b.id),
                                        );
                                        const maxStepId =
                                            allSteps.length === 0
                                                ? 0
                                                : Math.max(
                                                      ...allSteps.map(
                                                          (s) => s.id,
                                                      ),
                                                  );

                                        // Create new batch with copied steps
                                        const newBatch: StepBatchDTO = {
                                            id: maxBatchId + 1,
                                            sequenceNumber:
                                                stepBatches.length + 1,
                                            steps: batchToCopy.steps.map(
                                                (step, index) => ({
                                                    ...step,
                                                    id: maxStepId + index + 1,
                                                    sequenceNumber: index + 1,
                                                }),
                                            ),
                                        };

                                        setStepBatches([
                                            ...stepBatches,
                                            newBatch,
                                        ]);
                                        setSelectedBatchId(newBatch.id);
                                    }}
                                    onDelete={(batchId: number) => {
                                        setStepBatches(
                                            stepBatches.filter(
                                                (b) => b.id !== batchId,
                                            ),
                                        );
                                        if (selectedBatchId === batchId) {
                                            setSelectedBatchId(null);
                                        }
                                    }}
                                    deleteBlock={deleteBlock}
                                />
                                <View style={s.right_panel}>
                                    {showStepForm === null ? (
                                        <>
                                            <Text
                                                fontSize="$sm"
                                                color="$grey"
                                                mb="$4"
                                            >
                                                Add to step:
                                            </Text>
                                            <Button
                                                variant="outline"
                                                action="secondary"
                                                width="100%"
                                                mb="$3"
                                                onPress={addNewStepBatch}
                                            >
                                                <ButtonText>
                                                    + New Step
                                                </ButtonText>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                action="secondary"
                                                width="100%"
                                                mb="$3"
                                                onPress={() => {
                                                    setShowStepForm('reagent');
                                                    if (
                                                        reagentLiquids.length >
                                                            0 &&
                                                        categories.length > 0
                                                    ) {
                                                        setReagentFormData({
                                                            liquid: reagentLiquids[0],
                                                            incubation: 10,
                                                            targetTemperature: 70,
                                                            category:
                                                                categories[0],
                                                        });
                                                    }
                                                }}
                                            >
                                                <Icon
                                                    as={FlaskConical}
                                                    mr="$2"
                                                />
                                                <ButtonText>
                                                    + Reagent
                                                </ButtonText>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                action="secondary"
                                                width="100%"
                                                onPress={() => {
                                                    setShowStepForm('washing');
                                                    setWashingFormData({
                                                        liquid: washLiquids[0],
                                                        incubation: 10,
                                                        iters: 1,
                                                        targetTemperature: 25,
                                                    });
                                                }}
                                            >
                                                <Icon as={Waves} mr="$2" />
                                                <ButtonText>
                                                    + Washing
                                                </ButtonText>
                                            </Button>
                                        </>
                                    ) : showStepForm === 'washing' ? (
                                        <WashingStepForm
                                            washLiquids={washLiquids}
                                            formData={washingFormData}
                                            onFormChange={setWashingFormData}
                                            onCancel={() =>
                                                setShowStepForm(null)
                                            }
                                            onAdd={() => {
                                                // Add washing step to current batch
                                                const allSteps =
                                                    stepBatches.flatMap(
                                                        (b) => b.steps,
                                                    );
                                                const newID =
                                                    allSteps.length === 0
                                                        ? 1
                                                        : Math.max(
                                                              ...allSteps.map(
                                                                  (s) => s.id,
                                                              ),
                                                          ) + 1;

                                                const newStep: StepDTO = {
                                                    id: newID,
                                                    type: StepType.WASHING,
                                                    sequenceNumber:
                                                        allSteps.length + 1,
                                                    params: {
                                                        ...washingFormData,
                                                        incubation:
                                                            washingFormData.incubation *
                                                            60, // convert to seconds
                                                    },
                                                };

                                                if (stepBatches.length === 0) {
                                                    const newBatch = {
                                                        id: 1,
                                                        sequenceNumber: 1,
                                                        steps: [newStep],
                                                    };
                                                    setStepBatches([newBatch]);
                                                    setSelectedBatchId(
                                                        newBatch.id,
                                                    );
                                                } else {
                                                    const targetBatchId =
                                                        selectedBatchId ||
                                                        stepBatches[
                                                            stepBatches.length -
                                                                1
                                                        ].id;
                                                    const updatedBatches =
                                                        stepBatches.map(
                                                            (batch) =>
                                                                batch.id ===
                                                                targetBatchId
                                                                    ? {
                                                                          ...batch,
                                                                          steps: [
                                                                              ...batch.steps,
                                                                              newStep,
                                                                          ],
                                                                      }
                                                                    : batch,
                                                        );
                                                    setStepBatches(
                                                        updatedBatches,
                                                    );
                                                }

                                                setShowStepForm(null);
                                            }}
                                        />
                                    ) : showStepForm === 'reagent' ? (
                                        <ReagentStepForm
                                            categories={categories}
                                            reagentLiquids={reagentLiquids}
                                            formData={reagentFormData}
                                            onFormChange={setReagentFormData}
                                            onCancel={() =>
                                                setShowStepForm(null)
                                            }
                                            onAdd={() => {
                                                // Add reagent step to current batch
                                                const allSteps =
                                                    stepBatches.flatMap(
                                                        (b) => b.steps,
                                                    );
                                                const newID =
                                                    allSteps.length === 0
                                                        ? 1
                                                        : Math.max(
                                                              ...allSteps.map(
                                                                  (s) => s.id,
                                                              ),
                                                          ) + 1;

                                                const newStep: StepDTO = {
                                                    id: newID,
                                                    type: StepType.REAGENT,
                                                    sequenceNumber:
                                                        allSteps.length + 1,
                                                    params: {
                                                        liquid: reagentFormData.liquid,
                                                        incubation:
                                                            reagentFormData.incubation *
                                                            60, // convert to seconds
                                                        targetTemperature:
                                                            reagentFormData.targetTemperature,
                                                    } as ReagentStep,
                                                };

                                                if (stepBatches.length === 0) {
                                                    const newBatch = {
                                                        id: 1,
                                                        sequenceNumber: 1,
                                                        steps: [newStep],
                                                    };
                                                    setStepBatches([newBatch]);
                                                    setSelectedBatchId(
                                                        newBatch.id,
                                                    );
                                                } else {
                                                    const targetBatchId =
                                                        selectedBatchId ||
                                                        stepBatches[
                                                            stepBatches.length -
                                                                1
                                                        ].id;
                                                    const updatedBatches =
                                                        stepBatches.map(
                                                            (batch) =>
                                                                batch.id ===
                                                                targetBatchId
                                                                    ? {
                                                                          ...batch,
                                                                          steps: [
                                                                              ...batch.steps,
                                                                              newStep,
                                                                          ],
                                                                      }
                                                                    : batch,
                                                        );
                                                    setStepBatches(
                                                        updatedBatches,
                                                    );
                                                }

                                                setShowStepForm(null);
                                            }}
                                        />
                                    ) : null}
                                </View>
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
                            blocks={stepBatches.flatMap((b) => b.steps)}
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

    timeline: {
        backgroundColor: AppStyles.color.background,
        width: 621,
        flexDirection: 'column',
    },

    right_panel: {
        backgroundColor: AppStyles.color.elem_back,
        width: 392,
        padding: 20,
        borderLeftWidth: 1,
        borderLeftColor: AppStyles.color.background,
    },

    workspace_container: {
        flex: 1,
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
