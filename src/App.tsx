import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  User, Calendar, DollarSign, TrendingUp, Shield, Heart, AlertTriangle,
  CheckCircle, ChevronRight, FileText, BarChart2, Zap, Clock, Home,
  Activity, ArrowLeft, AlertCircle
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────
const calcAge = (dob) => {
  if (!dob) return 0;
  const today = new Date();
  const b = new Date(dob);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
};

const fmt = (n) =>
  n >= 10000
    ? `${(n / 10000).toFixed(1)}萬`
    : Number(n).toLocaleString("zh-TW");

const numVal = (v) => parseFloat(v) || 0;

// ─── section wrapper ─────────────────────────────────────────────────────────
const Section = ({ color, icon: Icon, title, children }) => {
  const colors = {
    blue:   { border: "border-blue-600",  bg: "bg-blue-50",   icon: "text-blue-600",  title: "text-blue-800" },
    emerald:{ border: "border-emerald-600",bg: "bg-emerald-50",icon: "text-emerald-600",title: "text-emerald-800" },
    violet: { border: "border-violet-600", bg: "bg-violet-50", icon: "text-violet-600", title: "text-violet-800" },
  };
  const c = colors[color];
  return (
    <div className={`rounded-2xl border-l-8 ${c.border} ${c.bg} p-6 shadow-sm`}>
      <div className={`flex items-center gap-3 mb-5`}>
        <div className={`p-2 rounded-xl bg-white shadow-sm`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
        <h2 className={`text-2xl font-black tracking-tight ${c.title}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
};

// ─── field ───────────────────────────────────────────────────────────────────
const Field = ({ label, unit, type = "number", value, onChange, placeholder, min, max, step }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-lg font-bold text-slate-900 leading-tight">{label}</label>
    <div className="relative flex items-center">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step}
        className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-xl font-semibold text-slate-900 focus:border-blue-500 focus:outline-none pr-14 transition-colors"
      />
      {unit && (
        <span className="absolute right-4 text-base font-bold text-slate-500">{unit}</span>
      )}
    </div>
  </div>
);

// ─── medical sub-row ─────────────────────────────────────────────────────────
const MedRow = ({ label, fields, values, onChange }) => (
  <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
    <p className="text-base font-black text-slate-700 mb-3">{label}</p>
    <div className="grid grid-cols-2 gap-3">
      {fields.map((f) => (
        <div key={f.key} className="flex flex-col gap-1">
          <span className="text-sm font-bold text-slate-500">{f.label}</span>
          <div className="relative flex items-center">
            <input
              type="number"
              value={values[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2 text-lg font-semibold text-slate-900 focus:border-blue-400 focus:outline-none pr-8"
            />
            <span className="absolute right-2 text-xs font-bold text-slate-400">{f.unit}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── coverage card ────────────────────────────────────────────────────────────
const CoverCard = ({ icon: Icon, title, color, fields, values, onChange }) => {
  const colors = {
    red:    "border-red-400 bg-red-50",
    orange: "border-orange-400 bg-orange-50",
    amber:  "border-amber-400 bg-amber-50",
    purple: "border-purple-400 bg-purple-50",
    teal:   "border-teal-400 bg-teal-50",
  };
  const iconColors = {
    red: "text-red-500", orange: "text-orange-500", amber: "text-amber-500",
    purple: "text-purple-500", teal: "text-teal-500",
  };
  return (
    <div className={`rounded-2xl border-2 ${colors[color]} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        <span className="text-lg font-black text-slate-800">{title}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-600">{f.label}</span>
            <div className="relative flex items-center">
              <input
                type="number"
                value={values[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border-2 border-white bg-white px-3 py-2.5 text-xl font-bold text-slate-900 focus:border-blue-400 focus:outline-none pr-10 shadow-sm"
              />
              <span className="absolute right-3 text-xs font-bold text-slate-400">{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── report metric card ───────────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, status }) => {
  const statusStyle = {
    good: "border-emerald-500 bg-emerald-900/30",
    warn: "border-amber-400 bg-amber-900/30",
    bad:  "border-red-500 bg-red-900/30",
  };
  const valueColor = { good: "text-emerald-400", warn: "text-amber-400", bad: "text-red-400" };
  return (
    <div className={`rounded-2xl border-2 ${statusStyle[status]} p-5`}>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-black ${valueColor[status]} leading-none mb-1`}>{value}</p>
      {sub && <p className="text-sm text-slate-400 mt-2">{sub}</p>}
    </div>
  );
};

// ─── alert badge ──────────────────────────────────────────────────────────────
const Alert = ({ type, text }) => {
  const s = {
    danger: "bg-red-900/40 border-red-500 text-red-300",
    warn:   "bg-amber-900/40 border-amber-400 text-amber-300",
    ok:     "bg-emerald-900/40 border-emerald-500 text-emerald-300",
  };
  const Icon = type === "ok" ? CheckCircle : AlertTriangle;
  return (
    <div className={`flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 ${s[type]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="text-base font-semibold leading-snug">{text}</p>
    </div>
  );
};

// ─── coverage report row ──────────────────────────────────────────────────────
const CoverReportRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
    <span className="text-slate-400 text-base">{label}</span>
    <span className="text-white font-bold text-lg">
      {numVal(value) > 0 ? `${fmt(numVal(value))} ${unit}` : <span className="text-red-400">未配置</span>}
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("input"); // "input" | "report"

  // ── basic ──
  const [name, setName]     = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob]       = useState("");

  // ── finance ──
  const [cash, setCash]         = useState("");
  const [invest, setInvest]     = useState("");
  const [income, setIncome]     = useState("");
  const [expense, setExpense]   = useState("");
  const [retireAge, setRetireAge] = useState("65");
  const [emerMonths, setEmerMonths] = useState("6");
  const [roi, setRoi]           = useState("5");

  // ── medical ──
  const [med, setMed] = useState({
    hospDaily: "", hospDailySI: "", hospSurg: "", hospSurgSI: "",
    outSurg: "", outSurgSI: "", miscSI: "", medPremium: ""
  });
  const updMed = (k, v) => setMed(p => ({ ...p, [k]: v }));

  // ── coverage ──
  const [life, setLife]   = useState({ death: "", premium: "" });
  const [acc, setAcc]     = useState({ death: "", si: "", premium: "" });
  const [critical, setCritical] = useState({ lump: "", premium: "" });
  const [cancer, setCancer]     = useState({ lump: "", premium: "" });
  const [ltc, setLtc]     = useState({ lump: "", monthly: "", premium: "" });

  // ── derived ──────────────────────────────────────────────────────────────
  const age = useMemo(() => calcAge(dob), [dob]);

  const totalPremium = useMemo(() => [
    med.medPremium, life.premium, acc.premium,
    critical.premium, cancer.premium, ltc.premium
  ].reduce((s, v) => s + numVal(v), 0), [med, life, acc, critical, cancer, ltc]);

  const totalAssets  = numVal(cash) + numVal(invest);
  const savingsRate  = numVal(income) > 0
    ? ((numVal(income) - numVal(expense) - totalPremium) / numVal(income)) * 100
    : 0;
  const emerMonthsCurrent = numVal(expense) > 0
    ? totalAssets / (numVal(expense) / 12)
    : 0;
  const targetMonths = numVal(emerMonths);

  // ── asset projection chart data ──────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!dob || age <= 0) return [];
    const targetAge = Math.max(numVal(retireAge), age + 1);
    const r = numVal(roi) / 100;
    const annualSavings = Math.max(
      numVal(income) - numVal(expense) - totalPremium, 0
    );
    const data = [];
    let assets = totalAssets;
    for (let a = age; a <= targetAge; a++) {
      data.push({ age: a, 資產總值: Math.round(assets) });
      assets = assets * (1 + r) + annualSavings;
    }
    return data;
  }, [dob, age, retireAge, roi, totalAssets, income, expense, totalPremium]);

  // ── diagnostics ──────────────────────────────────────────────────────────
  const alerts = useMemo(() => {
    const list = [];
    if (numVal(med.miscSI) < 200000)
      list.push({ type: "danger", text: `醫療雜費實支 ${fmt(numVal(med.miscSI))} 元，低於建議 20 萬，重大醫療費用恐面臨自費風險。` });
    if (savingsRate < 20 && numVal(income) > 0)
      list.push({ type: "warn", text: `儲蓄率 ${savingsRate.toFixed(1)}%，低於 20% 健康基準，財務韌性不足。` });
    if (emerMonthsCurrent < targetMonths && numVal(expense) > 0)
      list.push({ type: "danger", text: `流動準備金 ${emerMonthsCurrent.toFixed(1)} 個月，未達設定目標 ${targetMonths} 個月，面臨流動性風險。` });
    if (numVal(life.death) === 0)
      list.push({ type: "warn", text: "壽險身故保障尚未配置，家庭財務保障存在缺口。" });
    if (numVal(critical.lump) === 0)
      list.push({ type: "warn", text: "重大傷病一次金尚未配置，長期失能收入中斷風險未受保障。" });
    if (list.length === 0)
      list.push({ type: "ok", text: "各項核心保障指標達標，財務防禦體系相對完整。" });
    return list;
  }, [med.miscSI, savingsRate, emerMonthsCurrent, targetMonths, income, life.death, critical.lump]);

  const readyToReport = name.trim().length > 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUT VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === "input") return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* header */}
      <div className="sticky top-0 z-20 bg-white border-b-4 border-blue-600 shadow-lg px-6 py-4 flex items-center gap-4">
        <div className="p-2 rounded-xl bg-blue-600">
          <BarChart2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Professional Finance Tool</p>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">財務保障面談工具</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── 客戶基本資料 ── */}
        <Section color="blue" icon={User} title="客戶基本資料">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-lg font-bold text-slate-900">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="請輸入客戶姓名"
                className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-xl font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-lg font-bold text-slate-900">性別</label>
              <div className="flex rounded-xl overflow-hidden border-2 border-slate-300">
                {["male","female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-3 text-lg font-bold transition-colors ${
                      gender === g ? "bg-blue-600 text-white" : "bg-white text-slate-600"
                    }`}
                  >
                    {g === "male" ? "男性" : "女性"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-lg font-bold text-slate-900">出生日期</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-xl font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {dob && (
              <div className="col-span-2 flex items-center gap-3 rounded-xl bg-blue-600 px-5 py-3">
                <Calendar className="w-6 h-6 text-white" />
                <span className="text-xl font-black text-white">目前年齡：{age} 歲</span>
              </div>
            )}
          </div>
        </Section>

        {/* ── 財務診斷 ── */}
        <Section color="emerald" icon={TrendingUp} title="資產與現金流診斷">
          <div className="grid grid-cols-2 gap-4">
            <Field label="現金／存款總額" unit="元" value={cash} onChange={setCash} placeholder="0" />
            <Field label="投資型資產" unit="元" value={invest} onChange={setInvest} placeholder="0" />
            <Field label="年度總收入" unit="元" value={income} onChange={setIncome} placeholder="0" />
            <Field label="年生活支出" unit="元" value={expense} onChange={setExpense} placeholder="0" />
            <Field label="預計退休年齡" unit="歲" value={retireAge} onChange={setRetireAge} placeholder="65" min={age+1} max={90} />
            <Field label="緊急預備金目標" unit="個月" value={emerMonths} onChange={setEmerMonths} placeholder="6" min={1} max={36} />
            <div className="col-span-2">
              <Field label="預期投資報酬率（ROI）" unit="%" value={roi} onChange={setRoi} placeholder="5" step={0.5} />
            </div>
          </div>
        </Section>

        {/* ── 醫療險 ── */}
        <Section color="violet" icon={Heart} title="醫療險精算區">
          <div className="grid grid-cols-1 gap-3">
            <MedRow
              label="住院日額"
              fields={[
                { key:"hospDaily", label:"定額日額", unit:"元/日" },
                { key:"hospDailySI", label:"實支日額", unit:"元/日" },
              ]}
              values={med} onChange={updMed}
            />
            <MedRow
              label="住院手術"
              fields={[
                { key:"hospSurg", label:"定額手術", unit:"元/次" },
                { key:"hospSurgSI", label:"實支手術", unit:"元/次" },
              ]}
              values={med} onChange={updMed}
            />
            <MedRow
              label="門診手術"
              fields={[
                { key:"outSurg", label:"定額門診", unit:"元/次" },
                { key:"outSurgSI", label:"實支門診", unit:"元/次" },
              ]}
              values={med} onChange={updMed}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <p className="text-sm font-bold text-slate-500 mb-1">醫療雜費（實支）</p>
                <div className="relative flex items-center">
                  <input type="number" value={med.miscSI} onChange={(e) => updMed("miscSI", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2 text-xl font-bold text-slate-900 focus:border-violet-400 focus:outline-none pr-8"
                  />
                  <span className="absolute right-2 text-xs font-bold text-slate-400">元</span>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <p className="text-sm font-bold text-slate-500 mb-1">醫療險年保費</p>
                <div className="relative flex items-center">
                  <input type="number" value={med.medPremium} onChange={(e) => updMed("medPremium", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2 text-xl font-bold text-slate-900 focus:border-violet-400 focus:outline-none pr-8"
                  />
                  <span className="absolute right-2 text-xs font-bold text-slate-400">元</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 五大險種 ── */}
        <Section color="violet" icon={Shield} title="全方位保障防禦體系">
          <div className="grid grid-cols-2 gap-4">
            <CoverCard icon={Shield} title="壽險" color="red"
              fields={[
                { key:"death", label:"身故保額", unit:"元" },
                { key:"premium", label:"年保費", unit:"元" },
              ]}
              values={life} onChange={(k,v) => setLife(p => ({...p,[k]:v}))}
            />
            <CoverCard icon={Zap} title="意外險" color="orange"
              fields={[
                { key:"death", label:"身故保額", unit:"元" },
                { key:"si", label:"實支上限", unit:"元" },
                { key:"premium", label:"年保費", unit:"元" },
              ]}
              values={acc} onChange={(k,v) => setAcc(p => ({...p,[k]:v}))}
            />
            <CoverCard icon={AlertCircle} title="重大傷病險" color="amber"
              fields={[
                { key:"lump", label:"一次給付金", unit:"元" },
                { key:"premium", label:"年保費", unit:"元" },
              ]}
              values={critical} onChange={(k,v) => setCritical(p => ({...p,[k]:v}))}
            />
            <CoverCard icon={Activity} title="癌症險" color="purple"
              fields={[
                { key:"lump", label:"一次給付金", unit:"元" },
                { key:"premium", label:"年保費", unit:"元" },
              ]}
              values={cancer} onChange={(k,v) => setCancer(p => ({...p,[k]:v}))}
            />
            <div className="col-span-2">
              <CoverCard icon={Clock} title="長照險" color="teal"
                fields={[
                  { key:"lump", label:"一次給付金", unit:"元" },
                  { key:"monthly", label:"月扶助金", unit:"元/月" },
                  { key:"premium", label:"年保費", unit:"元" },
                ]}
                values={ltc} onChange={(k,v) => setLtc(p => ({...p,[k]:v}))}
              />
            </div>
          </div>

          {/* total premium display */}
          <div className="mt-4 rounded-2xl bg-violet-700 px-6 py-4 flex justify-between items-center">
            <span className="text-lg font-bold text-violet-100">全方位保障年總保費</span>
            <span className="text-3xl font-black text-white">{fmt(totalPremium)} 元</span>
          </div>
        </Section>
      </div>

      {/* sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-4 border-slate-200 px-4 py-4 shadow-2xl">
        <button
          disabled={!readyToReport}
          onClick={() => setView("report")}
          className={`w-full max-w-4xl mx-auto flex items-center justify-center gap-3 rounded-2xl py-5 text-2xl font-black transition-all shadow-lg
            ${readyToReport
              ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
        >
          <FileText className="w-7 h-7" />
          產生現況計劃報表
          <ChevronRight className="w-7 h-7" />
        </button>
        {!readyToReport && (
          <p className="text-center text-sm text-slate-400 mt-2">請先填入客戶姓名</p>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // REPORT VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  const retireData = chartData.find(d => d.age === numVal(retireAge));
  const retireValue = retireData ? retireData["資產總值"] : 0;

  const savingsStatus = savingsRate >= 30 ? "good" : savingsRate >= 20 ? "warn" : "bad";
  const emerStatus = emerMonthsCurrent >= targetMonths ? "good" : emerMonthsCurrent >= targetMonths * 0.6 ? "warn" : "bad";
  const coverStatus = numVal(life.death) > 0 && numVal(critical.lump) > 0 ? "good" : "warn";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* report header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-5 flex items-center gap-4 sticky top-0 z-20">
        <button
          onClick={() => setView("input")}
          className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">財務保障分析報表</p>
          <h1 className="text-2xl font-black text-white leading-tight">
            「{name}」的財務保障分析表
          </h1>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-slate-400">分析日期</span>
          <span className="text-base font-bold text-slate-200">
            {new Date().toLocaleDateString("zh-TW")}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── profile strip ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "年齡", value: `${age} 歲` },
            { label: "性別", value: gender === "male" ? "男性" : "女性" },
            { label: "退休目標", value: `${retireAge} 歲` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-800 border border-slate-700 p-4 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ── key metrics ── */}
        <div>
          <h2 className="text-lg font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />財務健康指標
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="儲蓄效率"
              value={`${savingsRate.toFixed(1)}%`}
              sub={`年收入 ${fmt(numVal(income))} 元｜年支出 ${fmt(numVal(expense))} 元`}
              status={savingsStatus}
            />
            <MetricCard
              label="流動準備金"
              value={`${emerMonthsCurrent.toFixed(1)} 個月`}
              sub={`目標 ${targetMonths} 個月｜${emerMonthsCurrent < targetMonths ? "⚠ 不足" : "✓ 達標"}`}
              status={emerStatus}
            />
            <MetricCard
              label="資產總值"
              value={fmt(totalAssets) + " 元"}
              sub={`現金 ${fmt(numVal(cash))} + 投資 ${fmt(numVal(invest))}`}
              status="good"
            />
            <MetricCard
              label="年保費支出"
              value={fmt(totalPremium) + " 元"}
              sub={`保費占收入 ${numVal(income) > 0 ? ((totalPremium / numVal(income)) * 100).toFixed(1) : "—"}%`}
              status={coverStatus}
            />
          </div>
        </div>

        {/* ── asset projection chart ── */}
        {chartData.length > 1 && (
          <div>
            <h2 className="text-lg font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-violet-400" />資產成長預估圖
            </h2>
            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-400">退休時預估資產</p>
                  <p className="text-3xl font-black text-violet-400">{fmt(retireValue)} 元</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">預期年化報酬</p>
                  <p className="text-3xl font-black text-blue-400">{roi}%</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="assetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="age" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }}
                    label={{ value: "年齡", position: "insideBottomRight", fill: "#64748b", fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(v) => fmt(v)} width={70} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #475569", borderRadius: 12, color: "#fff" }}
                    formatter={(v) => [`${fmt(v)} 元`, "資產總值"]}
                    labelFormatter={(l) => `${l} 歲`}
                  />
                  {numVal(retireAge) > 0 && (
                    <ReferenceLine x={numVal(retireAge)} stroke="#f59e0b" strokeDasharray="6 3"
                      label={{ value: "退休", fill: "#f59e0b", fontSize: 12, position: "top" }} />
                  )}
                  <Area type="monotone" dataKey="資產總值" stroke="#7c3aed" strokeWidth={3}
                    fill="url(#assetGrad)" dot={false} activeDot={{ r: 6, fill: "#7c3aed" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── coverage summary ── */}
        <div>
          <h2 className="text-lg font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />保障配置總覽
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* medical */}
            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5">
              <p className="text-base font-black text-violet-400 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />醫療險
              </p>
              <CoverReportRow label="住院日額（定額）" value={med.hospDaily} unit="元/日" />
              <CoverReportRow label="住院日額（實支）" value={med.hospDailySI} unit="元/日" />
              <CoverReportRow label="住院手術（實支）" value={med.hospSurgSI} unit="元/次" />
              <CoverReportRow label="門診手術（實支）" value={med.outSurgSI} unit="元/次" />
              <CoverReportRow label="醫療雜費（實支）" value={med.miscSI} unit="元" />
            </div>
            {/* 五大險種 */}
            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5">
              <p className="text-base font-black text-blue-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />五大險種
              </p>
              <CoverReportRow label="壽險身故保額" value={life.death} unit="元" />
              <CoverReportRow label="意外險身故" value={acc.death} unit="元" />
              <CoverReportRow label="重大傷病一次金" value={critical.lump} unit="元" />
              <CoverReportRow label="癌症一次金" value={cancer.lump} unit="元" />
              <CoverReportRow label="長照一次金" value={ltc.lump} unit="元" />
              <CoverReportRow label="長照月扶助金" value={ltc.monthly} unit="元/月" />
            </div>
          </div>
        </div>

        {/* ── gap diagnostics ── */}
        <div>
          <h2 className="text-lg font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />缺口診斷分析
          </h2>
          <div className="space-y-3">
            {alerts.map((a, i) => <Alert key={i} type={a.type} text={a.text} />)}
          </div>
        </div>

        {/* footer */}
        <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5 text-center">
          <p className="text-slate-400 text-sm">
            本報表僅供財務面談參考，所有數據以實際保單及財務狀況為準。
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Generated · {new Date().toLocaleString("zh-TW")}
          </p>
        </div>
      </div>
    </div>
  );
}
