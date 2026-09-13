const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Use default cache configuration
// Metro will use its default caching mechanism

module.exports = config;
