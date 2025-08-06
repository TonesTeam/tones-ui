import { View } from 'react-native';
import { Text } from '@gluestack-ui/themed';

const GeneratedAvatar = ({
    name,
    size = 100,
}: {
    name: string;
    size?: number;
}) => {
    const backgroundColor = hashStringToColor(name);
    const initial = firstLetter(name);

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text style={{ fontSize: size / 2 }}>{initial}</Text>
        </View>
    );
};

const firstLetter = (name: string) => {
    return name?.charAt(0).toUpperCase() || '?';
};

const hashStringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 60%)`;
    return color;
};

export default GeneratedAvatar;
