const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'debug.keystore.shared');
const dest = path.join(__dirname, '..', 'android', 'app', 'debug.keystore');

if (fs.existsSync(src)) {
  if (fs.existsSync(path.dirname(dest))) {
    fs.copyFileSync(src, dest);
    console.log('[keystore] Successfully copied debug.keystore.shared to android/app/debug.keystore');
  } else {
    console.warn('[keystore] android/app directory does not exist yet. Keystore copy skipped.');
  }
} else {
  console.error('[keystore] Shared debug keystore not found at ' + src);
}
