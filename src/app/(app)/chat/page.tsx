"use client";

import { useEffect, useRef, useMemo } from "react";
import { useChat } from "ai/react";
import { useUser } from "@/lib/UserContext";

export default function ChatPage() {
  const { name } = useUser();
  const firstName = name.split(' ')[0];

  const initialMessages = useMemo(() => ([
    {
      id: "welcome-msg",
      role: "assistant" as const,
      content: `Hello ${firstName}. I'm LifeOS — your personal AI for decisions, plans, and reflection. What would you like to think through today?`
    }
  ]), [firstName]);

  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    'How should I prioritize my goals this quarter?',
    'Help me think through the Berlin relocation decision',
    'What patterns do you see in my recent decisions?',
    'Create a 90-day plan for my career transition',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '28px 40px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 38, margin: 0, fontWeight: 600 }}>Ask LifeOS</h2>
        <p style={{ fontSize: 13.5, color: 'var(--muted-foreground)', margin: '6px 0 0' }}>AI-powered thinking partner for decisions, planning, and reflection.</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 28, height: 28, background: 'var(--foreground)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="2.5" fill="white"/>
                  <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            <div style={{
              maxWidth: '68%',
              padding: '14px 18px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? 'var(--foreground)' : 'var(--secondary)',
              color: m.role === 'user' ? 'var(--card)' : 'var(--foreground)',
              fontSize: 14,
              lineHeight: 1.65,
              whiteSpace: 'pre-line',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, background: 'var(--foreground)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.5" fill="white"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: '12px 16px', background: 'var(--secondary)', borderRadius: 12 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted-foreground)', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        {error && (
            <div style={{ color: 'red', textAlign: 'center', fontSize: 13 }}>An error occurred: {error.message}. Wait and retry.</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 40px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {suggestions.map(s => (
            <button key={s} onClick={(e) => { const form = e.currentTarget.closest("form") || document.querySelector("form"); setInput(s); setTimeout(() => form?.requestSubmit(), 50) }} style={{
              fontSize: 12.5,
              padding: '7px 13px',
              border: '1px solid var(--border)',
              borderRadius: 20,
              background: 'var(--card)',
              cursor: 'pointer',
              color: '#404040',
              transition: 'border-color 0.12s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = '#4338ca')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)')}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ padding: '12px 40px 28px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', background: 'var(--card)' }}>
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
            placeholder="Ask anything — decisions, plans, goals, reflections..."
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 14,
              fontFamily: 'var(--font-sans)',
              color: 'var(--foreground)',
              background: 'transparent',
              lineHeight: 1.5,
            }}
          />
          <button type="submit" disabled={!input.trim() || isLoading} style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: input.trim() ? 'var(--foreground)' : 'var(--border)',
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.12s',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V3M3 7l4-4 4 4" stroke={input.trim() ? 'white' : 'var(--muted-foreground)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: '#c4c4c4', margin: '8px 0 0', textAlign: 'center' }}>
          LifeOS uses your Personal Context to give relevant, personalised answers.
        </p>
      </form>
    </div>
  );
}
