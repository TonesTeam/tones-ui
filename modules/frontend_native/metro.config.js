const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const extraNodeModules = {
  sharedlib: path.resolve(__dirname + "../../sharedlib"),
};

const watchFolders = [path.resolve(__dirname + "../../sharedlib")];
//const watchFolders = [path.resolve(__dirname + "/../common")];

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    experimentalImportSupport: false,
    inlineRequires: false,
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg", "js", "json", "ts", "tsx"],
    extraNodeModules,
  };

  config.watchFolders = watchFolders;

  return config;
})();
