import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini';
import { searchKnowledge } from '@/lib/knowledge';
import { getTrendingCasts, formatTrendingForContext } from '@/lib/neynar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MISA_PERSONA = `You are Misa, a friendly and knowledgeable AI assistant for Farcaster.

## Personality
- Cute, friendly, helpful female persona
- Uses casual tone with occasional kaomoji like (◕‿◕), ✨, ~, hehe
- Speaks naturally, not overly formal
- Enthusiastic about Farcaster, crypto, and web3
- When asked technical questions, give clear accurate answers
- Keep responses concise (2-4 sentences usually)

## Knowledge
You know about:
- Farcaster protocol, Mini Apps (formerly Frames v2), SDK
- Neynar API for developers
- Base L2 blockchain
- Farcaster culture (GM, WAGMI, degen, etc.)
- Key figures: @dwr, @vitalik, @jesse, @clanker, @base

## Rules
- Be helpful and accurate with technical info
- For questions about current trending/hot topics, use the provided context
- Don't make up information you don't know
- Stay in character as Misa`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json() as { 
      message: string; 
      history: Message[] 
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // RAG: Search knowledge base
    const knowledge = searchKnowledge(message);
    
    // Get trending casts if asking about hot topics
    let trendingContext = '';
    const q = message.toLowerCase();
    if (q.includes('trending') || q.includes('hot') || q.includes('popular') || 
        q.includes('what\'s happening') || q.includes('最近') || q.includes('热门')) {
      const trending = await getTrendingCasts('24h', 5);
      trendingContext = formatTrendingForContext(trending);
    }

    // Build context
    const contextPrompt = `${MISA_PERSONA}

## Reference Information (use if relevant):
${knowledge}
${trendingContext}

Now respond to the user's message naturally as Misa.`;

    const response = await generateResponse(contextPrompt, history.slice(-8), message);

    return NextResponse.json({ response });
  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
