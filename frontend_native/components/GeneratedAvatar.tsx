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

// TODO: Currently the hash only depends on the name
// so the results might be a little to predictable
// and simple. Potentially this could also take
// into account the user's other static info like
// when the profile was created. Note that the user
// role could change so it would be odd to use a
// different color after a role change.
const hashStringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 60%)`;
    return color;
};

export default GeneratedAvatar;
