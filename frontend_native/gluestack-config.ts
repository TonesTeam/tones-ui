import { config as defaultConfig } from '@gluestack-ui/config';

const customConfig = {
    ...defaultConfig,
    tokens: {
        ...defaultConfig.tokens,
        fonts: {
            ...defaultConfig.tokens.fonts,
            body: 'Manrope-Medium',
            heading: 'Manrope-Medium',
        },
    },
};

export { customConfig as config };
