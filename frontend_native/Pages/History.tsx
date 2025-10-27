import { StyleSheet, View, TextInput, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { Heading, Box, Text } from '@gluestack-ui/themed';

export default function History(props: any) {
    return (
        <MainContainer>
            <NavBar />
            <Box style={globalElementStyle.page_container}>
                <Box
                    flex={1}
                    mt="$4"
                    mb="$4"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>
                        This page will be developed after protocol launch and
                        execution functionality is ready.
                    </Text>
                </Box>
            </Box>
        </MainContainer>
    );
}

const s = StyleSheet.create({
    section_calendar: {
        padding: 10,
        bottom: 100,
        borderRadius: 15,
        overflow: 'hidden',
    },
    sort_container: {
        padding: 10,
    },
    section_search: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    section_list: {
        flex: 9,
        width: '100%',
    },
    search_bar: {
        flexDirection: 'row',
        backgroundColor: AppStyles.color.elem_back,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 20,
        flex: 1,
    },
    history_item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: AppStyles.color.text_faded,
    },
    history_item_text: {
        fontFamily: 'Roboto-regular',
        fontSize: 18,
    },
    history_item_author: {
        fontFamily: 'Roboto-regular',
        fontSize: 16,
        color: AppStyles.color.text_faded,
    },
    picker: {
        height: 50,

        width: 300,
    },
    container: {
        flex: 10,
        backgroundColor: '#888888',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
});
