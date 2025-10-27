import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, ButtonIcon, ButtonText, Text } from '@gluestack-ui/themed';
import { Box } from '@gluestack-ui/themed';
import { Plus } from 'lucide-react-native';

interface EmptyListPlaceholderProps {
    navigation: NativeStackNavigationProp<any>;
}

const EmptyListPlaceholder = ({ navigation }: EmptyListPlaceholderProps) => {
    return (
        <Box
            width="100%"
            flexDirection="column"
            height="100%"
            alignItems="center"
            justifyContent="center"
            style={{ transform: [{ translateY: -50 }] }}
        >
            <Text>No protocols yet</Text>
            <Box
                style={{ borderStyle: 'dashed' }}
                borderColor="#8d8d8d"
                width="100%"
                borderWidth={2}
                mt="$4"
                p="$4"
                rounded="$2xl"
                alignItems="center"
                justifyContent="center"
            >
                <Button
                    variant="outline"
                    rounded="$full"
                    borderColor="$black"
                    ml="$2"
                    onPress={() => navigation.navigate('Create protocol')}
                    alignItems="center"
                    justifyContent="center"
                    height={48}
                >
                    <ButtonIcon color="black" as={Plus} mr="$1" />
                    <ButtonText color="black">Create new</ButtonText>
                </Button>
            </Box>
        </Box>
    );
};
export default EmptyListPlaceholder;
