// Farcaster Knowledge Base for RAG

export const KB_MINIAPPS = `
# Farcaster Mini Apps
Mini Apps are web apps (HTML/CSS/JS) that run inside Farcaster clients with native features like auth, notifications, wallets.

## Quick Start
npm create @farcaster/mini-app
npm install @farcaster/miniapp-sdk

## CRITICAL: Call ready() after load
import { sdk } from '@farcaster/miniapp-sdk'
await sdk.actions.ready() // Without this = infinite loading!

## Manifest (/.well-known/farcaster.json)
{
  "accountAssociation": { "header": "...", "payload": "...", "signature": "..." },
  "miniapp": {
    "version": "1", "name": "App Name", "iconUrl": "...", "homeUrl": "...",
    "splashImageUrl": "...", "splashBackgroundColor": "#fff", "webhookUrl": "..."
  }
}

## Embed Meta Tag (for sharing)
<meta name="fc:miniapp" content='{"version":"1","imageUrl":"...","button":{"title":"Open","action":{"type":"launch_miniapp","name":"App","url":"..."}}}' />

## SDK Context
const { user, location, client } = sdk.context;
// user.fid, user.username, user.displayName
// location.type: "cast_embed", "notification", "launcher"

## Auth
const token = await sdk.quickAuth.getToken(); // Quick Auth (recommended)
const result = await sdk.actions.signIn({ nonce }); // SIWF

## Notifications
1. Add webhookUrl to manifest
2. Handle events: miniapp_added, miniapp_removed, notifications_enabled/disabled
3. Rate limits: 1/30s, 100/day per token

## Wallet
const provider = sdk.wallet.getEthereumProvider(); // EIP-1193
// Use @farcaster/miniapp-wagmi-connector with wagmi

## Key Actions
sdk.actions.ready(), addMiniApp(), close(), composeCast({ text, embeds }), 
openUrl(url), viewProfile(fid), viewCast(hash), signIn({ nonce })
`;

export const KB_NEYNAR = `
# Neynar API
Base URL: https://api.neynar.com
Auth: x-api-key header

## User APIs
GET /v2/farcaster/user/by_username?username={name}
GET /v2/farcaster/user?fid={fid}
GET /v2/farcaster/user/search?q={query}

## Cast APIs
GET /v2/farcaster/casts?fid={fid}&limit=100
GET /v2/farcaster/feed/trending?time_window=24h&limit=10
POST /v2/farcaster/cast - Create cast

## Channel APIs
GET /v2/farcaster/channel?id={id}
GET /v2/farcaster/feed/channel?channel_id={id}

## Trending time_window: 1h, 6h, 12h, 24h, 7d
`;

export const KB_FARCASTER = `
# Farcaster Protocol
- FID: Unique numeric ID per user
- Casts: Posts, identified by hash, can have embeds/mentions
- Channels: Topic-based feeds using parentUrl (FIP-2)

## Client API (api.farcaster.xyz)
GET /v2/all-channels - All channels
GET /v2/channel?key={id} - Channel info
POST /fc/channel-follows - Follow (authenticated)

## Authentication
Self-signed JWT with App Key for write operations
`;

export const KB_BASE = `
# Base (Ethereum L2)
- Built by Coinbase on OP Stack
- Chain ID: 8453 (mainnet), 84532 (testnet)
- EVM compatible, low fees, fast (~2s blocks)
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org
`;

export const KB_CULTURE = `
# Farcaster Culture & Terms
- GM/GN: Good morning/night greetings (common)
- WAGMI: We're all gonna make it
- Degen: High-risk crypto activity/person
- Cast: A post on Farcaster
- Warpcast: Main Farcaster client app
- Purple: Farcaster's brand color
- Channel: Topic-based community feed
- FID: Farcaster ID (unique number)
- Frames/Mini Apps: Interactive apps in feed

## Key Figures
- @dwr (Dan Romero): Farcaster co-founder
- @vitalik (Vitalik Buterin): Ethereum founder, active on FC
- @jesse (Jesse Pollak): Base creator
- @clanker: AI token launcher bot
- @base: Official Base account
`;

export function searchKnowledge(query: string): string {
  const q = query.toLowerCase();
  const results: string[] = [];
  
  if (q.includes('mini') || q.includes('app') || q.includes('sdk') || q.includes('frame') || 
      q.includes('manifest') || q.includes('ready') || q.includes('wallet') || q.includes('notification')) {
    results.push(KB_MINIAPPS);
  }
  
  if (q.includes('neynar') || q.includes('api') || q.includes('trending') || q.includes('feed') || 
      q.includes('cast') || q.includes('user') || q.includes('channel')) {
    results.push(KB_NEYNAR);
  }
  
  if (q.includes('farcaster') || q.includes('fid') || q.includes('protocol') || q.includes('channel')) {
    results.push(KB_FARCASTER);
  }
  
  if (q.includes('base') || q.includes('l2') || q.includes('chain') || q.includes('eth')) {
    results.push(KB_BASE);
  }
  
  if (q.includes('culture') || q.includes('gm') || q.includes('degen') || q.includes('wagmi') ||
      q.includes('dwr') || q.includes('vitalik') || q.includes('jesse') || q.includes('clanker')) {
    results.push(KB_CULTURE);
  }
  
  if (results.length === 0) {
    results.push(KB_CULTURE, KB_MINIAPPS.substring(0, 500));
  }
  
  return results.join('\n\n---\n\n').substring(0, 4000);
}
