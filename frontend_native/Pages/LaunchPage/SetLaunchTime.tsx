import { VStack, HStack, Text, Input, InputField } from '@gluestack-ui/themed';

interface SetLaunchTimeProps {
    estimatedDuration: string; // Format: "H:MM:SS"
    onValidationChange?: (isValid: boolean) => void;
    batchName: string;
    setBatchName: (name: string) => void;
}

export function SetLaunchTime(props: SetLaunchTimeProps) {
    return (
        <VStack flex={1} alignItems="center" justifyContent="center">
            <HStack mb={20} alignItems="center">
                <Text mr={10}>Batch name:</Text>
                <Input width={300}>
                    <InputField
                        placeholder="Enter batch name"
                        value={props.batchName}
                        onChange={(e) => props.setBatchName(e.nativeEvent.text)}
                    />
                </Input>
            </HStack>
            <Text mb={50}>
                Launch time sheduling is not yet implemented. It is planned for
                a future release.
            </Text>
        </VStack>
    );
}
