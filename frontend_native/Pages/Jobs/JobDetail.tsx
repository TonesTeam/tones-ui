import { useState, useEffect } from 'react';
import { MainContainer } from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import {
    Box,
    HStack,
    Text,
    VStack,
    Button,
    ButtonIcon,
    ButtonText,
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { Job } from './Jobs';
import { getRequest } from '../../common/util';
import { X } from 'lucide-react-native';
import ConfirmationModal from '../../components/ConfirmationModal';

interface ProtocolState {
    has_begun: boolean;
    has_ended: boolean;
    is_paused: boolean;
    is_aborted: boolean;
    task_id: number;
    slot_description: string;
    initial_time_estimate: number;
    time_remaining_estimate: number;
    step_count: number;
    completed_step_count: number;
}

const JobDetail = (props: any) => {
    const [job, setJob] = useState<Job | null>(null);
    const [jobState, setJobState] = useState<ProtocolState | null>(null);
    const [abortConfirmModal, setAbortConfirmModal] = useState(false);

    useEffect(() => {
        const { job_id } = props.route.params;
        getRequest(`/jobs/${job_id}`)
            .then((response) => {
                const jobData = response.data as Job;
                setJob(jobData);
            })
            .catch((error) => {
                console.error('Error fetching job details:', error);
            });

        getRequest(`/jobs/${job_id}/state`)
            .then((response) => {
                const stateData = response.data as ProtocolState;
                setJobState(stateData);
            })
            .catch((error: any) => {
                console.error('Error fetching job state:', error);
            });
    }, [props.route.params]);

    return (
        <MainContainer>
            <NavBar />
            <Box
                flex={1}
                bg="black"
                my={8}
                mr={32}
                ml={16}
                borderRadius={32}
                overflow="hidden"
            >
                <ConfirmationModal
                    isOpen={abortConfirmModal}
                    onClose={() => setAbortConfirmModal(false)}
                    headline="Force Stop Protocol?"
                    text=""
                    actionButtonText="Yes, Abort"
                    action={() => {
                        getRequest(`/jobs/${job?.id}/abort`)
                            .then(() => {
                                console.log('Job aborted successfully');
                                setAbortConfirmModal(false);
                            })
                            .catch((error) => {
                                console.error('Error aborting job:', error);
                                setAbortConfirmModal(false);
                            });
                    }}
                />

                <HStack width="100%" height="100%">
                    <VStack flex={355} p={32}>
                        <Text
                            fontFamily="Manrope-Medium"
                            fontSize={16}
                            color="white"
                            opacity={0.5}
                        >
                            Job name
                        </Text>
                        <Text
                            opacity={1}
                            fontFamily="Orbitron-SemiBold"
                            fontSize={20}
                            color="white"
                        >
                            {job?.name || 'Loading...'}
                        </Text>

                        <Text>{JSON.stringify(jobState)}</Text>
                    </VStack>
                    <VStack flex={658}>
                        <LinearGradient
                            colors={['#090E11', '#1E2B31']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ flex: 1 }}
                        >
                            <Box flex={1} p={32}>
                                <Button
                                    alignSelf="flex-end"
                                    bg="transparent"
                                    onPress={() => props.navigation.goBack()}
                                    p={0}
                                    m={0}
                                >
                                    <ButtonIcon size={32} as={X} />
                                </Button>

                                <VStack
                                    mt={40}
                                    space="lg"
                                    width={200}
                                    alignSelf="center"
                                >
                                    <Button
                                        onPress={() => {
                                            getRequest(`/jobs/${job?.id}/pause`)
                                                .then(() => {
                                                    console.log(
                                                        'Job paused successfully',
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        'Error pausing job:',
                                                        error,
                                                    );
                                                });
                                        }}
                                    >
                                        <ButtonText>Pause</ButtonText>
                                    </Button>
                                    <Button
                                        onPress={() => {
                                            getRequest(
                                                `/jobs/${job?.id}/resume`,
                                            )
                                                .then(() => {
                                                    console.log(
                                                        'Job resumed successfully',
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        'Error resuming job:',
                                                        error,
                                                    );
                                                });
                                        }}
                                    >
                                        <ButtonText>Resume</ButtonText>
                                    </Button>
                                    <Button
                                        onPress={() => {
                                            setAbortConfirmModal(true);
                                        }}
                                    >
                                        <ButtonText>Abort</ButtonText>
                                    </Button>
                                </VStack>
                            </Box>
                        </LinearGradient>
                    </VStack>
                </HStack>
            </Box>
        </MainContainer>
    );
};

export default JobDetail;
