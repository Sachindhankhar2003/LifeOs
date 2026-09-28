"use client";
import React, { useState } from "react";
import { useChat } from "ai/react";
import { cardStyle } from "@/components/figma-ui";

export default function SimulatorPage() {
  const [activeScenario, setActiveScenario] = useState(0)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/chat' });

  const scenarios = [
    {
      title: 'Stay in Lahore, Grow Internally',
      description: 'Continue current software role, seek internal promotion to senior engineer in 12 months.',
      outcomes: [
        { label: 'Financial', value: 82, note: '+18% salary in 12 months', color: '#4338ca' },
        { label: 'Career Growth', value: 55, note: 'Incremental progression', color: '#4338ca' },
        { label: 'Life Quality', value: 70, note: 'Stable, familiar environment', color: '#4338ca' },
        { label: 'Values Alignment', value: 60, note: 'Moderate fit with stated goals', color: '#4338ca' },
      ],
      pros: ['Financial stability', 'No relocation stress', 'Strong existing network', 'Predictable trajectory'],
      cons: ['Limited career ceiling', 'Lower international exposure', 'Comfort-zone risk'],
      timeframe: '12 months',
      riskLevel: 'Low',
    },
    {
      title: 'Relocate to Berlin, PM Role',
      description: 'Transition to product management at a Berlin-based startup. Relocate in Q2 next year.',
      outcomes: [
        { label: 'Financial', value: 48, note: '−15% initially, +40% by year 3', color: '#4338ca' },
        { label: 'Career Growth', value: 91, note: 'Significant acceleration', color: '#4338ca' },
        { label: 'Life Quality', value: 74, note: 'High potential, adjustment phase', color: '#4338ca' },
        { label: 'Values Alignment', value: 88, note: 'Strong fit with growth values', color: '#4338ca' },
      ],
      pros: ['International network', 'PM career pivot', 'High growth potential', 'New life experience'],
      cons: ['Financial dip initially', 'Cultural adjustment', 'Visa complexity', 'Away from family'],
      timeframe: '6–8 months',
      riskLevel: 'High',
    },
  ]

  const s = scenarios[activeScenario]
  const other = scenarios[activeScenario === 0 ? 1 : 0]

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: 44, margin: 0, fontWeight: 600 }}>What If Simulator</h2>
        <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: '8px 0 0' }}>Ask a hypothetical question and receive AI-generated scenario projections.</p>
      </div>

      {/* Input Step */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 40, ...cardStyle, background: 'var(--card)' }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>New Simulation Request</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <input 
            type="text" 
            value={input}
            onChange={handleInputChange}
            placeholder="What if I switch my career to Data Science next month?" 
            style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 14 }}
          />
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              background: 'var(--foreground)',
              color: 'var(--card)',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Simulating...' : 'Simulate'}
          </button>
        </div>
      </form>

      {messages.length > 0 && (
        <div style={{ marginBottom: 40, padding: 24, borderRadius: 12, background: 'var(--secondary)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--foreground)' }}>Live Simulation</h3>
          <div style={{ fontSize: 14, color: 'var(--foreground)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].content : 'Processing scenario parameters...'}
          </div>
        </div>
      )}

      {/* Scenario Toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {scenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => setActiveScenario(i)}
            style={{
              padding: '20px 20px',
              border: `1.5px solid ${activeScenario === i ? '#4338ca' : 'var(--border)'}`,
              borderRadius: 8,
              background: activeScenario === i ? '#faf9ff' : 'var(--card)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: activeScenario === i ? '#4338ca' : 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Scenario {i + 1}
              </span>
              <span style={{
                fontSize: 11.5,
                padding: '3px 8px',
                borderRadius: 12,
                background: sc.riskLevel === 'Low' ? '#f0fdf4' : '#fef2f2',
                color: sc.riskLevel === 'Low' ? '#166534' : '#991b1b',
                fontWeight: 500,
              }}>
                {sc.riskLevel} Risk
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--foreground)', marginBottom: 4 }}>{sc.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{sc.description}</div>
          </button>
        ))}
      </div>

      {/* Outcome Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 20px', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Outcome Projections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {s.outcomes.map(o => (
              <div key={o.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 450, color: 'var(--foreground)' }}>{o.label}</span>
                  <span style={{ fontSize: 13, color: '#4338ca', fontFamily: 'var(--font-cursive)', fontWeight: 500 }}>{o.value}%</span>
                </div>
                <div style={{ height: 5, background: '#f0f0f0', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${o.value}%`, background: '#4338ca', borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)', marginTop: 4 }}>{o.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 14px', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Advantages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.pros.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: 'var(--foreground)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 14px', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Trade-offs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.cons.map(c => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: 'var(--foreground)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardStyle, background: '#faf9ff', border: '1px solid #e0ddff' }}>
            <p style={{ fontSize: 12, color: '#6d5ed6', fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Recommendation</p>
            <p style={{ fontSize: 13.5, color: '#2d1f6e', margin: 0, lineHeight: 1.6 }}>
              Given your values and current savings runway, <strong>{activeScenario === 1 ? 'Scenario 2 offers 88% value alignment' : 'Scenario 1 minimises near-term risk'}</strong> — but consider a hybrid: transition internally first, then relocate with leverage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

