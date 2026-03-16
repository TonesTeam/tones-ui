import { MainContainer } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { Box, Text } from '@gluestack-ui/themed';

const Jobs = (props: any) => {
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
                    Jobs
                </Text>
            </Box>
        </MainContainer>
    );
};

export default Jobs;
