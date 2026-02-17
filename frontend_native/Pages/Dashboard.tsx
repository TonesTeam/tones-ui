import { Box } from '../components/ui/box';
import { Text } from '../components/ui/text';
import { MainContainer, globalElementStyle } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const Dashboard = ({ route, navigation }: NativeStackScreenProps<any>) => {
    console.log('Dashboard rendered with route:', route.name);
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
                    Dashboard
                </Text>
            </Box>
        </MainContainer>
    );
};

export default Dashboard;
