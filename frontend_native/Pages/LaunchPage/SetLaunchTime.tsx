import { VStack, Text } from '@gluestack-ui/themed';

interface SetLaunchTimeProps {
    estimatedDuration: string; // Format: "H:MM:SS"
    onValidationChange?: (isValid: boolean) => void;
}

export function SetLaunchTime(props: SetLaunchTimeProps) {
    return (
        <VStack flex={1} alignItems="center" justifyContent="center">
            <Text mb={50}>
                Launch time sheduling is not yet implemented. It is planned for
                a future release.
            </Text>
        </VStack>
    );
}
