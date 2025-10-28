import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { AppStyles } from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Modal,
    Button,
    ButtonText,
    Text,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    Checkbox,
    CheckboxIndicator,
    CheckboxLabel,
    CheckboxIcon,
    CheckIcon,
    Link,
    LinkText,
    Heading,
    Image,
    EyeIcon,
    EyeOffIcon,
    InputSlot,
    InputIcon,
    Pressable,
    ModalFooter,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalBackdrop,
    ButtonIcon,
} from '@gluestack-ui/themed';
import { Save } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { setBackdoorAddress, getBackdoorAddress } from '../common/util';
import { HStack } from '@gluestack-ui/themed';

export default function Login({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    return (
        <View style={s.container}>
            <FormColumn />
            <PictureColumn />
        </View>
    );
}

const FormColumn = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [showPassword, setShowPassword] = useState(false);

    const handleState = () => {
        setShowPassword((showState) => {
            return !showState;
        });
    };

    return (
        <View style={s.form_container}>
            <Text bold={false} size="5xl" style={s.welcome_text}>
                Welcome Back
            </Text>

            <View style={s.form}>
                <FormControl size="lg" style={s.formChild}>
                    <FormControlLabel>
                        <FormControlLabelText>Username</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                        <InputField
                            type="text"
                            placeholder="Enter your username"
                        />
                    </Input>
                </FormControl>

                <FormControl size="lg" style={s.formChild}>
                    <FormControlLabel>
                        <FormControlLabelText>Password</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                        <InputField
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                        />
                        <InputSlot
                            style={{ paddingRight: 5 }}
                            onPress={handleState}
                        >
                            <InputIcon
                                as={showPassword ? EyeIcon : EyeOffIcon}
                            />
                        </InputSlot>
                    </Input>
                </FormControl>

                <View
                    style={[
                        s.space_between_container,
                        s.formChild,
                        { marginTop: 0 },
                    ]}
                >
                    <RememberMeCheckbox />
                    <Link>
                        <LinkText>Forgot Password</LinkText>
                    </Link>
                </View>

                <Button
                    onPress={() => navigation.navigate('Protocols')}
                    style={[s.formChild, s.login_btn]}
                >
                    <ButtonText style={{ color: '#fff' }}>Sign In</ButtonText>
                </Button>

                <Text
                    style={{
                        color: AppStyles.color.text_faded,
                        alignSelf: 'center',
                    }}
                >
                    © 2021-2025 Tones. All rights reserved.
                </Text>
            </View>
        </View>
    );
};

const RememberMeCheckbox = () => {
    return (
        <Checkbox size="md" isInvalid={false} isDisabled={false}>
            <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} style={{ color: '#fff' }} />
            </CheckboxIndicator>
            <CheckboxLabel style={{ marginLeft: 8 }}>Remember me</CheckboxLabel>
        </Checkbox>
    );
};

const PictureColumn = () => {
    const [imageClicks, setImageClicks] = useState(0);
    const [backdoorModal, setBackdoorModal] = useState(false);

    useEffect(() => {
        if (imageClicks === 5) {
            setBackdoorModal(true);
        }
    }, [imageClicks]);

    const handleCancel = () => {
        setImageClicks(0);
        setBackdoorModal(false);
    };

    const handleSet = (address: string) => {
        setBackdoorAddress(address);
        setBackdoorModal(false);
        setImageClicks(0);
    };

    return (
        <View style={s.image_container}>
            <Image
                source={require('../assets/pics/login-art.jpg')}
                alt="Riga old town"
                style={s.image}
                size="full"
            />
            <Pressable
                onPress={() => setImageClicks(imageClicks + 1)}
                style={s.credits_text}
            >
                <Text color="white">Photo by Sabīne Jaunzeme on Unsplash</Text>
            </Pressable>
            <BackdoorModal
                isOpen={backdoorModal}
                onClose={() => setBackdoorModal(false)}
                onCancel={handleCancel}
                onSet={handleSet}
                initialAddress={getBackdoorAddress() ?? ''}
            />
        </View>
    );
};

type BackdoorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCancel?: () => void;
    onSet?: (address: string) => void;
    initialAddress?: string;
};

const BackdoorModal: React.FC<BackdoorModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onSet,
    initialAddress = '',
}) => {
    const [addressInput, setAddressInput] = useState<string>(initialAddress);

    useEffect(() => {
        if (isOpen) setAddressInput(initialAddress);
    }, [isOpen, initialAddress]);

    const handleCancel = () => {
        setAddressInput('');
        if (onCancel) onCancel();
        onClose();
    };

    const handleSet = () => {
        const trimmed = addressInput.trim();
        console.log(`Setting backdoor address to: ${trimmed}`);
        if (onSet) onSet(trimmed);
        setAddressInput('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} avoidKeyboard>
            <ModalBackdrop />
            <ModalContent p="$3" bg="black">
                <ModalHeader>
                    <Heading size="xl" color="lightgreen">
                        Enter backend address 😈
                    </Heading>
                </ModalHeader>

                <ModalBody>
                    <Text mb="$4" color="lightgreen">
                        Enter the backend host (without protocol or port).
                        Example: 192.168.1.10
                    </Text>

                    <HStack alignItems="center">
                        <Text color="lightgreen" flex={0.7}>
                            http://
                        </Text>
                        <Input
                            variant="outline"
                            borderColor="lightgreen"
                            color="lightgreen"
                            flex={4}
                        >
                            <InputField
                                value={addressInput}
                                onChangeText={setAddressInput}
                                color="lightgreen"
                                placeholder="e.g. 192.168.1.10 or some domain"
                            />
                        </Input>
                        <Text color="lightgreen" ml="$2" flex={1}>
                            :8080
                        </Text>
                    </HStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="outline"
                        borderColor="lightgreen"
                        onPress={handleCancel}
                        mr="$4"
                    >
                        <ButtonText color="lightgreen">Cancel</ButtonText>
                    </Button>

                    <Button bg="lightgreen" onPress={handleSet}>
                        <ButtonIcon as={Save} color="black" mr="$2" />
                        <ButtonText color="black">Set</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const s = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: '100%',
    },

    form_container: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
    },

    welcome_text: {
        fontFamily: 'Newsreader',
        fontSize: 64,
        color: '#000',
        marginTop: '12%',
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        backgroundColor: '#fff',
        width: '90%',
        padding: AppStyles.layout.box_padding,
        borderRadius: AppStyles.layout.border_radius,
    },

    formChild: {
        width: '100%',
        margin: '2%',
    },

    space_between_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    image_container: {
        padding: 10,
        flex: 1,
    },

    image: {
        borderRadius: 20,
    },

    credits_text: {
        position: 'absolute',
        color: '#fff',
        right: '5%',
        bottom: '5%',
    },

    login_btn: {
        backgroundColor: '#333333',
    },
});
