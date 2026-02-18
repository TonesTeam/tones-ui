import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Modal,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Txt from '../../components/Txt';
import { AppStyles } from '../../constants/styles';
import { Box, HStack, VStack } from '@gluestack-ui/themed';
import { Calendar } from 'react-native-calendars';

type LaunchTimeMode = 'now' | 'later' | 'finish';

interface SetLaunchTimeProps {
    estimatedDuration: string; // Format: "H:MM:SS"
    onValidationChange?: (isValid: boolean) => void;
}

const ITEM_HEIGHT = 44; // Height of each time item

export function SetLaunchTime(props: SetLaunchTimeProps) {
    const [mode, setMode] = useState<LaunchTimeMode>('now');
    const [selectedHour, setSelectedHour] = useState(14);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const hourScrollRef = useRef<ScrollView>(null);
    const minuteScrollRef = useRef<ScrollView>(null);

    // Generate hours (0-23)
    const hours = Array.from({ length: 24 }, (_, i) => i);
    // Generate minutes (0-59)
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    // Check if current selection is valid
    const isCurrentSelectionValid = (): boolean => {
        if (mode === 'now') return true;

        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(selectedHour, selectedMinute, 0, 0);

        const minTime = getMinimumAllowedTime();
        return selectedDateTime >= minTime;
    };

    // Notify parent when validation status changes
    useEffect(() => {
        if (props.onValidationChange) {
            const isValid = isCurrentSelectionValid();
            props.onValidationChange(isValid);
        }
    }, [mode, selectedHour, selectedMinute, selectedDate]);

    // Parse estimated duration (H:MM:SS) to milliseconds
    const parseEstimatedDuration = (duration: string): number => {
        const parts = duration.split(':');
        const hours = parseInt(parts[0] || '0');
        const minutes = parseInt(parts[1] || '0');
        const seconds = parseInt(parts[2] || '0');
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    };

    // Calculate minimum finish time (now + estimated duration)
    const getMinimumFinishTime = (): Date => {
        const now = new Date();
        const durationMs = parseEstimatedDuration(props.estimatedDuration);
        return new Date(now.getTime() + durationMs);
    };

    // Get minimum allowed time based on mode
    const getMinimumAllowedTime = (): Date => {
        if (mode === 'finish') {
            return getMinimumFinishTime();
        } else if (mode === 'later') {
            return new Date(); // Current time
        }
        return new Date();
    };

    // Check if an hour is valid (checks the earliest minute - :00)
    const isHourValid = (date: Date, hour: number): boolean => {
        if (mode === 'now') return true;

        // Check if this hour at :59 is still valid
        // If hour:59 is valid, then all minutes in this hour are valid
        const hourEndTime = new Date(date);
        hourEndTime.setHours(hour, 59, 59, 999);

        const minTime = getMinimumAllowedTime();
        return hourEndTime >= minTime;
    };

    // Check if a minute is valid for the currently selected hour
    const isMinuteValid = (
        date: Date,
        hour: number,
        minute: number,
    ): boolean => {
        if (mode === 'now') return true;

        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(hour, minute, 0, 0);

        const minTime = getMinimumAllowedTime();
        return selectedDateTime >= minTime;
    };

    // Get current time on mount
    useEffect(() => {
        const now = new Date();
        setSelectedHour(now.getHours());
        setSelectedMinute(now.getMinutes());
    }, []);

    // Scroll to selected hour when it changes
    useEffect(() => {
        if (mode !== 'now' && hourScrollRef.current) {
            hourScrollRef.current.scrollTo({
                y: selectedHour * ITEM_HEIGHT,
                animated: true,
            });
        }
    }, [selectedHour, mode]);

    // Scroll to selected minute when it changes
    useEffect(() => {
        if (mode !== 'now' && minuteScrollRef.current) {
            minuteScrollRef.current.scrollTo({
                y: selectedMinute * ITEM_HEIGHT,
                animated: true,
            });
        }
    }, [selectedMinute, mode]);

    const renderTimePickerItem = (
        value: number,
        isSelected: boolean,
        type: 'hour' | 'minute',
    ) => {
        // Check if this time value is valid
        let isValid = true;
        if (type === 'hour') {
            isValid = isHourValid(selectedDate, value);
        } else {
            isValid = isMinuteValid(selectedDate, selectedHour, value);
        }

        const opacity = isSelected ? 1 : isValid ? 0.3 : 0.15;
        const fontSize = isSelected ? 32 : 24;
        const fontWeight = isSelected ? 'bold' : 'normal';

        return (
            <TouchableOpacity
                key={value}
                onPress={() => {
                    if (!isValid) return;

                    if (type === 'hour') {
                        setSelectedHour(value);
                    } else {
                        setSelectedMinute(value);
                    }
                }}
                disabled={!isValid}
                style={{
                    height: ITEM_HEIGHT,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Txt
                    style={{
                        fontSize,
                        opacity,
                        fontFamily:
                            fontWeight === 'bold' ? 'Roboto-bold' : 'Roboto',
                        color: AppStyles.color.text_primary,
                        textDecorationLine: !isValid ? 'line-through' : 'none',
                    }}
                >
                    {String(value).padStart(2, '0')}
                </Txt>
            </TouchableOpacity>
        );
    };

    const renderTimePicker = () => {
        if (mode === 'now') return null;

        return (
            <VStack space="md">
                {/* Date picker button */}
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                        backgroundColor: AppStyles.color.elem_back,
                        borderRadius: 8,
                        padding: 16,
                        width: '40%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderWidth: 1,
                        borderColor: AppStyles.color.background,
                        alignSelf: 'center',
                    }}
                >
                    <Txt
                        style={{
                            fontSize: 16,
                            color: AppStyles.color.text_primary,
                        }}
                    >
                        {selectedDate.toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </Txt>
                    <Txt
                        style={{
                            fontSize: 16,
                            color: AppStyles.color.text_faded,
                        }}
                    >
                        ▼
                    </Txt>
                </TouchableOpacity>

                {/* Calendar Modal */}
                <Modal
                    visible={showDatePicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={1}
                        onPress={() => setShowDatePicker(false)}
                    >
                        <View
                            style={{
                                backgroundColor: AppStyles.color.elem_back,
                                borderRadius: 12,
                                padding: 12,
                                width: '100%',
                                maxWidth: 350,
                            }}
                        >
                            <Calendar
                                current={
                                    selectedDate.toISOString().split('T')[0]
                                }
                                onDayPress={(day) => {
                                    setSelectedDate(new Date(day.dateString));
                                    setShowDatePicker(false);
                                }}
                                minDate={new Date().toISOString().split('T')[0]}
                                theme={{
                                    backgroundColor: AppStyles.color.elem_back,
                                    calendarBackground:
                                        AppStyles.color.elem_back,
                                    textSectionTitleColor:
                                        AppStyles.color.text_primary,
                                    selectedDayBackgroundColor:
                                        AppStyles.color.primary,
                                    selectedDayTextColor:
                                        AppStyles.color.elem_back,
                                    todayTextColor: AppStyles.color.primary,
                                    dayTextColor: AppStyles.color.text_primary,
                                    textDisabledColor:
                                        AppStyles.color.text_faded,
                                    monthTextColor:
                                        AppStyles.color.text_primary,
                                    arrowColor: AppStyles.color.primary,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Time picker */}
                <Box
                    backgroundColor={AppStyles.color.elem_back}
                    borderRadius="$lg"
                    padding="$6"
                    alignItems="center"
                >
                    <HStack space="md" alignItems="center">
                        {/* Hours column */}
                        <View style={{ height: 200, width: 80 }}>
                            <ScrollView
                                ref={hourScrollRef}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                contentContainerStyle={{
                                    paddingVertical: 78,
                                }}
                                onMomentumScrollEnd={(event) => {
                                    const yOffset =
                                        event.nativeEvent.contentOffset.y;
                                    const index = Math.round(
                                        yOffset / ITEM_HEIGHT,
                                    );
                                    const newHour = hours[index];
                                    if (newHour !== undefined) {
                                        // Check if valid
                                        if (
                                            isHourValid(selectedDate, newHour)
                                        ) {
                                            setSelectedHour(newHour);
                                        }
                                    }
                                }}
                            >
                                {hours.map((hour) =>
                                    renderTimePickerItem(
                                        hour,
                                        hour === selectedHour,
                                        'hour',
                                    ),
                                )}
                            </ScrollView>
                        </View>

                        {/* Separator */}
                        <Txt
                            style={{
                                fontSize: 32,
                                fontFamily: 'Roboto-bold',
                                color: AppStyles.color.text_primary,
                            }}
                        >
                            :
                        </Txt>

                        {/* Minutes column */}
                        <View style={{ height: 200, width: 80 }}>
                            <ScrollView
                                ref={minuteScrollRef}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                contentContainerStyle={{
                                    paddingVertical: 78,
                                }}
                                onMomentumScrollEnd={(event) => {
                                    const yOffset =
                                        event.nativeEvent.contentOffset.y;
                                    const index = Math.round(
                                        yOffset / ITEM_HEIGHT,
                                    );
                                    const newMinute = minutes[index];
                                    if (newMinute !== undefined) {
                                        // Check if valid
                                        if (
                                            isMinuteValid(
                                                selectedDate,
                                                selectedHour,
                                                newMinute,
                                            )
                                        ) {
                                            setSelectedMinute(newMinute);
                                        }
                                    }
                                }}
                            >
                                {minutes.map((minute) =>
                                    renderTimePickerItem(
                                        minute,
                                        minute === selectedMinute,
                                        'minute',
                                    ),
                                )}
                            </ScrollView>
                        </View>
                    </HStack>

                    {/* Highlight background for selected time */}
                    <View
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: 40,
                            right: 40,
                            height: 50,
                            backgroundColor: AppStyles.color.primary_faded,
                            borderRadius: 8,
                            transform: [{ translateY: -25 }],
                            zIndex: -1,
                        }}
                    />
                </Box>
            </VStack>
        );
    };

    return (
        <VStack flex={1} padding="$6" space="xl">
            {/* Title */}
            <VStack space="sm" alignItems="center">
                <Txt
                    style={{
                        fontSize: 24,
                        fontFamily: 'Roboto-bold',
                        color: AppStyles.color.text_primary,
                    }}
                >
                    Set launch time
                </Txt>
                <HStack space="xs">
                    <Txt
                        style={{
                            fontSize: 16,
                            color: AppStyles.color.text_faded,
                        }}
                    >
                        Estimated lenght:
                    </Txt>
                    <Txt
                        style={{
                            fontSize: 16,
                            fontFamily: 'Roboto-bold',
                            color: AppStyles.color.text_primary,
                        }}
                    >
                        {props.estimatedDuration}
                    </Txt>
                </HStack>
            </VStack>

            {/* Mode buttons */}
            <HStack space="md" justifyContent="center">
                <TouchableOpacity
                    onPress={() => setMode('now')}
                    style={[
                        styles.modeButton,
                        mode === 'now' && styles.modeButtonActive,
                    ]}
                >
                    <Txt
                        style={[
                            styles.modeButtonText,
                            mode === 'now' && styles.modeButtonTextActive,
                        ]}
                    >
                        Start now
                    </Txt>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setMode('later')}
                    style={[
                        styles.modeButton,
                        mode === 'later' && styles.modeButtonActive,
                    ]}
                >
                    <Txt
                        style={[
                            styles.modeButtonText,
                            mode === 'later' && styles.modeButtonTextActive,
                        ]}
                    >
                        Start later
                    </Txt>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setMode('finish')}
                    style={[
                        styles.modeButton,
                        mode === 'finish' && styles.modeButtonActive,
                    ]}
                >
                    <Txt
                        style={[
                            styles.modeButtonText,
                            mode === 'finish' && styles.modeButtonTextActive,
                        ]}
                    >
                        Finish at
                    </Txt>
                </TouchableOpacity>
            </HStack>

            {/* Time picker */}
            {renderTimePicker()}
        </VStack>
    );
}

const styles = StyleSheet.create({
    modeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: AppStyles.color.elem_back,
        borderWidth: 1,
        borderColor: AppStyles.color.background,
    },
    modeButtonActive: {
        backgroundColor: AppStyles.color.primary,
        borderColor: AppStyles.color.primary,
    },
    modeButtonText: {
        fontSize: 14,
        color: AppStyles.color.text_primary,
    },
    modeButtonTextActive: {
        color: AppStyles.color.elem_back,
        fontFamily: 'Roboto-bold',
    },
});
