import { TouchableOpacity } from 'react-native';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import ConfirmationModal from '../common/TonesModal';
import {
    ReagentStep,
    StepDTO,
    TemperatureStep,
    WashStep,
} from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { AppStyles } from '../constants/styles';
import Washing_icon from '../assets/icons/washing_icon.svg';
import Reagent_icon from '../assets/icons/reagent_icon.svg';
import Temperature_icon from '../assets/icons/temperature_icon.svg';
import AW_icon from '../assets/icons/auto-wash.svg';
import Close_icon from '../assets/icons/X.svg';
import { useState } from 'react';
import { ProtocolSettings } from '../common/constructorUtils';
import {
    HStack,
    VStack,
    Icon,
    Button,
    Text,
    ButtonText,
    Box,
    Pressable,
} from '@gluestack-ui/themed';
import { Trash, Pencil } from 'lucide-react-native';

const iconSize = 18;

// Step type configuration for cleaner conditional logic
const STEP_CONFIG = {
    [StepType.WASHING]: {
        name: 'Washing',
        colors: {
            main: AppStyles.color.block.main_washing,
            transparent: AppStyles.color.block.transp_washing,
        },
        icon: Washing_icon,
    },
    [StepType.LIQUID_APPL]: {
        name: 'Reagent',
        colors: {
            main: AppStyles.color.block.main_reagent,
            transparent: AppStyles.color.block.transp_reagent,
        },
        icon: Reagent_icon,
    },
    [StepType.TEMP_CHANGE]: {
        name: 'Temperature',
        colors: {
            main: AppStyles.color.block.main_temperature,
            transparent: AppStyles.color.block.transp_temperature,
        },
        icon: Temperature_icon,
    },
} as const;

// Utility function to get step configuration
const getStepConfig = (stepType: StepType) => {
    return STEP_CONFIG[stepType];
};

// Utility function to format time values
const formatTimeValue = (value: number, timeUnits: string) => {
    if (timeUnits === 'sec') return value;
    return Math.round((value / 60) * 100) / 100;
};

const ParamItem = (props: {
    label: string;
    value: any;
    measurement?: string;
}) => {
    return (
        <HStack flex={1}>
            <Text
                size="xs"
                color="$white"
                opacity={0.8}
                textTransform="uppercase"
                fontWeight="$medium"
            >
                {props.label}:{' '}
            </Text>
            <Text
                size="sm"
                color="$white"
                fontWeight="$semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {props.value} {props.measurement ?? ''}
            </Text>
        </HStack>
    );
};

// Component for washing step parameters
const WashingStepParams = ({
    block,
    settings,
}: {
    block: StepDTO;
    settings: ProtocolSettings;
}) => {
    const params = block.params as WashStep;
    const incubationValue = formatTimeValue(
        params.incubation,
        settings.timeUnits,
    );

    return (
        <HStack flex={1}>
            <VStack space="sm" flex={1}>
                <ParamItem label="Reagent" value={params.liquid.name} />
                <ParamItem
                    label="Incubation time"
                    value={incubationValue}
                    measurement={settings.timeUnits}
                />
            </VStack>
            <VStack space="sm" flex={1}>
                <ParamItem
                    label="Iterate for"
                    value={params.iters}
                    measurement="time(s)"
                />
                <ParamItem
                    label="Temperature"
                    value={params.temperature}
                    measurement="°C"
                />
            </VStack>
        </HStack>
    );
};

// Component for reagent step parameters
const ReagentStepParams = ({
    block,
    settings,
}: {
    block: StepDTO;
    settings: ProtocolSettings;
}) => {
    const params = block.params as ReagentStep;
    const incubationValue = formatTimeValue(
        params.incubation,
        settings.timeUnits,
    );
    console.log('ReagentStepParams params:', params);

    return (
        <HStack space="md" flex={1} height="60">
            <VStack space="sm" flex={1}>
                <ParamItem label="Reagent" value={params.liquid.name} />
                <ParamItem
                    label="Incubation time"
                    value={incubationValue}
                    measurement={settings.timeUnits}
                />
            </VStack>
            <VStack space="sm" flex={1}>
                <ParamItem
                    label="Temperature"
                    value={params.temperature}
                    measurement="°C"
                />
            </VStack>
        </HStack>
    );
};

// Component for temperature step parameters
const TemperatureStepParams = ({ block }: { block: StepDTO }) => {
    const params = block.params as TemperatureStep;

    return (
        <HStack space="md" flex={1}>
            <VStack space="sm" flex={1}>
                <ParamItem
                    label="From"
                    value={params.source}
                    measurement="°C"
                />
                <ParamItem label="To" value={params.target} measurement="°C" />
            </VStack>
        </HStack>
    );
};

interface StepBlockProps {
    renderParams: RenderItemParams<StepDTO>;
    deleteStep?: (step: StepDTO) => void;
    editStep?: (step: StepDTO) => void;
    deleteAutoWash?: (step: StepDTO) => void;
    settings: ProtocolSettings;
    edit: boolean;
}

const StepBlock = (props: StepBlockProps) => {
    const { item, drag, isActive } = props.renderParams;
    const [deleteModal, setDeleteModal] = useState(false);

    const block = item;
    const stepConfig = getStepConfig(block.type);
    const blockColor = isActive
        ? stepConfig.colors.transparent
        : stepConfig.colors.main;
    const IconComponent = stepConfig.icon;

    const renderStepParams = () => {
        switch (block.type) {
            case StepType.WASHING:
                return (
                    <WashingStepParams
                        block={block}
                        settings={props.settings}
                    />
                );
            case StepType.LIQUID_APPL:
                return (
                    <ReagentStepParams
                        block={block}
                        settings={props.settings}
                    />
                );
            case StepType.TEMP_CHANGE:
                return <TemperatureStepParams block={block} />;
            default:
                return null;
        }
    };

    const hasAutoWash =
        block.type === StepType.LIQUID_APPL &&
        (block.params as ReagentStep).autoWash === true;

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onLongPress={drag}
                delayLongPress={220}
                disabled={isActive}
            >
                <Box
                    backgroundColor={blockColor}
                    borderRadius="$lg"
                    marginVertical="$1.5"
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    shadowColor="$black"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={8}
                    elevation={3}
                >
                    {/* Header */}
                    <HStack
                        alignItems="center"
                        justifyContent="space-between"
                        paddingBottom="$2"
                        borderBottomWidth={1}
                        borderBottomColor="rgba(255, 255, 255, 0.2)"
                    >
                        <HStack alignItems="center" space="md">
                            <Box
                                width={iconSize * 2}
                                height={iconSize * 2}
                                borderRadius="$full"
                                backgroundColor="rgba(0, 0, 0, 0.2)"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <IconComponent
                                    height={iconSize}
                                    width={iconSize}
                                    fill={AppStyles.color.elem_back}
                                />
                            </Box>
                            <Text color="$white" size="lg" fontWeight="$bold">
                                {stepConfig.name}
                            </Text>
                        </HStack>

                        {props.edit && (
                            <Button
                                size="sm"
                                variant="outline"
                                borderColor="rgba(255, 255, 255, 0.3)"
                                backgroundColor="rgba(255, 255, 255, 0.1)"
                                onPress={() => setDeleteModal(true)}
                            >
                                <Icon as={Trash} color="$white" size="sm" />
                                <ButtonText
                                    color="$white"
                                    marginLeft="$1"
                                    size="sm"
                                >
                                    Delete
                                </ButtonText>
                            </Button>
                        )}
                    </HStack>

                    {/* Content */}
                    <HStack alignItems="flex-start" paddingTop="$3" space="md">
                        {renderStepParams()}

                        {props.edit && (
                            <VStack
                                alignItems="flex-end"
                                justifyContent="center"
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    borderColor="rgba(255, 255, 255, 0.3)"
                                    backgroundColor="rgba(255, 255, 255, 0.1)"
                                    onPress={() => props.editStep?.(item)}
                                >
                                    <Icon
                                        as={Pencil}
                                        color="$white"
                                        size="sm"
                                    />
                                    <ButtonText
                                        color="$white"
                                        marginLeft="$1"
                                        size="sm"
                                    >
                                        Edit
                                    </ButtonText>
                                </Button>
                            </VStack>
                        )}
                    </HStack>

                    {/* Auto Wash Section */}
                    {hasAutoWash && (
                        <Box
                            backgroundColor="$white"
                            borderRadius="$md"
                            padding="$2.5"
                            marginTop="$2"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <AW_icon
                                height={20}
                                width={20}
                                style={{ marginRight: 8 }}
                            />
                            <Text flex={1} size="sm" color="$textLight900">
                                Auto Washing:{' '}
                                {props.settings.autoWashConfig.iters} x{' '}
                                {props.settings.autoWashConfig.incubation}{' '}
                                {props.settings.timeUnits}
                            </Text>
                            {props.edit && (
                                <Pressable
                                    onPress={() =>
                                        props.deleteAutoWash?.({
                                            ...block,
                                            params: {
                                                ...block.params,
                                                autoWash: false,
                                            },
                                        })
                                    }
                                    padding="$1"
                                >
                                    <Close_icon height={20} width={20} />
                                </Pressable>
                            )}
                        </Box>
                    )}
                </Box>
            </TouchableOpacity>

            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                action={() => props.deleteStep?.(item)}
                icon={Trash}
                headline={`Delete ${item.type.toLowerCase()} step`}
                text="Are you sure you want to delete this step? This action cannot be undone."
                actionButtonText="Delete"
                type="error"
            />
        </>
    );
};

export default StepBlock;
