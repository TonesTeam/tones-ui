import React from 'react';
import { StyleSheet, View } from 'react-native';
import NavBar from '../navigation/NavBar';
import { Box } from '../components/ui/box';
import { Heading } from '../components/ui/heading';
import { Text } from '../components/ui/text';
import { VStack } from '../components/ui/vstack';
import { HStack } from '../components/ui/hstack';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GeneratedAvatar from '../components/GeneratedAvatar';
import { useUser } from '../contexts/UserContext';

const Profile = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const { user } = useUser();

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
                    User Profile
                </Text>
                <VStack space="lg" alignItems="center">
                    <GeneratedAvatar name={user?.first_name} size={150} />

                    <VStack space="md" style={styles.infoBox}>
                        <HStack style={styles.row}>
                            <Text fontFamily="Roboto-bold" style={styles.label}>
                                Username:
                            </Text>
                            <Text style={styles.value}>
                                {user?.first_name} {user?.last_name}
                            </Text>
                        </HStack>

                        <HStack style={styles.row}>
                            <Text fontFamily="Roboto-bold" style={styles.label}>
                                Role:
                            </Text>
                            <Text style={styles.value}>{user?.role}</Text>
                        </HStack>

                        <HStack style={styles.row}>
                            <Text fontFamily="Roboto-bold" style={styles.label}>
                                Institution:
                            </Text>
                            <Text style={styles.value}>
                                {user?.institution}
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>
            </Box>
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 24,
    },
    infoBox: {
        width: '100%',
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        marginRight: 8,
        fontSize: 16,
    },
    value: {
        fontSize: 16,
    },
});

export default Profile;
