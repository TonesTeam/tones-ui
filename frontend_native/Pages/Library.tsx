import { MainContainer, globalElementStyle } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { useEffect, useState } from 'react';
import {
    LiquidDTO,
    LiquidTypeDTO,
    PermanentLiquidDTO,
} from 'common/dto/liquid.dto';
import { formatSocialMediaTime, getRequest, makeRequest } from '../common/util';
import { CustomSelect } from '../components/Select';
import { Method } from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Box } from '../components/ui/box';
import { Heading } from '../components/ui/heading';
import { Icon } from '../components/ui/icon';
import { Text } from '../components/ui/text';
import { Spinner } from '../components/ui/spinner';
import { ScrollView } from '../components/ui/scroll-view';
import { Button, ButtonText, ButtonIcon } from '../components/ui/button';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '../components/ui/modal';
import { VStack } from '../components/ui/vstack';
import { HStack } from '../components/ui/hstack';
import { Input, InputField } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import {
    Trash,
    Pencil,
    CirclePlus,
    Save,
    Plus,
    Eye,
} from 'lucide-react-native';
import ConfirmationModal from '../components/ConfirmationModal';
import SearchBar from '../components/SearchBar';
import GeneratedAvatar from '../components/GeneratedAvatar';

export default function Library(_props: any) {
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
                    Library
                </Text>
                <LibraryBody />
            </Box>
        </MainContainer>
    );
}

const LibraryBody = () => {
    const [liquids, setLiquids] = useState<PermanentLiquidDTO[]>([]);
    const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
    const [searchPrompt, setSearchPrompt] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(-1);
    const [editedLiquid, setEditedLiquid] = useState<PermanentLiquidDTO | null>(
        null,
    );
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            listInitilizer();
        } else {
            setLiquids([]);
        }
    }, [isFocused]);

    const idToName = (id: number) => {
        console.log(id);
        for (const liquid of liquids) {
            if (liquid.id === id) return liquid.name;
        }
        return '';
    };

    const listInitilizer = () => {
        getRequest<LiquidDTO[]>('/liquids').then((r) => {
            setLiquids(r.data);
        });

        getRequest<LiquidTypeDTO[]>('/liquids/types').then((r) => {
            setCategories(r.data);
        });

        setEditedLiquid(null);
    };

    useEffect(listInitilizer, []);

    function saveOrUpdateLiquid(liq: PermanentLiquidDTO) {
        makeRequest('POST' as Method, '/liquid/save', JSON.stringify(liq))
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    listInitilizer(); //workaround. buggy. TODO: pass rigger from parent (Settings)
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function deleteLiquid(id: number) {
        makeRequest('DELETE' as Method, `/liquid/delete/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    listInitilizer();
                } else {
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function filterAndSort() {
        if (liquids) {
            let filteredList = liquids.filter((e) =>
                searchPrompt === ''
                    ? e
                    : e.name.toLowerCase().includes(searchPrompt.toLowerCase()),
            );
            let sortedList = filteredList;
            return sortedList;
        } else return [] as PermanentLiquidDTO[];
    }

    if (liquids.length === 0 || categories.length === 0) {
        return (
            <Box
                flex={1}
                justifyContent="center"
                alignItems="center"
                width={800}
            >
                <Spinner size="large" color="grey" />
            </Box>
        );
    }

    return (
        <>
            {liquids.length != 0 && categories.length != 0 && (
                <>
                    <Box width={900}>
                        <HStack space="xl" alignItems="center">
                            <SearchBar
                                placeholder="Which reagent are you looking for?"
                                value={searchPrompt}
                                onChangeText={(e) => setSearchPrompt(e)}
                            />
                            <Button
                                variant="outline"
                                rounded="$full"
                                borderColor="$black"
                                bg="#1F2832"
                                mr="$2"
                                onPress={() => setEditModal(true)}
                                alignItems="center"
                                justifyContent="center"
                                height={48}
                            >
                                <Box
                                    style={{
                                        filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                                    }}
                                >
                                    <ButtonIcon
                                        bg="transparent"
                                        color="white"
                                        as={Plus}
                                        mr="$2"
                                        size={20}
                                    />
                                </Box>
                                <ButtonText color="white" fontSize={14}>
                                    New Liquid
                                </ButtonText>
                            </Button>
                        </HStack>
                        {filterAndSort().length === 0 && (
                            <Box
                                p="$6"
                                bg="$backgroundLight50"
                                rounded="$lg"
                                borderWidth="$1"
                                borderColor="$borderLight200"
                                borderStyle="dashed"
                                mt="$5"
                            >
                                <VStack alignItems="center" space="md">
                                    <Icon
                                        as={CirclePlus}
                                        size="xl"
                                        color="$textLight400"
                                    />
                                    <Text
                                        color="$textLight500"
                                        textAlign="center"
                                    >
                                        No reagents found! Try adjusting your
                                        search or add a new reagent.
                                    </Text>
                                </VStack>
                            </Box>
                        )}
                        {filterAndSort().length != 0 && (
                            <Box overflow="hidden" mt="$5" mb="$6">
                                {/* Table Header */}
                                <HStack p="$3">
                                    <Box flex={1}>
                                        <Text
                                            opacity={0.5}
                                            fontSize={14}
                                            color="#1F2832"
                                        >
                                            # ID
                                        </Text>
                                    </Box>
                                    <Box flex={6}>
                                        <Text
                                            opacity={0.5}
                                            fontSize={14}
                                            color="#1F2832"
                                        >
                                            Name
                                        </Text>
                                    </Box>
                                    <Box flex={3}>
                                        <Text
                                            opacity={0.5}
                                            fontSize={14}
                                            color="#1F2832"
                                        >
                                            Type
                                        </Text>
                                    </Box>
                                    <Box flex={2}>
                                        <Text
                                            opacity={0.5}
                                            fontSize={14}
                                            color="#1F2832"
                                        >
                                            Created
                                        </Text>
                                    </Box>
                                    <Box flex={2}>
                                        <Text
                                            opacity={0.5}
                                            fontSize={14}
                                            color="#1F2832"
                                        >
                                            Actions
                                        </Text>
                                    </Box>
                                </HStack>

                                {/* Table Rows */}
                                <ScrollView>
                                    {filterAndSort().map((liquid, i) => {
                                        return (
                                            <ListItem liquid={liquid} key={i} />
                                        );
                                    })}
                                </ScrollView>
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};

type ListItemProps = {
    liquid: PermanentLiquidDTO;
    key?: number;
};

const ListItem = ({ liquid }: ListItemProps) => {
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
                <Text flex={1} textAlign="left" size="md" color="$black">
                    # {liquid.id}
                </Text>
                <Text flex={6} textAlign="left" size="md" color="$black">
                    {liquid.name}
                </Text>

                <HStack flex={3} alignItems="center" space="sm">
                    <Text color="$black" size="md">
                        {liquid.liquid_type_name}
                    </Text>
                </HStack>

                <Box flex={2} alignItems="flex-start" justifyContent="center">
                    <Text size="md" color="$black" textAlign="center">
                        {formatSocialMediaTime(liquid.created_at)}
                    </Text>
                </Box>

                <HStack flex={2} alignItems="flex-start" space="sm">
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
                    >
                        <Box
                            style={{
                                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                            }}
                        >
                            <ButtonIcon as={Eye} mr="$2" color="white" />
                        </Box>
                        <ButtonText color="white" minHeight={21} fontSize={14}>
                            View
                        </ButtonText>
                    </Button>
                </HStack>
            </HStack>
        </Box>
    );
};
