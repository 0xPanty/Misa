// Farcaster Knowledge Base for RAG - Based on official documentation

export const KB_MINIAPPS = `# Farcaster Mini Apps Knowledge Base

## Overview
Mini Apps are web apps built with HTML, CSS, and JavaScript that run inside Farcaster clients. They can access native Farcaster features like authentication, notifications, and wallet interaction.

## Quick Start
\`\`\`bash
npm create @farcaster/mini-app
\`\`\`

Install SDK manually:
\`\`\`bash
npm install @farcaster/miniapp-sdk
\`\`\`

## Essential: Call ready()
After your app loads, you MUST call \`sdk.actions.ready()\` to hide the splash screen:
\`\`\`javascript
import { sdk } from '@farcaster/miniapp-sdk'
await sdk.actions.ready()
\`\`\`
Without this, users see an infinite loading screen.

## Manifest (/.well-known/farcaster.json)
Every Mini App needs a manifest file at \`/.well-known/farcaster.json\`:
\`\`\`json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "miniapp": {
    "version": "1",
    "name": "App Name",
    "iconUrl": "https://...",
    "homeUrl": "https://...",
    "imageUrl": "https://...",
    "buttonTitle": "Open",
    "splashImageUrl": "https://...",
    "splashBackgroundColor": "#ffffff",
    "webhookUrl": "https://..."
  }
}
\`\`\`

## Embed Meta Tags (for sharing)
Add to HTML head to make pages shareable:
\`\`\`html
<meta name="fc:miniapp" content='{"version":"1","imageUrl":"...","button":{"title":"Open","action":{"type":"launch_miniapp","name":"App","url":"..."}}}' />
\`\`\`

## SDK Context
Access user and session info:
\`\`\`javascript
const { user, location, client } = sdk.context;
// user.fid, user.username, user.displayName, user.pfpUrl
\`\`\`

Location types:
- \`cast_embed\` - Opened from a cast
- \`cast_share\` - Opened via share extension
- \`notification\` - Opened from notification
- \`launcher\` - Opened from app store/catalog

## Authentication

### Quick Auth (Recommended)
\`\`\`javascript
const token = await sdk.quickAuth.getToken();
// Returns JWT token, automatically cached
\`\`\`

### Sign In with Farcaster
\`\`\`javascript
const result = await sdk.actions.signIn({ nonce: "your-nonce" });
// Returns { fid, username, signature, ... }
\`\`\`

## Notifications

1. Add webhookUrl to manifest
2. Handle webhook events: \`miniapp_added\`, \`miniapp_removed\`, \`notifications_enabled\`, \`notifications_disabled\`
3. Store notification tokens
4. Send notifications via POST to the notification URL

Rate limits: 1 notification/30s per token, 100/day per token

## Wallet Integration

### Ethereum (EIP-1193)
\`\`\`javascript
const provider = sdk.wallet.getEthereumProvider();
// Use with wagmi connector: @farcaster/miniapp-wagmi-connector
\`\`\`

### Solana (Wallet Standard)
\`\`\`javascript
import { FarcasterSolanaProvider } from '@farcaster/mini-app-solana';
// Wraps ConnectionProvider and WalletProvider
\`\`\`

## SDK Actions

- \`sdk.actions.ready()\` - Hide splash screen
- \`sdk.actions.addMiniApp()\` - Prompt user to add app
- \`sdk.actions.close()\` - Close mini app
- \`sdk.actions.composeCast({ text, embeds, channelKey })\` - Create cast
- \`sdk.actions.openUrl(url)\` - Open external URL
- \`sdk.actions.viewProfile(fid)\` - View user profile
- \`sdk.actions.viewCast(hash)\` - View specific cast
- \`sdk.actions.signIn({ nonce })\` - Sign in with Farcaster
- \`sdk.experimental.swapToken(...)\` - Token swap
- \`sdk.experimental.sendToken(...)\` - Send tokens
- \`sdk.experimental.viewToken(...)\` - View token info

## Detecting Environment
\`\`\`javascript
import { isInMiniApp } from '@farcaster/miniapp-sdk';
if (isInMiniApp()) {
  // Running inside Farcaster client
}
\`\`\`

## Back Navigation
\`\`\`javascript
await sdk.back.enableWebNavigation(); // Auto-integrate with browser history
// Or manual:
sdk.back.onback = () => { /* handle back */ };
await sdk.back.show();
\`\`\`

## Haptics
\`\`\`javascript
sdk.haptics.impactOccurred('medium'); // light, medium, heavy
sdk.haptics.notificationOccurred('success'); // success, warning, error
sdk.haptics.selectionChanged();
\`\`\`

## Share Extensions
Add \`castShareUrl\` to manifest to receive shared casts:
\`\`\`json
{ "castShareUrl": "https://your-app.com/share" }
\`\`\`
Receives: \`?castHash=0x...&castFid=123&viewerFid=456\`

## Common Pitfalls
- Always call \`sdk.actions.ready()\` after load
- Use \`fc:miniapp\` meta tag (not \`fc:frame\` for new apps)
- Manifest domain must match hosting domain exactly
- Use production domains (not ngrok/tunnel for production)
- Image URLs must return proper \`image/*\` content-type

## Deployment to Vercel
1. Host manifest at \`/.well-known/farcaster.json\`
2. Sign manifest with Farcaster account
3. Add embed meta tags to shareable pages
4. Call \`sdk.actions.ready()\` on load

## Testing
- Preview Tool: https://farcaster.xyz/~/developers/mini-apps/preview
- Manifest Tool: https://farcaster.xyz/~/developers/mini-apps/manifest
- Embed Tool: https://farcaster.xyz/~/developers/mini-apps/embed`;

export const KB_NEYNAR = `# Neynar API Knowledge Base

## Overview
Neynar is a Farcaster developer platform offering APIs, nodes, and mini app infrastructure.

## Authentication
All API requests require API key in header:
\`\`\`
x-api-key: YOUR_API_KEY
\`\`\`

## Key Endpoints

### User APIs
- \`GET /v2/farcaster/user/by_username?username={name}\` - Get user by username
- \`GET /v2/farcaster/user?fid={fid}\` - Get user by FID
- \`GET /v2/farcaster/user/bulk?fids={fids}\` - Get multiple users
- \`GET /v2/farcaster/user/search?q={query}\` - Search users

### Cast APIs
- \`GET /v2/farcaster/cast?identifier={hash}\` - Get single cast
- \`GET /v2/farcaster/casts?fid={fid}\` - Get user's casts (limit: 150)
- \`GET /v2/farcaster/feed/trending\` - Get trending casts
- \`GET /v2/farcaster/feed/for_you?fid={fid}\` - Personalized feed
- \`POST /v2/farcaster/cast\` - Create new cast

### Channel APIs
- \`GET /v2/farcaster/channel?id={channel_id}\` - Get channel info
- \`GET /v2/farcaster/channel/search?q={query}\` - Search channels
- \`GET /v2/farcaster/feed/channel?channel_id={id}\` - Channel feed

### Trending Feed Parameters
- \`time_window\`: \`1h\`, \`6h\`, \`12h\`, \`24h\`, \`7d\` (default: \`24h\`)
- \`limit\`: 1-10 (default: 10)
- \`channel_id\`: Filter by channel (optional)

## Mini App Stack

### Create Mini App
\`\`\`bash
npx @neynar/create-farcaster-mini-app@latest
\`\`\`

### Notifications
- Managed notification server
- API to send notifications to mini app users
- Supports batching and targeting

### Webhook Events
Handle these events from Farcaster clients:
- \`miniapp_added\`
- \`miniapp_removed\`
- \`notifications_enabled\`
- \`notifications_disabled\`

## Example: Get User Casts
\`\`\`javascript
const response = await fetch(
  \`https://api.neynar.com/v2/farcaster/casts?fid=\${fid}&limit=100\`,
  { headers: { 'x-api-key': NEYNAR_API_KEY } }
);
const data = await response.json();
// data.casts = array of cast objects
\`\`\`

## Example: Get Trending Casts
\`\`\`javascript
const response = await fetch(
  \`https://api.neynar.com/v2/farcaster/feed/trending?time_window=24h&limit=10\`,
  { headers: { 'x-api-key': NEYNAR_API_KEY } }
);
\`\`\`

## Cast Object Structure
\`\`\`json
{
  "hash": "0x...",
  "text": "Cast content",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "author": {
    "fid": 123,
    "username": "user",
    "display_name": "Display Name",
    "pfp_url": "https://..."
  },
  "reactions": { "likes": 10, "recasts": 5 },
  "replies": { "count": 3 },
  "embeds": []
}
\`\`\`

## Rate Limits
- Free tier: Limited requests per minute
- Paid tiers: Higher limits available

## Links
- Docs: https://docs.neynar.com
- API Reference: https://docs.neynar.com/reference`;

export const KB_FARCASTER = `# Farcaster Client API Knowledge Base

## Base URL
https://api.farcaster.xyz

## Pagination
Paginated endpoints return \`next.cursor\`. Use as \`?cursor={value}\` for next page.
Optional \`limit\` parameter sets page size.

## Authentication (for write endpoints)
Uses self-signed token with App Key:
\`\`\`javascript
const header = { fid, type: 'app_key', key: publicKey };
const payload = { exp: Math.floor(Date.now()/1000) + 300 };
// Sign and create JWT-like token
// Header: Authorization: Bearer {token}
\`\`\`

## Channel APIs

### Get All Channels
\`GET /v2/all-channels\`
No auth required. Returns all channels with:
- \`id\` - unique channel id
- \`url\` - parentUrl for casts
- \`name\` - display name
- \`description\` - channel description
- \`leadFid\` - creator's FID
- \`moderatorFids\` - moderator FIDs
- \`followerCount\`, \`memberCount\`
- \`publicCasting\` - whether anyone can cast

### Get Channel
\`GET /v2/channel?key={channel_id}\`

### Follow/Unfollow Channel (Authenticated)
\`POST /fc/channel-follows\` - Follow channel
\`DELETE /fc/channel-follows\` - Unfollow channel
Body: \`{ "channelKey": "channel-id" }\`

### Get Channel Followers
\`GET /v1/channel-followers?channelKey={id}\`
Returns \`users\` array with:
- \`fid\`, \`username\`, \`displayName\`
- \`followerCount\`, \`followingCount\`

### Get User's Followed Channels
\`GET /v1/user-following-channels?fid={fid}\`

## User Profile API

### Get User
\`GET /v1/user?fid={fid}\`
Returns profile info, verified addresses, etc.

## Cast APIs

### Intent URLs (for sharing)
Create cast with prefilled content:
\`\`\`
https://farcaster.xyz/intent/post?text={encoded_text}&embeds[]={url}
\`\`\`

### Direct Casts
Send DMs via Farcaster protocol.

## Concepts

### Channels
- Built on FIP-2 (parentUrl on casts)
- Have owners, moderators, members
- Can be public (anyone casts) or members-only
- Follow-based discovery

### FID (Farcaster ID)
- Unique numeric identifier for each user
- Used across all APIs

### Casts
- Posts on Farcaster
- Can have embeds, mentions, channels
- Identified by hash

## Rate Limits
Standard API rate limits apply. Check response headers.`;

export const KB_SIWF = `# Sign In with Farcaster (SIWF) Knowledge Base

## Overview
SIWF allows users to sign into any app using their Farcaster identity.
Similar to "Sign in with Google" but for Farcaster.

## How It Works
1. Show "Sign in with Farcaster" button
2. User clicks, scans QR code (desktop) or approves in app (mobile)
3. Receive and verify cryptographic signature
4. Get user's FID, username, profile info

## Benefits
- Access user's social graph
- Profile info for streamlined onboarding
- Verified Farcaster identity

## Implementation Options

### 1. AuthKit (Recommended for Web Apps)
React component library for easy integration:
\`\`\`bash
npm install @farcaster/auth-kit
\`\`\`

### 2. Mini App SDK (For Mini Apps)
\`\`\`javascript
import { sdk } from '@farcaster/miniapp-sdk';

// Quick Auth (simplest)
const token = await sdk.quickAuth.getToken();

// Or traditional SIWF
const result = await sdk.actions.signIn({ nonce: "your-nonce" });
\`\`\`

### 3. Direct Protocol (Advanced)
Implement FIP-11 directly for custom flows.

## Quick Auth vs Traditional SIWF

### Quick Auth
- Returns JWT token
- Automatic caching
- Best for mini apps
- Simple verification

### Traditional SIWF
- Returns signature
- More control
- Requires manual verification
- Better for web apps

## AuthKit Components

### SignInButton
\`\`\`jsx
import { SignInButton } from '@farcaster/auth-kit';

<SignInButton 
  onSuccess={({ fid, username }) => {
    // Handle success
  }}
/>
\`\`\`

### useProfile Hook
\`\`\`jsx
const { isAuthenticated, profile } = useProfile();
// profile.fid, profile.username, profile.displayName
\`\`\`

## Verification
Server-side verification using \`@farcaster/auth-kit\`:
\`\`\`javascript
import { verifySignInMessage } from '@farcaster/auth-kit';

const result = await verifySignInMessage({
  message,
  signature,
  domain: 'your-domain.com',
  nonce: 'your-nonce'
});
\`\`\`

## Security Considerations
- Always verify signatures server-side
- Use secure nonces
- Validate domain matches
- Check signature expiration

## Resources
- FIP-11 Spec: https://github.com/farcasterxyz/protocol/discussions/110
- AuthKit Docs: https://docs.farcaster.xyz/auth-kit`;

export const KB_BASE = `# Base FAQs Knowledge Base

## What is Base?
Base is a secure, low-cost, builder-friendly Ethereum L2 (Layer 2) built by Coinbase.
It's designed to bring the next billion users onchain.

## Key Facts
- Built on Optimism's OP Stack
- Fully EVM compatible
- Backed by Coinbase
- Decentralized and open source
- Low transaction fees
- Fast confirmations

## Network Details
- Chain ID: 8453 (mainnet), 84532 (testnet)
- Native currency: ETH
- Block time: ~2 seconds

## For Developers
- Deploy existing Ethereum dApps with minimal changes
- Use familiar tools: Hardhat, Foundry, Remix
- Access to Coinbase products and ecosystem
- Bridge assets from Ethereum mainnet

## Mini Apps on Base
Base integrates with Farcaster Mini Apps:
- Deploy Mini Apps that interact with Base chain
- Use Farcaster wallet for Base transactions
- Low gas fees make micro-transactions viable

## RPC Endpoints
- Mainnet: https://mainnet.base.org
- Testnet: https://sepolia.base.org

## Block Explorers
- Mainnet: https://basescan.org
- Testnet: https://sepolia.basescan.org

## Getting Started
1. Add Base network to wallet
2. Bridge ETH from Ethereum
3. Deploy contracts using standard Ethereum tools

## Common Use Cases
- NFT marketplaces
- DeFi applications
- Social applications (with Farcaster)
- Gaming
- Creator economy

## Resources
- Docs: https://docs.base.org
- Bridge: https://bridge.base.org
- Discord: https://discord.gg/buildonbase`;

export const KB_CULTURE = `# Farcaster Culture & Terms

## Common Terms
- GM/GN: Good morning/night greetings (very common)
- WAGMI: We're all gonna make it (optimism)
- Degen: High-risk crypto activity/person
- Cast: A post on Farcaster
- Warpcast: Main Farcaster client app
- Purple: Farcaster's brand color
- Channel: Topic-based community feed
- FID: Farcaster ID (unique number per user)
- Frames/Mini Apps: Interactive apps in feed

## Key Figures
- @dwr (Dan Romero): Farcaster co-founder, FID 3
- @v (Varun Srinivasan): Farcaster co-founder
- @vitalik (Vitalik Buterin): Ethereum founder, active on FC
- @jesse (Jesse Pollak): Base creator, jesse.base.eth
- @clanker: AI token launcher bot
- @base: Official Base account

## Culture Notes
- Strong builder/developer community
- Crypto-native but welcoming to newcomers
- Daily GM posts are a tradition
- Channels for every topic
- Open protocol = permissionless innovation`;

export function searchKnowledge(query: string): string {
  const q = query.toLowerCase();
  const results: string[] = [];
  
  // Mini Apps related
  if (q.includes('mini') || q.includes('app') || q.includes('sdk') || q.includes('frame') || 
      q.includes('manifest') || q.includes('ready') || q.includes('wallet') || q.includes('notification') ||
      q.includes('embed') || q.includes('splash') || q.includes('webhook') || q.includes('haptic')) {
    results.push(KB_MINIAPPS);
  }
  
  // Neynar API related
  if (q.includes('neynar') || q.includes('api') || q.includes('trending') || q.includes('feed') || 
      q.includes('cast') && q.includes('get') || q.includes('endpoint') || q.includes('fetch')) {
    results.push(KB_NEYNAR);
  }
  
  // Farcaster protocol/API
  if (q.includes('farcaster') || q.includes('fid') || q.includes('protocol') || q.includes('channel') ||
      q.includes('api.farcaster')) {
    results.push(KB_FARCASTER);
  }
  
  // Sign In with Farcaster
  if (q.includes('sign') || q.includes('auth') || q.includes('siwf') || q.includes('login') ||
      q.includes('authkit') || q.includes('quick auth')) {
    results.push(KB_SIWF);
  }
  
  // Base L2
  if (q.includes('base') || q.includes('l2') || q.includes('chain') || q.includes('eth') ||
      q.includes('coinbase') || q.includes('8453')) {
    results.push(KB_BASE);
  }
  
  // Culture and community
  if (q.includes('culture') || q.includes('gm') || q.includes('degen') || q.includes('wagmi') ||
      q.includes('dwr') || q.includes('vitalik') || q.includes('jesse') || q.includes('clanker') ||
      q.includes('who') || q.includes('what is') || q.includes('mean')) {
    results.push(KB_CULTURE);
  }
  
  // Default: return culture + mini apps summary if no specific match
  if (results.length === 0) {
    results.push(KB_CULTURE);
    results.push(KB_MINIAPPS.substring(0, 2000));
  }
  
  // Limit total context size
  return results.join('\n\n---\n\n').substring(0, 8000);
}
