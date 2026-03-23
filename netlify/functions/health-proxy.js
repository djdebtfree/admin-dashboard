// Netlify serverless function — proxies health checks server-side to avoid CORS
// POST /.netlify/functions/health-proxy
// Body: { url, method, headers, timeout }
// Returns: { status, statusCode, responseTime, body, error }

exports.handler = async function (event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  const { url, method = 'GET', headers = {}, timeout = 15000 } = payload;

  if (!url) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing url parameter' })
    };
  }

  // Safety: only allow GET/HEAD for health checks
  const safeMethod = ['GET', 'HEAD'].includes(method.toUpperCase()) ? method.toUpperCase() : 'GET';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.min(timeout, 25000));

  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: safeMethod,
      headers,
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timer);
    const elapsed = Date.now() - start;

    let body = null;
    try {
      const text = await response.text();
      // Only return first 2KB to keep response small
      body = text.substring(0, 2048);
      // Try to parse as JSON for cleaner output
      try { body = JSON.parse(body); } catch (_) { /* keep as string */ }
    } catch (_) { /* no body */ }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        status: response.ok ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        responseTime: elapsed,
        body
      })
    };
  } catch (err) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';

    return {
      statusCode: 200, // Return 200 so the client can parse the error
      headers: corsHeaders,
      body: JSON.stringify({
        status: isTimeout ? 'timeout' : 'error',
        statusCode: null,
        responseTime: elapsed,
        error: err.message || (isTimeout ? 'Request timed out' : 'Connection failed')
      })
    };
  }
};
