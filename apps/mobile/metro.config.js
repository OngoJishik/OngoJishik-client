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

// 2. No manual EXPO_ROUTER_APP_ROOT needed.
//    babel-preset-expo computes this from caller.routerRoot + caller.projectRoot (set by Expo CLI).
//    build.gradle root = file("../../") → project root = apps/mobile → routerRoot resolves to apps/mobile/app correctly.

// 3. Watch all files within the monorepo workspace (preserve Expo defaults)
config.watchFolders = [workspaceRoot, ...(config.watchFolders ?? [])];

// 4. Let Metro look for modules in both the local node_modules and the monorepo root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 5. Force all workspace packages to resolve a single copy of react / react-native
//    to prevent duplicate module instances in pnpm monorepos. With node-linker=hoisted
//    and unified dependency versions, these packages live only in the workspace root
//    node_modules (no local apps/mobile copy), so point there rather than at
//    apps/mobile/node_modules, which would resolve to a nonexistent path.
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules', 'react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules', 'react-native'),
  'react-native-svg': path.resolve(workspaceRoot, 'node_modules', 'react-native-svg'),
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
