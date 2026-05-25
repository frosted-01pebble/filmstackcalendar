// Shared event data + helpers for both FilmStack Calendar direction studies.
// Today is May 24, 2026. ~28 events across screenings / events / deadlines / actions.

window.TODAY = new Date('2026-05-24T12:00:00');

window.EVENTS = [
  // ─── This week / urgent ───────────────────────────────────────────
  {
    sortDate: '2026-05-24', dateDisplay: 'May 24 · 8:00 PM ET',
    urgency: 'today', section: 'screenings', sectionLabel: 'Screening',
    title: 'Bushwick Daily Microcinema · Vol. 14',
    location: 'New York', city: 'New York',
    venue: 'Bushwick Daily',
    desc: 'Sixteen new short works on 16mm and digital, programmed by the Bushwick Daily collective. Sliding scale $5–15. BYO drink, snacks provided. Q&A with five of the filmmakers after the program.',
    links: [{ label: 'RSVP', url: '#' }, { label: 'Program PDF', url: '#' }],
    credit: 'SS',
  },
  {
    sortDate: '2026-05-25', dateDisplay: 'May 25 · 7:30 PM ET',
    urgency: 'soon', section: 'screenings', sectionLabel: 'Screening',
    title: 'Chantal Akerman: News from Home',
    location: 'New York', city: 'New York',
    venue: 'Anthology Film Archives',
    desc: 'New 4K restoration. Part of Anthology\'s month-long Akerman retrospective. Introduced by Ami Vora.',
    links: [{ label: 'Tickets', url: '#' }],
    credit: 'AV',
  },
  {
    sortDate: '2026-05-26', dateDisplay: 'May 26 · 6:30 PM ET',
    urgency: 'soon', section: 'events', sectionLabel: 'Event',
    title: 'NYC Filmmakers Open Mtg.',
    location: 'New York', city: 'New York',
    venue: 'Powerhouse Arts',
    desc: 'Monthly community meeting. This month: distribution after the festival, with panelists from Cinema Guild and Grasshopper.',
    links: [{ label: 'Free RSVP', url: '#' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-05-28', dateDisplay: 'May 28 · 11:59 PM PT',
    urgency: 'soon', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Slamdance Unstoppable — Submissions Close',
    location: 'Online', city: 'Online',
    venue: 'Slamdance',
    desc: 'Final deadline for the Unstoppable program (filmmakers with disabilities). No fee for first-time submitters.',
    links: [{ label: 'Submit', url: '#' }, { label: 'Guidelines', url: '#' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-05-30', dateDisplay: 'May 30 · 9:00 PM ET',
    urgency: 'soon', section: 'screenings', sectionLabel: 'Screening',
    title: 'Spectacle: Two by Jacques Rozier',
    location: 'New York', city: 'New York',
    venue: 'Spectacle Theater',
    desc: '"Adieu Philippine" (1962) and "Du côté d\'Orouët" (1973). Double bill, $10. Volunteer-run, cash only.',
    links: [{ label: 'Calendar', url: '#' }],
    credit: 'SG',
  },

  // ─── Week of June 1 ───────────────────────────────────────────────
  {
    sortDate: '2026-06-01', dateDisplay: 'June 1 · 8:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Light Industry: Found Footage Night',
    location: 'New York', city: 'New York',
    venue: 'Light Industry',
    desc: 'Selected and introduced by Ed Halter. New work alongside selections from the LI archive. $8 suggested.',
    links: [{ label: 'Tickets', url: '#' }],
    credit: 'TH',
  },
  {
    sortDate: '2026-06-02', dateDisplay: 'Jun 2 · 6:00 PM ET',
    urgency: 'upcoming', section: 'actions', sectionLabel: 'Action',
    title: 'NYC Council Vote — Artist Housing Bill',
    location: 'New York', city: 'New York',
    venue: 'NYC City Council',
    desc: 'Public hearing on Intro 1217 (live/work housing protections for artists in industrial zones). Sign up to testify, or attend in solidarity.',
    links: [{ label: 'How to testify', url: '#' }, { label: 'Bill text', url: '#' }],
    credit: 'ARB',
  },
  {
    sortDate: '2026-06-04', dateDisplay: 'Jun 4 · 7:30 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'Event',
    title: 'FilmStack 1:1 Live — Kelly Reichardt',
    location: 'New York', city: 'New York',
    venue: 'The Public Theater',
    desc: 'Sara\'s Soliloquies hosts. 90 minutes of conversation, 30 minutes of audience Q&A. Recording available to subscribers afterward.',
    links: [{ label: 'Tickets', url: '#' }, { label: 'Livestream', url: '#' }],
    credit: 'SS',
  },
  {
    sortDate: '2026-06-07', dateDisplay: 'Jun 7 · 4:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Open City Doc Fest · NYC Showcase',
    location: 'New York', city: 'New York',
    venue: 'IFC Center',
    desc: 'Three short docs from London\'s Open City Doc Fest, with directors in attendance. Reception after.',
    links: [{ label: 'Tickets', url: '#' }],
    credit: 'AS',
  },

  // ─── Week of June 8 ───────────────────────────────────────────────
  {
    sortDate: '2026-06-11', dateDisplay: 'Jun 11 · 7:30 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'WTF-Stop LES Microcinema',
    location: 'New York', city: 'New York',
    venue: 'WTF-Stop',
    desc: 'Monthly experimental short program. This month\'s theme: "Domestic Interiors." Twelve films, 88 minutes. $7 at the door.',
    links: [{ label: 'RSVP', url: '#' }],
    credit: 'SS',
  },
  {
    sortDate: '2026-06-13', dateDisplay: 'Jun 13 · 2:00 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'Event',
    title: 'Maysles Documentary Center · Editing Workshop',
    location: 'New York', city: 'New York',
    venue: 'Maysles Documentary Center',
    desc: 'Four-hour intensive on observational doc editing with editor Anne Alvergue. $45 / $25 students. Cap: 12.',
    links: [{ label: 'Register', url: '#' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-06-15', dateDisplay: 'Jun 15 · 11:59 PM PT',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Sundance · Earlybird Submission Deadline',
    location: 'Online', city: 'Online',
    venue: 'Sundance Institute',
    desc: 'Earlybird fee tier for features and shorts. Regular deadline Aug 5, late Sep 10.',
    links: [{ label: 'Submit', url: '#' }, { label: 'Fee waivers', url: '#' }],
    credit: 'CR',
  },

  // ─── Week of June 15 ──────────────────────────────────────────────
  {
    sortDate: '2026-06-20', dateDisplay: 'Jun 20 · 8:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'No Wave Cinema: A Retrospective',
    location: 'New York', city: 'New York',
    venue: 'Metrograph',
    desc: 'Opening night of a two-week series. 35mm prints. Lizzie Borden in person.',
    links: [{ label: 'Series page', url: '#' }, { label: 'Tickets', url: '#' }],
    credit: 'AV',
  },
  {
    sortDate: '2026-06-22', dateDisplay: 'Jun 22 · 11:59 PM PT',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'NYFF63 · Currents & Shorts Submissions',
    location: 'Online', city: 'Online',
    venue: 'Film at Lincoln Center',
    desc: 'Late deadline for short films and the Currents experimental section. Earlier deadlines have passed.',
    links: [{ label: 'Submit', url: '#' }],
    credit: 'TH',
  },
  {
    sortDate: '2026-06-24', dateDisplay: 'Jun 24 · 9:30 PM PT',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Roxie Mission · Lynne Sachs Program',
    location: 'Los Angeles', city: 'Los Angeles',
    venue: 'Roxie Theater',
    desc: 'Three Sachs shorts plus "Film About a Father Who" (2020). Director in attendance.',
    links: [{ label: 'Tickets', url: '#' }],
    credit: 'SG',
  },

  // ─── July ─────────────────────────────────────────────────────────
  {
    sortDate: '2026-07-01', dateDisplay: 'Jul 1 — Aug 31',
    urgency: 'rolling', section: 'events', sectionLabel: 'Event',
    title: 'Rooftop Films · Summer Series',
    location: 'New York', city: 'New York',
    venue: 'Rooftop Films',
    desc: 'Two months of outdoor screenings on rooftops across the five boroughs. Lineup drops weekly. Single tickets $20, season passes $200.',
    links: [{ label: 'Calendar', url: '#' }, { label: 'Season pass', url: '#' }],
    credit: 'AS',
  },
  {
    sortDate: '2026-07-10', dateDisplay: 'Jul 10 · 9:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'IFC Revival: "Daughters of the Dust" (1991)',
    location: 'New York', city: 'New York',
    venue: 'IFC Center',
    desc: 'Julie Dash\'s landmark on a new 4K restoration. Introduced by Danielle A. Scruggs.',
    links: [{ label: 'Tickets', url: '#' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-07-12', dateDisplay: 'Rolling',
    urgency: 'rolling', section: 'events', sectionLabel: 'Event',
    title: 'Reanimation Library · Open Residency',
    location: 'New York', city: 'New York',
    venue: 'Reanimation Library',
    desc: 'Drop-in research residency: use the collection of cast-off illustrated books for your project. No application. Open Wed/Sat, 1–6 PM.',
    links: [{ label: 'Hours & catalog', url: '#' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-07-18', dateDisplay: 'Jul 18 · 8:00 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'Event',
    title: 'Cinepoesia — Issue 4 Release Reading',
    location: 'New York', city: 'New York',
    venue: 'Cinepoesia',
    desc: 'Poetry-about-film and film-about-poetry journal launches Issue 4 with screenings and readings from six contributors. Free.',
    links: [{ label: 'Details', url: '#' }],
    credit: 'ARB',
  },
  {
    sortDate: '2026-07-25', dateDisplay: 'Jul 25 · 11:59 PM ET',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'MacDowell Residency · Winter/Spring 2027',
    location: 'Online', city: 'Online',
    venue: 'MacDowell',
    desc: 'Filmmakers, screenwriters, video and interdisciplinary artists. 2–8 week residencies with all expenses covered.',
    links: [{ label: 'Apply', url: '#' }, { label: 'About', url: '#' }],
    credit: 'AV',
  },
  {
    sortDate: '2026-07-30', dateDisplay: 'Jul 30 · 7:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'BAMcinematek: Cassavetes 4-Up',
    location: 'New York', city: 'New York',
    venue: 'BAM',
    desc: 'Four nights, four films. Opens with "Faces" (1968). 35mm throughout. Series ticket available.',
    links: [{ label: 'Series', url: '#' }, { label: 'Tickets', url: '#' }],
    credit: 'TH',
  },

  // ─── August ───────────────────────────────────────────────────────
  {
    sortDate: '2026-08-05', dateDisplay: 'Aug 5 · 11:59 PM PT',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Sundance · Regular Submission Deadline',
    location: 'Online', city: 'Online',
    venue: 'Sundance Institute',
    desc: 'Regular fee tier closes. After this, only late deadline (Sep 10) remains.',
    links: [{ label: 'Submit', url: '#' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-08-12', dateDisplay: 'Aug 12 · 6:30 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'Event',
    title: 'Brooklyn Filmmakers Roundtable',
    location: 'New York', city: 'New York',
    venue: 'FiveMyles Gallery',
    desc: 'Quarterly roundtable. This edition: "Working with non-actors." Open to anyone making work. Free, RSVP required.',
    links: [{ label: 'RSVP', url: '#' }],
    credit: 'SG',
  },
  {
    sortDate: '2026-08-20', dateDisplay: 'Aug 20 · 8:30 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Pier 7 Outdoor: "Killer of Sheep"',
    location: 'New York', city: 'New York',
    venue: 'Pier 7',
    desc: 'Charles Burnett, 1978. Outdoor projection on the pier wall. Free. Bring a blanket.',
    links: [{ label: 'Details', url: '#' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-08-28', dateDisplay: 'Aug 28 — Oct 15',
    urgency: 'ongoing', section: 'events', sectionLabel: 'Event',
    title: 'MoMA · To Save and Project (24th Edition)',
    location: 'New York', city: 'New York',
    venue: 'Museum of Modern Art',
    desc: 'MoMA\'s annual international festival of film preservation. Six weeks of restorations, many North American premieres.',
    links: [{ label: 'Full lineup', url: '#' }],
    credit: 'AS',
  },

  // ─── Past (shown when "Show past" is on) ──────────────────────────
  {
    sortDate: '2026-05-18', dateDisplay: 'May 18 · 8:00 PM ET',
    urgency: 'past', section: 'screenings', sectionLabel: 'Screening',
    title: 'Mono No Aware · Spring Showcase',
    location: 'New York', city: 'New York',
    venue: 'Mono No Aware',
    desc: 'Annual showcase of films made by members. 24 shorts, hand-developed and projected on 16mm.',
    links: [{ label: 'Recap', url: '#' }],
    credit: 'SG',
  },
  {
    sortDate: '2026-05-10', dateDisplay: 'May 10',
    urgency: 'past', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'NEA Media Arts Production Grants',
    location: 'Online', city: 'Online',
    venue: 'NEA',
    desc: 'Submission window closed. Next cycle opens December 2026.',
    links: [{ label: 'Next cycle', url: '#' }],
    credit: 'ARB',
  },
];

// Contributor key (matches existing site footer).
window.CONTRIBUTORS = [
  { initials: 'ARB', name: 'Alex Rollins Berg' },
  { initials: 'AS', name: 'Amanda Sweikow' },
  { initials: 'AV', name: 'Ami Vora' },
  { initials: 'CR', name: 'Courtney Romano' },
  { initials: 'DS', name: 'Danielle A. Scruggs' },
  { initials: 'SG', name: 'Sam Gallen' },
  { initials: 'SS', name: 'Sara\'s Soliloquies' },
  { initials: 'TH', name: 'Ted Hope' },
];

window.NAV_SECTIONS = [
  'Home', 'FilmStack 1:1', 'FilmStack Calendar', 'NonStack Round Up',
  'Challenges', 'NonDē50', 'Resources', 'Archive', 'Leaderboard', 'About',
];

// ─── Helpers ─────────────────────────────────────────────────────────
window.CalUtils = {
  isPast: (e) => e.urgency === 'past',
  isToday: (e) => e.urgency === 'today',
  daysUntil: (e) => {
    const d = new Date(e.sortDate + 'T12:00:00');
    return Math.round((d - window.TODAY) / 86400000);
  },
  // Group events into ISO weeks starting Monday. Returns [{ weekStart, label, events }].
  groupByWeek: (events) => {
    const buckets = new Map();
    for (const e of events) {
      const d = new Date(e.sortDate + 'T12:00:00');
      const dow = (d.getDay() + 6) % 7; // Mon=0
      const ws = new Date(d); ws.setDate(d.getDate() - dow);
      const key = ws.toISOString().slice(0, 10);
      if (!buckets.has(key)) buckets.set(key, { weekStart: new Date(ws), events: [] });
      buckets.get(key).events.push(e);
    }
    return [...buckets.values()].sort((a, b) => a.weekStart - b.weekStart).map((b) => {
      const ws = b.weekStart; const we = new Date(ws); we.setDate(ws.getDate() + 6);
      const m = (d) => d.toLocaleString('en-US', { month: 'short' });
      const sameM = ws.getMonth() === we.getMonth();
      const label = sameM
        ? `${m(ws)} ${ws.getDate()} — ${we.getDate()}, ${ws.getFullYear()}`
        : `${m(ws)} ${ws.getDate()} — ${m(we)} ${we.getDate()}, ${ws.getFullYear()}`;
      return { weekStart: ws, label, events: b.events };
    });
  },
  filterEvents: (events, { section, showPast, query, cities }) => {
    return events.filter((e) => {
      if (!showPast && e.urgency === 'past') return false;
      if (section !== 'all' && e.section !== section) return false;
      if (cities && cities.size > 0 && !cities.has(e.city || 'Online')) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) ||
              (e.desc && e.desc.toLowerCase().includes(q)) || (e.venue || '').toLowerCase().includes(q))) return false;
      }
      return true;
    });
  },
  // Tiny iCal generator — pop a single .ics download per event.
  downloadICS: (e) => {
    const pad = (n) => String(n).padStart(2, '0');
    const dt = new Date(e.sortDate + 'T19:00:00');
    const stamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const end = new Date(dt.getTime() + 2 * 3600 * 1000);
    const uid = `${e.sortDate}-${e.title.replace(/\W+/g, '').slice(0, 24)}@filmstackcalendar`;
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FilmStack Daily Digest//Calendar//EN',
      'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(dt)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${e.title.replace(/,/g, '\\,')}`,
      `LOCATION:${(e.venue ? e.venue + ', ' : '') + e.location}`,
      `DESCRIPTION:${(e.desc || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = e.title.replace(/[^\w]+/g, '-').toLowerCase() + '.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
};
