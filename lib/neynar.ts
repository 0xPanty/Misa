// Neynar API client for real-time Farcaster data

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const BASE_URL = 'https://api.neynar.com/v2/farcaster';

interface Cast {
  hash: string;
  text: string;
  author: {
    fid: number;
    username: string;
    display_name: string;
  };
  reactions: { likes_count: number; recasts_count: number };
  timestamp: string;
}

interface TrendingResponse {
  casts: Cast[];
}

export async function getTrendingCasts(timeWindow: string = '24h', limit: number = 5): Promise<Cast[]> {
  if (!NEYNAR_API_KEY) {
    console.warn('NEYNAR_API_KEY not set');
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}/feed/trending?time_window=${timeWindow}&limit=${limit}`,
      {
        headers: { 'x-api-key': NEYNAR_API_KEY },
        next: { revalidate: 300 } // Cache 5 min
      }
    );
    
    if (!res.ok) return [];
    
    const data: TrendingResponse = await res.json();
    return data.casts || [];
  } catch (e) {
    console.error('Neynar API error:', e);
    return [];
  }
}

export async function getUserCasts(fid: number, limit: number = 10): Promise<Cast[]> {
  if (!NEYNAR_API_KEY) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/casts?fid=${fid}&limit=${limit}`,
      { headers: { 'x-api-key': NEYNAR_API_KEY } }
    );
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.casts || [];
  } catch (e) {
    console.error('Neynar API error:', e);
    return [];
  }
}

export function formatTrendingForContext(casts: Cast[]): string {
  if (casts.length === 0) return '';
  
  const formatted = casts.map((c, i) => 
    `${i + 1}. @${c.author.username}: "${c.text.substring(0, 100)}${c.text.length > 100 ? '...' : ''}" (${c.reactions.likes_count} likes)`
  ).join('\n');
  
  return `\n## Current Trending on Farcaster:\n${formatted}`;
}
