const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

config.resolver.alias = {
  '@': './app'
};

module.exports = withNativeWind(config, { input: './global.css' })