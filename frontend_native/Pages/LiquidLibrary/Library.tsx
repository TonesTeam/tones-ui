import { MainContainer, globalElementStyle } from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import { useEffect, useState } from 'react';
import {
    LiquidDTO,
    LiquidTypeDTO,
    PermanentLiquidDTO,
} from 'common/dto/liquid.dto';
import {
    formatSocialMediaTime,
    getRequest,
    makeRequest,
} from '../../common/util';
import { CustomSelect } from '../../components/Select';
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
    Select,
    SelectTrigger,
    SelectBackdrop,
    SelectDragIndicator,
    Pressable,
} from '@gluestack-ui/themed';
import {
    Trash,
    Pencil,
    CirclePlus,
    Save,
    Plus,
    Eye,
    ChevronDown,
    X,
    ArrowLeft,
} from 'lucide-react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import SearchBar from '../../components/SearchBar';
import GeneratedAvatar from '../../components/GeneratedAvatar';
import { SelectInput } from '@gluestack-ui/themed';
import { SelectIcon } from '@gluestack-ui/themed';
import { SelectPortal } from '@gluestack-ui/themed';
import { SelectContent } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';
import { SelectItem } from '@gluestack-ui/themed';

export default function Library({
    route,
    navigation,
}: NativeStackScreenProps<any>) {
    const selectedCategoryId = route.params?.categoryId || null;

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <HStack alignItems="center" mb="$8" mt={16}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        alignItems="flex-start"
                        justifyContent="center"
                        pr="$3"
                    >
                        <Icon
                            as={ArrowLeft}
                            width={20}
                            height={15}
                            color="#1F2832"
                        />
                    </Pressable>
                    <Text
                        color="black"
                        fontSize={32}
                        fontFamily="Orbitron-Medium"
                    >
                        Library
                    </Text>
                </HStack>
                <LibraryBody selectedCategoryId={selectedCategoryId} />
            </Box>
        </MainContainer>
    );
}

const LibraryBody = ({
    selectedCategoryId,
}: {
    selectedCategoryId: number | null;
}) => {
    const [liquids, setLiquids] = useState<PermanentLiquidDTO[]>([]);
    const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
    const [searchPrompt, setSearchPrompt] = useState('');
    const [newLiquidModal, setNewLiquidModal] = useState(false);
    const [newCategoryModal, setNewCategoryModal] = useState(false);
    const [viewLiquidModal, setViewLiquidModal] = useState(false);
    const [selectedLiquid, setSelectedLiquid] = useState(-1);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(
        null,
    );
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            listInitilizer();
        } else {
            setLiquids([]);
        }
    }, [isFocused]);

    const listInitilizer = () => {
        getRequest<PermanentLiquidDTO[]>('/liquids').then((r) => {
            setLiquids(r.data);
        });

        getRequest<LiquidTypeDTO[]>('/liquids/types').then((r) => {
            setCategories(r.data);
        });
    };

    useEffect(listInitilizer, []);

    const deleteLiquid = (id: number) => {
        setViewLiquidModal(false);
        makeRequest('DELETE' as Method, `/liquids/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    listInitilizer();
                } else {
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const saveCategory = (categoryName: string) => {
        const json = JSON.stringify({
            name: categoryName,
        });

        makeRequest('POST' as Method, '/liquids/types', json)
            .then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    listInitilizer();
                    setNewCategoryModal(false);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const saveLiquid = (liq: PermanentLiquidDTO) => {
        const json = JSON.stringify({
            name: liq.name,
            description: liq.description,
            default_incubation_time: liq.default_incubation_time,
            default_target_temperature: liq.default_incubation_temperature,
            position: liq.position,
            is_connected_to_selector: liq.is_connected_to_selector ? 1 : 0,
            liquid_type_id: liq.liquid_type_id,
            creator_id: 1,
        });
        console.log(json);

        makeRequest('POST' as Method, '/liquids', json).then((r) => {
            console.log(r.data);
            if (r.status >= 200 && r.status <= 299) {
                setNewLiquidModal(false);
                listInitilizer();
            }
        });
    };

    function filterAndSort() {
        if (liquids) {
            let filteredList = liquids
                .filter((e) =>
                    selectedCategoryId
                        ? e.liquid_type_id === selectedCategoryId
                        : true,
                )
                .filter((e) =>
                    searchPrompt === ''
                        ? e
                        : e.name
                              .toLowerCase()
                              .includes(searchPrompt.toLowerCase()),
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
            <NewLiquidModal
                open={newLiquidModal}
                categories={categories}
                onClose={() => setNewLiquidModal(false)}
                onSave={saveLiquid}
            />
            <ViewLiquidModal
                open={viewLiquidModal}
                liquid={liquids.filter((e) => e.id == selectedLiquid)[0]}
                onClose={() => setViewLiquidModal(false)}
                onDelete={deleteLiquid}
            />
            <Box width={900}>
                <HStack space="xl" alignItems="center" mb="$4">
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
                        onPress={() => setNewLiquidModal(true)}
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
                            <Text color="$textLight500" textAlign="center">
                                No reagents found! Try adjusting your search or
                                add a new reagent.
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
                                    Category
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
                        <ScrollView maxHeight={500}>
                            {filterAndSort().map((liquid, i) => {
                                return (
                                    <ListItem
                                        liquid={liquid}
                                        key={i}
                                        onView={(id) => {
                                            setSelectedLiquid(id);
                                            console.log(id);
                                            setViewLiquidModal(true);
                                        }}
                                    />
                                );
                            })}
                        </ScrollView>
                    </Box>
                )}
            </Box>
        </>
    );
};

type ListItemProps = {
    liquid: PermanentLiquidDTO;
    key?: number;
    onView?: (id: number) => void;
};

const ListItem = ({ liquid, onView }: ListItemProps) => {
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
                        onPress={() => {
                            onView?.(liquid.id);
                        }}
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

const NewLiquidModal = ({
    open,
    categories,
    onClose,
    onSave,
}: {
    open: boolean;
    categories: LiquidTypeDTO[];
    onClose: () => void;
    onSave: (liq: PermanentLiquidDTO) => void;
}) => {
    const [name, setName] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState(
        categories[0]?.id || 0,
    );
    const [selectedTypeName, setSelectedTypeName] = useState(
        categories[0]?.name || '',
    );
    const [description, setDescription] = useState('');
    const [defaultIncubationTime, setDefaultIncubationTime] = useState(0);
    const [defaultTargetTemperature, setDefaultTargetTemperature] = useState(0);
    const [position, setPosition] = useState(0);
    const [connectionType, setConnectionType] = useState('Selector');

    const handleSave = () => {
        const newLiquid: PermanentLiquidDTO = {
            id: 0, // backend will assign ID
            name,
            description,
            default_incubation_time: defaultIncubationTime,
            default_incubation_temperature: defaultTargetTemperature,
            position,
            is_connected_to_selector: connectionType == 'Selector',
            liquid_type_name: selectedTypeName,
            liquid_type_id: selectedTypeId,
            created_at: 0,
            type: {
                id: selectedTypeId,
                name: selectedTypeName,
            },
        };
        onSave(newLiquid);
        onClose();
    };

    return (
        open && (
            <Modal isOpen={open} onClose={onClose}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={20} color="black">
                            New Liquid
                        </Text>
                    </ModalHeader>
                    <ModalBody>
                        <VStack space="md">
                            <Input>
                                <InputField
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e: any) =>
                                        setName(e.nativeEvent.text)
                                    }
                                />
                            </Input>
                            <Input>
                                <InputField
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e: any) =>
                                        setDescription(e.nativeEvent.text)
                                    }
                                />
                            </Input>
                            <Input>
                                <InputField
                                    placeholder="Default Incubation Time (s)"
                                    value={
                                        defaultIncubationTime
                                            ? defaultIncubationTime.toString()
                                            : ''
                                    }
                                    onChange={(e: any) =>
                                        setDefaultIncubationTime(
                                            parseInt(e.nativeEvent.text) || 0,
                                        )
                                    }
                                    keyboardType="numeric"
                                />
                            </Input>
                            <Input>
                                <InputField
                                    placeholder="Default Target Temperature (°C)"
                                    value={
                                        defaultTargetTemperature
                                            ? defaultTargetTemperature.toString()
                                            : ''
                                    }
                                    onChange={(e: any) =>
                                        setDefaultTargetTemperature(
                                            parseInt(e.nativeEvent.text) || 0,
                                        )
                                    }
                                    keyboardType="numeric"
                                />
                            </Input>
                            <Input>
                                <InputField
                                    placeholder="Position"
                                    value={position ? position.toString() : ''}
                                    onChange={(e: any) =>
                                        setPosition(
                                            parseInt(e.nativeEvent.text) || 0,
                                        )
                                    }
                                    keyboardType="numeric"
                                />
                            </Input>
                            <Select onValueChange={(e) => setConnectionType(e)}>
                                <SelectTrigger>
                                    <SelectInput
                                        placeholder="Select connection type"
                                        value={connectionType}
                                    />
                                    <SelectIcon as={ChevronDown} />
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            <SelectItem
                                                label="Selector"
                                                value="Selector"
                                            />
                                            <SelectItem
                                                label="Grid"
                                                value="Grid"
                                            />
                                        </SelectContent>
                                    </SelectPortal>
                                </SelectTrigger>
                            </Select>
                            <Select
                                onValueChange={(e) => {
                                    const selected = categories.find(
                                        (cat) => cat.id === parseInt(e),
                                    );
                                    if (selected) {
                                        setSelectedTypeId(selected.id);
                                        setSelectedTypeName(selected.name);
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectInput
                                        placeholder="Select liquid type/category"
                                        value={selectedTypeName}
                                    />
                                    <SelectIcon as={ChevronDown} />
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            {categories.map((cat, i) => (
                                                <SelectItem
                                                    label={cat.name}
                                                    value={cat.id.toString()}
                                                    key={i}
                                                />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </SelectTrigger>
                            </Select>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onPress={onClose} mr="$2">
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button onPress={handleSave}>
                            <ButtonText>Save</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    );
};

const ViewLiquidModal = ({
    open,
    liquid,
    onClose,
    onDelete,
}: {
    open: boolean;
    liquid: PermanentLiquidDTO;
    onClose: () => void;
    onDelete: (id: number) => void;
}) => {
    return (
        open && (
            <Modal isOpen={open} onClose={onClose}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={20} color="black">
                            {liquid.name}
                        </Text>
                    </ModalHeader>
                    <ModalBody>
                        <VStack space="md">
                            <Text color="$black">{liquid.description}</Text>
                            <Text color="$black">
                                Default Incubation Time:{' '}
                                {liquid.default_incubation_time} s
                            </Text>
                            <Text color="$black">
                                Default Target Temperature:{' '}
                                {liquid.default_incubation_temperature} °C
                            </Text>
                            <Text color="$black">
                                Position: {liquid.position}
                            </Text>
                            <Text color="$black">
                                Connection Type:{' '}
                                {liquid.is_connected_to_selector
                                    ? 'Selector'
                                    : 'Grid'}
                            </Text>
                            <Text color="$black">
                                Liquid Type: {liquid.liquid_type_name}
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            onPress={() => onDelete(liquid.id)}
                            mr="$2"
                        >
                            <ButtonText>Delete</ButtonText>
                        </Button>
                        <Button onPress={onClose}>
                            <ButtonText>Close</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    );
};
