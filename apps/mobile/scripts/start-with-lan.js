/**
 * Forces Expo to advertise the PC's LAN IP (Windows often falls back to 127.0.0.1).
 * Usage: node scripts/start-with-lan.js [--tunnel] [--clear]
 */
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

function lanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return '127.0.0.1';
}

const ip = lanIp();
const tunnel = process.argv.includes('--tunnel');
const clear = process.argv.includes('--clear');
const expoCli = path.join(__dirname, '..', 'node_modules', 'expo', 'bin', 'cli');

const args = ['start', '--lan', ...(tunnel ? ['--tunnel'] : []), ...(clear ? ['--clear'] : [])];

console.log('\n══════════════════════════════════════════');
console.log('  SKYVORA — open on your phone');
console.log('══════════════════════════════════════════');
if (tunnel) {
  console.log('  Tunnel mode: scan the QR code below in Expo Go.');
  console.log('  (Works even if phone and PC are on different networks.)');
} else {
  console.log(`  Option A — Phone browser (easiest, same Wi‑Fi):`);
  console.log(`    → http://${ip}:8081`);
  console.log(`  Option B — Expo Go manual URL (same Wi‑Fi):`);
  console.log(`    → exp://${ip}:8081`);
  console.log(`  Option C — Android USB: run "npm run start:usb"`);
}
console.log('══════════════════════════════════════════\n');

const child = spawn(process.execPath, [expoCli, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: ip,
    EXPO_DEVTOOLS_LISTEN_ADDRESS: '0.0.0.0',
  },
});

child.on('exit', (code) => process.exit(code ?? 0));
