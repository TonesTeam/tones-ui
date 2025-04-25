import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/CustomNavigator';

export default function History(props: any) {
    return (
        <MainContainer>
            <NavBar />
            <View
                style={[
                    globalElementStyle.page_container,
                    { backgroundColor: '#d5fa5dff' },
                ]}
            >
                <Text>History</Text>
            </View>
        </MainContainer>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 10,
        backgroundColor: '#888888',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
