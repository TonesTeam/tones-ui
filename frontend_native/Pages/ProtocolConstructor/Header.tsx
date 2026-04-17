import {
    Box,
    HStack,
    Text,
    Pressable,
    Icon,
    Button,
    ButtonText,
    Input,
    InputField,
    InputIcon,
} from '@gluestack-ui/themed';
import { ArrowLeft, Pencil } from 'lucide-react-native';

interface HeaderProps {
    navigation: any;
    name: string;
    setName: (name: string) => void;
    saveProtocol: () => void;
    editingMode: boolean;
    onSaveClick?: () => void;
}

const Header = ({
    navigation,
    name,
    setName,
    saveProtocol,
    editingMode,
    onSaveClick,
}: HeaderProps) => {
    return (
        <HStack mt={16}>
            <HStack alignItems="center">
                <Pressable
                    onPress={() => {
                        navigation.goBack();
                    }}
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
                    fontSize={24}
                    color="#1F2832"
                    fontFamily="Orbitron-Medium"
                >
                    {editingMode ? 'Editing' : 'New'} protocol
                </Text>

                {/* Divider */}
                <Box
                    ml={21}
                    mr={21}
                    minHeight={30}
                    minWidth={1}
                    bg="black"
                    opacity={0.2}
                />

                {/* Input for protocol name */}
                <Input
                    borderWidth={0}
                    width={300}
                    bg="transparent"
                    p={0}
                    alignItems="center"
                >
                    <InputIcon as={Pencil} color="#313131" size="md" />
                    <InputField
                        placeholder="Protocol name"
                        value={name}
                        onChange={(e: any) => setName(e.nativeEvent.text)}
                        fontSize={24}
                        fontFamily="Orbitron-Regular"
                        color="#1F2832"
                    />
                </Input>
            </HStack>
            <Button
                width={97}
                height={48}
                bg="#1F2832"
                alignSelf="center"
                ml="auto"
                onPress={() => {}}
                borderRadius={999}
            >
                <ButtonText
                    fontSize={14}
                    color="white"
                    onPress={() => {
                        onSaveClick ? onSaveClick() : saveProtocol();
                    }}
                >
                    Save
                </ButtonText>
            </Button>
        </HStack>
    );
};

export default Header;
