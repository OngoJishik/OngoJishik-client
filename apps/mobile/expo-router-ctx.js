// Custom expo-router/_ctx override for monorepo builds.
// require.context() path must be a STATIC string literal — environment variables
// are NOT inlined by Metro at bundle time, causing "No modules in context" at runtime.
// This file replaces expo-router/_ctx via Metro resolver to hardcode the path.
export const ctx = require.context(
  './app',
  true,
  // Ignore root `./+html.js` and API route files `./generate+api.tsx`
  /^(?:\.\/)(?!(?:(?:(?:.*\+api)|(?:\+html)))\.[tj]sx?$).*\.[tj]sx?$/
);
