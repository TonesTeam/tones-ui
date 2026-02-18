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
import { Pencil } from 'lucide-react-native';
import { Icon } from '@gluestack-ui/themed';

export function SlotSelection(props: {
    selectedSlots: number;
    onSelectSlot: (slotNumber: number) => void;
    selectedSlotsList?: boolean[];
    onToggleSlot?: (index: number) => void;
}) {
    const [slotNames, setSlotNames] = useState<string[]>([]);
    const [editingSlot, setEditingSlot] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');

    // Initialize slot names when component mounts or SLOT_QUANTITY changes
    useEffect(() => {
        setSlotNames(
            Array(SLOT_QUANTITY)
                .fill(null)
                .map((_, i) => `Slot ${i + 1}`),
        );
    }, []);

    const handleEditSlotName = (index: number) => {
        setEditingSlot(index);
        setTempName(slotNames[index]);
    };

    const handleSaveSlotName = (index: number) => {
        const newNames = [...slotNames];
        newNames[index] = tempName || `Slot ${index + 1}`;
        setSlotNames(newNames);
        setEditingSlot(null);
    };

    return (
        <View style={s.container}>
            {/* Left Panel - Instructions */}
            <View style={s.leftPanel}>
                <Txt style={s.headerTitle}>Select Slots</Txt>
                <View style={s.instructionsList}>
                    <Txt style={s.instructionItem}>
                        1. Check whether any samples from the previous run
                        remain in the slots. Remove any samples if present.
                    </Txt>
                    <Txt style={s.instructionItem}>
                        2. Select how many slots will be used
                    </Txt>
                    <Txt style={s.instructionItem}>3. Edit name if needed</Txt>
                    <Txt style={s.instructionItem}>
                        4. Select each chip size
                    </Txt>
                </View>
            </View>

            {/* Right Panel - Slots Grid */}
            <View style={s.rightPanel}>
                <View style={s.slotContainer}>
                    {Array(SLOT_QUANTITY)
                        .fill(null)
                        .map((_, index) => {
                            const slotNumber = index + 1;
                            const isSelected = props.selectedSlotsList
                                ? props.selectedSlotsList[index]
                                : false;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        s.slotBox,
                                        isSelected && s.slotBoxSelected,
                                    ]}
                                    onPress={() => {
                                        if (props.onToggleSlot) {
                                            props.onToggleSlot(index);
                                        } else {
                                            props.onSelectSlot(slotNumber);
                                        }
                                    }}
                                    activeOpacity={0.7}
                                >
                                    {/* Slot Header with Title and Edit Icon */}
                                    <View style={s.slotHeader}>
                                        {editingSlot === index ? (
                                            <TextInput
                                                style={s.slotTitleInput}
                                                value={tempName}
                                                onChangeText={setTempName}
                                                onBlur={() =>
                                                    handleSaveSlotName(index)
                                                }
                                                onSubmitEditing={() =>
                                                    handleSaveSlotName(index)
                                                }
                                                autoFocus
                                            />
                                        ) : (
                                            <Txt style={s.slotTitle}>
                                                {slotNames[index]}
                                            </Txt>
                                        )}
                                        <TouchableOpacity
                                            style={s.editButton}
                                            onPress={() =>
                                                handleEditSlotName(index)
                                            }
                                        >
                                            <Icon
                                                as={Pencil}
                                                size="sm"
                                                color={
                                                    AppStyles.color.text_faded
                                                }
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Slot Image */}
                                    <View style={s.slotImageContainer}>
                                        <ImageBackground
                                            source={require('../../assets/pics/slot.png')}
                                            style={s.slotImage}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    {/* Volume Label */}
                                    <View style={s.volumeBox}>
                                        <Txt style={s.volumeText}>250 μL</Txt>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </View>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
    },
    // Left Panel Styles
    leftPanel: {
        width: 280,
        backgroundColor: '#ffffff',
        padding: 25,
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    headerTitle: {
        fontFamily: 'Roboto-bold',
        fontSize: 24,
        marginBottom: 25,
        color: '#000000',
    },
    instructionsList: {
        gap: 15,
    },
    instructionItem: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666666',
        marginBottom: 10,
    },
    // Right Panel Styles
    rightPanel: {
        flex: 1,
        padding: 30,
        backgroundColor: '#f5f5f5',
    },
    slotContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        alignContent: 'flex-start',
    },
    slotBox: {
        width: '31%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    slotBoxSelected: {
        borderColor: '#4CAF50',
        backgroundColor: '#f1f8f4',
        borderWidth: 3,
    },
    slotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    slotTitle: {
        fontFamily: 'Roboto-bold',
        fontSize: 16,
        color: '#000000',
    },
    slotTitleInput: {
        fontFamily: 'Roboto-bold',
        fontSize: 16,
        color: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: AppStyles.color.secondary,
        flex: 1,
        paddingVertical: 2,
    },
    editButton: {
        padding: 5,
    },
    slotImageContainer: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    slotImage: {
        width: '100%',
        height: '100%',
    },
    volumeBox: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 10,
    },
    volumeText: {
        fontFamily: 'Roboto-bold',
        fontSize: 14,
        textAlign: 'center',
        color: '#333333',
    },
});
