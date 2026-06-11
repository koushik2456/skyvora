const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prefer CJS builds so packages like zustand/middleware don't ship bare
// `import.meta` into the web bundle (causes a white screen in the browser).
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
