/**
 * Android USB: forwards phone port 8081 → PC so Expo Go can use exp://127.0.0.1:8081
 */
const { spawnSync } = require('child_process');

const r = spawnSync('adb', ['reverse', 'tcp:8081', 'tcp:8081'], { encoding: 'utf8' });
if (r.status !== 0) {
  console.error('adb reverse failed. Install Android platform-tools and connect your phone via USB with USB debugging on.');
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
console.log('✓ adb reverse tcp:8081 tcp:8081 — in Expo Go enter: exp://127.0.0.1:8081');
