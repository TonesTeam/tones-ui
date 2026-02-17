import { MainContainer } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { Box } from '../components/ui/box';
import { Text } from '../components/ui/text';

const History = (props: any) => {
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
                    History
                </Text>
            </Box>
        </MainContainer>
    );
};

export default History;
