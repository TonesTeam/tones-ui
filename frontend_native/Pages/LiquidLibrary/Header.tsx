import { Box, Text, HStack } from '@gluestack-ui/themed';

const Header = (subpageName: string) => {
    return (
        <HStack alignItems="center" mt={16} mb="$8">
            <Text color="black" fontSize={24} fontFamily="Orbitron-Medium">
                Library
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

            <Text fontSize={24} fontFamily="Orbitron-Regular" color="#1F2832">
                {subpageName}
            </Text>
        </HStack>
    );
};

export default Header;
