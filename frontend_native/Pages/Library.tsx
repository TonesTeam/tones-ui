import { MainContainer, globalElementStyle } from '../constants/styles';
import NavBar from '../navigation/NavBar';
import { useEffect, useState } from 'react';
import {
    LiquidDTO,
    LiquidTypeDTO,
    PermanentLiquidDTO,
} from 'common/dto/liquid.dto';
import { getRequest, makeRequest } from '../common/util';
import { CustomSelect } from '../components/Select';
import { Method } from 'axios';
import { useIsFocused } from '@react-navigation/native';
import {
    Box,
    Heading,
    Icon,
    Text,
    Spinner,
    ScrollView,
    Button,
    ButtonText,
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    VStack,
    HStack,
    Input,
    InputField,
    Switch,
    ButtonIcon,
} from '@gluestack-ui/themed';
import { Trash, Pencil, CirclePlus, Save, Plus } from 'lucide-react-native';
import ConfirmationModal from '../components/ConfirmationModal';
import SearchBar from '../components/SearchBar';

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
                            <Box
                                borderWidth="$1"
                                borderColor="$borderLight200"
                                rounded="$lg"
                                overflow="hidden"
                                mt="$5"
                                mb="$6"
                            >
                                {/* Table Header */}
                                <HStack
                                    bg="$backgroundLight100"
                                    p="$3"
                                    borderBottomWidth="$1"
                                    borderColor="$borderLight200"
                                >
                                    <Box flex={3}>
                                        <Text
                                            fontWeight="$semibold"
                                            size="sm"
                                            color="$textLight600"
                                        >
                                            Reagent Name
                                        </Text>
                                    </Box>
                                    <Box flex={2}>
                                        <Text
                                            fontWeight="$semibold"
                                            size="sm"
                                            color="$textLight600"
                                        >
                                            Connection Type
                                        </Text>
                                    </Box>
                                    <Box flex={2}>
                                        <Text
                                            fontWeight="$semibold"
                                            size="sm"
                                            color="$textLight600"
                                        >
                                            Position
                                        </Text>
                                    </Box>
                                    <Box flex={1}>
                                        <Text
                                            fontWeight="$semibold"
                                            size="sm"
                                            color="$textLight600"
                                        >
                                            Category
                                        </Text>
                                    </Box>
                                    <Box flex={2}>
                                        <Text
                                            fontWeight="$semibold"
                                            size="sm"
                                            color="$textLight600"
                                        >
                                            Actions
                                        </Text>
                                    </Box>
                                </HStack>

                                {/* Table Rows */}
                                <ScrollView style={{ maxHeight: 400 }}>
                                    {filterAndSort().map((liq, index) => {
                                        const isOdd = index % 2 === 1;
                                        return (
                                            <HStack
                                                key={index}
                                                p="$3"
                                                bg={
                                                    isOdd
                                                        ? '$backgroundLight50'
                                                        : 'transparent'
                                                }
                                                borderBottomWidth={
                                                    index <
                                                    filterAndSort().length - 1
                                                        ? '$1'
                                                        : '$0'
                                                }
                                                borderColor="$borderLight100"
                                            >
                                                <Box
                                                    flex={3}
                                                    justifyContent="center"
                                                >
                                                    <Text
                                                        size="sm"
                                                        color="$textLight900"
                                                        fontWeight="$medium"
                                                    >
                                                        {liq.name}
                                                    </Text>
                                                </Box>
                                                <Box
                                                    flex={2}
                                                    justifyContent="center"
                                                >
                                                    <Text
                                                        size="sm"
                                                        color="$textLight900"
                                                        fontWeight="$medium"
                                                    >
                                                        {liq.is_connected_to_selector
                                                            ? 'Selector'
                                                            : 'Grid'}
                                                    </Text>
                                                </Box>
                                                <Box
                                                    flex={2}
                                                    justifyContent="center"
                                                >
                                                    <Text
                                                        size="sm"
                                                        color="$textLight700"
                                                    >
                                                        {liq.position}
                                                    </Text>
                                                </Box>
                                                <Box
                                                    flex={1}
                                                    justifyContent="center"
                                                >
                                                    <Text
                                                        size="sm"
                                                        color="$textLight700"
                                                    >
                                                        {liq.liquid_type_name}
                                                    </Text>
                                                </Box>
                                                <Box flex={2}>
                                                    <HStack space="lg">
                                                        <Button
                                                            size="xs"
                                                            variant="link"
                                                            onPress={() => {
                                                                setEditedLiquid(
                                                                    liq,
                                                                );
                                                                setEditModal(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Icon
                                                                as={Pencil}
                                                                color="$primary500"
                                                                size="xs"
                                                                mr="$1"
                                                            />
                                                            <ButtonText
                                                                color="$primary500"
                                                                size="xs"
                                                            >
                                                                Edit
                                                            </ButtonText>
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="link"
                                                            onPress={() =>
                                                                setDeleteModal(
                                                                    liq.id,
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                as={Trash}
                                                                color="$error500"
                                                                size="xs"
                                                                mr="$1"
                                                            />
                                                            <ButtonText
                                                                color="$error500"
                                                                size="xs"
                                                            >
                                                                Delete
                                                            </ButtonText>
                                                        </Button>
                                                    </HStack>
                                                </Box>
                                            </HStack>
                                        );
                                    })}
                                </ScrollView>
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <SaveLiquidModal
                            isOpen={editModal}
                            liquid={editedLiquid}
                            categories={categories}
                            closeModal={() => {
                                setEditedLiquid(null);
                                setEditModal(false);
                            }}
                            saveLiquid={(liq) => saveOrUpdateLiquid(liq)}
                        />
                    </Box>
                </>
            )}
            <ConfirmationModal
                isOpen={deleteModal != -1}
                onClose={() => setDeleteModal(-1)}
                action={() => deleteLiquid(deleteModal)}
                icon={Trash}
                headline={`Delete reagent "${idToName(deleteModal)}"`}
                text="Are you sure you want to delete this reagent? This action cannot be undone."
                actionButtonText="Delete"
                type="error"
            />
        </>
    );
};

function SaveLiquidModal(props: {
    liquid: PermanentLiquidDTO | null;
    categories: LiquidTypeDTO[];
    closeModal: () => void;
    saveLiquid: (liq: PermanentLiquidDTO) => void;
    isOpen: boolean;
}) {
    const [newLiquid, setNewLiquid] = useState<PermanentLiquidDTO>({
        id: 0,
        name: '',
        type: props.categories[0],
        usedCold: false,
        toxic: false,
        position: -1,
    } as PermanentLiquidDTO);
    const [positionText, setPositionText] = useState('0');

    useEffect(() => {
        if (props.liquid) setNewLiquid(props.liquid);
        else
            setNewLiquid({
                id: 0,
                name: '',
                type: props.categories[0],
                usedCold: false,
                toxic: false,
                position: -1,
            } as PermanentLiquidDTO);
    }, [props.liquid]);

    const areInputsValid = (): boolean => {
        const isPositionValid = !isNaN(Number(positionText));
        const isNameValid = newLiquid.name.trim() !== '';

        return isPositionValid && isNameValid;
    };

    return (
        <Modal onClose={props.closeModal} isOpen={props.isOpen} size="lg">
            <ModalBackdrop />
            <ModalContent padding="$3">
                <ModalHeader>
                    <Heading size="xl" color="$textLight900">
                        {props.liquid != null
                            ? 'Updating reagent data'
                            : 'Adding new reagent'}
                    </Heading>
                </ModalHeader>
                <ModalBody padding="$6">
                    <VStack>
                        <Text>Name:</Text>
                        <Input variant="outline">
                            <InputField
                                value={newLiquid.name}
                                onChangeText={(text: string) =>
                                    setNewLiquid({
                                        ...newLiquid,
                                        name: text,
                                    })
                                }
                            />
                        </Input>
                    </VStack>
                    <HStack>
                        <VStack flex={3} mr="$3">
                            <Text>Category:</Text>
                            <CustomSelect
                                list={props.categories}
                                selected={newLiquid.type}
                                canAdd={false}
                                onChangeSelect={(cat) =>
                                    setNewLiquid({
                                        ...newLiquid,
                                        type: cat,
                                    })
                                }
                            />
                        </VStack>
                        <VStack flex={1}>
                            <Text>Selector position:</Text>
                            <Input variant="outline">
                                <InputField
                                    value={positionText}
                                    inputMode="numeric"
                                    onChangeText={(text: string) => {
                                        setPositionText(text);
                                    }}
                                />
                            </Input>
                        </VStack>
                    </HStack>
                    <VStack>
                        <HStack space="md" alignItems="center">
                            <Text size="lg">Toxic:</Text>
                            <Switch
                                size="lg"
                                value={newLiquid.toxic}
                                onValueChange={(val: boolean) => {
                                    setNewLiquid({
                                        ...newLiquid,
                                        toxic: val,
                                    });
                                }}
                            />
                        </HStack>
                        <HStack space="md" alignItems="center">
                            <Text size="lg">Used cold:</Text>
                            <Switch
                                size="lg"
                                value={newLiquid.usedCold}
                                onValueChange={(val: boolean) => {
                                    setNewLiquid({
                                        ...newLiquid,
                                        usedCold: val,
                                    });
                                }}
                            />
                        </HStack>
                    </VStack>
                </ModalBody>
                <ModalFooter borderTopWidth="$1" borderColor="$borderLight200">
                    <HStack space="md" flex={1} justifyContent="flex-end">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={props.closeModal}
                            size="md"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            bg="$black"
                            size="md"
                            onPress={() => {
                                if (areInputsValid()) {
                                    newLiquid.position = Number(positionText);
                                    newLiquid.name = newLiquid.name.trim();
                                    props.saveLiquid(newLiquid);
                                    props.closeModal();
                                }
                            }}
                            isDisabled={!areInputsValid()}
                        >
                            <Icon color="white" as={Save} mr="$2" />
                            <ButtonText>
                                {props.liquid != null ? 'Update' : 'Save'}
                            </ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
