const fs = require('fs');
const https = require('https');
const axios = require('axios');

const TOKEN_FILE = 'session_token.tmp';

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

async function createSession(baseUrl, username, password, insecure) {
  const response = await axios.post(
    `${baseUrl.replace(/\/$/, '')}/api/login`,
    { username, password },
    { httpsAgent: getAgent(insecure) }
  );
  const data = response.data;
  const token = data.sessionId || data.token;
  if (token) {
    fs.writeFileSync(TOKEN_FILE, token);
  }
  return token;
}

if (require.main === module) {
  const cfg = parseArgs();
  const { baseUrl, username, password, insecure } = cfg;
  if (!baseUrl || !username || !password) {
    console.error('Usage: node wisenet_wave_createsession.js --base-url <URL> --username <USER> --password <PASS> [--insecure]');
    process.exit(1);
  }
  createSession(baseUrl, username, password, insecure)
    .then(token => {
      console.log('Token:', token);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { createSession, TOKEN_FILE };
