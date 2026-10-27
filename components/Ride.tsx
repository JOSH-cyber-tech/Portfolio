// @ts-nocheck
'use client';
// Ported from "Portfolio Ride v3.dc.html". Scene + audio logic is kept as one class
// (it relies on setState callbacks); content lives in the `C` object below.

import React, { useState } from 'react';
import * as T from 'three';

// Parse a CSS declaration string into a React style object.
const S = (css: string): React.CSSProperties => {
  const out: Record<string, string> = {};
  let depth = 0, quote = '', cur = '';
  const parts: string[] = [];
  for (const ch of css) {
    if (quote) { if (ch === quote) quote = ''; }
    else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ';' && !depth && !quote) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  for (const p of parts) {
    const i = p.indexOf(':');
    if (i < 0) continue;
    const k = p.slice(0, i).trim(), val = p.slice(i + 1).trim();
    if (k) out[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
  }
  return out as React.CSSProperties;
};

// Element with a hover style (the design used `style-hover`).
function Hov({ as: Tag = 'button', s, h, children, ...rest }: any) {
  const [on, setOn] = useState(false);
  return (
    <Tag {...rest} style={{ ...S(s), ...(on ? S(h || '') : {}) }} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      {children}
    </Tag>
  );
}

const svgProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const SvgOn = ({ size }: { size: number }) => (
  <svg width={size} height={size} {...svgProps}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>
);
const SvgOff = ({ size }: { size: number }) => (
  <svg width={size} height={size} {...svgProps}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M22 9l-6 6" /><path d="M16 9l6 6" /></svg>
);

class Ride extends React.Component {
  static defaultProps = { autoRide: false, rainIntensity: 0.8, dogCount: 4 };
  // ─────────────────────────────────────────────────────────────
  // EDIT YOUR CONTENT HERE. Empty strings ("") render as clearly
  // marked "To add" placeholders. Add URLs as full https:// links.
  // ─────────────────────────────────────────────────────────────
  C = {
    projects: {
      mood: {
        name: "MoodMenu",
        tagline: "Recipes that match how you feel.",
        what: "AI-powered recipe recommendations that match how you feel, powered by Gemini and Spoonacular.",
        problem: "Exists to make deciding what to eat easier by turning your mood and ingredients into personalized meal ideas.",
        features: ["Personalized recipe recommendations using Gemini and Spoonacular", "Secure JWT authentication", "Scalable REST APIs and backend data handling", "Optimized request handling, tested across multiple use cases"],
        tech: ["MongoDB", "Express.js", "React", "Node.js", "Gemini API", "Spoonacular API", "JWT", "REST APIs"],
        contribution: "Built the full-stack MERN application: integrated the Gemini and Spoonacular APIs, implemented JWT authentication and REST APIs on Node.js, Express.js and MongoDB, and optimized and tested request handling across multiple use cases.",
        repo: "https://github.com/JOSH-cyber-tech/Mood-Menu", demo: ""
      },
      pra: {
        name: "Prahari",
        tagline: "Citizen safety, on watch.",
        what: "AI fraud detection and citizen safety platform that flags scam messages and suspicious patterns.",
        problem: "Exists to help people spot potential scams before they fall for them and make the digital world a little safer.",
        how: "Modular workflows handle fraud classification, risk assessment and citizen safety. Gemini AI and REST APIs identify suspicious messages and scam patterns.",
        features: ["Identifies suspicious messages and scam patterns with Gemini AI", "Fraud classification and risk assessment workflows", "Responsive UI with dynamic GSAP animations", "Built for scalability and real-world usability"],
        tech: ["React", "Node.js", "Gemini AI", "REST APIs", "GSAP"],
        contribution: "Built the platform end to end: the AI-powered fraud detection with React, Node.js, Gemini AI and REST APIs; the responsive, GSAP-animated UI; and the modular classification and risk-assessment workflows.",
        repo: "", demo: "https://prahari-rust.vercel.app/"
      },
      study: {
        name: "StudySync",
        tagline: "Everything a study session needs, on one desk.",
        what: "Full-stack productivity platform for study planning, flashcards, quizzes and tasks, with Gemini AI, Spotify and OpenWeather built in.",
        problem: "Exists to make studying less chaotic by bringing planning, revision and productivity together in one place.",
        features: ["Study planning", "Flashcards", "Quizzes", "Task management", "Gemini AI, Spotify and OpenWeather integrations", "Secure REST APIs with JWT authentication", "Persistent data storage, deployed on Vercel and Render"],
        tech: ["Vue.js", "Node.js", "Express.js", "MongoDB", "JWT", "Gemini API", "Spotify API", "OpenWeather API", "Vercel", "Render"],
        contribution: "Engineered the full-stack app with Vue.js, Node.js, Express.js and MongoDB; designed the secure JWT-authenticated REST APIs; integrated the Gemini, Spotify and OpenWeather APIs; and built the responsive UI and cloud deployment.",
        repo: "https://github.com/JOSH-cyber-tech/StudySync", demo: ""
      }
    },
    // Storm: one beat at a time, in order. Story beats have text; challenge beats point into `challenges`.
    storm: [
      { label: "Where it started", text: "I started as a tech enthusiast, fascinated by what people could build with code." },
      { label: "The first roadblock", text: "Turning curiosity into working software was a different challenge altogether." },
      { challenge: 0 }, { challenge: 1 }, { challenge: 2 },
      { label: "The struggle", text: "Some approaches failed. Sometimes the hardest part was figuring out what I didn’t understand yet." },
      { label: "Clearing up", text: "Every bug I chased down taught me something I now carry into the next build." }
    ],
    challenges: [
      { project: "MoodMenu", challenge: "Turning a mood into a recipe that actually makes sense. Two APIs (Gemini and Spoonacular) had to agree on one answer.", why: "AI suggestions are open-ended while recipe data is strict. A mismatch meant empty results or odd combinations, and auth and request errors made it hard to tell which layer was failing.", tried: "Kept the backend as the single place that talks to both APIs, tightened what the AI is asked for, and tested the flows with many different inputs.", learned: "Treat AI output as a suggestion, not a guarantee. Validate it before it reaches the user." },
      { project: "Prahari", challenge: "Judging whether a message is a scam without crying wolf on normal ones.", why: "Scam messages are written to look ordinary, and a wrong call either misses a threat or alarms someone for nothing. Wording matters as much as the model.", tried: "Split the work into separate steps (classification, then risk assessment) and kept the interface clear about how sure the result is.", learned: "A useful safety tool explains its verdict and stays humble about it." },
      { project: "StudySync", challenge: "Making many features feel like one product, and getting it deployed across Vercel and Render.", why: "Planning, flashcards, quizzes and three outside APIs each worked alone but broke when combined. Moving to deployment surfaced environment, auth and CORS issues that never showed locally.", tried: "Secured the REST APIs with JWT, handled each integration failure on its own, and rechecked the deployed app after every change.", learned: "Working on my machine is only the halfway mark. Test the deployed version early." }
    ],
    about: {
      photo: "/assets/hrishita-photo.jpeg", // replace this file to change the photo (here + framed on the porch)
      paragraphs: [
        "I’m an ECE undergrad at GGSIPU who wandered into software and stayed, because building things turned out to be the fun part.",
        "Most of what I know, I learned by making something and then working out why it didn’t work. StudySync, MoodMenu and Prahari each started as a “what if” and turned into a full-stack app, plus a long list of things I now know not to do.",
        "This summer I interned in web development at InAmigos, building reusable components and contributing to production releases. At IEEE BPIT I’m the DSA coordinator: I’ve mentored 20+ students and organized 5+ coding events. Explaining a problem out loud is still the fastest way I’ve found to actually understand it.",
        "I’m an overthinker with a big heart, ambitious dreams and a playful side. Mostly, I want to keep becoming someone I can truly be proud of."
      ],
      offClock: "Right now I want to be on a team where I can build real products, ask a lot of questions, and get noticeably better every month." // a line about you outside code
    },
    contact: { linkedin: "https://www.linkedin.com/in/hrishita-joshi-8b39a5328/", github: "https://github.com/JOSH-cyber-tech", resume: "https://drive.google.com/file/d/1jehxRkNNzUP5aKTC8BfS80sTQsldBa9c/view" }
  };
  // Scroll positions (0–1) of each stop and storm beat.
  Z = { garage: 0.08, mood: 0.20, pra: 0.31, study: 0.42, stormIn: 0.52, stormOut: 0.805, home: 0.94 };
  BEATS = [0.525, 0.565, 0.605, 0.645, 0.685, 0.725, 0.765];

  state = { active: 0, beat: -1, ready: false, open: null, audioStarted: false, audioOn: false, vol: 0.7 };
  mountRef = React.createRef();
  barRef = React.createRef();

  componentDidMount() {
    this.dead = false; // reset in case of a StrictMode dev double-invoke (mount→unmount→mount)
    this.onKey = e => {
      if (e.key === 'Escape' && this.state.open) { this.close(); return; }
      if (this.state.open) return;
      if (e.key === 'e' || e.key === 'E' || (e.key === 'Enter' && e.target === document.body)) {
        const k = { 2: 'mood', 3: 'pra', 4: 'study' }[this.state.active];
        if (k) { e.preventDefault(); this.open(k); }
      }
    };
    window.addEventListener('keydown', this.onKey);
    this.init().catch(e => console.error(e));
  }
  componentWillUnmount() {
    this.dead = true; this.disposeAudio();
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKey);
    document.documentElement.style.overflow = '';
    if (this.renderer) { this.renderer.domElement.removeEventListener('click', this.onClick); this.renderer.dispose(); this.renderer.domElement.remove(); }
  }
  open(k) { this.setState({ open: k }, () => this.audioTick(this.scrollP(), null, k)); document.documentElement.style.overflow = 'hidden'; this.sfx(k); }
  close() { this.setState({ open: null }, () => this.audioTick(this.scrollP(), null, null)); document.documentElement.style.overflow = ''; }
  maxScroll() { return Math.max(1, document.documentElement.scrollHeight - innerHeight); }
  scrollP() { return Math.min(1, Math.max(0, scrollY / this.maxScroll())); }
  goTo(p) { this.autoY = null; window.scrollTo({ top: p * this.maxScroll(), behavior: 'smooth' }); }

  // ─────────────────────────────────────────────────────────────
  // AUDIO. All sound is synthesized live with Web Audio (no files, nothing to host).
  // Volumes: A.layers (0–1 each). Fade speed: A.fade (seconds). Master: A.master.
  // Zones: [fadeInStart, fullIn, fullOut, fadeOutEnd] as journey progress 0–1.
  // ─────────────────────────────────────────────────────────────
  A = {
    master: 0.8, fade: 1.6,
    layers: { birds: 0.67, wind: 0.36, leaves: 0, rain: 0.3, thunder: 0.4, cafe: 0, cyber: 0, library: 0, crickets: 0, ui: 0.5 },
    zones: { mood: [0.14, 0.19, 0.22, 0.27], pra: [0.25, 0.30, 0.32, 0.36], study: [0.36, 0.41, 0.43, 0.48], storm: [0.49, 0.62, 0.74, 0.86], home: [0.80, 0.92, 1.01, 1.02] }
  };
  zoneW(z, P) { const e = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / ((b - a) || 1e-6))); return t * t * (3 - 2 * t); }; return e(z[0], z[1], P) * (1 - e(z[2], z[3], P)); }

  startSound() {
    if (this.au) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx(); const au = this.au = { ctx, L: {}, timers: new Set(), nodes: [] };
      const p = ctx.resume(); if (p && p.catch) p.catch(() => {});
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 6; comp.knee.value = 12;
      const master = au.master = ctx.createGain(); master.gain.value = 0; master.connect(comp); comp.connect(ctx.destination);
      const len = ctx.sampleRate * 4, mkBuf = fn => { const b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); fn(d); return b; };
      const white = mkBuf(d => { for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; });
      const brown = mkBuf(d => { let l = 0; for (let i = 0; i < len; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } });
      const noise = (buf) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random() * 3); au.nodes.push(s); return s; };
      const filt = (type, f, q = 0.7) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
      const gain = v => { const g = ctx.createGain(); g.gain.value = v; return g; };
      const lfo = (hz, depth, target) => { const o = ctx.createOscillator(); o.frequency.value = hz; const g = gain(depth); o.connect(g); g.connect(target); o.start(); au.nodes.push(o); return g; };
      const layer = n => { const g = gain(0); g.connect(master); au.L[n] = g; return g; };
      au.noiseBuf = white;
      // wind: brown noise, slowly gusting; filter opens with intensity
      const wL = layer('wind'), wF = filt('lowpass', 380, 0.5), gust = gain(0.6);
      noise(brown).connect(wF); wF.connect(gust); gust.connect(wL); au.windF = wF;
      au.gustD = [lfo(0.11, 0.2, gust.gain), lfo(0.27, 0.12, gust.gain)];
      // leaves: airy high noise with slow swell
      const lL = layer('leaves'), lg = gain(0.5); noise(white).connect(filt('highpass', 3200)); const lb = filt('bandpass', 5200, 0.6);
      const ls = noise(white); ls.connect(lb); lb.connect(lg); lg.connect(lL); lfo(0.23, 0.3, lg.gain); lfo(0.61, 0.15, lg.gain);
      // rain: broad hiss + low body
      const rL = layer('rain'), rh = filt('highpass', 900), rl = filt('lowpass', 8500), rg = gain(0.5);
      noise(white).connect(rh); rh.connect(rl); rl.connect(rg); rg.connect(rL); lfo(0.17, 0.12, rg.gain);
      const rb = filt('bandpass', 400, 0.5), rbg = gain(0.5); noise(white).connect(rb); rb.connect(rbg); rbg.connect(rL);
      // café murmur: band-limited noise with syllabic wobble
      const cL = layer('cafe'); [[520, 0.9, 0.35], [900, 1.1, 0.22]].forEach(([f, q, a], i) => { const b = filt('bandpass', f, q), g = gain(a); noise(white).connect(b); b.connect(g); g.connect(cL); lfo(3.1 + i * 1.3, a * 0.5, g.gain); lfo(0.4 + i * 0.2, a * 0.3, g.gain); });
      // cyber: quiet vent noise + mains hum
      const yL = layer('cyber'), yb = filt('bandpass', 260, 0.6), yg = gain(0.5); noise(white).connect(yb); yb.connect(yg); yg.connect(yL);
      [100, 150].forEach((f, i) => { const o = ctx.createOscillator(); o.frequency.value = f; const g = gain(0.03 / (i + 1)); o.connect(g); g.connect(yL); o.start(); au.nodes.push(o); });
      // library: low room tone
      const bL = layer('library'), bf = filt('lowpass', 220), bg = gain(0.5); noise(brown).connect(bf); bf.connect(bg); bg.connect(bL);
      // crickets: two pulsing high tones
      const kL = layer('crickets'); [4300, 4700].forEach((f, i) => { const o = ctx.createOscillator(); o.frequency.value = f; const g = gain(0.04); o.connect(g); g.connect(kL); o.start(); au.nodes.push(o); lfo(13 + i * 2.3, 0.04, g.gain); lfo(0.3 + i * 0.1, 0.02, g.gain); });
      layer('birds'); layer('thunder'); layer('ui');
      // sporadic one-shots
      const later = (fn, lo, hi) => { const tick = () => { const id = setTimeout(() => { au.timers.delete(id); if (this.au !== au) return; if (ctx.state === 'running' && this.state.audioOn) fn(); tick(); }, (lo + Math.random() * (hi - lo)) * 1000); au.timers.add(id); }; tick(); };
      later(() => this.chirp(), 0.8, 4.5);
      later(() => { if (au.stI > 0.2 && Math.random() < 0.8) this.thunder(0, 0.35 + Math.random() * 0.25); }, 9, 20);
      later(() => { if ((au.w || {}).mood > 0.2 && !this.state.open) this.clink(); }, 6, 14);
      later(() => { if ((au.w || {}).study > 0.3) this.pageTurn(); }, 14, 28);
      document.addEventListener('visibilitychange', this.onVis = () => { if (!this.au) return; if (document.hidden) ctx.suspend().catch(() => {}); else if (this.state.audioOn) { const r = ctx.resume(); if (r && r.catch) r.catch(() => {}); } });
      au.vol = parseFloat(sessionStorage.getItem('ride-vol') ?? '0.7');
      this.setState({ audioStarted: true, audioOn: true, vol: au.vol }, () => { this.applyMaster(); this.audioTick(this.scrollP(), null, this.state.open, true); });
    } catch (e) { console.warn('Audio unavailable', e); this.au = null; }
  }
  applyMaster() { const au = this.au; if (!au) return; const on = this.state.audioOn; au.master.gain.setTargetAtTime(on ? this.A.master * au.vol * au.vol : 0, au.ctx.currentTime, 0.25); }
  toggleSound() {
    const au = this.au; if (!au) return this.startSound();
    const on = !this.state.audioOn;
    this.setState({ audioOn: on }, () => {
      this.applyMaster();
      if (on) { const r = au.ctx.resume(); if (r && r.catch) r.catch(() => {}); }
      else setTimeout(() => { if (this.au === au && !this.state.audioOn) au.ctx.suspend().catch(() => {}); }, 600);
    });
  }
  setVol(v) { const au = this.au; if (!au) return; au.vol = v; try { sessionStorage.setItem('ride-vol', v); } catch (e) {} this.setState({ vol: v }, () => this.applyMaster()); }
  audioTick(P, _w, open, force) {
    const au = this.au; if (!au || (!force && !this.state.audioOn)) return;
    const A = this.A, Lv = A.layers, Z = A.zones, z = {}, t = au.ctx.currentTime, tc = A.fade / 3;
    for (const k in Z) z[k] = this.zoneW(Z[k], P);
    if (open) { z.mood = open === 'mood' ? 1 : 0; z.pra = open === 'pra' ? 1 : 0; z.study = open === 'study' ? 1 : 0; }
    au.w = z; const st = z.storm, ind = Math.max(z.pra * 0.9, z.study), cf = z.mood * 0.5;
    au.stI = st;
    const e = (a, b, x) => { const q = Math.min(1, Math.max(0, (x - a) / (b - a))); return q * q * (3 - 2 * q); };
    const out = open ? 0.45 : 1; // quieter outdoors while a project is open
    const set = (n, v) => au.L[n].gain.setTargetAtTime(Math.max(0, v) * Lv[n], t, tc);
    const birds = (1 - e(0, 0.6, st)) * (1 - 0.7 * ind) * (1 - 0.3 * cf) * (1 - 0.2 * z.home);
    set('birds', birds * out);
    set('wind', (0.2 + 0.5 * st * (1 - 0.3 * z.home)) * (1 - 0.8 * ind) * out * (z.home > 0.5 ? 0.6 : 1));
    set('leaves', (0.3 + 0.7 * st * 0.6) * (1 - 0.85 * ind) * out * (z.home > 0.5 ? 0.8 : 1));
    set('rain', e(0.2, 1, st) * (1 - 0.6 * ind) * out * (open ? 0.7 : 1));
    set('thunder', st);
    set('cafe', z.mood); set('cyber', z.pra); set('library', z.study);
    set('crickets', z.home * (1 - st));
    set('ui', 1);
    au.windF.frequency.setTargetAtTime(380 + 900 * st, t, tc);
    au.gustD[0].gain.setTargetAtTime(0.1 + 0.45 * st, t, tc); au.gustD[1].gain.setTargetAtTime(0.06 + 0.3 * st, t, tc);
  }
  noteAt(au, bus, t0, f0, f1, dur, amp, pan) {
    const c = au.ctx, o = c.createOscillator(), g = c.createGain(), p = c.createStereoPanner ? c.createStereoPanner() : null;
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(amp, t0 + dur * 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); if (p) { p.pan.value = pan; g.connect(p); p.connect(bus); } else g.connect(bus);
    o.start(t0); o.stop(t0 + dur + 0.05); o.onended = () => { try { o.disconnect(); g.disconnect(); if (p) p.disconnect(); } catch (e) {} };
  }
  chirp() {
    const au = this.au; if (!au || au.L.birds.gain.value < 0.02) return;
    if (Math.random() < ((au.w || {}).home || 0) * 0.45) return; // near home: sparse, calm
    const c = au.ctx, t = c.currentTime + 0.02, pan = Math.random() * 1.6 - 0.8, far = Math.random() < 0.4;
    const bus = c.createBiquadFilter(); bus.type = 'lowpass'; bus.frequency.value = far ? 3600 : 7000; bus.connect(au.L.birds);
    const amp = (far ? 0.05 : 0.1) * (0.6 + Math.random() * 0.4), kind = Math.floor(Math.random() * 3), base = 2600 + Math.random() * 1600;
    if (kind === 0) { const n = 2 + Math.floor(Math.random() * 4); for (let i = 0; i < n; i++) this.noteAt(au, bus, t + i * 0.13, base * (1 + (i % 2) * 0.18), base * 1.25, 0.09, amp, pan); }
    else if (kind === 1) { this.noteAt(au, bus, t, base * 1.3, base * 0.85, 0.32, amp, pan); if (Math.random() < 0.6) this.noteAt(au, bus, t + 0.4, base * 1.15, base * 0.8, 0.28, amp * 0.8, pan); }
    else { const n = 5 + Math.floor(Math.random() * 5); for (let i = 0; i < n; i++) this.noteAt(au, bus, t + i * 0.055, base, base * 1.12, 0.035, amp * 0.8, pan); }
    setTimeout(() => { try { bus.disconnect(); } catch (e) {} }, 2500);
  }
  burst(dest, t0, dur, type, f, q, amp, attack) {
    const au = this.au, c = au.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = au.noiseBuf; fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(amp, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(fl); fl.connect(g); g.connect(dest); s.start(t0, Math.random() * 3, dur + 0.1); s.onended = () => { try { s.disconnect(); fl.disconnect(); g.disconnect(); } catch (e) {} };
  }
  thunder(delay, strength) {
    const au = this.au; if (!au || au.ctx.state !== 'running' || !this.state.audioOn) return;
    const t = au.ctx.currentTime + delay, d = 2.5 + strength * 3;
    this.burst(au.L.thunder, t, d, 'lowpass', 110 + strength * 90, 0.5, 0.5 * strength, 0.35 + strength * 0.4);
    this.burst(au.L.thunder, t, d * 0.5, 'bandpass', 320, 0.7, 0.08 * strength, 0.5);
  }
  clink() { const au = this.au; if (!au) return; const t = au.ctx.currentTime + 0.02, f = 3000 + Math.random() * 900; this.noteAt(au, au.L.ui, t, f, f * 0.98, 0.35, 0.05, (Math.random() - 0.5) * 1.2); if (Math.random() < 0.5) this.noteAt(au, au.L.ui, t + 0.09, f * 1.5, f * 1.48, 0.25, 0.03, 0); }
  pageTurn() {}
  sfx(k) {
    const au = this.au; if (!au || !this.state.audioOn) return; const t = au.ctx.currentTime + 0.02;
    if (k === 'mood') this.clink();
    else if (k === 'pra') { this.noteAt(au, au.L.ui, t, 660, 660, 0.18, 0.05, 0); this.noteAt(au, au.L.ui, t + 0.1, 880, 880, 0.24, 0.05, 0); }
    else if (k === 'study') this.pageTurn();
  }
  disposeAudio() {
    const au = this.au; if (!au) return; this.au = null;
    au.timers.forEach(clearTimeout); au.nodes.forEach(n => { try { n.stop(); } catch (e) {} });
    document.removeEventListener('visibilitychange', this.onVis);
    try { au.ctx.close(); } catch (e) {}
  }

  async init() {
        try { await document.fonts.ready; } catch (e) {}
    if (this.dead) return;
    const host = this.mountRef.current, Z = this.Z;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const L = 700, tG = Z.garage * L, tM = Z.mood * L, tP = Z.pra * L, tS = Z.study * L, tH = Z.home * L;
    const stopT = [tG, tM, tP, tS, tH];
    const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
    const vnoise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
    const fbm = (x, y, o) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f); f *= 2.03; a *= 0.5; } return s / (1 - Math.pow(0.5, o)); };

    let dpr = Math.min(devicePixelRatio, 1.5);
    const r = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(dpr); r.setSize(innerWidth, innerHeight);
    r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    r.outputColorSpace = T.SRGBColorSpace;
    r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
    r.domElement.style.display = 'block';
    host.appendChild(r.domElement); this.renderer = r;
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 2200);
    scene.fog = new T.FogExp2(0xf0a189, 0.0026);
    this.onResize = () => { cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); r.setSize(innerWidth, innerHeight); };
    window.addEventListener('resize', this.onResize);

    const cx = t => Math.sin(t * 0.012) * 14 + Math.sin(t * 0.0045) * 18;
    const dcx = t => Math.cos(t * 0.012) * 0.168 + Math.cos(t * 0.0045) * 0.081;
    const roadPt = t => new T.Vector3(cx(t), 0, -t);
    const perp = t => { const d = dcx(t), n = Math.hypot(1, d); return new T.Vector3(1 / n, 0, d / n); };
    const heading = t => Math.atan2(-dcx(t), 1);
    const terrainH = (x, z) => {
      const t = -z, d = Math.abs(x - cx(t));
      let w = 0; for (const s of stopT) w = Math.max(w, 1 - ss(25, 55, Math.abs(t - s)));
      const st = 9 + 24 * w, near = ss(st, st + 35, d);
      const hills = fbm(x * 0.012 + 3.1, z * 0.012 - 1.7, 4) * 18;
      const rr = fbm(x * 0.0045 + 9, z * 0.0045 + 2, 5), ridge = 1 - Math.abs(2 * rr - 1);
      return near * hills * (0.35 + 0.65 * near) + ss(70, 240, d) * Math.pow(ridge, 2.2) * 190 - 0.12;
    };

    const M = (c, o = {}) => new T.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
    const mesh = (geo, mat) => { const m = new T.Mesh(geo, typeof mat === 'number' ? M(mat) : mat); m.castShadow = true; m.receiveShadow = true; return m; };
    const box = (w, h, d, c) => mesh(new T.BoxGeometry(w, h, d), c);
    const cap = (rad, len, c) => mesh(new T.CapsuleGeometry(rad, len, 4, 12), c);
    const sph = (rad, c) => mesh(new T.SphereGeometry(rad, 18, 12), c);
    const cyl = (r1, r2, h, c, s = 16) => mesh(new T.CylinderGeometry(r1, r2, h, s), c);
    const plane = (w, h, mat) => new T.Mesh(new T.PlaneGeometry(w, h), mat);
    const rgb = h => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
    const shade = (h, k) => { const [a, b, c] = rgb(h); return `rgb(${Math.min(255, a * k) | 0},${Math.min(255, b * k) | 0},${Math.min(255, c * k) | 0})`; };
    const tex = (w, h, draw, rx = 1, ry = 1) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; return t; };
    const speckle = (g, w, h, n, a) => { for (let i = 0; i < n; i++) { g.fillStyle = Math.random() < 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };
    const brickTex = (base, rx, ry) => tex(256, 256, (g, w, h) => { g.fillStyle = '#d8cec2'; g.fillRect(0, 0, w, h); for (let row = 0; row < h / 16; row++) for (let x = -(row % 2) * 24; x < w; x += 48) { g.fillStyle = shade(base, 0.82 + Math.random() * 0.3); g.fillRect(x + 1.5, row * 16 + 1.5, 45, 13); } speckle(g, w, h, 2500, 0.07); }, rx, ry);
    const stoneTex = (base, rx, ry) => tex(256, 256, (g, w, h) => { g.fillStyle = shade(base, 0.7); g.fillRect(0, 0, w, h); for (let row = 0; row < h / 32; row++) for (let x = -(row % 2) * 40; x < w; x += 80) { g.fillStyle = shade(base, 0.9 + Math.random() * 0.15); g.fillRect(x + 1.5, row * 32 + 1.5, 77, 29); } speckle(g, w, h, 3000, 0.06); }, rx, ry);
    const metalTex = (base, vertical, rx, ry) => tex(256, 256, (g, w, h) => { for (let i = 0; i < 256; i += 16) { const gr = vertical ? g.createLinearGradient(i, 0, i + 16, 0) : g.createLinearGradient(0, i, 0, i + 16); gr.addColorStop(0, shade(base, 1.15)); gr.addColorStop(0.5, shade(base, 0.95)); gr.addColorStop(1, shade(base, 0.72)); g.fillStyle = gr; vertical ? g.fillRect(i, 0, 16, h) : g.fillRect(0, i, w, 16); } speckle(g, w, h, 1200, 0.05); }, rx, ry);
    const sidingTex = (base, rx, ry) => tex(256, 256, (g, w, h) => { for (let y = 0; y < h; y += 22) { g.fillStyle = shade(base, 0.96 + Math.random() * 0.06); g.fillRect(0, y, w, 22); g.fillStyle = shade(base, 0.7); g.fillRect(0, y + 19, w, 3); g.fillStyle = shade(base, 1.08); g.fillRect(0, y, w, 1); } speckle(g, w, h, 800, 0.04); }, rx, ry);
    const shingleTex = (base, rx, ry) => tex(256, 256, (g, w, h) => { g.fillStyle = shade(base, 0.5); g.fillRect(0, 0, w, h); for (let row = 0; row < h / 20; row++) for (let x = -(row % 2) * 16; x < w; x += 32) { g.fillStyle = shade(base, 0.8 + Math.random() * 0.35); g.fillRect(x + 1, row * 20 + 1, 30, 18); } speckle(g, w, h, 2000, 0.08); }, rx, ry);
    const woodTex = (base, rx, ry) => tex(128, 256, (g, w, h) => { for (let x = 0; x < w; x += 32) { g.fillStyle = shade(base, 0.85 + Math.random() * 0.25); g.fillRect(x, 0, 31, h); g.fillStyle = shade(base, 0.6); g.fillRect(x + 31, 0, 1, h); for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x + Math.random() * 30, 0, 1, h); } } }, rx, ry);
    const signTex = (txt, bg, fg, font) => tex(640, 128, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = fg; g.lineWidth = 4; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = fg; g.font = font || '600 52px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 3); });
    const stripeTex = (a, b, n) => tex(256, 64, (g, w, h) => { for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(i * w / n, 0, w / n + 1, h); } speckle(g, w, h, 300, 0.05); });
    const place = (obj, t, off) => { const c = roadPt(t), q = perp(t); obj.position.set(c.x + q.x * off, 0, c.z + q.z * off); const dir = q.clone().multiplyScalar(-Math.sign(off)); obj.rotation.y = Math.atan2(dir.x, dir.z); scene.add(obj); return obj; };
    const jitter = (geo, amt) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const hsh = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; const k = 1 + (hsh - Math.floor(hsh) - 0.5) * amt; p.setXYZ(i, x * k, y * k, z * k); } geo.computeVertexNormals(); return geo; };
    const chrome = M(0xd9d9de, { metalness: 1, roughness: 0.22 });
    const rubber = M(0x1c1a1f, { roughness: 0.95 });
    const glow = new T.MeshStandardMaterial({ color: 0xffe2b0, emissive: 0xffc57a, emissiveIntensity: 1.6 });
    const frameM = M(0xfaf5ee, { roughness: 0.6 });
    const glassM = new T.MeshStandardMaterial({ color: 0x2b2c38, emissive: 0xffb766, emissiveIntensity: 0.5, roughness: 0.06, metalness: 0.7 });
    const win = (w, h, gm = glassM, fm = frameM) => { const g = new T.Group(); g.add(box(w + 0.24, h + 0.24, 0.1, fm)); const gl = plane(w, h, gm); gl.position.z = 0.06; g.add(gl); const m1 = box(0.07, h, 0.05, fm); m1.position.z = 0.08; g.add(m1); const m2 = box(w, 0.07, 0.05, fm); m2.position.z = 0.08; g.add(m2); const sill = box(w + 0.5, 0.1, 0.28, fm); sill.position.set(0, -h / 2 - 0.15, 0.12); g.add(sill); return g; };

    // sky + palettes (sunset → cyber dusk → library dusk → storm → clear)
    const sunDir = new T.Vector3(-0.12, 0.1, -1).normalize();
    const skyMat = new T.ShaderMaterial({
      uniforms: { top: { value: new T.Color() }, hor: { value: new T.Color() }, bot: { value: new T.Color() }, sunCol: { value: new T.Color(0xffb070) }, uSun: { value: 1 }, sunDir: { value: sunDir } },
      side: T.BackSide, depthWrite: false, fog: false, toneMapped: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 hor; uniform vec3 bot; uniform vec3 sunCol; uniform float uSun; uniform vec3 sunDir; varying vec3 vP;\nvoid main(){ vec3 d = normalize(vP); float h = d.y; vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h*1.6,0.0,1.0),0.6)) : mix(hor, bot, clamp(-h*6.0,0.0,1.0)); float sd = max(dot(d, sunDir), 0.0); c += sunCol * (pow(sd, 5.0)*0.3 + pow(sd, 60.0)*0.7) * uSun; c = mix(c, vec3(1.0,0.96,0.88)*1.4, smoothstep(0.9991, 0.9995, sd) * uSun); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}'
    });
    const sky = new T.Mesh(new T.SphereGeometry(1000, 32, 16), skyMat); sky.renderOrder = -1; scene.add(sky);
    const P_ = {
      sunset: { top: 0x4e4a9a, hor: 0xff9068, bot: 0xffc290, fog: 0xe9a28c, hs: 0xffc6a8, hg: 0x6a5a4a, sun: 0xffa060, cloud: 0xffd6c8, glow: 0xffa860 },
      cyber: { top: 0x161c38, hor: 0x4a4c7e, bot: 0x343a5a, fog: 0x3c4266, hs: 0x8a98d0, hg: 0x2c2c3c, sun: 0x9098e0, cloud: 0x6e70a0, glow: 0x6a5aa0 },
      library: { top: 0x312e6a, hor: 0xd88a74, bot: 0xb88a78, fog: 0xa47e88, hs: 0xd8b4ac, hg: 0x4a3e44, sun: 0xff9a6a, cloud: 0xd2a2aa, glow: 0xff9060 },
      storm: { top: 0x1f2333, hor: 0x535b70, bot: 0x454b5c, fog: 0x575e70, hs: 0x8a93ad, hg: 0x3a3a40, sun: 0x9aa3bd, cloud: 0x4a4f60, glow: 0x000000 },
      clear: { top: 0x4f86cf, hor: 0xffd3b0, bot: 0xffe4c4, fog: 0xeec6b0, hs: 0xffe8d4, hg: 0x7a6a5a, sun: 0xffd2a0, cloud: 0xfff2ea, glow: 0xffc890 }
    };
    const pal = {}; for (const k in P_) { pal[k] = {}; for (const c in P_[k]) pal[k][c] = new T.Color(P_[k][c]); }
    const pmrem = new T.PMREMGenerator(r);
    const envScene = new T.Scene(); const envMat = skyMat.clone(); envScene.add(new T.Mesh(new T.SphereGeometry(100, 32, 16), envMat));
    const envs = {};
    for (const k in P_) { envMat.uniforms.top.value.copy(pal[k].top); envMat.uniforms.hor.value.copy(pal[k].hor); envMat.uniforms.bot.value.copy(pal[k].hg); envMat.uniforms.sunCol.value.copy(pal[k].glow); envMat.uniforms.uSun.value = k === 'storm' ? 0 : 1; envs[k] = pmrem.fromScene(envScene, 0.04).texture; }
    pmrem.dispose(); scene.environment = envs.sunset; let envKey = 'sunset';

    const hemi = new T.HemisphereLight(0xffc6a8, 0x6a5a4a, 0.6); scene.add(hemi);
    const sunL = new T.DirectionalLight(0xffa060, 2.6);
    sunL.castShadow = true; sunL.shadow.mapSize.set(1024, 1024);
    Object.assign(sunL.shadow.camera, { left: -36, right: 36, top: 36, bottom: -36, near: 1, far: 320 });
    sunL.shadow.bias = -0.0004; sunL.shadow.normalBias = 0.04;
    scene.add(sunL, sunL.target);

    // terrain
    const tg = new T.PlaneGeometry(1000, L + 1000, 200, 340); tg.rotateX(-Math.PI / 2); tg.translate(0, 0, -L / 2);
    const tp = tg.attributes.position;
    for (let i = 0; i < tp.count; i++) tp.setY(i, terrainH(tp.getX(i), tp.getZ(i)));
    tg.computeVertexNormals();
    const tn = tg.attributes.normal, cols = new Float32Array(tp.count * 3), tc = new T.Color();
    const gA = new T.Color(0x6f7f42), gB = new T.Color(0xa2915a), dirt = new T.Color(0xa47e62), rock = new T.Color(0x76686a), snow = new T.Color(0xf4eee8);
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i), ny = tn.getY(i), d = Math.abs(x - cx(-z));
      tc.copy(gA).lerp(gB, fbm(x * 0.03, z * 0.03, 3));
      tc.lerp(dirt, 1 - ss(7, 11, d));
      tc.lerp(rock, Math.max(ss(0.86, 0.66, ny), ss(35, 90, y) * 0.75));
      tc.lerp(snow, ss(100, 130, y) * ss(0.5, 0.75, ny));
      cols.set([tc.r, tc.g, tc.b], i * 3);
    }
    tg.setAttribute('color', new T.BufferAttribute(cols, 3));
    const terrain = new T.Mesh(tg, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
    terrain.receiveShadow = true; scene.add(terrain);

    // road
    const asphalt = tex(256, 512, (g, w, h) => { g.fillStyle = '#34303a'; g.fillRect(0, 0, w, h); speckle(g, w, h, 9000, 0.12); g.fillStyle = '#efe9e0'; g.fillRect(10, 0, 8, h); g.fillRect(w - 18, 0, 8, h); g.fillStyle = '#f2cf7a'; g.fillRect(w / 2 - 4, 0, 8, h * 0.38); });
    const gravel = tex(128, 128, (g, w, h) => { g.fillStyle = '#a7826a'; g.fillRect(0, 0, w, h); speckle(g, w, h, 3000, 0.18); });
    const ribbon = (w, y, mat, vs) => {
      const p = [], uv = [], idx = []; let k = 0;
      for (let t = -80; t <= L + 140; t += 2) {
        const c = roadPt(t), q = perp(t);
        p.push(c.x - q.x * w / 2, y, c.z - q.z * w / 2, c.x + q.x * w / 2, y, c.z + q.z * w / 2); uv.push(0, t / vs, 1, t / vs);
        if (k > 0) { const a = (k - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } k++;
      }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(p, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
      const m = new T.Mesh(g, mat); m.receiveShadow = true; scene.add(m); return m;
    };
    ribbon(12.5, 0.03, new T.MeshStandardMaterial({ map: gravel, roughness: 1 }), 5);
    const roadMat = new T.MeshStandardMaterial({ map: asphalt, roughness: 0.85, metalness: 0 });
    ribbon(8, 0.06, roadMat, 8);
    const wetCol = new T.Color(0x8a8a96), dryCol = new T.Color(0xffffff);

    // trees (instanced)
    const blobG = jitter(new T.SphereGeometry(1, 14, 10), 0.22);
    const pineG = jitter(new T.ConeGeometry(1, 1, 14, 4), 0.08); pineG.translate(0, 0.5, 0);
    const trunkG = new T.CylinderGeometry(0.12, 0.2, 1, 7); trunkG.translate(0, 0.5, 0);
    const trunkM = [], blobM = [], pineM = [], blobC = [], pineC = [];
    const leafCols = [0x4d6a34, 0x5f7a3a, 0x3c5a34, 0x7a7a36, 0x9a6a34, 0x4a6a44].map(h => new T.Color(h));
    const mx = new T.Matrix4(), qq = new T.Quaternion(), sv = new T.Vector3(), pv = new T.Vector3(), up = new T.Vector3(0, 1, 0);
    const mat4 = (x, y, z, sx, sy, sz, ry) => { qq.setFromAxisAngle(up, ry); return mx.compose(pv.set(x, y, z), qq, sv.set(sx, sy, sz)).clone(); };
    for (let i = 0; i < 620; i++) {
      const t = rnd() * (L + 200) - 60, side = rnd() < 0.5 ? -1 : 1, d = 9.5 + Math.pow(rnd(), 1.6) * 120;
      if (d < 38 && stopT.some(s => Math.abs(t - s) < 28)) continue;
      const c = roadPt(t), q = perp(t), x = c.x + q.x * d * side, z = c.z + q.z * d * side, y = terrainH(x, z) - 0.1;
      if (y > 55) continue;
      const s = 0.75 + rnd() * 0.8, ry = rnd() * 6, col = leafCols[Math.floor(rnd() * leafCols.length)];
      if (rnd() < 0.55) {
        trunkM.push(mat4(x, y, z, s, 2.4 * s, s, ry));
        const n = 2 + Math.floor(rnd() * 2);
        for (let j = 0; j < n; j++) { const a = ry + j * 2.1; blobM.push(mat4(x + Math.cos(a) * 0.6 * s, y + (2.6 + j * 0.6) * s, z + Math.sin(a) * 0.6 * s, (1.3 + rnd() * 0.4) * s, (1.1 + rnd() * 0.3) * s, (1.3 + rnd() * 0.4) * s, rnd() * 6)); blobC.push(col.clone().multiplyScalar(0.85 + rnd() * 0.3)); }
      } else {
        trunkM.push(mat4(x, y, z, s * 0.8, 1.4 * s, s * 0.8, ry));
        pineM.push(mat4(x, y + 1.0 * s, z, 1.6 * s, 3.4 * s, 1.6 * s, ry)); pineC.push(leafCols[2].clone().multiplyScalar(0.8 + rnd() * 0.3));
        pineM.push(mat4(x, y + 2.8 * s, z, 1.15 * s, 2.8 * s, 1.15 * s, ry)); pineC.push(leafCols[2].clone().multiplyScalar(0.85 + rnd() * 0.3));
      }
    }
    const inst = (geo, mat, ms, cs) => { const im = new T.InstancedMesh(geo, mat, ms.length); ms.forEach((m, i) => { im.setMatrixAt(i, m); if (cs) im.setColorAt(i, cs[i]); }); im.castShadow = true; im.receiveShadow = true; scene.add(im); return im; };
    inst(trunkG, M(0x5a4236), trunkM);
    inst(blobG, M(0xffffff, { roughness: 0.9 }), blobM, blobC);
    inst(pineG, M(0xffffff, { roughness: 0.9 }), pineM, pineC);

    // clouds
    const cloudTex = [0, 1, 2].map(v => tex(512, 256, (g, w, h) => { for (let i = 0; i < 22; i++) { const x = w * (0.18 + Math.random() * 0.64), y = h * (0.42 + Math.random() * 0.28) - (Math.abs(x - w / 2) < w * 0.2 ? h * 0.12 : 0), rr = 40 + Math.random() * 70; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(0.6, 'rgba(255,255,255,.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } }));
    const cloudMats = cloudTex.map(t => new T.SpriteMaterial({ map: t, color: 0xffd6c8, transparent: true, depthWrite: false, fog: true }));
    const stormMats = cloudTex.map(t => new T.SpriteMaterial({ map: t, color: 0x3a3f50, transparent: true, depthWrite: false, fog: true, opacity: 0 }));
    for (let i = 0; i < 46; i++) { const t = rnd() * (L + 600) - 80, c = roadPt(t); const sp = new T.Sprite(cloudMats[i % 3]); const s = 140 + rnd() * 180; sp.scale.set(s, s * 0.45, 1); sp.position.set(c.x + (rnd() - 0.5) * 700, 90 + rnd() * 90, c.z - rnd() * 200); scene.add(sp); }
    for (let i = 0; i < 70; i++) { const t = L * (0.5 + rnd() * 0.34), c = roadPt(t); const sp = new T.Sprite(stormMats[i % 3]); const s = 60 + rnd() * 70; sp.scale.set(s, s * 0.5, 1); sp.position.set(c.x + (rnd() - 0.5) * 120, 26 + rnd() * 18, c.z); scene.add(sp); }

    // vehicle + people
    const buildScooter = (col) => {
      const g = new T.Group(), paint = M(col, { roughness: 0.25, metalness: 0.3 }), leather = M(0x3a2a24, { roughness: 0.7 });
      const rear = sph(1, paint); rear.scale.set(0.42, 0.36, 0.7); rear.position.set(0, 0.74, 0.42); g.add(rear);
      const seat = cap(0.16, 0.55, leather); seat.rotation.x = Math.PI / 2; seat.scale.set(1.35, 1, 0.8); seat.position.set(0, 1.08, 0.38); g.add(seat);
      const floor = box(0.5, 0.08, 0.8, rubber); floor.position.set(0, 0.44, -0.32); g.add(floor);
      const shield = cap(0.3, 0.5, paint); shield.scale.set(1.05, 1, 0.35); shield.rotation.x = -0.25; shield.position.set(0, 0.92, -0.8); g.add(shield);
      const fender = sph(1, paint); fender.scale.set(0.2, 0.14, 0.36); fender.position.set(0, 0.6, -0.9); g.add(fender);
      const column = cyl(0.05, 0.05, 0.75, chrome, 8); column.position.set(0, 1.5, -0.9); column.rotation.x = -0.25; g.add(column);
      const hb = cap(0.04, 0.8, chrome); hb.rotation.z = Math.PI / 2; hb.position.set(0, 1.84, -0.82); g.add(hb);
      const lampH = cyl(0.13, 0.13, 0.14, chrome); lampH.rotation.x = Math.PI / 2; lampH.position.set(0, 1.62, -1.0); g.add(lampH);
      const lens = new T.Mesh(new T.CircleGeometry(0.11, 16), glow); lens.position.set(0, 1.62, -1.075); lens.rotation.y = Math.PI; g.add(lens);
      [-1, 1].forEach(s => { const st = cyl(0.015, 0.015, 0.3, chrome, 5); st.position.set(s * 0.32, 1.98, -0.8); g.add(st); const mr = sph(0.07, chrome); mr.position.set(s * 0.33, 2.14, -0.8); g.add(mr); });
      const wheels = [];
      [-0.9, 0.78].forEach(z => { const w = new T.Group(); const tire = mesh(new T.TorusGeometry(0.25, 0.09, 10, 24), rubber); tire.rotation.y = Math.PI / 2; w.add(tire); const hub = cyl(0.14, 0.14, 0.15, chrome); hub.rotation.z = Math.PI / 2; w.add(hub); w.position.set(0, 0.34, z); g.add(w); wheels.push(w); });
      return { g, wheels };
    };
    const skin = M(0xd99c78, { roughness: 0.6 });
    const buildRider = () => {
      const g = new T.Group(), jacket = M(0x2b3a5c, { roughness: 0.7 }), jeans = M(0x384560, { roughness: 0.85 });
      const torso = cap(0.23, 0.42, jacket); torso.position.set(0, 1.62, 0.3); torso.rotation.x = -0.3; g.add(torso);
      const neck = cyl(0.08, 0.08, 0.15, skin, 8); neck.position.set(0, 2.0, 0.2); g.add(neck);
      const head = sph(0.2, skin); head.position.set(0, 2.18, 0.17); g.add(head);
      const helm = mesh(new T.SphereGeometry(0.26, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58), M(0xf6f1ea, { roughness: 0.2, metalness: 0.1 })); helm.position.set(0, 2.2, 0.19); g.add(helm);
      const hair = cap(0.1, 0.3, M(0x1e1614)); hair.position.set(0, 1.95, 0.42); hair.rotation.x = 0.4; g.add(hair);
      [-1, 1].forEach(s => {
        const arm = cap(0.07, 0.5, jacket); arm.rotation.x = 1.1; arm.position.set(s * 0.3, 1.72, -0.22); g.add(arm);
        const hand = sph(0.07, skin); hand.position.set(s * 0.33, 1.84, -0.62); g.add(hand);
        const thigh = cap(0.1, 0.42, jeans); thigh.rotation.x = Math.PI / 2; thigh.position.set(s * 0.16, 1.22, 0.06); g.add(thigh);
        const shin = cap(0.085, 0.42, jeans); shin.position.set(s * 0.16, 0.84, -0.22); shin.rotation.x = 0.2; g.add(shin);
        const shoe = cap(0.08, 0.16, M(0xf2ede6)); shoe.rotation.x = Math.PI / 2; shoe.position.set(s * 0.16, 0.54, -0.32); g.add(shoe);
      });
      return g;
    };
    // little Hrishita at home: black top, wavy dark hair, red hibiscus, pale-blue bag
    const buildPerson = () => {
      const g = new T.Group(), top = M(0x1f1c24, { roughness: 0.75 }), pants = M(0x9fb4cc), hairM = M(0x1e1614, { roughness: 0.9 });
      [-1, 1].forEach(s => { const l = cap(0.1, 0.62, pants); l.position.set(s * 0.12, 0.42, 0); g.add(l); });
      const torso = cap(0.24, 0.42, top); torso.position.y = 1.18; g.add(torso);
      const head = sph(0.2, skin); head.position.y = 1.78; g.add(head);
      const hair = sph(0.23, hairM); hair.scale.set(1.08, 0.95, 1); hair.position.set(0, 1.84, -0.05); g.add(hair);
      const back = cap(0.2, 0.22, hairM); back.scale.set(1.2, 1, 0.7); back.position.set(0, 1.6, -0.1); g.add(back);
      const flower = sph(0.08, M(0xd8262e, { roughness: 0.5 })); flower.scale.set(1, 1, 0.6); flower.position.set(-0.2, 1.88, 0.08); g.add(flower);
      const bag = box(0.18, 0.32, 0.34, M(0x8fb3bd, { roughness: 0.5 })); bag.position.set(-0.4, 0.98, 0); g.add(bag);
      const left = cap(0.07, 0.5, skin); left.position.set(-0.33, 1.15, 0); left.rotation.z = -0.1; g.add(left);
      const pivot = new T.Group(); pivot.position.set(0.3, 1.45, 0); const arm = cap(0.07, 0.5, skin); arm.position.y = -0.3; pivot.add(arm); const hand = sph(0.07, skin); hand.position.y = -0.62; pivot.add(hand); g.add(pivot);
      return { g, pivot };
    };
    const rider = new T.Group(); const sc = buildScooter(0xf2c14e); rider.add(sc.g, buildRider()); rider.scale.setScalar(1.15); scene.add(rider);

    // ── Stop 1: garage
    const gar = new T.Group();
    const gw = box(11, 6, 8, M(0xffffff, { map: metalTex(0x4f8a8b, true, 5, 1), roughness: 0.5, metalness: 0.3 })); gw.position.y = 3; gar.add(gw);
    const gbase = box(11.15, 0.9, 8.15, M(0xffffff, { map: brickTex(0x9a4e3c, 4, 0.4) })); gbase.position.y = 0.45; gar.add(gbase);
    const groof = box(12, 0.35, 9.4, M(0x2b3a3c, { roughness: 0.6, metalness: 0.4 })); groof.position.y = 6.18; gar.add(groof);
    const door = plane(6.2, 4.4, M(0xffffff, { map: metalTex(0xb8b3ba, false, 1, 3), roughness: 0.45, metalness: 0.5 })); door.position.set(-1.6, 2.2, 4.08); gar.add(door);
    [-4.75, 1.55].forEach(x => { const p = box(0.25, 4.6, 0.2, 0x2b3a3c); p.position.set(x, 2.3, 4.1); gar.add(p); });
    const gwin = win(2.4, 1.6); gwin.position.set(3.4, 3.4, 4.02); gar.add(gwin);
    const gsb = box(8.4, 1.9, 0.3, 0x2a1f2e); gsb.position.set(0, 7.3, 3.4); gar.add(gsb);
    const gs = plane(8, 1.6, new T.MeshBasicMaterial({ map: signTex('GARAGE · SKILLS', '#f2c14e', '#2a1f2e'), toneMapped: false })); gs.position.set(0, 7.3, 3.56); gar.add(gs);
    [-3, 0, 3].forEach(x => { const l = sph(0.12, glow); l.position.set(x, 8.4, 3.7); gar.add(l); });
    const tireG = new T.TorusGeometry(0.55, 0.24, 12, 24);
    [0.25, 0.75, 1.25].forEach((y, i) => { const t = mesh(tireG, rubber); t.rotation.x = Math.PI / 2; t.position.set(4.3 + i * 0.05, y, 6); gar.add(t); });
    [[4.9, 4.6], [3.7, 5.0]].forEach(([x, z]) => { const d = cyl(0.55, 0.55, 1.5, M(0xb8443a, { roughness: 0.4, metalness: 0.4 }), 20); d.position.set(x, 0.75, z + 0.4); gar.add(d); });
    const tb = box(1.3, 0.8, 0.6, M(0xd2463f, { roughness: 0.35, metalness: 0.3 })); tb.position.set(-5.8, 0.4, 5.4); gar.add(tb);
    const parked = buildScooter(0x7fb3e0); parked.g.position.set(-1.6, 0, 6.3); parked.g.rotation.y = 1.2; gar.add(parked.g);
    place(gar, tG + 6, 15);

    // ── Stop 2: MoodMenu café (warm)
    const cafe = new T.Group();
    const cw = box(11, 5, 8, M(0xffffff, { map: brickTex(0xb8644e, 5, 2.5) })); cw.position.y = 2.5; cafe.add(cw);
    const cr = box(11.4, 0.6, 8.4, 0x5a3430); cr.position.y = 5.3; cafe.add(cr);
    const awn = box(11.2, 0.08, 2.8, M(0xffffff, { map: stripeTex('#c4566b', '#fff3e6', 18), roughness: 0.9 })); awn.position.set(0, 3.95, 5.25); awn.rotation.x = 0.32; cafe.add(awn);
    const bulbs = [];
    for (let i = 0; i < 13; i++) { const x = -5.2 + i * 0.866; const l = sph(0.07, glow); l.castShadow = false; l.position.set(x, 3.4 - Math.sin((i / 12) * Math.PI) * 0.2, 6.55); cafe.add(l); bulbs.push(l); }
    const cafeGlass = new T.MeshStandardMaterial({ color: 0x2b2420, emissiveMap: tex(256, 192, (g, w, h) => { g.fillStyle = '#ffb066'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a4a2a'; for (let i = 0; i < 3; i++) { g.fillRect(20 + i * 80, 120, 56, 10); g.fillRect(44 + i * 80, 130, 8, 50); } g.fillStyle = '#fff0c8'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(30 + i * 65, 30, 10, 0, 7); g.fill(); } }), emissive: 0xffffff, emissiveIntensity: 0.85, roughness: 0.08, metalness: 0.5 });
    [-3.3, 3.3].forEach(x => { const w = win(3, 2.2, cafeGlass); w.position.set(x, 2.2, 4.02); cafe.add(w); });
    const cd = plane(1.6, 2.9, M(0xffffff, { map: woodTex(0x7a4e36, 1, 1) })); cd.position.set(0, 1.45, 4.03); cafe.add(cd);
    const csb = box(8.4, 1.9, 0.3, 0x2a1f2e); csb.position.set(0, 6.6, 3.4); cafe.add(csb);
    const cafeSignM = new T.MeshBasicMaterial({ map: signTex('MoodMenu', '#2a1810', '#ffc98a', 'italic 400 76px "DM Serif Display", serif'), toneMapped: false });
    const cs = plane(8, 1.6, cafeSignM); cs.position.set(0, 6.6, 3.56); cafe.add(cs);
    const chalk = tex(256, 320, (g, w, h) => { g.fillStyle = '#22302a'; g.fillRect(0, 0, w, h); speckle(g, w, h, 1500, 0.05); g.fillStyle = '#f3eee4'; g.textAlign = 'center'; g.font = '600 36px "JetBrains Mono", monospace'; g.fillText('MENU', w / 2, 56); g.font = '22px "JetBrains Mono", monospace'; ['how are', 'you feeling', 'today?'].forEach((t, i) => g.fillText(t, w / 2, 118 + i * 34)); g.fillStyle = '#f6c27a'; g.font = '28px "JetBrains Mono", monospace'; g.fillText(':)  :|  :(', w / 2, 262); });
    const easel = new T.Group();
    const eb = box(1.3, 1.65, 0.06, M(0x6b4430)); eb.position.y = 1.35; easel.add(eb);
    const ebf = plane(1.15, 1.5, M(0xffffff, { map: chalk, roughness: 0.95 })); ebf.position.set(0, 1.35, 0.035); easel.add(ebf);
    [-0.5, 0.5].forEach(x => { const lg = box(0.07, 1.4, 0.07, 0x6b4430); lg.position.set(x, 0.65, -0.12); lg.rotation.x = 0.12; easel.add(lg); });
    easel.position.set(-1.6, 0, 5.2); easel.rotation.y = 0.25; cafe.add(easel);
    const umbM = M(0xffffff, { map: stripeTex('#fff3e6', '#e08a5a', 12), side: T.DoubleSide });
    [-3.6, 0, 3.6].forEach(x => {
      const top = cyl(0.8, 0.8, 0.08, M(0xf3ede4, { roughness: 0.4 }), 24); top.position.set(x, 0.95, 7.9); cafe.add(top);
      const leg = cyl(0.05, 0.05, 3, chrome, 8); leg.position.set(x, 1.5, 7.9); cafe.add(leg);
      const um = mesh(new T.ConeGeometry(1.7, 0.7, 16, 1, true), umbM); um.position.set(x, 3.1, 7.9); cafe.add(um);
      const cup = cyl(0.08, 0.06, 0.14, 0xffffff, 10); cup.position.set(x + 0.2, 1.06, 7.8); cafe.add(cup);
      [-1, 1].forEach(s => { const seat = cyl(0.3, 0.3, 0.08, M(0x6b4a3a), 16); seat.position.set(x + s * 1.1, 0.55, 7.9); cafe.add(seat); const cl = cyl(0.04, 0.04, 0.55, chrome, 6); cl.position.set(x + s * 1.1, 0.27, 7.9); cafe.add(cl); });
    });
    [-1.4, 1.4].forEach(x => { const pot = cyl(0.35, 0.28, 0.6, 0x8a5a44); pot.position.set(x + 2.8, 0.3, 4.6); cafe.add(pot); const b = mesh(blobG, M(0x4d6a34)); b.scale.setScalar(0.55); b.position.set(x + 2.8, 0.95, 4.6); cafe.add(b); });
    place(cafe, tM + 6, -15);

    // ── Stop 3: Prahari cyber cell (navy, restrained cyan/green)
    const cyb = new T.Group();
    const cyan = new T.MeshBasicMaterial({ color: 0x46d8ea, toneMapped: false });
    const green = new T.MeshBasicMaterial({ color: 0x5fe39a, toneMapped: false });
    const panelM = M(0xffffff, { map: metalTex(0x2a3142, true, 6, 1), roughness: 0.45, metalness: 0.6 });
    const cbody = box(12, 5.6, 8, panelM); cbody.position.y = 2.8; cyb.add(cbody);
    const cbase = box(12.3, 0.5, 8.3, 0x161a24); cbase.position.y = 0.25; cyb.add(cbase);
    const croof = box(12.6, 0.3, 8.6, 0x161a24); croof.position.y = 5.75; cyb.add(croof);
    const upper = box(5.5, 1.7, 5, panelM); upper.position.set(-2.6, 6.75, -0.8); cyb.add(upper);
    [[12.1, 5.45], [12.1, 0.62]].forEach(([w, y]) => { const s = new T.Mesh(new T.BoxGeometry(w, 0.07, 0.05), cyan); s.position.set(0, y, 4.04); cyb.add(s); });
    const net = tex(512, 288, (g, w, h) => { g.fillStyle = '#06111d'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(70,216,234,.12)'; g.lineWidth = 1; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } const pts = [...Array(16)].map(() => [30 + Math.random() * (w - 60), 40 + Math.random() * (h - 70)]); g.strokeStyle = 'rgba(70,216,234,.5)'; g.lineWidth = 1.5; pts.forEach((p, i) => { const q = pts[(i * 7 + 3) % pts.length]; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }); pts.forEach((p, i) => { g.fillStyle = i === 5 ? '#ff6a5a' : (i % 4 === 0 ? '#5fe39a' : '#46d8ea'); g.beginPath(); g.arc(p[0], p[1], i === 5 ? 6 : 4, 0, 7); g.fill(); }); g.fillStyle = '#46d8ea'; g.font = '16px "JetBrains Mono", monospace'; g.fillText('NETWORK · LIVE', 14, 24); });
    const diag = tex(512, 288, (g, w, h) => { g.fillStyle = '#06111d'; g.fillRect(0, 0, w, h); g.fillStyle = '#46d8ea'; g.font = '16px "JetBrains Mono", monospace'; g.fillText('SIGNALS · 24H', 14, 24); for (let i = 0; i < 22; i++) { const bh = 30 + Math.random() * 170; g.fillStyle = i === 15 ? '#ff6a5a' : 'rgba(70,216,234,.75)'; g.fillRect(20 + i * 22, h - 24 - bh, 14, bh); } g.strokeStyle = '#5fe39a'; g.lineWidth = 2; g.beginPath(); for (let x = 0; x < w; x += 8) g.lineTo(x, 70 + Math.sin(x * 0.04) * 18 + Math.random() * 6); g.stroke(); });
    const scans = [];
    [[-3.9, net], [3.9, diag]].forEach(([x, m]) => {
      const fr = box(3.1, 1.95, 0.1, 0x10151f); fr.position.set(x, 3.2, 4.03); cyb.add(fr);
      const sc2 = plane(2.9, 1.75, new T.MeshBasicMaterial({ map: m, toneMapped: false })); sc2.position.set(x, 3.2, 4.09); cyb.add(sc2);
      const bar = plane(2.9, 0.05, new T.MeshBasicMaterial({ color: 0x9ff0ff, transparent: true, opacity: 0.55, toneMapped: false })); bar.position.set(x, 3.2, 4.1); cyb.add(bar); scans.push(bar);
    });
    const cdoor = plane(1.9, 3.1, M(0x0c1824, { roughness: 0.1, metalness: 0.8 })); cdoor.position.set(0, 2.05, 4.03); cyb.add(cdoor);
    [[-1.0, 2.05, 0.06, 3.2], [1.0, 2.05, 0.06, 3.2], [0, 3.65, 2.06, 0.06]].forEach(([x, y, w, h]) => { const f = new T.Mesh(new T.BoxGeometry(w, h, 0.05), cyan); f.position.set(x, y, 4.06); cyb.add(f); });
    const praSign = plane(5, 1, new T.MeshBasicMaterial({ map: signTex('PRAHARI', '#0b1424', '#46d8ea', '700 64px Manrope, sans-serif'), toneMapped: false })); praSign.position.set(0, 4.65, 4.06); cyb.add(praSign);
    const stream = tex(64, 512, (g, w, h) => { g.fillStyle = '#04101a'; g.fillRect(0, 0, w, h); g.font = '12px "JetBrains Mono", monospace'; for (let y = 10; y < h; y += 14) for (let x = 4; x < w; x += 12) { g.fillStyle = `rgba(95,227,154,${0.15 + Math.random() * 0.6})`; g.fillText(Math.random() < 0.5 ? '0' : '1', x, y); } }, 1, 1);
    [-5.6, 5.6].forEach(x => { const s = plane(0.55, 4.4, new T.MeshBasicMaterial({ map: stream, toneMapped: false })); s.position.set(x, 3, 4.06); cyb.add(s); });
    const mast = cyl(0.06, 0.08, 4, M(0x8a92a0, { metalness: 0.8, roughness: 0.3 }), 8); mast.position.set(3.4, 7.9, -1.2); cyb.add(mast);
    const dish = mesh(new T.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.32), M(0xd9dde4, { side: T.DoubleSide, roughness: 0.4 })); dish.position.set(-2.6, 8.0, -0.4); dish.rotation.x = -0.9; cyb.add(dish);
    const beaconM = new T.MeshBasicMaterial({ color: 0xff4a4a, toneMapped: false });
    const beacon = new T.Mesh(new T.SphereGeometry(0.12, 10, 8), beaconM); beacon.position.set(3.4, 9.95, -1.2); cyb.add(beacon);
    [-3, -1.6, 1.6, 3].forEach(x => { const b = cyl(0.14, 0.16, 0.8, 0x1a1e28, 10); b.position.set(x, 0.4, 7.2); cyb.add(b); const t = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.06, 10), green); t.position.set(x, 0.82, 7.2); cyb.add(t); });
    const pad = plane(5, 3.4, M(0x262a34, { roughness: 0.7 })); pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.07, 5.8); pad.receiveShadow = true; cyb.add(pad);
    place(cyb, tP + 6, 15);

    // ── Stop 4: StudySync library (stone, columns, glowing shelves)
    const lib = new T.Group();
    const stoneM = M(0xffffff, { map: stoneTex(0xe2d6bd, 3, 3), roughness: 0.85 });
    const podium = box(14, 0.9, 11, stoneM); podium.position.set(0, 0.45, 1.5); lib.add(podium);
    [[0.6, 7.25], [0.3, 7.75]].forEach(([h, z]) => { const s = box(7, h, 0.5, stoneM); s.position.set(0, h / 2, z); lib.add(s); });
    const lbody = box(13, 6.2, 8, stoneM); lbody.position.y = 0.9 + 3.1; lib.add(lbody);
    const colM = M(0xf1e8d6, { roughness: 0.6 });
    for (let x = -5; x <= 5.01; x += 2) { const c = cyl(0.32, 0.36, 5.2, colM, 18); c.position.set(x, 3.5, 6.2); lib.add(c); const cp = box(0.85, 0.28, 0.85, colM); cp.position.set(x, 6.2, 6.2); lib.add(cp); const bs = box(0.85, 0.2, 0.85, colM); bs.position.set(x, 1.0, 6.2); lib.add(bs); }
    const ent = box(13.4, 1.0, 1.2, colM); ent.position.set(0, 6.8, 6.2); lib.add(ent);
    const slab = box(13.4, 0.25, 2.8, stoneM); slab.position.set(0, 7.35, 5.2); lib.add(slab);
    const ped = new T.Shape(); ped.moveTo(-6.7, 0); ped.lineTo(6.7, 0); ped.lineTo(0, 2.0); ped.lineTo(-6.7, 0);
    const pedG = new T.ExtrudeGeometry(ped, { depth: 1.2, bevelEnabled: false }); const pm = mesh(pedG, colM); pm.position.set(0, 7.45, 5.6); lib.add(pm);
    const libSign = plane(4.6, 0.92, new T.MeshBasicMaterial({ map: signTex('STUDYSYNC', '#f1e8d6', '#3a2a22', '600 58px "DM Serif Display", serif'), toneMapped: false })); libSign.position.set(0, 6.8, 6.81); lib.add(libSign);
    const shelf = tex(256, 256, (g, w, h) => { g.fillStyle = '#4a2c1a'; g.fillRect(0, 0, w, h); const sp = ['#8a2b2b', '#2f4a6a', '#c9a24a', '#3e5a3a', '#e8d6b4', '#6a3a5a', '#b8643e']; for (let row = 0; row < 4; row++) { const by = row * 64 + 60; g.fillStyle = '#2a170c'; g.fillRect(0, by, w, 4); for (let x = 4; x < w - 8;) { const bw = 6 + Math.random() * 10, bh = 34 + Math.random() * 20; g.fillStyle = sp[Math.floor(Math.random() * sp.length)]; g.fillRect(x, by - bh, bw, bh); x += bw + 1; } } g.fillStyle = 'rgba(255,200,120,.25)'; g.fillRect(0, 0, w, h); });
    const shelfGlass = new T.MeshStandardMaterial({ color: 0x1a120c, emissiveMap: shelf, emissive: 0xffd8a8, emissiveIntensity: 0.9, roughness: 0.1, metalness: 0.4 });
    const libFrame = M(0x3a2a22, { roughness: 0.6 });
    [-5.3, -3, 3, 5.3].forEach(x => { const w = win(1.4, 3.0, shelfGlass, libFrame); w.position.set(x, 3.6, 4.02); lib.add(w); });
    const ldoor = plane(2.0, 3.4, M(0xffffff, { map: woodTex(0x5a3424, 1, 1) })); ldoor.position.set(0, 2.6, 4.03); lib.add(ldoor);
    const fan = plane(2.0, 0.7, shelfGlass); fan.position.set(0, 4.75, 4.03); lib.add(fan);
    [-4.2, 4.2].forEach(x => { const p = cyl(0.07, 0.09, 3.2, M(0x2a2a2e, { metalness: 0.7, roughness: 0.4 }), 8); p.position.set(x, 1.6, 9.2); lib.add(p); const lmp = sph(0.22, glow); lmp.position.set(x, 3.35, 9.2); lib.add(lmp); });
    const bench = box(2.2, 0.12, 0.6, M(0xffffff, { map: woodTex(0x7a4e36, 1, 1) })); bench.position.set(-2.6, 0.55, 9.0); lib.add(bench);
    [-1, 1].forEach(s => { const l = box(0.1, 0.5, 0.5, 0x2a2a2e); l.position.set(-2.6 + s * 0.95, 0.27, 9.0); lib.add(l); });
    [[0, '#8a2b2b'], [0.14, '#2f4a6a'], [0.26, '#c9a24a']].forEach(([y, c], i) => { const bk = box(0.7, 0.12, 0.5, M(new T.Color(c).getHex())); bk.position.set(-2.4 + i * 0.05, 0.67 + y, 9.0); bk.rotation.y = i * 0.3; lib.add(bk); });
    const DN = 140, dp = new Float32Array(DN * 3); for (let i = 0; i < DN; i++) dp.set([(rnd() - 0.5) * 12, 1 + rnd() * 5, 4.5 + rnd() * 4.5], i * 3);
    const dgeo = new T.BufferGeometry(); dgeo.setAttribute('position', new T.BufferAttribute(dp, 3));
    const dust = new T.Points(dgeo, new T.PointsMaterial({ color: 0xffe2b0, size: 0.07, transparent: true, opacity: 0.75, depthWrite: false })); lib.add(dust);
    place(lib, tS + 6, -15);

    // ── Storm props
    const signPost = (txt, t, off, mat) => { const g = new T.Group(); [-1.3, 1.3].forEach(x => { const p = cyl(0.06, 0.06, 2.6, chrome, 8); p.position.set(x, 1.3, 0); g.add(p); }); const b = plane(3.4, 1.2, mat || new T.MeshBasicMaterial({ map: signTex(txt, '#f2c14e', '#2a1f2e'), toneMapped: false, side: T.DoubleSide })); b.position.y = 2.9; g.add(b); place(g, t, off); return b.material; };
    signPost('ROUGH WEATHER', Z.stormIn * L + 6, 6.2);
    const beatSigns = [];
    this.BEATS.forEach((p, i) => { const b = this.C.storm[i]; if (b.challenge == null) return; const nm = this.C.challenges[b.challenge].project.toUpperCase(); const m = new T.MeshBasicMaterial({ map: signTex(nm, '#1a1d28', '#f2c14e'), toneMapped: false, side: T.DoubleSide }); signPost(nm, p * L + 9, beatSigns.length % 2 ? -6.4 : 6.4, m); beatSigns.push({ i, m }); });
    const coneM = M(0xff6a2a, { roughness: 0.5 }), bandM = M(0xf4f4f4, { roughness: 0.4 });
    for (let t = L * 0.535; t < L * 0.565; t += 4) { const p = roadPt(t), q = perp(t); const g = new T.Group(); const c = mesh(new T.ConeGeometry(0.32, 0.85, 16), coneM); c.position.y = 0.48; g.add(c); const band = cyl(0.19, 0.22, 0.12, bandM); band.position.y = 0.5; g.add(band); const base = box(0.6, 0.06, 0.6, coneM); base.position.y = 0.03; g.add(base); g.position.set(p.x + q.x * 4.6, 0, p.z + q.z * 4.6); scene.add(g); }
    const bar = new T.Group(); const bb = box(3.4, 0.4, 0.15, M(0xffffff, { map: stripeTex('#ffffff', '#d2463f', 10) })); bb.position.y = 1; bar.add(bb);
    [-1.4, 1.4].forEach(x => { const l = box(0.1, 1.1, 0.5, 0x3a3040); l.position.set(x, 0.55, 0); bar.add(l); });
    place(bar, L * 0.71, -5.8);
    const puddleM = new T.MeshStandardMaterial({ color: 0x7a8296, metalness: 1, roughness: 0.04 });
    for (let i = 0; i < 20; i++) { const t = L * (0.58 + rnd() * 0.2), p = roadPt(t), q = perp(t), o = (rnd() - 0.5) * 6; const pd = new T.Mesh(jitter(new T.CircleGeometry(0.8 + rnd() * 1.2, 20), 0.25), puddleM); pd.rotation.x = -Math.PI / 2; pd.scale.y = 0.6; pd.position.set(p.x + q.x * o, 0.075, p.z + q.z * o); scene.add(pd); }

    // ── Stop 5: home
    const house = new T.Group();
    const lawn = plane(18, 13, M(0xffffff, { map: tex(128, 128, (g, w, h) => { g.fillStyle = '#7d9a4e'; g.fillRect(0, 0, w, h); speckle(g, w, h, 4000, 0.12); }, 6, 4), roughness: 1 })); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, 0.04, 4); lawn.receiveShadow = true; house.add(lawn);
    const hw = box(10, 7, 8, M(0xffffff, { map: sidingTex(0xf1dcc8, 1, 3) })); hw.position.y = 3.5; house.add(hw);
    const hbase = box(10.4, 0.5, 8.4, M(0xffffff, { map: brickTex(0x8a7a72, 4, 0.3) })); hbase.position.y = 0.25; house.add(hbase);
    const gable = new T.Shape(); gable.moveTo(-5, 0); gable.lineTo(5, 0); gable.lineTo(0, 3.2); gable.lineTo(-5, 0);
    const gg = new T.ExtrudeGeometry(gable, { depth: 8, bevelEnabled: false }); gg.translate(0, 0, -4);
    const gm = mesh(gg, M(0xf1dcc8)); gm.position.y = 7; house.add(gm);
    const roofM = M(0xffffff, { map: shingleTex(0x7a3e4e, 3, 4), roughness: 0.85 });
    [-1, 1].forEach(s => { const rp = box(6.4, 0.22, 9, roofM); rp.position.set(s * 2.55, 8.72, 0); rp.rotation.z = -s * 0.569; house.add(rp); });
    const ridge = cyl(0.14, 0.14, 9, 0x5a2e3a, 8); ridge.rotation.x = Math.PI / 2; ridge.position.y = 10.3; house.add(ridge);
    const chim = box(1, 2.6, 1, M(0xffffff, { map: brickTex(0x9a4e3c, 1, 1.5) })); chim.position.set(2.8, 10, -1.5); house.add(chim);
    const hd = plane(1.6, 2.8, M(0xffffff, { map: woodTex(0x6a3e30, 1, 1) })); hd.position.set(0, 1.9, 4.03); house.add(hd);
    const knob = sph(0.06, chrome); knob.position.set(0.55, 1.8, 4.1); house.add(knob);
    [[-3, 2.6], [3, 2.6], [-3.3, 5.6], [3.3, 5.6]].forEach(([x, y]) => { const w = win(1.8, 1.5); w.position.set(x, y, 4.02); house.add(w); });
    const att = win(1.2, 1.0); att.position.set(0, 8.3, 4.02); house.add(att);
    const bd = win(1.8, 2.3); bd.position.set(0, 5.35, 4.02); house.add(bd);
    // framed portrait by the door (uses the same photo as the About panel)
    const photoTex = new T.TextureLoader().load(this.C.about.photo, t => { const im = t.image, A = im.width / im.height, ry = 0.62, rx = Math.min(1, 0.8 * ry / A); t.repeat.set(rx, ry); t.offset.set(Math.max(0, Math.min(1 - rx, 0.45 - rx / 2)), 0.2); t.needsUpdate = true; });
    photoTex.colorSpace = T.SRGBColorSpace;
    const pf = box(1.1, 1.34, 0.08, M(0x3a2a22, { roughness: 0.5 })); pf.position.set(-1.48, 2.3, 4.05); house.add(pf);
    const pp = plane(0.92, 1.15, new T.MeshStandardMaterial({ map: photoTex, roughness: 0.55 })); pp.position.set(-1.48, 2.3, 4.1); house.add(pp);
    const hslab = box(5.6, 0.3, 2.3, 0xe8d6c6); hslab.position.set(0, 4.05, 5.15); house.add(hslab);
    const rail = box(5.6, 0.12, 0.14, frameM); rail.position.set(0, 5.15, 6.25); house.add(rail);
    [-1, 1].forEach(s => { const sr = box(0.12, 0.12, 2.3, frameM); sr.position.set(s * 2.74, 5.15, 5.15); house.add(sr); const sup = cyl(0.12, 0.12, 3.9, frameM, 12); sup.position.set(s * 2.5, 1.95, 6.1); house.add(sup); });
    for (let x = -2.5; x <= 2.51; x += 0.36) { const p = cyl(0.035, 0.035, 0.95, frameM, 6); p.position.set(x, 4.68, 6.25); house.add(p); }
    for (let x = -4.5; x <= 4.5; x += 1.5) { if (Math.abs(x) < 1.5) continue; const b = mesh(blobG, M(0x4a6a34)); b.scale.set(0.8, 0.65, 0.6); b.position.set(x, 0.55, 4.6); house.add(b); }
    const flowerCols = [0xd8262e, 0xf2c14e, 0xf4a6b8];
    for (let i = 0; i < 18; i++) { const fl = sph(0.09, M(flowerCols[i % 3], { roughness: 0.6 })); fl.castShadow = false; fl.position.set((i < 9 ? -1 : 1) * (1.4 + (i % 9) * 0.38), 0.9 + (i % 2) * 0.12, 4.95 + (i % 3) * 0.1); house.add(fl); }
    const me = buildPerson(); me.g.position.set(0.9, 4.2, 5.4); house.add(me.g);
    const fenceGeo = new T.BoxGeometry(0.14, 1, 0.08), tipGeo = new T.ConeGeometry(0.1, 0.18, 4);
    const fencePost = (x, z, ry) => { const p = mesh(fenceGeo, frameM); p.position.set(x, 0.5, z); p.rotation.y = ry; house.add(p); const tp2 = mesh(tipGeo, frameM); tp2.position.set(x, 1.09, z); tp2.rotation.y = Math.PI / 4 + ry; house.add(tp2); };
    for (let x = -8.5; x <= 8.51; x += 0.5) if (Math.abs(x) > 1.2) fencePost(x, 10.3, 0);
    for (let z = 0; z <= 10.3; z += 0.5) { fencePost(-8.5, z, Math.PI / 2); fencePost(8.5, z, Math.PI / 2); }
    [[-4.85, 7.3], [4.85, 7.3]].forEach(([x, w]) => { [0.4, 0.8].forEach(y => { const r1 = box(w, 0.08, 0.06, frameM); r1.position.set(x, y, 10.25); house.add(r1); }); });
    [-8.5, 8.5].forEach(x => [0.4, 0.8].forEach(y => { const r1 = box(0.06, 0.08, 10.3, frameM); r1.position.set(x, y, 5.15); house.add(r1); }));
    [-1.25, 1.25].forEach(x => { const gp = cyl(0.08, 0.08, 2.3, frameM, 8); gp.position.set(x, 1.15, 10.3); house.add(gp); });
    const nameplate = plane(2.3, 0.46, new T.MeshBasicMaterial({ map: signTex('HRISHITA', '#fff3e6', '#7a3e4e', 'italic 400 70px "DM Serif Display", serif'), toneMapped: false, side: T.DoubleSide })); nameplate.position.set(0, 2.05, 10.34); house.add(nameplate);
    const path = plane(1.8, 6.1, M(0xffffff, { map: brickTex(0xc9b29a, 2, 6) })); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.06, 7.2); house.add(path);
    const mb = mesh(new T.CapsuleGeometry(0.28, 0.5, 4, 12), M(0xc4566b, { roughness: 0.4, metalness: 0.3 })); mb.rotation.x = Math.PI / 2; mb.position.set(2.4, 1.25, 10.9); house.add(mb); const mbp = box(0.1, 1, 0.1, 0x3a3040); mbp.position.set(2.4, 0.5, 10.9); house.add(mbp);
    const porchLamp = sph(0.15, glow); porchLamp.position.set(1.2, 3.0, 4.2); house.add(porchLamp);
    const porch = new T.PointLight(0xffc27a, 0, 22, 1.5); porch.position.set(0, 3.2, 5.5); house.add(porch);
    const buildDog = (c, dk) => {
      const g = new T.Group(), legs = [], fur = M(c, { roughness: 0.9 }), dark = M(dk, { roughness: 0.9 });
      const body = cap(0.24, 0.62, fur); body.rotation.z = Math.PI / 2; body.position.y = 0.72; g.add(body);
      const chest = sph(0.26, fur); chest.position.set(0.3, 0.78, 0); g.add(chest);
      const neck = cap(0.13, 0.2, fur); neck.position.set(0.48, 0.92, 0); neck.rotation.z = -0.7; g.add(neck);
      const head = sph(0.22, fur); head.scale.set(1.05, 0.95, 0.95); head.position.set(0.62, 1.08, 0); g.add(head);
      const snout = cap(0.1, 0.12, dark); snout.rotation.z = Math.PI / 2; snout.position.set(0.86, 1.02, 0); g.add(snout);
      const nose = sph(0.045, M(0x111111, { roughness: 0.3 })); nose.position.set(0.99, 1.05, 0); g.add(nose);
      [-1, 1].forEach(s => { const e = sph(0.1, dark); e.scale.set(0.5, 1.4, 0.8); e.position.set(0.56, 1.24, s * 0.15); e.rotation.x = s * 0.4; g.add(e); const eye = sph(0.03, M(0x111111, { roughness: 0.2 })); eye.position.set(0.8, 1.13, s * 0.09); g.add(eye); });
      const tail = new T.Group(); tail.position.set(-0.52, 0.86, 0); const tm = cap(0.05, 0.32, fur); tm.position.set(-0.12, 0.12, 0); tm.rotation.z = 0.8; tail.add(tm); g.add(tail);
      [[0.32, 0.12], [0.32, -0.12], [-0.32, 0.12], [-0.32, -0.12]].forEach(([x, z]) => { const p = new T.Group(); p.position.set(x, 0.6, z); const l = cap(0.065, 0.36, fur); l.position.y = -0.28; p.add(l); const paw = sph(0.075, dark); paw.position.y = -0.52; p.add(paw); g.add(p); legs.push(p); });
      g.scale.setScalar(1.4); house.add(g); return { g, legs, tail };
    };
    const dogs = [[0x8a5a3c, 0x4a2e22], [0x2a2430, 0x15131a], [0xeedcc0, 0xa8825f], [0x9a9aa6, 0x55555f], [0xd28a4a, 0x7a4a2a], [0x5a4a3a, 0x2a1f1a]].map(([c, d]) => buildDog(c, d));
    place(house, tH, 17);
    house.updateMatrixWorld(true);

    // rain (GPU animated)
    const RN = 3000, rp0 = new Float32Array(RN * 6), rEnd = new Float32Array(RN * 2);
    for (let i = 0; i < RN; i++) { const x = (rnd() - 0.5) * 90, y = rnd() * 40, z = (rnd() - 0.5) * 90; rp0.set([x, y, z, x, y, z], i * 6); rEnd[i * 2 + 1] = 1; }
    const rgeo = new T.BufferGeometry(); rgeo.setAttribute('position', new T.BufferAttribute(rp0, 3)); rgeo.setAttribute('aEnd', new T.BufferAttribute(rEnd, 1));
    const rmat = new T.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uOp: { value: 0 } },
      vertexShader: 'attribute float aEnd; uniform float uTime; varying float vE; void main(){ float y = mod(position.y - uTime*42.0, 40.0); vec3 p = vec3(position.x + aEnd*0.08, y + aEnd*1.1, position.z); vE = aEnd; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }',
      fragmentShader: 'uniform float uOp; varying float vE; void main(){ gl_FragColor = vec4(0.85,0.88,0.95, uOp * (0.35 + vE*0.65)); }' });
    const rain = new T.LineSegments(rgeo, rmat); rain.frustumCulled = false; scene.add(rain);

    // click a building to enter it
    const ray = new T.Raycaster(), ndc = new T.Vector2(), targets = [[cafe, 'mood'], [cyb, 'pra'], [lib, 'study']];
    this.onClick = e => {
      if (this.state.open) return;
      const rc = r.domElement.getBoundingClientRect();
      ndc.set((e.clientX - rc.left) / rc.width * 2 - 1, -(e.clientY - rc.top) / rc.height * 2 + 1);
      ray.setFromCamera(ndc, cam); ray.far = 90;
      let best = null, bd2 = Infinity;
      for (const [g, k] of targets) { const h = ray.intersectObject(g, true)[0]; if (h && h.distance < bd2) { bd2 = h.distance; best = k; } }
      if (best) this.open(best);
    };
    r.domElement.addEventListener('click', this.onClick);

    const mixC = (key, w, out) => out.copy(pal.sunset[key]).lerp(pal.cyber[key], w.cy).lerp(pal.library[key], w.lb).lerp(pal.storm[key], w.s).lerp(pal.clear[key], w.c);
    const white = new T.Color(0xeef0ff);
    const camPos = new T.Vector3(), camLook = new T.Vector3(), tPos = new T.Vector3(), tLook = new T.Vector3();
    const vPos = roadPt(tH - 3).add(perp(tH).multiplyScalar(-6)).setY(5.4);
    const vLook = house.localToWorld(new T.Vector3(0, 3.8, 6));
    const clock = new T.Clock(), BE = this.BEATS;
    let P = this.scrollP(), prevRT = P * L, flash = 0, first = true, ftAcc = 0, ftN = 0, frame = 0;

    const loop = () => {
      if (this.dead) return;
      this.raf = requestAnimationFrame(loop);
      const rawDt = clock.getDelta(), dt = Math.min(rawDt, 0.05), time = clock.elapsedTime;
      frame++;
      ftAcc += rawDt; ftN++;
      if (ftN === 90) { const avg = ftAcc / ftN; if (avg > 0.024 && dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); r.setPixelRatio(dpr); } ftAcc = 0; ftN = 0; }
      const open = this.state.open;
      if (open && frame % 2) return; // half-rate while a project is open; scroll is locked
      const props = this.props || {};
      if (props.autoRide && !open) {
        const max = this.maxScroll();
        if (this.autoY == null || Math.abs(scrollY - this.autoY) > 6) this.autoY = scrollY;
        if (this.autoY < max) { this.autoY = Math.min(max, this.autoY + max / 70 * dt); window.scrollTo(0, this.autoY); }
      }
      const target = this.scrollP();
      P += (target - P) * (1 - Math.exp(-dt * 3));
      if (Math.abs(target - P) < 1e-4) P = target;

      const rT = Math.min(P, 0.95) * L;
      const speed = (rT - prevRT) / Math.max(dt, 1e-3); prevRT = rT;
      const rp = roadPt(rT);
      rider.position.copy(rp); rider.position.y = 0.04 + Math.sin(time * 22) * 0.015 * Math.min(1, Math.abs(speed) / 10);
      rider.rotation.y = heading(rT);
      const curv = dcx(rT + 1) - dcx(rT);
      rider.rotation.z = -Math.max(-0.3, Math.min(0.3, curv * 260)) * Math.min(1, Math.abs(speed) / 15);
      sc.wheels.forEach(w => w.rotation.x -= speed * dt / 0.34);

      const intro = 1 - ss(0, 0.06, P);
      tPos.copy(roadPt(rT - 11)).setY(5.0 + intro * 5); tPos.z += intro * 8;
      tLook.copy(roadPt(rT + 10)).setY(1.6 + intro * 5);
      const b = ss(0.87, 0.97, P);
      tPos.lerp(vPos, b); tLook.lerp(vLook, b);
      if (first) { camPos.copy(tPos); camLook.copy(tLook); first = false; }
      const k = 1 - Math.exp(-dt * 5); camPos.lerp(tPos, k); camLook.lerp(tLook, k);
      cam.position.copy(camPos); cam.lookAt(camLook);

      // atmosphere weights
      const w = {
        cy: ss(0.25, 0.295, P) * (1 - ss(0.335, 0.375, P)),
        lb: ss(0.37, 0.405, P) * (1 - ss(0.455, 0.51, P)),
        s: ss(0.49, 0.60, P) * (1 - ss(0.775, 0.85, P)),
        c: ss(0.80, 0.90, P)
      };
      const s = w.s, storm2 = s * ss(0.55, 0.68, P);
      if (!reduce && storm2 > 0.4 && Math.random() < dt * 0.5 * storm2) { flash = 1; this.thunder(0.4 + Math.random() * 1.2, 0.5 + 0.5 * storm2); }
      flash *= Math.exp(-dt * 7);
      if (frame % 4 === 0) this.audioTick(P, null, open);
      const U = skyMat.uniforms;
      mixC('top', w, U.top.value).lerp(white, flash * 0.5);
      mixC('hor', w, U.hor.value).lerp(white, flash * 0.6);
      mixC('bot', w, U.bot.value);
      mixC('glow', w, U.sunCol.value); U.uSun.value = 1 - Math.max(s, w.cy * 0.7);
      mixC('fog', w, scene.fog.color).lerp(white, flash * 0.3);
      scene.fog.density = 0.0026 + 0.0012 * w.cy + 0.0055 * s - 0.0006 * w.c;
      mixC('hs', w, hemi.color); mixC('hg', w, hemi.groundColor);
      hemi.intensity = 0.6 + flash * 2.5;
      mixC('sun', w, sunL.color); sunL.intensity = 2.6 * (1 - 0.55 * w.cy - 0.2 * w.lb - 0.85 * s);
      mixC('cloud', w, cloudMats[0].color); cloudMats[1].color.copy(cloudMats[0].color); cloudMats[2].color.copy(cloudMats[0].color);
      const so = ss(0.47, 0.6, P) * (1 - ss(0.78, 0.86, P)); stormMats.forEach(m => m.opacity = so);
      const wet = Math.max(s, ss(0.55, 0.65, P) * (1 - ss(0.8, 0.88, P)));
      roadMat.color.copy(dryCol).lerp(wetCol, wet); roadMat.roughness = 0.85 - 0.6 * wet; roadMat.metalness = 0.35 * wet;
      let ek = 'sunset', ev = 0.5; for (const [kk, vv] of [['cyber', w.cy], ['library', w.lb], ['storm', s], ['clear', w.c]]) if (vv > ev) { ek = kk; ev = vv; }
      if (ek !== envKey) { envKey = ek; scene.environment = envs[ek]; }
      r.toneMappingExposure = 1.0 - 0.1 * w.cy - 0.15 * s + flash * 0.3;
      sky.position.copy(cam.position);
      const focus = b > 0.01 ? pv.copy(rp).lerp(house.position, b) : rp;
      sunL.target.position.copy(focus); sunL.position.copy(focus).addScaledVector(sunDir, 160);

      rmat.uniforms.uOp.value = (0.15 + 0.85 * ss(0.53, 0.68, P)) * s * 0.75 * (props.rainIntensity ?? 0.8) * (reduce ? 0.5 : 1);
      rain.visible = rmat.uniforms.uOp.value > 0.01;
      if (rain.visible) { rmat.uniforms.uTime.value = reduce ? time * 0.5 : time; rain.position.set(cam.position.x, 0, cam.position.z - 10); }

      // per-destination ambient animation (only near each stop)
      if (Math.abs(P - Z.mood) < 0.08) bulbs.forEach((l, i) => l.scale.setScalar(0.9 + 0.15 * Math.sin(time * 2 + i)));
      if (Math.abs(P - Z.pra) < 0.08 && !reduce) {
        stream.offset.y = (stream.offset.y - dt * 0.12) % 1;
        scans.forEach((sb, i) => sb.position.y = 3.2 + Math.sin(time * 1.3 + i * 1.7) * 0.82);
        beaconM.color.setScalar(0).setRGB(0.3 + 0.7 * (Math.sin(time * 4) > 0.6 ? 1 : 0), 0.1, 0.1);
      }
      if (Math.abs(P - Z.study) < 0.08 && !reduce) { dust.position.y = Math.sin(time * 0.35) * 0.25; dust.rotation.y = Math.sin(time * 0.1) * 0.05; }
      const beat = this.state.beat;
      beatSigns.forEach(({ i, m }) => { const on = beat === i; m.color.setScalar(on ? (reduce || Math.random() > 0.08 ? 1 : 0.35) : 0.4); });

      porch.intensity = 20 * b;
      const dc = Math.max(0, Math.min(6, Math.round(props.dogCount ?? 4)));
      dogs.forEach((d, i) => {
        d.g.visible = i < dc; if (!d.g.visible) return;
        const sp = 0.9 + (i % 3) * 0.05, a = time * sp + i * 0.55, rx = 5.6 - (i % 2) * 0.6, rz = 2.3;
        d.g.position.set(Math.cos(a) * rx, Math.abs(Math.sin(time * 13 + i)) * 0.14, 6.4 + Math.sin(a) * rz);
        d.g.rotation.y = Math.atan2(-(Math.cos(a) * rz), -Math.sin(a) * rx);
        d.legs.forEach((l, j) => l.rotation.z = Math.sin(time * 13 + i + (j < 2 ? 0 : Math.PI) + (j % 2) * 0.4) * 0.7);
        d.tail.rotation.x = Math.sin(time * 18 + i) * 0.6;
      });
      me.pivot.rotation.z = 2.6 + Math.sin(time * 6) * 0.35;

      if (this.barRef.current) this.barRef.current.style.transform = 'scaleX(' + P.toFixed(4) + ')';
      let a = -1, bt = -1;
      if (P < 0.035) a = 0;
      else if (Math.abs(P - Z.garage) < 0.045) a = 1;
      else if (Math.abs(P - Z.mood) < 0.045) a = 2;
      else if (Math.abs(P - Z.pra) < 0.045) a = 3;
      else if (Math.abs(P - Z.study) < 0.045) a = 4;
      else if (P >= Z.stormIn && P < Z.stormOut) { a = 5; for (let i = 0; i < BE.length; i++) if (P >= BE[i]) bt = i; }
      else if (P > 0.885) a = 6;
      if (a !== this.state.active || bt !== this.state.beat || !this.state.ready) this.setState({ active: a, beat: bt, ready: true });
      r.render(scene, cam);
    };
    loop();
  }

  render() {
    const v = this.renderVals();
    const dyn = (i, extra = {}) => ({ opacity: v['o' + i], pointerEvents: v['pe' + i], ...extra });
    const mono = "font-family:'JetBrains Mono', monospace;";
    const navBtn = mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:rgba(30,16,40,.45);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:8px 13px;cursor:pointer';
    const navHover = 'background:rgba(255,255,255,.2)';
    const chipS = 'padding:6px 11px;border:1px solid rgba(255,255,255,.22);border-radius:999px;font-size:13px';
    const labS = mono + 'font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#bfaebc';
    const SKILLS = [
      ['Languages', ['C++', 'Python', 'Java', 'JavaScript', 'SQL']],
      ['Technologies', ['React', 'Vue.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'HTML', 'CSS']],
      ['Workshop tools', ['Git', 'GitHub', 'Linux', 'Postman', 'Vercel', 'Render']],
      ['Core CS', ['OOD', 'DSA', 'Operating Systems', 'DBMS', 'Complexity Analysis']],
      ['Networking', ['TCP/IP', 'Routing & Switching', 'OSI Model', 'Computer Networks']],
      ['Testing', ['Unit Testing', 'Acceptance Testing', 'Cross-browser Debugging', 'Performance Optimization']]
    ];
    const STATS = [['400+', 'DSA problems'], ['3★', 'CodeChef · best rank 671'], ['1040', 'Codeforces']];
    const contactRow = (label, text, href, last, italic) => href === false
      ? <div key={label} style={S('display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-top:1px solid rgba(255,255,255,.14)')}><span style={S(mono + 'font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#bfaebc')}>{label}</span><span style={S('font-size:13px;font-style:italic;color:#bfaebc')}>{text}</span></div>
      : <a key={label} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})} style={S('display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-top:1px solid rgba(255,255,255,.14);color:#fff6ee' + (last ? ';border-bottom:1px solid rgba(255,255,255,.14)' : ''))}><span style={S(mono + 'font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#bfaebc')}>{label}</span><span style={S('font-size:14px')}>{text}</span></a>;
    const rowLabel = (t, color) => <div style={S(mono + 'font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' + color)}>{t}</div>;
    const approach = (i, shape, kicker, kcol, title, titleS, blurb, blurbS, btn, btnS, btnH, btnLabel, hint, hintCol, click) => (
      <div data-screen-label={kicker} style={{ ...S('position:fixed;left:50%;bottom:48px;width:min(540px, calc(100vw - 32px));box-sizing:border-box;padding:18px 20px;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;transition:opacity .5s ease, transform .7s cubic-bezier(.2,.7,.2,1);' + shape), opacity: v['o' + i], transform: `translate(-50%, ${v['y' + i]}px)`, pointerEvents: v['pe' + i] }}>
        <div style={S('display:flex;flex-direction:column;gap:4px;flex:1 1 240px;min-width:0')}>
          <div style={S(mono + 'font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' + kcol)}>{kicker}</div>
          <div style={S(titleS)}>{title}</div>
          <div style={S(blurbS)}>{blurb}</div>
        </div>
        <div style={S('display:flex;flex-direction:column;align-items:flex-end;gap:6px')}>
          <Hov s={btnS} h={btnH} onClick={click}>{btnLabel}</Hov>
          <span style={S(mono + 'font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:' + hintCol)}>{hint}</span>
        </div>
      </div>
    );
    const ph = (f, ok, miss) => f.filled ? <p style={S(ok)}>{f.text}</p> : <p style={S(miss)}>{f.text}</p>;
    const links = (L, a, b) => (<>
      {L.repoL.has && <Hov as="a" s={a[0]} h={a[1]} href={L.repoL.url} target="_blank" rel="noopener">{a[2]}</Hov>}
      {L.demoL.has && <Hov as="a" s={b[0]} h={b[1]} href={L.demoL.url} target="_blank" rel="noopener">{b[2]}</Hov>}
    </>);
    const closeBtn = (s, h, label) => <Hov s={s} h={h} onClick={v.closeOverlay}>{label}</Hov>;
    const mm = v.mm, pr = v.pr, st = v.st;
    const cav = 'font-family:Caveat, cursive;font-size:30px;color:#ffc98a;line-height:1';
    const miss = 'margin:0;font-size:14px;line-height:1.45;font-style:italic;opacity:.8;border:1px dashed rgba(243,238,228,.45);border-radius:6px;padding:8px 10px';
    const praMiss = 'margin:0;font-size:12.5px;line-height:1.5;color:#9fb2c4;border:1px dashed #2c4a62;border-radius:4px;padding:8px 10px';
    const stMiss = 'margin:0;font-size:14px;line-height:1.45;font-style:italic;color:#6a5a4e;border:1px dashed #a8957a;border-radius:4px;padding:8px 10px';
    const praCell = (n, title, body) => (
      <div style={S('background:#0a111d;padding:22px;display:flex;flex-direction:column;gap:10px')}>
        <div style={S('font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#46d8ea')}>{n} · {title}</div>{body}
      </div>
    );
    const praBody = 'margin:0;font-family:Manrope, sans-serif;font-size:15px;line-height:1.55;text-wrap:pretty';
    const stField = (title, f) => (
      <div style={S('display:flex;flex-direction:column;gap:8px')}>
        {rowLabel(title, '#8a2b2b')}
        {ph(f, 'margin:0;font-size:15px;line-height:1.6;text-wrap:pretty', stMiss)}
      </div>
    );

    return (
      <div style={S("position:relative;height:1800vh;font-family:Manrope, system-ui, sans-serif;color:#fff6ee")}>
        <div ref={v.mountRef} style={S('position:fixed;inset:0;background:linear-gradient(#5d4c9e,#ff9472 62%,#ffc79a)')} />
        <div style={S('position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(30,10,40,.35) 100%)')} />

        <header style={S('position:fixed;top:0;left:0;right:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:20px 28px;text-shadow:0 1px 10px rgba(40,10,40,.35)')}>
          <div style={S(mono + 'font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600')}>Hrishita — Portfolio</div>
          <nav style={S('display:flex;gap:8px;flex-wrap:wrap')}>
            <Hov s={navBtn} h={navHover} onClick={v.goGarage}>Garage</Hov>
            <Hov s={navBtn} h={navHover} onClick={v.goMood}>Projects</Hov>
            <Hov s={navBtn} h={navHover} onClick={v.goStorm}>Storm</Hov>
            <Hov s={navBtn} h={navHover} onClick={v.goHome}>Home</Hov>
          </nav>
        </header>

        <div style={{ ...S('position:fixed;left:0;right:0;top:22vh;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:0 24px;transition:opacity .6s ease, transform .8s cubic-bezier(.2,.7,.2,1);pointer-events:none;text-shadow:0 2px 24px rgba(60,20,50,.35)'), opacity: v.o0, transform: `translateY(${v.y0}px)` }}>
          <div style={S(mono + 'font-size:12px;letter-spacing:.24em;text-transform:uppercase')}>A portfolio, on two wheels</div>
          <h1 style={S("margin:0;font-family:'DM Serif Display', serif;font-weight:400;font-size:clamp(64px, 11vw, 148px);line-height:.92;letter-spacing:-.01em")}>Hrishita Joshi</h1>
          <p style={S('margin:0;font-size:17px;max-width:34ch;text-wrap:pretty;color:#fff3ea')}>Scroll to ride.</p>
        </div>
        <div style={{ ...S('position:fixed;left:0;right:0;bottom:56px;display:flex;justify-content:center;transition:opacity .6s ease;pointer-events:none;' + mono + 'font-size:11px;letter-spacing:.2em;text-transform:uppercase'), opacity: v.o0 }}>↓ Scroll to start</div>

        <section data-screen-label="Garage — Skills" style={{ ...S('position:fixed;right:max(16px, 4vw);top:50%;width:min(400px, calc(100vw - 32px));max-height:76vh;overflow:auto;box-sizing:border-box;padding:28px;border-radius:18px;background:rgba(24,16,34,.86);border:1px solid rgba(255,255,255,.14);transition:opacity .5s ease, transform .7s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;gap:18px'), ...dyn(1, { transform: `translateY(calc(-50% + ${v.y1}px))` }) }}>
          <div style={S('display:flex;flex-direction:column;gap:8px')}>
            {rowLabel('Stop 01 — The Garage', '#f2c14e')}
            <h2 style={S("margin:0;font-family:'DM Serif Display', serif;font-weight:400;font-size:40px;line-height:1")}>The toolbox</h2>
            <p style={S('margin:0;font-size:15px;line-height:1.5;color:#e9dcd6;text-wrap:pretty')}>Every ride needs a good mechanic. These are the tools I keep within reach, sharpened on 400+ problems in C++. Top 30 of 600+ teams at Industrial Ideathon; top 10 of 500+ at Innovision 2.0.</p>
          </div>
          {SKILLS.map(([label, items]) => (
            <div key={label} style={S('display:flex;flex-direction:column;gap:10px')}>
              <div style={S(labS)}>{label}</div>
              <div style={S('display:flex;flex-wrap:wrap;gap:7px')}>{items.map(c => <span key={c} style={S(chipS)}>{c}</span>)}</div>
            </div>
          ))}
          <div style={S('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding-top:14px;border-top:1px solid rgba(255,255,255,.14)')}>
            {STATS.map(([n, l]) => <div key={l} style={S('display:flex;flex-direction:column;gap:2px')}><span style={S("font-family:'DM Serif Display', serif;font-size:26px;color:#f2c14e")}>{n}</span><span style={S(mono + 'font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#bfaebc')}>{l}</span></div>)}
          </div>
        </section>

        {approach(2, 'border-radius:16px;background:rgba(48,26,20,.9);border:1px solid rgba(255,201,138,.35)', 'Stop 02 — The café', '#ffc98a', 'MoodMenu', "font-family:'DM Serif Display', serif;font-size:30px;line-height:1", 'A café where the menu changes with your mood.', 'font-size:14px;line-height:1.45;color:#f3e2d4;text-wrap:pretty', null, 'background:#ffc98a;color:#2a1810;border:none;border-radius:999px;padding:11px 18px;font-family:Manrope, sans-serif;font-weight:700;font-size:14px;cursor:pointer', 'background:#ffdcb0', 'Step inside →', 'or press E', '#d9bfae', v.openMood)}

        {approach(3, 'border-radius:8px;background:rgba(8,14,26,.92);border:1px solid rgba(70,216,234,.4);' + mono, 'Stop 03 — The cyber cell', '#46d8ea', 'PRAHARI', 'font-family:Manrope, sans-serif;font-weight:700;font-size:28px;line-height:1;letter-spacing:.04em', 'An operations room for flagging scam messages and suspicious patterns.', 'font-family:Manrope, sans-serif;font-size:14px;line-height:1.45;color:#c7d6e4;text-wrap:pretty', null, 'background:transparent;color:#46d8ea;border:1px solid #46d8ea;border-radius:4px;padding:11px 16px;' + mono + 'font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer', 'background:rgba(70,216,234,.14)', 'Request access →', 'or press E', '#7f93a8', v.openPra)}

        {approach(4, 'border-radius:6px;background:rgba(244,236,219,.95);color:#2b2420;border:1px solid #c9b896', 'Stop 04 — The library', '#8a2b2b', 'StudySync', "font-family:'DM Serif Display', serif;font-size:30px;line-height:1", 'A study space that keeps plans, flashcards and quizzes on one desk.', 'font-size:14px;line-height:1.45;color:#4a3f36;text-wrap:pretty', null, 'background:#2b2420;color:#f4ecdb;border:none;border-radius:4px;padding:11px 18px;font-family:Manrope, sans-serif;font-weight:700;font-size:14px;cursor:pointer', 'background:#4a3f36', 'Open the catalog →', 'or press E', '#7a6a5a', v.openStudy)}

        <div data-screen-label="Storm — Story" style={S('position:fixed;left:0;right:0;top:96px;display:grid;justify-items:center;padding:0 20px;pointer-events:none')}>
          {v.stories.map((s, i) => (
            <div key={i} style={{ ...S('grid-area:1 / 1;max-width:min(620px, 100%);box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;padding:18px 24px;border-radius:14px;background:rgba(14,16,26,.55);transition:opacity .7s ease, transform .9s cubic-bezier(.2,.7,.2,1)'), opacity: s.o, transform: `translateY(${s.y}px)` }}>
              <div style={S(mono + 'font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#a9b8e0')}>{s.label}</div>
              <div style={S("font-family:'DM Serif Display', serif;font-size:clamp(22px, 2.6vw, 32px);line-height:1.22;color:#f4f2ee;text-wrap:pretty")}>{s.text}</div>
            </div>
          ))}
        </div>

        <div data-screen-label="Storm — Challenges" style={S('position:fixed;right:max(16px, 4vw);top:50%;transform:translateY(-50%);width:min(400px, calc(100vw - 32px));display:grid;pointer-events:none')}>
          {v.chals.map(c => (
            <div key={c.idx} style={{ ...S('grid-area:1 / 1;box-sizing:border-box;padding:24px;border-radius:14px;background:rgba(16,18,30,.9);border:1px solid rgba(242,193,78,.35);display:flex;flex-direction:column;gap:14px;transition:opacity .6s ease, transform .8s cubic-bezier(.2,.7,.2,1)'), opacity: c.o, transform: `translateY(${c.y}px)`, pointerEvents: c.pe }}>
              <div style={S('display:flex;flex-direction:column;gap:6px')}>
                {rowLabel('Storm event ' + c.idx + ' of 3', '#f2c14e')}
                <div style={S("font-family:'DM Serif Display', serif;font-size:32px;line-height:1")}>{c.project}</div>
              </div>
              {c.rows.map(row => (
                <div key={row.label} style={S('display:flex;flex-direction:column;gap:4px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12)')}>
                  <div style={S(mono + 'font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#a9b8e0')}>{row.label}</div>
                  {row.filled
                    ? <div style={S('font-size:14px;line-height:1.5;color:#e4e6ee;text-wrap:pretty')}>{row.text}</div>
                    : <div style={S('font-size:13px;line-height:1.45;color:#c9cde0;font-style:italic;border:1px dashed rgba(201,205,224,.5);border-radius:6px;padding:7px 10px')}>{row.text}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ ...S('position:fixed;left:50%;bottom:48px;transform:translateX(-50%);display:flex;gap:8px;transition:opacity .5s ease'), opacity: v.o5, pointerEvents: v.pe5 }}>
          <Hov s={'background:rgba(16,18,30,.75);color:#f4f2ee;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:9px 16px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer'} h="background:rgba(255,255,255,.16)" onClick={v.nextBeat}>Next ↓</Hov>
          <Hov s={'background:transparent;color:#f4f2ee;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:9px 16px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer'} h="background:rgba(255,255,255,.16)" onClick={v.goHome}>Skip the storm</Hov>
        </div>

        <section data-screen-label="Home — About and Contact" style={{ ...S('position:fixed;left:max(16px, 4vw);top:50%;width:min(460px, calc(100vw - 32px));max-height:min(80vh, calc(100vh - 140px));overflow:auto;box-sizing:border-box;padding:28px;border-radius:18px;background:rgba(36,22,40,.88);border:1px solid rgba(255,255,255,.16);transition:opacity .6s ease, transform .8s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;gap:20px'), ...dyn(6, { transform: `translateY(calc(-50% + ${v.y6}px))` }) }}>
          <div style={S('display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.photo} alt="Hrishita Joshi" style={S('width:118px;height:148px;object-fit:cover;object-position:46% 34%;border-radius:12px;border:3px solid #fff3e6;box-shadow:0 10px 30px rgba(0,0,0,.35);transform:rotate(-2deg);flex:none')} />
            <div style={S('display:flex;flex-direction:column;gap:8px;flex:1 1 180px;min-width:0')}>
              {rowLabel('Last stop — Home', '#ffd2a0')}
              <h2 style={S("margin:0;font-family:'DM Serif Display', serif;font-weight:400;font-size:42px;line-height:1")}>Hi, I’m Hrishita.</h2>
            </div>
          </div>
          <div style={S('display:flex;flex-direction:column;gap:12px')}>
            {v.aboutParas.map((p, i) => <p key={i} style={S('margin:0;font-size:15px;line-height:1.6;color:#f1e3dc;text-wrap:pretty')}>{p}</p>)}
            {ph(v.offClock, 'margin:0;font-size:15px;line-height:1.6;color:#f1e3dc;text-wrap:pretty', 'margin:0;font-size:13px;line-height:1.45;color:#d8c6c0;font-style:italic;border:1px dashed rgba(216,198,192,.5);border-radius:6px;padding:8px 10px')}
          </div>
          <div style={S('display:flex;flex-direction:column')}>
            {contactRow('Email', 'hrishitajoshi86@gmail.com', 'mailto:hrishitajoshi86@gmail.com')}
            {v.linkedin.has ? contactRow('LinkedIn', 'Hrishita Joshi →', v.linkedin.url) : contactRow('LinkedIn', 'URL to add', false)}
            {v.github.has ? contactRow('GitHub', 'View profile →', v.github.url) : contactRow('GitHub', 'URL to add', false)}
            {v.resume.has && contactRow('Résumé', 'View PDF →', v.resume.url)}
            {contactRow('Phone', '+91 81712 32590', 'tel:+918171232590', true)}
          </div>
          <div style={S('display:flex;gap:10px;flex-wrap:wrap')}>
            <Hov as="a" s="background:#f2c14e;color:#2a1f2e;padding:12px 18px;border-radius:999px;font-weight:700;font-size:14px" h="background:#ffd36b;color:#2a1f2e" href="mailto:hrishitajoshi86@gmail.com">Say hello →</Hov>
            <Hov s="background:transparent;color:#fff6ee;border:1px solid rgba(255,255,255,.3);padding:12px 18px;border-radius:999px;font-family:Manrope, sans-serif;font-size:14px;cursor:pointer" h="background:rgba(255,255,255,.12)" onClick={v.goStart}>Ride again</Hov>
          </div>
        </section>

        <div data-screen-label="Sound control" style={S('position:fixed;left:24px;bottom:44px;z-index:12;display:flex;align-items:center;gap:10px')}>
          {v.sndIdle && (
            <Hov s={'display:flex;align-items:center;gap:9px;background:rgba(24,16,34,.7);color:#fff6ee;border:1px solid rgba(255,255,255,.32);border-radius:999px;padding:9px 15px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer'} h="background:rgba(255,255,255,.2)" onClick={v.startSound} aria-label="Enable ambient sound"><SvgOn size={16} />Enable ambient sound</Hov>
          )}
          {v.sndLive && (<>
            <Hov s="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(24,16,34,.7);color:#fff6ee;border:1px solid rgba(255,255,255,.32);border-radius:50%;cursor:pointer;padding:0" h="background:rgba(255,255,255,.2)" onClick={v.toggleSound} aria-label={v.sndLabel}>
              {v.sndOn ? <SvgOn size={18} /> : <SvgOff size={18} />}
            </Hov>
            <input type="range" min="0" max="1" step="0.05" value={v.vol} onChange={v.setVol} aria-label="Ambient volume" style={S('width:84px;accent-color:#ffd2a0;cursor:pointer;opacity:.85')} />
          </>)}
        </div>

        <div style={S('position:fixed;left:28px;right:28px;bottom:24px;height:2px;background:rgba(255,255,255,.28);border-radius:2px;pointer-events:none')}>
          <div ref={v.barRef} style={S('position:absolute;inset:0;background:#fff;transform-origin:left center;transform:scaleX(0);border-radius:2px')} />
          <div style={S('position:absolute;left:52%;width:30%;top:-1px;height:4px;border-radius:2px;background:rgba(169,184,224,.55)')} />
          {[['8%', '#f2c14e'], ['20%', '#ffc98a'], ['31%', '#46d8ea'], ['42%', '#f4ecdb'], ['94%', '#ffd2a0']].map(([l, c]) => <div key={l} style={S('position:absolute;top:-3px;width:8px;height:8px;margin-left:-4px;border-radius:50%;left:' + l + ';background:' + c)} />)}
        </div>

        {v.isMood && (
          <div data-screen-label="MoodMenu — Inside" onClick={v.closeBackdrop} style={S('position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(30,14,10,.6)')}>
            <div style={S('width:min(960px, 100%);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;border:clamp(8px, 1.4vw, 14px) solid #6b4430;border-radius:10px;background:#1f2b25;box-shadow:inset 0 0 90px rgba(0,0,0,.5), 0 30px 80px rgba(0,0,0,.45);padding:clamp(20px, 4vw, 44px);display:flex;flex-direction:column;gap:28px;color:#f3eee4')}>
              <div style={S('display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap')}>
                <div style={S('display:flex;flex-direction:column;gap:6px')}>
                  {rowLabel('Today’s special · Stop 02', '#ffc98a')}
                  <h2 style={S("margin:0;font-family:'DM Serif Display', serif;font-weight:400;font-size:clamp(44px, 6vw, 64px);line-height:.95")}>{mm.name}</h2>
                  <div style={S('font-family:Caveat, cursive;font-size:28px;color:#f6d7a8')}>{mm.tagline}</div>
                </div>
                {closeBtn('background:transparent;color:#f3eee4;border:1px solid rgba(243,238,228,.4);border-radius:999px;padding:9px 15px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer', 'background:rgba(243,238,228,.12)', 'Back to the road · Esc')}
              </div>
              <p style={S('margin:0;font-size:18px;line-height:1.55;max-width:60ch;text-wrap:pretty')}>{mm.what}</p>
              <div style={S('display:grid;grid-template-columns:repeat(auto-fit, minmax(min(280px, 100%), 1fr));gap:32px')}>
                <div style={S('display:flex;flex-direction:column;gap:24px')}>
                  <div style={S('display:flex;flex-direction:column;gap:10px')}>
                    <div style={S(cav)}>Why it’s on the menu</div>
                    {ph(mm.problemF, 'margin:0;font-size:15px;line-height:1.55;text-wrap:pretty', miss)}
                  </div>
                  <div style={S('display:flex;flex-direction:column;gap:6px')}>
                    <div style={S(cav)}>On the menu</div>
                    {mm.featureRows.map(f => <div key={f.n} style={S('display:flex;gap:12px;align-items:baseline;padding:9px 0;border-bottom:1px dotted rgba(243,238,228,.35);font-size:15px;line-height:1.4')}><span style={S(mono + 'font-size:11px;color:#f6d7a8')}>{f.n}</span><span>{f.f}</span></div>)}
                  </div>
                </div>
                <div style={S('display:flex;flex-direction:column;gap:24px')}>
                  <div style={S('display:flex;flex-direction:column;gap:10px')}>
                    <div style={S(cav)}>Ingredients</div>
                    <div style={S('display:flex;flex-wrap:wrap;gap:7px')}>{mm.tech.map(t => <span key={t} style={S('padding:5px 11px;border:1px solid rgba(243,238,228,.35);border-radius:999px;font-size:13px')}>{t}</span>)}</div>
                  </div>
                  <div style={S('display:flex;flex-direction:column;gap:10px')}>
                    <div style={S(cav)}>Chef’s note — my part</div>
                    {ph(mm.contribF, 'margin:0;font-size:15px;line-height:1.55;text-wrap:pretty', miss)}
                  </div>
                  <div style={S('display:flex;gap:10px;flex-wrap:wrap')}>
                    {links(mm, ['background:#ffc98a;color:#2a1810;border-radius:999px;padding:10px 16px;font-weight:700;font-size:14px', 'background:#ffdcb0;color:#2a1810', 'GitHub →'], ['border:1px solid #ffc98a;color:#ffc98a;border-radius:999px;padding:10px 16px;font-weight:700;font-size:14px', '', 'Live demo →'])}
                  </div>
                </div>
              </div>
              <div style={S('display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-top:18px;border-top:1px solid rgba(243,238,228,.2)')}>
                <span style={S('font-family:Caveat, cursive;font-size:24px;color:#f6d7a8')}>Thanks for stopping by. Next up: the cyber cell.</span>
                <Hov s="background:#f3eee4;color:#1f2b25;border:none;border-radius:999px;padding:10px 18px;font-family:Manrope, sans-serif;font-weight:700;font-size:14px;cursor:pointer" h="background:#fff" onClick={v.continuePra}>Keep riding →</Hov>
              </div>
            </div>
          </div>
        )}

        {v.isPra && (
          <div data-screen-label="Prahari — Inside" onClick={v.closeBackdrop} style={S('position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(3,7,14,.72)')}>
            <div style={S("width:min(1000px, 100%);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;border:1px solid #1d3346;border-radius:6px;background:#0a111d;color:#dbe6f0;" + mono + "display:flex;flex-direction:column;box-shadow:0 30px 90px rgba(0,0,0,.6)")}>
              <div style={S('display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid #1d3346;font-size:11px;letter-spacing:.14em;text-transform:uppercase')}>
                <span style={S('color:#46d8ea')}>Prahari // Security operations</span>
                <span style={S('display:flex;align-items:center;gap:8px;color:#5fe39a')}><span style={S('width:7px;height:7px;border-radius:50%;background:#5fe39a')} />Session secure</span>
                {closeBtn('background:transparent;color:#dbe6f0;border:1px solid #2c4a62;border-radius:4px;padding:7px 12px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer', 'border-color:#46d8ea;color:#46d8ea', 'Exit [Esc]')}
              </div>
              <div style={S('padding:clamp(20px, 3.5vw, 36px);display:flex;flex-direction:column;gap:10px;border-bottom:1px solid #1d3346')}>
                <div style={S('font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7f93a8')}>Case file · Stop 03</div>
                <h2 style={S('margin:0;font-family:Manrope, sans-serif;font-weight:700;font-size:clamp(40px, 6vw, 60px);line-height:1;letter-spacing:.03em;color:#fff')}>{pr.name}</h2>
                <p style={S('margin:0;font-family:Manrope, sans-serif;font-size:17px;line-height:1.55;max-width:62ch;color:#c7d6e4;text-wrap:pretty')}>{pr.what}</p>
              </div>
              <div style={S('display:grid;grid-template-columns:repeat(auto-fit, minmax(min(280px, 100%), 1fr));gap:1px;background:#1d3346')}>
                {praCell('01', 'Threat', ph(pr.problemF, praBody, praMiss))}
                {praCell('02', 'How it works', ph(pr.howF, praBody, praMiss))}
                <div style={S('background:#0a111d;padding:22px;display:flex;flex-direction:column;gap:8px')}>
                  <div style={S('font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#46d8ea')}>03 · Capabilities</div>
                  {pr.featureRows.map(f => <div key={f.n} style={S('display:flex;gap:10px;font-family:Manrope, sans-serif;font-size:15px;line-height:1.45')}><span style={S(mono + 'color:#5fe39a')}>▸</span><span>{f.f}</span></div>)}
                </div>
                <div style={S('background:#0a111d;padding:22px;display:flex;flex-direction:column;gap:6px')}>
                  <div style={S('font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#46d8ea')}>04 · Stack</div>
                  {pr.techRows.map(t => <div key={t.n} style={S('display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid #15263a;font-size:13px')}><span style={S('color:#7f93a8')}>MOD {t.n}</span><span>{t.t}</span></div>)}
                </div>
                {praCell('05', 'Operator — my part', ph(pr.contribF, praBody, praMiss))}
                <div style={S('background:#0a111d;padding:22px;display:flex;flex-direction:column;gap:12px')}>
                  <div style={S('font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#46d8ea')}>06 · Access</div>
                  <div style={S('display:flex;gap:10px;flex-wrap:wrap')}>
                    {links(pr, ['border:1px solid #46d8ea;color:#46d8ea;border-radius:4px;padding:9px 14px;font-size:12px;letter-spacing:.1em;text-transform:uppercase', '', 'Open repo →'], ['background:#46d8ea;color:#06111d;border-radius:4px;padding:9px 14px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:600', '', 'Launch demo →'])}
                  </div>
                </div>
              </div>
              <div style={S('display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 20px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7f93a8')}>
                <span>End of file · next: the library</span>
                <Hov s={'background:transparent;color:#5fe39a;border:1px solid #2f6a4c;border-radius:4px;padding:8px 14px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer'} h="border-color:#5fe39a" onClick={v.continueStudy}>Keep riding →</Hov>
              </div>
            </div>
          </div>
        )}

        {v.isStudy && (
          <div data-screen-label="StudySync — Inside" onClick={v.closeBackdrop} style={S('position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(26,18,30,.6)')}>
            <div style={S('width:min(940px, 100%);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;border-radius:4px;background-color:#f4ecdb;background-image:repeating-linear-gradient(transparent 0 31px, rgba(80,110,160,.13) 31px 32px);color:#2b2420;box-shadow:0 30px 80px rgba(0,0,0,.45);padding:clamp(20px, 4vw, 44px);display:flex;flex-direction:column;gap:26px')}>
              <div style={S('display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-bottom:12px;border-bottom:2px solid #8a2b2b')}>
                {rowLabel('Catalog card · No. SS-04', '#8a2b2b')}
                {closeBtn('background:transparent;color:#2b2420;border:1px solid #2b2420;border-radius:3px;padding:7px 12px;' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer', 'background:#2b2420;color:#f4ecdb', 'Return · Esc')}
              </div>
              <div style={S('display:flex;flex-direction:column;gap:6px')}>
                <h2 style={S("margin:0;font-family:'DM Serif Display', serif;font-weight:400;font-size:clamp(44px, 6vw, 62px);line-height:.95")}>{st.name}</h2>
                <div style={S("font-family:'DM Serif Display', serif;font-style:italic;font-size:22px;color:#5a4a3e")}>{st.tagline}</div>
              </div>
              <div style={S('display:grid;grid-template-columns:repeat(auto-fit, minmax(min(280px, 100%), 1fr));gap:34px')}>
                <div style={S('display:flex;flex-direction:column;gap:22px')}>
                  <div style={S('display:flex;flex-direction:column;gap:8px')}>
                    {rowLabel('Abstract', '#8a2b2b')}
                    <p style={S('margin:0;font-size:16px;line-height:1.6;text-wrap:pretty')}>{st.what}</p>
                  </div>
                  {stField('Why it exists', st.problemF)}
                  {stField('Author’s note — my part', st.contribF)}
                </div>
                <div style={S('display:flex;flex-direction:column;gap:22px')}>
                  <div style={S('display:flex;flex-direction:column;gap:2px')}>
                    <div style={S(mono + 'font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8a2b2b;padding-bottom:6px')}>Contents</div>
                    {st.featureRows.map(f => <div key={f.n} style={S('display:flex;gap:14px;align-items:baseline;padding:6px 0;font-size:15px;line-height:1.4')}><span style={S(mono + 'font-size:11px;color:#8a7a6a;flex:none')}>Ch. {f.n}</span><span>{f.f}</span></div>)}
                  </div>
                  <div style={S('display:flex;flex-direction:column;gap:8px')}>
                    {rowLabel('Bound with', '#8a2b2b')}
                    <div style={S("font-family:'DM Serif Display', serif;font-style:italic;font-size:17px;line-height:1.5;color:#3a302a")}>{st.techLine}</div>
                  </div>
                  <div style={S('display:flex;gap:10px;flex-wrap:wrap')}>
                    {links(st, ['background:#2b2420;color:#f4ecdb;border-radius:3px;padding:10px 16px;font-weight:700;font-size:14px', 'background:#4a3f36;color:#f4ecdb', 'Borrow on GitHub →'], ['border:1px solid #2b2420;color:#2b2420;border-radius:3px;padding:10px 16px;font-weight:700;font-size:14px', '', 'Read online →'])}
                  </div>
                </div>
              </div>
              <div style={S('display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-top:16px;border-top:1px solid #c9b896')}>
                <span style={S("font-family:'DM Serif Display', serif;font-style:italic;font-size:17px;color:#5a4a3e")}>The sky is turning. The road ahead gets rougher.</span>
                <Hov s={'background:transparent;color:#8a2b2b;border:2px solid #8a2b2b;border-radius:3px;padding:8px 16px;' + mono + 'font-size:12px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transform:rotate(-1.5deg)'} h="background:#8a2b2b;color:#f4ecdb" onClick={v.continueStorm}>Ride into the storm →</Hov>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderVals() {
    const C = this.C, Z = this.Z, a = this.state.active, beat = this.state.beat, v = {};
    for (let i = 0; i <= 6; i++) { const on = a === i; v['o' + i] = on ? 1 : 0; v['y' + i] = on ? 0 : 24; v['pe' + i] = on ? 'auto' : 'none'; }
    const ph = (t, hint) => ({ text: t || 'To add — ' + hint, filled: !!t, missing: !t });
    const lk = u => ({ url: u || '', has: !!u, none: !u });
    const proj = k => { const p = C.projects[k]; return { ...p,
      problemF: ph(p.problem, 'the problem this solves, in your own words.'),
      howF: ph(p.how, 'how it works under the hood (only what the code actually does).'),
      contribF: ph(p.contribution, 'what you personally designed or built.'),
      repoL: lk(p.repo), demoL: lk(p.demo),
      featureRows: p.features.map((f, i) => ({ f, n: String(i + 1).padStart(2, '0') })),
      techRows: p.tech.map((t, i) => ({ t, n: String(i + 1).padStart(2, '0') })),
      techLine: p.tech.join(' · ') }; };
    const stories = [], chals = [];
    C.storm.forEach((b, i) => {
      const on = a === 5 && beat === i, o = on ? 1 : 0, y = on ? 0 : 14;
      if (b.challenge == null) { stories.push({ text: b.text, label: b.label, o, y }); return; }
      const ch = C.challenges[b.challenge];
      chals.push({ project: ch.project, idx: b.challenge + 1, o, y, pe: on ? 'auto' : 'none', rows: [
        ['The challenge', ch.challenge, 'what broke, or where you got stuck.'],
        ['Why it was hard', ch.why, 'why it took longer than expected.'],
        ['What I tried', ch.tried, 'what you changed, tested or rebuilt.'],
        ['What I learned', ch.learned, 'the lesson you kept.']
      ].map(([label, t, h]) => ({ label, ...ph(t, h) })) });
    });
    const open = this.state.open;
    const closeOverlay = () => this.close();
    const continueTo = p => () => { this.close(); setTimeout(() => this.goTo(p), 30); };
    return {
      ...v,
      loading: !this.state.ready,
      sndIdle: !this.state.audioStarted, sndLive: this.state.audioStarted, sndOn: this.state.audioOn, sndOff: !this.state.audioOn,
      sndLabel: this.state.audioOn ? 'Mute ambient sound' : 'Unmute ambient sound', vol: this.state.vol,
      startSound: () => this.startSound(), toggleSound: () => this.toggleSound(), setVol: e => this.setVol(parseFloat(e.target.value)),
      mountRef: this.mountRef, barRef: this.barRef,
      mm: proj('mood'), pr: proj('pra'), st: proj('study'),
      isMood: open === 'mood', isPra: open === 'pra', isStudy: open === 'study',
      openMood: () => this.open('mood'), openPra: () => this.open('pra'), openStudy: () => this.open('study'),
      closeOverlay, closeBackdrop: e => { if (e.target === e.currentTarget) this.close(); },
      continuePra: continueTo(Z.pra), continueStudy: continueTo(Z.study), continueStorm: continueTo(this.BEATS[0] + 0.01),
      stories, chals,
      nextBeat: () => { const nx = this.BEATS.find(p => p > this.scrollP() + 0.004); this.goTo(nx != null ? nx + 0.008 : Z.home); },
      photo: C.about.photo, aboutParas: C.about.paragraphs, offClock: ph(C.about.offClock, 'one line about you outside code (what you do when you’re not building).'),
      linkedin: lk(C.contact.linkedin), github: lk(C.contact.github), resume: lk(C.contact.resume),
      goGarage: () => this.goTo(Z.garage), goMood: () => this.goTo(Z.mood),
      goStorm: () => this.goTo(this.BEATS[0] + 0.01), goHome: () => this.goTo(1), goStart: () => this.goTo(0)
    };
  }
}

export default Ride;
