import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  const [showReport, setShowReport] = useState(false);

  // 1. 客戶基本資料
  const [customer, setCustomer] = useState({
    name: '',
    birthday: '',
    gender: '男',
    age: 0
  });

  // 2. 財務數據
  const [finance, setFinance] = useState({
    income: 1200000, 
    expense: 600000, 
    currentAsset: 1000000, 
    investmentAsset: 0, 
    emergencyGoal: 6,   
    retireAge: 65,      
    roi: 6
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

  // 自動計算年齡
  useEffect(() => {
    if (customer.birthday) {
      const birthDate = new Date(customer.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
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
      <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 animate-in slide-in-from-right duration-500">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-white/10 pb-8">
            <div>
              <h1 className="text-4xl font-black">{customer.name || '客戶'} 的財務保障分析表</h1> {/* */}
              <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-sm">WealthGuard Analysis Report</p>
            </div>
            <button onClick={() => setShowReport(false)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-sm font-bold transition-all shadow-lg">修改數據</button>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold mb-2">儲蓄效率</p>
              <p className="text-3xl font-black text-indigo-400">{metrics.savingsRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold mb-2">預備金安全度</p>
              <p className={`text-3xl font-black ${metrics.emergencyFundStatus >= finance.emergencyGoal ? 'text-emerald-400' : 'text-rose-400'}`}>{metrics.emergencyFundStatus.toFixed(1)}月</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold mb-2">年保障支出</p>
              <p className="text-3xl font-black text-rose-400">${(metrics.totalPremium/10000).toFixed(1)}萬</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold mb-2">退休倒數</p>
              <p className="text-3xl font-black text-blue-400">{metrics.yearsToRetire}年</p>
            </div>
          </div>

          <section className="bg-white/5 p-10 rounded-[3rem] border border-white/5">
            <h3 className="text-xl font-bold mb-10 text-center">{customer.age} 歲至 {finance.retireAge} 歲資產預測圖</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="col" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="age" stroke="#475569" fontSize={12} tickFormatter={(v) => `${v}歲`} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px'}} />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="url(#col)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto mb-10 pb-6 border-b-2 border-slate-50">
        <h1 className="text-4xl font-black text-indigo-900 tracking-tighter">WealthGuard <span className="text-indigo-400 font-light italic">Advisor</span></h1>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* 個人資料區 */}
        <section className="bg-indigo-50 p-10 rounded-[3rem] border-2 border-indigo-100 shadow-sm">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-indigo-900">👤 客戶基本資料</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div><label className="text-xs font-black text-slate-400 uppercase">姓名</label><input type="text" className="w-full text-2xl font-bold p-4 mt-2 bg-white rounded-2xl outline-none" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} /></div>
            <div><label className="text-xs font-black text-slate-400 uppercase">生日</label><input type="date" className="w-full text-2xl font-bold p-4 mt-2 bg-white rounded-2xl outline-none" value={customer.birthday} onChange={e => setCustomer({...customer, birthday: e.target.value})} /></div>
            <div><label className="text-xs font-black text-slate-400 uppercase">性別</label><select className="w-full text-2xl font-bold p-4 mt-2 bg-white rounded-2xl outline-none" value={customer.gender} onChange={e => setCustomer({...customer, gender: e.target.value})}><option value="男">男</option><option value="女">女</option></select></div>
            <div><label className="text-xs font-black text-slate-400 uppercase">目前年齡</label><div className="w-full text-2xl font-bold p-4 mt-2 bg-slate-100 rounded-2xl text-slate-500">{customer.age} 歲</div></div>
          </div>
        </section>

        {/* 財務與保障欄位與先前版本相同... */}
        <section className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800">💰 資產與現金流診斷</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div><label className="text-xs font-black text-slate-400">現金/存款資產</label><input type="number" className="w-full text-2xl font-bold p-4 mt-2 bg-white rounded-2xl outline-none" value={finance.currentAsset} onChange={e => setFinance({...finance, currentAsset: Number(e.target.value)})} /></div>
            <div><label className="text-xs font-black text-slate-400">年度總收入</label><input type="number" className="w-full text-2xl font-bold p-4 mt-2 bg-white rounded-2xl outline-none" value={finance.income} onChange={e => setFinance({...finance, income: Number(e.target.value)})} /></div>
            <div><label className="text-xs font-black text-slate-400">年生活支出</label><input type="number" className="w-full text-2xl font-bold p-4 mt-2 bg-white rounded-2xl outline-none" value={finance.expense} onChange={e => setFinance({...finance, expense: Number(e.target.value)})} /></div>
          </div>
        </section>

        <button onClick={() => setShowReport(true)} className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black rounded-[2.5rem] shadow-2xl transition-all active:scale-95">產生現況計劃報表</button>
      </main>
    </div>
  );
};

export default App;
