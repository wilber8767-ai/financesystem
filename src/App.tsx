import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  const [showReport, setShowReport] = useState(false);

  // 財務數據
  const [finance, setFinance] = useState({
    income: 1200000, expense: 600000, currentAsset: 1000000, roi: 6
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
    cancer: { lumpSum: 0, chemo: 0, premium: 0 },
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
      return { year: i, balance: Math.round(bal / 10000) };
    });
  }, [metrics.netSavings, finance.roi, finance.currentAsset]);

  if (showReport) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 animate-in slide-in-from-right duration-500">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-white/10 pb-8">
            <div>
              <h1 className="text-4xl font-black">現況分析計劃書</h1>
              <p className="text-slate-400 mt-2 italic font-mono uppercase tracking-widest">Confidential Financial Report</p>
            </div>
            <button onClick={() => setShowReport(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-all">返回修改數據</button>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
              <p className="text-slate-400 text-xs font-bold mb-2">年度結餘</p>
              <p className="text-3xl font-black text-emerald-400">${(metrics.netSavings/10000).toFixed(1)}萬</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
              <p className="text-slate-400 text-xs font-bold mb-2">保障年成本</p>
              <p className="text-3xl font-black text-rose-400">${(metrics.totalPremium/10000).toFixed(1)}萬</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
              <p className="text-slate-400 text-xs font-bold mb-2">儲蓄效率</p>
              <p className="text-3xl font-black text-indigo-400">{metrics.savingsRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
              <p className="text-slate-400 text-xs font-bold mb-2">預備金安全度</p>
              <p className="text-3xl font-black text-blue-400">{metrics.emergencyFund.toFixed(1)}月</p>
            </div>
          </div>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> 專業缺口診斷
            </h3>
            <div className="grid gap-4">
              {insurance.medical.misc < 200000 && <div className="p-6 bg-rose-500/10 border-l-4 border-rose-500 rounded-xl text-rose-100">⚠️ <span className="font-bold">醫療雜費風險：</span>目前雜費僅 {insurance.medical.misc/10000} 萬。面對現代高額自費手術（如達文西、高階醫材），既有額度無法提供足夠支撐，恐動用本金支付醫療費。</div>}
              {metrics.emergencyFund < 6 && <div className="p-6 bg-amber-500/10 border-l-4 border-amber-500 rounded-xl text-amber-100">⚠️ <span className="font-bold">流動性風險：</span>緊急預備金不足 6 個月支出。建議優先優化現金儲備，避免因突發狀況被迫中斷長期投資計畫。</div>}
              {metrics.savingsRate < 20 && <div className="p-6 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-xl text-indigo-100">📈 <span className="font-bold">複利效率：</span>儲蓄率低於 20%，長期財富累積速度可能無法追上目標。建議檢視支出結構，提升每月提撥額。</div>}
            </div>
          </section>

          <section className="bg-white/5 p-10 rounded-[3rem] border border-white/5">
            <h3 className="text-xl font-bold mb-10 text-center">25 年長期資產預估（含複利效應）</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="col" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" fontSize={12} tickFormatter={(v) => `第${v}年`} />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px'}} />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="url(#col)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-slate-500 mt-8">預計 25 年後資產淨值約：<span className="text-emerald-400 font-bold text-2xl">${chartData[25].balance} 萬</span></p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-4xl font-black text-indigo-800">財富防禦管理系統</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-tighter text-sm">Professional Financial Strategy</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black">業務主任專用版</div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* 第一區塊：財務管理系統 */}
        <section className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-indigo-900">
            <span className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-xl">💰</span>
            財務現況與資產配置
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: '目前存量資產', key: 'currentAsset' },
              { label: '年度總收入', key: 'income' },
              { label: '年度生活支出', key: 'expense' },
              { label: '預期年化報酬 (%)', key: 'roi' }
            ].map(item => (
              <div key={item.key}>
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</label>
                <input type="number" className="w-full text-2xl font-bold p-4 mt-3 bg-white rounded-2xl shadow-inner border-none focus:ring-4 focus:ring-indigo-100 outline-none transition-all" 
                  value={finance[item.key as keyof typeof finance]} 
                  onChange={e => setFinance({...finance, [item.key]: Number(e.target.value)})} />
              </div>
            ))}
          </div>
        </section>

        {/* 第二區塊：保險保障系統 */}
        <section className="bg-white p-10 rounded-[3rem] border-2 border-blue-50 shadow-lg space-y-10">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-blue-900">
            <span className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl">🛡️</span>
            六大保險防禦清單
          </h2>
          
          {/* 醫療險細節 (切割清楚的佈局) */}
          <div className="bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-100 space-y-6">
            <h3 className="font-bold text-blue-800 border-b border-blue-100 pb-4">🏥 醫療實支與給付細項</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div><label className="text-xs font-bold text-slate-400">住院日額(定額)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl bg-white border-none shadow-sm" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyFixed: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-blue-500">住院日額(實支)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl border-2 border-blue-200" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyReimburse: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-red-500">醫療雜費(實支)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl border-2 border-red-200 font-bold" value={insurance.medical.misc} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, misc: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-indigo-500 underline">該類年繳保費</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl bg-indigo-50 border-none font-bold text-indigo-700" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, premium: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-slate-400">住院手術(定額)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl bg-white border-none" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, surgFixed: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-blue-500">住院手術(實支)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl border-2 border-blue-200" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, surgReimburse: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-slate-400">門診手術(定額)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl bg-white border-none" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicFixed: Number(e.target.value)}})} /></div>
              <div><label className="text-xs font-bold text-blue-500">門診手術(實支)</label><input type="number" className="w-full text-xl p-3 mt-2 rounded-xl border-2 border-blue-200" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicReimburse: Number(e.target.value)}})} /></div>
            </div>
          </div>

          {/* 其他五大險種 (精確佈局) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: '壽險', key: 'life', icon: '👤', fields: [{l:'身故金', k:'deathBenefit'}] },
              { title: '意外險', key: 'accident', icon: '⚡', fields: [{l:'意外身故', k:'death'}, {l:'意外實支', k:'reimburse'}] },
              { title: '重大傷病', key: 'major', icon: '🛡️', fields: [{l:'一次金', k:'lumpSum'}] },
              { title: '癌症險', key: 'cancer', icon: '🎗️', fields: [{l:'一次金', k:'lumpSum'}, {l:'化放療', k:'chemo'}] },
              { title: '長照險', key: 'ltc', icon: '👵', fields: [{l:'一次金', k:'lumpSum'}, {l:'每月給付', k:'monthly'}] }
            ].map(item => (
              <div key={item.key} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">{item.icon} {item.title}</h3>
                {item.fields.map(f => (
                  <div key={f.k} className="mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{f.l}</label>
                    <input type="number" className="w-full p-3 mt-1 bg-white rounded-xl border-none shadow-sm" />
                  </div>
                ))}
                <div className="pt-4 border-t mt-4">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">該險種年保費</label>
                  <input type="number" className="w-full p-3 mt-1 bg-indigo-50 rounded-xl font-bold text-indigo-700 border-none" 
                    onChange={e => setInsurance({...insurance, [item.key]: {...insurance[item.key as keyof typeof insurance], premium: Number(e.target.value)}})} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => setShowReport(true)} className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black rounded-[2.5rem] shadow-2xl shadow-indigo-200 transform transition-transform active:scale-95">產生現況計劃報表</button>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pb-10 text-center text-slate-300 text-sm font-bold">
        © 2026 財務策略中心 | 李偉誠業務主任 專屬開發
      </footer>
    </div>
  );
};

export default App;
