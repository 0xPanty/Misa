// Gemini API client

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function generateResponse(
  systemPrompt: string,
  messages: Message[],
  userMessage: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "API key not configured~ Please set GEMINI_API_KEY 💫";
  }

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'model', 
      parts: [{ text: 'Understood! I will respond as Misa with that personality~' }]
    },
    ...messages.flatMap(m => [
      { role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }
    ]),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ]
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Gemini API error:', error);
      return "oops something went wrong~ try again? 😅";
    }

    const data: GeminiResponse = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return text || "hmm I got confused~ can you say that again? 💭";
  } catch (e) {
    console.error('Gemini error:', e);
    return "connection error~ 😢";
  }
}
