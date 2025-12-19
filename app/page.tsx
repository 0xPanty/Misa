'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: '> MISA TERMINAL v1.0 INITIALIZED' },
    { role: 'assistant', content: 'GM fam~ ✨ I\'m Misa, your Farcaster guide!\nAsk me about Mini Apps, trending topics, or anything FC related~ hehe' }
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
    const initSDK = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        await sdk.actions.ready();
      } catch (e) {
        // Not in Mini App context
      }
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
        setMessages([...newMessages, { role: 'assistant', content: 'ERROR: Connection failed. Try again~' }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'ERROR: Network error.' }]);
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
      <div className="header">
        <h1>[ MISA ]</h1>
        <p>Farcaster AI Terminal</p>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <span className="sender">
              {msg.role === 'user' ? 'YOU' : msg.role === 'assistant' ? 'MISA' : 'SYS'}
            </span>
            <span>{msg.content}</span>
          </div>
        ))}
        {isLoading && <div className="typing">MISA is processing...</div>}
      </div>

      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          SEND
        </button>
      </div>

      <div className="meta-bar">
        MISA v1.0 | Farcaster Mini App
      </div>
    </div>
  );
}
