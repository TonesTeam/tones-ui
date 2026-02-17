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
import { ArrowDownWideNarrow } from 'lucide-react-native';

interface SortingSelectorProps {
    value: string;
    onChange: (text: string) => void;
}

const SortingSelector = ({ value, onChange }: SortingSelectorProps) => {
    return (
        <Select
            flex={3}
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
                <SelectIcon ml="$3" as={ArrowDownWideNarrow} />
                <SelectInput placeholder="Oldest first" />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent maxHeight={300}>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem value="Oldest first" label="Oldest first" />
                    <SelectItem value="Newest first" label="Newest first" />
                    <SelectItem value="Last updated" label="Last updated" />
                </SelectContent>
            </SelectPortal>
        </Select>
    );
};

export default SortingSelector;
