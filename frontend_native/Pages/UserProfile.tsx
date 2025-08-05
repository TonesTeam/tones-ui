import React from 'react';
import { StyleSheet } from 'react-native';
import NavBar from '../navigation/CustomNavigator';
import {
    Box,
    Heading,
    Image,
    Text,
    VStack,
    HStack,
} from '@gluestack-ui/themed';
import {
    AppStyles,
    MainContainer,
    globalElementStyle,
} from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const Profile = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const user = {
        username: 'Jacob Goldberg',
        role: 'Administrator',
        created_at: '2025-01-01',
        avatar: 'https://picsum.photos/200',
    };

    return (
        <MainContainer>
            <NavBar />
            <Box style={styles.wrapper}>
                <Heading size="2xl">User Profile</Heading>
                <VStack space="lg" alignItems="center">
                    <Image
                        source={{ uri: user.avatar }}
                        style={styles.avatar}
                        alt="Profile Picture"
                    />

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
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
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
