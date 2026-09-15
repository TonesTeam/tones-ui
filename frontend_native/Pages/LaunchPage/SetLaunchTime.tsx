import {
    VStack,
    HStack,
    Text,
    Input,
    InputField,
    Checkbox,
    CheckboxIndicator,
    CheckboxLabel,
} from '@gluestack-ui/themed';
import { AppStyles } from '../../constants/styles';

interface SetLaunchTimeProps {
    estimatedDuration: string; // Format: "H:MM:SS"
    onValidationChange?: (isValid: boolean) => void;
    batchName: string;
    setBatchName: (name: string) => void;
    readinessConfirmed: boolean;
    setReadinessConfirmed: (confirmed: boolean) => void;
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
            <Checkbox
                value={props.readinessConfirmed ? 'checked' : 'unchecked'}
                onChange={(isChecked) => props.setReadinessConfirmed(isChecked)}
                aria-label="Confirm readiness for launch"
            >
                <CheckboxIndicator mr="$2" />
                <CheckboxLabel
                    fontSize={14}
                    fontFamily="Manrope-Medium"
                    color={AppStyles.color.text_primary}
                    style={{ maxWidth: 500 }}
                >
                    I confirm that ALL previous instructions have been , fully
                    completed.
                </CheckboxLabel>
            </Checkbox>
        </VStack>
    );
}
