import {
    Box,
    Button,
    ButtonIcon,
    ButtonText,
    Heading,
    HStack,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import { Plus } from 'lucide-react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchBar from '../../components/SearchBar';
import AuthorSelector from './AuthorSelector';
import SortingSelector from './SortingSelector';

interface HeaderProps {
    protocolCount: number;
    navigation: NativeStackNavigationProp<any>;
    searchPrompt: string;
    setSearchPrompt: (text: string) => void;
    authorFilter: string;
    setAuthorFilter: (text: string) => void;
    authorList: string[];
    sortingStrategy: string;
    setSortingStrategy: (text: string) => void;
    onSort: (column: string) => void;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}

const Header = ({
    protocolCount,
    navigation,
    searchPrompt,
    setSearchPrompt,
    authorFilter,
    setAuthorFilter,
    authorList,
    sortingStrategy,
    setSortingStrategy,
    onSort,
    sortColumn,
    sortDirection,
}: HeaderProps) => {
    return (
        <VStack alignItems="flex-start" width="100%" space="lg" mt="$4">
            {/* Row with the search bar, sorting selectors and call to action button */}
            <HStack justifyContent="space-between" width="100%">
                <HStack>
                    <SearchBar
                        onChangeText={(e) => setSearchPrompt(e)}
                        value={searchPrompt}
                        minWidth={300}
                    />
                    <AuthorSelector
                        value={authorFilter}
                        onChange={(e) => setAuthorFilter(e)}
                        authors={authorList}
                    />
                    <SortingSelector
                        value={sortingStrategy}
                        onChange={(e) => setSortingStrategy(e)}
                    />
                </HStack>
                <Button
                    variant="outline"
                    rounded="$full"
                    borderColor="$black"
                    bg="#1F2832"
                    ml="$2"
                    onPress={() => navigation.navigate('Create protocol')}
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
                            mr="$1"
                        />
                    </Box>
                    <ButtonText color="white" fontSize={14}>
                        Create New Protocol
                    </ButtonText>
                </Button>
            </HStack>

            {/* List header with names for the item fields */}
            <HStack
                width="100%"
                p="$4"
                pb="$2"
                alignItems="center"
                justifyContent="space-between"
            >
                <Button
                    flex={1}
                    variant="link"
                    onPress={() => onSort('id')}
                    justifyContent="flex-start"
                    p="$0"
                >
                    <Text fontSize={14} color="#1F2832" opacity={0.5}>
                        # ID{' '}
                        {sortColumn === 'id' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                    </Text>
                </Button>
                <Button
                    flex={5}
                    variant="link"
                    onPress={() => onSort('name')}
                    justifyContent="flex-start"
                    p="$0"
                >
                    <Text fontSize={14} color="#1F2832" opacity={0.5}>
                        Protocol Name{' '}
                        {sortColumn === 'name' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                    </Text>
                </Button>
                <Button
                    flex={4}
                    variant="link"
                    onPress={() => onSort('author')}
                    justifyContent="flex-start"
                    p="$0"
                >
                    <Text fontSize={14} color="#1F2832" opacity={0.5}>
                        Author{' '}
                        {sortColumn === 'author' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                    </Text>
                </Button>
                <Button
                    flex={2}
                    variant="link"
                    onPress={() => onSort('created')}
                    justifyContent="center"
                    p="$0"
                >
                    <Text fontSize={14} color="#1F2832" opacity={0.5}>
                        Created{' '}
                        {sortColumn === 'created' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                    </Text>
                </Button>
                <Button
                    flex={3}
                    variant="link"
                    onPress={() => onSort('status')}
                    justifyContent="center"
                    p="$0"
                >
                    <Text fontSize={14} color="#1F2832" opacity={0.5}>
                        Status{' '}
                        {sortColumn === 'status' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                    </Text>
                </Button>
                <Box flex={1}></Box>
                <Box flex={2}></Box>
            </HStack>
        </VStack>
    );
};

export default Header;
