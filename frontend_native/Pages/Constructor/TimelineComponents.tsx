import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { HStack, Text, Icon, Box } from '@gluestack-ui/themed';
import {
    Pencil,
    Copy,
    Trash2,
    Clock,
    Thermometer,
    RotateCw,
    GripVertical,
    FlaskConical,
    Waves,
} from 'lucide-react-native';
import {
    StepBatchDTO,
    StepDTO,
    WashStep,
    ReagentStep,
} from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { AppStyles } from '../../constants/styles';
import Txt from '../../components/Txt';
import DraggableFlatList, {
    ScaleDecorator,
    RenderItemParams,
} from 'react-native-draggable-flatlist';

const s = StyleSheet.create({
    timeline: {
        backgroundColor: AppStyles.color.background,
        width: 621,
        flexDirection: 'column',
    },
    timelineHeader: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10,
        fontSize: 18,
        fontFamily: 'Roboto-bold',
        color: AppStyles.color.text_primary,
    },
    timelineDuration: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 10,
        fontSize: 14,
        color: AppStyles.color.text_faded,
    },
    stepBatchContainer: {
        marginBottom: 20,
        backgroundColor: AppStyles.color.elem_back,
        borderRadius: 8,
        overflow: 'hidden',
    },
    stepBatchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#e8e8e8',
    },
    stepBatchHeaderSelected: {
        backgroundColor: '#d0e8ff',
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    iconButton: {
        padding: 5,
    },
    stepsList: {
        padding: 10,
    },
    stepItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 4,
        borderRadius: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dragIcon: {
        marginRight: 8,
    },
    stepNumber: {
        fontSize: 12,
        color: '#666',
        marginRight: 12,
        minWidth: 30,
    },
    stepDetails: {
        marginRight: 12,
    },
    deleteButton: {
        padding: 4,
    },
});

export const StepBatchHeader = ({
    batch,
    onEdit,
    onCopy,
    onDelete,
    drag,
    onSelect,
    isSelected,
    isEditing,
    editingName,
    onNameChange,
    onNameSave,
    onNameCancel,
}: {
    batch: StepBatchDTO;
    onEdit: () => void;
    onCopy: () => void;
    onDelete: () => void;
    drag?: () => void;
    onSelect?: () => void;
    isSelected?: boolean;
    isEditing?: boolean;
    editingName?: string;
    onNameChange?: (name: string) => void;
    onNameSave?: () => void;
    onNameCancel?: () => void;
}) => {
    return (
        <TouchableOpacity
            onLongPress={drag}
            onPress={onSelect}
            disabled={!drag && !onSelect}
            activeOpacity={0.8}
        >
            <View
                style={[
                    s.stepBatchHeader,
                    isSelected && s.stepBatchHeaderSelected,
                ]}
            >
                <HStack alignItems="center" space="sm" flex={1}>
                    {drag && <Icon as={GripVertical} size="sm" color="$grey" />}
                    {isEditing ? (
                        <HStack alignItems="center" space="xs" flex={1}>
                            <TextInput
                                value={editingName}
                                onChangeText={onNameChange}
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    flex: 1,
                                    padding: 4,
                                    borderWidth: 1,
                                    borderColor: '#2196F3',
                                    borderRadius: 4,
                                }}
                                autoFocus
                                onSubmitEditing={onNameSave}
                            />
                            <TouchableOpacity onPress={onNameSave}>
                                <Text fontSize="$sm" color="$blue600">
                                    ✓
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onNameCancel}>
                                <Text fontSize="$sm" color="$red600">
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </HStack>
                    ) : (
                        <Text fontSize="$md" fontWeight="$medium">
                            {batch.name || `Step ${batch.sequenceNumber}`}
                        </Text>
                    )}
                </HStack>
                <HStack space="sm">
                    <TouchableOpacity onPress={onEdit} style={s.iconButton}>
                        <Icon as={Pencil} size="sm" color="$grey" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onCopy} style={s.iconButton}>
                        <Icon as={Copy} size="sm" color="$grey" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} style={s.iconButton}>
                        <Icon as={Trash2} size="sm" color="$grey" />
                    </TouchableOpacity>
                </HStack>
            </View>
        </TouchableOpacity>
    );
};

export const StepItemDisplay = ({
    step,
    index,
    onDelete,
    drag,
    isActive,
}: {
    step: StepDTO;
    index: number;
    onDelete: () => void;
    drag?: () => void;
    isActive?: boolean;
}) => {
    const isWashing = step.type === StepType.WASHING;
    const params = step.params as WashStep | ReagentStep;

    const content = (
        <TouchableOpacity
            onLongPress={drag}
            disabled={!drag}
            activeOpacity={0.8}
        >
            <View
                style={[
                    s.stepItemRow,
                    isActive && {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#999',
                    },
                ]}
            >
                <Icon
                    as={GripVertical}
                    size="xs"
                    color="$grey"
                    style={s.dragIcon}
                />
                <Text style={s.stepNumber}>#{index + 1}</Text>

                <HStack alignItems="center" space="xs" flex={1}>
                    <Icon
                        as={isWashing ? Waves : FlaskConical}
                        size="sm"
                        color={isWashing ? '$blue500' : '$orange500'}
                    />
                    <Text fontSize="$sm" fontWeight="$medium">
                        {params.liquid?.name ||
                            (isWashing ? 'Washing' : 'Reagent')}
                    </Text>
                </HStack>

                <HStack alignItems="center" space="md" style={s.stepDetails}>
                    <HStack alignItems="center" space="xs">
                        <Icon as={Clock} size="xs" color="$grey" />
                        <Text fontSize="$xs" color="$grey">
                            {Math.floor(params.incubation / 60)} minutes
                        </Text>
                    </HStack>

                    <HStack alignItems="center" space="xs">
                        <Icon as={Thermometer} size="xs" color="$grey" />
                        <Text fontSize="$xs" color="$grey">
                            {(params as any).targetTemperature || 25}
                        </Text>
                    </HStack>

                    {isWashing && (
                        <HStack alignItems="center" space="xs">
                            <Icon as={RotateCw} size="xs" color="$grey" />
                            <Text fontSize="$xs" color="$grey">
                                {(params as WashStep).iters}
                            </Text>
                        </HStack>
                    )}
                </HStack>

                <TouchableOpacity onPress={onDelete} style={s.deleteButton}>
                    <Icon as={Trash2} size="sm" color="$grey" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // Используем ScaleDecorator только если drag доступен (внутри DraggableFlatList)
    if (drag) {
        return <ScaleDecorator>{content}</ScaleDecorator>;
    }

    return content;
};

interface TimelineProps {
    stepBatches: StepBatchDTO[];
    selectedBatchId?: number | null;
    onSelectBatch?: (batchId: number | null) => void;
    editingBatchId?: number | null;
    editingBatchName?: string;
    onBatchNameChange?: (name: string) => void;
    onBatchNameSave?: () => void;
    onBatchNameCancel?: () => void;
    onReorder: (newBatches: StepBatchDTO[]) => void;
    onReorderSteps: (batchId: number, newSteps: StepDTO[]) => void;
    onEdit: (batchId: number) => void;
    onCopy: (batchId: number) => void;
    onDelete: (batchId: number) => void;
    deleteBlock: (step: StepDTO) => void;
    readonly?: boolean;
}

export const Timeline = ({
    stepBatches,
    selectedBatchId,
    onSelectBatch,
    editingBatchId,
    editingBatchName,
    onBatchNameChange,
    onBatchNameSave,
    onBatchNameCancel,
    onReorder,
    onReorderSteps,
    onEdit,
    onCopy,
    onDelete,
    deleteBlock,
    readonly = false,
}: TimelineProps) => {
    const renderBatch = ({
        item: batch,
        drag,
        isActive,
    }: RenderItemParams<StepBatchDTO>) => {
        const renderStep = ({
            item: step,
            drag: dragStep,
            isActive: isStepActive,
            getIndex,
        }: RenderItemParams<StepDTO>) => (
            <StepItemDisplay
                step={step}
                index={getIndex() || 0}
                onDelete={() => deleteBlock(step)}
                drag={readonly ? undefined : dragStep}
                isActive={isStepActive}
            />
        );

        return (
            <ScaleDecorator>
                <View
                    style={[s.stepBatchContainer, isActive && { opacity: 0.9 }]}
                >
                    <StepBatchHeader
                        batch={batch}
                        onEdit={() => onEdit(batch.id)}
                        onCopy={() => onCopy(batch.id)}
                        onDelete={() => onDelete(batch.id)}
                        drag={readonly ? undefined : drag}
                        onSelect={
                            onSelectBatch
                                ? () => onSelectBatch(batch.id)
                                : undefined
                        }
                        isSelected={selectedBatchId === batch.id}
                        isEditing={editingBatchId === batch.id}
                        editingName={editingBatchName}
                        onNameChange={onBatchNameChange}
                        onNameSave={onBatchNameSave}
                        onNameCancel={onBatchNameCancel}
                    />
                    {batch.steps.length > 0 && (
                        <View style={s.stepsList}>
                            {readonly ? (
                                batch.steps.map((step, index) => (
                                    <StepItemDisplay
                                        key={step.id}
                                        step={step}
                                        index={index}
                                        onDelete={() => deleteBlock(step)}
                                    />
                                ))
                            ) : (
                                <DraggableFlatList
                                    data={batch.steps}
                                    renderItem={renderStep}
                                    keyExtractor={(step) => String(step.id)}
                                    onDragEnd={({ data }) =>
                                        onReorderSteps(batch.id, data)
                                    }
                                />
                            )}
                        </View>
                    )}
                </View>
            </ScaleDecorator>
        );
    };

    if (stepBatches.length === 0) {
        return (
            <View style={s.timeline}>
                <Txt style={s.timelineHeader}>Timeline</Txt>
                <Text style={s.timelineDuration}>00:00:00</Text>
                <Box alignItems="center" justifyContent="center" flex={1}>
                    <Text color="$grey" mt="$4" italic>
                        Add reagent or washing
                    </Text>
                </Box>
            </View>
        );
    }

    return (
        <View style={s.timeline}>
            <Txt style={s.timelineHeader}>Timeline</Txt>
            <Text style={s.timelineDuration}>00:00:00</Text>
            {readonly ? (
                <View style={{ flex: 1, padding: 20 }}>
                    {stepBatches.map((batch) => (
                        <View key={batch.id} style={s.stepBatchContainer}>
                            <StepBatchHeader
                                batch={batch}
                                onEdit={() => onEdit(batch.id)}
                                onCopy={() => onCopy(batch.id)}
                                onDelete={() => onDelete(batch.id)}
                                onSelect={
                                    onSelectBatch
                                        ? () => onSelectBatch(batch.id)
                                        : undefined
                                }
                                isSelected={selectedBatchId === batch.id}
                                isEditing={editingBatchId === batch.id}
                                editingName={editingBatchName}
                                onNameChange={onBatchNameChange}
                                onNameSave={onBatchNameSave}
                                onNameCancel={onBatchNameCancel}
                            />
                            {batch.steps.length > 0 && (
                                <View style={s.stepsList}>
                                    {batch.steps.map((step, index) => (
                                        <StepItemDisplay
                                            key={step.id}
                                            step={step}
                                            index={index}
                                            onDelete={() => deleteBlock(step)}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <DraggableFlatList
                    data={stepBatches}
                    renderItem={renderBatch}
                    keyExtractor={(batch) => String(batch.id)}
                    onDragEnd={({ data }) => onReorder(data)}
                    contentContainerStyle={{ padding: 20 }}
                />
            )}
        </View>
    );
};
