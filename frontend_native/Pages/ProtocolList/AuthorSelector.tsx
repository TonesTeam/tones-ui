import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '../../components/ui/select';
import { ListFilter } from 'lucide-react-native';

interface AuthorSelectorProps {
    value: string;
    onChange: (text: string) => void;
    authors: string[];
}

const AuthorSelector = ({ value, onChange, authors }: AuthorSelectorProps) => {
    return (
        <Select
            flex={2}
            minWidth={170}
            ml="$1"
            onValueChange={onChange}
            selectedValue={value}
        >
            <SelectTrigger
                height={48}
                variant="rounded"
                borderColor="$borderLight400"
            >
                <SelectIcon ml="$3" as={ListFilter} />
                <SelectInput placeholder="Author" />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent maxHeight={300}>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem value="All authors" label="All Authors" />
                    {authors.map((author) => (
                        <SelectItem
                            key={author}
                            value={author}
                            label={author}
                        />
                    ))}
                </SelectContent>
            </SelectPortal>
        </Select>
    );
};

export default AuthorSelector;
