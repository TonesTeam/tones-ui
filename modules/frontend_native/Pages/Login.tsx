import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import { AppStyles } from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Logo from '../assets/pics/tones_logo.svg';
import Txt from '../components/Txt';
import {
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
} from '@gluestack-ui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';

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

    return (
        <View style={s.form_container}>
            <Heading bold={false} size="5xl" style={s.welcome_text}>
                Welcome Back
            </Heading>

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
                            type="password"
                            placeholder="Enter your password"
                        />
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
                    onPress={() => navigation.navigate('Protocol List')}
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
    return (
        <View style={s.image_container}>
            <Image
                source={require('../assets/pics/login-art.jpg')}
                alt="Blue clouds"
                style={s.image}
            />
            <Text style={s.credit_text}>
                Photo by Matthew McBrayer on Unsplash
            </Text>
        </View>
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
        color: '#000',
        marginTop: '10%',
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
        borderRadius: 50,
    },

    credit_text: {
        position: 'absolute',
        color: '#fff',
        right: '5%',
        bottom: '5%',
    },

    login_btn: {
        backgroundColor: '#333333',
    },
});
