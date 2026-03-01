import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalFooter,
    ModalContent,
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
    cancelButtonText?: string;
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    action,
    headline,
    text,
    actionButtonText,
    cancelButtonText = 'Cancel',
}: TonesModalProps) {
    const s = StyleSheet.create({
        modal_container: {
            borderRadius: 24,
            width: 476,
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
            <ModalContent style={s.modal_container}>
                <LinearGradient
                    colors={['#F4F9FF', '#D6E5F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 24, padding: 24 }}
                >
                    <ModalBody>
                        <Text
                            style={[
                                s.text_center,
                                {
                                    marginTop: 30,
                                    marginBottom: 19,
                                    fontSize: 25,
                                    fontFamily: 'Manrope-SemiBold',
                                    color: AppStyles.color.text_primary,
                                },
                            ]}
                        >
                            {headline}
                        </Text>
                        <Text
                            style={[
                                s.text_center,
                                {
                                    color: AppStyles.color.text_primary,
                                    marginBottom: 11,
                                    fontSize: 15,
                                    fontFamily: 'Manrope-SemiBold',
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
                            style={[
                                s.flex_grow,
                                { backgroundColor: '#FFFFFF' },
                            ]}
                        >
                            <ButtonText
                                fontSize={16}
                                color={AppStyles.color.text_primary}
                                fontFamily="Manrope-SemiBold"
                            >
                                {cancelButtonText}
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
                                {
                                    backgroundColor:
                                        AppStyles.color.text_primary,
                                },
                            ]}
                            backgroundColor="#1F2832"
                        >
                            <ButtonText
                                color="#FFFFFF"
                                fontSize={16}
                                fontFamily="Manrope-SemiBold"
                            >
                                {actionButtonText}
                            </ButtonText>
                        </Button>
                    </ModalFooter>
                </LinearGradient>
            </ModalContent>
        </Modal>
    );
}
