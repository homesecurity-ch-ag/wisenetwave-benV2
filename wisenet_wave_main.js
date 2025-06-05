const { createSession } = require('./wisenet_wave_createsession');
const { systemInformation } = require('./wisenet_wave_systeminfo');
const { deleteSession } = require('./wisenet_wave_deletesession');
const fs = require('fs');
const { TOKEN_FILE } = require('./wisenet_wave_createsession');

function parseArgs() {
  const args = process.argv.slice(2);
  const cfg = { insecure: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--insecure') {
      cfg.insecure = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[++i];
      cfg[key] = value;
    }
  }
  return cfg;
}

async function main() {
  const cfg = parseArgs();
  const { baseUrl, username, password, insecure } = cfg;
  if (!baseUrl || !username || !password) {
    console.error('Usage: node wisenet_wave_main.js --base-url <URL> --username <USER> --password <PASS> [--insecure]');
    process.exit(1);
  }

  const token = await createSession(baseUrl, username, password, insecure);
  console.log('Session token:', token);

  const info = await systemInformation(baseUrl, token, insecure);
  console.log('System information:', JSON.stringify(info, null, 2));

  await deleteSession(baseUrl, token, insecure);
  if (!fs.existsSync(TOKEN_FILE)) {
    console.log('Session closed');
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
