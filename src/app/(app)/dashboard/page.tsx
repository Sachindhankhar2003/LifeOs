"use client";
import { cardStyle, tagStyle, SectionHeader } from '@/components/figma-ui';
import { useUser } from '@/lib/UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { name } = useUser();
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12.5, color: 'var(--muted-foreground)', margin: 0, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>{dateStr}</p>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 44, margin: 0, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.1 }}>
          Good morning, {name.split(' ')[0]}.
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--muted-foreground)', margin: '10px 0 0', lineHeight: 1.5 }}>
          You have 3 pending decisions and 2 goals on track this week.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Decisions Made', value: '24', delta: '+3 this week', up: true },
          { label: 'Goals On Track', value: '6 / 8', delta: '75% completion', up: true },
          { label: 'AI Insights', value: '12', delta: '4 new today', up: true },
          { label: 'Reflection Streak', value: '14d', delta: 'Personal best', up: true },
        ].map(stat => (
          <div key={stat.label} style={cardStyle}>
            <p style={{ fontSize: 11.5, color: 'var(--muted-foreground)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontSize: 26, fontFamily: 'var(--font-sans)', margin: '0 0 6px', color: 'var(--foreground)', lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: '#4338ca', margin: 0, fontWeight: 500 }}>{stat.delta}</p>
          </div>
        ))}
      </div>

      {/* Graph Row */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <SectionHeader title="Activity & Momentum" />
        <div style={{ height: 250, width: '100%', marginTop: 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { name: 'Mon', decisions: 2, insights: 1 },
              { name: 'Tue', decisions: 4, insights: 2 },
              { name: 'Wed', decisions: 3, insights: 5 },
              { name: 'Thu', decisions: 7, insights: 3 },
              { name: 'Fri', decisions: 4, insights: 6 },
              { name: 'Sat', decisions: 8, insights: 4 },
              { name: 'Sun', decisions: 6, insights: 7 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 8, color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Line type="monotone" dataKey="decisions" name="Decisions" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--background)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="insights" name="AI Insights" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--background)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Priorities */}
        <div style={cardStyle}>
          <SectionHeader title="Today's Priorities" action="View all" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { text: 'Review career change decision framework', tag: 'Decision', done: false },
              { text: 'Complete weekly reflection journal entry', tag: 'Reflection', done: false },
              { text: 'Update savings goal milestone — 60% reached', tag: 'Goal', done: true },
              { text: 'Explore "Move to Berlin" What If scenario', tag: 'Simulate', done: false },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  border: item.done ? 'none' : '1.5px solid #d4d4d4',
                  borderRadius: 4,
                  marginTop: 1,
                  flexShrink: 0,
                  background: item.done ? 'var(--foreground)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {item.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, margin: 0, color: item.done ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{item.text}</p>
                </div>
                <span style={tagStyle}>{item.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Insights */}
        <div style={cardStyle}>
          <SectionHeader title="Recent Insights" action="Ask LifeOS" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { insight: 'Your decision patterns show preference for security over growth. Consider rebalancing for long-term fulfillment.', time: '2h ago', type: 'Pattern' },
              { insight: 'Goal: "Read 24 books" is 3 months behind. Reducing to 20 books keeps the spirit without the stress.', time: '1d ago', type: 'Goal' },
              { insight: 'High alignment detected between your stated values and the Berlin relocation scenario outcomes.', time: '2d ago', type: 'What If' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                background: 'var(--card)',
                borderRadius: 6,
                border: '1px solid #f0f0f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ ...tagStyle, background: '#f0eeff', color: '#4338ca' }}>{item.type}</span>
                  <span style={{ fontSize: 11.5, color: '#c4c4c4' }}>{item.time}</span>
                </div>
                <p style={{ fontSize: 13, color: '#404040', margin: 0, lineHeight: 1.55 }}>{item.insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div style={cardStyle}>
          <SectionHeader title="Upcoming Milestones" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Career decision deadline', date: 'Oct 3', days: 8, color: '#fef3c7', textColor: '#92400e' },
              { label: '6-month savings goal check-in', date: 'Oct 10', days: 15, color: '#f0fdf4', textColor: '#166534' },
              { label: 'Quarterly life review session', date: 'Oct 18', days: 23, color: '#eff6ff', textColor: '#1e40af' },
            ].map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: 13.5, margin: 0, color: 'var(--foreground)', fontWeight: 450 }}>{m.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '3px 0 0' }}>{m.date}</p>
                </div>
                <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: m.color, color: m.textColor, fontWeight: 500 }}>
                  {m.days}d
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <SectionHeader title="Quick Actions" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Log a decision', icon: '◈' },
              { label: 'Start reflection', icon: '◎' },
              { label: 'New What If', icon: '⟁' },
              { label: 'Add a goal', icon: '◉' },
            ].map((a, i) => (
              <button key={i} style={{
                padding: '16px 14px',
                border: 'none',
                borderRadius: 8,
                background: `var(--action-bg-${(i % 4) + 1})`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: 18, color: `var(--action-text-${(i % 4) + 1})` }}>{a.icon}</div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: `var(--action-text-${(i % 4) + 1})` }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

