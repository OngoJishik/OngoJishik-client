const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Enable require.context — REQUIRED for Expo Router v4 file-based routing.
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

// 2. Set EXPO_ROUTER_APP_ROOT to the relative path from expo-router/_ctx.js location.
//    expo-router/_ctx.js lives at node_modules/expo-router/_ctx.js, so from there
//    '../../apps/mobile/app' resolves to apps/mobile/app — the correct route directory.
//    Must be a RELATIVE path (not absolute) so Metro can statically analyze it at bundle time.
process.env.EXPO_ROUTER_APP_ROOT = '../../apps/mobile/app';

// 3. Watch all files within the monorepo workspace (preserve Expo defaults)
config.watchFolders = [workspaceRoot, ...(config.watchFolders ?? [])];

// 4. Let Metro look for modules in both the local node_modules and the monorepo root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 5. Force all workspace packages to use the app-level react / react-native
//    to prevent duplicate module instances in pnpm monorepos.
config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules', 'react'),
  'react-native': path.resolve(projectRoot, 'node_modules', 'react-native'),
  'react-native-svg': path.resolve(projectRoot, 'node_modules', 'react-native-svg'),
};

// 6. SVG transformer — .svg files become React Native SVG components
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

module.exports = config;
