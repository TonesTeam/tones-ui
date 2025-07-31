import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Heading,
    Icon,
    Button,
    ButtonText,
    Box,
} from '@gluestack-ui/themed';
import { StyleSheet, Text } from 'react-native';
import { AppStyles } from '../constants/styles';
import tinycolor from 'tinycolor2';

type TonesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    action: () => void;
    headline: string;
    text: string;
    icon: any;
    actionButtonText: string;
    type: 'error' | 'warning' | 'info';
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    action,
    headline,
    text,
    icon,
    actionButtonText,
    type,
}: TonesModalProps) {
    const accentColors = { error: '#dc2828', warning: '', info: '' };
    const accent = accentColors[type];

    const iconBgColor = tinycolor.mix(accent, '#ffffff', 90).toHexString();

    const s = StyleSheet.create({
        modal_container: {
            alignItems: 'center',
            maxWidth: '25%',
        },
        icon_container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '100%',
            width: 56,
            height: 56,
            backgroundColor: iconBgColor,
        },
        text_center: {
            textAlign: 'center',
        },
        flex_grow: {
            display: 'flex',
            flexGrow: 1,
        },
        margin_left: {
            marginLeft: 10,
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent style={s.modal_container}>
                <ModalHeader>
                    <Box style={s.icon_container}>
                        <Icon as={icon} style={{ color: accent }} size="xl" />
                    </Box>
                </ModalHeader>
                <ModalBody>
                    <Heading size="md" style={s.text_center}>
                        {headline}
                    </Heading>
                    <Text
                        style={[
                            s.text_center,
                            { color: AppStyles.color.text_faded },
                        ]}
                    >
                        {text}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        action="secondary"
                        size="sm"
                        onPress={onClose}
                        style={s.flex_grow}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        onPress={() => {
                            action();
                            onClose();
                        }}
                        size="sm"
                        style={[
                            s.flex_grow,
                            s.margin_left,

                            { backgroundColor: accent },
                        ]}
                    >
                        <ButtonText>{actionButtonText}</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
