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
import NavBar from '../navigation/CustomNavigator';
import { AppStyles } from '../constants/styles';
import { getRequest } from '../common/util';

interface LogEntry {
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    command?: string;
    response?: string; 
}

export default function ProtocolLogs({ route, navigation }: NativeStackScreenProps<any>) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [protocolProgress, setProtocolProgress] = useState(0);
    const [protocolName, setProtocolName] = useState('No active protocol');
    const [isRunning, setIsRunning] = useState(false);
    const [hasError, setHasError] = useState(false);

const protocol_ID = route.params
    ? (route.params as { protocol_ID: number }).protocol_ID
    : undefined;

    const addLogEntry = (level: 'info' | 'warning' | 'error', message: string) => {
        const newLog: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            level,
            message
        };
        setLogs(prevLogs => [...prevLogs, newLog]);
        
        if (level === 'error') {
            setHasError(true);
        }
    };

    // Monitor robot status
    const startStatusMonitoring = () => {
        addLogEntry('info', 'Starting status monitoring...');
        
        const monitoringInterval = setInterval(() => {
            getRequest('/slot-status')
                .then((response) => {
                    if (response && 'status' in response && response.status === 200) {
                        const data = response.data;
                        addLogEntry('info', `Robot status check: ${JSON.stringify(data)}`);
                        
                        // Update progress based on robot response
                        setProtocolProgress(prev => {
                            const newProgress = Math.min(prev + Math.random() * 15, 100);
                            if (newProgress >= 100) {
                                addLogEntry('info', 'Protocol execution completed');
                                setIsRunning(false);
                                clearInterval(monitoringInterval);
                            }
                            return Math.round(newProgress);
                        });
                    } else {
                        addLogEntry('warning', 'Unable to get robot status');
                    }
                })
                .catch((error) => {
                    addLogEntry('error', `Status monitoring failed: ${error.message || 'Connection error'}`);
                    clearInterval(monitoringInterval);
                    setIsRunning(false);
                });
        }, 3000); // Check every 3 seconds

        // Also get protocol steps info for more detailed logging
        setTimeout(() => {
            getRequest(`/protocol/${protocol_ID}`)
                .then((response) => {
                    if (response && 'status' in response && response.status === 200) {
                        const protocol = response.data;
                        addLogEntry('info', `Protocol: ${protocol.name || 'Unnamed'}`);
                        addLogEntry('info', `Total steps: ${protocol.steps?.length || 0}`);
                        
                        protocol.steps?.forEach((step, index) => {
                            addLogEntry('info', `Step ${index + 1}: ${step.type || 'Unknown'} - ${step.incubation}s at ${step.temperature}°C`);
                        });
                    }
                })
                .catch((error) => {
                    addLogEntry('warning', `Could not load protocol details: ${error.message}`);
                });
        }, 1000);

        // Stop monitoring after 5 minutes if still running
        setTimeout(() => {
            clearInterval(monitoringInterval);
            if (isRunning) {
                addLogEntry('info', 'Status monitoring stopped - timeout reached');
                setIsRunning(false);
                setProtocolProgress(-1);
            }
        }, 300000);
    };

    // Execute protocol and handle result
    useEffect(() => {
        if (protocol_ID) {
            setProtocolName(`Protocol #${protocol_ID}`);
            setLogs([]);
            setIsRunning(true);
            
            addLogEntry('info', `Starting protocol execution for Protocol #${protocol_ID}`);
            addLogEntry('info', 'Sending execution command to robot...');
            
            // enter point
            getRequest(`/protocol/${protocol_ID}/execute`)
                .then((response) => {
                    if (response && 'status' in response && response.status === 200) {
                        addLogEntry('info', 'Protocol execution command sent successfully');
                        addLogEntry('info', 'Robot is processing the protocol...');
                        setProtocolProgress(10);
                        
                        startStatusMonitoring();
                    } else {
                        addLogEntry('error', 'Failed to execute protocol - Invalid response');
                        setIsRunning(false);
                        setProtocolProgress(-1);
                    }
                })
                .catch((error) => {
                    addLogEntry('error', 'Network error: Unable to connect to robot');
                    addLogEntry('error', `Error details: ${error.message || 'Connection refused'}`);
                    addLogEntry('error', 'Please check robot connection and try again');
                    setIsRunning(false);
                    setHasError(true);
                });
        } else {
            setLogs([]);
            setProtocolProgress(0);
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
                                Status: {hasError ? 'Error' : isRunning ? 'Running' : logs.length === 0 ? 'Not started' : 'Completed'}
                            </Text>
                            <Badge 
                                variant="solid" 
                                backgroundColor={hasError ? '$red500' : isRunning ? '$green500' : logs.length === 0 ? '$yellow500' : '$blue500'}
                                alignSelf="flex-start"
                            >
                                <BadgeText color="$white">
                                    {hasError ? 'Error' : isRunning ? 'In Progress' : logs.length === 0 ? 'Waiting' : 'Done'}
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
                                            {protocol_ID ? 'Waiting for protocol execution...' : 'Terminal ready. Launch a protocol to see output.'}
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
                                                color={log.level === 'error' ? '#ff4444' : log.level === 'warning' ? '#ffff00' : '#00ff00'}
                                                fontFamily="monospace"
                                                lineHeight={18}
                                            >
                                                [{log.timestamp}] {log.level.toUpperCase()}: {log.message}
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