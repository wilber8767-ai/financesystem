import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App = () => {
  const [step, setStep] = useState(1); // 1: 財務, 2: 保險, 3: 報告

  // 財務數據
  const [finance, setFinance] = useState({
    income: 1200000, expense: 600000, targetMonthlyPassive: 50000, roi: 6, currentAsset: 1000000
  });

  // 保險數據
  const [insurance, setInsurance] = useState({
    life: { deathBenefit: 0, premium: 0 },
    accident: { death: 0, reimburse: 0, daily: 0, premium: 0 },
    medical: { 
      dailyFixed: 0, dailyReimburse: 0, 
      surgFixed: 0, surgReimburse: 0,
      clinicFixed: 0, clinicReimburse: 0,
      misc: 0, premium: 0 
    },
    major: { lumpSum: 0, premium: 0 },
    cancer: { lumpSum: 0, daily: 0, chemo: 0, radio: 0, surg: 0, premium: 0 },
    ltc: { lumpSum: 0, monthly: 0, premium: 0 }
  });

  const metrics = useMemo(() => {
    const totalPremium = Object.values(insurance).reduce((acc, curr) => acc + curr.premium, 0);
    const netSavings = finance.income - finance.expense - totalPremium;
    const savingsRate = (netSavings / finance.income) * 100;
    const emergencyFund = finance.currentAsset / (finance.expense / 12 || 1);
    return { totalPremium, netSavings, savingsRate, emergencyFund };
  }, [insurance, finance]);

  const chartData = useMemo(() => {
    let bal = finance.currentAsset;
    return Array.from({ length: 26 }).map((_, i) => {
      if (i > 0) bal = (bal + metrics.netSavings) * (1 + finance.roi / 100);
      return { year: `第${i}年`, balance: Math.round(bal / 10000) };
    });
  }, [metrics.netSavings, finance.roi, finance.currentAsset]);

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <span className="bg-indigo-600 text-white p-2 rounded-xl text-xl">01</span> 現金流與資產配置
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: '目前存量資產', key: 'currentAsset' },
            { label: '年度總收入', key: 'income' },
            { label: '年度生活支出', key: 'expense' },
            { label: '預期年化報酬 (%)', key: 'roi' }
          ].map(item => (
            <div key={item.key}>
              <label className="text-lg font-bold text-slate-500 ml-1">{item.label}</label>
              <input type="number" className="w-full text-2xl p-5 mt-2 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all" 
                value={finance[item.key as keyof typeof finance]} 
                onChange={e => setFinance({...finance, [item.key]: Number(e.target.value)})} />
            </div>
          ))}
        </div>
      </section>
      <button onClick={() => setStep(2)} className="w-full py-6 bg-indigo-600 text-white text-2xl font-black rounded-3xl shadow-lg hover:bg-indigo-700 transition-all">下一步：輸入保障規劃</button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-100">
        <h2 className="text-3xl font-black text-blue-800 mb-8 flex items-center gap-3">
          <span className="bg-blue-600 text-white p-2 rounded-xl text-xl">02</span> 醫療防禦細項
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><label className="text-sm font-bold text-slate-500">住院日額(定額)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-slate-50 rounded-xl" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyFixed: Number(e.target.value)}})} /></div>
          <div><label className="text-sm font-bold text-blue-600">住院日額(實支)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-blue-50/50 rounded-xl border border-blue-100" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyReimburse: Number(e.target.value)}})} /></div>
          <div><label className="text-sm font-bold text-red-600">醫療雜費(實支)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-red-50/50 rounded-xl border border-red-100 font-bold" value={insurance.medical.misc} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, misc: Number(e.target.value)}})} /></div>
          <div><label className="text-sm font-bold text-slate-500">住院手術(定額)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-slate-50 rounded-xl" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, surgFixed: Number(e.target.value)}})} /></div>
          <div><label className="text-sm font-bold text-blue-600">住院手術(實支)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-blue-50/50 rounded-xl border border-blue-100" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, surgReimburse: Number(e.target.value)}})} /></div>
          <div><label className="text-sm font-bold text-slate-500">門診手術(定額)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-slate-50 rounded-xl" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicFixed: Number(e.target.value)}})} /></div>
          <div><label className="text-sm font-bold text-blue-600">門診手術(實支)</label><input type="number" className="w-full text-xl p-4 mt-1 bg-blue-50/50 rounded-xl border border-blue-100" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicReimburse: Number(e.target.value)}})} /></div>
          <div className="sm:col-span-2 lg:col-span-2"><label className="text-sm font-bold text-indigo-700">醫療險年保費</label><input type="number" className="w-full text-xl p-4 mt-1 bg-indigo-50 rounded-xl border border-indigo-200" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, premium: Number(e.target.value)}})} /></div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: '壽險', key: 'life', icon: '👤', fields: [{l:'身故金', k:'deathBenefit'}] },
          { title: '意外險', key: 'accident', icon: '⚡', fields: [{l:'意外身故', k:'death'}, {l:'意外實支', k:'reimburse'}] },
          { title: '重大傷病', key: 'major', icon: '🛡️', fields: [{l:'一次金', k:'lumpSum'}] },
          { title: '癌症險', key: 'cancer', icon: '🎗️', fields: [{l:'一次金', k:'lumpSum'}, {l:'化放療', k:'chemo'}] },
          { title: '長照險', key: 'ltc', icon: '👵', fields: [{l:'一次金', k:'lumpSum'}, {l:'每月給付', k:'monthly'}] }
        ].map(item => (
          <div key={item.key} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{item.icon} {item.title}</h3>
            {item.fields.map(f => (
              <div key={f.k} className="mb-4">
                <label className="text-xs font-bold text-slate-400">{f.l}</label>
                <input type="number" className="w-full p-3 bg-slate-50 rounded-xl" />
              </div>
            ))}
            <div className="pt-4 border-t mt-4">
              <label className="text-xs font-bold text-indigo-500">該類年保費</label>
              <input type="number" className="w-full p-3 bg-indigo-50 rounded-xl font-bold" onChange={e => setInsurance({...insurance, [item.key]: {...insurance[item.key as keyof typeof insurance], premium: Number(e.target.value)}})} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-200 text-slate-700 text-xl font-bold rounded-3xl">上一步</button>
        <button onClick={() => setStep(3)} className="flex-[2] py-6 bg-indigo-600 text-white text-2xl font-black rounded-3xl shadow-lg">產生分析報表</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in slide-in-from-bottom duration-700 max-w-5xl mx-auto space-y-10">
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-2">財務與保障綜合診斷書</h2>
          <p className="text-slate-400">系統分析時間：2026/05/13</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/5 p-6 rounded-3xl text-center">
            <p className="text-slate-400 text-xs font-bold mb-2">儲蓄率</p>
            <p className="text-3xl font-black text-indigo-400">{metrics.savingsRate.toFixed(1)}%</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl text-center">
            <p className="text-slate-400 text-xs font-bold mb-2">預備金水位</p>
            <p className="text-3xl font-black text-blue-400">{metrics.emergencyFund.toFixed(1)}月</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl text-center">
            <p className="text-slate-400 text-xs font-bold mb-2">年保費總計</p>
            <p className="text-3xl font-black text-rose-400">${(metrics.totalPremium/10000).toFixed(1)}萬</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl text-center">
            <p className="text-slate-400 text-xs font-bold mb-2">年淨結餘</p>
            <p className="text-3xl font-black text-emerald-400">${(metrics.netSavings/10000).toFixed(1)}萬</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold border-l-4 border-indigo-500 pl-4">核心缺口診斷</h3>
          <div className="grid gap-4">
            {insurance.medical.misc < 200000 && <div className="p-6 bg-rose-500/20 border border-rose-500/50 rounded-3xl">⚠️ <span className="font-bold text-rose-300">醫療缺口：</span>雜費實支僅 {insurance.medical.misc/10000} 萬，嚴重低於市場建議的 20 萬水位，恐侵蝕現有資產。</div>}
            {metrics.emergencyFund < 6 && <div className="p-6 bg-amber-500/20 border border-amber-500/50 rounded-3xl">⚠️ <span className="font-bold text-amber-300">流動性風險：</span>緊急預備金不足 6 個月，建議優先補足現金存量。</div>}
            {metrics.savingsRate < 20 && <div className="p-6 bg-orange-500/20 border border-orange-500/50 rounded-3xl">📉 <span className="font-bold text-orange-300">效率警示：</span>儲蓄率低於理財金律 20%，需優化支出或提升收入。</div>}
          </div>
        </div>

        <div className="bg-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-8 text-center">25 年複利資產預估圖 (年化 {finance.roi}%)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="col" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="year" stroke="#475569" fontSize={12} tickCount={6} />
                <YAxis hide />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px'}} />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="url(#col)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-slate-500 mt-4 text-sm">預計第 25 年資產總額：<span className="text-emerald-400 font-bold">${chartData[25].balance} 萬</span></p>
        </div>
      </div>
      <button onClick={() => setStep(1)} className="w-full py-6 bg-slate-100 text-slate-500 font-bold rounded-3xl">重新輸入數據</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 p-4 md:p-10">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="text-2xl font-black text-indigo-700">WealthGuard <span className="text-slate-400 text-sm font-normal">Step {step}/3</span></div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-8 rounded-full ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default App;
