const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    config.module.rules.push({
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'node_modules/sharedlib')],
    });
    config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
            rule.oneOf.unshift({
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('@svgr/webpack'),
                        options: {
                            inlineStyles: {
                                onlyMatchedOnce: false,
                            },
                            viewBox: false,
                            removeUnknownsAndDefaults: false,
                            convertColors: false,
                        },
                    },
                ],
            });
        }
    });

    return config;
};
