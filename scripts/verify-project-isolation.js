#!/usr/bin/env node

const http = require('http');
const https = require('https');

const baseUrl = process.env.MH_BASE_URL || `http://127.0.0.1:${process.env.PORT || '3000'}`;
const writeKey = String(process.env.MH_CONTROL_CENTER_WRITE_KEY || '').trim();

if (!writeKey) {
  console.error('FAIL Missing MH_CONTROL_CENTER_WRITE_KEY in environment.');
  process.exit(1);
}

function buildClient() {
  const parsed = new URL(baseUrl);
  const isHttps = parsed.protocol === 'https:';
  return {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port || (isHttps ? 443 : 80),
    request: isHttps ? https.request : http.request
  };
}

function sendRequest(method, routePath, body) {
  const client = buildClient();
  const payload = body == null ? null : JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = client.request(
      {
        protocol: client.protocol,
        hostname: client.hostname,
        port: client.port,
        method,
        path: routePath,
        headers: {
          'x-mh-control-key': writeKey,
          ...(payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let text = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          text += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode || 0, text });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

function readErrorCode(text) {
  try {
    const parsed = JSON.parse(text);
    return String(parsed?.error?.code || parsed?.code || '').trim();
  } catch (_error) {
    return '';
  }
}

async function assertStatus(testName, method, routePath, expectedStatuses, body) {
  const response = await sendRequest(method, routePath, body);
  const expected = Array.isArray(expectedStatuses) ? expectedStatuses : [expectedStatuses];

  if (!expected.includes(response.status)) {
    throw new Error(`${testName} failed: expected [${expected.join(', ')}], got ${response.status}`);
  }

  return response;
}

async function assertNotStatus(testName, method, routePath, disallowedStatuses, body) {
  const response = await sendRequest(method, routePath, body);
  const disallowed = Array.isArray(disallowedStatuses) ? disallowedStatuses : [disallowedStatuses];

  if (disallowed.includes(response.status)) {
    throw new Error(`${testName} failed: disallowed status ${response.status}`);
  }

  return response;
}

async function run() {
  const checks = [
    async () => {
      await assertStatus(
        'valid project media-manager route',
        'GET',
        '/media-manager/project/hairoticmen',
        [200]
      );
    },
    async () => {
      const response = await assertStatus(
        'dot-dot traversal slug',
        'GET',
        '/media-manager/project/..',
        [400]
      );
      const code = readErrorCode(response.text);
      if (code && code !== 'INVALID_PROJECT_SLUG') {
        throw new Error(`dot-dot traversal slug returned unexpected error code ${code}`);
      }
    },
    async () => {
      await assertStatus(
        'encoded traversal slug',
        'GET',
        '/media-manager/project/%2e%2e%2fphase375smoke',
        [400]
      );
    },
    async () => {
      await assertStatus(
        'nested traversal path segment',
        'GET',
        '/media-manager/project/hairoticmen/../phase375smoke',
        [400, 404]
      );
    },
    async () => {
      await assertStatus(
        'media tree encoded traversal',
        'GET',
        '/media/tree/%2e%2e%2fphase375smoke',
        [400]
      );
    },
    async () => {
      await assertStatus(
        'insights encoded traversal',
        'GET',
        '/api/insights/%2e%2e%2fphase375smoke',
        [400]
      );
    },
    async () => {
      await assertStatus(
        'write route invalid project rejected',
        'POST',
        '/media-manager/project/%2e%2e%2fphase375smoke/setup',
        [400],
        { status: 'security-check' }
      );
    },
    async () => {
      await assertNotStatus(
        'valid insights route remains functional',
        'GET',
        '/api/insights/hairoticmen',
        [400]
      );
    }
  ];

  for (const execute of checks) {
    await execute();
  }

  console.log('PASS Project isolation verification passed.');
}

run().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exit(1);
});
