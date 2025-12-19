# Misa AI - Farcaster Mini App

A cute AI chat assistant as a Farcaster Mini App~ ✨

Chat with Misa, a friendly AI girl who loves anime, cute things, and the Farcaster community!

## Features

- 💕 Cute AI personality based on @xqc's style
- 🎀 Animated avatar with lip sync
- ✨ Cyberpunk terminal UI
- 📱 Farcaster Mini App compatible
- 🔥 Powered by Gemini AI

## Setup

### Prerequisites

- Node.js 22+
- Python 3.10+ (for backend server)
- Gemini API Key

### Installation

```bash
npm install
```

### Development

1. Start the backend server (from avatar-ui/server):
```bash
cd ../avatar-ui/server
.venv\Scripts\activate
python -m uvicorn main:app --reload
```

2. Start the frontend:
```bash
npm run dev
```

Or run both together:
```bash
npm run dev:all
```

### Build

```bash
npm run build
```

## Deployment to Farcaster

1. Deploy to Vercel or similar hosting
2. Update URLs in:
   - `src/index.html` (fc:miniapp meta tag)
   - `public/.well-known/farcaster.json`
3. Sign the manifest at: https://farcaster.xyz/~/developers/mini-apps/manifest
4. Update `farcaster.json` with signed accountAssociation

## License

MIT
