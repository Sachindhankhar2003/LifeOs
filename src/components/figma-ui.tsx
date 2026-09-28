"use client";
import React, { useState } from "react";

// ─── Shared Styles ─────────────────────────────────────────────────────────────

export const cardStyle: React.CSSProperties = {
  padding: '20px 22px',
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  background: '#fff',
}

export const tagStyle: React.CSSProperties = {
  fontSize: 11.5,
  padding: '3px 8px',
  borderRadius: 12,
  background: '#f0f0f0',
  color: '#737373',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

// ─── Shared Components ────────────────────────────────────────────────────────

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: '#0f0f0f' }}>{title}</h3>
      {action && <button style={{ fontSize: 12.5, color: '#4338ca', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-cursive)', fontWeight: 500 }}>{action} →</button>}
    </div>
  )
}

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#0f0f0f', paddingBottom: 10, borderBottom: '1px solid #e8e8e8' }}>{title}</h3>
      {children}
    </div>
  )
}

export function FieldGroup({ label, value, type = 'text', onChange }: { label: string; value: string; type?: string; onChange?: (val: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#a3a3a3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        type={type}
        style={{
          width: '100%',
          padding: '9px 12px',
          border: '1px solid var(--border)',
          borderRadius: 6,
          fontSize: 13.5,
          fontFamily: 'var(--font-cursive)',
          color: 'var(--foreground)',
          outline: 'none',
          background: 'var(--card)',
        }}
      />
    </div>
  )
}

export function ToggleSwitch({ on, onChange }: { on: boolean; onChange?: (val: boolean) => void }) {
  const active = on;
  return (
    <button
      onClick={() => {
        onChange?.(!active);
      }}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: active ? '#3b82f6' : '#e8e8e8',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: 3,
        left: active ? 21 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

export function GridIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

export function ChatIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 3.5C2 2.67 2.67 2 3.5 2h9C13.33 2 14 2.67 14 3.5v7c0 .83-.67 1.5-1.5 1.5H6l-3 2.5V12H3.5C2.67 12 2 11.33 2 10.5v-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

export function BranchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="4" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4 5.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M4 5.5C4 8 12 7 12 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

export function TargetIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="8" r="1" fill="currentColor"/>
    </svg>
  )
}

export function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 14c0-3.31 2.69-5 6-5s6 1.69 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

export function BellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2a4 4 0 0 0-4 4c0 3-1.5 4-1.5 4h11S12 9 12 6a4 4 0 0 0-4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M9.5 12.5a1.5 1.5 0 0 1-3 0" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

export function GearIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.27 1.27M11.33 11.33l1.27 1.27M12.6 3.4l-1.27 1.27M4.67 11.33l-1.27 1.27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

export function ChevronLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ChevronRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}