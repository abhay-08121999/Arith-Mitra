
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface EmiCalculatorProps {
  lang: Language;
}

const EmiCalculator: React.FC<EmiCalculatorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  const calculateEMI = () => {
    const principal = amount;
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  };

  const result = useMemo(() => calculateEMI(), [amount, rate, years]);

  const chartData = [
    { name: 'Principal', value: amount },
    { name: 'Interest', value: result.totalInterest }
  ];
  
  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{t.calculate} EMI</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-slate-600 dark:text-slate-400">{t.amount}</label>
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-sm font-bold">{amount.toLocaleString()}</span>
            </div>
            <input 
              type="range" min="10000" max="10000000" step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
             <div className="flex justify-between mb-2">
              <label className="font-medium text-slate-600 dark:text-slate-400">{t.interestRate}</label>
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-sm font-bold">{rate}%</span>
            </div>
            <input 
              type="range" min="1" max="30" step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
             <div className="flex justify-between mb-2">
              <label className="font-medium text-slate-600 dark:text-slate-400">{t.tenure}</label>
              <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-sm font-bold">{years} Yr</span>
            </div>
            <input 
              type="range" min="1" max="30" step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{t.monthlyEMI}</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{result.emi.toLocaleString()}</p>
          </div>
           <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
            <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">{t.totalPayment}</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{result.totalPayment.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">Breakdown</h3>
        <div className="w-full h-64">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4 space-y-1">
           <p className="text-slate-500 dark:text-slate-400 text-sm">Principal Amount: <strong className="text-slate-800 dark:text-white">{amount.toLocaleString()}</strong></p>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Total Interest: <strong className="text-amber-600 dark:text-amber-500">{result.totalInterest.toLocaleString()}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;