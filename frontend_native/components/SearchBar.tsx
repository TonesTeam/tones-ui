import {
    Input,
    InputField,
    InputIcon,
    Pressable,
    InputSlot,
} from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';
import { SearchIcon, X } from 'lucide-react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
    return (
        <Input
            style={{ flex: 8 }}
            variant="rounded"
            borderColor="transparent"
            bg="#f2f3f8"
            height={48}
            minWidth={350}
        >
            <InputSlot pl="$8">
                <InputIcon size="xl" as={SearchIcon} />
            </InputSlot>

            <InputField
                onChangeText={onChangeText}
                value={value}
                type="text"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search protocols"
            />
        </Input>
    );
};

export default SearchBar;
