import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    InputModeOptions,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { AppStyles } from '../constants/styles';
import {
    ReagentStep,
    StepDTO,
    TemperatureStep,
    WashStep,
} from 'sharedlib/dto/step.dto';
import { LiquidDTO, LiquidTypeDTO } from 'sharedlib/dto/liquid.dto';
import { useCallback, useEffect, useState, useRef } from 'react';
import Txt from '../components/Txt';
import { getRequest } from '../common/util';
import { CustomSelect } from '../components/Select';
import InputField from '../components/InputField';
import Info_icon from '../assets/icons/info.svg';
import { StepType } from 'sharedlib/enum/DBEnums';
import Setting_icon from '../assets/icons/setting.svg';
import { Switch } from 'react-native-switch';
import { ProtocolSettings } from '../common/constructorUtils';
import {
    INCUBATION_MAX,
    INCUBATION_MIN,
    ITERATIONS_MAX,
    ITERATIONS_MIN,
    TEMPERATURE_MAX,
    TEMPERATURE_MIN,
} from '../constants/protocol_constants';

export interface WorkBlockProps {
    block: StepDTO;
    addBlock: (block: StepDTO) => void;
    editBlock: (block: StepDTO) => void;
    updateCustomLiquids: (liquids: LiquidDTO[]) => void;
    customLiquids: LiquidDTO[];
    settings: ProtocolSettings;
}

interface BlockInputsProps {
    stepData: StepDTO;
    change: (arg0: WashStep | ReagentStep | TemperatureStep) => void;
    addNewLiquid?: (liquid: LiquidDTO) => void;
    existingCustomLiquids?: LiquidDTO[];
    timeUnits?: 'sec' | 'min';
}

const bs = StyleSheet.create({
    inputs: {
        width: '100%',
        flexDirection: 'column',
    },

    row: {
        flexDirection: 'row',
        height: 'auto',
        borderBottomColor: AppStyles.color.background,
        borderBottomWidth: 1,
        paddingBottom: 30,
    },
});

function WashInputs(props: BlockInputsProps) {
    const [washParams, setWashParams] = useState(
        props.stepData.params as WashStep,
    );
    const [selectedLiquid, setSelectedLiquid] = useState<LiquidDTO>();
    const [liquidsList, setLiquidList] = useState<LiquidDTO[]>([]);

    const listInitilizer = () => {
        getRequest<LiquidDTO[]>('/liquids').then((r) => {
            let filtered = r.data.filter((liq) => liq.type.id == 2);
            setLiquidList(filtered);
            let liquid =
                washParams.liquid != undefined
                    ? washParams.liquid
                    : filtered[0];
            setSelectedLiquid(liquid);
            handleParamChange('liquid', liquid);
        });
    };
    useEffect(listInitilizer, []);

    function handleParamChange(key: string, value: any) {
        setWashParams((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    }

    useEffect(() => {
        props.change(washParams);
    }, [washParams]);

    return (
        <>
            {liquidsList && selectedLiquid && (
                <>
                    <View style={bs.row}>
                        <CustomSelect
                            list={liquidsList}
                            selected={selectedLiquid || liquidsList[0]}
                            canAdd={false}
                            label="Reagent:"
                            onChangeSelect={(liq) => {
                                handleParamChange('liquid', liq);
                            }}
                        />
                    </View>
                    <View style={[bs.row]}>
                        <InputField
                            placeholder="|"
                            containerStyle={{ marginRight: 100 }}
                            label="Iterations:"
                            decimals={false}
                            limit_max={ITERATIONS_MAX}
                            limit_min={ITERATIONS_MIN}
                            type={'numeric' as InputModeOptions}
                            value={washParams.iters}
                            onInputChange={(iters) =>
                                handleParamChange(
                                    'iters',
                                    iters == '' ? null : Number(iters),
                                )
                            }
                        />
                        <InputField
                            placeholder="|"
                            label={`Incubation time (${props.timeUnits || 'seconds'}):`}
                            decimals={false}
                            limit_min={
                                props.timeUnits && props.timeUnits == 'min'
                                    ? INCUBATION_MIN / 60
                                    : INCUBATION_MIN
                            }
                            limit_max={
                                props.timeUnits && props.timeUnits == 'min'
                                    ? INCUBATION_MAX / 60
                                    : INCUBATION_MAX
                            }
                            type={'numeric' as InputModeOptions}
                            value={washParams.incubation}
                            onInputChange={(incub) =>
                                handleParamChange(
                                    'incubation',
                                    incub == '' ? null : Number(incub),
                                )
                            }
                        />
                    </View>
                </>
            )}
        </>
    );
}

function ReagentInputs(props: BlockInputsProps) {
    const [reagParams, setReagParams] = useState({
        ...props.stepData.params,
        autoWash:
            (props.stepData.params as ReagentStep).autoWash == undefined
                ? false
                : (props.stepData.params as ReagentStep).autoWash,
    } as ReagentStep);

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
                        <InputField
                            value={reagParams.incubation}
                            placeholder="|"
                            decimals={false}
                            limit_max={INCUBATION_MAX}
                            limit_min={INCUBATION_MIN}
                            label={`INCUBATION TIME (${props.timeUnits || 'seconds'}):`}
                            type={'numeric' as InputModeOptions}
                            onInputChange={(incub) =>
                                handleParamChange(
                                    'incubation',
                                    incub == '' ? null : Number(incub),
                                )
                            }
                        />

                        <View
                            style={{ flexDirection: 'column', paddingLeft: 30 }}
                        >
                            <Txt
                                style={{
                                    color: AppStyles.color.text_faded,
                                    paddingBottom:
                                        AppStyles.layout.elem_padding,
                                }}
                            >
                                Automatic washing (after step):
                            </Txt>
                            <Switch
                                value={reagParams.autoWash}
                                onValueChange={(val) => {
                                    handleParamChange(
                                        'autoWash',
                                        !reagParams.autoWash,
                                    );
                                }}
                                activeText={'ON'}
                                inActiveText={'OFF'}
                                circleSize={40}
                                barHeight={40}
                                circleBorderWidth={1}
                                backgroundActive={AppStyles.color.primary}
                                backgroundInactive={AppStyles.color.background}
                                circleActiveColor={AppStyles.color.elem_back}
                                circleInActiveColor={AppStyles.color.elem_back}
                                // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
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
                                switchWidthMultiplier={3.3} // multiplied by the `circleSize` prop to calculate total width of the Switch
                                switchBorderRadius={40} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                            />
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

function TemperatureInputs(props: BlockInputsProps) {
    const [temperParams, setTemperParams] = useState(
        props.stepData.params as TemperatureStep,
    );

    function handleParamChange(key: string, value: any) {
        setTemperParams((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    }

    useEffect(() => {
        props.change(temperParams);
    }, [temperParams]);

    return (
        <KeyboardAvoidingView style={bs.inputs} behavior="padding">
            <View style={[bs.row]}>
                <InputField
                    placeholder="|"
                    value={temperParams.source}
                    containerStyle={{ marginRight: 100 }}
                    label="From (°C):"
                    type={'numeric' as InputModeOptions}
                    disabled={true}
                />
                <InputField
                    value={temperParams.target}
                    placeholder="|"
                    limit_max={TEMPERATURE_MAX}
                    limit_min={TEMPERATURE_MIN}
                    label="Target (°C):"
                    decimals={true}
                    type={'numeric' as InputModeOptions}
                    onInputChange={(target) =>
                        handleParamChange(
                            'target',
                            target == '' ? null : Number(target),
                        )
                    }
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default function WorkBlock(props: WorkBlockProps) {
    const [params, setParams] = useState<{ [key: string]: any }>({});
    const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>(
        props.customLiquids,
    );
    const [allowSave, setAllowSave] = useState(false);

    let block = props.block;

    function updateParams(step_params: any) {
        setParams((params) => ({
            ...params,
            ...step_params,
        }));

        validateParams(block.type, step_params);
    }

    function updateCustomLiquids(newLiquid: LiquidDTO) {
        setCustomLiquids((exisiting) => [...exisiting, newLiquid]);
    }

    function saveBlockToParent() {
        customLiquids.length != props.customLiquids.length &&
            props.updateCustomLiquids(customLiquids);

        block.params = params as typeof block.params;
        if ('incubation' in block.params && props.settings.timeUnits == 'min')
            (block.params as WashStep).incubation *= 60;

        block.id == -1 ? props.addBlock(block) : props.editBlock(block);
    }

    function validateParams(type: StepType, params: { [key: string]: any }) {
        let valid = true;
        switch (type) {
            case StepType.LIQUID_APPL:
                {
                    let reag_params = params as ReagentStep;
                    if (
                        reag_params.incubation == undefined ||
                        reag_params.incubation < 0 ||
                        reag_params.liquid == undefined ||
                        reag_params.liquid.id < 0
                    ) {
                        valid = false;
                    }
                }
                break;
            case StepType.WASHING:
                {
                    let wash_params = params as WashStep;
                    if (
                        wash_params.incubation == undefined ||
                        wash_params.incubation < 0 ||
                        wash_params.iters == undefined ||
                        wash_params.iters < 0
                    ) {
                        valid = false;
                    }
                }
                break;
            case StepType.TEMP_CHANGE:
                {
                    let temp_params = params as TemperatureStep;
                    if (
                        temp_params.source == undefined ||
                        temp_params.source <= 0 ||
                        temp_params.target == undefined ||
                        temp_params.target <= 0
                    ) {
                        valid = false;
                    }
                }
                break;
        }
        setAllowSave(valid);
    }

    const memorizedParamUpdate = useCallback(updateParams, [params]);

    const block_color =
        props.block.type == StepType.WASHING
            ? AppStyles.color.block.main_washing
            : props.block.type == StepType.LIQUID_APPL
              ? AppStyles.color.block.main_reagent
              : AppStyles.color.block.main_temperature;

    return (
        <>
            <View style={s.block_container}>
                <View style={s.section_inputs}>
                    {props.block.type == StepType.WASHING && (
                        <WashInputs
                            stepData={props.block}
                            change={memorizedParamUpdate}
                            timeUnits={props.settings.timeUnits}
                        />
                    )}
                    {props.block.type == StepType.LIQUID_APPL && (
                        <ReagentInputs
                            stepData={props.block}
                            change={memorizedParamUpdate}
                            addNewLiquid={updateCustomLiquids}
                            existingCustomLiquids={customLiquids}
                            timeUnits={props.settings.timeUnits}
                        />
                    )}
                    {props.block.type == StepType.TEMP_CHANGE && (
                        <TemperatureInputs
                            stepData={props.block}
                            change={memorizedParamUpdate}
                        />
                    )}
                </View>

                <View style={s.section_footer}>
                    <View
                        style={{
                            borderRadius: 10,
                            width: '85%',
                            backgroundColor: AppStyles.color.warning,
                        }}
                    >
                        <TouchableOpacity
                            style={[s.btn, { backgroundColor: block_color }]}
                            onPressIn={() => allowSave && saveBlockToParent()}
                        >
                            <Txt
                                style={{
                                    color: AppStyles.color.elem_back,
                                    alignSelf: 'center',
                                    fontFamily: 'Roboto-bold',
                                }}
                            >
                                {props.block.id == -1 ? 'Add' : 'Update'} Step
                            </Txt>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'space-between',
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
