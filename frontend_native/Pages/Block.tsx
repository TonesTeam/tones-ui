import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    InputModeOptions,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
} from 'react-native';
import { AppStyles } from '../constants/styles';
import { ReagentStep, StepDTO, WashStep } from 'common/dto/step.dto';
import { LiquidDTO, LiquidTypeDTO } from 'common/dto/liquid.dto';
import { useCallback, useEffect, useState, useRef } from 'react';
import Txt from '../components/Txt';
import { getRequest } from '../common/util';
import { CustomSelect } from '../components/Select';
import Info_icon from '../assets/icons/info.svg';
import { StepType } from 'common/enums';
import Setting_icon from '../assets/icons/setting.svg';
import { ProtocolSettings } from '../common/constructorUtils';
import {
    INCUBATION_MAX,
    INCUBATION_MIN,
    ITERATIONS_MAX,
    ITERATIONS_MIN,
    TEMPERATURE_MAX,
    TEMPERATURE_MIN,
    DEFAULT_TEMEPRATURE,
} from '../constants/protocol_constants';
import { VStack } from '../components/ui/vstack';
import { Input, InputField } from '../components/ui/input';
import { Text } from '../components/ui/text';
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from '../components/ui/select';
import { Alert, AlertIcon, AlertText } from '../components/ui/alert';
import { Button, ButtonText } from '../components/ui/button';
import { Toast, ToastTitle, ToastDescription, useToast } from '../components/ui/toast';
import { Icon } from '../components/ui/icon';
import { Switch } from '../components/ui/switch';
import { Heading } from '../components/ui/heading';
import { ChevronDown, Check, Info } from 'lucide-react-native';
import { HStack } from '../components/ui/hstack';
import { formatDuration } from '../common/util';

export interface WorkBlockProps {
    block: StepDTO;
    addBlock: (block: StepDTO) => void;
    updateCustomLiquids: (liquids: LiquidDTO[]) => void;
    customLiquids: LiquidDTO[];
    settings: ProtocolSettings;
    setSettings: (settings: ProtocolSettings) => void;
}

interface BlockInputsProps {
    stepData: StepDTO;
    change: (arg0: WashStep | ReagentStep) => void;
    addNewLiquid?: (liquid: LiquidDTO) => void;
    existingCustomLiquids?: LiquidDTO[];
    timeUnit: 'Seconds' | 'Minutes';
    setTimeUnit: (text: 'Seconds' | 'Minutes') => void;
    settings: ProtocolSettings;
    setSettings: (settings: ProtocolSettings) => void;
}

const bs = StyleSheet.create({
    inputs: {
        width: '100%',
        flexDirection: 'column',
    },

    row: {
        flexDirection: 'row',
        height: 'auto',
        paddingBottom: 30,
    },
});

function ReagentInputs(props: BlockInputsProps) {
    const [reagParams, setReagParams] = useState({
        ...props.stepData.params,
        autoWash:
            (props.stepData.params as ReagentStep).autoWash == undefined
                ? false
                : (props.stepData.params as ReagentStep).autoWash,
        targetTemperature:
            (props.stepData.params as ReagentStep).targetTemperature ==
            undefined
                ? DEFAULT_TEMEPRATURE
                : (props.stepData.params as ReagentStep).targetTemperature,
        iters:
            props.stepData.params.iters == undefined
                ? 1
                : props.stepData.params.iters,
        washingIterations:
            props.stepData.params.washingIterations == undefined
                ? 2
                : props.stepData.params.washingIterations,
    } as ReagentStep);
    console.log(`Got iterations: ${props.stepData.params.iters}`);
    console.log(`So reagParams iterations are: ${reagParams.iters}`);

    const [selectedLiquid, setSelectedLiquid] = useState<LiquidDTO>();
    const [liquidsList, setLiquidList] = useState<LiquidDTO[]>([]);

    const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<LiquidTypeDTO>();

    async function listInitilizer() {
        const liquidList = (await getRequest<LiquidDTO[]>('/liquids')).data;
        const categoryList = (await getRequest<LiquidTypeDTO[]>('/types')).data;

        let customs = props.existingCustomLiquids
            ? Array.isArray(props.existingCustomLiquids)
                ? props.existingCustomLiquids
                : [props.existingCustomLiquids]
            : [];
        const finalLiquids = [
            ...liquidList.filter((liq) => liq.type.id != 2),
            ...customs,
        ];
        setLiquidList(finalLiquids);
        setCategories(categoryList.filter((cat) => cat.id != 2));

        let category =
            reagParams.liquid == undefined
                ? categoryList[0]
                : reagParams.liquid.type;
        setSelectedCategory(category);

        let liquid =
            reagParams.liquid == undefined
                ? finalLiquids.filter((liq) => liq.type.id == category.id)[0]
                : reagParams.liquid;

        setSelectedLiquid(liquid);
        handleParamChange('liquid', liquid);
    }
    useEffect(() => {
        listInitilizer();
    }, []);

    function handleParamChange(key: string, value: any) {
        setReagParams((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    }

    useEffect(() => {
        props.change(reagParams);
    }, [reagParams]);

    const addCustomLiquid = (newLiquid: LiquidDTO) => {
        const newCustomLiquid: LiquidDTO = {
            id: liquidsList.length + 1, //ID's start with 1
            name: newLiquid.name,
            type: selectedCategory!,
        };

        props.addNewLiquid!(newCustomLiquid);
        setLiquidList((liqs) => [...liqs!, newCustomLiquid]);
        setSelectedLiquid(newCustomLiquid);
    };

    function handleCategoryChange(cat: LiquidTypeDTO) {
        setSelectedCategory(cat);
        let filteredLiquids = liquidsList.filter(
            (liq) => liq.type.id == cat.id,
        );
        let liquid =
            selectedLiquid?.type.id != cat.id
                ? filteredLiquids.length == 0
                    ? undefined
                    : filteredLiquids[0]
                : selectedLiquid;
        setSelectedLiquid(liquid);
    }

    return (
        <>
            {liquidsList && categories && selectedCategory && (
                <ScrollView
                    style={{
                        flex: 1,
                        width: '103%',
                    }}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                >
                    <View style={bs.row}>
                        <CustomSelect
                            list={categories}
                            selected={selectedCategory}
                            canAdd={false}
                            label="Reagent category:"
                            onChangeSelect={(cat) => handleCategoryChange(cat)}
                        />
                    </View>
                    <View style={bs.row}>
                        <CustomSelect
                            list={liquidsList.filter(
                                (liq) => liq.type.id == selectedCategory.id,
                            )}
                            selected={selectedLiquid}
                            key={
                                selectedLiquid != undefined
                                    ? selectedLiquid.name
                                    : ''
                            }
                            canAdd={
                                selectedCategory.id == 8 ||
                                selectedCategory.id == 9
                                    ? true
                                    : false
                            }
                            label="Reagent:"
                            onChangeSelect={(liq) => {
                                handleParamChange('liquid', liq);
                            }}
                            onCreateOption={(liq: LiquidDTO) => {
                                addCustomLiquid(liq);
                            }}
                        />
                    </View>
                    <View style={[bs.row]}>
                        <IncubationInput
                            value={reagParams.incubation}
                            onChange={(incub: string) =>
                                handleParamChange(
                                    'incubation',
                                    incub == '' || isNaN(Number(incub))
                                        ? null
                                        : Number(incub),
                                )
                            }
                        />
                        <TimeUnitSelector
                            value={props.timeUnit}
                            onChange={(e) => props.setTimeUnit(e)}
                        />
                        <TemperatureInput
                            value={reagParams.targetTemperature}
                            onChange={(temp: string) =>
                                handleParamChange(
                                    'targetTemperature',
                                    temp == '' || isNaN(Number(temp))
                                        ? ''
                                        : Number(temp),
                                )
                            }
                        />
                    </View>
                    <HStack mb="$2" alignItems="center" space="2">
                        <IterationInput
                            value={reagParams.iters}
                            onChange={(iters: string) =>
                                handleParamChange(
                                    'iters',
                                    iters == '' || isNaN(Number(iters))
                                        ? null
                                        : Number(iters),
                                )
                            }
                        />
                        <WashingIterationsInput
                            value={reagParams.washingIterations}
                            onChange={(iters: string) =>
                                handleParamChange(
                                    'washingIterations',
                                    iters == '' ? null : Number(iters),
                                )
                            }
                        />
                    </HStack>
                </ScrollView>
            )}
        </>
    );
}

interface IncubationInputProps {
    value: number;
    onChange: (text: string) => void;
}

const IncubationInput = (props: IncubationInputProps) => {
    const value = props.value ?? '';

    return (
        <VStack mr="$2">
            <Text color="$grey" mb="$2" size="sm">
                Incubation time:
            </Text>
            <Input>
                <InputField
                    placeholder=""
                    inputMode={'numeric' as InputModeOptions}
                    value={value}
                    onChangeText={props.onChange}
                />
            </Input>
        </VStack>
    );
};

interface IterationInputProps {
    value: number;
    onChange: (text: string) => void;
}

const IterationInput = (props: IterationInputProps) => {
    const value = props.value ?? '';

    return (
        <VStack mr="$4">
            <Text color="$grey" mb="$2" size="sm">
                Iterations:
            </Text>
            <Input>
                <InputField
                    placeholder=""
                    inputMode={'numeric' as InputModeOptions}
                    value={value}
                    onChangeText={props.onChange}
                />
            </Input>
        </VStack>
    );
};

interface WashingIterationsInputProps {
    value: number;
    onChange: (text: string) => void;
}

const WashingIterationsInput = (props: WashingIterationsInputProps) => {
    const value = props.value ?? '';

    return (
        <VStack mr="$4">
            <Text color="$grey" mb="$2" size="sm">
                Washing iterations:
            </Text>
            <Input>
                <InputField
                    placeholder=""
                    inputMode={'numeric' as InputModeOptions}
                    value={value}
                    onChangeText={props.onChange}
                />
            </Input>
        </VStack>
    );
};

interface TemperatureInputProps {
    value: number;
    onChange: (text: string) => void;
}

const TemperatureInput = (props: TemperatureInputProps) => {
    const value = props.value ?? '';

    return (
        <VStack ml="$4">
            <Text color="$grey" mb="$2" size="sm">
                Target temperature (°C):
            </Text>
            <Input>
                <InputField
                    placeholder=""
                    inputMode={'decimal' as InputModeOptions}
                    value={String(value)}
                    onChangeText={props.onChange}
                />
            </Input>
        </VStack>
    );
};

interface TimeUnitSelectorProps {
    value: number;
    onChange: (text: string) => void;
}

const TimeUnitSelector = ({ value, onChange }: TimeUnitSelectorProps) => {
    return (
        <Select
            mt="$7"
            onValueChange={onChange}
            defaultValue={value}
            flex={0.8}
        >
            <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="Select option" />
                <SelectIcon as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Minutes" value="Minutes" />
                    <SelectItem label="Seconds" value="Seconds" />
                </SelectContent>
            </SelectPortal>
        </Select>
    );
};

export default function WorkBlock(props: WorkBlockProps) {
    const [params, setParams] = useState<{ [key: string]: any }>({});
    const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>(
        props.customLiquids,
    );
    const toast = useToast();
    const [toastId, setToastId] = useState(0);
    const [allowSave, setAllowSave] = useState(false);
    const [timeUnit, setTimeUnit] = useState('Seconds');
    const [saveBlockError, setSaveBlockError] = useState('');

    // Reset params when block changes (new block or editing different block)
    useEffect(() => {
        setParams(props.block.params || {});
    }, [props.block.id, props.block.type]);

    // We don't want to be constantly showing the error message in the user's face
    useEffect(() => {
        setSaveBlockError('');
    }, [props.block.type]);

    const handleToast = () => {
        if (!areParamsValid(props.block.type, params)) return;
        if (!toast.isActive(String(toastId))) {
            showNewToast();
        }
    };
    const showNewToast = () => {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
            id: String(newId),
            placement: 'top',
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast
                        nativeID={uniqueToastId}
                        duration={8000}
                        placement="top"
                        action="success"
                        variant="outline"
                    >
                        <HStack space="md">
                            <Icon as={Check} mt="$1" mr="$2" size="xl" />
                            <VStack space="md">
                                <ToastTitle>
                                    Default washing step updated
                                </ToastTitle>
                                <ToastDescription>
                                    The current washing step has been set as the
                                    default for all future and present washing
                                    steps.
                                </ToastDescription>
                            </VStack>
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    let block = props.block;

    function updateParams(step_params: any) {
        setParams((params) => ({
            ...params,
            ...step_params,
        }));
    }

    function updateCustomLiquids(newLiquid: LiquidDTO) {
        setCustomLiquids((exisiting) => [...exisiting, newLiquid]);
    }

    function saveBlockToParent() {
        if (!areParamsValid(block.type, params)) return;

        customLiquids.length != props.customLiquids.length &&
            props.updateCustomLiquids(customLiquids);

        block.params = params as typeof block.params;
        if ('incubation' in block.params && timeUnit == 'Minutes')
            (block.params as WashStep).incubation *= 60;

        props.addBlock(block);
    }

    const areParamsValid = (
        type: StepType,
        params: { [key: string]: any },
    ): boolean => {
        switch (type) {
            case StepType.LIQUID_APPL: {
                const p = params as ReagentStep;
                if (isNaN(Number(p.iters))) {
                    setSaveBlockError('Invalid number of iterations');
                    return false;
                }
                if (isNaN(Number(p.washingIterations))) {
                    setSaveBlockError('Invalid number of washing iterations');
                    return false;
                }
                if (p.washingIterations < 0) {
                    setSaveBlockError('Washing iterations cannot be negative');
                    return false;
                }
                if (p.incubation < 0) {
                    setSaveBlockError('Incubation time cannot be negative');
                    return false;
                }
                if (p.incubation == null) {
                    setSaveBlockError('Incubation time missing');
                    return false;
                }
                if (p.incubation < 0) {
                    setSaveBlockError('Incubation time cannot be negative');
                    return false;
                }
                if (p.incubation == 0) {
                    setSaveBlockError('Incubation time cannot be zero');
                    return false;
                }
                if (!p.liquid || p.liquid.id == null || p.liquid.id < 0) {
                    setSaveBlockError('Reagent liquid is missing or invalid');
                    return false;
                }
                if (
                    p.targetTemperature == null ||
                    p.targetTemperature < TEMPERATURE_MIN ||
                    p.targetTemperature > TEMPERATURE_MAX
                ) {
                    setSaveBlockError(
                        `Target temperature (${p.targetTemperature}) must be between ${TEMPERATURE_MIN} and ${TEMPERATURE_MAX}`,
                    );
                    return false;
                }
                setSaveBlockError('');
                return true;
            }

            case StepType.WASHING: {
                const p = params as WashStep;
                if (p.incubation == null) {
                    setSaveBlockError('Incubation time is missing');
                    return false;
                }
                if (p.incubation < 0) {
                    setSaveBlockError('Incubation time is negative');
                    return false;
                }
                if (p.incubation == 0) {
                    setSaveBlockError('Incubation time cannot be zero');
                    return false;
                }
                if (p.iters == null) {
                    setSaveBlockError('Wash iterations are missing');
                    return false;
                }
                if (p.iters < 0) {
                    setSaveBlockError('Wash iterations are negative');
                    return false;
                }
                if (p.iters == 0) {
                    setSaveBlockError('Wash iterations cannot be zero');
                    return false;
                }
                setSaveBlockError('');
                return true;
            }

            default:
                setSaveBlockError(`Unknown step type '${type}'`);
                return false;
        }
    };

    const memorizedParamUpdate = useCallback(updateParams, [params]);

    const block_color =
        props.block.type == StepType.WASHING
            ? AppStyles.color.block.main_washing
            : AppStyles.color.block.main_reagent;

    return (
        <>
            <View style={s.block_container}>
                <View style={s.section_inputs}>
                    {props.block.type == StepType.LIQUID_APPL && (
                        <ReagentInputs
                            stepData={props.block}
                            change={memorizedParamUpdate}
                            addNewLiquid={updateCustomLiquids}
                            existingCustomLiquids={customLiquids}
                            timeUnit={timeUnit}
                            setTimeUnit={setTimeUnit}
                            setSettings={props.setSettings}
                            settings={props.settings}
                        />
                    )}
                </View>

                {saveBlockError != '' && (
                    <Alert
                        action="error"
                        variant="solid"
                        borderRadius="$xl"
                        mb="$3"
                        width="80%"
                    >
                        <AlertIcon as={Info} />
                        <AlertText ml="$2">
                            Failed to add protocol step: {saveBlockError}
                        </AlertText>
                    </Alert>
                )}

                <View style={s.section_footer}>
                    {props.block.type == StepType.WASHING && (
                        <Button
                            variant="outline"
                            action="primary"
                            mr="$3"
                            onPress={() => {
                                handleToast();
                                props.setSettings({
                                    ...props.settings,
                                    autoWashConfig: params as WashStep,
                                });
                            }}
                        >
                            <ButtonText>Set as default</ButtonText>
                        </Button>
                    )}
                    <Button
                        action="primary"
                        variant="solid"
                        onPress={() => saveBlockToParent()}
                    >
                        <ButtonText>
                            {props.block.id == -1 ? 'Add' : 'Update'} Step
                        </ButtonText>
                    </Button>
                </View>
            </View>
        </>
    );
}

const s = StyleSheet.create({
    block_container: {
        flex: 1,
        alignItems: 'center',
    },

    section_inputs: {
        flex: 4,
        width: '80%',
        marginTop: Dimensions.get('screen').height / 40,
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    section_footer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: AppStyles.color.background,
        borderTopWidth: 1,
    },

    btn: {
        padding: '3%',
        borderRadius: 10,
    },

    setting_btn: {
        padding: '3%',
        borderRadius: 10,
        borderColor: AppStyles.color.background,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
