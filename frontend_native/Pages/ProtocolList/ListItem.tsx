import { EllipsisVertical, Trash } from 'lucide-react-native';
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
        makeRequest('DELETE' as Method, `/protocol/delete/${id}`)
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
        >
            <HStack
                alignItems="center"
                justifyContent="space-between"
                width="100%"
            >
                <Text flex={1} textAlign="left" size="lg" color="$black">
                    # {protocol.id}
                </Text>
                <Text flex={6} textAlign="left" size="lg" color="$black">
                    {protocol.name}
                </Text>

                <HStack flex={3} alignItems="center" space="sm">
                    <GeneratedAvatar name={'Jefferey'} size={40} />
                    <Text color="$black" size="lg">
                        {protocol.author}
                    </Text>
                </HStack>

                <Text size="lg" color="$black" flex={2} textAlign="center">
                    {formatSocialMediaTime(protocol.creationDate)}
                </Text>

                <Text color="$black" size="lg" flex={3} textAlign="center">
                    Ready
                </Text>

                <Box flex={3}>
                    <Menu
                        minWidth={150}
                        placement="top"
                        padding="$3"
                        rounded="$xl"
                        offset={5}
                        isOpen={menuOpen}
                        onClose={() => setMenuOpen(false)}
                        trigger={({ ...triggerProps }) => {
                            return (
                                <Pressable
                                    {...triggerProps}
                                    alignItems="center"
                                    justifyContent="center"
                                    onPress={() => {
                                        console.log(`menuOpen was ${menuOpen}`);
                                        requestAnimationFrame(() =>
                                            setMenuOpen(!menuOpen),
                                        );
                                        console.log(
                                            `Now menuOpen is ${menuOpen}`,
                                        );
                                    }}
                                >
                                    <Icon
                                        as={EllipsisVertical}
                                        color="$black"
                                        size={40}
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
                            onPress={() =>
                                navigation.navigate('ProtocolView', {
                                    protocol_ID: protocol.id,
                                })
                            }
                            key="Info"
                            textValue="Info"
                            rounded="$md"
                        >
                            <MenuItemLabel size="lg" color="$black">
                                Info
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuSeparator width="85%" alignSelf="center" />
                        <MenuItem key="Delete" textValue="Delete" rounded="$md">
                            <MenuItemLabel
                                onPress={() => {
                                    setMenuOpen(false); // Otherwise the menu stays open
                                    setDeleteModal(true);
                                }}
                                size="lg"
                                color="$error500"
                            >
                                Delete
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </Box>

                <HStack flex={2} justifyContent="flex-end" space="sm">
                    <Button
                        size="md"
                        bg="$black"
                        px="$5"
                        rounded="$full"
                        onPress={() =>
                            navigation.navigate('ProtocolView', {
                                protocol_ID: protocol.id,
                            })
                        }
                    >
                        <ButtonText color="$white" fontWeight="500">
                            Launch
                        </ButtonText>
                    </Button>
                </HStack>
            </HStack>
            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                action={() => deleteProtocol(protocol.id)}
                icon={Trash}
                headline={`Delete protocol "${protocol.name}"`}
                text="Are you sure you want to delete this protocol? This action cannot be undone."
                actionButtonText="Delete"
                type="error"
            />
        </Box>
    );
};

export default ListItem;
