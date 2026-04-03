import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Txt from '../../components/Txt';
import { AppStyles } from '../../constants/styles';
import { SLOT_QUANTITY } from '../../common/cartridgeConfig';
import { useState, useEffect } from 'react';
import { getRequest, makeRequest } from '../../common/util';
import {
    Icon,
    Text,
    VStack,
    HStack,
    Pressable,
    Box,
    Image,
} from '@gluestack-ui/themed';

type SlotState = {
    id: number;
    state: 'Idle' | 'Missing' | 'Busy';
};

export function SlotSelection(props: {
    selectedSlots: Set<number>;
    setSelectedSlots: (slots: Set<number>) => void;
}) {
    const [slotStates, setSlotStates] = useState<Map<number, string>>();

    useEffect(() => {
        getRequest('/hardware/slot-states').then((res) => {
            const states = new Map<number, string>();
            const data = res.data as SlotState[];
            data.forEach((slot: SlotState) => {
                states.set(slot.id, slot.state);
            });
            setSlotStates(states);
        });
    }, []);

    return (
        <HStack>
            {/* Left Panel - Instructions */}
            <VStack px={25}>
                <Text
                    fontFamily="Orbitron-Bold"
                    fontSize={20}
                    color="#1F2832"
                    mb={10}
                >
                    Select slots
                </Text>
                <VStack width={200} gap={10}>
                    <Text>
                        <Text fontSize={12} fontFamily="Manrope-SemiBold">
                            1.{' '}
                        </Text>
                        <Text fontSize={12} fontFamily="Manrope-Medium">
                            Check whether any samples from the previous run
                            remain in the slots. Remove any samples if present.
                        </Text>
                    </Text>
                    <Text>
                        <Text fontSize={12} fontFamily="Manrope-SemiBold">
                            2.{' '}
                        </Text>
                        <Text fontSize={12} fontFamily="Manrope-Medium">
                            Select how many slots will be used.
                        </Text>
                    </Text>
                    <Text>
                        <Text fontSize={12} fontFamily="Manrope-SemiBold">
                            3.{' '}
                        </Text>
                        <Text fontSize={12} fontFamily="Manrope-Medium">
                            Select each chip size.
                        </Text>
                    </Text>
                </VStack>
            </VStack>

            {/* Right Panel - Slots Grid */}
            <Box p={30} flex={1}>
                <HStack alignItems="center" gap={20} flexWrap="wrap">
                    {Array(SLOT_QUANTITY)
                        .fill(null)
                        .map((_, index) => {
                            return (
                                <SlotCard
                                    name={`Slot ${index + 1}`}
                                    key={index}
                                    state={
                                        slotStates
                                            ? slotStates.get(index) || 'Idle'
                                            : 'Idle'
                                    }
                                    isSelected={props.selectedSlots.has(index)}
                                    onPress={() => {
                                        const newSelectedSlots = new Set(
                                            props.selectedSlots,
                                        );
                                        if (newSelectedSlots.has(index)) {
                                            newSelectedSlots.delete(index);
                                        } else {
                                            newSelectedSlots.add(index);
                                        }
                                        props.setSelectedSlots(
                                            newSelectedSlots,
                                        );
                                    }}
                                />
                            );
                        })}
                </HStack>
            </Box>
        </HStack>
    );
}

const SlotCard = ({
    name,
    isSelected,
    onPress,
    state,
}: {
    name: string;
    isSelected: boolean;
    onPress: () => void;
    state: string;
}) => {
    const isDisabled = state !== 'Idle';

    return (
        <Pressable onPress={() => !isDisabled && onPress()}>
            <Box
                bg="rgba(255, 255, 255, 0.4)"
                borderRadius={10}
                p={isSelected ? 7 : 8}
                borderColor={isSelected ? '#038B1F' : 'rgba(0, 0, 0, 0.1)'}
                borderWidth={isSelected ? 2 : 1}
                width={165}
                height={180}
                alignItems="center"
                justifyContent="space-between"
                opacity={isDisabled ? 0.4 : 1}
            >
                <Text
                    fontSize={14}
                    color="#1F2832"
                    fontFamily="Manrope-SemiBold"
                >
                    {isDisabled ? `${name} (${state})` : name}
                </Text>
                <Image
                    width={46 * 0.7}
                    height={116 * 0.7}
                    source={
                        isSelected
                            ? require('../../assets/pics/selected_slot.png')
                            : require('../../assets/pics/slot.png')
                    }
                    alt="Slot Image"
                />
                <Text
                    fontSize={12}
                    color="#1F2832"
                    p={6}
                    bg="white"
                    borderRadius={7}
                    fontFamily="Manrope-SemiBold"
                >
                    250 μL
                </Text>
            </Box>
        </Pressable>
    );
};
