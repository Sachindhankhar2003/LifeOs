"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GridIcon, ChatIcon, BranchIcon, TargetIcon, UserIcon, BellIcon, GearIcon, ChevronLeftIcon, ChevronRightIcon 
} from "@/components/figma-ui";
import NotificationBell from "@/components/NotificationBell";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const NAV_ITEMS = [
    { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: GridIcon },
    { id: 'ask', href: '/chat', label: 'Ask LifeOS', icon: ChatIcon },
    { id: 'whatif', href: '/simulator', label: 'What If', icon: BranchIcon },
    { id: 'goals', href: '/goals', label: 'Goals & Plans', icon: TargetIcon },
    { id: 'settings', href: '/settings', label: 'Settings', icon: GearIcon },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 260,
        minWidth: collapsed ? 64 : 260,
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        overflow: 'hidden',
        background: 'var(--background)'
      }}>
        {/* Logo */}
        <div style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 20px' : '0 20px',
          borderBottom: '1px solid var(--border)',
          gap: 10,
          flexShrink: 0,
        }}>
          <div style={{
            width: 28,
            height: 28,
            background: 'var(--logo-bg)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--logo-shadow)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2.5" fill="white"/>
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.05 3.05l1.41 1.41M9.54 9.54l1.41 1.41M9.54 4.46l1.41-1.41M3.05 10.95l1.41-1.41" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 24, letterSpacing: '0', color: 'var(--foreground)', fontWeight: 600 }}>
              LifeOS
            </span>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 2, borderRadius: 4, display: 'flex' }}
            >
              <ChevronLeftIcon size={14} />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 2, borderRadius: 4, display: 'flex' }}
            >
              <ChevronRightIcon size={14} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            
            // Assign a specific color to each active nav item
            const bgVar = `var(--nav-bg-${(index % 5) + 1})`;
            const textVar = `var(--nav-text-${(index % 5) + 1})`;

            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '9px 12px' : '9px 12px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? bgVar : 'transparent',
                  color: active ? textVar : 'var(--muted-foreground)',
                  fontSize: 13.5,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: active ? 600 : 500,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--nav-hover)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground)';
                  }
                }}
              >
                <Icon size={16} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: collapsed ? '12px 8px' : '12px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--avatar-bg)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--avatar-text)',
            boxShadow: 'var(--avatar-shadow)',
          }}>ME</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', lineHeight: 1.3 }}>Welcome</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)', lineHeight: 1.3 }}>Premium Account</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
        <header className="h-16 lg:hidden flex items-center justify-between px-4" style={{borderBottom: '1px solid var(--border)', background: 'var(--background)'}}>
          <div className="flex items-center">
             <span className="font-medium ml-2 tracking-tight" style={{fontFamily: 'var(--font-sans)', color: 'var(--foreground)'}}>LifeOS</span>
          </div>
          {/* We hide NotificationBell intentionally since Figma didn't use it, but keeping here just in case */}
          <div className="hidden"><NotificationBell /></div>
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded" style={{border: '1px solid var(--border)', color: 'var(--foreground)', background: 'transparent'}}>Menu</button>
        </header>

        <div style={{ flex: 1, overflow: 'auto' }}>
            {children}
        </div>
      </main>
    </div>
  );
}
