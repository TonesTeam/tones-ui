import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    ScrollView,
    Badge,
    BadgeText,
} from '@gluestack-ui/themed';
import CircularProgress from 'react-native-circular-progress-indicator';
import { MainContainer } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { AppStyles } from '../constants/styles';
import { getRequest } from '../common/util';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setProgress, addAndRun } from '../state/progress';

interface LogEntry {
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    command?: string;
    response?: string;
}

export default function ProtocolLogs({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const dispatch = useAppDispatch();
    const protocols = useAppSelector((state) => state.protocols);

    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [protocolName, setProtocolName] = useState('No active protocol');
    const [isRunning, setIsRunning] = useState(false);
    const [hasError, setHasError] = useState(false);

    const protocol_ID = route.params
        ? (route.params as { protocol_ID: number }).protocol_ID
        : undefined;

    // Resive progress based on protocol ID from Redux
    const currentProtocol = protocols.find(
        (p) => p.protocol.id === protocol_ID,
    );
    const protocolProgress = currentProtocol?.progress || 0;

    // Update progress in Redux
    const updateProgress = (newProgress: number) => {
        if (protocol_ID) {
            dispatch(
                setProgress({
                    protocolId: protocol_ID,
                    progress: newProgress,
                }),
            );
        }
    };

    const addLogEntry = (
        level: 'info' | 'warning' | 'error',
        message: string,
    ) => {
        const newLog: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            level,
            message,
        };
        setLogs((prevLogs) => [...prevLogs, newLog]);

        if (level === 'error') {
            setHasError(true);
        }
    };

    // Monitor robot status - real robot data only
    const startStatusMonitoring = () => {
        addLogEntry('info', '[ROBOT] Starting robot status monitoring...');
        updateProgress(5);

        const monitoringInterval = setInterval(() => {
            // Cheaking robot status every 2 seconds
            getRequest('/slot-status')
                .then((response) => {
                    if (
                        response &&
                        'status' in response &&
                        response.status === 200
                    ) {
                        const data = (response as any).data;
                        let robotControlledFlow = false;

                        if (data.error) {
                            addLogEntry(
                                'error',
                                `[ROBOT] Critical error: ${data.error}`,
                            );
                            addLogEntry(
                                'error',
                                '[ROBOT] Stopping protocol execution',
                            );
                            setHasError(true);
                            clearInterval(monitoringInterval);
                            setIsRunning(false);
                            return;
                        }

                        if (data.protocolStatus) {
                            robotControlledFlow = true;

                            if (data.protocolStatus === 'completed') {
                                addLogEntry(
                                    'info',
                                    '[ROBOT] Protocol completed successfully!',
                                );
                                updateProgress(100);
                                setIsRunning(false);
                                clearInterval(monitoringInterval);
                                return;
                            }

                            if (data.protocolStatus === 'failed') {
                                addLogEntry(
                                    'error',
                                    '[ROBOT] Protocol execution failed!',
                                );
                                setHasError(true);
                                setIsRunning(false);
                                clearInterval(monitoringInterval);
                                return;
                            }

                            if (data.protocolStatus === 'paused') {
                                addLogEntry(
                                    'warning',
                                    '[ROBOT] Protocol execution paused',
                                );
                                return;
                            }
                        }

                        if (data.progress !== undefined && data.progress >= 0) {
                            const robotProgress = Math.min(data.progress, 100);
                            updateProgress(robotProgress);
                            addLogEntry(
                                'info',
                                `[ROBOT] Progress: ${robotProgress}%`,
                            );
                        }

                        if (data.currentStep !== undefined) {
                            const robotStep = data.currentStep;
                            addLogEntry(
                                'info',
                                `[ROBOT] Current step: ${robotStep}`,
                            );
                        }

                        if (data.warning) {
                            addLogEntry(
                                'warning',
                                `[ROBOT] Warning: ${data.warning}`,
                            );
                        }

                        addLogEntry('info', '[ROBOT] Status: OK');
                    } else {
                        addLogEntry(
                            'warning',
                            '[ROBOT] Communication error - using time-based fallback',
                        );
                    }
                })
                .catch((error) => {
                    addLogEntry(
                        'error',
                        `[ROBOT] Communication failed: ${error.message}`,
                    );
                });
        }, 2000);

        // Stop monitoring after 10 minutes if still running
        setTimeout(() => {
            clearInterval(monitoringInterval);
            if (isRunning) {
                addLogEntry(
                    'info',
                    '[ROBOT] Status monitoring stopped - timeout reached',
                );
                setIsRunning(false);
            }
        }, 600000);
    };

    // Execute protocol and handle result
    useEffect(() => {
        if (protocol_ID) {
            setProtocolName(`Protocol #${protocol_ID}`);
            setLogs([]);
            setIsRunning(true);

            if (!currentProtocol) {
                dispatch(
                    addAndRun({
                        id: protocol_ID,
                        name: `Protocol #${protocol_ID}`,
                    } as any),
                );
            }

            addLogEntry(
                'info',
                `Starting protocol execution for Protocol #${protocol_ID}`,
            );

            // First fetch deployment information
            addLogEntry('info', 'Getting protocol deployment information...');
            getRequest(`/protocol/${protocol_ID}/deployment`)
                .then((deploymentResponse) => {
                    if (
                        deploymentResponse &&
                        Array.isArray(deploymentResponse)
                    ) {
                        addLogEntry(
                            'info',
                            `Found ${deploymentResponse.length} liquid deployment requirements:`,
                        );

                        deploymentResponse.forEach(
                            (deployment: any, index: number) => {
                                addLogEntry(
                                    'info',
                                    `${index + 1}. Liquid: "${
                                        deployment.liquidName || 'Unknown'
                                    }" ` +
                                        `(ID: ${deployment.liquidInfoId}) - ` +
                                        `${deployment.amount}ml in Slot ${deployment.slotNumber}`,
                                );
                            },
                        );

                        const slotSummary = deploymentResponse.reduce(
                            (acc: any, dep: any) => {
                                if (!acc[dep.slotNumber]) {
                                    acc[dep.slotNumber] = [];
                                }
                                acc[dep.slotNumber].push(
                                    `${dep.liquidName}(${dep.amount}ml)`,
                                );
                                return acc;
                            },
                            {},
                        );

                        addLogEntry('info', 'Slot assignment summary:');
                        Object.keys(slotSummary)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .forEach((slot) => {
                                addLogEntry(
                                    'info',
                                    `  Slot ${slot}: ${slotSummary[slot].join(
                                        ', ',
                                    )}`,
                                );
                            });
                    } else {
                        addLogEntry(
                            'warning',
                            'Deployment response format is unexpected or empty',
                        );
                        if (deploymentResponse) {
                            addLogEntry(
                                'info',
                                'No liquid deployment requirements found',
                            );
                        }
                    }
                })
                .catch((error) => {
                    addLogEntry(
                        'warning',
                        `Failed to get deployment info: ${error.message}`,
                    );
                });

            addLogEntry('info', 'Sending execution command to robot...');

            getRequest(`/protocol/${protocol_ID}/execute`)
                .then((response) => {
                    if (
                        response &&
                        'status' in response &&
                        response.status === 200
                    ) {
                        addLogEntry(
                            'info',
                            'Execute endpoint responded successfully',
                        );
                        const data = (response as any).data;
                        if (data) {
                            addLogEntry(
                                'info',
                                'Protocol execution data received from backend',
                            );
                        }

                        addLogEntry(
                            'info',
                            'Protocol execution command sent successfully',
                        );
                        addLogEntry(
                            'info',
                            'Robot is processing the protocol...',
                        );
                        updateProgress(10);

                        startStatusMonitoring();
                    } else {
                        addLogEntry(
                            'error',
                            'Failed to execute protocol - Invalid response from server',
                        );
                        if (response && 'status' in response) {
                            addLogEntry(
                                'error',
                                `Server returned status: ${response.status}`,
                            );
                        }
                        setIsRunning(false);
                        updateProgress(-1);
                    }
                })
                .catch((error) => {
                    addLogEntry(
                        'error',
                        'Network error: Unable to connect to robot',
                    );
                    addLogEntry(
                        'error',
                        `Error details: ${
                            error.message || 'Connection refused'
                        }`,
                    );
                    if (error.code) {
                        addLogEntry('error', `Error code: ${error.code}`);
                    }
                    if (error.response) {
                        addLogEntry(
                            'error',
                            `HTTP status: ${error.response.status}`,
                        );
                    }
                    addLogEntry(
                        'error',
                        'Please check robot connection and try again',
                    );
                    setIsRunning(false);
                    setHasError(true);
                });
        } else {
            setLogs([]);
            updateProgress(0);
            setIsRunning(false);
            setHasError(false);
            setProtocolName('No active protocol');
        }
    }, [protocol_ID]);

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} padding="$6" backgroundColor="$white">
                <VStack space="lg" flex={1}>
                    {/* Header */}
                    <VStack space="md">
                        <Heading size="2xl">Protocol Logs</Heading>
                        <Text size="lg" color="$textLight600">
                            {protocolName}
                        </Text>
                    </VStack>

                    {/* Progress Section */}
                    <HStack
                        backgroundColor="$backgroundLight50"
                        padding="$6"
                        borderRadius="$xl"
                        alignItems="center"
                        space="xl"
                    >
                        <CircularProgress
                            value={protocolProgress}
                            valueSuffix={'%'}
                            allowFontScaling={false}
                            radius={50}
                            duration={1000}
                            progressValueColor={AppStyles.color.text_primary}
                            activeStrokeColor={AppStyles.color.secondary}
                            inActiveStrokeColor={AppStyles.color.background}
                            inActiveStrokeOpacity={0.3}
                            inActiveStrokeWidth={8}
                            activeStrokeWidth={8}
                        />

                        <VStack space="sm" flex={1}>
                            <Text fontWeight="bold" size="lg">
                                Execution Progress
                            </Text>
                            <Text color="$textLight600">
                                Status:{' '}
                                {hasError
                                    ? 'Error'
                                    : isRunning
                                    ? 'Running'
                                    : logs.length === 0
                                    ? 'Not started'
                                    : 'Completed'}
                            </Text>
                            {isRunning && (
                                <Text color="$textLight500" size="sm">
                                    Monitoring robot status...
                                </Text>
                            )}
                            <Badge
                                variant="solid"
                                backgroundColor={
                                    hasError
                                        ? '$red500'
                                        : isRunning
                                        ? '$green500'
                                        : logs.length === 0
                                        ? '$yellow500'
                                        : '$blue500'
                                }
                                alignSelf="flex-start"
                            >
                                <BadgeText color="$white">
                                    {hasError
                                        ? 'Error'
                                        : isRunning
                                        ? 'In Progress'
                                        : logs.length === 0
                                        ? 'Waiting'
                                        : 'Done'}
                                </BadgeText>
                            </Badge>
                        </VStack>
                    </HStack>

                    {/* Terminal Section */}
                    <VStack space="md" flex={1}>
                        <Heading size="lg">Logs</Heading>

                        <Box
                            flex={1}
                            backgroundColor="#000000"
                            borderRadius="$xl"
                            padding="$4"
                        >
                            {logs.length === 0 ? (
                                <Box
                                    flex={1}
                                    alignItems="center"
                                    justifyContent="center"
                                    minHeight={200}
                                >
                                    <VStack space="md" alignItems="center">
                                        <Text
                                            fontSize="$lg"
                                            color="#00ff00"
                                            fontFamily="monospace"
                                            textAlign="center"
                                        >
                                            robot@tones:~$ _
                                        </Text>
                                        <Text
                                            fontSize="$sm"
                                            color="#888888"
                                            fontFamily="monospace"
                                            textAlign="center"
                                        >
                                            {protocol_ID
                                                ? 'Waiting for protocol execution...'
                                                : 'Terminal ready. Launch a protocol to see output.'}
                                        </Text>
                                    </VStack>
                                </Box>
                            ) : (
                                <ScrollView
                                    flex={1}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <VStack space="xs">
                                        {logs.map((log, index) => (
                                            <Text
                                                key={index}
                                                fontSize="$sm"
                                                color={
                                                    log.level === 'error'
                                                        ? '#ff4444'
                                                        : log.level ===
                                                          'warning'
                                                        ? '#ffff00'
                                                        : '#00ff00'
                                                }
                                                fontFamily="monospace"
                                                lineHeight={18}
                                            >
                                                [{log.timestamp}]{' '}
                                                {log.level.toUpperCase()}:{' '}
                                                {log.message}
                                            </Text>
                                        ))}
                                        <Text
                                            fontSize="$sm"
                                            color="#00ff00"
                                            fontFamily="monospace"
                                            lineHeight={18}
                                        >
                                            robot@tones:~$ _
                                        </Text>
                                    </VStack>
                                </ScrollView>
                            )}
                        </Box>
                    </VStack>
                </VStack>
            </Box>
        </MainContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
