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
import { formatDuration, getRequest } from '../../common/util';
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
                <HStack width="100%" height="100%">
                    <LeftPanel job={job} jobState={jobState} />
                    <RightPanel job={job} navigation={props.navigation} />
                </HStack>
            </Box>
        </MainContainer>
    );
};

const LeftPanel = ({
    job,
    jobState,
}: {
    job: Job | null;
    jobState: ProtocolState | null;
}) => {
    const [accentColor, setAccentColor] = useState('white');
    useEffect(() => {
        if (!job) return;

        switch (job.status) {
            case 'running':
                setAccentColor('#00DE30'); // green
                break;
            case 'paused':
                setAccentColor('#FACC15'); // yellow
                break;
            case 'aborted':
                setAccentColor('#F87171'); // red
                break;
            case 'completed':
                setAccentColor('#FFFFFF'); // white
                break;
            default:
                setAccentColor('#FFFFFF'); // white again
        }
    }, [job]);

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const calculateProgressPercentage = () => {
        if (!job || job.status == 'pending') return 0;
        if (job.status === 'completed') return 100;

        if (jobState) {
            const executionTime =
                jobState.initial_time_estimate -
                jobState.time_remaining_estimate;
            return Math.min(
                Math.ceil(
                    (executionTime / jobState.initial_time_estimate) * 100,
                ),
                99,
            );
        } else {
            return 0;
        }
    };

    const valueField = (label: string, value: string | number | null) => (
        <HStack justifyContent="space-between">
            <Text
                fontFamily="Manrope-Medium"
                fontSize={16}
                color="white"
                opacity={0.5}
            >
                {label}
            </Text>
            <Text fontFamily="Manrope-Medium" fontSize={16} color="white">
                {value !== null ? value : 'Loading...'}
            </Text>
        </HStack>
    );

    return (
        <VStack flex={355} p={32} alignItems="flex-start">
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

            <Text
                fontFamily="Manrope-Medium"
                fontSize={16}
                color="white"
                opacity={0.5}
                mt={30}
            >
                Status
            </Text>
            <HStack
                borderRadius={16}
                alignItems="center"
                mt={6}
                bg={accentColor + '33'}
                px={12}
                py={6}
            >
                <Box
                    width={12}
                    height={12}
                    borderRadius={6}
                    bg={accentColor}
                    mr={8}
                    opacity={1}
                ></Box>
                <Text
                    fontSize={16}
                    opacity={1}
                    color="white"
                    fontFamily="Manrope-Medium"
                >
                    {capitalizeFirstLetter(job?.status ?? '')}
                </Text>
            </HStack>

            <Text
                fontSize={40}
                color="white"
                fontFamily="Orbitron-Medium"
                my={70}
            >
                {calculateProgressPercentage()}%
            </Text>

            <VStack space={4} width="100%">
                {jobState ? (
                    <>
                        {valueField(
                            'Current Step',
                            `${jobState.completed_step_count} / ${jobState.step_count}`,
                        )}
                        {valueField(
                            'Initial Time Estimate',
                            formatDuration(jobState.initial_time_estimate),
                        )}
                        {valueField(
                            'Time Remaining',
                            formatDuration(jobState.time_remaining_estimate),
                        )}
                        {valueField('Current Slot', jobState.slot_description)}
                        {valueField(
                            'Is Paused',
                            jobState.is_paused ? 'Yes' : 'No',
                        )}
                        {valueField(
                            'Is Aborted',
                            jobState.is_aborted ? 'Yes' : 'No',
                        )}
                        {valueField(
                            'Has Ended',
                            jobState.has_ended ? 'Yes' : 'No',
                        )}
                    </>
                ) : (
                    <Text color="white">Loading job state...</Text>
                )}
            </VStack>
        </VStack>
    );
};

const RightPanel = ({
    job,
    navigation,
}: {
    job: Job | null;
    navigation: any;
}) => {
    const [abortConfirmModal, setAbortConfirmModal] = useState(false);

    return (
        <VStack flex={658}>
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
                        onPress={() => navigation.goBack()}
                        p={0}
                        m={0}
                    >
                        <ButtonIcon size={32} as={X} />
                    </Button>

                    <VStack mt={40} space="lg" width={200} alignSelf="center">
                        <Button
                            onPress={() => {
                                getRequest(`/jobs/${job?.id}/pause`)
                                    .then(() => {
                                        console.log('Job paused successfully');
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
                                getRequest(`/jobs/${job?.id}/resume`)
                                    .then(() => {
                                        console.log('Job resumed successfully');
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
    );
};

export default JobDetail;
