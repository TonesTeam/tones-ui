import {
    StyleSheet,
    View,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import { AppStyles } from '../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../components/InputField';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Logo from '../assets/pics/tones_logo.svg';
import Txt from '../components/Txt';
import { Button, Text } from '@gluestack-ui/themed';

export default function Login({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    return (
        <View style={s.container}>
            <View style={s.form_container}>
                <View style={s.form}>
                    <Logo
                        width={300}
                        height={50}
                        style={{ alignSelf: 'center', marginBottom: 10 }}
                    ></Logo>

                    <InputField label="Username" placeholder="Username" />
                    <InputField label="Password" placeholder="Password" />

                    <View style={s.line}></View>

                    <Button
                        onPress={() => navigation.navigate('Protocol List')}
                    >
                        <Text style={{ color: '#fff' }}>Login</Text>
                    </Button>

                    <Txt
                        style={{
                            color: AppStyles.color.text_faded,
                            alignSelf: 'center',
                        }}
                    >
                        © 2021-2025 Tones. All rights reserved.
                    </Txt>
                </View>
            </View>

            <LinearGradient
                colors={['#fff', '#fff', '#fff']}
                style={s.credits}
                start={[0, 0]}
                end={[1, 1]}
                locations={[0, 0.5, 1]}
            >
                <Image
                    style={s.credit_logo}
                    resizeMode="contain"
                    source={require('../assets/pics/TSI_logo.png')}
                />
                <Image
                    style={s.credit_logo}
                    resizeMode="contain"
                    source={require('../assets/pics/HistOne_logo.png')}
                />
            </LinearGradient>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 10,
        //flexDirection: "column",
        backgroundColor: AppStyles.color.primary,
    },

    form_container: {
        flex: 10,
        alignItems: 'center',
        //justifyContent: "center",
    },

    form: {
        marginTop: 50,
        backgroundColor: '#fff',
        width: '30%',
        height: '60%',
        padding: AppStyles.layout.box_padding,
        borderRadius: AppStyles.layout.border_radius,
    },

    credits: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    credit_logo: {
        height: 200,
        width: 150,
        marginHorizontal: 50,
    },

    login_btn: {
        backgroundColor: AppStyles.color.primary,
        borderRadius: AppStyles.layout.border_radius,
        padding: AppStyles.layout.elem_padding,
        alignItems: 'center',
        marginVertical: 20,
    },

    line: {
        borderBottomColor: AppStyles.color.background,
        borderBottomWidth: 1,
    },
});
