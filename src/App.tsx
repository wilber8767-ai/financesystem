import { useState, useMemo, useCallback } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import {
  User, Calendar, TrendingUp, Shield, Heart,
  AlertTriangle, CheckCircle, ChevronRight, FileText,
  BarChart2, Zap, Clock, Activity, ArrowLeft,
  AlertCircle, Banknote, PiggyBank, Target, ShieldCheck,
  XCircle, Percent,
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────

type View       = 'input' | 'report'
type Gender     = 'male'  | 'female'
type AlertLevel = 'danger' | 'warn' | 'ok'

interface MedData {
  hospDailyFixed: string
  hospDailySI:    string
  hospSurgFixed:  string
  hospSurgSI:     string
  miscSI:         string
  premium:        string
}
interface CoverItem { amount: string; premium: string }
interface AccItem   { death: string; si: string; premium: string }
interface LtcItem   { lump: string; monthly: string; premium: string }

interface FormState {
  name: string; gender: Gender; dob: string
  income: string; expense: string; assets: string; invest: string
  roi: string; retireAge: string; emerMonths: string
  med: MedData
  life: CoverItem; acc: AccItem; critical: CoverItem
  cancer: CoverItem; ltc: LtcItem
}

interface DiagAlert  { level: AlertLevel; title: string; body: string }
interface ChartPoint { age: number; 資產總值: number }

// ─── HELPERS ──────────────────────────────────────────────────────

const toNum = (v: string): number => parseFloat(v) || 0

const calcAge = (dob: string): number => {
  if (!dob) return 0
  const today = new Date(); const b = new Date(dob)
  let age = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
  return Math.max(0, age)
}

const fmt = (n: number): string => {
  if (n === 0) return '0'
  if (Math.abs(n) >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}億`
  if (Math.abs(n) >= 10_000)      return `${(n / 10_000).toFixed(1)}萬`
  return n.toLocaleString('zh-TW')
}

// ─── INITIAL STATE ────────────────────────────────────────────────

const INIT: FormState = {
  name: '', gender: 'male', dob: '',
  income: '', expense: '', assets: '', invest: '',
  roi: '5', retireAge: '65', emerMonths: '6',
  med: { hospDailyFixed:'', hospDailySI:'', hospSurgFixed:'', hospSurgSI:'', miscSI:'', premium:'' },
  life:     { amount:'', premium:'' },
  acc:      { death:'', si:'', premium:'' },
  critical: { amount:'', premium:'' },
  cancer:   { amount:'', premium:'' },
  ltc:      { lump:'', monthly:'', premium:'' },
}

// ─── INPUT PRIMITIVES ─────────────────────────────────────────────

interface FieldProps {
  label: string; unit?: string; value: string
  onChange: (v: string) => void; type?: string
  placeholder?: string; min?: string; max?: string; step?: string
  red?: boolean
}
function Field({ label, unit, value, onChange, type='number', placeholder='0', min, max, step, red=false }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`text-lg font-extrabold leading-snug ${red ? 'text-red-600' : 'text-slate-900'}`}>{label}</label>
      <div className="relative flex items-center">
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} min={min} max={max} step={step}
          inputMode={type === 'number' ? 'decimal' : undefined}
          className={`w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-5 text-2xl font-bold text-slate-900
            focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all
            ${unit ? 'pr-20' : ''}`}
        />
        {unit && <span className="pointer-events-none absolute right-5 text-sm font-extrabold text-slate-400 whitespace-nowrap">{unit}</span>}
      </div>
      {red && toNum(value) > 0 && toNum(value) < 200_000 && (
        <p className="text-xs font-bold text-red-500">⚠ 低於建議下限 20 萬元</p>
      )}
    </div>
  )
}

interface SectionProps {
  accent: string; iconBg: string; icon: React.ReactNode
  title: string; subtitle: string; children: React.ReactNode
}
function Section({ accent, iconBg, icon, title, subtitle, children }: SectionProps) {
  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl border-l-8 ${accent} overflow-hidden`}>
      <div className="px-7 pt-6 pb-5 flex items-center gap-4 border-b border-slate-100">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
          <h2 className="text-xl font-black text-slate-900 leading-tight">{title}</h2>
        </div>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  )
}

interface MedCellProps { label: string; unit: string; value: string; onChange: (v: string) => void; red?: boolean }
function MedCell({ label, unit, value, onChange, red=false }: MedCellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={`text-base font-extrabold ${red ? 'text-red-600' : 'text-slate-700'}`}>{label}</span>
      <div className="relative flex items-center">
        <input type="number" inputMode="decimal" value={value}
          onChange={e => onChange(e.target.value)} placeholder="0"
          className={`w-full rounded-xl border-2 px-4 py-4 text-xl font-bold text-slate-900 transition-all
            focus:outline-none focus:ring-4 focus:ring-indigo-500/30
            ${red ? 'border-red-200 bg-red-50 focus:border-red-400' : 'border-slate-200 bg-slate-50 focus:border-indigo-400'}`}
        />
        <span className="pointer-events-none absolute right-3 text-xs font-extrabold text-slate-400 whitespace-nowrap">{unit}</span>
      </div>
    </div>
  )
}

interface CoverCardProps {
  icon: React.ReactNode; title: string; border: string; bg: string
  fields: { key: string; label: string; unit: string }[]
  values: Record<string, string>; onChange: (k: string, v: string) => void
}
function CoverCard({ icon, title, border, bg, fields, values, onChange }: CoverCardProps) {
  return (
    <div className={`rounded-3xl border-2 ${border} ${bg} p-5`}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/8">{icon}
        <span className="text-lg font-black text-slate-800">{title}</span>
      </div>
      <div className="flex flex-col gap-3">
        {fields.map(f => (
          <div key={f.key} className="flex flex-col gap-1">
            <span className="text-base font-extrabold text-slate-700">{f.label}</span>
            <div className="relative flex items-center">
              <input type="number" inputMode="decimal" value={values[f.key]||''}
                onChange={e => onChange(f.key, e.target.value)} placeholder="0"
                className="w-full rounded-xl border-2 border-white bg-white px-4 py-4 text-2xl font-bold text-slate-900
                  focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/30 shadow-sm transition-all pr-14"
              />
              <span className="pointer-events-none absolute right-3 text-xs font-extrabold text-slate-400 whitespace-nowrap">{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── REPORT PRIMITIVES ────────────────────────────────────────────

interface KpiProps { label: string; value: string; sub?: string; status: 'good'|'warn'|'bad'|'neutral'; icon: React.ReactNode }
function Kpi({ label, value, sub, status, icon }: KpiProps) {
  const p = { good:{border:'border-emerald-500',bg:'bg-emerald-950/40',val:'text-emerald-400',chip:'bg-emerald-500/20 text-emerald-300'},
    warn:{border:'border-amber-400',bg:'bg-amber-950/40',val:'text-amber-300',chip:'bg-amber-400/20 text-amber-300'},
    bad:{border:'border-red-500',bg:'bg-red-950/40',val:'text-red-400',chip:'bg-red-500/20 text-red-300'},
    neutral:{border:'border-sky-500',bg:'bg-sky-950/40',val:'text-sky-300',chip:'bg-sky-500/20 text-sky-300'} }[status]
  return (
    <div className={`rounded-2xl border-2 ${p.border} ${p.bg} p-5 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <span className={`rounded-lg p-1.5 ${p.chip}`}>{icon}</span>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className={`text-4xl font-black ${p.val} leading-none`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 leading-snug mt-0.5">{sub}</p>}
    </div>
  )
}

function AlertBadge({ level, title, body }: DiagAlert) {
  const s = {
    danger:{ wrap:'border-red-500 bg-red-950/60', icon:<XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"/>, tc:'text-red-300', bc:'text-red-400/80' },
    warn:  { wrap:'border-amber-400 bg-amber-950/60', icon:<AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5"/>, tc:'text-amber-300', bc:'text-amber-400/80' },
    ok:    { wrap:'border-emerald-500 bg-emerald-950/60', icon:<CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5"/>, tc:'text-emerald-300', bc:'text-emerald-400/80' },
  }[level]
  return (
    <div className={`flex gap-4 rounded-2xl border-l-4 px-5 py-4 ${s.wrap}`}>
      {s.icon}
      <div>
        <p className={`text-base font-black ${s.tc}`}>{title}</p>
        <p className={`text-sm mt-1 leading-relaxed ${s.bc}`}>{body}</p>
      </div>
    </div>
  )
}

function CoverRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/60 last:border-0">
      <span className="text-sm text-slate-400 font-medium">{label}</span>
      {toNum(value) > 0
        ? <span className="text-base font-black text-white">{fmt(toNum(value))} <span className="text-slate-400 text-xs">{unit}</span></span>
        : <span className="flex items-center gap-1 text-sm font-black text-red-400"><XCircle className="w-3.5 h-3.5"/>未配置</span>}
    </div>
  )
}

function ChartTip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-600 px-4 py-3 shadow-2xl">
      <p className="text-xs font-bold text-slate-400 mb-1">{label} 歲</p>
      <p className="text-lg font-black text-sky-300">{fmt(payload[0].value ?? 0)} 元</p>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('input')
  const [form, setForm] = useState<FormState>(INIT)

  const set  = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v })), [])
  const setMed      = useCallback((k: keyof MedData,  v: string) => setForm(p => ({ ...p, med:      { ...p.med,      [k]: v } })), [])
  const setLife     = useCallback((k: keyof CoverItem, v: string) => setForm(p => ({ ...p, life:     { ...p.life,     [k]: v } })), [])
  const setAcc      = useCallback((k: keyof AccItem,   v: string) => setForm(p => ({ ...p, acc:      { ...p.acc,      [k]: v } })), [])
  const setCritical = useCallback((k: keyof CoverItem, v: string) => setForm(p => ({ ...p, critical: { ...p.critical, [k]: v } })), [])
  const setCancer   = useCallback((k: keyof CoverItem, v: string) => setForm(p => ({ ...p, cancer:   { ...p.cancer,   [k]: v } })), [])
  const setLtc      = useCallback((k: keyof LtcItem,   v: string) => setForm(p => ({ ...p, ltc:      { ...p.ltc,      [k]: v } })), [])

  const age        = useMemo(() => calcAge(form.dob), [form.dob])
  const income     = toNum(form.income)
  const expense    = toNum(form.expense)
  const assets     = toNum(form.assets) + toNum(form.invest)
  const roi        = toNum(form.roi)
  const retireAge  = toNum(form.retireAge)
  const emerTarget = toNum(form.emerMonths)

  const totalPremium = useMemo(() =>
    [form.med.premium, form.life.premium, form.acc.premium, form.critical.premium, form.cancer.premium, form.ltc.premium]
    .reduce((s, v) => s + toNum(v), 0),
    [form.med.premium, form.life.premium, form.acc.premium, form.critical.premium, form.cancer.premium, form.ltc.premium])

  const annualSavings = Math.max(income - expense - totalPremium, 0)
  const savingsRate   = income > 0 ? ((income - expense - totalPremium) / income) * 100 : 0
  const emerMonths    = expense > 0 ? assets / (expense / 12) : 0
  const premiumRatio  = income > 0 ? (totalPremium / income) * 100 : 0

  const chartData = useMemo((): ChartPoint[] => {
    if (age <= 0 || retireAge <= age) return []
    const r = roi / 100; const data: ChartPoint[] = []; let cur = assets
    for (let a = age; a <= retireAge; a++) {
      data.push({ age: a, 資產總值: Math.round(cur) })
      cur = cur * (1 + r) + annualSavings
    }
    return data
  }, [age, retireAge, roi, assets, annualSavings])

  const retireValue = useMemo(() => chartData.find(d => d.age === retireAge)?.['資產總值'] ?? 0, [chartData, retireAge])

  const alerts = useMemo((): DiagAlert[] => {
    const list: DiagAlert[] = []
    if (toNum(form.med.miscSI) < 200_000)
      list.push({ level:'danger', title:'醫療雜費保障不足', body:`現有醫療雜費實支 ${fmt(toNum(form.med.miscSI))} 元，低於建議下限 20 萬。重大手術耗材與自費藥物恐需全額自付。` })
    if (income > 0 && savingsRate < 10)
      list.push({ level:'danger', title:'儲蓄效率危急', body:`儲蓄率僅 ${savingsRate.toFixed(1)}%，低於 10% 警戒線。扣除支出與保費後幾乎無法累積財富。` })
    else if (income > 0 && savingsRate < 20)
      list.push({ level:'warn', title:'儲蓄效率偏低', body:`儲蓄率 ${savingsRate.toFixed(1)}%，低於 20% 健康基準。建議優化支出或保費結構。` })
    if (expense > 0 && emerMonths < emerTarget)
      list.push({ level: emerMonths < emerTarget * 0.5 ? 'danger' : 'warn', title:'流動性準備金不足',
        body:`現有資產可支撐 ${emerMonths.toFixed(1)} 個月，未達目標 ${emerTarget} 個月。突發失業或疾病將引發流動性危機。` })
    if (toNum(form.life.amount) === 0)
      list.push({ level:'warn', title:'壽險保障缺口', body:'尚未配置壽險。主要收入來源身故時，家庭財務將面臨嚴重衝擊，建議以年收入 10 倍為目標。' })
    if (toNum(form.critical.amount) === 0)
      list.push({ level:'warn', title:'重大傷病風險未保障', body:'重大傷病治療期間收入中斷，將大幅加速財富耗損。建議優先補強此項缺口。' })
    if (premiumRatio > 15 && income > 0)
      list.push({ level:'warn', title:'保費負擔偏重', body:`保費佔年收入 ${premiumRatio.toFixed(1)}%，超過 15% 建議上限，壓縮了儲蓄與投資空間。` })
    if (list.length === 0)
      list.push({ level:'ok', title:'財務防禦體系完整', body:'各項核心指標均達標，現有配置提供良好的風險防禦能力。建議每年定期複審。' })
    return list
  }, [form.med.miscSI, income, savingsRate, expense, emerMonths, emerTarget, form.life.amount, form.critical.amount, premiumRatio])

  const canGenerate = form.name.trim().length > 0

  // ═══════════════ INPUT VIEW ════════════════════════════════════
  if (view === 'input') return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-30 bg-white border-b-4 border-slate-900 shadow-lg">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-white"/>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Wealth Defense System</p>
            <h1 className="text-xl font-black text-slate-900 leading-tight">財富防禦與財務診斷系統</h1>
          </div>
          <div className={`hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black
            ${canGenerate ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            <div className={`w-2 h-2 rounded-full ${canGenerate ? 'bg-emerald-500' : 'bg-slate-300'}`}/>
            {canGenerate ? '資料完備' : '待填姓名'}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6 pb-44 space-y-6">

        {/* S1 客戶資料 */}
        <Section accent="border-indigo-500" iconBg="bg-indigo-500"
          icon={<User className="w-6 h-6 text-white"/>}
          title="客戶基本資料" subtitle="SECTION 01 — CLIENT PROFILE">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <Field label="客戶姓名" value={form.name} onChange={v => set('name', v)} type="text" placeholder="請輸入客戶姓名"/>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-lg font-extrabold text-slate-900">性別</span>
              <div className="flex rounded-2xl overflow-hidden border-2 border-slate-200 h-[68px]">
                {(['male','female'] as Gender[]).map(g => (
                  <button key={g} onClick={() => set('gender', g)}
                    className={`flex-1 text-lg font-black transition-colors select-none
                      ${form.gender===g ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 active:bg-slate-50'}`}>
                    {g==='male' ? '♂ 男性' : '♀ 女性'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-lg font-extrabold text-slate-900">出生日期</span>
              <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-5 text-2xl font-bold text-slate-900
                  focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all"/>
            </div>
            {form.dob && (
              <div className="col-span-2 flex items-center gap-4 rounded-2xl bg-slate-900 px-6 py-4">
                <Calendar className="w-6 h-6 text-indigo-400 flex-shrink-0"/>
                <span className="text-lg font-black text-slate-300">計算年齡</span>
                <span className="text-5xl font-black text-indigo-400 leading-none ml-auto">{age}</span>
                <span className="text-xl font-black text-slate-400">歲</span>
              </div>
            )}
          </div>
        </Section>

        {/* S2 財務診斷 */}
        <Section accent="border-slate-500" iconBg="bg-slate-700"
          icon={<TrendingUp className="w-6 h-6 text-white"/>}
          title="財務現況診斷" subtitle="SECTION 02 — FINANCIAL DATA">
          <div className="grid grid-cols-2 gap-5">
            <Field label="年度總收入"    unit="元" value={form.income}     onChange={v => set('income', v)}/>
            <Field label="年度生活支出"  unit="元" value={form.expense}    onChange={v => set('expense', v)}/>
            <Field label="現金／存款資產" unit="元" value={form.assets}     onChange={v => set('assets', v)}/>
            <Field label="投資型資產"    unit="元" value={form.invest}     onChange={v => set('invest', v)}/>
            <Field label="預計退休年齡"  unit="歲" value={form.retireAge}  onChange={v => set('retireAge', v)} min="1" max="90"/>
            <Field label="緊急預備金目標" unit="個月" value={form.emerMonths} onChange={v => set('emerMonths', v)} min="1" max="36"/>
            <div className="col-span-2">
              <Field label="預期投資報酬率（ROI）" unit="%" value={form.roi} onChange={v => set('roi', v)} step="0.5"/>
            </div>
          </div>
          {income > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label:'年儲蓄額',  val:fmt(annualSavings)+' 元', ok:annualSavings>0 },
                { label:'儲蓄率',   val:savingsRate.toFixed(1)+'%', ok:savingsRate>=20 },
                { label:'保費/收入', val:premiumRatio.toFixed(1)+'%', ok:premiumRatio<=15 },
              ].map(item => (
                <div key={item.label} className={`rounded-2xl border-2 p-4 text-center
                  ${item.ok ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                  <p className="text-xs font-black text-slate-500 mb-1">{item.label}</p>
                  <p className={`text-xl font-black ${item.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{item.val}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* S3 醫療精算 */}
        <Section accent="border-blue-500" iconBg="bg-blue-500"
          icon={<Heart className="w-6 h-6 text-white"/>}
          title="醫療防禦精算區" subtitle="SECTION 03 — MEDICAL INSURANCE">
          <div className="grid grid-cols-2 gap-1 mb-3 px-1">
            <p className="text-sm font-black text-slate-400 uppercase tracking-wider text-center">定額給付</p>
            <p className="text-sm font-black text-slate-400 uppercase tracking-wider text-center">實支實付</p>
          </div>
          {([
            { title:'住院日額', f1:{key:'hospDailyFixed' as keyof MedData, label:'定額日額', unit:'元/日'}, f2:{key:'hospDailySI' as keyof MedData, label:'實支日額', unit:'元/日'} },
            { title:'手術給付', f1:{key:'hospSurgFixed'  as keyof MedData, label:'定額手術', unit:'元/次'}, f2:{key:'hospSurgSI'  as keyof MedData, label:'實支手術', unit:'元/次'} },
          ] as const).map(row => (
            <div key={row.title} className="rounded-2xl bg-slate-50 border border-slate-100 p-5 mb-3">
              <p className="text-base font-black text-slate-600 mb-3">{row.title}</p>
              <div className="grid grid-cols-2 gap-3">
                <MedCell label={row.f1.label} unit={row.f1.unit} value={form.med[row.f1.key]} onChange={v => setMed(row.f1.key, v)}/>
                <MedCell label={row.f2.label} unit={row.f2.unit} value={form.med[row.f2.key]} onChange={v => setMed(row.f2.key, v)}/>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-5">
              <MedCell label="⚠ 醫療雜費（實支）" unit="元" value={form.med.miscSI} onChange={v => setMed('miscSI', v)} red/>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <MedCell label="醫療險年保費" unit="元" value={form.med.premium} onChange={v => setMed('premium', v)}/>
            </div>
          </div>
        </Section>

        {/* S4 五大險種 */}
        <Section accent="border-blue-600" iconBg="bg-blue-600"
          icon={<Shield className="w-6 h-6 text-white"/>}
          title="五大險種保障模組" subtitle="SECTION 04 — FIVE CORE COVERAGES">
          <div className="grid grid-cols-2 gap-4">
            <CoverCard icon={<Shield className="w-5 h-5 text-red-500"/>} title="壽險" border="border-red-200" bg="bg-red-50"
              fields={[{key:'amount',label:'身故保額',unit:'元'},{key:'premium',label:'年保費',unit:'元'}]}
              values={form.life as unknown as Record<string,string>} onChange={(k,v)=>setLife(k as keyof CoverItem,v)}/>
            <CoverCard icon={<Zap className="w-5 h-5 text-orange-500"/>} title="意外險" border="border-orange-200" bg="bg-orange-50"
              fields={[{key:'death',label:'身故保額',unit:'元'},{key:'si',label:'實支上限',unit:'元'},{key:'premium',label:'年保費',unit:'元'}]}
              values={form.acc as unknown as Record<string,string>} onChange={(k,v)=>setAcc(k as keyof AccItem,v)}/>
            <CoverCard icon={<AlertCircle className="w-5 h-5 text-amber-600"/>} title="重大傷病" border="border-amber-200" bg="bg-amber-50"
              fields={[{key:'amount',label:'一次給付金',unit:'元'},{key:'premium',label:'年保費',unit:'元'}]}
              values={form.critical as unknown as Record<string,string>} onChange={(k,v)=>setCritical(k as keyof CoverItem,v)}/>
            <CoverCard icon={<Activity className="w-5 h-5 text-purple-500"/>} title="癌症險" border="border-purple-200" bg="bg-purple-50"
              fields={[{key:'amount',label:'一次給付金',unit:'元'},{key:'premium',label:'年保費',unit:'元'}]}
              values={form.cancer as unknown as Record<string,string>} onChange={(k,v)=>setCancer(k as keyof CoverItem,v)}/>
            <div className="col-span-2">
              <CoverCard icon={<Clock className="w-5 h-5 text-teal-500"/>} title="長照險" border="border-teal-200" bg="bg-teal-50"
                fields={[{key:'lump',label:'一次給付金',unit:'元'},{key:'monthly',label:'月扶助金',unit:'元/月'},{key:'premium',label:'年保費',unit:'元'}]}
                values={form.ltc as unknown as Record<string,string>} onChange={(k,v)=>setLtc(k as keyof LtcItem,v)}/>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-slate-900 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Banknote className="w-6 h-6 text-slate-400"/>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">年度總保費</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  佔收入 {income>0 ? premiumRatio.toFixed(1) : '—'}%
                  {premiumRatio>15 && income>0 && <span className="text-amber-400 ml-1">⚠ 偏高</span>}
                </p>
              </div>
            </div>
            <p className="text-4xl font-black text-white">{fmt(totalPremium)} <span className="text-lg font-bold text-slate-400">元</span></p>
          </div>
        </Section>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/95 backdrop-blur-md border-t-4 border-slate-900 px-5 pt-5 pb-10 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <button disabled={!canGenerate} onClick={() => setView('report')}
              className={`w-full flex items-center justify-center gap-3 rounded-[1.5rem] py-6 text-2xl font-black transition-all select-none
                ${canGenerate ? 'bg-slate-900 text-white shadow-lg active:scale-95 active:bg-slate-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
              <FileText className="w-7 h-7"/>產生財務保障分析報表<ChevronRight className="w-7 h-7"/>
            </button>
            {!canGenerate && <p className="text-center text-sm font-bold text-slate-400 mt-3">請先填入客戶姓名以啟用報表功能</p>}
          </div>
        </div>
      </div>
    </div>
  )

  // ═══════════════ REPORT VIEW ═══════════════════════════════════
  const savingsStatus = (savingsRate>=30 ? 'good' : savingsRate>=20 ? 'warn' : 'bad') as 'good'|'warn'|'bad'
  const emerStatus    = (emerMonths>=emerTarget ? 'good' : emerMonths>=emerTarget*0.6 ? 'warn' : 'bad') as 'good'|'warn'|'bad'
  const coverStatus   = (toNum(form.life.amount)>0 && toNum(form.critical.amount)>0 ? 'good' : 'warn') as 'good'|'warn'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/80 shadow-2xl">
        <div className="max-w-3xl mx-auto px-5 py-5 flex items-center gap-4">
          <button onClick={() => setView('input')}
            className="w-12 h-12 rounded-2xl bg-slate-700 hover:bg-slate-600 active:bg-slate-500 flex items-center justify-center flex-shrink-0 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white"/>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Financial Defense Report</p>
            <h1 className="text-xl font-black text-white leading-tight truncate">「{form.name}」的財務保障分析表</h1>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">分析日期</p>
            <p className="text-sm font-black text-slate-300">{new Date().toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'})}</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-7">

        {/* Profile strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {label:'當前年齡', value:`${age} 歲`},
            {label:'性別',     value:form.gender==='male'?'男性':'女性'},
            {label:'退休目標', value:`${form.retireAge} 歲`},
            {label:'距退休',   value:`${Math.max(retireAge-age,0)} 年`},
          ].map(item => (
            <div key={item.label} className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4 text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* KPI */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-500"/>財務健康指標
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Kpi label="儲蓄效率"  value={`${savingsRate.toFixed(1)}%`}  sub={`年儲蓄 ${fmt(annualSavings)} 元`} status={savingsStatus} icon={<PiggyBank className="w-4 h-4"/>}/>
            <Kpi label="流動準備金" value={`${emerMonths.toFixed(1)} 個月`} sub={`目標 ${emerTarget} 個月 | ${emerMonths>=emerTarget?'✓ 達標':'⚠ 不足'}`} status={emerStatus} icon={<Banknote className="w-4 h-4"/>}/>
            <Kpi label="資產總值"  value={`${fmt(assets)} 元`} sub={`年保費 ${fmt(totalPremium)} 元 (${premiumRatio.toFixed(1)}%)`} status="neutral" icon={<Target className="w-4 h-4"/>}/>
            <Kpi label="保障完整度" value={coverStatus==='good'?'核心達標':'有缺口'}
              sub={`壽 ${toNum(form.life.amount)>0?'✓':'✗'} | 重傷 ${toNum(form.critical.amount)>0?'✓':'✗'} | 癌 ${toNum(form.cancer.amount)>0?'✓':'✗'}`}
              status={coverStatus} icon={<ShieldCheck className="w-4 h-4"/>}/>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-violet-400"/>資產複利成長預估
            </p>
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">退休時預估資產</p>
                  <p className="text-5xl font-black text-sky-400 mt-1">{fmt(retireValue)}<span className="text-xl text-slate-400 ml-1">元</span></p>
                  <p className="text-xs text-slate-600 mt-1.5">現有 {fmt(assets)} + 年儲蓄 {fmt(annualSavings)} × {Math.max(retireAge-age,0)}年 @ {form.roi}%</p>
                </div>
                <div className="rounded-2xl bg-slate-800 px-5 py-4 text-right">
                  <p className="text-xs text-slate-500">年化報酬</p>
                  <p className="text-4xl font-black text-violet-400">{form.roi}<span className="text-base text-slate-400">%</span></p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{top:10,right:8,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.55}/>
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.03}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="age" stroke="#334155" tick={{fill:'#64748b',fontSize:12,fontWeight:700}}
                    label={{value:'年齡',position:'insideBottomRight',fill:'#475569',fontSize:12,dy:4}}/>
                  <YAxis stroke="#334155" tick={{fill:'#64748b',fontSize:11,fontWeight:700}}
                    tickFormatter={v => fmt(v as number)} width={72}/>
                  <Tooltip content={<ChartTip/>}/>
                  {retireAge>0 && (
                    <ReferenceLine x={retireAge} stroke="#f59e0b" strokeDasharray="6 3" strokeWidth={2}
                      label={{value:'退休',fill:'#f59e0b',fontSize:13,fontWeight:700,position:'insideTopLeft'}}/>
                  )}
                  <Area type="monotone" dataKey="資產總值" stroke="#0ea5e9" strokeWidth={3}
                    fill="url(#ag)" dot={false} activeDot={{r:7,fill:'#0ea5e9',stroke:'#fff',strokeWidth:2}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Coverage summary */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400"/>保障配置總覽
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5">
              <p className="text-sm font-black text-violet-400 mb-3 flex items-center gap-2"><Heart className="w-4 h-4"/>醫療險</p>
              <CoverRow label="住院日額（定額）" value={form.med.hospDailyFixed} unit="元/日"/>
              <CoverRow label="住院日額（實支）" value={form.med.hospDailySI}    unit="元/日"/>
              <CoverRow label="手術給付（實支）" value={form.med.hospSurgSI}     unit="元/次"/>
              <CoverRow label="醫療雜費（實支）" value={form.med.miscSI}         unit="元"/>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between">
                <span className="text-xs text-slate-500">年保費</span>
                <span className="text-sm font-black text-slate-300">{fmt(toNum(form.med.premium))} 元</span>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5">
              <p className="text-sm font-black text-sky-400 mb-3 flex items-center gap-2"><Shield className="w-4 h-4"/>五大險種</p>
              <CoverRow label="壽險身故保額"   value={form.life.amount}     unit="元"/>
              <CoverRow label="意外身故保額"   value={form.acc.death}       unit="元"/>
              <CoverRow label="意外實支上限"   value={form.acc.si}          unit="元"/>
              <CoverRow label="重大傷病一次金" value={form.critical.amount} unit="元"/>
              <CoverRow label="癌症一次金"     value={form.cancer.amount}   unit="元"/>
              <CoverRow label="長照一次金"     value={form.ltc.lump}        unit="元"/>
              <CoverRow label="長照月扶助金"   value={form.ltc.monthly}     unit="元/月"/>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between">
                <span className="text-xs text-slate-500">五大險年保費</span>
                <span className="text-sm font-black text-slate-300">
                  {fmt([form.life.premium,form.acc.premium,form.critical.premium,form.cancer.premium,form.ltc.premium].reduce((s,v)=>s+toNum(v),0))} 元
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-slate-400"/>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-black">年度總保費</p>
                <p className="text-xs text-slate-500 mt-0.5">佔年收入 {income>0?premiumRatio.toFixed(1):'—'}%{premiumRatio>15&&income>0?' ⚠ 偏高':''}</p>
              </div>
            </div>
            <p className="text-4xl font-black text-white">{fmt(totalPremium)} <span className="text-lg font-bold text-slate-400">元</span></p>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400"/>風險預警系統
          </p>
          <div className="space-y-3">{alerts.map((a,i) => <AlertBadge key={i} {...a}/>)}</div>
        </div>

        {/* Retirement */}
        {retireAge > age && (
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400"/>退休規劃摘要
            </p>
            <div className="grid grid-cols-3 gap-5">
              {[
                {label:'距退休年數',  value:`${retireAge-age} 年`,        sub:`${age} → ${retireAge} 歲`},
                {label:'年儲蓄額',   value:fmt(annualSavings)+' 元',    sub:`ROI ${roi}% 複利成長`},
                {label:'退休預估資產', value:fmt(retireValue)+' 元',     sub:'含複利效果'},
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-black text-slate-500 mb-2">{item.label}</p>
                  <p className="text-xl font-black text-amber-400 leading-tight">{item.value}</p>
                  <p className="text-xs text-slate-600 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-center">
          <p className="text-sm font-bold text-slate-500">本報表係依輸入數據自動生成，僅供財務面談參考使用。</p>
          <p className="text-xs text-slate-600 mt-1.5">所有保障額度及財務規劃均應以實際保單條款及個人財務狀況為準。建議每年定期複審。</p>
          <p className="text-xs text-slate-700 mt-3 font-mono">Generated {new Date().toLocaleString('zh-TW')} · Wealth Defense System v3</p>
        </div>
      </div>
    </div>
  )
}
