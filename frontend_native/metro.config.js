const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const extraNodeModules = {
    common: path.resolve(__dirname + '../../common'),
};

const watchFolders = [path.resolve(__dirname + '../../common')];

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    const { transformer, resolver } = config;

    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    };
    
    config.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...resolver.sourceExts, 'svg'],
        extraNodeModules,
    };

    config.watchFolders = [...(config.watchFolders || []), ...watchFolders];

    return withNativeWind(config, { input: './global.css' });
})();
