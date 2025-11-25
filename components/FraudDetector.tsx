
import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, Info, Loader2 } from 'lucide-react';
import { analyzeFraud } from '../services/geminiService';
import { FraudAnalysisResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FraudDetectorProps {
  lang: Language;
}

const FraudDetector: React.FC<FraudDetectorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [text, setText] = useState('');
  const [result, setResult] = useState<FraudAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeFraud(text);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors duration-300">
        <div className="inline-flex p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.fraudTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Paste any suspicious SMS, email, or message below. Our AI scans for phishing patterns, urgent threats, and scam triggers.</p>
        
        <div className="relative">
          <textarea
            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
            placeholder={t.fraudPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="absolute bottom-4 right-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition shadow-lg shadow-red-200 dark:shadow-none disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16}/> : t.analyze}
          </button>
        </div>
      </div>

      {result && (
        <div className={`rounded-2xl shadow-lg border overflow-hidden animate-fade-in ${
          result.isFraud 
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' 
            : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50'
        }`}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {result.isFraud ? (
                <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full">
                  <AlertOctagon size={32} />
                </div>
              ) : (
                <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full">
                  <ShieldCheck size={32} />
                </div>
              )}
              <div>
                <h3 className={`text-xl font-bold ${result.isFraud ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                  {result.isFraud ? t.dangerous : t.safe}
                </h3>
                <p className={`text-sm font-medium ${result.isFraud ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                  Risk Score: {result.riskScore}/100
                </p>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl mb-4">
              <h4 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                <Info size={16} /> Analysis
              </h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {result.explanation}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-white mb-1">Recommended Action</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {result.advice}
              </p>
            </div>
          </div>
          {result.isFraud && (
             <div className="bg-red-600 text-white text-center py-2 text-xs font-bold uppercase tracking-wider">
               Do not click links or reply
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FraudDetector;