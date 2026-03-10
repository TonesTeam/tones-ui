import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainContainer, globalElementStyle } from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import {
    Box,
    Text,
    HStack,
    ScrollView,
    Button,
    ButtonText,
    ButtonIcon,
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    VStack,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { Trash, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Method } from 'axios';
import ConfirmationModal from '../../components/ConfirmationModal';
import { makeRequest } from '../../common/util';
import { LiquidTypeDTO } from 'common/dto/liquid.dto';
import { Header } from 'Header';

const CategoryGrid = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(
        null,
    );
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const [newCategoryModal, setNewCategoryModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );

    const listInitilizer = () => {
        makeRequest('GET' as Method, '/liquids/types')
            .then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    setCategories(r.data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    useEffect(() => {
        listInitilizer();
    }, []);

    const deleteCategory = (id: number) => {
        makeRequest('DELETE' as Method, `/liquids/types/${id}`)
            .then((r) => {
                if (r.status >= 200 && r.status <= 299) {
                    listInitilizer();
                    setDeleteCategoryModal(false);
                    setCategoryToDelete(null);
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

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <Header subpageName="Select liquid category" />
                <>
                    <NewCategoryModal
                        open={newCategoryModal}
                        onClose={() => setNewCategoryModal(false)}
                        onSave={saveCategory}
                    />
                    <ConfirmationModal
                        isOpen={deleteCategoryModal}
                        onClose={() => {
                            setDeleteCategoryModal(false);
                            setCategoryToDelete(null);
                        }}
                        action={() => {
                            if (categoryToDelete) {
                                deleteCategory(categoryToDelete);
                            }
                        }}
                        headline="Delete Category"
                        text="Are you sure you want to delete this category? This action cannot be undone."
                        actionButtonText="Delete"
                    />
                    <Box width={900} mb="$10">
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            maxHeight={520}
                        >
                            <Box
                                mt="$2"
                                flexDirection="row"
                                flexWrap="wrap"
                                justifyContent="flex-start"
                                gap={70}
                            >
                                {categories.map((category, i) => (
                                    <Box
                                        key={i}
                                        position="relative"
                                        height={150}
                                        width={250}
                                    >
                                        <Button
                                            onPress={() =>
                                                setSelectedCategoryId(
                                                    category.id,
                                                )
                                            }
                                            rounded="$xl"
                                            bg="white"
                                            borderWidth={0}
                                            height={150}
                                            width="100%"
                                            alignItems="center"
                                            justifyContent="center"
                                            shadowColor="$borderLight100"
                                            shadowOffset={{
                                                width: 0,
                                                height: 1,
                                            }}
                                            shadowOpacity={0.05}
                                            shadowRadius={2}
                                        >
                                            <ButtonText
                                                color="$black"
                                                fontSize={16}
                                                textAlign="center"
                                            >
                                                {category.name}
                                            </ButtonText>
                                        </Button>
                                        <Button
                                            position="absolute"
                                            top={-8}
                                            right={-8}
                                            rounded="$full"
                                            bg="#626262"
                                            borderWidth={0}
                                            height={32}
                                            width={32}
                                            alignItems="center"
                                            justifyContent="center"
                                            px="$0"
                                            onPress={() => {
                                                setCategoryToDelete(
                                                    category.id,
                                                );
                                                setDeleteCategoryModal(true);
                                            }}
                                        >
                                            <ButtonIcon
                                                as={Trash}
                                                color="white"
                                            />
                                        </Button>
                                    </Box>
                                ))}
                                <Button
                                    onPress={() => setNewCategoryModal(true)}
                                    rounded="$xl"
                                    bg="transparent"
                                    height={150}
                                    width={250}
                                    alignItems="center"
                                    justifyContent="center"
                                    shadowColor="$borderLight100"
                                    shadowOffset={{ width: 0, height: 1 }}
                                    shadowOpacity={0.05}
                                    shadowRadius={2}
                                    borderStyle="dashed"
                                    borderColor="rgba(0, 0, 0, 0.3)"
                                    borderWidth={2}
                                >
                                    <ButtonIcon
                                        as={Plus}
                                        color="black"
                                        mr="$1"
                                    />
                                    <ButtonText fontSize={16} color="black">
                                        Category
                                    </ButtonText>
                                </Button>
                            </Box>
                        </ScrollView>
                    </Box>
                </>
            </Box>
        </MainContainer>
    );
};

const NewCategoryModal = ({
    open,
    onClose,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (categoryName: string) => void;
}) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSave = () => {
        if (categoryName.trim()) {
            onSave(categoryName);
            setCategoryName('');
        }
    };

    return (
        open && (
            <Modal isOpen={open} onClose={onClose}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={20} color="black">
                            New Category
                        </Text>
                    </ModalHeader>
                    <ModalBody>
                        <VStack space="md">
                            <Input>
                                <InputField
                                    placeholder="Category Name"
                                    value={categoryName}
                                    onChange={(e: any) =>
                                        setCategoryName(e.nativeEvent.text)
                                    }
                                />
                            </Input>
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

export default CategoryGrid;
