import { useState, useEffect, useRef } from "react";

/* ─── INJECT GLOBAL CSS ─────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:      #0B1F3A;
    --navy2:     #1A3A5C;
    --teal:      #0891B2;
    --teal10:    rgba(8,145,178,.10);
    --teal20:    rgba(8,145,178,.20);
    --teal-bg:   #E0F7FA;
    --green:     #059669;
    --green-bg:  #D1FAE5;
    --amber:     #D97706;
    --amber-bg:  #FEF3C7;
    --red:       #DC2626;
    --red-bg:    #FEE2E2;
    --purple:    #7C3AED;
    --bg:        #F0F4F8;
    --surface:   #FFFFFF;
    --border:    #E2E8F0;
    --border2:   #CBD5E1;
    --t1:        #0F172A;
    --t2:        #475569;
    --tm:        #94A3B8;
    --ff:        'Inter', system-ui, sans-serif;
    --mono:      'JetBrains Mono', monospace;
    --r:         8px;
    --r2:        12px;
    --shadow:    0 1px 3px rgba(0,0,0,.07), 0 4px 12px rgba(0,0,0,.05);
    --shadow-hv: 0 4px 16px rgba(0,0,0,.12);
  }

  html, body, #root { height: 100%; font-family: var(--ff); background: var(--bg); color: var(--t1); font-size: 13px; }

  /* Screen transition */
  .screen-enter  { animation: fadeSlide .22s ease both; }
  @keyframes fadeSlide { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  /* Bar fill animation */
  .bar-animate { animation: barGrow .6s cubic-bezier(.4,0,.2,1) both; }
  @keyframes barGrow { from { width:0 !important; } }

  /* Gauge ring animation */
  .ring-animate { animation: ringDraw .8s cubic-bezier(.4,0,.2,1) both; }
  @keyframes ringDraw { from { stroke-dashoffset: 119.4 !important; } }

  /* Flag resolve animation */
  .flag-resolve { animation: flagOut .3s ease forwards; }
  @keyframes flagOut { to { opacity:0; max-height:0; padding:0; margin:0; overflow:hidden; } }

  /* Card hover */
  .card-hover { transition: box-shadow .18s, transform .18s; cursor:default; }
  .card-hover:hover { box-shadow: var(--shadow-hv); transform: translateY(-1px); }

  /* Scrollbar */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:8px; }

  /* Skill toggle */
  .stgl { transition: all .15s; }
  .stgl:hover { filter: brightness(.95); }

  /* Tab active underline slide */
  .tab-item { position:relative; transition: color .15s; }
  .tab-item::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--teal); transform:scaleX(0); transition:transform .2s; border-radius:2px 2px 0 0; }
  .tab-item.active::after { transform:scaleX(1); }

  /* Pulse on urgent badge */
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }

  /* Button press */
  button:active { transform: scale(.97); }

  /* Contenteditable caret */
  [contenteditable]:focus { outline: 2px solid var(--teal); border-radius:6px; }
`;

function InjectStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

/* ─── DESIGN TOKENS ───────────────────────────────────────── */
const C = {
  navy:"#0B1F3A", navy2:"#1A3A5C", teal:"#0891B2", tealBg:"#E0F7FA",
  green:"#059669", greenBg:"#D1FAE5", amber:"#D97706", amberBg:"#FEF3C7",
  red:"#DC2626", redBg:"#FEE2E2", border:"#E2E8F0", border2:"#CBD5E1",
  bg:"#F0F4F8", surface:"#fff", t1:"#0F172A", t2:"#475569", tm:"#94A3B8",
};

/* ─── SHARED COMPONENTS ───────────────────────────────────── */
function Badge({ type="gray", children, pulse=false }) {
  const map = {
    teal: { bg:C.tealBg, color:C.teal },
    green: { bg:C.greenBg, color:C.green },
    amber: { bg:C.amberBg, color:C.amber },
    red: { bg:C.redBg, color:C.red },
    navy: { bg:"#EFF6FF", color:C.navy2 },
    gray: { bg:"#F1F5F9", color:C.t2 },
  };
  const s = map[type] || map.gray;
  return (
    <span className={pulse?"pulse":""} style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding:"3px 8px", borderRadius:4, fontSize:10, fontWeight:700,
      background:s.bg, color:s.color
    }}>{children}</span>
  );
}

function Btn({ variant="ghost", size="md", onClick, children, style:sx={} }) {
  const base = { display:"inline-flex", alignItems:"center", gap:5, borderRadius:6,
    fontFamily:"inherit", fontWeight:600, cursor:"pointer", border:"none",
    transition:"all .15s", whiteSpace:"nowrap", ...sx };
  const sz = size==="sm" ? { padding:"5px 12px", fontSize:11 } : { padding:"8px 16px", fontSize:12 };
  const vars = {
    navy:  { background:C.navy, color:"#fff" },
    teal:  { background:C.teal, color:"#fff" },
    green: { background:C.green, color:"#fff" },
    ghost: { background:"transparent", color:C.t2, border:`1px solid ${C.border2}` },
    danger:{ background:C.redBg, color:C.red, border:`1px solid #FCA5A5` },
  };
  return <button onClick={onClick} style={{...base,...sz,...(vars[variant]||vars.ghost)}}>{children}</button>;
}

function Card({ children, style:sx={}, className="" }) {
  return (
    <div className={`card-hover ${className}`} style={{
      background:C.surface, borderRadius:10, border:`1px solid ${C.border}`,
      boxShadow:"0 1px 3px rgba(0,0,0,.06)", ...sx
    }}>{children}</div>
  );
}

function CardHd({ title, sub, right, children }) {
  return (
    <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
      <div>
        {title && <div style={{ fontSize:13, fontWeight:700 }}>{title}</div>}
        {sub && <div style={{ fontSize:10, color:C.tm, marginTop:2 }}>{sub}</div>}
        {children}
      </div>
      {right}
    </div>
  );
}

function CardBd({ children, style:sx={} }) {
  return <div style={{ padding:"16px 18px", ...sx }}>{children}</div>;
}

function SecLabel({ children, style:sx={} }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase",
    color:C.tm, marginBottom:7, ...sx }}>{children}</div>;
}

function AiChip({ children="AI Draft" }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4,
      background:"linear-gradient(135deg,#E0F7FA,#EDE9FE)", border:"1px solid #B2EBF2",
      borderRadius:4, padding:"2px 8px", fontSize:9, fontWeight:700, color:C.teal,
      letterSpacing:".3px", textTransform:"uppercase" }}>🤖 {children}</span>
  );
}

/* ─── EVIDENCE GAUGE ──────────────────────────────────────── */
const EV_DATA = [
  { domain:"Scene Safety & Approach",        level:"strong",  pct:95 },
  { domain:"Primary Patient Assessment",     level:"strong",  pct:88 },
  { domain:"Cardiac Assessment & 12-Lead",   level:"strong",  pct:84 },
  { domain:"Vital Signs Documentation",      level:"partial", pct:52 },
  { domain:"Patient Communication",          level:"partial", pct:42 },
  { domain:"Handoff Documentation (PCR)",    level:"none",    pct:0  },
];

function EvidenceGauge({ animate }) {
  const colors = { strong:C.green, partial:C.amber, none:"transparent" };
  const labels = { strong:"Strong", partial:"Partial", none:"Not captured" };
  const textColors = { strong:C.green, partial:C.amber, none:C.red };
  return (
    <div>
      <div style={{ fontSize:11, color:C.t2, marginBottom:12, lineHeight:1.6 }}>
        AI mapped this encounter to competency domains below. <strong>Strong</strong> = fully documented. <strong>Partial</strong> = incomplete. <strong>None</strong> = not captured.
      </div>
      {EV_DATA.map((e, i) => (
        <div key={e.domain} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:11, fontWeight:600, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.domain}</span>
            <span style={{ fontSize:10, fontWeight:700, color:textColors[e.level] }}>{labels[e.level]}</span>
          </div>
          <div style={{ height:7, background:C.border, borderRadius:4, overflow:"hidden" }}>
            <div
              className={animate ? "bar-animate" : ""}
              style={{
                height:"100%", width:`${e.pct}%`, background:colors[e.level],
                borderRadius:4, animationDelay:`${i*0.07}s`
              }}
            />
          </div>
        </div>
      ))}
      <div style={{ display:"flex", gap:12, marginTop:8 }}>
        {[["strong",C.green],["partial",C.amber],["none",C.border2]].map(([k,col])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, color:C.tm }}>
            <div style={{ width:8, height:8, borderRadius:2, background:col, border:k==="none"?`1px solid ${C.border2}`:"none" }} />
            {k==="strong"?"Strong":k==="partial"?"Partial":"Not captured"}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── COMPLETENESS RING ───────────────────────────────────── */
function CompletenessRing({ pct, animate }) {
  const r = 19, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ position:"relative", width:46, height:46, flexShrink:0 }}>
      <svg width="46" height="46" viewBox="0 0 46 46" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="23" cy="23" r={r} fill="none" stroke="#B2EBF2" strokeWidth="5" />
        <circle
          className={animate ? "ring-animate" : ""}
          cx="23" cy="23" r={r} fill="none"
          stroke={pct < 50 ? C.amber : pct < 80 ? C.teal : C.green}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition:"stroke-dashoffset .4s, stroke .3s" }}
        />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:12, fontWeight:800,
        color: pct<50?C.amber:pct<80?C.teal:C.green }}>{pct}%</div>
    </div>
  );
}

/* ─── DATA ────────────────────────────────────────────────── */
const SHIFTS = [
  { id:1, name:"Marcus Reyes",   initials:"MR", color:"#0891B2", cohort:"Paramedic Fall '24", loc:"St. Luke's ED",     date:"Oct 14", enc:3, comp:"Respiratory Assessment", tier:"urgent", tags:["pediatric","airway"],   missing:2, deadline:"Milestone due Oct 16" },
  { id:2, name:"Priya Anand",    initials:"PA", color:"#7C3AED", cohort:"Paramedic Fall '24", loc:"AMR Field",         date:"Oct 14", enc:2, comp:"Cardiac Assessment",     tier:"ready",  tags:["cardiac","12-lead"],    missing:0 },
  { id:3, name:"Jordan Lee",     initials:"JL", color:"#059669", cohort:"EMT Spring '25",     loc:"County Hospital",   date:"Oct 13", enc:4, comp:"Trauma Assessment",      tier:"ready",  tags:["trauma","multi-system"],missing:0 },
  { id:4, name:"Sam Torres",     initials:"ST", color:"#D97706", cohort:"AEMT Cohort B",      loc:"Fire Station 7",    date:"Oct 12", enc:1, comp:"OB/Pediatric",           tier:"pending",tags:["ob","neonatal"],       missing:0 },
  { id:5, name:"Elena Cruz",     initials:"EC", color:"#DC2626", cohort:"Paramedic Fall '24", loc:"St. Luke's ED",     date:"Oct 11", enc:3, comp:"Respiratory Assessment", tier:"approved",tags:["asthma","cpap"],      missing:0 },
];

const FLAGS_INIT = [
  { id:1, text:"Serial vitals not documented — only one set recorded at 14:22" },
  { id:2, text:"PCR handoff documentation not captured in shift log" },
  { id:3, text:"Medication administration time missing from intervention log" },
];

const SKILLS = ["Scene Safety Assessment","Patient Assessment (primary)","Airway Management","Medication Administration","Patient Handoff Communication"];

const QUOTA = [
  { name:"Cardiac / ACS",        target:8, actual:7 },
  { name:"Respiratory Distress", target:6, actual:6 },
  { name:"Pediatric Encounters", target:4, actual:1 },
  { name:"Trauma (multi-system)",target:5, actual:3 },
  { name:"OB / Neonatal",        target:2, actual:0 },
];

const COHORTS = [
  { name:"Paramedic Fall '24", students:12, atRisk:2, pct:68, color:C.teal },
  { name:"EMT Spring '25",     students:28, atRisk:4, pct:42, color:"#7C3AED" },
  { name:"AEMT Cohort B",      students: 9, atRisk:1, pct:81, color:C.green },
];

/* ─── SCREEN 1: QUEUE ─────────────────────────────────────── */
function QueueScreen({ onOpenShift }) {
  const tiers = [
    { key:"urgent", label:"⚠  Needs Attention First",    labelColor:C.red,  borderColor:C.red },
    { key:"ready",  label:"●  AI Drafts Ready to Review", labelColor:C.teal, borderColor:C.teal },
    { key:"pending",label:"○  Awaiting Submission",       labelColor:C.tm,   borderColor:C.border2 },
    { key:"approved",label:"✓  Approved",                 labelColor:C.green,borderColor:C.green },
  ];

  return (
    <div className="screen-enter" style={{ padding:"22px 24px", maxWidth:1100, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:4 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800 }}>Shift Review Queue</div>
          <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>Dr. Elena Moss · Lead Instructor, Paramedic Program</div>
        </div>
        <Btn variant="teal" size="sm">Export Report</Btn>
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, margin:"16px 0" }}>
        {[
          { n:14, l:"Awaiting Review",      s:"3 overdue",              col:C.teal,  hi:true  },
          { n:9,  l:"AI Drafts Ready",      s:"Review & approve",       col:C.navy2, hi:false },
          { n:3,  l:"Data Checks Flagged",  s:"Student follow-up needed",col:C.amber,hi:false },
          { n:27, l:"Approved This Week",   s:"↑ 12% vs last week",     col:C.green, hi:false },
        ].map(m => (
          <div key={m.l} style={{
            background: m.hi ? C.tealBg : C.surface,
            border: `1px solid ${m.hi ? C.teal : C.border}`,
            borderRadius:10, padding:"13px 15px"
          }}>
            <div style={{ fontSize:26, fontWeight:800, color:m.col }}>{m.n}</div>
            <div style={{ fontSize:11, fontWeight:600, color:C.t2, marginTop:3 }}>{m.l}</div>
            <div style={{ fontSize:10, color:C.tm, marginTop:2 }}>{m.s}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap" }}>
        <input placeholder="Search by student, location, competency…" style={{
          flex:1, minWidth:160, padding:"7px 12px", borderRadius:6,
          border:`1px solid ${C.border}`, fontFamily:"inherit", fontSize:12, background:C.surface
        }} />
        {["All Cohorts","All Competencies","Last 7 days"].map(p => (
          <select key={p} style={{ padding:"7px 11px", borderRadius:6, border:`1px solid ${C.border}`,
            fontSize:11, color:C.t2, background:C.surface, fontFamily:"inherit", cursor:"pointer" }}>
            <option>{p}</option>
            {p==="All Cohorts" && <><option>Paramedic Fall '24</option><option>EMT Spring '25</option><option>AEMT Cohort B</option></>}
            {p==="All Competencies" && <><option>Respiratory</option><option>Cardiac</option><option>Trauma</option></>}
            {p==="Last 7 days" && <><option>Last 14 days</option><option>This rotation</option></>}
          </select>
        ))}
      </div>

      {/* Shift tiers */}
      {tiers.map(tier => {
        const shifts = SHIFTS.filter(s => s.tier === tier.key);
        if (!shifts.length) return null;
        return (
          <div key={tier.key} style={{ marginBottom:20 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase",
              color:tier.labelColor, marginBottom:9, display:"flex", alignItems:"center", gap:5 }}>
              {tier.label}
            </div>
            {shifts.map(s => <ShiftCard key={s.id} shift={s} borderColor={tier.borderColor} onOpen={() => onOpenShift(s)} />)}
          </div>
        );
      })}
    </div>
  );
}

function ShiftCard({ shift:s, borderColor, onOpen }) {
  return (
    <div className="card-hover" style={{
      background:C.surface, borderRadius:9, border:`1px solid ${C.border}`,
      borderLeft:`3px solid ${borderColor}`, padding:"13px 15px",
      display:"flex", alignItems:"center", gap:12, marginBottom:8,
      opacity: s.tier==="approved" ? .75 : 1
    }}>
      <div style={{ width:36, height:36, borderRadius:"50%", background:s.color,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>{s.initials}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700 }}>{s.name}</div>
        <div style={{ fontSize:11, color:C.t2, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {s.cohort} · {s.loc} · {s.date} · {s.enc} encounter{s.enc>1?"s":""}
        </div>
        <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
          <Badge type="navy">{s.comp}</Badge>
          {s.tags.map(t => <Badge key={t} type="gray">{t}</Badge>)}
          {s.missing > 0 && <Badge type="amber" pulse>⚠ {s.missing} data gaps</Badge>}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
        {s.deadline && <div style={{ fontSize:10, fontWeight:600, color:C.red, whiteSpace:"nowrap" }}>⏱ {s.deadline}</div>}
        {s.tier === "approved"
          ? <Badge type="green">✓ Approved</Badge>
          : <Btn variant="navy" size="sm" onClick={onOpen}>
              {s.tier==="urgent" ? "Resolve Flags →" : s.tier==="ready" ? "Review Draft →" : "Review →"}
            </Btn>}
      </div>
    </div>
  );
}

/* ─── SCREEN 2: REVIEW ────────────────────────────────────── */
const DEFAULT_DRAFT = `Student demonstrated sound clinical reasoning during a cardiac emergency. Encounter began with appropriate scene size-up and rapid identification of a 58-year-old male in acute distress. Assessment was systematic and competency-aligned: history obtained, 12-lead ECG acquired and transmitted, IV access established efficiently.

Intervention sequence was appropriate and protocol-adherent: aspirin administered, oxygen delivered via NRB, IV fluid initiated. Student maintained calm therapeutic communication throughout transport.

Recommendation: Strong evidence for Cardiac Assessment competency. Instructor should verify PCR handoff documentation before marking competency as fully met. Serial vitals not documented — coach student to record vitals at 5-minute intervals on future cardiac calls.`;

function ReviewScreen({ shift, onBack }) {
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [flags, setFlags] = useState(FLAGS_INIT.map(f => ({ ...f, resolved:false, resolving:false })));
  const [approved, setApproved] = useState(false);
  const [gaugeVisible, setGaugeVisible] = useState(false);
  const gaugeRef = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGaugeVisible(true); }, { threshold:.2 });
    if (gaugeRef.current) obs.observe(gaugeRef.current);
    return () => obs.disconnect();
  }, []);

  const resolveFlag = id => {
    setFlags(prev => prev.map(f => f.id===id ? {...f, resolving:true} : f));
    setTimeout(() => setFlags(prev => prev.map(f => f.id===id ? {...f, resolved:true, resolving:false} : f)), 300);
  };
  const openFlags = flags.filter(f => !f.resolved).length;

  if (approved) return (
    <div className="screen-enter" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <div style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Feedback Approved & Sent</div>
        <div style={{ fontSize:13, color:C.t2, lineHeight:1.7, marginBottom:20 }}>
          Priya Anand has been notified. Feedback is logged under your name as the reviewing instructor.
        </div>
        <div style={{ padding:"12px 16px", background:C.greenBg, borderRadius:8, fontSize:12,
          color:C.green, fontWeight:600, marginBottom:24 }}>
          Cardiac Assessment competency — evidence confirmed. Logged to accreditation record.
        </div>
        <Btn variant="ghost" onClick={() => { setApproved(false); onBack(); }}>← Back to Queue</Btn>
      </div>
    </div>
  );

  return (
    <div className="screen-enter" style={{ padding:"22px 24px", maxWidth:1140, margin:"0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <Btn variant="ghost" size="sm" onClick={onBack}>← Queue</Btn>
        <span style={{ color:C.tm }}>/</span>
        <span style={{ fontSize:13, fontWeight:700 }}>{shift?.name || "Priya Anand"}</span>
        <span style={{ color:C.tm }}>·</span>
        <span style={{ fontSize:11, color:C.t2 }}>Oct 14 · AMR Field · Cardiac Assessment</span>
        <div style={{ marginLeft:"auto" }}><AiChip /></div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 390px", gap:14 }}>
        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Encounter Summary */}
          <Card>
            <CardHd title="Patient Encounter Summary" sub="Auto-extracted from student log · Oct 14, 14:18–15:02"
              right={<Badge type="navy">Cardiac Assessment</Badge>} />
            <CardBd>
              <div style={{ fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:12 }}>
                <strong style={{ color:C.t1 }}>Chief Complaint:</strong> 58M, chest pain radiating to left arm × 45 min. Diaphoretic, pale. PMH: HTN, DM type 2. 12-lead confirmed ST elevation V2–V4.
              </div>
              {/* Vitals */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginBottom:14 }}>
                {[
                  { l:"HR",           v:"104",    s:"Tachycardic",   warn:true  },
                  { l:"BP",           v:"158/94", s:"Elevated",      warn:true  },
                  { l:"SpO₂",         v:"96%",    s:"Within range",  warn:false },
                  { l:"GCS",          v:"15",     s:"Alert",         warn:false },
                  { l:"RR",           v:"18",     s:"Normal",        warn:false },
                  { l:"Serial Vitals",v:"—",      s:"Data gap",      warn:true, gap:true },
                ].map(vi => (
                  <div key={vi.l} style={{
                    background: vi.gap ? C.amberBg : "#F8FAFC",
                    borderRadius:6, padding:"8px 10px"
                  }}>
                    <div style={{ fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", color:C.tm }}>{vi.l}</div>
                    <div style={{ fontSize:vi.gap?12:15, fontWeight:700, fontFamily:"var(--mono)", marginTop:2,
                      color:vi.gap?C.amber:C.t1 }}>{vi.v}</div>
                    <div style={{ fontSize:9, fontWeight:600, marginTop:1, color:vi.warn?C.amber:C.green }}>{vi.s}</div>
                  </div>
                ))}
              </div>
              <SecLabel>Interventions Logged</SecLabel>
              {["Aspirin 324mg PO administered","12-Lead ECG performed & transmitted to receiving ED","IV access established — 18g right AC","Normal saline 250mL bolus initiated","Oxygen via NRB @ 15 LPM"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12,
                  color:C.t2, padding:"6px 10px", background:"#F8FAFC", borderRadius:6, marginBottom:5 }}>
                  <div style={{ width:14, height:14, borderRadius:3, background:C.greenBg,
                    border:`1px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, fontSize:8, color:C.green }}>✓</div>
                  {item}
                </div>
              ))}
            </CardBd>
          </Card>

          {/* AI Draft */}
          <Card>
            <CardHd title="AI-Drafted Feedback" sub="Review, edit, and approve — your name will be on record" right={<AiChip />} />
            <CardBd>
              {/* Confidence */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:11, fontWeight:600, color:C.t2 }}>Draft confidence</span>
                <div style={{ flex:1, height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
                  <div className="bar-animate" style={{ height:"100%", width:"82%",
                    background:`linear-gradient(90deg,${C.teal},${C.green})`, borderRadius:2 }} />
                </div>
                <span style={{ fontSize:11, fontWeight:800, color:C.teal }}>82%</span>
              </div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={8}
                style={{ width:"100%", minHeight:148, resize:"vertical",
                  border:`1px solid ${C.border}`, borderRadius:6, padding:"12px",
                  fontSize:12, fontFamily:"inherit", lineHeight:1.7, color:C.t1,
                  background:"#FAFCFF", transition:"border-color .15s", outline:"none" }}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <div style={{ fontSize:10, color:C.tm, display:"flex", alignItems:"center", gap:4, marginTop:5 }}>
                ✏️ Editing this draft saves your changes. Final feedback is attributed to you, not the AI.
              </div>
              <div style={{ display:"flex", gap:8, paddingTop:12, borderTop:`1px solid ${C.border}`, marginTop:12, flexWrap:"wrap" }}>
                <Btn variant="green" onClick={() => setApproved(true)}>✓ Approve & Send to Student</Btn>
                <Btn variant="ghost">Save as Draft</Btn>
                <Btn variant="danger" size="sm">Flag for Second Review</Btn>
              </div>
            </CardBd>
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Evidence Gauge */}
          <Card>
            <CardHd title="Competency Evidence Map" right={<span style={{ fontSize:10, color:C.tm }}>NRP Framework</span>} />
            <CardBd>
              <div ref={gaugeRef}>
                <EvidenceGauge animate={gaugeVisible} />
              </div>
              <div style={{ marginTop:10, padding:"9px 11px", background:C.amberBg,
                borderRadius:6, fontSize:10, color:C.amber, fontWeight:500, lineHeight:1.6 }}>
                ⚠ Handoff documentation required to fully meet CAAHEP Appendix G standard. Instructor note recommended before sign-off.
              </div>
            </CardBd>
          </Card>

          {/* Data Flags */}
          <Card>
            <CardHd title="Data Gaps" right={<Badge type={openFlags>0?"amber":"green"}>{openFlags} open</Badge>} />
            <CardBd>
              <div style={{ fontSize:11, color:C.t2, marginBottom:8 }}>
                Detected in student's log. Resolve or note before approving.
              </div>
              {flags.map(f => (
                <div key={f.id} className={f.resolving?"flag-resolve":""} style={{
                  display:"flex", alignItems:"flex-start", gap:8, padding:"9px 11px",
                  background: f.resolved ? C.greenBg : C.amberBg,
                  borderRadius:6, marginBottom:6,
                  borderLeft:`3px solid ${f.resolved ? C.green : C.amber}`,
                  transition:"all .3s", overflow:"hidden"
                }}>
                  <span style={{ fontSize:13 }}>{f.resolved?"✓":"⚠"}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:500, color:f.resolved?C.green:C.t1 }}>
                      {f.resolved?"Resolved: ":""}{f.text}
                    </div>
                    {!f.resolved && (
                      <div onClick={() => resolveFlag(f.id)} style={{ fontSize:10, color:C.amber,
                        marginTop:3, cursor:"pointer", fontWeight:700 }}>
                        Mark as noted / resolved →
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardBd>
          </Card>

          {/* Accreditation Thread */}
          <Card>
            <CardHd title="Accreditation Thread" right={<AiChip>Auto-tracked</AiChip>} />
            <CardBd>
              <div style={{ fontSize:11, color:C.t2, marginBottom:8 }}>Approving this encounter will update Priya's program record:</div>
              {[
                { l:"Cardiac encounters (required: 8)", v:"6/8 → 7/8", col:C.amber },
                { l:"12-Lead ECG documentation",       v:"4/4 ✓",     col:C.green },
                { l:"Appendix G — Cardiac domain",     v:"Partial → Met*", col:C.amber },
              ].map(r => (
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"7px 10px", background:C.bg, borderRadius:6, marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.t2 }}>{r.l}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:r.col, whiteSpace:"nowrap" }}>{r.v}</span>
                </div>
              ))}
              <div style={{ fontSize:10, color:C.tm, marginTop:4 }}>*Pending handoff note from instructor</div>
            </CardBd>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 3: STUDENT LOG ───────────────────────────────── */
const STU_CHECKS = [
  { label:"Chief complaint documented", field:"cc"  },
  { label:"Patient history obtained",   field:"hx"  },
  { label:"HR recorded",                field:"hr"  },
  { label:"BP recorded",                field:"bp"  },
  { label:"SpO₂ recorded",              field:"spo2"},
  { label:"Interventions listed",       field:"int" },
  { label:"PCR / Handoff documented",   field:"pcr" },
];

function StudentScreen() {
  const [vals, setVals] = useState({ cc:"58M, chest pain radiating to left arm", hx:"HTN, DM type 2. Onset 45 min ago.", hr:"104", bp:"158/94", spo2:"96", int:"12-Lead ECG, Aspirin 324mg, IV access 18g", pcr:"" });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setVals(p => ({ ...p, [k]:v }));
  const done = STU_CHECKS.filter(c => vals[c.field] && vals[c.field].trim().length > 3);
  const pct = Math.round((done.length / STU_CHECKS.length) * 100);
  const hasPcr = vals.pcr.trim().length > 3;

  const cov = [
    { name:"Scene Safety",       pct:90,             col:C.green },
    { name:"Patient Assessment", pct:80,             col:C.green },
    { name:"Cardiac Mgmt",       pct:75,             col:C.teal  },
    { name:"Vitals Docs",        pct:50,             col:C.amber },
    { name:"Handoff (PCR)",      pct:hasPcr?75:5,   col:hasPcr?C.green:C.red },
  ];

  if (submitted) return (
    <div className="screen-enter" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}>
      <div style={{ textAlign:"center", maxWidth:360 }}>
        <div style={{ fontSize:52, marginBottom:14 }}>📋</div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Encounter Submitted</div>
        <div style={{ fontSize:13, color:C.t2, lineHeight:1.7, marginBottom:20 }}>Your shift log has been sent to Dr. Elena Moss for review. AI feedback will be available once approved.</div>
        <Btn variant="ghost" onClick={() => { setSubmitted(false); setVals(p=>({...p,pcr:""})); }}>← Log Another</Btn>
      </div>
    </div>
  );

  return (
    <div className="screen-enter" style={{ padding:"22px 24px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Log a Patient Encounter</div>
        <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>AI checks your log in real time and previews competency coverage before you submit</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:18, alignItems:"start" }}>
        {/* Phone frame */}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ background:"#111827", borderRadius:30, padding:8,
            boxShadow:"0 24px 64px rgba(0,0,0,.3)", width:"100%", maxWidth:320 }}>
            <div style={{ background:"#fff", borderRadius:24, overflow:"hidden", minHeight:580, display:"flex", flexDirection:"column" }}>
              <div style={{ background:C.navy, color:"#fff", padding:"14px 16px" }}>
                <div style={{ fontSize:13, fontWeight:700 }}>New Encounter Log</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", marginTop:2 }}>Oct 14 · AMR Field Shift · Preceptor: J. Calderon</div>
              </div>
              <div style={{ padding:13, flex:1, display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { k:"cc",  l:"Chief Complaint",              ta:true  },
                  { k:"hx",  l:"Patient History (PMH, onset)", ta:true  },
                  { k:"int", l:"Interventions",                ta:true  },
                ].map(f => (
                  <div key={f.k}>
                    <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", color:C.tm, marginBottom:3 }}>{f.l}</div>
                    <textarea value={vals[f.k]} onChange={e=>set(f.k,e.target.value)} rows={2}
                      style={{ width:"100%", padding:"7px 9px", borderRadius:6, border:`1px solid ${C.border}`,
                        fontSize:11, fontFamily:"inherit", resize:"none", outline:"none" }}
                      onFocus={e=>e.target.style.borderColor=C.teal}
                      onBlur={e=>e.target.style.borderColor=C.border}
                    />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", color:C.tm, marginBottom:3 }}>Vitals</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                    {["hr","bp","spo2"].map(k => (
                      <input key={k} value={vals[k]} onChange={e=>set(k,e.target.value)}
                        placeholder={k.toUpperCase()}
                        style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.border}`,
                          fontSize:11, fontFamily:"inherit", outline:"none" }}
                        onFocus={e=>e.target.style.borderColor=C.teal}
                        onBlur={e=>e.target.style.borderColor=C.border}
                      />
                    ))}
                    <input placeholder="RR" style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.border}`, fontSize:11, fontFamily:"inherit", outline:"none" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", color:C.tm, marginBottom:3, display:"flex", alignItems:"center", gap:4 }}>
                    PCR / Handoff
                    {!hasPcr && <span style={{ fontSize:8, fontWeight:800, color:C.red }}>MISSING</span>}
                  </div>
                  <textarea value={vals.pcr} onChange={e=>set("pcr",e.target.value)}
                    placeholder="Describe handoff to receiving team..." rows={2}
                    style={{ width:"100%", padding:"7px 9px", borderRadius:6,
                      border:`1px solid ${!hasPcr?C.red:C.border}`, fontSize:11, fontFamily:"inherit", resize:"none", outline:"none" }}
                    onFocus={e=>e.target.style.borderColor=C.teal}
                    onBlur={e=>e.target.style.borderColor=(!hasPcr?C.red:C.border)}
                  />
                </div>
              </div>
              <div style={{ padding:"10px 13px", borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, fontWeight:600, textAlign:"center", marginBottom:7,
                  color: done.length>=6 ? C.green : C.amber }}>
                  {done.length>=6 ? "✓ Ready to submit" : `⚠ Complete ${STU_CHECKS.length-done.length} more items`}
                </div>
                <button onClick={() => done.length>=6 && setSubmitted(true)} style={{
                  width:"100%", padding:10, borderRadius:8, border:"none", cursor:"pointer",
                  background: done.length>=6 ? C.green : C.navy,
                  color:"#fff", fontSize:12, fontWeight:700, fontFamily:"inherit",
                  transition:"background .2s, transform .1s"
                }}>
                  {done.length>=6 ? "Submit Encounter" : `Fix ${STU_CHECKS.length-done.length} issues first`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Completeness panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, position:"sticky", top:22 }}>
          {/* Score ring */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:12,
            background:C.tealBg, borderRadius:8, border:`1px solid #B2EBF2` }}>
            <CompletenessRing pct={pct} animate />
            <div>
              <div style={{ fontSize:12, fontWeight:700 }}>Log Completeness</div>
              <div style={{ fontSize:10, color:C.t2, marginTop:2 }}>{done.length} of {STU_CHECKS.length} items complete</div>
            </div>
          </div>

          <Card>
            <CardHd><div style={{ fontSize:12, fontWeight:700 }}>Completeness Checklist</div></CardHd>
            <div style={{ padding:"9px 14px", display:"flex", flexDirection:"column", gap:4 }}>
              {STU_CHECKS.map((c, i) => {
                const isDone = vals[c.field] && vals[c.field].trim().length > 3;
                const cls = isDone ? { bg:C.greenBg, col:C.green, icon:"✓" } : i>=5 ? { bg:C.redBg, col:C.red, icon:"✗" } : { bg:C.amberBg, col:C.amber, icon:"!" };
                return (
                  <div key={c.label} style={{ display:"flex", alignItems:"center", gap:6,
                    padding:"6px 9px", borderRadius:6, background:cls.bg, color:cls.col,
                    fontSize:11, transition:"all .2s" }}>
                    <span style={{ fontWeight:700 }}>{cls.icon}</span>{c.label}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHd right={<AiChip>Estimate</AiChip>}><div style={{ fontSize:12, fontWeight:700 }}>Competency Coverage</div></CardHd>
            <div style={{ padding:"9px 14px", display:"flex", flexDirection:"column", gap:4 }}>
              {cov.map(c => (
                <div key={c.name} style={{ display:"flex", alignItems:"center", gap:7,
                  padding:"6px 9px", background:C.bg, borderRadius:5 }}>
                  <div style={{ fontSize:10, fontWeight:600, flex:1 }}>{c.name}</div>
                  <div style={{ width:70, height:5, background:C.border, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${c.pct}%`, background:c.col,
                      borderRadius:3, transition:"width .4s, background .3s" }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize:10, color:C.tm, marginTop:2, lineHeight:1.5 }}>
                Live preview. Instructor makes the final competency decision.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 4: PRECEPTOR ─────────────────────────────────── */
function PreceptorScreen() {
  const [skillVals, setSkillVals] = useState({});
  const [signed, setSigned] = useState(false);
  const toggle = (i, v) => setSkillVals(p => ({ ...p, [i]: p[i]===v ? null : v }));

  return (
    <div className="screen-enter" style={{ padding:"22px 24px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Field Preceptor Sign-Off</div>
        <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>Quick skill verification from the field — takes under 2 minutes</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`,
          width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,.08)" }}>
          <div style={{ background:C.navy2, color:"#fff", padding:"16px 20px" }}>
            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px",
              color:"rgba(255,255,255,.45)", marginBottom:4 }}>Preceptor Review — J. Calderon, LP</div>
            <div style={{ fontSize:17, fontWeight:800 }}>Priya Anand</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:2 }}>Oct 14 · AMR Field · Cardiac · 58M Chest Pain</div>
          </div>
          {!signed ? (
            <>
              <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <SecLabel>Encounter Summary (auto-extracted)</SecLabel>
                  <div style={{ fontSize:12, color:C.t2, lineHeight:1.65, padding:"10px 12px",
                    background:C.bg, borderRadius:7 }}>
                    58-year-old male, STEMI presentation. Student performed 12-lead acquisition, aspirin administration, IV access, and coordinated pre-notification to receiving ED. Appropriate clinical reasoning demonstrated under supervision.
                  </div>
                </div>
                <div>
                  <SecLabel>Skills Observed — Tap to verify</SecLabel>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {SKILLS.map((s, i) => (
                      <div key={s} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"9px 12px", background:C.bg, borderRadius:7 }}>
                        <span style={{ fontSize:12, fontWeight:600 }}>{s}</span>
                        <div style={{ display:"flex", gap:4 }}>
                          {[["yes","✓ Yes",C.green,C.greenBg],["no","✗ No",C.red,C.redBg]].map(([val,lbl,col,bg]) => (
                            <button key={val} className="stgl" onClick={() => toggle(i, val)} style={{
                              padding:"4px 10px", borderRadius:4, fontSize:10, fontWeight:700,
                              cursor:"pointer", fontFamily:"inherit", border:`1px solid`,
                              borderColor: skillVals[i]===val ? col : C.border,
                              background: skillVals[i]===val ? bg : C.surface,
                              color: skillVals[i]===val ? col : C.t2,
                            }}>{lbl}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
                    <SecLabel style={{ marginBottom:0 }}>AI-Drafted Preceptor Note</SecLabel>
                    <AiChip>Edit or approve</AiChip>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{
                    padding:12, background:C.tealBg, borderRadius:7, border:`1px solid #B2EBF2`,
                    fontSize:12, lineHeight:1.7, cursor:"text", outline:"none"
                  }}>
                    Student demonstrated confident clinical performance on this STEMI call. Scene management, patient assessment, and ALS intervention sequencing were appropriate and protocol-adherent. Recommend sign-off on Cardiac Assessment competency pending instructor documentation review.
                  </div>
                  <div style={{ fontSize:10, color:C.tm, marginTop:4 }}>Click to edit. This note attaches to the student's shift record.</div>
                </div>
              </div>
              <div style={{ padding:"13px 20px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
                <Btn variant="green" onClick={() => setSigned(true)} style={{ flex:1, justifyContent:"center" }}>✓ Submit Sign-Off</Btn>
                <Btn variant="ghost">Flag Issue</Btn>
              </div>
            </>
          ) : (
            <div style={{ padding:32, textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:12 }}>📋</div>
              <div style={{ fontSize:17, fontWeight:800, marginBottom:8 }}>Sign-Off Submitted</div>
              <div style={{ fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:16 }}>Dr. Elena Moss has been notified to complete the written feedback review.</div>
              <Btn variant="ghost" onClick={() => { setSigned(false); setSkillVals({}); }}>← Reset</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 5: DIRECTOR ──────────────────────────────────── */
function DirectorScreen() {
  return (
    <div className="screen-enter" style={{ padding:"22px 24px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Program Director Overview</div>
        <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>Cohort readiness, case quotas, and accreditation status — one view</div>
      </div>

      {/* Accred Banner */}
      <div style={{ padding:"16px 20px", borderRadius:12,
        background:`linear-gradient(135deg,${C.navy},${C.navy2})`,
        color:"#fff", display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700 }}>CoAEMSP Accreditation Review — Paramedic Fall '24</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:3, lineHeight:1.6 }}>
            Required case quotas, competency sign-offs, and documentation must be complete before the review window opens.
          </div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontSize:34, fontWeight:800, fontFamily:"var(--mono)", color:C.amber, lineHeight:1 }}>67</div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".5px" }}>days to review</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13, marginBottom:14 }}>
        {/* Quotas */}
        <Card>
          <CardHd title="Paramedic Fall '24 — Case Quotas" right={<Badge type="amber">2 gaps</Badge>} />
          <CardBd>
            {QUOTA.map((q, i) => {
              const pct = Math.round((q.actual/q.target)*100);
              const col = pct>=80?C.green:pct>=40?C.amber:C.red;
              const fillCls = pct>=80?"ok":pct>=40?"warn":"dg";
              return (
                <div key={q.name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ fontSize:11, color:C.t2, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.name}</div>
                  <div style={{ width:80, height:6, background:C.border, borderRadius:3, overflow:"hidden", flexShrink:0 }}>
                    <div className="bar-animate" style={{ height:"100%", width:`${pct}%`, background:col, borderRadius:3, animationDelay:`${i*0.08}s` }} />
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, fontFamily:"var(--mono)", minWidth:32, textAlign:"right", color:col }}>{q.actual}/{q.target}</div>
                </div>
              );
            })}
          </CardBd>
        </Card>

        {/* Cohort bars + AI signal */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {COHORTS.map(c => {
            const col = c.pct>70?C.green:c.pct>50?C.amber:C.red;
            return (
              <Card key={c.name} style={{ borderLeft:`3px solid ${c.color}`, overflow:"hidden" }}>
                <div style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700 }}>{c.name}</div>
                    <div style={{ fontSize:10, color:C.t2, marginTop:1 }}>{c.students} students · {c.atRisk} at risk</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:18, fontWeight:800, fontFamily:"var(--mono)", color:col }}>{c.pct}%</div>
                    <div style={{ fontSize:9, color:C.tm }}>complete</div>
                  </div>
                </div>
                <div style={{ height:4, background:C.border }}>
                  <div className="bar-animate" style={{ height:"100%", width:`${c.pct}%`, background:c.color }} />
                </div>
              </Card>
            );
          })}
          <Card>
            <CardHd right={<AiChip>Cross-product</AiChip>}><div style={{ fontSize:12, fontWeight:700 }}>AI Readiness Signal</div></CardHd>
            <div style={{ padding:"11px 14px", fontSize:11, color:C.t2, lineHeight:1.7 }}>
              Based on shift logs, exam scores, and case-type coverage, <strong style={{ color:C.red }}>4 students</strong> are at risk of not meeting NREMT requirements. Highest-risk gap: <strong>OB/neonatal encounters</strong> — only 1 of 8 required logged to date.
            </div>
          </Card>
        </div>
      </div>

      {/* Risk Table */}
      <Card>
        <CardHd title="Students Flagged at Risk" right={
          <div style={{ display:"flex", gap:6 }}>
            <AiChip>AI-monitored</AiChip>
            <Badge type="red">4 students</Badge>
          </div>
        } />
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                {["Student","Cohort","Issue","Shift Status","Risk",""].map(h => (
                  <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:9,
                    fontWeight:700, textTransform:"uppercase", letterSpacing:".5px",
                    color:C.tm, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name:"Marcus Reyes", cohort:"Paramedic Fall '24", issue:"Missing 3 required case types", shift:"2 weeks behind", risk:"High" },
                { name:"Sam Torres",   cohort:"AEMT Cohort B",      issue:"OB/neonatal quota: 0/2 encounters", shift:"On track", risk:"Medium" },
                { name:"Jordan Park",  cohort:"EMT Spring '25",     issue:"Feedback approval delayed 8 days", shift:"Unclear",   risk:"Medium" },
                { name:"Anya Singh",   cohort:"EMT Spring '25",     issue:"Exam readiness below threshold",   shift:"Minimal logs", risk:"High" },
              ].map((s, i) => (
                <tr key={s.name}>
                  <td style={{ padding:"9px 12px", fontWeight:700, borderBottom:`1px solid ${C.border}` }}>{s.name}</td>
                  <td style={{ padding:"9px 12px", color:C.t2, borderBottom:`1px solid ${C.border}` }}>{s.cohort}</td>
                  <td style={{ padding:"9px 12px", color:C.t2, borderBottom:`1px solid ${C.border}`, maxWidth:200 }}>{s.issue}</td>
                  <td style={{ padding:"9px 12px", color:C.t2, borderBottom:`1px solid ${C.border}` }}>{s.shift}</td>
                  <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}` }}>
                    <Badge type={s.risk==="High"?"red":"amber"}>{s.risk}</Badge>
                  </td>
                  <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}` }}>
                    <Btn variant="ghost" size="sm">Advise →</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─── ROOT APP ────────────────────────────────────────────── */
const TABS = [
  { id:"queue",     role:"Instructor",   label:"Shift Queue"           },
  { id:"review",    role:"Instructor",   label:"AI Draft Review"       },
  { id:"student",   role:"Student",      label:"Log Assistant"         },
  { id:"preceptor", role:"Preceptor",    label:"Field Sign-Off"        },
  { id:"director",  role:"Program Dir.", label:"Cohort & Accreditation"},
];

export default function FISDAQCopilot() {
  const [tab, setTab] = useState("queue");
  const [selectedShift, setSelectedShift] = useState(null);
  const [key, setKey] = useState(0); // force re-mount for animation

  const go = (id) => { setTab(id); setKey(k => k+1); };

  const handleOpenShift = (shift) => {
    setSelectedShift(shift);
    go("review");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", fontFamily:"var(--ff)" }}>
      <InjectStyles />

      {/* Top Nav */}
      <div style={{ background:C.navy, color:"#fff", display:"flex", alignItems:"center",
        padding:"0 24px", height:54, gap:16, flexShrink:0 }}>
        <div style={{ fontWeight:800, fontSize:16, letterSpacing:"-.3px", display:"flex", alignItems:"center", gap:8 }}>
          FISDAP
          <span style={{ color:C.teal }}>·</span>
          <span style={{ background:C.teal, color:"#fff", fontSize:9, fontWeight:700,
            padding:"2px 7px", borderRadius:4, letterSpacing:".5px" }}>AI COPILOT</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:C.teal,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, color:"#fff" }}>EM</div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>Dr. Elena Moss</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.45)" }}>Lead Instructor · Paramedic Program</div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background:C.navy2, display:"flex", padding:"0 24px", gap:2,
        flexShrink:0, borderBottom:"1px solid rgba(255,255,255,.06)", overflowX:"auto" }}>
        {TABS.map(t => (
          <div
            key={t.id}
            className={`tab-item ${tab===t.id?"active":""}`}
            onClick={() => go(t.id)}
            style={{
              padding:"10px 16px", fontSize:11, fontWeight:500, cursor:"pointer",
              color: tab===t.id ? C.teal : "rgba(255,255,255,.45)",
              borderBottom: `2px solid ${tab===t.id ? C.teal : "transparent"}`,
              whiteSpace:"nowrap", userSelect:"none", transition:"color .15s",
            }}
          >
            <span style={{
              display:"inline-block", background:"rgba(255,255,255,.08)", borderRadius:3,
              padding:"1px 5px", fontSize:8, fontWeight:700, letterSpacing:".3px",
              textTransform:"uppercase", marginRight:5,
              color: tab===t.id ? C.teal : "rgba(255,255,255,.3)",
              background: tab===t.id ? "rgba(8,145,178,.15)" : "rgba(255,255,255,.08)",
            }}>{t.role}</span>
            {t.label}
          </div>
        ))}
      </div>

      {/* Screen area */}
      <div style={{ flex:1, overflow:"auto" }}>
        {tab==="queue"     && <QueueScreen     key={key} onOpenShift={handleOpenShift} />}
        {tab==="review"    && <ReviewScreen    key={key} shift={selectedShift} onBack={() => go("queue")} />}
        {tab==="student"   && <StudentScreen   key={key} />}
        {tab==="preceptor" && <PreceptorScreen key={key} />}
        {tab==="director"  && <DirectorScreen  key={key} />}
      </div>
    </div>
  );
}