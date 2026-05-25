// FilmStack Calendar — V3 (final). B1 Quiet aesthetic + real FILMSTACK logo
// + prominent events search in the top right + sign-in / event-submission
// flow backed by the localStorage admin store.

// Bridge modal components from app-modals.jsx — Babel <script type="text/babel">
// tags get their own scope after compile, so cross-file refs go through window.
const SB_SignInModal = window.SB_SignInModal;
const SB_SubmitEventModal = window.SB_SubmitEventModal;
const SB_PublicSubmitModal = window.SB_PublicSubmitModal;
const SB_SubmissionsModal = window.SB_SubmissionsModal;
// Tweaks panel + controls live in tweaks-panel.jsx (a separate Babel script).
const TweaksPanel = window.TweaksPanel;
const useTweaks = window.useTweaks;
const TweakSection = window.TweakSection;
const TweakRadio = window.TweakRadio;
const TweakToggle = window.TweakToggle;
const TweakSelect = window.TweakSelect;

const SB_COLORS = {
  paper: '#ffffff',
  paperAlt: '#fafafa',
  ink: '#1a1a1a',
  inkSoft: '#4a4a4a',
  mute: '#737373',
  rule: '#e6e6e6',
  ruleSoft: '#f0f0f0',
  screenings: 'oklch(0.50 0.18 250)',
  events: 'oklch(0.52 0.14 152)',
  deadlines: 'oklch(0.58 0.16 48)',
  actions: 'oklch(0.50 0.16 300)',
  screeningsTint: '#eef2fb',
  eventsTint: '#eef6ef',
  deadlinesTint: '#fbf2e8',
  actionsTint: '#f4eef9',
  warningTint: '#fff8e6',
  warning: 'oklch(0.55 0.16 70)'
};
const SB_SECTION_COLOR = (s) => SB_COLORS[s] || SB_COLORS.ink;
const SB_SECTION_TINT = (s) => SB_COLORS[s + 'Tint'] || SB_COLORS.paperAlt;
const SB_FONTS = {
  brand: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", "JetBrains Mono", monospace'
};

// Subscribe to the admin store so any submission / auth change re-renders.
function useStore() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => window.FSDDStore.subscribe(() => setTick((t) => t + 1)), []);
  return tick;
}

// Merge user submissions (published only, plus the current viewer's pending
// ones so they can see their own work) into the static EVENTS array.
function useMergedEvents() {
  useStore();
  const user = window.FSDDStore.getUser();
  const subs = window.FSDDStore.listSubmissions();
  const visible = subs.filter((e) =>
  e.status === 'published' ||
  user && (e.submittedBy === user.email || user.role === 'Editor')
  );
  return [...window.EVENTS, ...visible];
}

function FilmStackCalendarApp() {
  useStore();
  const events = useMergedEvents();
  const user = window.FSDDStore.getUser();
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || {
    logoStyle: 'square', brandWordmark: 'center',
    showThisWeek: true, accentLevel: 'quiet', navDensity: 'cozy',
  });

  const [section, setSection] = React.useState('all');
  const [showPast, setShowPast] = React.useState(false);
  const [view, setView] = React.useState('list');
  const [query, setQuery] = React.useState('');
  const [cities, setCities] = React.useState(() => new Set(['New York', 'Los Angeles', 'Online']));
  const [expanded, setExpanded] = React.useState(new Set());
  const [filterStuck, setFilterStuck] = React.useState(false);
  const [monthOffset, setMonthOffset] = React.useState(0);

  // Modals
  const [signInOpen, setSignInOpen] = React.useState(false);
  const [submitOpen, setSubmitOpen] = React.useState(false); // admin direct-publish form
  const [publicSubmitOpen, setPublicSubmitOpen] = React.useState(false); // public mailto form
  const [submissionsOpen, setSubmissionsOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setFilterStuck(window.scrollY > 360);
    window.addEventListener('scroll', onScroll);onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = window.CalUtils.filterEvents(events, { section, showPast, query, cities }).
  slice().sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  const thisWeek = events.filter((e) => {
    if (e.urgency === 'past') return false;
    const d = window.CalUtils.daysUntil(e);
    return d >= 0 && d <= 7;
  }).slice().sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  const weeks = window.CalUtils.groupByWeek(filtered);
  const toggle = (id) => setExpanded((s) => {
    const n = new Set(s);n.has(id) ? n.delete(id) : n.add(id);return n;
  });

  const counts = events.reduce((acc, e) => {
    if (!showPast && e.urgency === 'past') return acc;
    acc.all = (acc.all || 0) + 1;
    acc[e.section] = (acc[e.section] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      background: SB_COLORS.paper, color: SB_COLORS.ink,
      fontFamily: SB_FONTS.body, fontSize: 15, lineHeight: 1.5, minHeight: '100vh'
    }}>
      <SB_TopBar
        query={query} setQuery={setQuery}
        user={user} t={t}
        onSignIn={() => setSignInOpen(true)}
        onSubmit={() => setPublicSubmitOpen(true)}
        onMySubmissions={() => setSubmissionsOpen(true)} />
      
      <SB_Nav t={t} />
      <SB_TitleBlock user={user} onSubmit={() => setPublicSubmitOpen(true)} />
      {t.showThisWeek && <SB_ThisWeek events={thisWeek} />}
      <SB_FilterBar
        section={section} setSection={setSection}
        showPast={showPast} setShowPast={setShowPast}
        cities={cities} setCities={setCities}
        view={view} setView={setView}
        counts={counts} resultCount={filtered.length}
        stuck={filterStuck} />
      
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 32px 80px' }}>
        {view === 'list' &&
        <SB_ListView weeks={weeks} expanded={expanded} toggle={toggle} user={user} t={t} />
        }
        {view === 'calendar' &&
        <SB_CalendarView events={filtered} monthOffset={monthOffset} setMonthOffset={setMonthOffset} />
        }
      </div>
      <SB_Footer />

      {signInOpen && <SB_SignInModal onClose={() => setSignInOpen(false)} />}
      {submitOpen && <SB_SubmitEventModal onClose={() => setSubmitOpen(false)} />}
      {publicSubmitOpen && <SB_PublicSubmitModal
        onClose={() => setPublicSubmitOpen(false)}
        onAdminSignIn={() => { setPublicSubmitOpen(false); setSignInOpen(true); }}
        onAdminDirectSubmit={() => { setPublicSubmitOpen(false); setSubmitOpen(true); }}
        onViewSubmissions={() => { setPublicSubmitOpen(false); setSubmissionsOpen(true); }} />}
      {submissionsOpen && <SB_SubmissionsModal user={user} onClose={() => setSubmissionsOpen(false)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Top bar">
          <TweakRadio label="Logo" value={t.logoStyle}
            options={[{ value: 'square', label: 'Square' }, { value: 'wide', label: 'Wordmark' }]}
            onChange={(v) => setTweak('logoStyle', v)} />
          <TweakRadio label="Brand wordmark" value={t.brandWordmark}
            options={[{ value: 'center', label: 'Center' }, { value: 'inline', label: 'Inline' }, { value: 'hidden', label: 'Hide' }]}
            onChange={(v) => setTweak('brandWordmark', v)} />
          <TweakRadio label="Nav density" value={t.navDensity}
            options={[{ value: 'cozy', label: 'Cozy' }, { value: 'compact', label: 'Compact' }]}
            onChange={(v) => setTweak('navDensity', v)} />
        </TweakSection>
        <TweakSection label="Listings">
          <TweakToggle label="Show this-week strip" value={t.showThisWeek}
            onChange={(v) => setTweak('showThisWeek', v)} />
          <TweakRadio label="Section accent" value={t.accentLevel}
            options={[{ value: 'quiet', label: 'Quiet' }, { value: 'lively', label: 'Lively' }]}
            onChange={(v) => setTweak('accentLevel', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

// ───────────────────── Top bar — logo + centered wordmark + icon strip ─────────────────────
function SB_TopBar({ query, setQuery, user, onSubmit, onSignIn, onMySubmissions, t }) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [bellOpen, setBellOpen] = React.useState(false);
  const searchRef = React.useRef(null);
  const bellRef = React.useRef(null);

  // Close any popover when clicking outside.
  React.useEffect(() => {
    const off = (e) => {
      if (searchOpen && !searchRef.current?.contains(e.target)) setSearchOpen(false);
      if (bellOpen && !bellRef.current?.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [searchOpen, bellOpen]);

  // "New events" for the bell badge: anything happening today + tomorrow,
  // plus admin submissions added in the last 24 hours.
  const newEvents = React.useMemo(() => {
    const upcoming = window.EVENTS.filter((e) => {
      const days = window.CalUtils.daysUntil(e);
      return days >= 0 && days <= 2;
    });
    const recent = window.FSDDStore.listSubmissions().filter((s) => {
      if (!s.submittedAt) return false;
      return Date.now() - new Date(s.submittedAt).getTime() < 86400000;
    });
    const all = [...upcoming, ...recent].slice().sort((a, b) => a.sortDate.localeCompare(b.sortDate));
    const dedup = []; const seenKey = new Set();
    for (const e of all) {
      const k = (e.id || '') + e.sortDate + e.title;
      if (!seenKey.has(k)) { seenKey.add(k); dedup.push(e); }
    }
    return dedup;
  }, [bellOpen]);

  // Persisted "seen" state — the badge clears when the bell is opened, and
  // only re-appears when something genuinely new shows up later.
  const eventKey = (e) => (e.id || '') + e.sortDate + e.title;
  const [seen, setSeen] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('fsdd-bell-seen') || '[]')); }
    catch { return new Set(); }
  });
  const markBellSeen = () => {
    const next = new Set(seen);
    for (const e of newEvents) next.add(eventKey(e));
    setSeen(next);
    try { localStorage.setItem('fsdd-bell-seen', JSON.stringify([...next])); } catch {}
  };
  const unseenCount = newEvents.filter((e) => !seen.has(eventKey(e))).length;
  const badge = unseenCount > 9 ? '9+' : (unseenCount || null);

  const useSquareLogo = !t || t.logoStyle === 'square';
  const showBrand = t && t.brandWordmark !== 'hidden';

  // ── Logo ──
  const logo = (
    <a href="#" onClick={(e) => e.preventDefault()} style={{
      display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0,
    }}>
      {useSquareLogo ? (
        <span style={{
          width: 40, height: 40, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          background: SB_COLORS.paper, borderRadius: 8, overflow: 'hidden',
        }}>
          <img src="assets/filmstack-icon.png" alt="FilmStack"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </span>
      ) : (
        <img src="assets/filmstack-logo.png" alt="FilmStack"
          style={{ height: 34, width: 'auto', display: 'block' }} />
      )}
    </a>
  );

  // ── Brand wordmark (centered) ──
  const brand = showBrand ? (
    <span style={{
      fontFamily: SB_FONTS.brand, fontSize: 22, fontWeight: 700,
      letterSpacing: -0.5, color: SB_COLORS.ink, lineHeight: 1, whiteSpace: 'nowrap',
    }}>FilmStack Daily Digest</span>
  ) : null;

  // ── Icon button helper (shared style) ──
  const iconBtn = (children, onClick, active, key) => (
    <button key={key} onClick={onClick} aria-label={key} style={{
      appearance: 'none', border: 'none', background: active ? SB_COLORS.paperAlt : 'transparent',
      cursor: 'pointer', color: SB_COLORS.ink, padding: 8, borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }} onMouseEnter={(e) => e.currentTarget.style.background = SB_COLORS.paperAlt}
       onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      {children}
    </button>
  );

  // ── Right-side strip: search + bell + SUBMIT AN EVENT ──
  const rightStrip = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        {iconBtn(
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
          () => { setSearchOpen((o) => !o); setBellOpen(false); },
          searchOpen, 'search',
        )}
        {searchOpen && (
          <SB_SearchPopover query={query} setQuery={setQuery} onClose={() => setSearchOpen(false)} />
        )}
      </div>

      {/* Bell — small badge that clears on open */}
      <div ref={bellRef} style={{ position: 'relative' }}>
        {iconBtn(
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
            </svg>
            {badge && (
              <span style={{
                position: 'absolute', top: 3, right: 3,
                minWidth: 13, height: 13, padding: '0 3px',
                borderRadius: 999, background: SB_COLORS.warning, color: '#fff',
                fontFamily: SB_FONTS.brand, fontSize: 8.5, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${SB_COLORS.paper}`, lineHeight: 1,
              }}>{badge}</span>
            )}
          </>,
          () => {
            const next = !bellOpen;
            setBellOpen(next); setSearchOpen(false);
            if (next) markBellSeen();
          },
          bellOpen, 'notifications',
        )}
        {bellOpen && (
          <SB_BellPopover events={newEvents} onClose={() => setBellOpen(false)} />
        )}
      </div>

      {/* SUBMIT AN EVENT — opens the public submission form (sends an email). */}
      <button onClick={onSubmit} style={{
        appearance: 'none', cursor: 'pointer',
        fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
        background: SB_COLORS.paperAlt, color: SB_COLORS.ink,
        border: `1px solid ${SB_COLORS.rule}`,
        padding: '7px 14px', borderRadius: 8, marginLeft: 8,
        display: 'inline-flex', alignItems: 'center',
        letterSpacing: 0.06,
      }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
         onMouseLeave={(e) => e.currentTarget.style.background = SB_COLORS.paperAlt}>
        SUBMIT AN EVENT
      </button>
    </div>
  );

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', gap: 24,
      padding: '12px 28px',
      borderBottom: `1px solid ${SB_COLORS.rule}`,
      background: SB_COLORS.paper,
    }}>
      <div style={{ justifySelf: 'start' }}>{logo}</div>
      <div style={{ justifySelf: 'center' }}>{brand}</div>
      <div style={{ justifySelf: 'end' }}>{rightStrip}</div>
    </div>
  );
}

// ─────────── Search popover (opens from the search icon) ───────────
function SB_SearchPopover({ query, setQuery, onClose }) {
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); }, []);
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: SB_COLORS.paper, border: `1px solid ${SB_COLORS.rule}`,
      borderRadius: 10, padding: 8, minWidth: 380, zIndex: 50,
      boxShadow: '0 14px 36px rgba(0,0,0,0.14)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1px solid ${SB_COLORS.rule}`, borderRadius: 8,
        background: SB_COLORS.paperAlt, paddingLeft: 12,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={SB_COLORS.mute} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input
          ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, venues, contributors…"
          onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: SB_FONTS.brand, fontSize: 14, color: SB_COLORS.ink,
            padding: '10px 12px', flex: 1, minWidth: 0,
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{
            appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
            color: SB_COLORS.mute, padding: '0 12px', fontSize: 14,
          }}>×</button>
        )}
      </div>
      <div style={{
        fontFamily: SB_FONTS.brand, fontSize: 11.5, color: SB_COLORS.mute,
        padding: '8px 10px 4px',
      }}>
        Type to filter the listings below · press <span style={{
          fontFamily: SB_FONTS.mono, padding: '1px 5px', background: SB_COLORS.paperAlt,
          border: `1px solid ${SB_COLORS.rule}`, borderRadius: 4, color: SB_COLORS.inkSoft,
        }}>Esc</span> to close
      </div>
    </div>
  );
}

// ─────────── Bell popover — new + upcoming events ───────────
function SB_BellPopover({ events, onClose }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: SB_COLORS.paper, border: `1px solid ${SB_COLORS.rule}`,
      borderRadius: 10, padding: 0, minWidth: 320, maxHeight: 420, zIndex: 50,
      boxShadow: '0 14px 36px rgba(0,0,0,0.14)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px 14px', borderBottom: `1px solid ${SB_COLORS.ruleSoft}`,
        display: 'flex', alignItems: 'baseline', gap: 8,
      }}>
        <span style={{
          fontFamily: SB_FONTS.brand, fontSize: 14, fontWeight: 700, color: SB_COLORS.ink,
        }}>New events</span>
        <span style={{
          fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute,
        }}>· today, tomorrow & just-added</span>
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {!events.length ? (
          <div style={{
            padding: '24px 16px', fontFamily: SB_FONTS.brand, fontSize: 13,
            color: SB_COLORS.mute, textAlign: 'center',
          }}>You're up to date. No new events.</div>
        ) : events.map((e, i) => {
          const c = SB_SECTION_COLOR(e.section);
          return (
            <div key={(e.id || '') + e.sortDate + i} style={{
              padding: '10px 14px', display: 'grid', gridTemplateColumns: '4px 1fr',
              gap: 10, borderBottom: i < events.length - 1 ? `1px solid ${SB_COLORS.ruleSoft}` : 'none',
              cursor: 'pointer',
            }} onMouseEnter={(ev) => ev.currentTarget.style.background = SB_COLORS.paperAlt}
               onMouseLeave={(ev) => ev.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 4, alignSelf: 'stretch', background: c, borderRadius: 2 }} />
              <div>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 10.5, fontWeight: 700,
                  color: c, textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 2,
                }}>{e.sectionLabel} · {e.dateDisplay}</div>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
                  color: SB_COLORS.ink, lineHeight: 1.3, letterSpacing: -0.1,
                }}>{e.title}</div>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute, marginTop: 2,
                }}>{e.location}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SB_AuthMenu({ user, onClose, onSubmit, onMySubmissions }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 6px)', right: 0,
      background: SB_COLORS.paper, border: `1px solid ${SB_COLORS.rule}`,
      borderRadius: 8, padding: 6, minWidth: 240, zIndex: 50,
      boxShadow: '0 12px 36px rgba(0,0,0,0.12)'
    }}>
      <div style={{ padding: '8px 12px 10px', borderBottom: `1px solid ${SB_COLORS.ruleSoft}` }}>
        <div style={{ fontFamily: SB_FONTS.brand, fontSize: 13.5, fontWeight: 700, color: SB_COLORS.ink }}>{user.name}</div>
        <div style={{ fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute, marginTop: 1 }}>{user.email}</div>
        <div style={{
          display: 'inline-block', marginTop: 6,
          fontFamily: SB_FONTS.brand, fontSize: 10.5, fontWeight: 700,
          color: user.role === 'Editor' ? SB_SECTION_COLOR('actions') : SB_COLORS.mute,
          background: user.role === 'Editor' ? SB_SECTION_TINT('actions') : SB_COLORS.paperAlt,
          padding: '2px 8px', borderRadius: 999, letterSpacing: 0.06, textTransform: 'uppercase'
        }}>{user.role}</div>
      </div>
      {[
        { label: '+ Submit event', onClick: () => { onClose(); onSubmit(); }, accent: true },
        { label: 'My submissions', onClick: () => { onClose(); onMySubmissions(); } },
        { label: 'Sign out', onClick: () => { onClose(); window.FSDDStore.signOut(); }, danger: true },
      ].map((it, i) => (
        <button key={i} onClick={it.onClick} style={{
          display: 'block', width: '100%', textAlign: 'left',
          appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: SB_FONTS.brand, fontSize: 13.5, fontWeight: it.accent ? 600 : 500,
          color: it.danger ? '#b04a3a' : SB_COLORS.ink,
          padding: '8px 12px', borderRadius: 6,
        }} onMouseEnter={(e) => e.currentTarget.style.background = SB_COLORS.paperAlt}
           onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function SB_Nav({ t }) {
  const compact = t && t.navDensity === 'compact';
  return (
    <nav style={{ borderBottom: `1px solid ${SB_COLORS.rule}`, background: SB_COLORS.paper }}>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'stretch',
        maxWidth: 1400, margin: '0 auto', padding: '0 28px', flexWrap: 'nowrap',
      }}>
        {window.NAV_SECTIONS.map((s) => {
          const active = s === 'FilmStack Calendar';
          return (
            <div key={s} style={{
              padding: compact ? '10px 11px' : '12px 14px',
              fontFamily: SB_FONTS.brand,
              fontSize: compact ? 12.5 : 13.5,
              fontWeight: active ? 700 : 500,
              color: active ? SB_COLORS.ink : SB_COLORS.inkSoft,
              borderBottom: active ? `3px solid ${SB_COLORS.ink}` : '3px solid transparent',
              marginBottom: -1, cursor: 'pointer', letterSpacing: -0.1,
              whiteSpace: 'nowrap',
            }}>{s}</div>
          );
        })}
      </div>
    </nav>
  );
}

function SB_TitleBlock({ user, onSubmit }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 32px 32px', textAlign: 'center' }}>
      <h1 style={{
        fontFamily: SB_FONTS.brand, fontSize: 52, lineHeight: 1.08,
        margin: 0, fontWeight: 800, letterSpacing: -1.4, color: SB_COLORS.ink
      }}>
        FilmStack Calendar
      </h1>
      <div style={{
        fontFamily: SB_FONTS.brand, fontSize: 19, fontWeight: 400,
        color: SB_COLORS.mute, marginTop: 18, lineHeight: 1.4,
        maxWidth: 560, marginLeft: 'auto', marginRight: 'auto'
      }}>
        All of what's happening that might be of interest to cinema-makers,
        cinema lovers, and the cinema curious…
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 8, marginTop: 22, fontFamily: SB_FONTS.brand, fontSize: 12.5, color: SB_COLORS.mute, fontWeight: 500, letterSpacing: 0.04 }}>
        <span>Updated weekly</span>
        <span style={{ color: SB_COLORS.rule }}>│</span>
        <button style={{
          appearance: 'none', cursor: 'pointer',
          fontFamily: SB_FONTS.brand, fontSize: 12.5, fontWeight: 600,
          background: 'transparent', color: SB_COLORS.ink,
          border: 'none', padding: 0,
          textDecoration: 'underline', textUnderlineOffset: 3
        }}>Subscribe to FilmStack Daily Digest</button>
      </div>
      <div style={{ marginTop: 36, height: 1, background: SB_COLORS.rule }} />
    </div>);

}

// ───────────────────── This-week strip ─────────────────────
function SB_ThisWeek({ events }) {
  if (!events.length) return null;
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px 12px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 14
      }}>
        <h2 style={{
          fontFamily: SB_FONTS.brand, fontSize: 20, fontWeight: 700,
          color: SB_COLORS.ink, margin: 0, letterSpacing: -0.3
        }}>This week</h2>
        <span style={{ fontFamily: SB_FONTS.brand, fontSize: 13, color: SB_COLORS.mute }}>
          {events.length} happening{events.length !== 1 ? 's' : ''} through Sun May 31
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {events.map((e, i) => {
          const d = new Date(e.sortDate + 'T12:00:00');
          const dow = d.toLocaleString('en-US', { weekday: 'short' });
          const mon = d.toLocaleString('en-US', { month: 'short' });
          const day = d.getDate();
          const c = SB_SECTION_COLOR(e.section);
          const tint = SB_SECTION_TINT(e.section);
          return (
            <div key={i} style={{
              flex: '0 0 auto', width: 260,
              background: SB_COLORS.paper,
              border: `1px solid ${SB_COLORS.rule}`,
              borderRadius: 8, padding: '14px 16px',
              display: 'flex', gap: 14, cursor: 'pointer'
            }}>
              <div style={{
                textAlign: 'center', flexShrink: 0,
                background: SB_COLORS.paperAlt, border: `1px solid ${SB_COLORS.rule}`,
                padding: '6px 10px', borderRadius: 6, minWidth: 56
              }}>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 11, letterSpacing: 0.08,
                  color: SB_COLORS.mute, fontWeight: 600, textTransform: 'uppercase'
                }}>{dow}</div>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 28, lineHeight: 1,
                  fontWeight: 800, color: SB_COLORS.ink, letterSpacing: -0.6,
                  marginTop: 2, fontVariantNumeric: 'tabular-nums'
                }}>{day}</div>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 11, letterSpacing: 0.08,
                  color: SB_COLORS.mute, fontWeight: 600, textTransform: 'uppercase',
                  marginTop: 2
                }}>{mon}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  display: 'inline-block',
                  fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 600,
                  color: c, background: tint, padding: '2px 7px', borderRadius: 999,
                  marginBottom: 6, letterSpacing: 0.04
                }}>{e.sectionLabel}</div>
                {e.status === 'pending' && <SB_PendingChip />}
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 14.5, fontWeight: 600,
                  lineHeight: 1.25, color: SB_COLORS.ink, letterSpacing: -0.2,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{e.title}</div>
                <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 12.5, color: SB_COLORS.mute,
                  marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{e.location}</div>
              </div>
            </div>);

        })}
      </div>
    </div>);

}

function SB_PendingChip() {
  return (
    <span style={{
      display: 'inline-block', marginLeft: 6,
      fontFamily: SB_FONTS.brand, fontSize: 10.5, fontWeight: 700,
      color: SB_COLORS.warning, background: SB_COLORS.warningTint,
      padding: '2px 7px', borderRadius: 999, letterSpacing: 0.04,
      verticalAlign: 'middle', marginBottom: 6
    }}>Pending</span>);

}

// ───────────────────── Filter bar ─────────────────────
function SB_FilterBar({ section, setSection, showPast, setShowPast, cities, setCities, view, setView, counts, resultCount, stuck }) {
  const tabs = [
  { id: 'all', label: 'All' },
  { id: 'screenings', label: 'Screenings' },
  { id: 'events', label: 'Events' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'actions', label: 'Actions' }];

  // City checkbox options. Stored values are the canonical city names that
  // also live on each event's `city` field — display labels can differ
  // (e.g. label "NYC", value "New York").
  const cityOpts = [
    { value: 'New York',    label: 'NYC' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'Online',      label: 'Online' },
  ];
  const toggleCity = (v) => setCities((prev) => {
    const next = new Set(prev);
    next.has(v) ? next.delete(v) : next.add(v);
    return next;
  });

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      background: stuck ? 'rgba(255,255,255,0.94)' : SB_COLORS.paper,
      backdropFilter: stuck ? 'blur(10px)' : 'none',
      borderTop: `1px solid ${SB_COLORS.rule}`,
      borderBottom: `1px solid ${SB_COLORS.rule}`,
      boxShadow: stuck ? '0 10px 24px -22px rgba(0,0,0,0.35)' : 'none',
      transition: 'box-shadow .2s, background .2s'
    }}>
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '12px 32px',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {tabs.map((t) => {
            const active = section === t.id;
            const c = t.id === 'all' ? SB_COLORS.ink : SB_SECTION_COLOR(t.id);
            return (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: SB_FONTS.brand, fontSize: 14, fontWeight: active ? 700 : 500,
                color: active ? SB_COLORS.ink : SB_COLORS.inkSoft,
                padding: '6px 4px', margin: '0 8px',
                borderBottom: active ? `2px solid ${SB_COLORS.ink}` : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                {t.id !== 'all' && <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: c,
                  display: 'inline-block', opacity: active ? 1 : 0.7
                }} />}
                {t.label}
                <span style={{
                  fontFamily: SB_FONTS.brand, fontSize: 12, fontWeight: 500, color: SB_COLORS.mute
                }}>{counts[t.id] || 0}</span>
              </button>);

          })}
        </div>
        <span style={{ width: 1, height: 22, background: SB_COLORS.rule, margin: '0 6px' }} />
        <button onClick={() => setShowPast(!showPast)} style={{
          appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: SB_FONTS.brand, fontSize: 14, fontWeight: showPast ? 600 : 500,
          color: showPast ? SB_COLORS.ink : SB_COLORS.mute, padding: 0,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span style={{
            width: 28, height: 16, borderRadius: 8, padding: 2,
            background: showPast ? SB_COLORS.ink : '#d6d6d6',
            display: 'inline-flex', alignItems: 'center', transition: 'background .15s'
          }}>
            <span style={{
              width: 12, height: 12, borderRadius: '50%', background: '#fff',
              transform: `translateX(${showPast ? 12 : 0}px)`, transition: 'transform .15s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
            }} />
          </span>
          Show past
        </button>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', border: `1px solid ${SB_COLORS.rule}`, borderRadius: 999,
          overflow: 'hidden', background: SB_COLORS.paperAlt
        }}>
          {[
          { id: 'list', label: 'List' },
          { id: 'calendar', label: 'Calendar' }].
          map((v) =>
          <button key={v.id} onClick={() => setView(v.id)} style={{
            appearance: 'none', cursor: 'pointer',
            fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: view === v.id ? 600 : 500,
            padding: '6px 16px', border: 'none',
            background: view === v.id ? SB_COLORS.ink : 'transparent',
            color: view === v.id ? SB_COLORS.paper : SB_COLORS.inkSoft
          }}>{v.label}</button>
          )}
        </div>
      </div>

      {/* City filter row — multi-select checkboxes (all checked by default) */}
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '0 32px 12px',
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        borderTop: `1px dashed ${SB_COLORS.ruleSoft}`, paddingTop: 10,
      }}>
        <span style={{
          fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 700,
          color: SB_COLORS.mute, letterSpacing: 0.08, textTransform: 'uppercase',
        }}>Place</span>
        {cityOpts.map((c) => {
          const checked = cities.has(c.value);
          return (
            <label key={c.value} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              fontFamily: SB_FONTS.brand, fontSize: 13.5, fontWeight: checked ? 600 : 500,
              color: checked ? SB_COLORS.ink : SB_COLORS.inkSoft,
              userSelect: 'none',
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: 4,
                border: `1.5px solid ${checked ? SB_COLORS.ink : '#cfcfcf'}`,
                background: checked ? SB_COLORS.ink : SB_COLORS.paper,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .12s, border-color .12s',
              }}>
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.5l2.4 2.4L10 3.5"/>
                  </svg>
                )}
              </span>
              <input type="checkbox" checked={checked} onChange={() => toggleCity(c.value)}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
              {c.label}
            </label>
          );
        })}
        <span style={{ flex: 1 }} />
        {cities.size < cityOpts.length && (
          <button onClick={() => setCities(new Set(cityOpts.map((c) => c.value)))} style={{
            appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: SB_FONTS.brand, fontSize: 12, fontWeight: 600, color: SB_COLORS.mute,
            padding: 0, textDecoration: 'underline', textUnderlineOffset: 3,
          }}>Select all</button>
        )}
      </div>

      {stuck &&
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '0 32px 8px',
        fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute
      }}>
          Showing {resultCount} {resultCount === 1 ? 'listing' : 'listings'} · sorted by date
        </div>
      }
    </div>);

}

// ───────────────────── List view ─────────────────────
function SB_ListView({ weeks, expanded, toggle, user }) {
  if (!weeks.length) {
    return (
      <div style={{
        padding: '80px 0', textAlign: 'center',
        fontFamily: SB_FONTS.brand, fontSize: 17, color: SB_COLORS.mute
      }}>
        Nothing matches that filter. Try widening the net.
      </div>);

  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {weeks.map((w) =>
      <div key={w.weekStart.toISOString()}>
          <div style={{
          display: 'flex', alignItems: 'baseline', gap: 14, paddingBottom: 14,
          borderBottom: `1px solid ${SB_COLORS.rule}`, marginBottom: 16
        }}>
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 24, fontWeight: 700,
            letterSpacing: -0.4, color: SB_COLORS.ink
          }}>{w.label}</div>
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 14, color: SB_COLORS.mute
          }}>· {w.events.length} item{w.events.length !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {w.events.map((e) =>
          <SB_EventCard key={(e.id || '') + e.sortDate + e.title}
          event={e} open={expanded.has((e.id || '') + e.sortDate + e.title)}
          onToggle={() => toggle((e.id || '') + e.sortDate + e.title)} user={user} />
          )}
          </div>
        </div>
      )}
    </div>);

}

function SB_EventCard({ event: e, open, onToggle, user }) {
  const color = SB_SECTION_COLOR(e.section);
  const tint = SB_SECTION_TINT(e.section);
  const d = new Date(e.sortDate + 'T12:00:00');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const dow = d.toLocaleString('en-US', { weekday: 'short' });
  const time = e.dateDisplay.includes('·') ? e.dateDisplay.split('·')[1].trim() : e.urgency === 'rolling' || e.urgency === 'ongoing' ? e.dateDisplay : '';
  const isRolling = e.urgency === 'rolling' || e.urgency === 'ongoing';
  const isPending = e.status === 'pending';
  const [hover, setHover] = React.useState(false);
  const canModerate = user && user.role === 'Editor';
  const canDelete = user && e.id && (e.submittedBy === user.email || canModerate);

  return (
    <div onClick={onToggle}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    style={{
      background: SB_COLORS.paper,
      border: `1px solid ${SB_COLORS.rule}`,
      borderRadius: 8, padding: '16px 18px',
      cursor: 'pointer',
      gridColumn: open ? 'span 2' : 'span 1',
      transition: 'box-shadow .15s, border-color .15s',
      boxShadow: hover ? '0 6px 22px -14px rgba(0,0,0,0.25)' : 'none',
      position: 'relative',
      opacity: isPending ? 0.92 : 1
    }}>
      {isPending &&
      <div style={{
        position: 'absolute', top: -1, left: -1, right: -1,
        height: 3, background: SB_COLORS.warning, borderTopLeftRadius: 8, borderTopRightRadius: 8
      }} />
      }
      <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 16 }}>
        <div style={{
          background: SB_COLORS.paperAlt, border: `1px solid ${SB_COLORS.rule}`,
          padding: '8px 8px', textAlign: 'center', alignSelf: 'start', borderRadius: 8
        }}>
          {isRolling ?
          <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 13, color: SB_COLORS.ink,
            lineHeight: 1.2, padding: '14px 0', fontWeight: 700, letterSpacing: -0.1
          }}>{e.urgency === 'rolling' ? 'Rolling' : 'Ongoing'}</div> :

          <>
              <div style={{
              fontFamily: SB_FONTS.brand, fontSize: 11, letterSpacing: 0.06,
              color: SB_COLORS.mute, fontWeight: 600, textTransform: 'uppercase'
            }}>{dow}</div>
              <div style={{
              fontFamily: SB_FONTS.brand, fontSize: 32, lineHeight: 1,
              fontWeight: 800, color: SB_COLORS.ink, letterSpacing: -0.9,
              marginTop: 2, fontVariantNumeric: 'tabular-nums'
            }}>{day}</div>
              <div style={{
              fontFamily: SB_FONTS.brand, fontSize: 11, letterSpacing: 0.06,
              color: SB_COLORS.mute, fontWeight: 600, textTransform: 'uppercase', marginTop: 1
            }}>{mon}</div>
            </>
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 600, letterSpacing: 0.04,
              color: color, background: tint, padding: '2px 8px', borderRadius: 999
            }}>{e.sectionLabel}</span>
            {e.urgency === 'today' &&
            <span style={{
              fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 700,
              color: SB_COLORS.paper, background: SB_COLORS.ink,
              padding: '2px 8px', borderRadius: 999, letterSpacing: 0.04
            }}>Tonight</span>
            }
            {isPending &&
            <span style={{
              fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 700,
              color: SB_COLORS.warning, background: SB_COLORS.warningTint,
              padding: '2px 8px', borderRadius: 999, letterSpacing: 0.04
            }}>Pending review</span>
            }
            <div style={{ flex: 1 }} />
            <span style={{
              fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute,
              opacity: hover ? 1 : 0.55, transition: 'opacity .15s'
            }}>{open ? '− Close' : '+ Read more'}</span>
          </div>
          <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 18.5, fontWeight: 700,
            lineHeight: 1.25, color: SB_COLORS.ink, letterSpacing: -0.3,
            marginBottom: 6, textWrap: 'pretty'
          }}>{e.title}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            fontFamily: SB_FONTS.brand, fontSize: 13.5, color: SB_COLORS.inkSoft
          }}>
            <span>{e.location}</span>
            {time && !isRolling &&
            <>
                <span style={{ color: SB_COLORS.mute }}>·</span>
                <span style={{ color: SB_COLORS.mute, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
              </>
            }
          </div>
        </div>
      </div>

      {open &&
      <div style={{
        marginTop: 16, paddingTop: 16, borderTop: `1px solid ${SB_COLORS.rule}`,
        display: 'grid', gridTemplateColumns: '1fr 200px', gap: 28
      }}>
          <div>
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 14.5, lineHeight: 1.55,
            color: SB_COLORS.inkSoft, textWrap: 'pretty'
          }}>{e.desc}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {(e.links || []).map((l, i) =>
            <a key={i} href={l.url} onClick={(ev) => ev.preventDefault()} style={{
              fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
              color: SB_COLORS.paper, background: SB_COLORS.ink,
              padding: '7px 14px', borderRadius: 999, letterSpacing: -0.1,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
            }}>{l.label}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4" /></svg>
                </a>
            )}
              <button onClick={(ev) => {ev.stopPropagation();window.CalUtils.downloadICS(e);}} style={{
              appearance: 'none', border: `1px solid ${SB_COLORS.rule}`,
              background: SB_COLORS.paper, cursor: 'pointer',
              fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
              color: SB_COLORS.inkSoft, padding: '6px 12px', borderRadius: 999,
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="10" height="9" rx="1" /><path d="M2 5.5h10M5 1.5v3M9 1.5v3" /></svg>
                Add to calendar
              </button>
              {canModerate && isPending &&
            <>
                  <button onClick={(ev) => {ev.stopPropagation();window.FSDDStore.setSubmissionStatus(e.id, 'published');}} style={{
                appearance: 'none', border: 'none', cursor: 'pointer',
                background: SB_SECTION_COLOR('events'), color: SB_COLORS.paper,
                fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
                padding: '7px 14px', borderRadius: 999
              }}>✓ Publish</button>
                  <button onClick={(ev) => {ev.stopPropagation();window.FSDDStore.setSubmissionStatus(e.id, 'rejected');}} style={{
                appearance: 'none', border: `1px solid ${SB_COLORS.rule}`, cursor: 'pointer',
                background: SB_COLORS.paper, color: SB_COLORS.inkSoft,
                fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
                padding: '6px 12px', borderRadius: 999
              }}>Reject</button>
                </>
            }
              {canDelete &&
            <button onClick={(ev) => {
              ev.stopPropagation();
              if (confirm('Delete this submission?')) window.FSDDStore.deleteSubmission(e.id);
            }} style={{
              appearance: 'none', border: `1px solid ${SB_COLORS.rule}`, cursor: 'pointer',
              background: SB_COLORS.paper, color: '#b04a3a',
              fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
              padding: '6px 12px', borderRadius: 999, marginLeft: 'auto'
            }}>Delete</button>
            }
            </div>
          </div>
          <div style={{
          background: SB_COLORS.paperAlt, padding: 14, alignSelf: 'start', borderRadius: 8,
          border: `1px solid ${SB_COLORS.rule}`
        }}>
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 600,
            color: SB_COLORS.mute, textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 6
          }}>Filed by</div>
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 24, fontWeight: 800,
            color: SB_COLORS.ink, lineHeight: 1, marginBottom: 4, letterSpacing: -0.5
          }}>{e.credit}</div>
            {e.submittedByName &&
          <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute, marginBottom: 8
          }}>{e.submittedByName}</div>
          }
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 600,
            color: SB_COLORS.mute, textTransform: 'uppercase', letterSpacing: 0.06, marginTop: 8
          }}>Venue</div>
            <div style={{
            fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
            color: SB_COLORS.ink, marginTop: 2
          }}>{e.venue}</div>
          </div>
        </div>
      }
    </div>);

}

// ───────────────────── Calendar grid ─────────────────────
function SB_CalendarView({ events, monthOffset, setMonthOffset }) {
  const base = new Date(window.TODAY);base.setDate(1);
  base.setMonth(base.getMonth() + monthOffset);
  const monthName = base.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(base.getFullYear(), base.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.filter((e) => e.sortDate === iso);
    cells.push({ d, iso, dayEvents, isToday: iso === window.TODAY.toISOString().slice(0, 10) });
  }
  while (cells.length % 7 !== 0) cells.push({ blank: true });

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 18,
        borderBottom: `1px solid ${SB_COLORS.rule}`
      }}>
        <div style={{
          fontFamily: SB_FONTS.brand, fontSize: 28, fontWeight: 800,
          letterSpacing: -0.6, color: SB_COLORS.ink
        }}>{monthName}</div>
        <div style={{ flex: 1 }} />
        {[
        { label: '← Prev', onClick: () => setMonthOffset(monthOffset - 1), primary: false },
        { label: 'Today', onClick: () => setMonthOffset(0), primary: monthOffset !== 0 },
        { label: 'Next →', onClick: () => setMonthOffset(monthOffset + 1), primary: false }].
        map((b, i) =>
        <button key={i} onClick={b.onClick} style={{
          appearance: 'none', cursor: 'pointer',
          fontFamily: SB_FONTS.brand, fontSize: 13, fontWeight: 600,
          padding: '6px 14px', borderRadius: 999,
          background: b.primary ? SB_COLORS.ink : SB_COLORS.paper,
          color: b.primary ? SB_COLORS.paper : SB_COLORS.inkSoft,
          border: b.primary ? 'none' : `1px solid ${SB_COLORS.rule}`
        }}>{b.label}</button>
        )}
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        background: SB_COLORS.paper, marginTop: 16,
        border: `1px solid ${SB_COLORS.rule}`, borderRadius: 8, overflow: 'hidden'
      }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) =>
        <div key={d} style={{
          padding: '10px 12px', fontFamily: SB_FONTS.brand, fontSize: 12,
          fontWeight: 600, color: SB_COLORS.mute, textTransform: 'uppercase',
          letterSpacing: 0.06, background: SB_COLORS.paperAlt,
          borderBottom: `1px solid ${SB_COLORS.rule}`,
          borderRight: i !== 6 ? `1px solid ${SB_COLORS.rule}` : 'none'
        }}>{d}</div>
        )}
        {cells.map((c, i) =>
        <div key={i} style={{
          minHeight: 118, padding: '10px 12px',
          borderRight: i % 7 !== 6 ? `1px solid ${SB_COLORS.rule}` : 'none',
          borderBottom: `1px solid ${SB_COLORS.rule}`,
          background: c.isToday ? SB_COLORS.paperAlt : SB_COLORS.paper
        }}>
            {!c.blank &&
          <>
                <div style={{
              fontFamily: SB_FONTS.brand, fontSize: 16,
              fontWeight: c.isToday ? 800 : 600,
              color: SB_COLORS.ink, letterSpacing: -0.2, marginBottom: 4,
              fontVariantNumeric: 'tabular-nums'
            }}>
                  {c.d}{c.isToday && <span style={{ fontFamily: SB_FONTS.brand, fontSize: 10.5, fontWeight: 700, marginLeft: 6, color: SB_COLORS.warning, textTransform: 'uppercase', letterSpacing: 0.06 }}>· today</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {c.dayEvents.slice(0, 3).map((e, j) =>
              <div key={j} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 500,
                color: SB_COLORS.inkSoft,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
              }}>
                      <span style={{
                  flex: '0 0 5px', width: 5, height: 5, borderRadius: '50%',
                  background: SB_SECTION_COLOR(e.section)
                }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
                    </div>
              )}
                  {c.dayEvents.length > 3 &&
              <div style={{
                fontFamily: SB_FONTS.brand, fontSize: 10.5, color: SB_COLORS.mute,
                paddingLeft: 10, fontWeight: 500
              }}>+ {c.dayEvents.length - 3} more</div>
              }
                </div>
              </>
          }
          </div>
        )}
      </div>
    </div>);

}

// ───────────────────── Map view ─────────────────────
function SB_MapView({ events }) {
  const venuePositions = {
    'Bushwick Daily': { x: 0.72, y: 0.46 },
    'Anthology Film Archives': { x: 0.42, y: 0.56 },
    'Powerhouse Arts': { x: 0.50, y: 0.66 },
    'Spectacle Theater': { x: 0.62, y: 0.50 },
    'Light Industry': { x: 0.58, y: 0.40 },
    'The Public Theater': { x: 0.41, y: 0.55 },
    'IFC Center': { x: 0.36, y: 0.55 },
    'WTF-Stop': { x: 0.43, y: 0.58 },
    'Maysles Documentary Center': { x: 0.38, y: 0.28 },
    'Metrograph': { x: 0.43, y: 0.59 },
    'Roxie Theater': { x: 0.08, y: 0.70 },
    'BAM': { x: 0.57, y: 0.64 },
    'FiveMyles Gallery': { x: 0.60, y: 0.62 },
    'Pier 7': { x: 0.50, y: 0.62 },
    'Museum of Modern Art': { x: 0.39, y: 0.42 },
    'Rooftop Films': { x: 0.55, y: 0.55 },
    'Reanimation Library': { x: 0.55, y: 0.66 },
    'Cinepoesia': { x: 0.60, y: 0.60 },
    'Mono No Aware': { x: 0.52, y: 0.72 }
  };
  const [hovered, setHovered] = React.useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
      <div style={{
        position: 'relative', height: 580,
        border: `1px solid ${SB_COLORS.rule}`, borderRadius: 8,
        background: SB_COLORS.paperAlt, overflow: 'hidden'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="sbv3-gridmap" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="0.5" fill="rgba(0,0,0,0.08)" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#sbv3-gridmap)" />
          <path d="M -2 70 Q 25 60 35 65 T 65 50 T 102 30" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2.2" />
          <path d="M -2 75 Q 25 65 35 70 T 65 55 T 102 35" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
        </svg>
        {events.map((e, i) => {
          const p = venuePositions[e.venue] || { x: 0.5 + i * 13 % 40 / 100, y: 0.3 + i * 17 % 50 / 100 };
          const c = SB_SECTION_COLOR(e.section);
          const isHovered = hovered === i;
          return (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute', left: `${p.x * 100}%`, top: `${p.y * 100}%`,
              transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: isHovered ? 5 : 1
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: c,
                border: `2px solid ${SB_COLORS.paper}`,
                boxShadow: `0 0 0 1px ${c}, 0 2px 6px rgba(0,0,0,0.18)`,
                transform: isHovered ? 'scale(1.35)' : 'scale(1)', transition: 'transform .15s'
              }} />
              {isHovered &&
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                background: SB_COLORS.paper, borderRadius: 8,
                border: `1px solid ${SB_COLORS.rule}`,
                padding: '10px 12px', minWidth: 200, maxWidth: 260,
                boxShadow: '0 10px 24px rgba(0,0,0,0.16)'
              }}>
                  <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 600,
                  color: c, background: SB_SECTION_TINT(e.section),
                  padding: '2px 7px', borderRadius: 999, display: 'inline-block',
                  marginBottom: 6, letterSpacing: 0.04
                }}>{e.sectionLabel}</div>
                  <div style={{
                  fontFamily: SB_FONTS.brand, fontSize: 14.5, fontWeight: 700,
                  color: SB_COLORS.ink, lineHeight: 1.25, marginBottom: 4, letterSpacing: -0.2
                }}>{e.title}</div>
                  <div style={{ fontFamily: SB_FONTS.brand, fontSize: 12.5, color: SB_COLORS.mute }}>{e.dateDisplay}</div>
                </div>
              }
            </div>);

        })}
      </div>
      <div>
        <div style={{
          fontFamily: SB_FONTS.brand, fontSize: 14, fontWeight: 700,
          color: SB_COLORS.ink, marginBottom: 12
        }}>{events.length} venues mapped</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {events.map((e, i) =>
          <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === i ? SB_COLORS.paperAlt : SB_COLORS.paper,
            border: `1px solid ${SB_COLORS.rule}`,
            borderLeft: `3px solid ${SB_SECTION_COLOR(e.section)}`,
            padding: '10px 12px', cursor: 'pointer', borderRadius: 6,
            transition: 'background .15s'
          }}>
              <div style={{ fontFamily: SB_FONTS.brand, fontSize: 13.5, fontWeight: 600, color: SB_COLORS.ink, marginBottom: 2 }}>{e.venue}</div>
              <div style={{ fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute }}>{e.location} · {e.dateDisplay.split('·')[0].trim()}</div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ───────────────────── Footer ─────────────────────
function SB_Footer() {
  return (
    <div style={{
      padding: '40px 32px 48px', borderTop: `1px solid ${SB_COLORS.rule}`,
      background: SB_COLORS.paperAlt
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 56 }}>
          <div>
            <h3 style={{ fontFamily: SB_FONTS.brand, fontSize: 16, fontWeight: 700, color: SB_COLORS.ink, margin: '0 0 14px' }}>Contributors</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px 18px' }}>
              {window.CONTRIBUTORS.map((c) =>
              <div key={c.initials} style={{ fontFamily: SB_FONTS.brand, fontSize: 13, color: SB_COLORS.inkSoft }}>
                  <span style={{
                  fontFamily: SB_FONTS.brand, fontSize: 11, fontWeight: 700, color: SB_COLORS.ink,
                  marginRight: 7, padding: '1px 6px', background: SB_COLORS.paper,
                  border: `1px solid ${SB_COLORS.rule}`, borderRadius: 4, letterSpacing: 0.04
                }}>{c.initials}</span>{c.name}
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: SB_FONTS.brand, fontSize: 16, fontWeight: 700, color: SB_COLORS.ink, margin: '0 0 14px' }}>Contact</h3>
            <div style={{ fontFamily: SB_FONTS.brand, fontSize: 13, color: SB_COLORS.inkSoft, lineHeight: 1.7 }}>
              <div>General · <a href="#" onClick={(e) => e.preventDefault()} style={{ color: SB_COLORS.ink, textDecoration: 'underline' }}>filmstackdailydigest@gmail.com</a></div>
              <div>Submit events · <a href="#" onClick={(e) => e.preventDefault()} style={{ color: SB_COLORS.ink, textDecoration: 'underline' }}>filmstackcalendar@gmail.com</a></div>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 32, paddingTop: 16, borderTop: `1px solid ${SB_COLORS.rule}`,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: SB_FONTS.brand, fontSize: 12, color: SB_COLORS.mute
        }}>
          <span>© FilmStack Daily Digest — A reader-supported newsletter</span>
          <span>Updated weekly</span>
        </div>
      </div>
    </div>);

}

window.FilmStackCalendarApp = FilmStackCalendarApp;