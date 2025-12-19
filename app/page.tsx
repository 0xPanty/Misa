'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'GM fam~ ✨ I\'m Misa, your Farcaster guide! Ask me about Mini Apps, trending topics, or anything FC related~ hehe (◕‿◕)' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize Mini App SDK if available
    const initSDK = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        await sdk.actions.ready();
      } catch (e) {
        // Not in Mini App context, ignore
      }
    };
    initSDK();
  }, []);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg, 
          history: messages.slice(-8) 
        })
      });

      const data = await res.json();
      
      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: 'oops something went wrong~ try again? 😅' }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'connection error~ 😢' }]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>✨ Misa ✨</h1>
        <p>Farcaster AI Assistant</p>
      </div>

      <div className="avatar-container">
        <div className="avatar" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '2.5em'
        }}>
          {isLoading ? '💭' : '🌸'}
        </div>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="sender">{msg.role === 'user' ? 'YOU' : 'MISA'}</div>
            <div>{msg.content}</div>
          </div>
        ))}
        {isLoading && <div className="typing">Misa is typing...</div>}
      </div>

      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Misa anything~"
          disabled={isLoading}
          autoComplete="off"
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
