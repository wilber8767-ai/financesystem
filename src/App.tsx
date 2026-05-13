import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  // 財務基礎數據
  const [finance, setFinance] = useState({
    income: 1200000,
    expense: 600000,
    targetMonthlyPassive: 50000,
    roi: 6
  });

  // 六大險種詳細欄位
  const [insurance, setInsurance] = useState({
    life: { deathBenefit: 0, premium: 0 },
    accident: { death: 0, reimbursement: 0, daily: 0, premium: 0 },
    medical: { 
      dailyFixed: 0, dailyReimburse: 0, 
      surgeryFixed: 0, surgeryReimburse: 0,
      clinicFixed: 0, clinicReimburse: 0,
      miscReimburse: 0, premium: 0 
    },
    majorIllness: { lumpSum: 0, premium: 0 },
    cancer: { lumpSum: 0, daily: 0, chemo: 0, radiation: 0, surgery: 0, premium: 0 },
    longTermCare: { lumpSum: 0, monthly: 0, premium: 0 }
  });

  // 計算邏輯
  const totalPremium = useMemo(() => {
    return Object.values(insurance).reduce((acc, curr) => acc + curr.premium, 0);
  }, [insurance]);

  const netSavings = finance.income - finance.expense - totalPremium;

  // 財富模擬數據
  const chartData = useMemo(() => {
    let balance = 0;
    return Array.from({ length: 21 }).map((_, i) => {
      const year = i;
      balance = (balance + netSavings) * (1 + finance.roi / 100);
      return { year, balance: Math.round(balance) };
    });
  }, [netSavings, finance.roi]);

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 text-slate-900 font-sans">
      {/* Header - 強化視覺引導 */}
      <header className="max-w-7xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-blue-800 tracking-tight">財富防禦管理系統</h1>
        <div className="h-2 w-24 bg-blue-500 mt-4 mx-auto md:mx-0 rounded-full"></div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* 左側：數據輸入區 (佔 8 格) */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* 財務基本資料 - 大字體卡片 */}
          <section className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">1. 財務現況 (年)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: '年收入', key: 'income', state: finance, setState: setFinance },
                { label: '生活支出', key: 'expense', state: finance, setState: setFinance },
                { label: '預期投報(%)', key: 'roi', state: finance, setState: setFinance },
                { label: '目標被動收入', key: 'targetMonthlyPassive', state: finance, setState: setFinance },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-lg font-semibold mb-2">{item.label}</label>
                  <input 
                    type="number" 
                    className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={item.state[item.key as keyof typeof finance]} 
                    onChange={e => item.setState({...item.state, [item.key]: Number(e.target.value)})}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 六大險種區塊 - 分層清晰 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 核心醫療險 - 佔滿寬度 */}
            <section className="bg-white p-8 rounded-3xl border-2 border-blue-100 md:col-span-2 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">🏥</span> 醫療保障細節
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div><label className="text-base font-medium">住院日額(定額)</label><input type="number" className="w-full text-lg p-3 mt-1 border rounded-xl bg-slate-50" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyFixed: Number(e.target.value)}})} /></div>
                <div><label className="text-base font-medium text-blue-600">住院日額(實支)</label><input type="number" className="w-full text-lg p-3 mt-1 border-2 border-blue-200 rounded-xl" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, dailyReimburse: Number(e.target.value)}})} /></div>
                <div><label className="text-base font-medium text-red-600">雜費限額(實支)</label><input type="number" className="w-full text-lg p-3 mt-1 border-2 border-red-200 rounded-xl font-bold" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, miscReimburse: Number(e.target.value)}})} /></div>
                <div><label className="text-base font-medium">門診手術(定額)</label><input type="number" className="w-full text-lg p-3 mt-1 border rounded-xl bg-slate-50" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicFixed: Number(e.target.value)}})} /></div>
                <div><label className="text-base font-medium text-blue-600">門診手術(實支)</label><input type="number" className="w-full text-lg p-3 mt-1 border-2 border-blue-200 rounded-xl" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, clinicReimburse: Number(e.target.value)}})} /></div>
                <div><label className="text-base font-medium font-bold text-indigo-700 underline">該險種年保費</label><input type="number" className="w-full text-lg p-3 mt-1 border-2 border-indigo-500 rounded-xl bg-indigo-50" onChange={e => setInsurance({...insurance, medical: {...insurance.medical, premium: Number(e.target.value)}})} /></div>
              </div>
            </section>

            {/* 其他險種卡片 */}
            {[
              { key: 'life', label: '壽險', fields: ['身故金'] },
              { key: 'accident', label: '意外險', fields: ['意外身故', '意外實支', '意外日額'] },
              { key: 'majorIllness', label: '重大傷病', fields: ['重大傷病一次金'] },
              { key: 'cancer', label: '癌症險', fields: ['一次金', '日額', '化/放療', '手術'] },
              { key: 'longTermCare', label: '長照險', fields: ['長照一次金', '每月給付'] }
            ].map(item => (
              <section key={item.key} className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                <h2 className="text-2xl font-bold mb-4 text-slate-800">{item.label}</h2>
                <div className="space-y-4">
                  {item.fields.map(f => (
                    <div key={f}>
                      <label className="text-sm font-semibold text-slate-500">{f}</label>
                      <input type="number" className="w-full text-lg p-3 mt-1 border rounded-xl bg-slate-50 focus:bg-white outline-none" />
                    </div>
                  ))}
                  <div className="pt-2 border-t mt-4">
                    <label className="text-sm font-bold text-indigo-600">年度保費</label>
                    <input 
                      type="number" 
                      className="w-full text-xl p-3 mt-1 border-2 border-indigo-200 rounded-xl bg-indigo-50 font-mono" 
                      onChange={e => setInsurance({...insurance, [item.key]: {...insurance[item.key as keyof typeof insurance], premium: Number(e.target.value)}})} 
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* 右側：診斷面板 (佔 4 格) */}
        <div className="xl:col-span-4">
          <div className="sticky top-10 space-y-8">
            <section className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden relative">
              {/* 背景裝飾 */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
              
              <h2 className="text-3xl font-black mb-8 relative z-10">財務診斷報告</h2>
              
              <div className="space-y-6 relative z-10">
                <div className="bg-blue-800/50 p-6 rounded-2xl border border-blue-700">
                  <p className="text-blue-200 font-bold text-sm uppercase tracking-wider">年度總保費</p>
                  <p className="text-4xl font-mono font-bold mt-1">${totalPremium.toLocaleString()}</p>
                </div>
                
                <div className="bg-blue-800/50 p-6 rounded-2xl border border-blue-700">
                  <p className="text-blue-200 font-bold text-sm uppercase tracking-wider">年結餘 (財富種子)</p>
                  <p className={`text-4xl font-mono font-bold mt-1 ${netSavings < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    ${netSavings.toLocaleString()}
                  </p>
                </div>

                {/* 診斷意見區 */}
                <div className="pt-6 space-y-4">
                  <h3 className="text-lg font-bold text-blue-100 flex items-center">
                    🔍 客觀對錯討論
                  </h3>
                  <div className="space-y-3">
                    {insurance.medical.miscReimburse < 200000 && (
                      <div className="p-4 bg-red-500/20 border-l-4 border-red-500 rounded-r-lg text-sm leading-relaxed">
                        ⚠️ <span className="font-bold">醫療雜費不足：</span> 目前自費醫材昂貴，雜費低於 20 萬將面臨極大財務風險。
                      </div>
                    )}
                    {netSavings < 0 && (
                      <div className="p-4 bg-red-500/20 border-l-4 border-red-500 rounded-r-lg text-sm leading-relaxed">
                        ❌ <span className="font-bold">財務結構崩潰：</span> 支出已超過收入，需立即優化保費佔比或調整生活開支。
                      </div>
                    )}
                    {totalPremium > finance.income * 0.15 && (
                      <div className="p-4 bg-yellow-500/20 border-l-4 border-yellow-500 rounded-r-lg text-sm leading-relaxed">
                        ⚠️ <span className="font-bold">保費比過高：</span> 保費超過收入 15%，恐影響長期資產累積效率。
                      </div>
                    )}
                    {netSavings > (finance.income * 0.3) && (
                      <div className="p-4 bg-green-500/20 border-l-4 border-green-500 rounded-r-lg text-sm leading-relaxed">
                        ✅ <span className="font-bold">儲蓄率優異：</span> 具備極佳複利基礎，建議優化投資配置。
                      </div>
                    )}
                  </div>
                </div>

                {/* 資產預測圖 */}
                <div className="h-60 w-full mt-6 bg-blue-950/50 rounded-2xl p-4">
                  <p className="text-xs text-blue-300 mb-2 font-bold text-center">20年財富成長曲線 (複利)</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff11" vertical={false} />
                      <XAxis dataKey="year" stroke="#60a5fa" fontSize={12} tickMargin={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff'}}
                        itemStyle={{color: '#4ade80'}}
                        formatter={(val: number) => [`$${val.toLocaleString()}`, '預估資產']}
                      />
                      <Line type="monotone" dataKey="balance" stroke="#4ade80" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-10 text-center text-slate-400 text-sm">
        <p>© 2026 財務規劃決策系統 | 以效率優先，追求卓越成長</p>
      </footer>
    </div>
  );
};

export default App;
