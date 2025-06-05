const fs = require('fs');
const https = require('https');
const axios = require('axios');
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

function getAgent(insecure) {
  return new https.Agent({ rejectUnauthorized: !insecure });
}

async function systemInformation(baseUrl, token, insecure) {
  const response = await axios.get(
    `${baseUrl.replace(/\/$/, '')}/api/system/info`,
    {
      httpsAgent: getAgent(insecure),
      headers: { Cookie: `session=${token}` }
    }
  );
  return response.data;
}

if (require.main === module) {
  const cfg = parseArgs();
  const { baseUrl, insecure } = cfg;
  if (!baseUrl) {
    console.error('Usage: node wisenet_wave_systeminfo.js --base-url <URL> [--insecure]');
    process.exit(1);
  }
  if (!fs.existsSync(TOKEN_FILE)) {
    console.error('Token file not found. Please create a session first.');
    process.exit(1);
  }
  const token = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  systemInformation(baseUrl, token, insecure)
    .then(info => {
      console.log('System information:', JSON.stringify(info, null, 2));
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { systemInformation };
