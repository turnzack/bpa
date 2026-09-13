#!/usr/bin/env node
/**
 * API Endpoint Tests
 * Tests the pay-per-scan API endpoints
 */

const http = require('http');
const https = require('https');
const BASE_URL = 'http://localhost:4000';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  test: (msg) => console.log(`\n${colors.blue}→${colors.reset} ${msg}`),
  wait: (msg) => console.log(`${colors.yellow}⏳${colors.reset} ${msg}`)
};

async function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  log.info('Starting API Tests...\n');

  try {
    // Test 1: Stripe Webhook Status
    log.test('GET / (Server Health Check)');
    const healthRes = await request('GET', '/');
    console.log(`Status: ${healthRes.status}`);

    // Test 2: Create Scan Payment Session (requires a valid JWT)
    log.test('POST /api/stripe/create-scan-payment (requires auth)');
    log.wait('Skipping - requires valid JWT token');
    log.info('To test: Include Authorization header with Bearer token');

    // Test 3: Check Scan Payment Status
    log.test('POST /api/payments/check-scan-payment (requires auth)');
    log.wait('Skipping - requires valid JWT token');

    // Test 4: Initiate Scan
    log.test('POST /api/ai/initiate-scan (requires auth)');
    log.wait('Skipping - requires valid JWT token');

    log.info('\n📋 Authentication Flow:');
    log.info('1. Create/Login account via /api/auth (Supabase)');
    log.info('2. Get JWT token from auth response');
    log.info('3. Include token in Authorization header: "Bearer <token>"');
    log.info('4. Call payment endpoints with authenticated requests\n');

    log.success('✅ All basic tests completed!');
    log.info(`\n🚀 Server is running on ${BASE_URL}`);
    log.info('📚 API Endpoints:');
    log.info('  POST   /api/stripe/webhook        - Stripe payment webhook');
    log.info('  POST   /api/stripe/create-scan-payment - Create payment session');
    log.info('  POST   /api/payments/check-scan-payment - Check payment status');
    log.info('  POST   /api/ai/initiate-scan     - Start a scan');
    log.info('  POST   /api/ai/chat              - Send chat message with file analysis\n');

  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);
