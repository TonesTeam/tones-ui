import { useState, useEffect } from 'react';
import { MainContainer } from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import {
    Box,
    Text,
    ScrollView,
    Pressable,
    Icon,
    HStack,
} from '@gluestack-ui/themed';
import { getRequest } from '../../common/util';
import ListItem from './ListItem';
import Animated, {
    FadeInDown,
    LinearTransition,
} from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

export interface Job {
    id: number;
    name: string;
    status: string;
    start_timestamp: number;
    end_timestamp: number | null;
    slot_number: number;
    batch_id: number;
}

const JobList = (props: any) => {
    const [jobs, setJobs] = useState([] as Job[]);

    useEffect(() => {
        getRequest(`/jobs/batch/${props.route.params.batch_id}`)
            .then((response) => {
                const batches = response.data as Job[];
                const sortedBatches = batches.sort(
                    (a, b) => b.start_timestamp - a.start_timestamp,
                );
                setJobs(sortedBatches);
            })
            .catch((error) => {
                console.error('Error fetching jobs:', error);
            });
    }, []);

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <HStack alignItems="center" mb="$8" mt={16}>
                    <Pressable
                        onPress={() => props.navigation.goBack()}
                        alignItems="flex-start"
                        justifyContent="center"
                        pr="$4"
                    >
                        <Icon
                            as={ArrowLeft}
                            width={30}
                            height={20}
                            color="#1F2832"
                            size={25}
                        />
                    </Pressable>
                    <Text
                        color="black"
                        fontSize={24}
                        fontFamily="Orbitron-Medium"
                    >
                        Jobs |{' '}
                        <Text
                            color="black"
                            fontSize={24}
                            fontFamily="Orbitron-Regular"
                            opacity={0.2}
                        >
                            {props.route.params.batch_name}
                        </Text>
                    </Text>
                </HStack>

                <ScrollView>
                    {jobs.map((job, index) => (
                        <Animated.View
                            key={job.id}
                            entering={FadeInDown.delay(index * 60)
                                .springify()
                                .damping(0)}
                            layout={LinearTransition.springify()}
                        >
                            <ListItem
                                key={job.id}
                                batch={job}
                                navigation={props.navigation}
                                isJob={true}
                            />
                        </Animated.View>
                    ))}
                </ScrollView>
            </Box>
        </MainContainer>
    );
};

export default JobList;
