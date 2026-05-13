import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  const [showReport, setShowReport] = useState(false);

  // 1. 客戶基本資料
  const [customer, setCustomer] = useState({
    name: '', birthday: '', gender: '男', age: 0
  });

  // 2. 財務數據
  const [finance, setFinance] = useState({
    income: 1200000, expense: 600000, currentAsset: 1000000, investmentAsset: 0, emergencyGoal: 6, retireAge: 65, roi: 6
  });

  // 3. 保險數據
  const [insurance, setInsurance] = useState({
    life: { deathBenefit: 0, premium: 0 },
    accident: { death: 0, reimburse: 0, daily: 0, premium: 0 },
    medical: { dailyFixed: 0, dailyReimburse: 0, surgFixed: 0, surgReimburse: 0, clinicFixed: 0, clinicReimburse: 0, misc: 0, premium: 0 },
    major: { lumpSum: 0, premium: 0 },
    cancer: { lumpSum: 0, chemo: 0, premium: 0 },
    ltc: { lumpSum: 0, monthly: 0, premium: 0 }
  });

  useEffect(() => {
    if (customer.birthday) {
      const birthDate = new Date(customer.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
      setCustomer(prev => ({ ...prev, age: age > 0 ? age : 0 }));
    }
  }, [customer.birthday]);

  const metrics = useMemo(() => {
    const totalPremium = Object.values(insurance).reduce((acc, curr) => acc + (curr.premium || 0), 0);
    const netSavings = finance.income - finance.expense - totalPremium;
    const savingsRate = (netSavings / finance.income) * 100;
    const totalCurrentAsset = finance.currentAsset + finance.investmentAsset;
    const emergencyFundStatus = totalCurrentAsset / (finance.expense / 12 || 1);
    const yearsToRetire = finance.retireAge - customer.age;
    return { totalPremium, netSavings, savingsRate, emergencyFundStatus, yearsToRetire, totalCurrentAsset };
  }, [insurance, finance, customer.age]);

  const chartData = useMemo(() => {
    let bal = metrics.totalCurrentAsset;
    const duration = Math.max(metrics.yearsToRetire, 25);
    return Array.from({ length: duration + 1 }).map((_, i) => {
      if (i > 0) bal = (bal + metrics.netSavings) * (1 + finance.roi / 100);
      return { year: i, age: customer.age + i, balance: Math.round(bal / 10000) };
    });
  }, [metrics.netSavings, finance.roi, metrics.totalCurrentAsset, customer.age, metrics.yearsToRetire]);

  if (showReport) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 animate-in slide-in-from-right duration-500 font-sans">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-white/10 pb-8">
            <h1 className="text-4xl font-black italic">「{customer.name || '客戶'}」的財務保障分析表</h1>
            <button onClick={() => setShowReport(false)} className="px-8 py-3 bg-indigo-600 rounded-2xl font-bold">修改數據</button>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/10">
              <p className="text-slate-400 text-sm mb-1">儲蓄效率</p>
              <p className="text-3xl font-black text-indigo-400">{metrics.savingsRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/10">
              <p className="text-slate-400 text-sm mb-1">預備金安全度</p>
              <p className={`text-3xl font-black ${metrics.emergencyFundStatus >= finance.emergencyGoal ? 'text-emerald-400' : 'text-rose-400'}`}>{metrics.emergencyFundStatus.toFixed(1)}月</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/10">
              <p className="text-slate-400 text-sm mb-1">年保障支出</p>
              <p className="text-3xl font-black text-rose-400">${(metrics.totalPremium/10000).toFixed(1)}萬</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/10">
              <p className="text-slate-400 text-sm mb-1">退休倒數</p>
              <p className="text-3xl font-black text-blue-400">{metrics.yearsToRetire}年</p>
            </div>
          </div>
          <section className="bg-white/5 p-10 rounded-[3rem] text-center border border-white/10">
            <h3 className="text-xl font-bold mb-8">資產預測圖：{customer.age} 歲至 {finance.retireAge} 歲</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="age" stroke="#475569" fontSize={12} tickFormatter={(v) => `${v}歲`} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="#6366f133" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8 font-sans text-slate-900">
      <main className="max-w-6xl mx-auto space-y-10">
        
        {/* 客戶基本資料 - 強化標題與字體 */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black mb-8 text-indigo-900 flex items-center gap-2">👤 客戶基本資料</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">客戶姓名</label>
              <input type="text" className="w-full text-xl font-bold p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="輸入姓名" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">出生日期</label>
              <input type="date" className="w-full text-xl font-bold p-4 bg-slate-50 rounded-xl outline-none" value={customer.birthday} onChange={e => setCustomer({...customer, birthday: e.target.value})} />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">性別</label>
              <select className="w-full text-xl font-bold p-4 bg-slate-50 rounded-xl outline-none" value={customer.gender} onChange={e => setCustomer({...customer, gender: e.target.value})}><option value="男">男</option><option value="女">女</option></select>
            </div>
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">目前年齡</label>
              <div className="text-2xl font-black p-4 text-indigo-600">{customer.age} 歲</div>
            </div>
          </div>
        </section>

        {/* 財務現況 - 強化標籤顯示 */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-2">💰 資產與現金流診斷</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div><label className="block text-base font-bold text-slate-700 mb-2">現金/存款總額</label><input type="number" className="w-full text-2xl font-black p-4 bg-slate-50 rounded-xl outline-none" value={finance.currentAsset} onChange={e => setFinance({...finance, currentAsset: Number(e.target.value)})} /></div>
            <div><label className="block text-base font-bold text-slate-700 mb-2">年度總收入</label><input type="number" className="w-full text-2xl font-black p-4 bg-slate-50 rounded-xl outline-none" value={finance.income} onChange={e => setFinance({...finance, income: Number(e.target.value)})} /></div>
            <div><label className="block text-base font-bold text-slate-700 mb-2">年生活支出</label><input type="number" className="w-full text-2xl font-black p-4 bg-slate-50 rounded-xl outline-none" value={finance.expense} onChange={e => setFinance({...finance, expense: Number(e.target.value)})} /></div>
          </div>
        </section>

        {/* 醫療保障 - 修正間距與縮小欄位 */}
        <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-blue-100 space-y-8">
          <h2 className="text-2xl font-black text-blue-900">🛡️ 全方位保障防禦體系</h2>
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-4 pb-2 border-b border-blue-100">🏥 醫療實支與給付</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="block text-sm font-bold text-slate-600 mb-1">住院日額(定額)</label><input type="number" className="w-full p-3 bg-white rounded-lg font-bold" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyFixed: Number(e.target.value)}})} /></div>
              <div><label className="block text-sm font-bold text-blue-600 mb-1">住院日額(實支)</label><input type="number" className="w-full p-3 border-2 border-blue-200 rounded-lg font-bold" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyReimburse: Number(e.target.value)}})} /></div>
              <div><label className="block text-sm font-bold text-rose-600 mb-1 font-black">醫療雜費(實支)</label><input type="number" className="w-full p-3 border-2 border-rose-300 rounded-lg font-black text-rose-700" value={insurance.medical.misc} onChange={e => setInsurance({...insurance, medical: {...insurance.medical, misc: Number(e.target.value)}})} /></div>
              <div><label className="block text-sm font-bold text-indigo-700 mb-1">年度總保費</label><input type="number" className="w-full p-3 bg-indigo-50 rounded-lg font-black text-indigo-700" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, premium: Number(e.target.value)}})} /></div>
            </div>
          </div>

          {/* 其他險種 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '壽險', key: 'life', icon: '👤', fields: [{l:'身故保額', k:'deathBenefit'}] },
              { title: '意外險', key: 'accident', icon: '⚡', fields: [{l:'意外身故', k:'death'}, {l:'意外實支', k:'reimburse'}] },
              { title: '重大傷病', key: 'major', icon: '🛡️', fields: [{l:'一次金保額', k:'lumpSum'}] }
            ].map(item => (
              <div key={item.key} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">{item.icon} {item.title}</h3>
                {item.fields.map(f => (
                  <div key={f.k} className="mb-3">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{f.l}</label>
                    <input type="number" className="w-full p-2 bg-white rounded-lg font-bold" />
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <label className="block text-xs font-bold text-indigo-500">年保費</label>
                  <input type="number" className="w-full p-2 bg-indigo-50 rounded-lg font-bold text-indigo-700" onChange={e => setInsurance({...insurance, [item.key]: {...insurance[item.key as keyof typeof insurance], premium: Number(e.target.value)}})} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => setShowReport(true)} className="w-full py-8 bg-indigo-600 text-white text-3xl font-black rounded-[2rem] shadow-xl active:scale-95 transition-all">產生現況計劃報表</button>
      </main>
    </div>
  );
};

export default App;
