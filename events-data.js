// Shared event data + helpers for FilmStack Calendar.
// ~28 events across screenings / events / deadlines / actions.

window.TODAY = new Date();

window.EVENTS = [
  // ─── This week / urgent ───────────────────────────────────────────
  {
    sortDate: '2026-05-25', dateDisplay: 'May 25 · 7:30 PM ET',
    urgency: 'soon', section: 'screenings', sectionLabel: 'Screening',
    title: 'Chantal Akerman — *News from Home*',
    location: 'New York', city: 'New York',
    venue: 'Anthology Film Archives',
    desc: 'New 4K restoration. Part of Anthology\'s month-long Akerman retrospective. Introduced by Ami Vora.',
    links: [{ label: 'Tickets', url: 'https://anthologyfilmarchives.org/film_screenings/series' }],
    credit: 'AV',
  },
  {
    sortDate: '2026-05-26', dateDisplay: 'May 26 · 6:30 PM ET',
    urgency: 'soon', section: 'events', sectionLabel: 'Event',
    title: 'NYC Filmmakers — Open Meeting',
    location: 'New York', city: 'New York',
    venue: 'Powerhouse Arts',
    desc: 'Monthly community meeting. This month: distribution after the festival, with panelists from Cinema Guild and Grasshopper.',
    links: [{ label: 'Free RSVP', url: 'https://powerhousearts.org/calendar' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-05-28', dateDisplay: 'May 28 · 11:59 PM PT',
    urgency: 'soon', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Slamdance Unstoppable — Submission Deadline',
    location: 'Online', city: 'Online',
    venue: 'Slamdance',
    desc: 'Final deadline for the Unstoppable program (filmmakers with disabilities). No fee for first-time submitters.',
    links: [{ label: 'Submit', url: 'https://slamdance.com/festival-submit/' }, { label: 'Guidelines', url: 'https://slamdance.com/festival-faq/' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-05-30', dateDisplay: 'May 30 · 9:00 PM ET',
    urgency: 'soon', section: 'screenings', sectionLabel: 'Screening',
    title: 'Spectacle — Two by Jacques Rozier',
    location: 'New York', city: 'New York',
    venue: 'Spectacle Theater',
    desc: '*Adieu Philippine* (1962) and *Du côté d\'Orouët* (1973). Double bill, $10. Volunteer-run, cash only.',
    links: [{ label: 'Calendar', url: 'https://spectacletheater.com' }],
    credit: 'SG',
  },

  // ─── Week of June 1 ───────────────────────────────────────────────
  {
    sortDate: '2026-06-01', dateDisplay: 'June 1 · 8:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Light Industry — Found Footage Night',
    location: 'New York', city: 'New York',
    venue: 'Light Industry',
    desc: 'Selected and introduced by Ed Halter. New work alongside selections from the LI archive. $8 suggested.',
    links: [{ label: 'Tickets', url: 'https://lightindustry.org/calendar/' }],
    credit: 'TH',
  },
  {
    sortDate: '2026-06-02', dateDisplay: 'Jun 2 · 6:00 PM ET',
    urgency: 'upcoming', section: 'actions', sectionLabel: 'Action',
    title: 'NYC Council — Artist Housing Bill Vote',
    location: 'New York', city: 'New York',
    venue: 'NYC City Council',
    desc: 'Public hearing on Intro 1217 (live/work housing protections for artists in industrial zones). Sign up to testify, or attend in solidarity.',
    links: [{ label: 'How to testify', url: 'https://council.nyc.gov/legislation/' }, { label: 'Bill text', url: 'https://intro.nyc/recent' }],
    credit: 'ARB',
  },
  {
    sortDate: '2026-06-07', dateDisplay: 'Jun 7 · 4:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Open City Doc Fest — NYC Showcase',
    location: 'New York', city: 'New York',
    venue: 'IFC Center',
    desc: 'Three short docs from London\'s Open City Doc Fest, with directors in attendance. Reception after.',
    links: [{ label: 'Tickets', url: 'https://ifccenter.com' }],
    credit: 'AS',
  },

  // ─── Week of June 8 ───────────────────────────────────────────────
  {
    sortDate: '2026-06-11', dateDisplay: 'Jun 11 · Doors 7:30, screening 8:30 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Pop-Up',
    title: 'WTF-Stop LES Microcinema — Inaugural Screening',
    location: 'Lower East Side · New York', city: 'New York',
    venue: 'ETET, Lower East Side',
    desc: 'The brand-new FilmStack pop-up microcinema presents its inaugural screening: short films followed by filmmaker interviews. Doors 7:30 PM, screening 8:30 PM. Bring folding chairs + drinks. Pay-what-you-can via Venmo. Entrance on Broome St. between Willet and Columbia (south side of the Williamsburg Bridge). Near F, M, J, Z trains.',
    links: [{ label: 'RSVP', url: 'https://partiful.com/e/MAHnDC0ph1WM6T3Op7MN' }],
    credit: 'SS',
  },
  {
    sortDate: '2026-06-13', dateDisplay: 'Jun 13 · 2:00 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'Event',
    title: 'Maysles Documentary Center — Editing Workshop',
    location: 'New York', city: 'New York',
    venue: 'Maysles Documentary Center',
    desc: 'Four-hour intensive on observational doc editing with editor Anne Alvergue. $45 / $25 students. Cap: 12.',
    links: [{ label: 'Register', url: 'https://www.maysles.org/calendar' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-06-15', dateDisplay: 'Jun 15 · 11:59 PM PT',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Sundance — Early Bird Submission Deadline',
    location: 'Online', city: 'Online',
    venue: 'Sundance Institute',
    desc: 'Earlybird fee tier for features and shorts. Regular deadline Aug 5, late Sep 10.',
    links: [{ label: 'Submit', url: 'https://www.sundance.org/festivals/sundance-film-festival/submit/' }, { label: 'Fee waivers', url: 'https://www.sundance.org/festivals/sundance-film-festival/submit/' }],
    credit: 'CR',
  },

  // ─── Week of June 15 ──────────────────────────────────────────────
  {
    sortDate: '2026-06-20', dateDisplay: 'Jun 20 · 8:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Metrograph — No Wave Cinema Retrospective',
    location: 'New York', city: 'New York',
    venue: 'Metrograph',
    desc: 'Opening night of a two-week series. 35mm prints. Lizzie Borden in person.',
    links: [{ label: 'Series page', url: 'https://metrograph.com' }, { label: 'Tickets', url: 'https://metrograph.com' }],
    credit: 'AV',
  },
  {
    sortDate: '2026-06-22', dateDisplay: 'Jun 22 · 11:59 PM PT',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'NYFF64 — Currents & Shorts Deadline',
    location: 'Online', city: 'Online',
    venue: 'Film at Lincoln Center',
    desc: 'Late deadline for short films and the Currents experimental section. Earlier deadlines have passed.',
    links: [{ label: 'Submit', url: 'https://filmfreeway.com/NYFF' }],
    credit: 'TH',
  },
  {
    sortDate: '2026-06-24', dateDisplay: 'Jun 24 · 9:30 PM PT',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'Roxie Theater — Lynne Sachs Program',
    location: 'San Francisco', city: 'Elsewhere',
    venue: 'Roxie Theater',
    desc: 'Three Sachs shorts plus *Film About a Father Who* (2020). Director in attendance.',
    links: [{ label: 'Tickets', url: 'https://roxie.com/calendar/' }],
    credit: 'SG',
  },

  // ─── July ─────────────────────────────────────────────────────────
  {
    sortDate: '2026-07-01', dateDisplay: 'Jul 1 — Aug 31',
    urgency: 'rolling', section: 'events', sectionLabel: 'Event',
    title: 'Rooftop Films — Summer Series',
    location: 'New York', city: 'New York',
    venue: 'Rooftop Films',
    desc: 'Two months of outdoor screenings on rooftops across the five boroughs. Lineup drops weekly. Single tickets $20, season passes $200.',
    links: [{ label: 'Calendar', url: 'https://rooftopfilms.com/calendar/' }, { label: 'Season pass', url: 'https://rooftopfilms.com/support/' }],
    credit: 'AS',
  },
  {
    sortDate: '2026-07-10', dateDisplay: 'Jul 10 · 9:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'IFC Center — *Daughters of the Dust* (1991)',
    location: 'New York', city: 'New York',
    venue: 'IFC Center',
    desc: 'Julie Dash\'s landmark on a new 4K restoration. Introduced by Danielle A. Scruggs.',
    links: [{ label: 'Tickets', url: 'https://ifccenter.com' }],
    credit: 'DS',
  },
  {
    sortDate: '2026-07-12', dateDisplay: 'Rolling',
    urgency: 'rolling', section: 'events', sectionLabel: 'Event',
    title: 'Reanimation Library — Open Residency',
    location: 'New York', city: 'New York',
    venue: 'Reanimation Library',
    desc: 'Drop-in research residency: use the collection of cast-off illustrated books for your project. No application. Open Wed/Sat, 1–6 PM.',
    links: [{ label: 'Hours & catalog', url: 'https://www.reanimationlibrary.org/' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-07-25', dateDisplay: 'Jul 25 · 11:59 PM ET',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'MacDowell — Residency Deadline (Winter/Spring 2027)',
    location: 'Online', city: 'Online',
    venue: 'MacDowell',
    desc: 'Filmmakers, screenwriters, video and interdisciplinary artists. 2–8 week residencies with all expenses covered.',
    links: [{ label: 'Apply', url: 'https://www.macdowell.org/apply/apply-for-fellowship' }, { label: 'About', url: 'https://www.macdowell.org/apply/application-guidelines' }],
    credit: 'AV',
  },
  {
    sortDate: '2026-07-30', dateDisplay: 'Jul 30 · 7:00 PM ET',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Screening',
    title: 'BAMcinematek — Cassavetes Series',
    location: 'New York', city: 'New York',
    venue: 'BAM',
    desc: 'Four nights, four films. Opens with *Faces* (1968). 35mm throughout. Series ticket available.',
    links: [{ label: 'Series', url: 'https://bam.org/film' }, { label: 'Tickets', url: 'https://bam.org/film' }],
    credit: 'TH',
  },

  // ─── August ───────────────────────────────────────────────────────
  {
    sortDate: '2026-08-05', dateDisplay: 'Aug 5 · 11:59 PM PT',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Sundance — Regular Submission Deadline',
    location: 'Online', city: 'Online',
    venue: 'Sundance Institute',
    desc: 'Regular fee tier closes. After this, only late deadline (Sep 10) remains.',
    links: [{ label: 'Submit', url: 'https://www.sundance.org/festivals/sundance-film-festival/submit/' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-08-12', dateDisplay: 'Aug 12 · 6:30 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'Event',
    title: 'Brooklyn Filmmakers — Quarterly Roundtable',
    location: 'New York', city: 'New York',
    venue: 'FiveMyles Gallery',
    desc: 'Quarterly roundtable. This edition: "Working with non-actors." Open to anyone making work. Free, RSVP required.',
    links: [{ label: 'RSVP', url: 'https://fivemyles.org/calendar' }],
    credit: 'SG',
  },
  {
    sortDate: '2026-08-28', dateDisplay: 'Aug 28 — Oct 15',
    urgency: 'ongoing', section: 'events', sectionLabel: 'Event',
    title: 'MoMA — To Save and Project',
    location: 'New York', city: 'New York',
    venue: 'Museum of Modern Art',
    desc: 'MoMA\'s annual international festival of film preservation. Restorations, many North American premieres.',
    links: [{ label: 'Full lineup', url: 'https://www.moma.org/calendar/groups/34' }],
    credit: 'AS',
  },

  // ─── May 25–27 additions (Calendar Update #31) ───────────────────
  {
    sortDate: '2026-05-25', dateDisplay: 'May 25',
    urgency: 'today', section: 'screenings', sectionLabel: 'Screening',
    title: '*Invisible Nation* — St Antony\'s College Oxford',
    location: 'Oxford, UK', city: 'Elsewhere',
    venue: 'St Antony\'s College, University of Oxford',
    desc: 'Screening of Invisible Nation at St Antony\'s College, University of Oxford.',
    links: [],
    credit: 'TH',
  },
  {
    sortDate: '2026-05-27', dateDisplay: 'May 27',
    urgency: 'soon', section: 'events', sectionLabel: 'Event',
    title: 'NonDē 50 Films — General Meeting with Coffeehouse Cinema',
    location: 'Online', city: 'Online',
    desc: 'General meeting for the NonDē 50 Films project with Coffeehouse Cinema. All participants welcome.',
    links: [],
    credit: 'CR',
  },
  // ─── June 6 additions ─────────────────────────────────────────────
  {
    sortDate: '2026-06-06', dateDisplay: 'Jun 6 · 1:30–4:30 PM ET',
    urgency: 'upcoming', section: 'events', sectionLabel: 'MeetUp',
    title: 'FilmStack NY — Community Meetup',
    location: 'Tribeca · New York', city: 'New York',
    desc: 'FilmStack community meetup in Tribeca. Come connect with fellow cinema-makers and enthusiasts.',
    links: [{ label: 'RSVP', url: 'https://partiful.com/e/zaKKKWCdhbkQXniQkdnC' }],
    credit: 'SS',
  },
  // ─── Actions ──────────────────────────────────────────────────────
  {
    sortDate: '2026-05-25', dateDisplay: 'Rolling',
    urgency: 'rolling', section: 'actions', sectionLabel: 'Action',
    title: 'Sign the Pledge to Buy Letterboxd',
    location: 'Online', city: 'Online',
    desc: 'Show your support for independent film culture by signing the community pledge to buy Letterboxd.',
    links: [{ label: 'Sign the pledge', url: 'https://intrinsic.community' }],
    credit: 'CR',
  },
  {
    sortDate: '2026-05-25', dateDisplay: 'Rolling',
    urgency: 'rolling', section: 'actions', sectionLabel: 'Watch',
    title: 'Watch *Creative Force* on Whush',
    location: 'Online', city: 'Online',
    desc: '*Creative Force* is now streaming on Whush. Use the link to access it.',
    links: [{ label: 'Watch on Whush', url: 'https://bit.ly/4u5hM6Z' }],
    credit: 'CR',
  },
  // ─── November ─────────────────────────────────────────────────────
  {
    sortDate: '2026-07-31', dateDisplay: 'Jul 31 · 11:59 PM',
    urgency: 'upcoming', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'Porto/Post/Doc — Film Submission Deadline',
    location: 'Online', city: 'Online',
    venue: 'Porto/Post/Doc Film Festival',
    desc: 'Film submission deadline for the Porto/Post/Doc Film Festival (Nov 19–28, Porto, Portugal). portopostdoc.com',
    links: [{ label: 'Submit', url: 'https://portopostdoc.com' }],
    credit: 'SG',
  },
  {
    sortDate: '2026-11-19', dateDisplay: 'Nov 19–28',
    urgency: 'upcoming', section: 'screenings', sectionLabel: 'Festival',
    title: 'Porto/Post/Doc — Film Festival',
    location: 'Porto, Portugal', city: 'Elsewhere',
    venue: 'Porto/Post/Doc',
    desc: 'Annual documentary and experimental film festival in Porto, Portugal. Film submission deadline: July 31.',
    links: [{ label: 'Festival site', url: 'https://portopostdoc.com' }],
    credit: 'SG',
  },

  // ─── Past (shown when "Show past" is on) ──────────────────────────
  {
    sortDate: '2026-05-18', dateDisplay: 'May 18 · 8:00 PM ET',
    urgency: 'past', section: 'screenings', sectionLabel: 'Screening',
    title: 'Mono No Aware — Spring Showcase',
    location: 'New York', city: 'New York',
    venue: 'Mono No Aware',
    desc: 'Annual showcase of films made by members. 24 shorts, hand-developed and projected on 16mm.',
    links: [{ label: 'Recap', url: 'https://mononoawarefilm.com' }],
    credit: 'SG',
  },
  {
    sortDate: '2026-05-10', dateDisplay: 'May 10',
    urgency: 'past', section: 'deadlines', sectionLabel: 'Deadline',
    title: 'NEA — Media Arts Production Grants',
    location: 'Online', city: 'Online',
    venue: 'NEA',
    desc: 'Submission window closed. Next cycle opens December 2026.',
    links: [{ label: 'Next cycle', url: 'https://www.arts.gov/grants/grants-for-arts-projects/media-arts' }],
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
  // Compute real urgency from sortDate vs today — ignores the hardcoded e.urgency
  // (except for 'rolling'/'ongoing' which are time-independent).
  effectiveUrgency: (e) => {
    if (e.urgency === 'rolling' || e.urgency === 'ongoing') return e.urgency;
    const todayStr = window.TODAY.toISOString().slice(0, 10);
    if (e.sortDate < todayStr) return 'past';
    if (e.sortDate === todayStr) return 'today';
    const d = new Date(e.sortDate + 'T12:00:00');
    const days = Math.round((d - window.TODAY) / 86400000);
    return days <= 7 ? 'soon' : 'upcoming';
  },
  isPast: (e) => window.CalUtils.effectiveUrgency(e) === 'past',
  isToday: (e) => window.CalUtils.effectiveUrgency(e) === 'today',
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
      if (!showPast && window.CalUtils.effectiveUrgency(e) === 'past') return false;
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
