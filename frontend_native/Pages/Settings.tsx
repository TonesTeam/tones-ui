import { Box } from '../components/ui/box';
import { Text } from '../components/ui/text';
import { MainContainer, globalElementStyle } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const Settings = ({ route, navigation }: NativeStackScreenProps<any>) => {
    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <Text
                    color="black"
                    fontSize={32}
                    fontFamily="Orbitron-Medium"
                    mb="$8"
                    mt={16}
                >
                    Settings
                </Text>
            </Box>
        </MainContainer>
    );
};

export default Settings;
