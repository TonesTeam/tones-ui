import React from 'react';
import { StyleSheet, View } from 'react-native';
import NavBar from '../navigation/CustomNavigator';
import { Box, Heading, Text, VStack, HStack } from '@gluestack-ui/themed';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GeneratedAvatar from '../components/GeneratedAvatar';

const Profile = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const user = {
        username: 'Jacob Goldberg',
        role: 'Administrator',
        created_at: '2025-01-01',
    };

    return (
        <MainContainer>
            <NavBar />
            <Box style={styles.wrapper}>
                <Heading size="2xl">User Profile</Heading>
                <VStack space="lg" alignItems="center">
                    <GeneratedAvatar name={user.username} size={150} />

                    <VStack space="md" style={styles.infoBox}>
                        <HStack style={styles.row}>
                            <Text fontFamily="Roboto-bold" style={styles.label}>
                                Username:
                            </Text>
                            <Text style={styles.value}>{user.username}</Text>
                        </HStack>

                        <HStack style={styles.row}>
                            <Text fontFamily="Roboto-bold" style={styles.label}>
                                Role:
                            </Text>
                            <Text style={styles.value}>{user.role}</Text>
                        </HStack>

                        <HStack style={styles.row}>
                            <Text fontFamily="Roboto-bold" style={styles.label}>
                                Joined:
                            </Text>
                            <Text style={styles.value}>{user.created_at}</Text>
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
        backgroundColor: '#fff',
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
