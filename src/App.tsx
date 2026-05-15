import { useState, useMemo, useEffect, CSSProperties } from ‘react’;
import {
AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
ResponsiveContainer, ReferenceLine, ReferenceDot,
} from ‘recharts’;

/* ============================================================
GLOBAL STYLES  (injected via DOM to avoid iOS quote mangling)
All CSS is built from plain string arrays - zero backticks.
============================================================ */
function useGlobalStyles() {
useEffect(function() {
if (!document.getElementById(‘tw-cdn’)) {
var s = document.createElement(‘script’);
s.id = ‘tw-cdn’;
s.src = ‘https://cdn.tailwindcss.com’;
s.async = true;
document.head.appendChild(s);
}
if (!document.getElementById(‘gfont’)) {
var l = document.createElement(‘link’);
l.id = ‘gfont’;
l.rel = ‘stylesheet’;
l.href = ‘https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap’;
document.head.appendChild(l);
}
if (!document.getElementById(‘rsp’)) {
var st = document.createElement(‘style’);
st.id = ‘rsp’;
var css = [
’*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }’,
‘html { -webkit-text-size-adjust: 100%; }’,
‘body { font-family: “Noto Sans TC”, sans-serif; background: #f1f5f9; }’,
’* { font-family: “Noto Sans TC”, sans-serif; }’,
‘input[type=number]::-webkit-inner-spin-button,’,
‘input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }’,
‘input[type=number] { -moz-appearance: textfield; }’,
‘input[type=date] { -webkit-appearance: none; appearance: none; }’,
‘:focus { outline: none; }’,
‘select { appearance: none; -webkit-appearance: none; }’,
‘button, select, input { touch-action: manipulation; }’,
‘.g2  { display:grid; grid-template-columns:1fr; gap:16px; }’,
‘.g3  { display:grid; grid-template-columns:1fr; gap:14px; }’,
‘.g4  { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }’,
‘.g6  { display:grid; grid-template-columns:1fr; gap:14px; }’,
‘.gcl { display:grid; grid-template-columns:1fr; gap:16px 20px; }’,
‘.gfm { display:grid; grid-template-columns:1fr; gap:12px; }’,
‘.gac { display:grid; grid-template-columns:1fr; gap:12px; }’,
‘.ggg { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }’,
‘.gprot { display:grid; grid-template-columns:1fr; gap:16px; }’,
‘.chart-h { height:220px; }’,
‘.nav-prem { display:none; }’,
‘.nav-sub  { display:none; }’,
‘.rpt-h1 { font-size:20px; }’,
‘.num-xl  { font-size:26px; }’,
‘.num-xxl { font-size:28px; }’,
‘.sp { padding:20px; }’,
‘@media (min-width:480px) {’,
’  .gcl { grid-template-columns:repeat(2,minmax(0,1fr)); }’,
‘}’,
‘@media (min-width:640px) {’,
’  .g2   { grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }’,
’  .g3   { grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }’,
’  .g6   { grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }’,
’  .gfm  { grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }’,
’  .gac  { grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }’,
’  .chart-h { height:280px; }’,
’  .nav-sub  { display:block; }’,
’  .rpt-h1 { font-size:26px; }’,
’  .num-xl  { font-size:32px; }’,
’  .num-xxl { font-size:32px; }’,
’  .sp { padding:28px; }’,
‘}’,
‘@media (min-width:960px) {’,
’  .g2   { grid-template-columns:repeat(2,minmax(0,1fr)); gap:24px; }’,
’  .g3   { grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }’,
’  .g4   { grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; }’,
’  .g6   { grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }’,
’  .gcl  { grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px 24px; }’,
’  .ggg  { grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; }’,
’  .gprot { grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }’,
’  .chart-h { height:310px; }’,
’  .nav-prem { display:block; }’,
’  .rpt-h1 { font-size:30px; }’,
‘}’,
];
st.textContent = css.join(’\n’);
document.head.appendChild(st);
}
}, []);
}

/* ============================================================
PALETTE + SHARED STYLES
============================================================ */
var C = {
ind: ‘#4f46e5’, vio: ‘#7c3aed’, blu: ‘#2563eb’,
ros: ‘#e11d48’, ora: ‘#ea580c’, eme: ‘#059669’,
amb: ‘#d97706’, wht: ‘#ffffff’,
s50: ‘#f8fafc’, s200: ‘#e2e8f0’, s300: ‘#cbd5e1’,
s400: ‘#94a3b8’, s500: ‘#64748b’, s600: ‘#475569’,
s700: ‘#334155’, s800: ‘#1e293b’, s900: ‘#0f172a’,
};

var cardSt: CSSProperties = {
background: C.wht, borderRadius: 20,
boxShadow: ‘0 2px 20px rgba(0,0,0,0.08)’,
border: ’1px solid ’ + C.s200, overflow: ‘hidden’,
};
var lblSt: CSSProperties = {
display: ‘block’, color: C.s900,
fontWeight: 900, fontSize: 17, marginBottom: 8,
};
var bigBase: CSSProperties = {
display: ‘block’, width: ‘100%’, minWidth: 0, height: 54,
borderRadius: 14, border: ’2px solid ’ + C.s200, background: C.s50,
fontSize: 24, fontWeight: 800, color: C.s900,
paddingTop: 0, paddingBottom: 0, paddingLeft: 16, paddingRight: 16,
transition: ‘border-color .2s, box-shadow .2s’,
};
var txtBase: CSSProperties = {
display: ‘block’, width: ‘100%’, minWidth: 0, height: 54,
borderRadius: 14, border: ’2px solid ’ + C.s200, background: C.s50,
fontSize: 16, fontWeight: 600, color: C.s900,
paddingTop: 0, paddingBottom: 0, paddingLeft: 16, paddingRight: 16,
transition: ‘border-color .2s, box-shadow .2s’,
};
var gCell: CSSProperties = { minWidth: 0, width: ‘100%’, overflow: ‘hidden’ };

/* ============================================================
TYPES
============================================================ */
interface Client {
name: string; birthdate: string; gender: string;
occupation: string; phone: string;
monthlyIncome: string; monthlyExpense: string;
savings: string; retirementAge: string; dependents: string;
}
interface Med {
hospitalDaily: string; hospitalReal: string;
surgeryLump: string; surgeryReal: string; medicalMisc: string;
}
interface Prot {
lifeInsurance: string; lifeInsurancePremium: string;
accidentDeath: string; accidentReal: string;
accidentHospitalDaily: string; accidentPremium: string;
criticalIllness: string; criticalPremium: string;
cancerLumpsum: string; cancerChemoDaily: string; cancerPremium: string;
ltcLumpsum: string; ltcMonthly: string; ltcPremium: string;
med: Med; medicalPremium: string;
}

/* ============================================================
HELPERS
============================================================ */
function calcAge(bd: string): number {
if (!bd) return 0;
var t = new Date(), b = new Date(bd);
var a = t.getFullYear() - b.getFullYear();
if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a–;
return Math.max(a, 0);
}
function nv(s: string): number { return parseFloat(s) || 0; }
function W(v: number): string {
var r = Math.round(v);
if (r >= 100000000) return (r / 100000000).toFixed(1) + ‘\u5104’;
if (r >= 10000)     return (r / 10000).toFixed(0) + ‘\u842c’;
return r.toLocaleString(‘zh-TW’);
}
function D(v: number): string { return ‘$’ + Math.round(v).toLocaleString(‘zh-TW’); }
function DW(v: number): string { return ‘$’ + W(Math.round(v)); }

var iC: Client = { name: ‘’, birthdate: ‘’, gender: ‘’, occupation: ‘’, phone: ‘’, monthlyIncome: ‘’, monthlyExpense: ‘’, savings: ‘’, retirementAge: ‘65’, dependents: ‘0’ };
var iP: Prot = { lifeInsurance: ‘’, lifeInsurancePremium: ‘’, accidentDeath: ‘’, accidentReal: ‘’, accidentHospitalDaily: ‘’, accidentPremium: ‘’, criticalIllness: ‘’, criticalPremium: ‘’, cancerLumpsum: ‘’, cancerChemoDaily: ‘’, cancerPremium: ‘’, ltcLumpsum: ‘’, ltcMonthly: ‘’, ltcPremium: ‘’, med: { hospitalDaily: ‘’, hospitalReal: ‘’, surgeryLump: ‘’, surgeryReal: ‘’, medicalMisc: ‘’ }, medicalPremium: ‘’ };

/* ============================================================
INPUT ATOMS
============================================================ */
function FI({ value, onChange, placeholder, pre, suf, hl }: {
value: string; onChange: (v: string) => void;
placeholder?: string; pre?: string; suf?: string; hl?: boolean;
}) {
var ph = placeholder || ‘0’;
var [f, sf] = useState(false);
return (
<div style={{ position: ‘relative’, display: ‘flex’, alignItems: ‘center’, minWidth: 0 }}>
{pre && <span style={{ position: ‘absolute’, left: 14, color: C.s400, fontWeight: 700, fontSize: 18, pointerEvents: ‘none’, zIndex: 1 }}>{pre}</span>}
<input type=“number” value={value} placeholder={ph}
onChange={function(e) { onChange(e.target.value); }}
onFocus={function() { sf(true); }} onBlur={function() { sf(false); }}
style={Object.assign({}, bigBase, {
paddingLeft: pre ? 34 : 16,
paddingRight: suf ? 54 : 16,
borderColor: hl ? C.ros : (f ? C.ind : C.s200),
boxShadow: hl ? ‘0 0 0 3px rgba(225,29,72,0.18)’ : f ? ‘0 0 0 4px rgba(79,70,229,0.18)’ : ‘none’,
})} />
{suf && <span style={{ position: ‘absolute’, right: 10, color: C.s400, fontWeight: 600, fontSize: 12, pointerEvents: ‘none’, whiteSpace: ‘nowrap’ }}>{suf}</span>}
</div>
);
}

function TI({ value, onChange, placeholder, type }: {
value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
var [f, sf] = useState(false);
return (
<input type={type || ‘text’} value={value} placeholder={placeholder || ‘’}
onChange={function(e) { onChange(e.target.value); }}
onFocus={function() { sf(true); }} onBlur={function() { sf(false); }}
style={Object.assign({}, txtBase, {
borderColor: f ? C.ind : C.s200,
boxShadow: f ? ‘0 0 0 4px rgba(79,70,229,0.18)’ : ‘none’,
})} />
);
}

function SI({ value, onChange, opts }: {
value: string; onChange: (v: string) => void;
opts: { value: string; label: string }[];
}) {
var [f, sf] = useState(false);
return (
<div style={{ position: ‘relative’, minWidth: 0, width: ‘100%’ }}>
<select value={value}
onChange={function(e) { onChange(e.target.value); }}
onFocus={function() { sf(true); }} onBlur={function() { sf(false); }}
style={Object.assign({}, txtBase, {
paddingRight: 38, cursor: ‘pointer’,
borderColor: f ? C.ind : C.s200,
boxShadow: f ? ‘0 0 0 4px rgba(79,70,229,0.18)’ : ‘none’,
})}>
{opts.map(function(o) { return <option key={o.value} value={o.value}>{o.label}</option>; })}
</select>
<span style={{ position: ‘absolute’, right: 12, top: ‘50%’, transform: ‘translateY(-50%)’, pointerEvents: ‘none’, color: C.s400, fontSize: 16 }}>▾</span>
</div>
);
}

function Fld({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
return <div style={{ minWidth: 0, width: ‘100%’ }}><label style={lblSt}>{label}</label>{children}</div>;
}

function PC({ gradient, icon, title, sub, children }: {
gradient: string; icon: string; title: string; sub: string; children: React.ReactNode;
}) {
return (
<div style={Object.assign({}, cardSt, { transition: ‘box-shadow .25s’ })}>
<div style={{ background: gradient, padding: ‘16px 20px’, display: ‘flex’, alignItems: ‘center’, gap: 12 }}>
<div style={{ background: ‘rgba(255,255,255,0.2)’, borderRadius: 12, width: 44, height: 44, flexShrink: 0, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, fontSize: 20 }}>{icon}</div>
<div>
<div style={{ color: C.wht, fontWeight: 900, fontSize: 18 }}>{title}</div>
<div style={{ color: ‘rgba(255,255,255,0.75)’, fontSize: 12, fontWeight: 500, marginTop: 2 }}>{sub}</div>
</div>
</div>
<div style={{ padding: 20, display: ‘flex’, flexDirection: ‘column’, gap: 16 }}>{children}</div>
</div>
);
}

/* ============================================================
REPORT
============================================================ */
function Report({ client, prot, onBack }: { client: Client; prot: Prot; onBack: () => void }) {
var age     = calcAge(client.birthdate);
var income  = nv(client.monthlyIncome);
var expense = nv(client.monthlyExpense);
var savings = nv(client.savings);
var retAge  = nv(client.retirementAge) || 65;
var yToRet  = Math.max(retAge - age, 0);
var INFL = 0.025, GROW = 0.05;

// Dynamic retirement years: 85 - retAge
var retYears   = Math.max(85 - retAge, 0);
// Inflation-adjusted monthly expense at retirement
var retMonthExp = expense * Math.pow(1 + INFL, yToRet);
// Total retirement target: retMonthExp x 12 x retYears
var totalTarget = retMonthExp * 12 * retYears;
// FV of current savings
var savingsFV   = savings * Math.pow(1 + GROW, yToRet);
// Gap
var retGap      = Math.max(0, totalTarget - savingsFV);
// Annual / monthly needed (simple linear)
var annualNeed  = yToRet > 0 ? totalTarget / yToRet : totalTarget;
var monthlyNeed = annualNeed / 12;

var totalPremium = nv(prot.lifeInsurancePremium) + nv(prot.accidentPremium) + nv(prot.criticalPremium) + nv(prot.cancerPremium) + nv(prot.ltcPremium) + nv(prot.medicalPremium);
var realMonthlySave = income - expense - totalPremium / 12;

// Cashflow data
var cashflow = useMemo(function() {
var asset = savings;
var rows: { age: number; asset: number; spend: number }[] = [];
for (var yr = age; yr <= 90; yr++) {
var inflExp = expense * Math.pow(1 + INFL, yr - age) * 12;
rows.push({ age: yr, asset: Math.round(Math.max(asset, 0)), spend: Math.round(inflExp) });
if (yr < retAge) {
asset = asset * (1 + GROW) + Math.max(realMonthlySave, 0) * 12;
} else {
asset = asset * (1 + GROW * 0.4) - inflExp;
}
}
return rows;
}, [age, savings, realMonthlySave, retAge, expense]);

var depleteIdx = cashflow.findIndex(function(d, i) { return i > 0 && cashflow[i - 1].asset > 0 && d.asset === 0; });
var depleteAge = depleteIdx > 0 ? cashflow[depleteIdx].age : null;
var depleteY   = depleteIdx > 0 ? cashflow[depleteIdx - 1].asset : 0;

// Four gap rules
var medDailyHave = nv(prot.med.hospitalDaily) + nv(prot.med.hospitalReal);
var medMiscHave  = nv(prot.med.medicalMisc) * 10000;
var accRealHave  = nv(prot.accidentReal) * 10000;
var ciHave       = nv(prot.criticalIllness) * 10000;
var gaps = [
{ icon: ‘\ud83c\udfe5’, label: ‘\u91ab\u7642\u4f4f\u9662\u65e5\u984d’, std: 5000,    stdL: ‘5,000 \u5143/\u65e5’, have: medDailyHave, gap: Math.max(0, 5000 - medDailyHave),    haveStr: medDailyHave.toLocaleString(‘zh-TW’) + ’ \u5143/\u65e5’, gapStr: ‘-’ + Math.max(0, 5000 - medDailyHave).toLocaleString(‘zh-TW’) + ’ \u5143/\u65e5’, note: ‘\u5b9a\u984d\uff0b\u5be6\u652f\u5408\u8a08’ },
{ icon: ‘\ud83d\udc8a’, label: ‘\u91ab\u7642\u96dc\u8cbb’,             std: 300000,  stdL: ‘30 \u842c’,           have: medMiscHave,  gap: Math.max(0, 300000 - medMiscHave),  haveStr: W(medMiscHave) + ’ \u5143’,              gapStr: ‘-’ + W(Math.max(0, 300000 - medMiscHave)) + ’ \u5143’,              note: ‘\u65b0\u5f0f\u7642\u6cd5\u81ea\u8cbb\u4e0a\u9650’ },
{ icon: ‘\ud83d\ude91’, label: ‘\u610f\u5916\u5be6\u652f’,             std: 100000,  stdL: ‘10 \u842c’,           have: accRealHave,  gap: Math.max(0, 100000 - accRealHave),  haveStr: W(accRealHave) + ’ \u5143’,              gapStr: ‘-’ + W(Math.max(0, 100000 - accRealHave)) + ’ \u5143’,              note: ‘\u610f\u5916\u50b7\u5bb3\u91ab\u7642\u8cbb\u7528’ },
{ icon: ‘\u26a1’,       label: ‘\u91cd\u5927\u50b7\u75c5’,             std: 2000000, stdL: ‘200 \u842c’,          have: ciHave,       gap: Math.max(0, 2000000 - ciHave),      haveStr: W(ciHave) + ’ \u5143’,                  gapStr: ‘-’ + W(Math.max(0, 2000000 - ciHave)) + ’ \u5143’,                  note: ‘22 \u985e\u91cd\u75c7\u78ba\u8a3a\u5373\u7406\u8de3’ },
];

// Six protection groups (no premium rows)
var groups = [
{ title: ‘\u58fd\u9669\u4fdd\u969c’, color: ‘#6366f1’, bg: ‘rgba(99,102,241,0.12)’, icon: ‘\ud83d\udee1\ufe0f’, items: [
{ k: ‘\u58fd\u9669\u8eab\u6545\u4fdd\u984d’, v: nv(prot.lifeInsurance) > 0 ? W(nv(prot.lifeInsurance) * 10000) + ’ \u5143’ : ‘\u2014’ },
]},
{ title: ‘\u610f\u5916\u4fdd\u969c’, color: ‘#8b5cf6’, bg: ‘rgba(139,92,246,0.12)’, icon: ‘\u26a1’, items: [
{ k: ‘\u610f\u5916\u8eab\u6545’, v: nv(prot.accidentDeath) > 0 ? W(nv(prot.accidentDeath) * 10000) + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u610f\u5916\u5be6\u652f’, v: nv(prot.accidentReal) > 0 ? W(nv(prot.accidentReal) * 10000) + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u610f\u5916\u4f4f\u9662\u65e5\u984d’, v: nv(prot.accidentHospitalDaily) > 0 ? nv(prot.accidentHospitalDaily).toLocaleString(‘zh-TW’) + ’ \u5143/\u65e5’ : ‘\u2014’ },
]},
{ title: ‘\u91ab\u7642\u4fdd\u969c’, color: ‘#2563eb’, bg: ‘rgba(37,99,235,0.12)’, icon: ‘\ud83c\udfe5’, items: [
{ k: ‘\u4f4f\u9662\u5b9a\u984d’, v: nv(prot.med.hospitalDaily) > 0 ? nv(prot.med.hospitalDaily).toLocaleString(‘zh-TW’) + ’ \u5143/\u65e5’ : ‘\u2014’ },
{ k: ‘\u4f4f\u9662\u5be6\u652f’, v: nv(prot.med.hospitalReal) > 0  ? nv(prot.med.hospitalReal).toLocaleString(‘zh-TW’)  + ’ \u5143/\u65e5’ : ‘\u2014’ },
{ k: ‘\u624b\u8853\u5b9a\u984d’, v: nv(prot.med.surgeryLump) > 0   ? W(nv(prot.med.surgeryLump) * 10000)   + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u624b\u8853\u5be6\u652f’, v: nv(prot.med.surgeryReal) > 0   ? W(nv(prot.med.surgeryReal) * 10000)   + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u91ab\u7642\u96dc\u8cbb’, v: nv(prot.med.medicalMisc) > 0   ? W(nv(prot.med.medicalMisc) * 10000)   + ’ \u5143’ : ‘\u2014’ },
]},
{ title: ‘\u91cd\u5927\u75be\u75c5’, color: ‘#e11d48’, bg: ‘rgba(225,29,72,0.12)’, icon: ‘\u26a0\ufe0f’, items: [
{ k: ‘\u91cd\u5927\u50b7\u75c5\u4e00\u6b21\u91d1’, v: nv(prot.criticalIllness) > 0 ? W(nv(prot.criticalIllness) * 10000) + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u764c\u75c7\u4e00\u6b21\u91d1’,             v: nv(prot.cancerLumpsum) > 0   ? W(nv(prot.cancerLumpsum) * 10000)   + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u5316/\u653e\u7642\u88dc\u52a9\u91d1’,      v: nv(prot.cancerChemoDaily) > 0 ? nv(prot.cancerChemoDaily).toLocaleString(‘zh-TW’) + ’ \u5143/\u65e5’ : ‘\u2014’ },
]},
{ title: ‘\u9577\u7167\u4fdd\u969c’, color: ‘#059669’, bg: ‘rgba(5,150,105,0.12)’, icon: ‘\ud83c\udfc6’, items: [
{ k: ‘\u9577\u7167\u4e00\u6b21\u91d1’, v: nv(prot.ltcLumpsum) > 0 ? W(nv(prot.ltcLumpsum) * 10000) + ’ \u5143’ : ‘\u2014’ },
{ k: ‘\u6708\u627f\u52a9\u91d1’,       v: nv(prot.ltcMonthly) > 0 ? nv(prot.ltcMonthly).toLocaleString(‘zh-TW’) + ’ \u5143/\u6708’ : ‘\u2014’ },
]},
{ title: ‘\u990a\u8001\u4fdd\u969c’, color: ‘#d97706’, bg: ‘rgba(217,119,6,0.12)’, icon: ‘\ud83d\udcb0’, items: [
{ k: ‘\u5e74\u5ea6\u7e3d\u4fdd\u8cbb’,   v: totalPremium > 0 ? D(totalPremium) : ‘\u2014’ },
{ k: ‘\u6708\u5747\u4fdd\u8cbb’,         v: totalPremium > 0 ? D(totalPremium / 12) : ‘\u2014’ },
{ k: ‘\u4fdd\u8cbb\u5360\u6708\u6536\u5165’, v: income > 0 && totalPremium > 0 ? ((totalPremium / 12 / income) * 100).toFixed(1) + ‘%’ : ‘\u2014’ },
]},
];

function Tip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: number }) {
if (!active || !payload || !payload.length) return null;
return (
<div style={{ background: C.s900, border: ’1px solid ’ + C.s700, borderRadius: 10, padding: ‘10px 14px’, minWidth: 160 }}>
<div style={{ color: C.s400, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label} \u6b72</div>
{payload.map(function(p, i) {
return (
<div key={i} style={{ display: ‘flex’, justifyContent: ‘space-between’, gap: 12, marginBottom: 3 }}>
<span style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>{p.name}</span>
<span style={{ color: ‘#e2e8f0’, fontSize: 12, fontWeight: 700 }}>{DW(p.value)}</span>
</div>
);
})}
</div>
);
}

return (
<div style={{ minHeight: ‘100vh’, background: C.s900 }}>
{/* Header */}
<div style={{ background: ‘linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)’, padding: ‘20px 20px 18px’, position: ‘relative’, overflow: ‘hidden’ }}>
<div style={{ position: ‘absolute’, inset: 0, opacity: 0.05, backgroundImage: ‘repeating-linear-gradient(45deg,transparent,transparent 40px,#fff 40px,#fff 41px)’ }} />
<button onClick={onBack} style={{ display: ‘flex’, alignItems: ‘center’, gap: 6, color: ‘#c7d2fe’, background: ‘none’, border: ‘none’, fontSize: 15, fontWeight: 700, cursor: ‘pointer’, marginBottom: 14 }}>
← \u8fd4\u56de
</button>
<div style={{ textAlign: ‘center’, position: ‘relative’, zIndex: 1 }}>
<div style={{ color: ‘#a5b4fc’, fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 6 }}>FINANCIAL ANALYSIS REPORT</div>
<h1 className=“rpt-h1” style={{ color: C.wht, fontWeight: 900, lineHeight: 1.4 }}>
\u300c{client.name || ‘\u5ba2\u6236’}\u300d{client.gender === ‘male’ ? ‘\u5148\u751f’ : ‘\u5c0f\u59d0’}<br />
\u5c08\u5c6c\u8ca1\u52d9\u4fdd\u969c\u5206\u6790\u5831\u544a
</h1>
<p style={{ color: ‘#a5b4fc’, marginTop: 8, fontSize: 12 }}>
{new Date().toLocaleDateString(‘zh-TW’)} | {age} \u6b72 | \u9000\u4f11 {retAge} \u6b72
</p>
</div>
</div>

```
  <div style={{ maxWidth: 1100, margin: '0 auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

    {/* BLOCK 1: Retirement gap */}
    <div style={{ background: C.s800, borderRadius: 20, border: '1px solid ' + C.s700 }}>
      <div className="sp">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'rgba(225,29,72,0.2)', borderRadius: 12, width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&#128293;</div>
          <div>
            <div style={{ color: C.wht, fontWeight: 900, fontSize: 20 }}>\u9000\u4f11\u8ca1\u52d9\u7f3a\u53e3\u8a3a\u65b7</div>
            <div style={{ color: C.s400, fontSize: 12, marginTop: 2 }}>\u901a\u81a8 2.5% \u00b7 \u9000\u4f11\u5f8c {retYears} \u5e74\u9700\u6c42\uff0885 - {retAge} \u6b72\uff09</div>
          </div>
        </div>

        {/* 3 step cards */}
        <div className="gfm" style={{ marginBottom: 16 }}>
          <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 14, padding: 16 }}>
            <div style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>STEP 1&#65372;\u73fe\u5728\u6708\u652f\u51fa</div>
            <div className="num-xl" style={{ color: C.wht, fontWeight: 900 }}>{D(expense)}</div>
            <div style={{ color: C.s500, fontSize: 11, marginTop: 6 }}>\u76ee\u524d\u6bcf\u6708\u56fa\u5b9a\u652f\u51fa\u57fa\u6e96</div>
          </div>
          <div style={{ background: 'rgba(225,29,72,0.15)', border: '2px solid rgba(225,29,72,0.45)', borderRadius: 14, padding: 16 }}>
            <div style={{ color: '#fca5a5', fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>STEP 2&#65372;\u9000\u4f11\u6642\u7b49\u5024\u6708\u652f\u51fa</div>
            <div className="num-xl" style={{ color: '#fb7185', fontWeight: 900 }}>{D(retMonthExp)}</div>
            <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 8, padding: '6px 10px', marginTop: 8 }}>
              <div style={{ color: '#fca5a5', fontSize: 11 }}>{D(expense)} x (1+2.5%)^{yToRet}\u5e74</div>
            </div>
            <div style={{ color: '#fca5a5', fontSize: 11, marginTop: 6 }}>
              \u8cfc\u8cb7\u529b\u7e2e\u6c34 {((retMonthExp / Math.max(expense, 1) - 1) * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ background: 'rgba(217,119,6,0.15)', border: '2px solid rgba(217,119,6,0.4)', borderRadius: 14, padding: 16 }}>
            <div style={{ color: '#fcd34d', fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>STEP 3&#65372;\u6240\u9700\u9000\u4f11\u7e3d\u8cc7\u7522</div>
            <div className="num-xl" style={{ color: '#fbbf24', fontWeight: 900 }}>{DW(totalTarget)}</div>
            <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 8, padding: '6px 10px', marginTop: 8 }}>
              <div style={{ color: '#fcd34d', fontSize: 11 }}>{D(retMonthExp)} x 12\u6708 x {retYears}\u5e74</div>
            </div>
            <div style={{ color: '#fcd34d', fontSize: 11, marginTop: 6 }}>\u9000\u4f11\u5f8c {retYears} \u5e74\u751f\u6d3b\u8cbb</div>
          </div>
        </div>

        {/* Action plan */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid ' + C.s700, borderRadius: 14, padding: 16 }}>
          <div style={{ color: '#e2e8f0', fontWeight: 900, fontSize: 15, marginBottom: 14, textAlign: 'center' }}>
            &#128161; \u70ba\u4e86\u9054\u6210\u76ee\u6a19\uff0c\u60a8\u73fe\u5728\u9700\u8981\u505a\u7684\u662f...
          </div>
          <div className="gac">
            <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>\u73fe\u6709\u5132\u84c4\u9000\u4f11\u7d42\u5024</div>
              <div className="num-xl" style={{ color: '#34d399', fontWeight: 900 }}>{DW(savingsFV)}</div>
              <div style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 7, padding: '5px 8px', marginTop: 7 }}>
                <div style={{ color: '#6ee7b7', fontSize: 11 }}>{D(savings)} x (1+5%)^{yToRet}\u5e74</div>
              </div>
            </div>
            <div style={{ background: retGap > 0 ? 'rgba(225,29,72,0.12)' : 'rgba(52,211,153,0.1)', border: '2px solid ' + (retGap > 0 ? 'rgba(225,29,72,0.38)' : 'rgba(52,211,153,0.3)'), borderRadius: 12, padding: 14 }}>
              <div style={{ color: retGap > 0 ? '#fca5a5' : '#6ee7b7', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>\u6bcf\u5e74\u9700\u5132\u84c4\u91d1\u984d</div>
              <div className="num-xl" style={{ color: retGap > 0 ? '#fb7185' : '#34d399', fontWeight: 900 }}>
                {retGap > 0 ? DW(annualNeed) : '\u2705 \u5df2\u8db3\u5099'}
              </div>
              {retGap > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 7, padding: '5px 8px', marginTop: 7 }}>
                  <div style={{ color: '#fca5a5', fontSize: 11 }}>{DW(totalTarget)} \u00f7 {yToRet}\u5e74</div>
                </div>
              )}
            </div>
            <div style={{ background: retGap > 0 ? 'rgba(225,29,72,0.12)' : 'rgba(52,211,153,0.1)', border: '2px solid ' + (retGap > 0 ? 'rgba(225,29,72,0.38)' : 'rgba(52,211,153,0.3)'), borderRadius: 12, padding: 14 }}>
              <div style={{ color: retGap > 0 ? '#fca5a5' : '#6ee7b7', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>\u6bcf\u6708\u9700\u5132\u84c4\u91d1\u984d</div>
              <div className="num-xxl" style={{ color: retGap > 0 ? '#fb7185' : '#34d399', fontWeight: 900 }}>
                {retGap > 0 ? D(monthlyNeed) : '\u2705 \u5df2\u8db3\u5099'}
              </div>
              {retGap > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 7, padding: '5px 8px', marginTop: 7 }}>
                  <div style={{ color: '#fca5a5', fontSize: 11 }}>{DW(annualNeed)} \u00f7 12\u500b\u6708</div>
                </div>
              )}
              <div style={{ color: C.s500, fontSize: 11, marginTop: 6 }}>
                {retGap > 0 ? '\u73fe\u6708\u5132 ' + D(realMonthlySave) + '\uff0c\u7f3a ' + D(Math.max(0, monthlyNeed - realMonthlySave)) + '/\u6708' : '\u7e7c\u7e8c\u4fdd\u6301\uff01'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* BLOCK 2: Cashflow chart */}
    <div style={{ background: C.s800, borderRadius: 20, border: '1px solid ' + C.s700 }}>
      <div className="sp">
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: C.wht, fontWeight: 900, fontSize: 19 }}>&#128201; \u672a\u4f86\u73fe\u91d1\u6d41\u58d3\u529b\u66f2\u7dda</div>
          <div style={{ color: C.s400, fontSize: 12, marginTop: 3 }}>
            \u6708\u5132\u84c4 {D(Math.max(realMonthlySave, 0))} x 5% \u8907\u5229\uff0c\u9000\u4f11\u5f8c\u4f9d\u901a\u81a8\u652f\u51fa\u6d88\u8017
          </div>
        </div>
        {depleteAge && (
          <div style={{ background: 'rgba(225,29,72,0.14)', border: '1px solid rgba(225,29,72,0.4)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>&#128680;</span>
            <div style={{ color: '#fca5a5', fontWeight: 700, fontSize: 13 }}>
              \u8cc7\u7522\u9810\u8a08\u65bc <span style={{ color: '#fb7185', fontSize: 17, fontWeight: 900 }}>{depleteAge} \u6b72</span> \u67af\u7aed \u2014 \u8ddd\u58fd\u547d 90 \u6b72\u9084\u6709 {90 - depleteAge} \u5e74\u7f3a\u53e3\uff01
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
          {[{ c: '#6366f1', l: '\u8cc7\u7522\u898f\u6a21' }, { c: '#fb7185', l: '\u5e74\u5ea6\u652f\u51fa', d: true }].map(function(x) {
            return (
              <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 3, background: x.d ? 'repeating-linear-gradient(90deg,' + x.c + ' 0,' + x.c + ' 4px,transparent 4px,transparent 8px)' : x.c, borderRadius: 2 }} />
                <span style={{ color: C.s400, fontSize: 12 }}>{x.l}</span>
              </div>
            );
          })}
        </div>
        <div className="chart-h">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashflow} margin={{ top: 8, right: 4, left: 4, bottom: 4 }}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.s700} />
              <XAxis dataKey="age" stroke={C.s600} tick={{ fill: C.s400, fontSize: 11 }} />
              <YAxis stroke={C.s600} tick={{ fill: C.s400, fontSize: 10 }} tickFormatter={DW} width={62} />
              <Tooltip content={<Tip />} />
              <ReferenceLine x={retAge} stroke="#fbbf24" strokeDasharray="4 3"
                label={{ value: '\u9000\u4f11', position: 'insideTopRight', fill: '#fbbf24', fontSize: 11 }} />
              {depleteAge && depleteY > 0 && (
                <ReferenceDot x={depleteAge - 1} y={depleteY} r={8} fill="#e11d48" stroke="#fff" strokeWidth={2}
                  label={{ value: depleteAge + '\u6b72', position: 'top', fill: '#fb7185', fontSize: 11, fontWeight: 700 }} />
              )}
              <Area type="monotone" dataKey="asset" name="\u8cc7\u7522\u898f\u6a21" stroke="#6366f1" strokeWidth={3} fill="url(#ag)" />
              <Area type="monotone" dataKey="spend" name="\u5e74\u5ea6\u652f\u51fa" stroke="#fb7185" strokeWidth={2} strokeDasharray="4 3" fill="url(#eg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* BLOCK 3: Gap wall */}
    <div style={{ background: C.s800, borderRadius: 20, border: '1px solid ' + C.s700 }}>
      <div className="sp">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'rgba(225,29,72,0.2)', borderRadius: 12, width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&#9876;&#65039;</div>
          <div>
            <div style={{ color: C.wht, fontWeight: 900, fontSize: 20 }}>\u98a8\u96aa\u9632\u79a6\u7f3a\u53e3\u7246</div>
            <div style={{ color: C.s400, fontSize: 12, marginTop: 2 }}>\u56db\u5927\u4fdd\u969c\u91d1\u5f8b\u5b24\u683c\u8a3a\u65b7</div>
          </div>
        </div>
        <div className="ggg">
          {gaps.map(function(item) {
            var pct = Math.min((item.have / item.std) * 100, 100);
            var ok = item.gap === 0;
            return (
              <div key={item.label} style={{
                borderRadius: 14, padding: 18,
                border: ok ? '1px solid rgba(52,211,153,0.3)' : '2px solid rgba(251,113,133,0.5)',
                background: ok ? 'rgba(52,211,153,0.07)' : 'rgba(225,29,72,0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ color: C.wht, fontWeight: 900, fontSize: 14 }}>{item.label}</span>
                </div>
                <div style={{ color: C.s500, fontSize: 11, marginBottom: 3 }}>
                  \u6a19\u7aff: <span style={{ color: '#fbbf24', fontWeight: 800 }}>{item.stdL}</span>
                </div>
                <div style={{ color: C.s500, fontSize: 11, marginBottom: 10 }}>
                  \u73fe\u6709: <span style={{ color: ok ? '#34d399' : '#cbd5e1', fontWeight: 700 }}>{item.have > 0 ? item.haveStr : '\u672a\u6295\u4fdd'}</span>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: pct + '%', background: ok ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#e11d48,#fb7185)', borderRadius: 999 }} />
                </div>
                <div style={{ fontWeight: 900, fontSize: ok ? 17 : 24, color: ok ? '#34d399' : '#fb7185', lineHeight: 1.1 }}>
                  {ok ? '\u2705 \u5df2\u8db3\u5099' : item.gapStr}
                </div>
                {!ok && <div style={{ color: '#fca5a5', fontSize: 11, marginTop: 3 }}>\u5c1a\u7f3a {((item.gap / item.std) * 100).toFixed(0)}%</div>}
                <div style={{ color: C.s600, fontSize: 10, marginTop: 6 }}>{item.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* BLOCK 4: Protection summary */}
    <div style={{ background: C.s800, borderRadius: 20, border: '1px solid ' + C.s700 }}>
      <div className="sp">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: 12, width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&#128203;</div>
            <div>
              <div style={{ color: C.wht, fontWeight: 900, fontSize: 19 }}>\u4fdd\u969c\u9805\u76ee\u5f59\u6574\u7e3d\u89bd</div>
              <div style={{ color: C.s400, fontSize: 12, marginTop: 2 }}>\u516d\u5927\u4fdd\u969c\u5206\u5340</div>
            </div>
          </div>
          <div style={{ background: 'rgba(217,119,6,0.2)', border: '1px solid rgba(217,119,6,0.4)', borderRadius: 12, padding: '8px 14px' }}>
            <div style={{ color: '#fcd34d', fontSize: 11, fontWeight: 600 }}>\u5e74\u5ea6\u7e3d\u4fdd\u8cbb</div>
            <div style={{ color: '#fbbf24', fontWeight: 900, fontSize: 20 }}>{D(totalPremium)}</div>
          </div>
        </div>
        <div className="g6">
          {groups.map(function(grp) {
            return (
              <div key={grp.title} style={{ background: grp.bg, border: '1px solid ' + grp.color + '40', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ background: grp.color + '22', borderBottom: '1px solid ' + grp.color + '40', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{grp.icon}</span>
                  <span style={{ color: grp.color, fontWeight: 900, fontSize: 15 }}>{grp.title}</span>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {grp.items.map(function(item) {
                    return (
                      <div key={item.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
                        <span style={{ color: C.s400, fontSize: 12, fontWeight: 600, flexShrink: 0, marginRight: 6 }}>{item.k}</span>
                        <span style={{ color: item.v === '\u2014' ? C.s600 : C.wht, fontWeight: item.v === '\u2014' ? 400 : 800, fontSize: item.v === '\u2014' ? 12 : 14, textAlign: 'right' }}>{item.v}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Disclaimer */}
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid ' + C.s700, borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
      <p style={{ color: C.s600, fontSize: 11, lineHeight: 1.9 }}>
        \u672c\u5831\u544a\u50c5\u4f9b\u53c3\u8003\uff0c\u5be6\u969b\u4fdd\u969c\u5167\u5bb9\u4ee5\u5404\u4fdd\u96aa\u5951\u7d04\u689d\u6b3e\u70ba\u6e96\u3002<br />
        \u9000\u4f11\u7f3a\u53e3\u8a66\u7b97\u63a1\u901a\u81a8\u5047\u8a2d 2.5%\u3001\u8cc7\u7522\u6210\u9577\u7387 5%\uff0c\u4e0d\u4ee3\u8868\u5be6\u969b\u6295\u8cc7\u7e3e\u6548\u4fdd\u8b49\u3002
      </p>
    </div>
  </div>
</div>
```

);
}

/* ============================================================
MAIN APP
============================================================ */
export default function App() {
useGlobalStyles();
var [client, setClient] = useState<Client>(iC);
var [prot, setProt]     = useState<Prot>(iP);
var [showRep, setShowRep] = useState(false);

function sc(k: keyof Client) { return function(v: string) { setClient(function(p) { return Object.assign({}, p, { [k]: v }); }); }; }
function sp(k: keyof Prot)   { return function(v: string) { setProt(function(p)   { return Object.assign({}, p, { [k]: v }); }); }; }
function sm(k: keyof Med)    { return function(v: string) { setProt(function(p)   { return Object.assign({}, p, { med: Object.assign({}, p.med, { [k]: v }) }); }); }; }

var age          = calcAge(client.birthdate);
var income       = nv(client.monthlyIncome);
var expense      = nv(client.monthlyExpense);
var monthlySave  = income - expense;
var savingsRate  = income > 0 ? (monthlySave / income) * 100 : 0;
var totalPremium = nv(prot.lifeInsurancePremium) + nv(prot.accidentPremium) + nv(prot.criticalPremium) + nv(prot.cancerPremium) + nv(prot.ltcPremium) + nv(prot.medicalPremium);

if (showRep) return <Report client={client} prot={prot} onBack={function() { setShowRep(false); }} />;

var pcards = [
{
gradient: ‘linear-gradient(135deg,#1d4ed8,#3730a3)’, icon: ‘\ud83c\udfe5’,
title: ‘\u91ab\u7642\u9669’, sub: ‘\u4f4f\u9662\u30fb\u624b\u8853\u30fb\u96dc\u8cbb’,
content: (
<>
<Fld label="\u4f4f\u9662\u5b9a\u984d\uff08\u5143/\u65e5\uff09"><FI value={prot.med.hospitalDaily} onChange={sm(‘hospitalDaily’)} suf=”\u5143/\u65e5” /></Fld>
<Fld label="\u4f4f\u9662\u5be6\u652f\uff08\u5143/\u65e5\uff09"><FI value={prot.med.hospitalReal}  onChange={sm(‘hospitalReal’)}  suf=”\u5143/\u65e5” /></Fld>
<Fld label="\u624b\u8853\u5b9a\u984d\uff08\u842c\uff09">      <FI value={prot.med.surgeryLump}   onChange={sm(‘surgeryLump’)}   suf=”\u842c” /></Fld>
<Fld label="\u624b\u8853\u5be6\u652f\uff08\u842c\uff09">      <FI value={prot.med.surgeryReal}   onChange={sm(‘surgeryReal’)}   suf=”\u842c” /></Fld>
<Fld label={<span style={{ display: ‘flex’, alignItems: ‘center’, gap: 5 }}><span style={{ color: C.ros }}>●</span>\u91ab\u7642\u96dc\u8cbb\uff08\u842c\uff09<span style={{ color: C.ros, fontSize: 12, fontWeight: 700 }}>\u95dc\u9375</span></span>}>
<FI value={prot.med.medicalMisc} onChange={sm(‘medicalMisc’)} suf=”\u842c” hl={true} />
</Fld>
<Fld label="\u5e74\u5ea6\u4fdd\u8cbb\uff08\u5143\uff09"><FI value={prot.medicalPremium} onChange={sp(‘medicalPremium’)} pre=”$” /></Fld>
</>
),
},
{
gradient: ‘linear-gradient(135deg,#6d28d9,#4c1d95)’, icon: ‘\u2764\ufe0f’,
title: ‘\u58fd\u9669 & \u610f\u5916\u9669’, sub: ‘\u8eab\u6545\u30fb\u610f\u5916\u30fb\u65e5\u984d’,
content: (
<>
<Fld label="\u58fd\u9669\u8eab\u6545\u4fdd\u984d\uff08\u842c\uff09">    <FI value={prot.lifeInsurance}         onChange={sp(‘lifeInsurance’)}         suf=”\u842c” /></Fld>
<Fld label="\u58fd\u9669\u5e74\u5ea6\u4fdd\u8cbb\uff08\u5143\uff09">    <FI value={prot.lifeInsurancePremium}  onChange={sp(‘lifeInsurancePremium’)}  pre=”$” /></Fld>
<Fld label="\u610f\u5916\u8eab\u6545\uff08\u842c\uff09">                <FI value={prot.accidentDeath}         onChange={sp(‘accidentDeath’)}         suf=”\u842c” /></Fld>
<Fld label="\u610f\u5916\u5be6\u652f\uff08\u842c\uff09">                <FI value={prot.accidentReal}          onChange={sp(‘accidentReal’)}          suf=”\u842c” /></Fld>
<Fld label="\u610f\u5916\u4f4f\u9662\u65e5\u984d\uff08\u5143/\u65e5\uff09"><FI value={prot.accidentHospitalDaily} onChange={sp(‘accidentHospitalDaily’)} suf=”\u5143/\u65e5” /></Fld>
<Fld label="\u610f\u5916\u9669\u5e74\u5ea6\u4fdd\u8cbb\uff08\u5143\uff09"><FI value={prot.accidentPremium}       onChange={sp(‘accidentPremium’)}       pre=”$” /></Fld>
</>
),
},
{
gradient: ‘linear-gradient(135deg,#be123c,#9f1239)’, icon: ‘\u26a1’,
title: ‘\u91cd\u5927\u50b7\u75c5\u9669’, sub: ‘\u4e00\u6b21\u7d66\u4ed8\u4fdd\u969c’,
content: (
<>
<Fld label="\u91cd\u5927\u50b7\u75c5\u4e00\u6b21\u91d1\uff08\u842c\uff09"><FI value={prot.criticalIllness} onChange={sp(‘criticalIllness’)} suf=”\u842c” /></Fld>
<Fld label="\u5e74\u5ea6\u4fdd\u8cbb\uff08\u5143\uff09">                 <FI value={prot.criticalPremium} onChange={sp(‘criticalPremium’)} pre=”$” /></Fld>
<div style={{ background: ‘rgba(225,29,72,0.08)’, border: ‘1px solid rgba(225,29,72,0.22)’, borderRadius: 10, padding: 12 }}>
<div style={{ display: ‘flex’, gap: 8 }}>
<span>⚠️</span>
<p style={{ color: ‘#9f1239’, fontSize: 12, fontWeight: 600, lineHeight: 1.6 }}>22 \u985e\u91cd\u75c7\u78ba\u8a3a\u5373\u7406\u8de3\uff0c\u5efa\u8b70\u5099\u8db3 200 \u842c\u4ee5\u4e0a\u3002</p>
</div>
</div>
</>
),
},
{
gradient: ‘linear-gradient(135deg,#c2410c,#9a3412)’, icon: ‘\u2b50’,
title: ‘\u764c\u75c7\u9669’, sub: ‘\u4e00\u6b21\u91d1\u30fb\u5316/\u653e\u7642’,
content: (
<>
<Fld label="\u764c\u75c7\u4e00\u6b21\u91d1\uff08\u842c\uff09">        <FI value={prot.cancerLumpsum}    onChange={sp(‘cancerLumpsum’)}    suf=”\u842c” /></Fld>
<Fld label="\u5316/\u653e\u7642\u88dc\u52a9\u91d1\uff08\u5143/\u65e5\uff09"><FI value={prot.cancerChemoDaily}  onChange={sp(‘cancerChemoDaily’)}  suf=”\u5143/\u65e5” /></Fld>
<Fld label="\u5e74\u5ea6\u4fdd\u8cbb\uff08\u5143\uff09">              <FI value={prot.cancerPremium}    onChange={sp(‘cancerPremium’)}    pre=”$” /></Fld>
</>
),
},
{
gradient: ‘linear-gradient(135deg,#047857,#065f46)’, icon: ‘\ud83c\udfc6’,
title: ‘\u9577\u7167\u9669’, sub: ‘\u4e00\u6b21\u91d1\u30fb\u6708\u627f\u52a9\u91d1’,
content: (
<>
<Fld label="\u9577\u7167\u4e00\u6b21\u91d1\uff08\u842c\uff09">  <FI value={prot.ltcLumpsum} onChange={sp(‘ltcLumpsum’)} suf=”\u842c” /></Fld>
<Fld label="\u6708\u627f\u52a9\u91d1\uff08\u5143/\u6708\uff09"><FI value={prot.ltcMonthly} onChange={sp(‘ltcMonthly’)} suf=”\u5143/\u6708” /></Fld>
<Fld label="\u5e74\u5ea6\u4fdd\u8cbb\uff08\u5143\uff09">       <FI value={prot.ltcPremium} onChange={sp(‘ltcPremium’)} pre=”$” /></Fld>
</>
),
},
{
gradient: ‘linear-gradient(135deg,#b45309,#92400e)’, icon: ‘\ud83d\udcb0’,
title: ‘\u4fdd\u969c\u5f59\u7e3d’, sub: ‘\u5373\u6642\u6210\u672c\u8a08\u7b97’,
content: (
<div style={{ display: ‘flex’, flexDirection: ‘column’, gap: 12 }}>
{[
{ label: ‘\u58fd\u9669 & \u610f\u5916’, val: nv(prot.lifeInsurancePremium) + nv(prot.accidentPremium), col: ‘#a78bfa’ },
{ label: ‘\u91ab\u7642\u9669’,           val: nv(prot.medicalPremium),  col: ‘#60a5fa’ },
{ label: ‘\u91cd\u5927\u50b7\u75c5’,     val: nv(prot.criticalPremium), col: ‘#fb7185’ },
{ label: ‘\u764c\u75c7\u9669’,           val: nv(prot.cancerPremium),   col: ‘#fb923c’ },
{ label: ‘\u9577\u7167\u9669’,           val: nv(prot.ltcPremium),      col: ‘#34d399’ },
].map(function(r) {
return (
<div key={r.label} style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’ }}>
<span style={{ color: C.s500, fontWeight: 600, fontSize: 14 }}>{r.label}</span>
<span style={{ color: r.col, fontWeight: 900, fontSize: 17 }}>{r.val > 0 ? D(r.val) : ‘\u2014’}</span>
</div>
);
})}
<div style={{ borderTop: ’1px solid ’ + C.s200, paddingTop: 12, marginTop: 4 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’ }}>
<span style={{ color: C.s900, fontWeight: 900, fontSize: 18 }}>\u5e74\u5ea6\u7e3d\u8a08</span>
<span style={{ color: C.amb, fontWeight: 900, fontSize: 26 }}>{D(totalPremium)}</span>
</div>
{income > 0 && <div style={{ color: C.s400, fontSize: 12, textAlign: ‘right’, marginTop: 4 }}>\u5360\u6708\u6536\u5165 {((totalPremium / 12 / income) * 100).toFixed(1)}%</div>}
</div>
<button onClick={function() { setShowRep(true); }} style={{ width: ‘100%’, height: 52, marginTop: 4, background: ‘linear-gradient(135deg,#d97706,#f59e0b)’, color: C.s900, fontWeight: 900, fontSize: 17, border: ‘none’, borderRadius: 14, cursor: ‘pointer’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, gap: 8, boxShadow: ‘0 4px 14px rgba(217,119,6,0.4)’ }}>
📄 \u67e5\u770b\u5b8c\u6574\u5831\u544a
</button>
</div>
),
},
];

return (
<div style={{ minHeight: ‘100vh’, background: ‘linear-gradient(160deg,#eef2ff 0%,#f1f5f9 50%,#f0fdf4 100%)’ }}>

```
  {/* Nav */}
  <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 24px rgba(0,0,0,0.25)', position: 'sticky', top: 0, zIndex: 100 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>&#128737;&#65039;</div>
      <div>
        <div style={{ color: C.wht, fontWeight: 900, fontSize: 18 }}>FinGuard Pro</div>
        <div className="nav-sub" style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 500 }}>\u6578\u4f4d\u9280\u884c\u7b49\u7d1a\u8ca1\u52d9\u8a3a\u65b7\u7cfb\u7d71</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {totalPremium > 0 && (
        <div className="nav-prem" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '6px 14px', textAlign: 'center' }}>
          <div style={{ color: '#a5b4fc', fontSize: 10, fontWeight: 600 }}>\u5e74\u5ea6\u7e3d\u4fdd\u969c\u6210\u672c</div>
          <div style={{ color: C.wht, fontWeight: 900, fontSize: 17 }}>{D(totalPremium)}</div>
        </div>
      )}
      <button onClick={function() { setShowRep(true); }} style={{ height: 44, padding: '0 16px', background: C.wht, color: '#312e81', fontWeight: 900, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
        &#128196; \u751f\u6210\u5831\u544a
      </button>
    </div>
  </div>

  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

    {/* Client info */}
    <div style={Object.assign({}, cardSt, { borderLeft: '8px solid ' + C.ind })}>
      <div className="sp">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#eef2ff', borderRadius: 12, width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&#128100;</div>
          <h2 style={{ color: C.s900, fontWeight: 900, fontSize: 20 }}>\u5ba2\u6236\u57fa\u672c\u8cc7\u6599</h2>
          {age > 0 && <span style={{ background: C.ind, color: C.wht, fontWeight: 900, fontSize: 14, padding: '3px 12px', borderRadius: 20, marginLeft: 4, whiteSpace: 'nowrap' }}>{age} \u6b72</span>}
        </div>
        <div className="gcl">
          <div style={gCell}><label style={lblSt}>\u59d3\u540d</label><TI value={client.name} onChange={sc('name')} placeholder="\u8acb\u8f38\u5165\u59d3\u540d" /></div>
          <div style={gCell}><label style={lblSt}>\u51fa\u751f\u65e5\u671f</label><TI type="date" value={client.birthdate} onChange={sc('birthdate')} /></div>
          <div style={gCell}><label style={lblSt}>\u6027\u5225</label><SI value={client.gender} onChange={sc('gender')} opts={[{ value: '', label: '\u8acb\u9078\u64c7' }, { value: 'male', label: '\u7537\u6027' }, { value: 'female', label: '\u5973\u6027' }]} /></div>
          <div style={gCell}><label style={lblSt}>\u8077\u696d</label><TI value={client.occupation} onChange={sc('occupation')} placeholder="\u4f8b\uff1a\u5de5\u7a0b\u5e2b" /></div>
          <div style={gCell}><label style={lblSt}>\u806f\u7d61\u96fb\u8a71</label><TI value={client.phone} onChange={sc('phone')} placeholder="0912-345-678" /></div>
          <div style={gCell}><label style={lblSt}>\u6276\u990a\u4eba\u6578</label><SI value={client.dependents} onChange={sc('dependents')} opts={['0', '1', '2', '3', '4', '5+'].map(function(v) { return { value: v, label: v + ' \u4eba' }; })} /></div>
        </div>
      </div>
    </div>

    {/* Finance */}
    <div style={Object.assign({}, cardSt, { borderLeft: '8px solid ' + C.vio })}>
      <div className="sp">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#f5f3ff', borderRadius: 12, width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&#128200;</div>
          <h2 style={{ color: C.s900, fontWeight: 900, fontSize: 20 }}>\u8ca1\u52d9\u8a3a\u65b7</h2>
        </div>
        <div className="g2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={gCell}><label style={lblSt}>\u6708\u6536\u5165\uff08\u5143\uff09</label><FI value={client.monthlyIncome}  onChange={sc('monthlyIncome')}  pre="$" /></div>
            <div style={gCell}><label style={lblSt}>\u6708\u652f\u51fa\uff08\u5143\uff09</label><FI value={client.monthlyExpense} onChange={sc('monthlyExpense')} pre="$" /></div>
            <div style={gCell}><label style={lblSt}>\u73fe\u6709\u5132\u84c4\uff08\u5143\uff09</label><FI value={client.savings}       onChange={sc('savings')}       pre="$" /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={gCell}>
              <label style={lblSt}>\u9810\u8a08\u9000\u4f11\u5e74\u9f61</label>
              <SI value={client.retirementAge} onChange={sc('retirementAge')} opts={[55, 58, 60, 62, 65, 67, 70].map(function(v) { return { value: String(v), label: v + ' \u6b72' }; })} />
            </div>
            {income > 0 && (
              <div style={{ background: 'linear-gradient(135deg,#faf5ff,#f0fdf4)', border: '1px solid ' + C.s200, borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: C.s900, fontWeight: 900, fontSize: 16 }}>\u6536\u652f\u6bd4\u5206\u6790</span>
                  <span style={{ fontWeight: 900, fontSize: 15, color: savingsRate >= 20 ? C.eme : C.ros }}>\u5132\u84c4\u7387 {savingsRate.toFixed(1)}%</span>
                </div>
                <div style={{ height: 18, background: C.s200, borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: Math.min((expense / income) * 100, 100) + '%', background: 'linear-gradient(90deg,#f43f5e,#fb7185)', transition: 'width .5s' }} />
                  <div style={{ width: Math.max(savingsRate, 0) + '%', background: 'linear-gradient(90deg,#10b981,#34d399)', transition: 'width .5s' }} />
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 13, fontWeight: 600, flexWrap: 'wrap' }}>
                  <span style={{ color: C.ros }}>&#128308; \u652f\u51fa {D(expense)}</span>
                  <span style={{ color: C.eme }}>&#128994; \u6708\u5132 {D(monthlySave)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Protection */}
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: C.s900, borderRadius: 12, width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&#128737;&#65039;</div>
          <h2 style={{ color: C.s900, fontWeight: 900, fontSize: 22 }}>\u4fdd\u969c\u9632\u79a6\u7cfb\u7d71</h2>
        </div>
        {totalPremium > 0 && (
          <div style={{ background: C.s900, color: C.wht, fontWeight: 900, fontSize: 15, padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            &#128176; {D(totalPremium)}
          </div>
        )}
      </div>
      <div className="gprot">
        {pcards.map(function(pc) {
          return (
            <PC key={pc.title} gradient={pc.gradient} icon={pc.icon} title={pc.title} sub={pc.sub}>
              {pc.content}
            </PC>
          );
        })}
      </div>
    </div>

    <div style={{ height: 24 }} />
  </div>
</div>
```

);
}
