import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Box,
    Progress,
    ProgressFilledTrack,
    VStack,
    Text,
} from '@gluestack-ui/themed';
import Logo from '../assets/pics/tones_logo.svg';
import { useEffect, useState } from 'react';
import { getDomain } from '../common/util';
import { Pressable } from 'react-native';

const Loading = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const [progressValue, setProgressValue] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [errorClicks, setErrorClicks] = useState(0);

    useEffect(() => {
        getDomain(setProgressValue).then((domain) => {
            if (!domain.includes('null')) {
                navigation.replace('Logout');
            } else {
                setError(
                    "Failed to find the Tones device on your network. Please make sure it's turned on and connected to the same network as this app.",
                );
            }
        });
    }, []);

    return (
        <VStack
            backgroundColor="#E5E7F0"
            flex={1}
            width="100%"
            height="100vh"
            alignItems="center"
            justifyContent="center"
        >
            <Logo />
            {!error ? (
                <VStack mt={50} alignItems="center">
                    <Text fontSize={12}>
                        Looking for the Tones devices on your network. This may
                        take a few seconds...
                    </Text>
                    <Progress
                        value={progressValue}
                        size="sm"
                        width={500}
                        mt={10}
                    >
                        <ProgressFilledTrack bg="#4C51BF" />
                    </Progress>
                </VStack>
            ) : (
                <Box
                    mt={50}
                    backgroundColor="#FEE2E2"
                    padding={10}
                    borderRadius={5}
                    width={500}
                >
                    <Pressable
                        onPress={() => {
                            if (errorClicks >= 5) {
                                navigation.replace('Logout');
                                setErrorClicks(0);
                            } else {
                                setErrorClicks(errorClicks + 1);
                            }
                        }}
                    >
                        <Text fontSize={12} color="$error500">
                            {error}
                        </Text>
                    </Pressable>
                </Box>
            )}
        </VStack>
    );
};

export default Loading;
