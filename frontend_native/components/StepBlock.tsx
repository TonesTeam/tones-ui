import { TouchableOpacity } from 'react-native';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import ConfirmationModal from '../components/ConfirmationModal';
import { ReagentStep, StepDTO, WashStep } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { AppStyles } from '../constants/styles';
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
import { Eye, FlaskConical, Waves } from 'lucide-react-native';
import { Trash, Pencil } from 'lucide-react-native';
import { formatDuration } from '../common/util';

const iconSize = 18;

// Step type configuration for cleaner conditional logic
const STEP_CONFIG = {
    [StepType.WASHING]: {
        name: 'Washing',
        colors: {
            main: AppStyles.color.block.main_washing,
            transparent: AppStyles.color.block.transp_washing,
        },
        icon: Waves,
    },
    [StepType.LIQUID_APPL]: {
        name: 'Reagent',
        colors: {
            main: AppStyles.color.block.main_reagent,
            transparent: AppStyles.color.block.transp_reagent,
        },
        icon: FlaskConical,
    },
} as const;

// Utility function to get step configuration
const getStepConfig = (stepType: StepType) => {
    return STEP_CONFIG[stepType];
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
    const incubationValue = formatDuration(params.incubation);

    return (
        <HStack flex={1}>
            <ParamItem label="Reagent" value={params.liquid.name} />
            <ParamItem label="Incubation time" value={incubationValue} />
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
    const incubationValue = formatDuration(params.incubation);
    console.log('ReagentStepParams params:', params);
    console.log('Got washing iterations:', params.washingIterations);

    return (
        <HStack flex={1} height="$full">
            <VStack space="sm" flex={1}>
                <ParamItem label="Reagent" value={params.liquid.name} />
                <ParamItem label="Incubation time" value={incubationValue} />
            </VStack>
            <VStack space="sm" flex={1}>
                <ParamItem
                    label="Target Temperature"
                    value={params.targetTemperature}
                    measurement="°C"
                />
                <ParamItem
                    label="Washing Iterations"
                    value={params.washingIterations}
                />
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
            default:
                return null;
        }
    };

    const hasAutoWash =
        block.type === StepType.LIQUID_APPL &&
        (block.params as ReagentStep).autoWash === true;

    console.log(block);
    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onLongPress={drag}
                delayLongPress={220}
                disabled={isActive}
            >
                <Box
                    bg="$white"
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
                                <Icon
                                    as={Eye}
                                    color="$white"
                                    size="lg"
                                    height={iconSize}
                                    width={iconSize}
                                />
                            </Box>
                            <Text color="$white" size="lg" fontWeight="$bold">
                                {block.iterations > 1
                                    ? ` (${block.iterations} times)`
                                    : ''}
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
                            <Icon
                                as={Waves}
                                color="$textLight900"
                                size="sm"
                                mr="$1"
                            />
                            <Text flex={1} size="sm" color="$textLight900">
                                Auto Washing:{' '}
                                {props.settings.autoWashConfig.iters} x{' '}
                                {formatDuration(
                                    props.settings.autoWashConfig.incubation,
                                )}{' '}
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
                headline={`Delete step`}
                text="Are you sure you want to delete this step? This action cannot be undone."
                actionButtonText="Delete"
            />
        </>
    );
};

export default StepBlock;
