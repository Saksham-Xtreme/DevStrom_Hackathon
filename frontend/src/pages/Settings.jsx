import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';

/* ─── Toggle ──────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: checked ? 'var(--green-primary)' : '#d1d5db',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.25s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ─── Left Nav Item ───────────────────────────────── */
function NavItem({ icon, label, active, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '11px 14px',
        borderRadius: 10, border: 'none', cursor: 'pointer',
        background: active ? 'var(--green-light)' : 'transparent',
        color: danger ? '#d94343' : active ? 'var(--green-primary)' : 'var(--text-secondary)',
        fontSize: 14, fontWeight: active ? 600 : 400,
        textAlign: 'left',
        transition: 'background 0.18s, color 0.18s',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

/* ─── Section Card ────────────────────────────────── */
function SectionCard({ title, subtitle, action, children }) {
  return (
    <div className="card" style={{ padding: '28px 32px', marginBottom: 20 }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── Form Input ──────────────────────────────────── */
function FormInput({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}
      </label>
      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: '#fff',
          border: `1.5px solid ${focused ? 'var(--green-primary)' : 'var(--border)'}`,
          borderRadius: 10, padding: '11px 14px',
          color: 'var(--text-primary)', fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(16,124,86,0.1)' : 'none',
        }}
      />
    </div>
  );
}

/* ─── Toggle Row ──────────────────────────────────── */
function ToggleRow({ icon, label, sub, checked, onChange, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--green-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ─── Edit Button ─────────────────────────────────── */
function EditBtn() {
  return (
    <button className="btn btn-ghost btn-sm" type="button">
      Edit ✏️
    </button>
  );
}

/* ─── Main ────────────────────────────────────────── */
export default function Settings() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: (user?.name || '').split(' ')[0] || '',
    lastName: (user?.name || '').split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    bloodGroup: '',
  });

  const [notifs, setNotifs] = useState({
    doseReminders: true,
    refillAlerts: true,
    weeklyReport: false,
    caregiverUpdates: true,
    emailNotifs: false,
    smsAlerts: false,
  });

  const [prefs, setPrefs] = useState({
    compactView: false,
    animations: true,
    soundAlerts: false,
    showStreaks: true,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const initials = (user?.name || 'MT').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'MediTrack User';

  const navLinks = [
    { id: 'profile',       icon: '👤', label: 'Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'preferences',  icon: '🎨', label: 'Preferences' },
    { id: 'security',     icon: '🔒', label: 'Security' },
    { id: 'delete',       icon: '🗑️', label: 'Delete Account', danger: true },
  ];

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area" style={{ overflowY: 'auto' }}>
        <div className="content-scroll" style={{ paddingBottom: 80 }}>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Settings
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
              Manage your account information and preferences
            </p>
          </div>

          {/* ── Two-Column Layout ── */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

            {/* Left Nav */}
            <div className="card" style={{ width: 220, flexShrink: 0, padding: '10px 8px' }}>
              {navLinks.map(n => (
                <NavItem
                  key={n.id}
                  icon={n.icon}
                  label={n.label}
                  active={section === n.id}
                  danger={n.danger}
                  onClick={() => setSection(n.id)}
                />
              ))}
            </div>

            {/* Right Content */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* ── PROFILE ── */}
              {section === 'profile' && (
                <>
                  {/* Profile summary */}
                  <SectionCard title="My Profile">
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 20,
                      padding: '18px 20px',
                      background: 'var(--green-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                    }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg,var(--green-primary),var(--green-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 700, color: '#fff',
                        flexShrink: 0, overflow: 'hidden',
                      }}>
                        {user?.profileImage
                          ? <img src={user.profileImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{fullName}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
                          {profile.email || 'No email linked'}
                        </div>
                        {profile.phone && (
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{profile.phone}</div>
                        )}
                      </div>
                      <EditBtn />
                    </div>
                  </SectionCard>

                  {/* Personal Information */}
                  <SectionCard
                    title="Personal Information"
                    subtitle="Update your name, email and contact details"
                    action={<EditBtn />}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <FormInput label="First Name" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
                      <FormInput label="Last Name" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
                      <FormInput label="Email Address" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
                      <FormInput label="Phone Number" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </SectionCard>

                  {/* Medical Information */}
                  <SectionCard
                    title="Medical Information"
                    subtitle="Help us personalise your experience"
                    action={<EditBtn />}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <FormInput label="Date of Birth" type="date" value={profile.dob} onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))} />
                      <FormInput label="Blood Group" value={profile.bloodGroup} onChange={e => setProfile(p => ({ ...p, bloodGroup: e.target.value }))} placeholder="e.g. O+" />
                    </div>
                  </SectionCard>
                </>
              )}

              {/* ── NOTIFICATIONS ── */}
              {section === 'notifications' && (
                <SectionCard
                  title="Notification Preferences"
                  subtitle="Choose when and how you want to be notified"
                >
                  <ToggleRow icon="💊" label="Dose Reminders"     sub="Alert when it's time to take medicine"    checked={notifs.doseReminders}     onChange={v => setNotifs(n => ({ ...n, doseReminders: v }))} />
                  <ToggleRow icon="📦" label="Refill Alerts"      sub="Know when your stock is running low"       checked={notifs.refillAlerts}      onChange={v => setNotifs(n => ({ ...n, refillAlerts: v }))} />
                  <ToggleRow icon="📊" label="Weekly Report"      sub="Adherence summary every Sunday"            checked={notifs.weeklyReport}      onChange={v => setNotifs(n => ({ ...n, weeklyReport: v }))} />
                  <ToggleRow icon="👨‍👩‍👦" label="Caregiver Updates" sub="Notify caregiver about missed doses"      checked={notifs.caregiverUpdates}  onChange={v => setNotifs(n => ({ ...n, caregiverUpdates: v }))} />
                  <ToggleRow icon="📧" label="Email Notifications" sub="Receive alerts in your inbox"             checked={notifs.emailNotifs}       onChange={v => setNotifs(n => ({ ...n, emailNotifs: v }))} />
                  <ToggleRow icon="📱" label="SMS Alerts"         sub="Critical reminders via text message"      checked={notifs.smsAlerts}         onChange={v => setNotifs(n => ({ ...n, smsAlerts: v }))} last />
                </SectionCard>
              )}

              {/* ── PREFERENCES ── */}
              {section === 'preferences' && (
                <SectionCard
                  title="App Preferences"
                  subtitle="Personalise your MediTrack experience"
                >
                  <ToggleRow icon="🗜️" label="Compact View"     sub="Denser layout with less whitespace"           checked={prefs.compactView}  onChange={v => setPrefs(p => ({ ...p, compactView: v }))} />
                  <ToggleRow icon="✨" label="Animations"        sub="Smooth transitions and micro-interactions"    checked={prefs.animations}   onChange={v => setPrefs(p => ({ ...p, animations: v }))} />
                  <ToggleRow icon="🔊" label="Sound Alerts"      sub="Play a chime when reminders fire"             checked={prefs.soundAlerts}  onChange={v => setPrefs(p => ({ ...p, soundAlerts: v }))} />
                  <ToggleRow icon="🔥" label="Adherence Streaks" sub="Show streak counter on your dashboard"       checked={prefs.showStreaks}  onChange={v => setPrefs(p => ({ ...p, showStreaks: v }))} last />
                </SectionCard>
              )}

              {/* ── SECURITY ── */}
              {section === 'security' && (
                <>
                  <SectionCard title="Connected Account" subtitle="Accounts linked to your MediTrack profile">
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px',
                      background: 'var(--green-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: '#fff', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22,
                      }}>🔗</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Google Account</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{profile.email || 'Not linked'}</div>
                      </div>
                      <span style={{
                        marginLeft: 'auto',
                        background: 'var(--status-taken-bg)', color: 'var(--status-taken-text)',
                        borderRadius: 20, padding: '4px 12px',
                        fontSize: 12, fontWeight: 600,
                      }}>● Connected</span>
                    </div>
                  </SectionCard>

                  <SectionCard title="Account Actions" subtitle="Manage your account security">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { icon: '🔑', label: 'Change Password', sub: 'Update your account password', color: 'var(--green-primary)', bg: 'var(--green-light)', border: 'rgba(16,124,86,0.2)' },
                        { icon: '📱', label: 'Two-Factor Authentication', sub: 'Add an extra layer of security', color: '#b86e00', bg: '#fff4e5', border: 'rgba(184,110,0,0.2)' },
                      ].map(item => (
                        <button key={item.label} type="button" style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          background: item.bg,
                          border: `1px solid ${item.border}`,
                          borderRadius: 12, padding: '14px 18px',
                          color: item.color, fontSize: 14, fontWeight: 500,
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                        }}>
                          <span style={{ fontSize: 20 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>{item.label}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.sub}</div>
                          </div>
                        </button>
                      ))}

                      <button type="button" onClick={logout} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        background: 'var(--status-missed-bg)',
                        border: '1px solid rgba(217,67,67,0.2)',
                        borderRadius: 12, padding: '14px 18px',
                        color: 'var(--status-missed-text)', fontSize: 14, fontWeight: 500,
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                      }}>
                        <span style={{ fontSize: 20 }}>🚪</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>Sign Out</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Log out of your MediTrack account</div>
                        </div>
                      </button>
                    </div>
                  </SectionCard>
                </>
              )}

              {/* ── DELETE ── */}
              {section === 'delete' && (
                <SectionCard title="Delete Account">
                  <div style={{
                    padding: '20px', borderRadius: 12,
                    background: 'var(--status-missed-bg)',
                    border: '1px solid rgba(217,67,67,0.15)',
                    marginBottom: 24,
                  }}>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                      Permanently deleting your account will remove <strong>all</strong> your data — medicines, reminders, adherence history, and caregiver connections.
                      <br />
                      <span style={{ color: 'var(--status-missed-text)', fontWeight: 600 }}>This action cannot be undone.</span>
                    </p>
                  </div>
                  <button type="button" style={{
                    background: 'var(--status-missed-bg)',
                    border: '1px solid rgba(217,67,67,0.3)',
                    borderRadius: 10, padding: '12px 24px',
                    color: 'var(--status-missed-text)', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    🗑️ Delete My Account
                  </button>
                </SectionCard>
              )}

              {/* ── Save Bar ── */}
              {section !== 'security' && section !== 'delete' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
                  {saved && (
                    <span style={{
                      background: 'var(--status-taken-bg)',
                      border: '1px solid rgba(16,124,86,0.2)',
                      borderRadius: 8, padding: '8px 16px',
                      color: 'var(--status-taken-text)', fontSize: 13, fontWeight: 600,
                    }}>
                      ✓ Changes saved!
                    </span>
                  )}
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
        <MobileNav />
      </main>
    </div>
  );
}
