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
    const styles = StyleSheet.create({
        search_bar: {
            paddingLeft: 10,
        },
        clear_button: {
            paddingRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
        },
    });

    return (
        <Input
            style={{ flex: 8 }}
            minWidth={200}
            variant="rounded"
            borderColor="$borderLight400"
        >
            <InputSlot style={styles.search_bar}>
                <InputIcon as={SearchIcon} />
            </InputSlot>

            <InputField
                onChangeText={onChangeText}
                value={value}
                type="text"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search protocols"
            />

            {value.length > 0 && (
                <Pressable
                    style={styles.clear_button}
                    onPress={() => onChangeText('')}
                >
                    <InputSlot>
                        <InputIcon color="#ef4444" as={X} />
                    </InputSlot>
                </Pressable>
            )}
        </Input>
    );
};

export default SearchBar;
