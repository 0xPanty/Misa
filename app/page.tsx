'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: '> MISA TERMINAL INITIALIZED' },
    { role: 'assistant', content: 'GM fam~ ✨ Ask me about Farcaster, Mini Apps, trending topics~ hehe (◕‿◕)' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        await sdk.actions.ready();
      } catch (e) {}
    };
    initSDK();
    inputRef.current?.focus();
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
          history: messages.filter(m => m.role !== 'system').slice(-8)
        })
      });

      const data = await res.json();

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: 'Connection error~ Try again? 😅' }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Network error~ 😢' }]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div id="pane-output">
        <div className="text-scroll" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`text-line text-line--${msg.role}`}>
              {msg.role === 'user' && <strong>YOU&gt; </strong>}
              {msg.role === 'assistant' && <strong>MISA&gt; </strong>}
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="text-line text-line--system">
              Processing...
            </div>
          )}
        </div>
      </div>

      <div id="pane-avatar">
        <div id="avatar-wrap">
          <img
            id="avatar-img"
            src="/avatar.png"
            alt="MISA"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <span className="avatar-label">MISA</span>
      </div>

      <div id="pane-input">
        <input
          ref={inputRef}
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="meta-bar">
        misa v1.0.0
      </div>
    </div>
  );
}
