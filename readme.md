# Wisenet Wave API Example

Dieses Repository enthaelt mehrere Node.js-Skripte, die die REST API von Wisenet Wave nutzen. Es werden keine Python-Abhaengigkeiten mehr benoetigt. Der Session-Token wird temporaer in `session_token.tmp` gespeichert und nach dem Logout wieder geloescht.

## Voraussetzungen

- Node.js
- Abhaengigkeit `axios` (wird ueber `npm install` installiert)

## Installation

```bash
npm install
```

## Nutzung

Einzelschritte:

```bash
node wisenet_wave_createsession.js --base-url https://<SERVER> --username <USER> --password <PASS>
node wisenet_wave_systeminfo.js --base-url https://<SERVER>
node wisenet_wave_deletesession.js --base-url https://<SERVER>
```

Alle Schritte in einem Durchlauf:

```bash
node wisenet_wave_main.js --base-url https://<SERVER> --username <USER> --password <PASS>
```

Optional kann `--insecure` angegeben werden, um die Zertifikatspruefung zu deaktivieren.
