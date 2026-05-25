// Modals: sign-in, submit-event, my-submissions.
// All use the localStorage-backed FSDDStore.

function SB_ModalShell({ onClose, width = 480, children, title, subtitle }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20, 20, 20, 0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '7vh 24px 24px', overflowY: 'auto',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 14, maxWidth: width, width: '100%',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)', position: 'relative',
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: 14, right: 14, width: 28, height: 28,
          border: 'none', background: 'transparent', cursor: 'pointer',
          borderRadius: '50%', color: '#737373', fontSize: 18, lineHeight: 1,
        }}>×</button>
        {title && (
          <div style={{ padding: '24px 28px 14px' }}>
            <h2 style={{
              fontFamily: 'inherit', fontSize: 24, fontWeight: 800,
              letterSpacing: -0.6, margin: 0, color: '#1a1a1a',
            }}>{title}</h2>
            {subtitle && <p style={{
              fontFamily: 'inherit', fontSize: 14, color: '#737373',
              margin: '6px 0 0', lineHeight: 1.5,
            }}>{subtitle}</p>}
          </div>
        )}
        <div style={{ padding: '0 28px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ───────────────────── Admin sign-in + add-event ─────────────────────
// Two-step modal: (1) password unlock → (2) event form. Used for the
// "Admin Sign-In" link in the top bar.
function SB_AdminSignInModal({ onClose }) {
  const [step, setStep] = React.useState('password'); // password | form | done
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({
    section: 'screenings',
    title: '', sponsor: '', sortDate: '', time: '', location: '', linkUrl: '',
  });
  const [submitted, setSubmitted] = React.useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sections = [
    { id: 'screenings', label: 'Screening', tint: '#eef2fb', color: 'oklch(0.50 0.18 250)' },
    { id: 'events',     label: 'Event',     tint: '#eef6ef', color: 'oklch(0.52 0.14 152)' },
    { id: 'deadlines',  label: 'Deadline',  tint: '#fbf2e8', color: 'oklch(0.58 0.16 48)' },
    { id: 'actions',    label: 'Action',    tint: '#f4eef9', color: 'oklch(0.50 0.16 300)' },
  ];

  const doSignIn = (ev) => {
    ev?.preventDefault(); setError('');
    try { window.FSDDStore.signInAdmin(password); setStep('form'); }
    catch (err) { setError(err.message); }
  };

  const doSubmit = (ev) => {
    ev?.preventDefault(); setError('');
    if (!form.title.trim()) return setError('Event title is required.');
    if (!form.sortDate) return setError('Date is required.');
    if (!form.location.trim()) return setError('Location is required (or type "Online").');

    const sectionMeta = sections.find((s) => s.id === form.section);
    const d = new Date(form.sortDate + 'T12:00:00');
    const monShort = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    const dateDisplay = form.time.trim()
      ? `${monShort} ${day} · ${form.time.trim()}`
      : `${monShort} ${day}`;

    const today = new Date(window.TODAY); today.setHours(0, 0, 0, 0);
    const eDate = new Date(form.sortDate); eDate.setHours(0, 0, 0, 0);
    const diff = Math.round((eDate - today) / 86400000);
    let urgency = 'upcoming';
    if (diff < 0) urgency = 'past';
    else if (diff === 0) urgency = 'today';
    else if (diff <= 7) urgency = 'soon';

    try {
      const saved = window.FSDDStore.addSubmission({
        section: form.section,
        sectionLabel: sectionMeta.label,
        title: form.title.trim(),
        venue: form.sponsor.trim() || form.location.trim(),
        location: form.location.trim(),
        sortDate: form.sortDate,
        dateDisplay, urgency,
        desc: form.sponsor.trim() ? `Sponsored by ${form.sponsor.trim()}.` : '',
        links: form.linkUrl.trim() ? [{ label: 'Tickets', url: form.linkUrl.trim() }] : [],
      });
      setSubmitted(saved); setStep('done');
    } catch (err) { setError(err.message); }
  };

  if (step === 'password') {
    return (
      <SB_ModalShell onClose={onClose} width={420}
        title="Admin Sign-In"
        subtitle="Enter the admin password to add an event to the calendar.">
        <form onSubmit={doSignIn}>
          <SB_Field label="Password">
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" placeholder="Admin password" autoFocus
              style={SB_INPUT_STYLE} />
          </SB_Field>
          {error && <div style={{
            fontFamily: 'inherit', fontSize: 13, color: '#b04a3a',
            background: '#fbeae6', padding: '8px 12px', borderRadius: 8, marginBottom: 12,
          }}>{error}</div>}
          <button type="submit" style={{
            appearance: 'none', cursor: 'pointer', width: '100%',
            background: '#1a1a1a', color: '#fff', border: 'none',
            padding: '12px 16px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1,
          }}>Unlock</button>
          <div style={{
            fontFamily: 'inherit', fontSize: 12, color: '#737373',
            textAlign: 'center', marginTop: 14, lineHeight: 1.5,
          }}>
            Demo password: <code style={{
              fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12,
              background: '#fafafa', border: '1px solid #e6e6e6',
              padding: '1px 6px', borderRadius: 4, color: '#1a1a1a',
            }}>filmstack</code>
          </div>
        </form>
      </SB_ModalShell>
    );
  }

  if (step === 'done') {
    return (
      <SB_ModalShell onClose={onClose} width={440}
        title="✓ Event added"
        subtitle="Live on the FilmStack Calendar.">
        <div style={{
          background: '#fafafa', border: '1px solid #e6e6e6', borderRadius: 10, padding: 16, marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#737373',
            textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 4,
          }}>{submitted.sectionLabel}</div>
          <div style={{
            fontFamily: 'inherit', fontSize: 17, fontWeight: 700, color: '#1a1a1a',
            letterSpacing: -0.2, marginBottom: 4,
          }}>{submitted.title}</div>
          <div style={{ fontFamily: 'inherit', fontSize: 13, color: '#4a4a4a' }}>
            {submitted.dateDisplay} · {submitted.location}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => {
            setSubmitted(null);
            setForm({ section: 'screenings', title: '', sponsor: '', sortDate: '', time: '', location: '', linkUrl: '' });
            setStep('form');
          }} style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#fff', color: '#4a4a4a', border: '1px solid #e6e6e6',
            padding: '12px 16px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Add another</button>
          <button onClick={onClose} style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#1a1a1a', color: '#fff', border: 'none',
            padding: '12px 16px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Done</button>
        </div>
      </SB_ModalShell>
    );
  }

  // step === 'form'
  return (
    <SB_ModalShell onClose={onClose} width={560}
      title="Add an event"
      subtitle="Published immediately to the FilmStack Calendar.">
      <form onSubmit={doSubmit}>
        <SB_Field label="Section">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sections.map((s) => (
              <button key={s.id} type="button" onClick={() => set('section', s.id)} style={{
                appearance: 'none', cursor: 'pointer',
                background: form.section === s.id ? s.tint : '#fff',
                border: form.section === s.id ? `1px solid ${s.color}` : '1px solid #e6e6e6',
                color: form.section === s.id ? s.color : '#4a4a4a',
                padding: '6px 12px', borderRadius: 999,
                fontFamily: 'inherit', fontSize: 13, fontWeight: form.section === s.id ? 600 : 500,
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </SB_Field>

        <SB_Field label="Event title">
          <input value={form.title} onChange={(e) => set('title', e.target.value)}
            placeholder='e.g. "Daughters of the Dust" — 4K restoration'
            style={SB_INPUT_STYLE} autoFocus />
        </SB_Field>

        <SB_Field label="Event sponsor">
          <input value={form.sponsor} onChange={(e) => set('sponsor', e.target.value)}
            placeholder="e.g. Light Industry, Anthology Film Archives, Rooftop Films"
            style={SB_INPUT_STYLE} />
        </SB_Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SB_Field label="Date">
            <input type="date" value={form.sortDate} onChange={(e) => set('sortDate', e.target.value)}
              style={SB_INPUT_STYLE} />
          </SB_Field>
          <SB_Field label="Time">
            <input value={form.time} onChange={(e) => set('time', e.target.value)}
              placeholder="7:30 PM ET" style={SB_INPUT_STYLE} />
          </SB_Field>
        </div>

        <SB_Field label="Location / online">
          <input value={form.location} onChange={(e) => set('location', e.target.value)}
            placeholder='Neighborhood · City  —  or type "Online"' style={SB_INPUT_STYLE} />
        </SB_Field>

        <SB_Field label="Link">
          <input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
            placeholder="https://… (tickets, RSVP, submission page)" style={SB_INPUT_STYLE} />
        </SB_Field>

        {error && <div style={{
          fontFamily: 'inherit', fontSize: 13, color: '#b04a3a',
          background: '#fbeae6', padding: '8px 12px', borderRadius: 8, marginBottom: 12,
        }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" onClick={onClose} style={{
            appearance: 'none', cursor: 'pointer',
            background: '#fff', color: '#4a4a4a', border: '1px solid #e6e6e6',
            padding: '12px 18px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <button type="submit" style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#1a1a1a', color: '#fff', border: 'none',
            padding: '12px 18px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Add to calendar</button>
        </div>
      </form>
    </SB_ModalShell>
  );
}

// ───────────────────── Submit event ─────────────────────
function SB_SubmitEventModal({ onClose }) {
  const user = window.FSDDStore.getUser();
  const [form, setForm] = React.useState({
    section: 'screenings',
    title: '', sponsor: '', sortDate: '', time: '', location: '', linkUrl: '',
  });
  const [error, setError] = React.useState('');
  const [submitted, setSubmitted] = React.useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sections = [
    { id: 'screenings', label: 'Screening', tint: '#eef2fb', color: 'oklch(0.50 0.18 250)' },
    { id: 'events',     label: 'Event',     tint: '#eef6ef', color: 'oklch(0.52 0.14 152)' },
    { id: 'deadlines',  label: 'Deadline',  tint: '#fbf2e8', color: 'oklch(0.58 0.16 48)' },
    { id: 'actions',    label: 'Action',    tint: '#f4eef9', color: 'oklch(0.50 0.16 300)' },
  ];

  const submit = (e) => {
    e?.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Event title is required.');
    if (!form.sortDate) return setError('Date is required.');
    if (!form.location.trim()) return setError('Location is required (or type "Online").');

    const sectionMeta = sections.find((s) => s.id === form.section);
    const d = new Date(form.sortDate + 'T12:00:00');
    const monShort = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    const dateDisplay = form.time.trim()
      ? `${monShort} ${day} · ${form.time.trim()}`
      : `${monShort} ${day}`;

    const today = new Date(window.TODAY); today.setHours(0, 0, 0, 0);
    const ev = new Date(form.sortDate); ev.setHours(0, 0, 0, 0);
    const diff = Math.round((ev - today) / 86400000);
    let urgency = 'upcoming';
    if (diff < 0) urgency = 'past';
    else if (diff === 0) urgency = 'today';
    else if (diff <= 7) urgency = 'soon';

    try {
      const saved = window.FSDDStore.addSubmission({
        section: form.section,
        sectionLabel: sectionMeta.label,
        title: form.title.trim(),
        venue: form.sponsor.trim() || form.location.trim(),
        location: form.location.trim(),
        sortDate: form.sortDate,
        dateDisplay, urgency,
        desc: form.sponsor.trim() ? `Sponsored by ${form.sponsor.trim()}.` : '',
        links: form.linkUrl.trim() ? [{ label: 'Tickets', url: form.linkUrl.trim() }] : [],
      });
      setSubmitted(saved);
    } catch (err) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <SB_ModalShell onClose={onClose} width={440}
        title="✓ Event added"
        subtitle="Live on the FilmStack Calendar.">
        <div style={{
          background: '#fafafa', border: '1px solid #e6e6e6', borderRadius: 10, padding: 16, marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#737373',
            textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 4,
          }}>{submitted.sectionLabel}</div>
          <div style={{ fontFamily: 'inherit', fontSize: 17, fontWeight: 700, color: '#1a1a1a', letterSpacing: -0.2, marginBottom: 4 }}>{submitted.title}</div>
          <div style={{ fontFamily: 'inherit', fontSize: 13, color: '#4a4a4a' }}>{submitted.dateDisplay} · {submitted.location}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => {
            setSubmitted(null);
            setForm({ section: 'screenings', title: '', sponsor: '', sortDate: '', time: '', location: '', linkUrl: '' });
          }} style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#fff', color: '#4a4a4a', border: '1px solid #e6e6e6',
            padding: '12px 16px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Add another</button>
          <button onClick={onClose} style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#1a1a1a', color: '#fff', border: 'none',
            padding: '12px 16px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Done</button>
        </div>
      </SB_ModalShell>
    );
  }

  return (
    <SB_ModalShell onClose={onClose} width={560}
      title="Add an event"
      subtitle="Published immediately to the FilmStack Calendar.">
      <form onSubmit={submit}>
        <SB_Field label="Section">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sections.map((s) => (
              <button key={s.id} type="button" onClick={() => set('section', s.id)} style={{
                appearance: 'none', cursor: 'pointer',
                background: form.section === s.id ? s.tint : '#fff',
                border: form.section === s.id ? `1px solid ${s.color}` : '1px solid #e6e6e6',
                color: form.section === s.id ? s.color : '#4a4a4a',
                padding: '6px 12px', borderRadius: 999,
                fontFamily: 'inherit', fontSize: 13, fontWeight: form.section === s.id ? 600 : 500,
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </SB_Field>

        <SB_Field label="Event title">
          <input value={form.title} onChange={(e) => set('title', e.target.value)}
            placeholder='e.g. "Daughters of the Dust" — 4K restoration'
            style={SB_INPUT_STYLE} autoFocus />
        </SB_Field>

        <SB_Field label="Event sponsor">
          <input value={form.sponsor} onChange={(e) => set('sponsor', e.target.value)}
            placeholder="e.g. Light Industry, Anthology Film Archives, Rooftop Films"
            style={SB_INPUT_STYLE} />
        </SB_Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SB_Field label="Date">
            <input type="date" value={form.sortDate} onChange={(e) => set('sortDate', e.target.value)}
              style={SB_INPUT_STYLE} />
          </SB_Field>
          <SB_Field label="Time">
            <input value={form.time} onChange={(e) => set('time', e.target.value)}
              placeholder="7:30 PM ET" style={SB_INPUT_STYLE} />
          </SB_Field>
        </div>

        <SB_Field label="Location / online">
          <input value={form.location} onChange={(e) => set('location', e.target.value)}
            placeholder='Neighborhood · City  —  or type "Online"' style={SB_INPUT_STYLE} />
        </SB_Field>

        <SB_Field label="Link">
          <input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
            placeholder="https://… (tickets, RSVP, submission page)" style={SB_INPUT_STYLE} />
        </SB_Field>

        {error && <div style={{
          fontFamily: 'inherit', fontSize: 13, color: '#b04a3a',
          background: '#fbeae6', padding: '8px 12px', borderRadius: 8, marginBottom: 12,
        }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" onClick={onClose} style={{
            appearance: 'none', cursor: 'pointer',
            background: '#fff', color: '#4a4a4a', border: '1px solid #e6e6e6',
            padding: '12px 18px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <button type="submit" style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#1a1a1a', color: '#fff', border: 'none',
            padding: '12px 18px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Add to calendar</button>
        </div>
      </form>
    </SB_ModalShell>
  );
}

// ───────────────────── My submissions ─────────────────────
function SB_SubmissionsModal({ user, onClose }) {
  // Subscribe locally — useStore() lives in app-main.jsx's scope.
  const [, setTick] = React.useState(0);
  React.useEffect(() => window.FSDDStore.subscribe(() => setTick((t) => t + 1)), []);
  const all = window.FSDDStore.listSubmissions();
  const mine = user.role === 'Editor' ? all : all.filter((e) => e.submittedBy === user.email);
  mine.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));

  const statusStyle = (st) => ({
    published: { color: 'oklch(0.52 0.14 152)', bg: '#eef6ef', label: 'Published' },
    pending:   { color: 'oklch(0.55 0.16 70)',  bg: '#fff8e6', label: 'Pending'   },
    rejected:  { color: '#b04a3a',              bg: '#fbeae6', label: 'Rejected'  },
  }[st || 'pending']);

  return (
    <SB_ModalShell onClose={onClose} width={680}
      title={user.role === 'Editor' ? 'All submissions' : 'My submissions'}
      subtitle={user.role === 'Editor'
        ? 'Every event submitted through the calendar. Publish or reject pending items.'
        : 'Events you have submitted to the calendar.'}>
      {!mine.length ? (
        <div style={{
          textAlign: 'center', padding: '36px 24px', color: '#737373',
          fontFamily: 'inherit', fontSize: 14,
        }}>
          No submissions yet. Use “+ Submit event” to add the first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mine.map((e) => {
            const st = statusStyle(e.status);
            return (
              <div key={e.id} style={{
                border: '1px solid #e6e6e6', borderRadius: 10, padding: '12px 14px',
                background: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'inherit', fontSize: 10.5, fontWeight: 700,
                    color: st.color, background: st.bg, padding: '2px 8px',
                    borderRadius: 999, letterSpacing: 0.06, textTransform: 'uppercase',
                  }}>{st.label}</span>
                  <span style={{
                    fontFamily: 'inherit', fontSize: 10.5, fontWeight: 600,
                    color: '#737373', textTransform: 'uppercase', letterSpacing: 0.06,
                  }}>{e.sectionLabel}</span>
                  <span style={{ fontFamily: 'inherit', fontSize: 12, color: '#737373' }}>· {e.dateDisplay}</span>
                  {user.role === 'Editor' && e.submittedByName && (
                    <span style={{ fontFamily: 'inherit', fontSize: 12, color: '#737373' }}>· by {e.submittedByName}</span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'inherit', fontSize: 15.5, fontWeight: 700,
                  color: '#1a1a1a', letterSpacing: -0.2, marginBottom: 2,
                }}>{e.title}</div>
                <div style={{ fontFamily: 'inherit', fontSize: 13, color: '#4a4a4a', marginBottom: 10 }}>{e.location}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {user.role === 'Editor' && e.status === 'pending' && (
                    <>
                      <button onClick={() => window.FSDDStore.setSubmissionStatus(e.id, 'published')} style={{
                        appearance: 'none', cursor: 'pointer', border: 'none',
                        background: 'oklch(0.52 0.14 152)', color: '#fff',
                        padding: '6px 12px', borderRadius: 999,
                        fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                      }}>✓ Publish</button>
                      <button onClick={() => window.FSDDStore.setSubmissionStatus(e.id, 'rejected')} style={{
                        appearance: 'none', cursor: 'pointer', border: '1px solid #e6e6e6',
                        background: '#fff', color: '#4a4a4a',
                        padding: '5px 11px', borderRadius: 999,
                        fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                      }}>Reject</button>
                    </>
                  )}
                  {user.role === 'Editor' && e.status === 'published' && (
                    <button onClick={() => window.FSDDStore.setSubmissionStatus(e.id, 'pending')} style={{
                      appearance: 'none', cursor: 'pointer', border: '1px solid #e6e6e6',
                      background: '#fff', color: '#4a4a4a',
                      padding: '5px 11px', borderRadius: 999,
                      fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                    }}>Unpublish</button>
                  )}
                  <button onClick={() => {
                    if (confirm('Delete this submission?')) window.FSDDStore.deleteSubmission(e.id);
                  }} style={{
                    appearance: 'none', cursor: 'pointer', border: '1px solid #e6e6e6',
                    background: '#fff', color: '#b04a3a',
                    padding: '5px 11px', borderRadius: 999,
                    fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                    marginLeft: 'auto',
                  }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SB_ModalShell>
  );
}

// ───────────────────── Form helpers ─────────────────────
const SB_INPUT_STYLE = {
  appearance: 'none', width: '100%', boxSizing: 'border-box',
  border: '1px solid #e6e6e6', borderRadius: 8, background: '#fff',
  padding: '10px 12px', fontFamily: '"Inter", system-ui, sans-serif',
  fontSize: 14, color: '#1a1a1a', outline: 'none',
};

function SB_Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{
        display: 'block', marginBottom: 6,
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 12, fontWeight: 600, color: '#4a4a4a', letterSpacing: 0.02,
      }}>{label}</span>
      {children}
    </label>
  );
}

// ───────────────────── Public submit (mailto, no auth required) ─────────────────────
// Same fields as the admin form, plus a Name field. On submit we open the
// user's mail client pre-filled with the event details addressed to
// filmstackcalendar@gmail.com. Below the form sits an "Admin? Sign-in" link
// that swaps the modal for the admin password gate.
function SB_PublicSubmitModal({ onClose, onAdminSignIn, onAdminDirectSubmit, onViewSubmissions }) {
  const user = window.FSDDStore.getUser();
  const [form, setForm] = React.useState({
    name: '',
    section: 'screenings',
    title: '', sponsor: '', sortDate: '', time: '', location: '', linkUrl: '',
  });
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sections = [
    { id: 'screenings', label: 'Screening', tint: '#eef2fb', color: 'oklch(0.50 0.18 250)' },
    { id: 'events',     label: 'Event',     tint: '#eef6ef', color: 'oklch(0.52 0.14 152)' },
    { id: 'deadlines',  label: 'Deadline',  tint: '#fbf2e8', color: 'oklch(0.58 0.16 48)' },
    { id: 'actions',    label: 'Action',    tint: '#f4eef9', color: 'oklch(0.50 0.16 300)' },
  ];

  const submit = (e) => {
    e?.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Your name is required.');
    if (!form.title.trim()) return setError('Event title is required.');
    if (!form.sortDate) return setError('Date is required.');
    if (!form.location.trim()) return setError('Location is required (or type "Online").');

    const sectionMeta = sections.find((s) => s.id === form.section);
    const dateStr = form.sortDate + (form.time.trim() ? ` · ${form.time.trim()}` : '');

    const body =
`Hi FilmStack team,

A new event submission for the FilmStack Calendar:

Submitted by:  ${form.name.trim()}

Section:       ${sectionMeta.label}
Event title:   ${form.title.trim()}
Sponsor:       ${form.sponsor.trim() || '—'}
Date & time:   ${dateStr}
Location:      ${form.location.trim()}
Link:          ${form.linkUrl.trim() || '—'}

Thanks!
`;

    const subject = `FilmStack Calendar — ${sectionMeta.label}: ${form.title.trim()}`;
    const href =
      'mailto:filmstackcalendar@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    // Open mail client. Use window.open so the modal can show a confirmation.
    window.open(href, '_blank');
    setSent(true);
  };

  if (sent) {
    return (
      <SB_ModalShell onClose={onClose} width={460}
        title="✓ Email ready to send"
        subtitle="Your mail app should have opened with the event details pre-filled. Send the email to finish submitting.">
        <div style={{
          background: '#fafafa', border: '1px solid #e6e6e6', borderRadius: 10, padding: 14,
          fontFamily: '"Inter", system-ui, sans-serif', fontSize: 13, color: '#4a4a4a', marginBottom: 14, lineHeight: 1.5,
        }}>
          If nothing opened, copy this address and email us directly:<br />
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 13, color: '#1a1a1a',
          }}>filmstackcalendar@gmail.com</span>
        </div>
        <button onClick={onClose} style={{
          appearance: 'none', cursor: 'pointer', width: '100%',
          background: '#1a1a1a', color: '#fff', border: 'none',
          padding: '12px 16px', borderRadius: 999,
          fontFamily: '"Inter", system-ui, sans-serif', fontSize: 14.5, fontWeight: 600,
        }}>Done</button>
      </SB_ModalShell>
    );
  }

  return (
    <SB_ModalShell onClose={onClose} width={560}
      title="Submit an event"
      subtitle="Fill out the details below — we'll receive your submission by email and add it to the calendar.">
      <form onSubmit={submit}>
        <SB_Field label="Your name">
          <input value={form.name} onChange={(e) => set('name', e.target.value)}
            placeholder="First Last" autoFocus style={SB_INPUT_STYLE} />
        </SB_Field>

        <SB_Field label="Section">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sections.map((s) => (
              <button key={s.id} type="button" onClick={() => set('section', s.id)} style={{
                appearance: 'none', cursor: 'pointer',
                background: form.section === s.id ? s.tint : '#fff',
                border: form.section === s.id ? `1px solid ${s.color}` : '1px solid #e6e6e6',
                color: form.section === s.id ? s.color : '#4a4a4a',
                padding: '6px 12px', borderRadius: 999,
                fontFamily: 'inherit', fontSize: 13, fontWeight: form.section === s.id ? 600 : 500,
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </SB_Field>

        <SB_Field label="Event title">
          <input value={form.title} onChange={(e) => set('title', e.target.value)}
            placeholder='e.g. "Daughters of the Dust" — 4K restoration'
            style={SB_INPUT_STYLE} />
        </SB_Field>

        <SB_Field label="Event sponsor">
          <input value={form.sponsor} onChange={(e) => set('sponsor', e.target.value)}
            placeholder="e.g. Light Industry, Anthology Film Archives"
            style={SB_INPUT_STYLE} />
        </SB_Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SB_Field label="Date">
            <input type="date" value={form.sortDate} onChange={(e) => set('sortDate', e.target.value)}
              style={SB_INPUT_STYLE} />
          </SB_Field>
          <SB_Field label="Time">
            <input value={form.time} onChange={(e) => set('time', e.target.value)}
              placeholder="7:30 PM ET" style={SB_INPUT_STYLE} />
          </SB_Field>
        </div>

        <SB_Field label="Location / online">
          <input value={form.location} onChange={(e) => set('location', e.target.value)}
            placeholder='Neighborhood · City  —  or type "Online"' style={SB_INPUT_STYLE} />
        </SB_Field>

        <SB_Field label="Link">
          <input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
            placeholder="https://… (tickets, RSVP, submission page)" style={SB_INPUT_STYLE} />
        </SB_Field>

        {error && <div style={{
          fontFamily: 'inherit', fontSize: 13, color: '#b04a3a',
          background: '#fbeae6', padding: '8px 12px', borderRadius: 8, marginBottom: 12,
        }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" onClick={onClose} style={{
            appearance: 'none', cursor: 'pointer',
            background: '#fff', color: '#4a4a4a', border: '1px solid #e6e6e6',
            padding: '12px 18px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <button type="submit" style={{
            appearance: 'none', cursor: 'pointer', flex: 1,
            background: '#1a1a1a', color: '#fff', border: 'none',
            padding: '12px 18px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          }}>Send submission</button>
        </div>
      </form>

      {/* Admin entry point beneath the form */}
      <div style={{
        marginTop: 22, paddingTop: 18,
        borderTop: '1px dashed #e6e6e6', textAlign: 'center',
      }}>
        {!user ? (
          <button onClick={onAdminSignIn} style={{
            appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: '"Inter", system-ui, sans-serif', fontSize: 13.5, fontWeight: 600,
            color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 3,
            padding: 4,
          }}>Admin? Sign in →</button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={onAdminDirectSubmit} style={{
              appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: '"Inter", system-ui, sans-serif', fontSize: 13.5, fontWeight: 600,
              color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Skip email — publish directly (admin)</button>
            <span style={{ color: '#a3a3a3' }}>·</span>
            <button onClick={onViewSubmissions} style={{
              appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: '"Inter", system-ui, sans-serif', fontSize: 13.5, fontWeight: 600,
              color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 3,
            }}>My submissions</button>
            <span style={{ color: '#a3a3a3' }}>·</span>
            <button onClick={() => { window.FSDDStore.signOut(); }} style={{
              appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: '"Inter", system-ui, sans-serif', fontSize: 13.5, fontWeight: 600,
              color: '#b04a3a', textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Sign out</button>
          </div>
        )}
      </div>
    </SB_ModalShell>
  );
}

window.SB_SignInModal = SB_AdminSignInModal;
window.SB_AdminSignInModal = SB_AdminSignInModal;
window.SB_SubmitEventModal = SB_SubmitEventModal;
window.SB_PublicSubmitModal = SB_PublicSubmitModal;
window.SB_SubmissionsModal = SB_SubmissionsModal;
