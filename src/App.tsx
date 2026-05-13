import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App = () => {
  const [finance, setFinance] = useState({
    income: 1200000,
    expense: 600000,
    targetMonthlyPassive: 50000,
    roi: 6,
    currentAsset: 1000000
  });

  const [insurance, setInsurance] = useState({
    life: { deathBenefit: 0, premium: 0 },
    accident: { death: 0, reimburse: 0, daily: 0, premium: 0 },
    medical: { dailyFixed: 0, dailyReimburse: 0, surgeryFixed: 0, surgeryReimburse: 0, clinicFixed: 0, clinicReimburse: 0, miscReimburse: 0, premium: 0 },
    majorIllness: { lumpSum: 0, premium: 0 },
    cancer: { lumpSum: 0, daily: 0, chemo: 0, radiation: 0, surgery: 0, premium: 0 },
    longTermCare: { lumpSum: 0, monthly: 0, premium: 0 }
  });

  const metrics = useMemo(() => {
    const totalPremium = Object.values(insurance).reduce((acc, curr) => acc + curr.premium, 0);
    const netSavings = finance.income - finance.expense - totalPremium;
    const savingsRate = (netSavings / finance.income) * 100;
    const emergencyFundMonths = finance.currentAsset / (finance.expense / 12);
    return { totalPremium, netSavings, savingsRate, emergencyFundMonths };
  }, [insurance, finance]);

  const chartData = useMemo(() => {
    let balance = finance.currentAsset;
    return Array.from({ length: 26 }).map((_, i) => {
      const year = i;
      if (i > 0) balance = (balance + metrics.netSavings) * (1 + finance.roi / 100);
      return { year: `第${year}年`, balance: Math.round(balance / 10000) };
    });
  }, [metrics.netSavings, finance.roi, finance.currentAsset]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      {/* 頂部導航欄設計感 */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">W</div>
            <span className="text-xl font-black tracking-tight text-slate-800">WealthGuard <span className="text-indigo-600 text-sm font-medium">Pro 2.0</span></span>
          </div>
          <div className="hidden md:flex gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">系統運行中</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* 左側：數據輸入面板 */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* 財務指標 KPI 卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold">儲蓄率</p>
              <p className="text-2xl font-black text-indigo-600">{metrics.savingsRate.toFixed(1)}%</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{width: `${Math.min(metrics.savingsRate, 100)}%`}}></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold">預備金水位</p>
              <p className="text-2xl font-black text-blue-600">{metrics.emergencyFundMonths.toFixed(1)}月</p>
              <p className="text-[10px] text-slate-400 mt-1">目標: 6.0月</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold">年保費支出</p>
              <p className="text-2xl font-black text-rose-500">${(metrics.totalPremium/10000).toFixed(1)}萬</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold">年淨結餘</p>
              <p className="text-2xl font-black text-emerald-500">${(metrics.netSavings/10000).toFixed(1)}萬</p>
            </div>
          </div>

          {/* 1. 核心財務設定 */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-lg">💰</span>
                資產與現金流配置
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-500 ml-1">目前存量資產</label>
                <input type="number" className="w-full text-xl p-4 mt-2 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={finance.currentAsset} onChange={e => setFinance({...finance, currentAsset: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-500 ml-1">年度總收入</label>
                <input type="number" className="w-full text-xl p-4 mt-2 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" value={finance.income} onChange={e => setFinance({...finance, income: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-500 ml-1">年度生活支出</label>
                <input type="number" className="w-full text-xl p-4 mt-2 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" value={finance.expense} onChange={e => setFinance({...finance, expense: Number(e.target.value)})} />
              </div>
            </div>
          </section>

          {/* 2. 六大保險防線 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[2rem] border border-indigo-100">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">🏥 醫療保障深度診斷</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/60 p-4 rounded-xl backdrop-blur-md">
                  <label className="text-xs font-bold text-slate-500">雜費實支限額</label>
                  <input type="number" className="w-full bg-transparent text-xl font-bold border-b-2 border-indigo-200 outline-none py-1" value={insurance.medical.miscReimburse} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, miscReimburse: Number(e.target.value)}})} />
                </div>
                <div className="bg-white/60 p-4 rounded-xl backdrop-blur-md">
                  <label className="text-xs font-bold text-slate-500">醫療險年保費</label>
                  <input type="number" className="w-full bg-transparent text-xl font-bold border-b-2 border-indigo-200 outline-none py-1" value={insurance.medical.premium} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, premium: Number(e.target.value)}})} />
                </div>
                <div className="bg-white/60 p-4 rounded-xl backdrop-blur-md">
                  <label className="text-xs font-bold text-slate-500">住院日額(實支)</label>
                  <input type="number" className="w-full bg-transparent text-xl font-bold border-b-2 border-indigo-200 outline-none py-1" value={insurance.medical.dailyReimburse} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyReimburse: Number(e.target.value)}})} />
                </div>
                <div className="bg-white/60 p-4 rounded-xl backdrop-blur-md">
                  <label className="text-xs font-bold text-slate-500">門診手術(實支)</label>
                  <input type="number" className="w-full bg-transparent text-xl font-bold border-b-2 border-indigo-200 outline-none py-1" value={insurance.medical.clinicReimburse} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicReimburse: Number(e.target.value)}})} />
                </div>
              </div>
            </section>

            {[
              { title: '壽險', key: 'life', icon: '👤', fields: ['身故金'] },
              { title: '意外險', key: 'accident', icon: '⚡', fields: ['意外身故', '意外實支', '意外日額'] },
              { title: '重大傷病', key: 'majorIllness', icon: '🛡️', fields: ['一次金'] },
              { title: '癌症險', key: 'cancer', icon: '🎗️', fields: ['一次金', '日額', '化放療'] },
              { title: '長照險', key: 'longTermCare', icon: '👵', fields: ['一次金', '月給付金'] }
            ].map(item => (
              <div key={item.key} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                </div>
                <div className="space-y-4">
                  {item.fields.map(f => (
                    <div key={f}><p className="text-[10px] font-bold text-slate-400 uppercase">{f}</p><input type="number" className="w-full p-2 bg-slate-50 rounded-lg border-none focus:ring-1 focus:ring-slate-300 outline-none" /></div>
                  ))}
                  <div className="pt-2 border-t mt-2">
                    <p className="text-[10px] font-bold text-indigo-400">年度保費</p>
                    <input type="number" className="w-full p-2 bg-indigo-50/50 rounded-lg border-none text-indigo-700 font-bold outline-none" onChange={e => setInsurance({...insurance, [item.key]: {...insurance[item.key as keyof typeof insurance], premium: Number(e.target.value)}})} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：智能診斷面板 */}
        <div className="xl:col-span-4 space-y-6">
          <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24 border border-slate-800">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              專業分析報告
            </h2>

            <div className="space-y-6">
              {/* 核心指標顯示 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">年度保費總計</p>
                  <p className="text-2xl font-mono">${metrics.totalPremium.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">月均儲蓄</p>
                  <p className="text-2xl font-mono text-emerald-400">${Math.round(metrics.netSavings/12).toLocaleString()}</p>
                </div>
              </div>

              {/* 診斷區 */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">診斷與建議</h4>
                <div className="space-y-3">
                  {insurance.medical.miscReimburse < 200000 && <div className="p-4 bg-rose-500/10 border-l-4 border-rose-500 rounded-lg text-xs leading-relaxed">⚠️ <span className="text-rose-300 font-bold">醫療風險：</span>雜費限額嚴重不足，無法應對現代微創手術自費趨勢。</div>}
                  {metrics.emergencyFundMonths < 6 && <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-lg text-xs leading-relaxed">⚠️ <span className="text-amber-300 font-bold">流動性風險：</span>預備金不足 6 個月支出，建議優先補足現金流。</div>}
                  {metrics.savingsRate < 20 && <div className="p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded-lg text-xs leading-relaxed">📉 <span className="text-orange-300 font-bold">財富效率：</span>儲蓄率低於 20%，長期目標達成壓力極大。</div>}
                  {metrics.netSavings > 0 && <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-lg text-xs leading-relaxed">💎 <span className="text-emerald-300 font-bold">正面評價：</span>具備穩定的財富種子，建議啟動複利配置。</div>}
                </div>
              </div>

              {/* 資產預測視覺化 */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">25年資產預測</h4>
                    <p className="text-[10px] text-slate-500">單位：萬元</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400">+{finance.roi}%</p>
                    <p className="text-[10px] text-slate-500">預期年報酬</p>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="year" stroke="#475569" fontSize={10} tickCount={5} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px'}} />
                      <Area type="monotone" dataKey="balance" stroke="#6366f1" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
