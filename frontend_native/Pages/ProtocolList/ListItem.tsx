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

interface ListItemProps {
    protocol: ProtocolDto;
    navigation: NativeStackNavigationProp<any>;
    removeProtocolFromList: (id: number) => void;
}

const ListItem = ({
    protocol,
    navigation,
    removeProtocolFromList,
}: ListItemProps) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const deleteProtocol = (id: number) => {
        makeRequest('DELETE' as Method, `/protocols/${id}`)
            .then((_) => {
                removeProtocolFromList(id);
                setDeleteModal(false);
            })
            .catch((err) => {
                console.log(err.message);
                setDeleteModal(false);
            });
    };

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
                    # {protocol.id}
                </Text>
                <Text flex={5} textAlign="left" size="md" color="#1F2832">
                    {protocol.name}
                </Text>

                <HStack flex={4} alignItems="center" space="sm">
                    <GeneratedAvatar
                        name={protocol.author_first_name}
                        size={32}
                    />
                    <Text color="#1F2832" size="md">
                        {protocol.author_first_name} {protocol.author_last_name}
                    </Text>
                </HStack>

                <Text size="md" color="#1F2832" flex={2} textAlign="center">
                    {formatSocialMediaTime(protocol.created_at)}
                </Text>

                <Text color="#1F2832" size="md" flex={3} textAlign="center">
                    Ready
                </Text>

                <Box flex={1}>
                    <Menu
                        minWidth={150}
                        placement="top"
                        padding="$3"
                        rounded="$xl"
                        offset={0}
                        isOpen={menuOpen}
                        onOpen={() => setMenuOpen(true)}
                        onClose={() => setMenuOpen(false)}
                        trigger={({ ...triggerProps }) => {
                            return (
                                <Pressable
                                    {...triggerProps}
                                    alignItems="flex-start"
                                    justifyContent="center"
                                >
                                    <Icon
                                        as={EllipsisVertical}
                                        color="$black"
                                        size={24}
                                    />
                                </Pressable>
                            );
                        }}
                    >
                        <MenuItem
                            key="Duplicate"
                            textValue="Duplicate"
                            rounded="$md"
                        >
                            <MenuItemLabel
                                onPress={() =>
                                    navigation.navigate('Create protocol', {
                                        protocol_ID: protocol.id,
                                        preserveID: false,
                                    })
                                }
                                size="lg"
                                color="$black"
                            >
                                Duplicate
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem
                            key="Edit"
                            textValue="Edit"
                            rounded="$md"
                            onPress={() =>
                                navigation.navigate('Create protocol', {
                                    protocol_ID: protocol.id,
                                    preserveID: true,
                                })
                            }
                        >
                            <MenuItemLabel size="lg" color="$black">
                                Edit
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem
                            onPress={() => {
                                navigation.navigate('ProtocolView', {
                                    protocol_ID: protocol.id,
                                });
                            }}
                            key="Info"
                            textValue="Info"
                            rounded="$md"
                        >
                            <MenuItemLabel size="lg" color="$black">
                                Info
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem
                            onPress={() => {
                                setMenuOpen(false); // Otherwise the menu stays open
                                setDeleteModal(true);
                            }}
                            key="Delete"
                            textValue="Delete"
                            rounded="$md"
                        >
                            <MenuItemLabel size="lg" color="$error500">
                                Delete
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </Box>

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
                        onPress={() =>
                            navigation.navigate('ProtocolView', {
                                protocol_ID: protocol.id,
                            })
                        }
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
            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                action={() => deleteProtocol(protocol.id)}
                headline={`Delete protocol "${protocol.name}"`}
                text="Are you sure you want to delete this protocol? This action cannot be undone."
                actionButtonText="Delete"
            />
        </Box>
    );
};

export default ListItem;
