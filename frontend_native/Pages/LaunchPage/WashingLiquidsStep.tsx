import { useState, useEffect, useMemo } from 'react';
import { Box, HStack, VStack, Text, Switch, Icon } from '@gluestack-ui/themed';
import { Biohazard, Droplet, Trash } from 'lucide-react-native';

export function WashingLiquidsStep(props: {
    onCompletionChange?: (allSwitchesOn: boolean) => void;
}) {
    const [washingChecked, setWashingChecked] = useState(false);
    const [generalWasteChecked, setGeneralWasteChecked] = useState(false);
    const [hazardWasteChecked, setHazardWasteChecked] = useState(false);

    useEffect(() => {
        const allChecked =
            washingChecked && generalWasteChecked && hazardWasteChecked;
        if (props.onCompletionChange) {
            props.onCompletionChange(allChecked);
        }
    }, [washingChecked, generalWasteChecked, hazardWasteChecked]);

    return (
        <VStack flex={1} padding="$4" space="lg">
            {/* Top Section: Washing Liquids */}
            <HStack flex={1} gap={34}>
                {/* Left: Instructions */}
                <VStack flex={1} space="md">
                    <Box>
                        <Text
                            fontSize={20}
                            fontFamily="Orbitron-Bold"
                            color="#1F2832"
                            marginBottom={18}
                        >
                            Add Washing Liquids
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            1. Open tray with washing liquids
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            2. Check if there is enough washing liquid
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            3. If there is not enough liquid, insert liquids as
                            per instructions into the tray
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            4. When done, close the tray with washing liquids
                        </Text>
                    </Box>
                </VStack>

                <Box flex={1.5} px={24}>
                    <ActionConfirmationToggle
                        icon={Droplet}
                        number={1}
                        toggleName="Washing buffer"
                        confirmedActionName="at least 250ml"
                        checked={washingChecked}
                        onToggle={() => setWashingChecked(!washingChecked)}
                    />
                </Box>
            </HStack>

            {/* Bottom Section: Waste Containers */}
            <HStack flex={1} gap={34}>
                {/* Left: Instructions */}
                <VStack flex={1} space="md">
                    <Box>
                        <Text
                            fontSize={20}
                            fontFamily="Orbitron-Bold"
                            color="#1F2832"
                            marginBottom={18}
                        >
                            Check Waste Containers
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            1. Find container with{' '}
                            <Text
                                fontSize={12}
                                color="black"
                                fontFamily="Manrope-SemiBold"
                            >
                                general
                            </Text>{' '}
                            waste
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            2. Empty it if it is more than half full
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            3. Find container with{' '}
                            <Text
                                fontSize={12}
                                color="black"
                                fontFamily="Manrope-SemiBold"
                            >
                                hazard
                            </Text>{' '}
                            waste
                        </Text>
                        <Text mb={4} fontSize={12} color="black" opacity={0.5}>
                            4. Empty it if it is more than half full.
                        </Text>
                    </Box>
                </VStack>

                {/* Right: Waste Container Toggles */}
                <Box flex={1.5}>
                    <VStack space="md" padding="$4">
                        <ActionConfirmationToggle
                            icon={Trash}
                            number={1}
                            toggleName="General waste"
                            confirmedActionName="is half empty"
                            checked={generalWasteChecked}
                            onToggle={() =>
                                setGeneralWasteChecked(!generalWasteChecked)
                            }
                        />
                        <ActionConfirmationToggle
                            icon={Biohazard}
                            number={2}
                            toggleName="Hazard waste"
                            confirmedActionName="is half empty"
                            checked={hazardWasteChecked}
                            onToggle={() =>
                                setHazardWasteChecked(!hazardWasteChecked)
                            }
                        />
                    </VStack>
                </Box>
            </HStack>
        </VStack>
    );
}

const ActionConfirmationToggle = (props: {
    icon: any;
    number: number;
    toggleName: string;
    confirmedActionName: string;
    checked: boolean;
    onToggle: () => void;
}) => {
    return (
        <HStack
            bg="white"
            borderRadius={12}
            alignItems="center"
            style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 15,
                elevation: 10,
            }}
            px={16}
            py={12}
            width={440}
        >
            <Icon as={props.icon} color="#1F2832" mr={9} />
            <Text fontFamily="Manrope-SemiBold" fontSize={16} color="#1F2832">
                #{props.number}
            </Text>

            {/* Divider */}
            <Box
                width={1}
                height="60%"
                backgroundColor="black"
                opacity={0.2}
                mx={23}
            />

            <Text fontFamily="Manrope-Medium" fontSize={16} color="#1F2832">
                {props.toggleName}
            </Text>
            <Text
                fontFamily="Manrope-Medium"
                fontSize={16}
                color="#1F2832"
                ml="auto"
                mr={12}
            >
                {props.confirmedActionName}
            </Text>
            <Switch
                value={props.checked}
                onValueChange={props.onToggle}
                trackColor={{ false: '#D1D5DB', true: '#089A26' }}
                thumbColor={props.checked ? '#FFFFFF' : '#F3F4F6'}
                size="lg"
            />
        </HStack>
    );
};
