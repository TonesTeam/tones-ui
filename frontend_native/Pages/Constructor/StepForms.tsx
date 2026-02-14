import React from 'react';
import { View, TouchableOpacity, InputModeOptions } from 'react-native';
import {
    VStack,
    HStack,
    Button,
    Text,
    Input,
    InputField,
    ButtonText,
    Icon,
} from '@gluestack-ui/themed';
import { Trash2, FlaskConical, Waves } from 'lucide-react-native';
import { LiquidDTO, LiquidTypeDTO } from 'common/dto/liquid.dto';
import { WashStep, ReagentStep, StepDTO } from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import { CustomSelect } from '../../components/Select';
import { StyleSheet } from 'react-native';

const s = StyleSheet.create({
    stepForm: {
        flex: 1,
    },
});

export const WashingStepForm = ({
    washLiquids,
    formData,
    onFormChange,
    onCancel,
    onAdd,
}: {
    washLiquids: LiquidDTO[];
    formData: WashStep;
    onFormChange: (data: WashStep) => void;
    onCancel: () => void;
    onAdd: () => void;
}) => {
    return (
        <View style={s.stepForm}>
            <HStack justifyContent="space-between" alignItems="center" mb="$4">
                <HStack alignItems="center" space="sm">
                    <Icon as={Waves} size="md" />
                    <Text fontSize="$md" fontWeight="$medium">
                        Add Washing
                    </Text>
                </HStack>
                <TouchableOpacity onPress={onCancel}>
                    <Icon as={Trash2} size="md" color="$grey" />
                </TouchableOpacity>
            </HStack>

            <VStack space="md">
                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Liquid name
                    </Text>
                    <CustomSelect
                        list={washLiquids}
                        selected={formData.liquid}
                        canAdd={false}
                        label=""
                        onChangeSelect={(liq) => {
                            onFormChange({
                                ...formData,
                                liquid: liq as LiquidDTO,
                            });
                        }}
                    />
                </VStack>

                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Iterations
                    </Text>
                    <Input>
                        <InputField
                            placeholder=""
                            inputMode={'numeric' as InputModeOptions}
                            value={String(formData.iters)}
                            onChangeText={(text: string) =>
                                onFormChange({
                                    ...formData,
                                    iters: text === '' ? 0 : Number(text),
                                })
                            }
                        />
                    </Input>
                </VStack>

                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Incubation time (seconds)
                    </Text>
                    <Input>
                        <InputField
                            placeholder=""
                            inputMode={'numeric' as InputModeOptions}
                            value={String(formData.incubation)}
                            onChangeText={(text: string) =>
                                onFormChange({
                                    ...formData,
                                    incubation: text === '' ? 0 : Number(text),
                                })
                            }
                        />
                    </Input>
                </VStack>

                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Target temperature (degrees, celsius)
                    </Text>
                    <Input>
                        <InputField
                            placeholder=""
                            inputMode={'decimal' as InputModeOptions}
                            value={String(formData.targetTemperature)}
                            onChangeText={(text: string) =>
                                onFormChange({
                                    ...formData,
                                    targetTemperature:
                                        text === '' ? 0 : Number(text),
                                })
                            }
                        />
                    </Input>
                </VStack>
            </VStack>

            <HStack space="md" mt="$6" justifyContent="space-between">
                <Button
                    variant="outline"
                    action="secondary"
                    flex={1}
                    onPress={onCancel}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                <Button action="primary" flex={1} bg="$black" onPress={onAdd}>
                    <ButtonText>Add to step</ButtonText>
                </Button>
            </HStack>
        </View>
    );
};

export const ReagentStepForm = ({
    categories,
    reagentLiquids,
    formData,
    onFormChange,
    onCancel,
    onAdd,
}: {
    categories: LiquidTypeDTO[];
    reagentLiquids: LiquidDTO[];
    formData: ReagentStep & { category?: LiquidTypeDTO };
    onFormChange: (data: ReagentStep & { category?: LiquidTypeDTO }) => void;
    onCancel: () => void;
    onAdd: () => void;
}) => {
    const filteredLiquids = formData.category
        ? reagentLiquids.filter((liq) => liq.type.id === formData.category!.id)
        : reagentLiquids;

    return (
        <View style={s.stepForm}>
            <HStack justifyContent="space-between" alignItems="center" mb="$4">
                <HStack alignItems="center" space="sm">
                    <Icon as={FlaskConical} size="md" />
                    <Text fontSize="$md" fontWeight="$medium">
                        Add Reagent
                    </Text>
                </HStack>
                <TouchableOpacity onPress={onCancel}>
                    <Icon as={Trash2} size="md" color="$grey" />
                </TouchableOpacity>
            </HStack>

            <VStack space="md">
                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Category
                    </Text>
                    <CustomSelect
                        list={categories}
                        selected={formData.category}
                        canAdd={false}
                        label=""
                        onChangeSelect={(cat) => {
                            const category = cat as LiquidTypeDTO;
                            const newFilteredLiquids = reagentLiquids.filter(
                                (liq) => liq.type.id === category.id,
                            );
                            const newLiquid =
                                newFilteredLiquids.length > 0
                                    ? newFilteredLiquids[0]
                                    : undefined;
                            onFormChange({
                                ...formData,
                                category: category,
                                liquid: newLiquid as any,
                            });
                        }}
                    />
                </VStack>

                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Reagent name
                    </Text>
                    <CustomSelect
                        key={formData.category?.id || 'no-category'}
                        list={filteredLiquids}
                        selected={formData.liquid}
                        canAdd={false}
                        label=""
                        onChangeSelect={(liq) => {
                            onFormChange({
                                ...formData,
                                liquid: liq as LiquidDTO,
                            });
                        }}
                    />
                </VStack>

                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Incubation time (minutes)
                    </Text>
                    <Input>
                        <InputField
                            placeholder=""
                            inputMode={'numeric' as InputModeOptions}
                            value={String(formData.incubation)}
                            onChangeText={(text: string) =>
                                onFormChange({
                                    ...formData,
                                    incubation: text === '' ? 0 : Number(text),
                                })
                            }
                        />
                    </Input>
                </VStack>

                <VStack>
                    <Text fontSize="$sm" color="$grey" mb="$2">
                        Target temperature (degrees, celsius)
                    </Text>
                    <Input>
                        <InputField
                            placeholder=""
                            inputMode={'decimal' as InputModeOptions}
                            value={String(formData.targetTemperature)}
                            onChangeText={(text: string) =>
                                onFormChange({
                                    ...formData,
                                    targetTemperature:
                                        text === '' ? 0 : Number(text),
                                })
                            }
                        />
                    </Input>
                </VStack>
            </VStack>

            <HStack space="md" mt="$6" justifyContent="space-between">
                <Button
                    variant="outline"
                    action="secondary"
                    flex={1}
                    onPress={onCancel}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                <Button action="primary" flex={1} bg="$black" onPress={onAdd}>
                    <ButtonText>Add to step</ButtonText>
                </Button>
            </HStack>
        </View>
    );
};
