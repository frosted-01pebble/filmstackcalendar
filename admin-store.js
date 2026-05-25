// FilmStack admin store — localStorage-backed prototype "backend".
// Demonstrates the full auth + event-submission UX without a server.
// Replace these methods with real fetch() calls against Supabase/Firebase/etc.
// when wiring to a real backend.

(function () {
  const AUTH_KEY = 'fsdd-auth';
  const EVENTS_KEY = 'fsdd-user-events';

  // Seed accounts — match contributor initials on the existing site.
  // Any other email + password ≥ 4 chars also works, with auto-derived
  // initials from the email.
  const SEED_USERS = {
    'sara@filmstack.test':   { name: "Sara's Soliloquies",   initials: 'SS',  role: 'Editor', pass: 'filmstack' },
    'ted@filmstack.test':    { name: 'Ted Hope',             initials: 'TH',  role: 'Editor', pass: 'filmstack' },
    'ami@filmstack.test':    { name: 'Ami Vora',             initials: 'AV',  role: 'Editor', pass: 'filmstack' },
    'sam@filmstack.test':    { name: 'Sam Gallen',           initials: 'SG',  role: 'Contributor', pass: 'filmstack' },
    'courtney@filmstack.test': { name: 'Courtney Romano',    initials: 'CR',  role: 'Contributor', pass: 'filmstack' },
    'danielle@filmstack.test': { name: 'Danielle A. Scruggs', initials: 'DS', role: 'Contributor', pass: 'filmstack' },
    'amanda@filmstack.test': { name: 'Amanda Sweikow',       initials: 'AS',  role: 'Contributor', pass: 'filmstack' },
    'alex@filmstack.test':   { name: 'Alex Rollins Berg',    initials: 'ARB', role: 'Contributor', pass: 'filmstack' },
  };

  function deriveInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch (e) { console.warn('Save failed:', e); }
  }

  const listeners = new Set();
  function notify() { for (const fn of listeners) fn(); }

  window.FSDDStore = {
    // ─── auth ─────────────────────────────────────────────────────
    // Single shared admin password. Change in this one place.
    ADMIN_PASSWORD: 'filmstack',
    signInAdmin(password) {
      if ((password || '') !== this.ADMIN_PASSWORD) {
        throw new Error('Incorrect admin password.');
      }
      const user = { email: 'admin@filmstack', name: 'Admin', initials: 'AD', role: 'Editor' };
      save(AUTH_KEY, user);
      notify();
      return user;
    },
    signIn(email, password, displayName) {
      email = (email || '').trim().toLowerCase();
      if (!email || !password) throw new Error('Email and password required.');
      if (password.length < 4) throw new Error('Password must be at least 4 characters.');

      let user;
      if (SEED_USERS[email]) {
        if (SEED_USERS[email].pass !== password) throw new Error('Incorrect password for that account.');
        user = { email, name: SEED_USERS[email].name, initials: SEED_USERS[email].initials, role: SEED_USERS[email].role };
      } else {
        // Open sign-up — anyone can be a "Contributor".
        const name = (displayName || '').trim() || email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        user = { email, name, initials: deriveInitials(name), role: 'Contributor' };
      }
      save(AUTH_KEY, user);
      notify();
      return user;
    },
    signOut() {
      try { localStorage.removeItem(AUTH_KEY); } catch {}
      notify();
    },
    getUser() {
      return load(AUTH_KEY, null);
    },

    // ─── events ───────────────────────────────────────────────────
    listSubmissions() {
      return load(EVENTS_KEY, []);
    },
    addSubmission(evt) {
      const u = this.getUser(); if (!u) throw new Error('Sign in to submit events.');
      const events = load(EVENTS_KEY, []);
      const withMeta = {
        ...evt,
        id: 'sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        submittedBy: u.email,
        submittedByName: u.name,
        credit: u.initials,
        submittedAt: new Date().toISOString(),
        status: u.role === 'Editor' ? 'published' : 'pending', // editors auto-publish
      };
      events.push(withMeta);
      save(EVENTS_KEY, events);
      notify();
      return withMeta;
    },
    updateSubmission(id, patch) {
      const u = this.getUser(); if (!u) throw new Error('Sign in required.');
      const events = load(EVENTS_KEY, []);
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Submission not found.');
      if (events[idx].submittedBy !== u.email && u.role !== 'Editor') throw new Error('Not your submission.');
      events[idx] = { ...events[idx], ...patch };
      save(EVENTS_KEY, events);
      notify();
    },
    deleteSubmission(id) {
      const u = this.getUser(); if (!u) throw new Error('Sign in required.');
      const events = load(EVENTS_KEY, []);
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) return;
      if (events[idx].submittedBy !== u.email && u.role !== 'Editor') throw new Error('Not your submission.');
      events.splice(idx, 1);
      save(EVENTS_KEY, events);
      notify();
    },
    // Editor-only: publish or reject a pending submission.
    setSubmissionStatus(id, status) {
      const u = this.getUser(); if (!u) throw new Error('Sign in required.');
      if (u.role !== 'Editor') throw new Error('Editor role required.');
      const events = load(EVENTS_KEY, []);
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) return;
      events[idx].status = status; // pending | published | rejected
      save(EVENTS_KEY, events);
      notify();
    },

    // ─── reactive subscribe ─────────────────────────────────────
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    // ─── helpers exposed for the UI ───────────────────────────
    seedAccounts: SEED_USERS,
  };

  // React across tabs.
  window.addEventListener('storage', (e) => {
    if (e.key === AUTH_KEY || e.key === EVENTS_KEY) notify();
  });
})();
