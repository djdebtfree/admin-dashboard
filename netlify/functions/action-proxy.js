// Netlify serverless function — proxies action requests server-side to avoid CORS
// POST /.netlify/functions/action-proxy
// Body: { url, method, headers, body, timeout }
// Returns: { statusCode, responseTime, data, error }

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

  const { url, method = 'GET', headers = {}, body: reqBody, timeout = 30000 } = payload;

  if (!url) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing url parameter' })
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.min(timeout, 55000));

  const fetchOpts = {
    method: method.toUpperCase(),
    headers,
    signal: controller.signal,
    redirect: 'follow'
  };

  if (reqBody && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    fetchOpts.body = typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody);
  }

  const start = Date.now();
  try {
    const response = await fetch(url, fetchOpts);
    clearTimeout(timer);
    const elapsed = Date.now() - start;

    let data = null;
    try {
      const text = await response.text();
      const truncated = text.substring(0, 8192);
      try { data = JSON.parse(truncated); } catch (_) { data = truncated; }
    } catch (_) { /* no body */ }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        statusCode: response.status,
        ok: response.ok,
        responseTime: elapsed,
        data
      })
    };
  } catch (err) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        statusCode: null,
        ok: false,
        responseTime: elapsed,
        error: err.message || 'Request failed'
      })
    };
  }
};
