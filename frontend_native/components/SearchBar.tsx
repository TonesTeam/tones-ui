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
    placeholder?: string;
    minWidth?: number;
}

const SearchBar = ({
    value,
    onChangeText,
    placeholder,
    minWidth,
}: SearchBarProps) => {
    return (
        <Input
            style={{ flex: 8 }}
            variant="rounded"
            borderColor="transparent"
            bg="#ffffff"
            height={48}
            minWidth={minWidth ?? 350}
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
                fontFamily="Manrope-Light"
                fontSize={14}
                color="#00000080"
                placeholder={placeholder || 'Search protocols...'}
            />
        </Input>
    );
};

export default SearchBar;
