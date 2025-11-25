

import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Info, ArrowLeft, CreditCard, Briefcase, Check, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CreditScoreProps {
  lang: Language;
}

interface Card {
  id: number;
  name: string;
  bank: string;
  type: string;
  fee: number;
  minIncome: number;
  features: string[];
  gradient: string;
}

const CreditScore: React.FC<CreditScoreProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  
  // State for view toggling
  const [activeTab, setActiveTab] = useState<'score' | 'cards'>('score');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  // Form State for Score
  const [scoreForm, setScoreForm] = useState({
    pan: '',
    dob: '',
    mobile: ''
  });
  
  const [errors, setErrors] = useState({
    pan: '',
    mobile: ''
  });

  // Form State for Cards
  const [cardForm, setCardForm] = useState({
    income: '',
    type: 'salaried'
  });
  const [eligibleCards, setEligibleCards] = useState<Card[]>([]);
  const [showCardResults, setShowCardResults] = useState(false);

  // Mock Data
  const CREDIT_CARDS: Card[] = [
    { id: 1, name: "Lifetime Free Platinum", bank: "HDFC", minIncome: 15000, fee: 0, type: "Entry", features: ["No Annual Fee", "5% Cashback on Online Spends"], gradient: "from-slate-400 to-slate-600" },
    { id: 2, name: "Millennia Rewards", bank: "HDFC", minIncome: 25000, fee: 1000, type: "Rewards", features: ["10x Reward Points", "Free Lounge Access (Domestic)"], gradient: "from-blue-500 to-indigo-600" },
    { id: 3, name: "Coral Contactless", bank: "ICICI", minIncome: 30000, fee: 500, type: "Lifestyle", features: ["Buy 1 Get 1 Movie Ticket", "15% Dining Discount"], gradient: "from-orange-400 to-red-500" },
    { id: 4, name: "Ace Credit Card", bank: "Axis", minIncome: 40000, fee: 499, type: "Cashback", features: ["2% Flat Cashback", "4 Lounge Visits/Year"], gradient: "from-emerald-500 to-teal-600" },
    { id: 5, name: "Regalia Gold", bank: "HDFC", minIncome: 80000, fee: 2500, type: "Premium", features: ["Club Vistara Membership", "12 Lounge Visits", "Low Forex Markup"], gradient: "from-yellow-500 to-amber-600" },
  ];

  const validate = () => {
      let isValid = true;
      const newErrors = { pan: '', mobile: '' };

      // PAN Validation: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(scoreForm.pan)) {
          newErrors.pan = t.invalidPan || "Invalid PAN Number"; 
          isValid = false;
      }

      // Mobile Validation: Starts with 6-9, followed by 9 digits
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(scoreForm.mobile)) {
          newErrors.mobile = t.invalidMobile || "Invalid Mobile Number"; 
          isValid = false;
      }

      setErrors(newErrors);
      return isValid;
  };

  const handleFetchScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setTimeout(() => {
      // Random score between 600 and 850
      setScore(Math.floor(Math.random() * (850 - 600 + 1) + 600));
      setLoading(false);
      setShowResult(true);
    }, 2500);
  };

  const handleCheckEligibility = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cardForm.income) return;
      setLoading(true);
      
      const monthlyIncome = parseFloat(cardForm.income);
      
      setTimeout(() => {
          const cards = CREDIT_CARDS.filter(c => monthlyIncome >= c.minIncome);
          setEligibleCards(cards);
          setShowCardResults(true);
          setLoading(false);
      }, 2000);
  };

  const getScoreColor = (s: number) => {
    if (s >= 750) return 'text-green-500';
    if (s >= 700) return 'text-blue-500';
    if (s >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreStatus = (s: number) => {
    if (s >= 750) return t.excellent;
    if (s >= 700) return t.good;
    if (s >= 650) return t.fair;
    return t.poor;
  };

  const historyData = [
    { month: 'Jan', score: 710 },
    { month: 'Feb', score: 715 },
    { month: 'Mar', score: 705 },
    { month: 'Apr', score: 725 },
    { month: 'May', score: 740 },
    { month: 'Jun', score: score || 750 },
  ];

  const factors = [
    { label: t.paymentHistory, value: '100%', status: 'Excellent', impact: 'High' },
    { label: t.utilization, value: '12%', status: 'Good', impact: 'High' },
    { label: 'Credit Age', value: '4 Yrs', status: 'Fair', impact: 'Medium' },
    { label: 'Total Accounts', value: '12', status: 'Good', impact: 'Low' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Tab Switcher */}
       <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 inline-flex">
             <button
               onClick={() => setActiveTab('score')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === 'score' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
                <TrendingUp size={16} /> {t.creditScore}
             </button>
             <button
               onClick={() => setActiveTab('cards')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === 'cards' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
                <CreditCard size={16} /> {t.cardEligibility}
             </button>
          </div>
       </div>

       {/* Credit Score View */}
       {activeTab === 'score' && (
           <>
            {!showResult ? (
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                        <CreditCard size={32} />
                        </div>
                        <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.enterDetails}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Get your latest credit report for free.</p>
                        </div>
                    </div>

                    <form onSubmit={handleFetchScore} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.panNumber}</label>
                            <input 
                                type="text" 
                                required
                                value={scoreForm.pan}
                                onChange={e => {
                                    setScoreForm({...scoreForm, pan: e.target.value.toUpperCase()});
                                    if(errors.pan) setErrors({...errors, pan: ''});
                                }}
                                maxLength={10}
                                className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:ring-2 outline-none transition uppercase text-slate-900 dark:text-white placeholder:text-slate-400 ${errors.pan ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'}`}
                                placeholder="ABCDE1234F"
                            />
                            {errors.pan && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12}/> {errors.pan}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.dob}</label>
                            <input 
                                type="date" 
                                required
                                value={scoreForm.dob}
                                onChange={e => setScoreForm({...scoreForm, dob: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.mobileNumber}</label>
                            <input 
                                type="tel" 
                                required
                                value={scoreForm.mobile}
                                onChange={e => {
                                    setScoreForm({...scoreForm, mobile: e.target.value});
                                    if(errors.mobile) setErrors({...errors, mobile: ''});
                                }}
                                pattern="[0-9]*"
                                maxLength={10}
                                className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:ring-2 outline-none transition text-slate-900 dark:text-white placeholder:text-slate-400 ${errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'}`}
                                placeholder="9876543210"
                            />
                            {errors.mobile && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12}/> {errors.mobile}
                                </p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : t.checkScore}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button 
                        onClick={() => setShowResult(false)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition mb-4"
                    >
                        <ArrowLeft size={20} /> Check Another
                    </button>

                    {/* Main Score Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.currentScore} for {scoreForm.pan}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                            <button 
                                onClick={(e) => handleFetchScore(e)}
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto md:mx-0 shadow-lg shadow-blue-200 dark:shadow-none"
                            >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : t.checkScore}
                            </button>
                        </div>

                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="15" fill="transparent" className="text-slate-100 dark:text-slate-800"/>
                            <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="15" fill="transparent" strokeDasharray={691} strokeDashoffset={691 - (691 * ((score - 300) / 600))} className={`${getScoreColor(score)} transition-all duration-1000 ease-out`} strokeLinecap="round"/>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {loading ? <Loader2 size={48} className="animate-spin text-blue-500" /> : <><span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span><span className={`text-lg font-medium mt-1 ${getScoreColor(score)}`}>{getScoreStatus(score)}</span></>}
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500" />{t.scoreHistory}</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Info size={20} className="text-blue-500" />{t.factors}</h3>
                        <div className="space-y-4">
                            {factors.map((factor, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    {factor.status === 'Excellent' || factor.status === 'Good' ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertTriangle size={20} className="text-yellow-500" />}
                                    <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{factor.label}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.impact}: <span className={`${factor.impact === 'High' ? 'text-red-500' : 'text-blue-500'} font-medium`}>{factor.impact}</span></p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-white">{factor.value}</span>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>
            )}
           </>
       )}

       {/* Credit Card Eligibility View */}
       {activeTab === 'cards' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-fit transition-colors duration-300">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" /> {t.employmentType}
                    </h3>
                    <form onSubmit={handleCheckEligibility} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.income} (Monthly)</label>
                            <input 
                                type="number" 
                                required
                                value={cardForm.income}
                                onChange={e => setCardForm({...cardForm, income: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.employmentType}</label>
                            <select
                                value={cardForm.type}
                                onChange={e => setCardForm({...cardForm, type: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                            >
                                <option value="salaried">{t.salaried}</option>
                                <option value="self">{t.selfEmployed}</option>
                                <option value="student">{t.student}</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : t.checkEligibility}
                        </button>
                    </form>
               </div>

               <div className="md:col-span-2 space-y-4">
                  {!showCardResults ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                          <CreditCard size={48} className="mb-4 opacity-50"/>
                          <p>Enter your financial details to see eligible credit cards.</p>
                      </div>
                  ) : eligibleCards.length > 0 ? (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-2">{t.recommendedCards}</h3>
                          {eligibleCards.map(card => (
                              <div key={card.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition group relative overflow-hidden">
                                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-20 bg-gradient-to-br ${card.gradient}`}></div>
                                  
                                  <div className="flex flex-col md:flex-row gap-6">
                                      {/* Card Preview */}
                                      <div className={`w-full md:w-48 h-28 rounded-xl bg-gradient-to-br ${card.gradient} text-white p-4 flex flex-col justify-between shadow-md relative overflow-hidden shrink-0`}>
                                          <div className="flex justify-between items-start">
                                              <span className="text-xs font-bold uppercase opacity-80">{card.bank}</span>
                                              <CreditCard size={16} className="opacity-80"/>
                                          </div>
                                          <div>
                                              <p className="font-bold text-sm tracking-widest">•••• •••• •••• 1234</p>
                                              <p className="text-[10px] mt-1 opacity-80 uppercase">{card.name}</p>
                                          </div>
                                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                      </div>

                                      {/* Details */}
                                      <div className="flex-1">
                                          <div className="flex justify-between items-start mb-2">
                                              <div>
                                                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">{card.name}</h4>
                                                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{card.type} Card</p>
                                              </div>
                                              <div className="text-right">
                                                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t.annualFee}</p>
                                                  <p className={`font-bold ${card.fee === 0 ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                                                      {card.fee === 0 ? 'Lifetime Free' : `₹${card.fee}`}
                                                  </p>
                                              </div>
                                          </div>

                                          <div className="space-y-1 mb-4">
                                              {card.features.map((feat, i) => (
                                                  <p key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                      <Check size={14} className="text-blue-500" /> {feat}
                                                  </p>
                                              ))}
                                          </div>

                                          <button className="w-full md:w-auto bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition">
                                              {t.applyNow}
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center animate-in fade-in">
                          <AlertTriangle size={48} className="mb-4 opacity-50 text-yellow-500"/>
                          <p className="font-medium text-slate-700 dark:text-slate-300">No cards found matching your criteria.</p>
                          <p className="text-sm mt-2">Try increasing the income or updating employment type.</p>
                      </div>
                  )}
               </div>
           </div>
       )}
    </div>
  );
};

export default CreditScore;