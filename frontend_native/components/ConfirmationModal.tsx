import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalFooter,
    Heading,
    Button,
    ButtonText,
} from '@gluestack-ui/themed';
import { StyleSheet, Text } from 'react-native';
import { AppStyles } from '../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';

type TonesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    action: () => void;
    headline: string;
    text: string;
    actionButtonText: string;
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    action,
    headline,
    text,
    actionButtonText,
}: TonesModalProps) {
    const s = StyleSheet.create({
        modal_container: {
            padding: 32,
            borderRadius: 24,
            width: '45%',
        },
        text_center: {
            textAlign: 'center',
        },
        flex_grow: {
            display: 'flex',
            flexGrow: 5,
            borderRadius: 75,
        },
        margin_left: {
            marginLeft: 40,
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <LinearGradient
                colors={['#F4F9FF', '#D6E5F4']}
                style={s.modal_container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ModalBody>
                    <Heading
                        style={[
                            s.text_center,
                            { marginBottom: 19, fontSize: 25 },
                        ]}
                    >
                        {headline}
                    </Heading>
                    <Text
                        style={[
                            s.text_center,
                            {
                                color: AppStyles.color.text_primary,
                                marginBottom: 11,
                                fontSize: 16,
                            },
                        ]}
                    >
                        {text}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        action="secondary"
                        size="lg"
                        onPress={onClose}
                        style={[s.flex_grow, { backgroundColor: '#FFFFFF' }]}
                    >
                        <ButtonText color={AppStyles.color.text_primary}>
                            Cancel
                        </ButtonText>
                    </Button>
                    <Button
                        onPress={() => {
                            action();
                            onClose();
                        }}
                        size="lg"
                        style={[
                            s.flex_grow,
                            s.margin_left,
                            { backgroundColor: AppStyles.color.text_primary },
                        ]}
                    >
                        <ButtonText color="#FFFFFF">
                            {actionButtonText}
                        </ButtonText>
                    </Button>
                </ModalFooter>
            </LinearGradient>
        </Modal>
    );
}
