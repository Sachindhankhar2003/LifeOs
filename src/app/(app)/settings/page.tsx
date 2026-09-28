"use client";
import React, { useState } from "react";
import { cardStyle, SettingsSection, FieldGroup, ToggleSwitch } from "@/components/figma-ui";
import { useUser } from "@/lib/UserContext";

export default function SettingsPage() {
  const [tab, setTab] = useState('Account')
  const tabs = ['Account', 'AI Preferences', 'Appearance', 'Privacy', 'Notifications']
  const { name, setName, email, setEmail, age, setAge, location: userLocation, setLocation, colorMode, setColorMode } = useUser();

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: 44, margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>Settings</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: tab === t ? '2px solid var(--foreground)' : '2px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: tab === t ? 500 : 400,
            color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)',
            fontFamily: 'var(--font-cursive)',
            marginBottom: -1,
            transition: 'color 0.12s',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'Account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <SettingsSection title="Profile Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FieldGroup label="Full Name" value={name} onChange={setName} />
              <FieldGroup label="Email" value={email} onChange={setEmail} />
              <FieldGroup label="Age" value={age} onChange={setAge} />
              <FieldGroup label="Location" value={userLocation} onChange={setLocation} />
            </div>
          </SettingsSection>
          <SettingsSection title="Password & Security">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FieldGroup label="Current Password" value="" type="password" />
              <FieldGroup label="New Password" value="" type="password" />
              <button style={{ alignSelf: 'flex-start', padding: '9px 18px', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13.5, fontFamily: 'var(--font-cursive)', fontWeight: 500 }}>Update Password</button>
            </div>
          </SettingsSection>
          <SettingsSection title="Danger Zone">
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ padding: '9px 18px', border: '1px solid #fca5a5', borderRadius: 6, background: '#fff7f7', cursor: 'pointer', fontSize: 13.5, color: '#dc2626', fontFamily: 'var(--font-cursive)' }}>Delete Account</button>
              <button style={{ padding: '9px 18px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)', cursor: 'pointer', fontSize: 13.5, color: 'var(--muted-foreground)', fontFamily: 'var(--font-cursive)' }}>Export Data</button>
            </div>
          </SettingsSection>
        </div>
      )}

      {tab === 'AI Preferences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <SettingsSection title="Decision Frameworks">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Use First-Principles Thinking', desc: 'Break down complex problems into basic elements', on: true },
                { label: 'Second-Order Effects', desc: 'Always simulate the consequence of the consequence', on: true },
                { label: 'Stoic Perspective', desc: 'Highlight what is within your control vs outside it', on: false },
              ].map(pref => (
                <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 450, color: 'var(--foreground)' }}>{pref.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 3 }}>{pref.desc}</div>
                  </div>
                  <ToggleSwitch on={pref.on} />
                </div>
              ))}
            </div>
          </SettingsSection>
          <SettingsSection title="AI Model">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Standard (Balanced)', 'Analytical (Data-focused)', 'Coaching (Motivational)'].map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="radio" name="model" defaultChecked={m === 'Analytical (Data-focused)'} style={{ accentColor: '#4338ca' }} />
                  <span style={{ fontSize: 13.5, color: 'var(--foreground)' }}>{m}</span>
                </label>
              ))}
            </div>
          </SettingsSection>
        </div>
      )}

      {tab === 'Appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <SettingsSection title="Theme Preferences">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 450, color: 'var(--foreground)' }}>Color Mode</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 3 }}>Toggle between Day Theme (minimal) and Color Theme (vibrant & creative)</div>
              </div>
              <ToggleSwitch on={colorMode} onChange={setColorMode} />
            </div>
          </SettingsSection>
        </div>
      )}

      {tab === 'Privacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <SettingsSection title="Data & Privacy">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Store conversation history', desc: 'Retain chat history to improve context over time', on: true },
                { label: 'Use data for AI training', desc: 'Contribute anonymised data to improve LifeOS models', on: false },
                { label: 'Third-party analytics', desc: 'Share usage data with analytics providers', on: false },
              ].map(pref => (
                <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 450, color: '#0f0f0f' }}>{pref.label}</div>
                    <div style={{ fontSize: 12.5, color: '#a3a3a3', marginTop: 3 }}>{pref.desc}</div>
                  </div>
                  <ToggleSwitch on={pref.on} />
                </div>
              ))}
            </div>
          </SettingsSection>
        </div>
      )}

      {(tab === 'Notifications' || tab === 'Integrations') && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px', color: '#a3a3a3' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>○</div>
          <p style={{ fontSize: 14 }}>{tab} settings coming soon.</p>
        </div>
      )}
    </div>
  )
}

