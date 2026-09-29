"use client";
import React, { useState } from "react";
import { cardStyle } from "@/components/figma-ui";

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { title: 'Save PKR 2.4M emergency fund', category: 'Finance', progress: 62, deadline: 'Mar 2025', status: 'on-track' },
    { title: 'Read 20 books this year', category: 'Learning', progress: 45, deadline: 'Dec 2024', status: 'at-risk' },
    { title: 'Transition to Product Management', category: 'Career', progress: 20, deadline: 'Jun 2025', status: 'on-track' },
  ]);
  
  const [activeGoal, setActiveGoal] = useState<number | null>(null);

  const statusColor: Record<string, string> = { 'on-track': '#166534', 'at-risk': '#92400e' }
  const statusBg: Record<string, string> = { 'on-track': '#f0fdf4', 'at-risk': '#fef3c7' }

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 38, margin: 0, fontWeight: 600 }}>Goals & Plans</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: '8px 0 0' }}>{goals.length} active goals</p>
        </div>
        <button 
          onClick={() => {
            setGoals([...goals, { title: 'New Aspirational Goal', category: 'Experience', progress: 0, deadline: 'Dec 2025', status: 'on-track' }]);
          }}
          style={{
          padding: '9px 18px',
          background: 'var(--foreground)',
          color: 'var(--card)',
          border: 'none',
          borderRadius: 6,
          fontSize: 13.5,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
        }}>+ New Goal</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {goals.map((g, i) => (
          <div key={i} 
            onClick={() => setActiveGoal(activeGoal === i ? null : i)}
            style={{ 
              ...cardStyle, 
              cursor: 'pointer',
              transform: activeGoal === i ? 'scale(1.05)' : 'scale(1)',
              boxShadow: activeGoal === i ? '0 10px 25px rgba(0,0,0,0.1)' : cardStyle.boxShadow,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: activeGoal === i ? 10 : 1,
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11.5, padding: '3px 9px', borderRadius: 20, background: 'var(--secondary)', color: 'var(--muted-foreground)', fontWeight: 500 }}>{g.category}</span>
              <span style={{ fontSize: 11.5, padding: '3px 9px', borderRadius: 20, background: statusBg[g.status], color: statusColor[g.status], fontWeight: 500 }}>
                {g.status === 'on-track' ? 'On Track' : 'At Risk'}
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 500, margin: '0 0 14px', lineHeight: 1.4, color: 'var(--foreground)' }}>{g.title}</h3>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Progress</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--foreground)', fontWeight: 500 }}>{g.progress}%</span>
              </div>
              <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${g.progress}%`, background: g.status === 'at-risk' ? '#f97316' : 'var(--foreground)', borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Due {g.deadline}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

