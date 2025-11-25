
import React, { useState } from 'react';
import { Percent, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { predictLoanEligibility } from '../services/geminiService';
import { LoanPredictionResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LoanPredictorProps {
  lang: Language;
}

const LoanPredictor: React.FC<LoanPredictorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    income: '',
    creditScore: '',
    existingEmi: '',
    amount: '',
    tenure: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoanPredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictLoanEligibility(
        Number(formData.income),
        Number(formData.creditScore),
        Number(formData.existingEmi),
        Number(formData.amount),
        Number(formData.tenure)
      );
      setResult(prediction);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
              <Percent size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.loanTitle}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.income}</label>
                <input 
                  type="number" 
                  required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
                  value={formData.income}
                  onChange={e => setFormData({...formData, income: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.creditScore}</label>
                <input 
                  type="number" 
                  required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
                  value={formData.creditScore}
                  onChange={e => setFormData({...formData, creditScore: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.existingEmi}</label>
              <input 
                type="number" 
                required
                className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
                value={formData.existingEmi}
                onChange={e => setFormData({...formData, existingEmi: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Loan Amount</label>
                <input 
                  type="number" 
                  required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tenure (Years)</label>
                <input 
                  type="number" 
                  required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
                  value={formData.tenure}
                  onChange={e => setFormData({...formData, tenure: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20}/> : t.predict}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {!result && !loading && (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
               <Percent size={48} className="mb-4 opacity-50"/>
               <p className="text-center">Enter your details to get an AI-powered eligibility assessment.</p>
             </div>
          )}

          {loading && (
             <div className="h-full flex flex-col items-center justify-center text-green-600 dark:text-green-400 p-8">
               <Loader2 size={48} className="animate-spin mb-4"/>
               <p className="font-medium animate-pulse">{t.processing}</p>
             </div>
          )}

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className={`p-6 text-white ${
                result.status === 'High' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                result.status === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                'bg-gradient-to-r from-red-500 to-rose-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold opacity-90">Eligibility Chance</h3>
                  {result.status === 'High' && <CheckCircle2 size={28}/>}
                  {result.status === 'Medium' && <AlertTriangle size={28}/>}
                  {result.status === 'Low' && <XCircle size={28}/>}
                </div>
                <div className="text-5xl font-bold mb-1">{result.eligibilityScore}%</div>
                <p className="opacity-90 font-medium">{result.status} Probability</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-2">Analysis</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{result.reasoning}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Tips to Improve</h4>
                  <ul className="space-y-2">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="text-green-500 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanPredictor;