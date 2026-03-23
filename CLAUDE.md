# admin-dashboard

Data Driver Pro Admin Dashboard — single-page operations control center for all Data Driver Pro services.

## Stack
- Plain HTML + CSS + vanilla JavaScript (single file: index.html)
- Netlify Functions (serverless) for CORS-free health check proxying
- No build step, no framework
- Deployed on Netlify as `datadriverpro-admin`
- Montserrat font via Google Fonts

## Architecture
- `index.html` — Everything inline (HTML + CSS + JS)
- `netlify/functions/health-proxy.js` — Serverless proxy for health checks (eliminates CORS)
- `netlify/functions/action-proxy.js` — Serverless proxy for service actions (eliminates CORS)
- `netlify.toml` — Netlify build config, functions dir, security headers
- `_redirects` — SPA fallback routing

## Service Registry
25 services across 7 sections:
1. Data Acquisition (5): DD API Gateway, DD Contact DB, AudienceLab, Apify, PhantomBuster
2. Lead Nurturing (3): GHL CRM, VAPI Voice, Make
3. AI Agent Layer (5): LiveAvatar SDK Agent, Sandy SMS Agent, PL Agent DB, QClaw, Cognee Cloud
4. MCP Servers (3): MaybeTech MCP, VAPI MCP, HeyGen MCP
5. Social Enrichment (3): FB Enrichment, LI Enrichment, LI Reverse Validator
6. Voice + Visual (3): ElevenLabs, VAPI Voice Squad, LiveAvatar/HeyGen
7. Customer-Facing (3): trydatadriver.com, geneleven.app, Stripe

## Health Check Flow
1. Browser JS calls `/.netlify/functions/health-proxy` with target URL + auth headers
2. Netlify Function makes the actual HTTP request server-side (no CORS issues)
3. Function returns `{ status, statusCode, responseTime, body }` to the browser
4. Railway services get 15s timeout (cold start), SaaS APIs get 12s
5. Checks run in batches of 5 to avoid proxy overload

## Features
- Server-side health check proxying (no more CORS failures)
- Health monitoring with auto-refresh (60s)
- Action buttons per service (health checks, test scrapes, etc.)
- Activity log with timestamped entries
- Settings panel for Railway URLs and API keys (localStorage)
- Collapsible sections
- Export/import settings as JSON

## Brand
- Black background (#000)
- Montserrat font
- Blue (#007BFF) to Yellow (#F5FF00) gradient accents
- Green (#00FF88) healthy, Red (#FF4444) unhealthy, Orange (#FF8800) not deployed/timeout

## Key URLs
- Dashboard: https://datadriverpro-admin.netlify.app
- GitHub: https://github.com/djdebtfree/admin-dashboard
- DD API: https://datadriverapi.com
- DD Supabase: https://smfgkhlwoszldfsxkvib.supabase.co
- Agent Supabase: https://zymepbxosrpprrtcmmqi.supabase.co
