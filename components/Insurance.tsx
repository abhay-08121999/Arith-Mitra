
import React, { useState } from 'react';
import { Umbrella, Heart, Car, ShieldCheck, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface InsuranceProps {
  lang: Language;
}

type InsuranceType = 'life' | 'health' | 'vehicle';

const Insurance: React.FC<InsuranceProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [type, setType] = useState<InsuranceType>('life');
  const [age, setAge] = useState(30);
  const [vehicleAge, setVehicleAge] = useState(2);
  const [coverage, setCoverage] = useState(500000);
  const [showQuote, setShowQuote] = useState(false);

  const calculatePremium = () => {
    // Simple mock calculation logic
    let base = 0;
    if (type === 'life') base = (coverage * 0.005) + (age * 100);
    if (type === 'health') base = (coverage * 0.015) + (age * 200);
    if (type === 'vehicle') base = (coverage * 0.03) - (vehicleAge * 100); // Older cars, less IDV, slightly adjusting logic

    return Math.max(1000, Math.round(base)); // Min premium 1000
  };

  const premium = calculatePremium();

  const plans = [
    { id: 1, name: "Silver Protect", coverage: coverage, premium: premium * 0.9, benefits: ["Basic Coverage", "24/7 Support"] },
    { id: 2, name: "Gold Secure", coverage: coverage * 1.5, premium: premium * 1.2, benefits: ["Enhanced Coverage", "Zero Depreciation", "Free Checkup"] },
    { id: 3, name: "Platinum Shield", coverage: coverage * 2, premium: premium * 1.5, benefits: ["Global Coverage", "Priority Claims", "All Add-ons"] },
  ];

  const isVehicle = type === 'vehicle';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{t.insuranceTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400">Secure your future with AI-recommended plans tailored for you.</p>
      </div>

      {/* Type Selector */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => { setType('life'); setShowQuote(false); }}
          className={`px-6 py-4 rounded-xl flex items-center gap-2 font-bold transition shadow-sm ${type === 'life' ? 'bg-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/40 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          <Umbrella size={20} /> {t.lifeInsurance}
        </button>
        <button
          onClick={() => { setType('health'); setShowQuote(false); }}
          className={`px-6 py-4 rounded-xl flex items-center gap-2 font-bold transition shadow-sm ${type === 'health' ? 'bg-rose-500 text-white shadow-rose-200 dark:shadow-rose-900/40 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          <Heart size={20} /> {t.healthInsurance}
        </button>
        <button
          onClick={() => { setType('vehicle'); setShowQuote(false); }}
          className={`px-6 py-4 rounded-xl flex items-center gap-2 font-bold transition shadow-sm ${type === 'vehicle' ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900/40 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          <Car size={20} /> {t.vehicleInsurance}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit transition-colors duration-300">
           <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white">Calculate Premium</h3>
           <div className="space-y-5">
             <div>
               <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                 {isVehicle ? "Vehicle Age" : t.age}
               </label>
               {isVehicle ? (
                  <input
                    type="range" min="0" max="20"
                    value={vehicleAge}
                    onChange={e => { setVehicleAge(Number(e.target.value)); setShowQuote(false); }}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
               ) : (
                  <input
                    type="range" min="18" max="70"
                    value={age}
                    onChange={e => { setAge(Number(e.target.value)); setShowQuote(false); }}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
               )}
               <div className="text-right font-bold text-blue-600 dark:text-blue-400">
                  {isVehicle ? `${vehicleAge} Years Old` : `${age} Years`}
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t.coverage} (₹)</label>
               <input
                 type="range" min="100000" max="10000000" step="100000"
                 value={coverage}
                 onChange={e => { setCoverage(Number(e.target.value)); setShowQuote(false); }}
                 className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <div className="text-right font-bold text-blue-600 dark:text-blue-400">₹{coverage.toLocaleString()}</div>
             </div>

             <button
                onClick={() => setShowQuote(true)}
                className="w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition"
             >
               {t.getQuote}
             </button>
           </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
           {!showQuote ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10">
               <ShieldCheck size={48} className="mb-4 opacity-50"/>
               <p>Adjust parameters and click "Get Quote" to see plans.</p>
             </div>
           ) : (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.recommended}</h3>
               {plans.map((plan) => (
                 <div key={plan.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${plan.id === 2 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h4>
                            {plan.id === 2 && <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold">BEST VALUE</span>}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Coverage: <span className="font-semibold text-slate-700 dark:text-slate-200">₹{plan.coverage.toLocaleString()}</span></p>
                          <ul className="flex flex-wrap gap-2">
                             {plan.benefits.map((b, i) => (
                               <li key={i} className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">{b}</li>
                             ))}
                          </ul>
                       </div>
                       <div className="text-right w-full md:w-auto">
                          <p className="text-sm text-slate-400 dark:text-slate-500 mb-1">Yearly Premium</p>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">₹{Math.round(plan.premium).toLocaleString()}</div>
                          <button className="w-full md:w-auto bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition flex items-center justify-center gap-1 group-hover:pl-4 group-hover:pr-8 relative">
                             Select <ChevronRight size={16} className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Insurance;
