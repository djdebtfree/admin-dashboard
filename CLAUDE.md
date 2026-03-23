# admin-dashboard

Data Driver Pro Admin Dashboard — single-page operations control center for all Data Driver Pro services.

## Stack
- Plain HTML + CSS + vanilla JavaScript (single file: index.html)
- No build step, no framework
- Deployed on Netlify as `datadriverpro-admin`
- Montserrat font via Google Fonts

## Architecture
- `index.html` — Everything inline (HTML + CSS + JS)
- `netlify.toml` — Netlify build + security headers
- `_redirects` — SPA fallback routing

## Service Registry
21 services across 6 sections:
1. Data Acquisition (5): DD API Gateway, DD Supabase, AudienceLab, Apify, PhantomBuster
2. Lead Nurturing (3): GHL, Twilio, Make
3. AI Agent Layer (4): LiveAvatar, Sandy SMS, Agent DB, QClaw
4. Social Enrichment (3): FB Pipeline, LI Pipeline, LI Reverse Validator
5. Voice + Visual (3): ElevenLabs, VAPI (planned), LiveAvatar/HeyGen API
6. Customer-Facing (3): trydatadriver.com, geneleven.app, Stripe

## Features
- Health monitoring with auto-refresh (60s)
- Action buttons per service (health checks, test scrapes, etc.)
- Activity log with timestamped entries
- Settings panel for Railway URLs and API keys (localStorage)
- CORS fallback detection (no-cors mode)
- Collapsible sections
- Export/import settings as JSON

## Brand
- Black background (#000)
- Montserrat font
- Blue (#007BFF) to Yellow (#F5FF00) gradient accents
- Green (#00FF88) healthy, Red (#FF4444) unhealthy, Orange (#FF8800) not deployed

## Key URLs
- Dashboard: https://datadriverpro-admin.netlify.app
- GitHub: https://github.com/djdebtfree/admin-dashboard
- DD API: https://datadriverapi.com
- DD Supabase: https://smfgkhlwoszldfsxkvib.supabase.co
- Agent Supabase: https://zymepbxosrpprrtcmmqi.supabase.co
