import { EllipsisVertical, Trash, Eye } from 'lucide-react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { ProtocolDto } from 'common/dto/protocol.dto';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { formatSocialMediaTime, makeRequest } from '../../common/util';
import {
    HStack,
    Text,
    Box,
    Icon,
    Pressable,
    MenuItem,
    MenuItemLabel,
    MenuSeparator,
    Button,
    ButtonText,
    Menu,
    ButtonIcon,
} from '@gluestack-ui/themed';
import GeneratedAvatar from '../../components/GeneratedAvatar';
import { Method } from 'axios';
import { Batch } from './Batches';
import { Job } from './Jobs';

interface ListItemProps {
    batch: Batch | Job;
    navigation: NativeStackNavigationProp<any>;
    isJob: boolean;
}

const ListItem = ({ batch, navigation, isJob }: ListItemProps) => {
    const handleView = () => {
        if (isJob) {
            navigation.navigate('JobDetail', { job_id: batch.id });
        } else {
            navigation.navigate('JobList', {
                batch_id: batch.id,
                batch_name: batch.name,
            });
        }
    };

    const isBatch = (item: Batch | Job): item is Batch => !isJob;

    return (
        <Box
            rounded="$xl"
            bg="$white"
            p="$4"
            mb="$3"
            shadowColor="$borderLight100"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.05}
            shadowRadius={2}
            flexDirection="row"
            height={72}
        >
            <HStack
                alignItems="center"
                justifyContent="space-between"
                width="100%"
            >
                <Text flex={1} textAlign="left" size="md" color="#1F2832">
                    # {batch.id}
                </Text>
                <Text flex={5} textAlign="left" size="md" color="#1F2832">
                    {batch.name}
                </Text>

                {/* Creator - only available on Batch */}
                {isBatch(batch) ? (
                    <HStack flex={4} alignItems="center" space="sm">
                        <GeneratedAvatar
                            name={batch.creator_first_name}
                            size={32}
                        />
                        <Text color="#1F2832" size="md">
                            {batch.creator_first_name} {batch.creator_last_name}
                        </Text>
                    </HStack>
                ) : (
                    <Text flex={4} color="#1F2832" size="md">
                        Slot {batch.slot_number}
                    </Text>
                )}

                <Text size="md" color="#1F2832" flex={2} textAlign="center">
                    {formatSocialMediaTime(batch.start_timestamp)}
                </Text>
                <Text color="#1F2832" size="md" flex={2} textAlign="right">
                    {batch.status}
                </Text>
                <Box flex={2} />
                <HStack flex={2} justifyContent="flex-end" space="sm">
                    <Button
                        variant="outline"
                        rounded="$full"
                        borderColor="$black"
                        bg="#1F2832"
                        ml="$2"
                        p="$5"
                        alignItems="center"
                        justifyContent="center"
                        size="md"
                        onPress={handleView}
                    >
                        <Box
                            style={{
                                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                            }}
                        >
                            <ButtonIcon as={Eye} mr="$2" color="white" />
                        </Box>
                        <ButtonText color="white" minHeight={20} fontSize={14}>
                            View
                        </ButtonText>
                    </Button>
                </HStack>
            </HStack>
        </Box>
    );
};

export default ListItem;
