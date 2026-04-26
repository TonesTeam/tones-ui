import { useState, useEffect } from 'react';
import { MainContainer } from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import { Box, Text, ScrollView } from '@gluestack-ui/themed';
import { getRequest } from '../../common/util';
import ListItem from './ListItem';
import Animated, {
    FadeInDown,
    LinearTransition,
} from 'react-native-reanimated';

export interface Batch {
    id: number;
    name: string;
    status: string;
    start_timestamp: number;
    end_timestamp: number | null;
    creator_id: number;
    creator_first_name: string;
    creator_last_name: string;
}

const Jobs = (props: any) => {
    const [batches, setBatches] = useState([] as Batch[]);

    useEffect(() => {
        getRequest('/jobs')
            .then((response) => {
                const batches = response.data as Batch[];
                const sortedBatches = batches.sort(
                    (a, b) => b.start_timestamp - a.start_timestamp,
                );
                setBatches(sortedBatches);
            })
            .catch((error) => {
                console.error('Error fetching jobs:', error);
            });
    }, []);

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
                    Job Batches
                </Text>

                <ScrollView>
                    {batches.map((batch, index) => (
                        <Animated.View
                            key={batch.id}
                            entering={FadeInDown.delay(index * 60)
                                .springify()
                                .damping(0)}
                            layout={LinearTransition.springify()}
                        >
                            <ListItem
                                key={batch.id}
                                batch={batch}
                                navigation={props.navigation}
                            />
                        </Animated.View>
                    ))}
                </ScrollView>
            </Box>
        </MainContainer>
    );
};

export default Jobs;
