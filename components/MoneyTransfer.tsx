
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Send, History, CheckCircle2, Wallet, CreditCard, Lock, Smartphone, Globe, ShieldCheck, X, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MoneyTransferProps {
  lang: Language;
}

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: 'success' | 'pending';
  method: string;
}

const PROVIDERS = [
  { id: 'wallet', name: 'Wallet', icon: Wallet, color: 'bg-blue-600', textColor: 'text-blue-600', type: 'wallet' },
  { id: 'gpay', name: 'GPay', icon: Globe, color: 'bg-indigo-500', textColor: 'text-indigo-500', type: 'upi' },
  { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-purple-600', textColor: 'text-purple-600', type: 'upi' },
  { id: 'paytm', name: 'Paytm', icon: CreditCard, color: 'bg-cyan-500', textColor: 'text-cyan-500', type: 'upi' },
  { id: 'razorpay', name: 'Razorpay', icon: Lock, color: 'bg-blue-800', textColor: 'text-blue-800', type: 'gateway' },
];

const MoneyTransfer: React.FC<MoneyTransferProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  // Default balance starts at 0 for a new user
  const [balance, setBalance] = useState(0.00); 
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [account, setAccount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('wallet');

  // Transaction States
  const [step, setStep] = useState<'input' | 'pin' | 'processing' | 'success'>('input');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const selectedProvider = PROVIDERS.find(p => p.id === selectedMethod);

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val) return;
    
    // Check wallet balance only if paying via Wallet
    if (selectedMethod === 'wallet' && val > balance) return;

    if (selectedProvider?.type === 'upi') {
        setStep('pin');
        setPin(['', '', '', '']);
        setError('');
    } else {
        setStep('processing');
        processTransaction();
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Auto focus next input
    if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handlePinSubmit = () => {
     if (pin.some(d => !d)) {
         setError(t.invalidPin);
         return;
     }
     setStep('processing');
     processTransaction();
  };

  const processTransaction = async () => {
     // Simulate network delay
     await new Promise(resolve => setTimeout(resolve, 2500));
     
     const val = parseFloat(amount);
     
     const newTx: Transaction = {
       id: Date.now().toString(),
       name: recipient,
       amount: val,
       date: new Date().toISOString().split('T')[0],
       status: 'success',
       method: selectedProvider?.name || 'Wallet'
     };

     if (selectedMethod === 'wallet') {
         setBalance(prev => prev - val);
     }

     setTransactions([newTx, ...transactions]);
     setStep('success');

     // Reset after success
     setTimeout(() => {
         setStep('input');
         setAmount('');
         setRecipient('');
         setAccount('');
         setPin(['', '', '', '']);
     }, 3000);
  };

  const closeOverlay = () => {
      if (step !== 'processing') {
          setStep('input');
      }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      
      {/* Transaction Overlay (PIN / Processing / Success) */}
      {step !== 'input' && (
        <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300 p-6">
           
           {/* Close button for PIN mode only */}
           {step === 'pin' && (
               <button onClick={closeOverlay} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                   <X size={24} />
               </button>
           )}

           {/* PIN Entry Step */}
           {step === 'pin' && (
               <div className="w-full max-w-xs text-center space-y-6">
                   <div className={`w-16 h-16 mx-auto rounded-2xl ${selectedProvider?.color} flex items-center justify-center shadow-lg text-white mb-4`}>
                       <ShieldCheck size={32} />
                   </div>
                   <div>
                       <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t.enterPin}</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{t.payWith} {selectedProvider?.name}</p>
                   </div>
                   
                   <div className="flex justify-center gap-3 my-4">
                       {pin.map((digit, idx) => (
                           <input 
                               key={idx}
                               id={`pin-${idx}`}
                               type="password" 
                               maxLength={1}
                               value={digit}
                               onChange={(e) => handlePinChange(idx, e.target.value)}
                               className="w-12 h-12 text-center text-xl font-bold rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-slate-900 dark:text-white"
                           />
                       ))}
                   </div>
                   
                   {error && <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>}

                   <button 
                       onClick={handlePinSubmit}
                       className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${selectedProvider?.color}`}
                   >
                       {t.payWith} ₹{parseFloat(amount).toLocaleString()}
                   </button>
               </div>
           )}

           {/* Processing Step */}
           {step === 'processing' && (
               <div className="text-center">
                   <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                      <div className={`absolute inset-0 border-4 rounded-full border-t-transparent animate-spin ${selectedProvider?.textColor || 'text-blue-600'}`} style={{ borderColor: `${selectedProvider?.textColor} transparent transparent transparent` }}></div>
                      {selectedProvider?.icon && <selectedProvider.icon className={`absolute inset-0 m-auto ${selectedProvider.textColor}`} size={24} />}
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.processingPayment}</h3>
                   <p className="text-slate-500 dark:text-slate-400">{t.securePayment} via {selectedProvider?.name}</p>
               </div>
           )}

           {/* Success Step */}
           {step === 'success' && (
               <div className="text-center animate-in zoom-in-95 duration-300">
                   <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle2 size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.successMsg}</h3>
                   <p className="text-slate-600 dark:text-slate-300">
                       <span className="font-bold">₹{parseFloat(amount).toLocaleString()}</span> sent to {recipient}
                   </p>
               </div>
           )}
        </div>
      )}

      {/* Send Money Form */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="flex items-center gap-3 mb-2 relative z-10">
             <Wallet className="opacity-80" size={20} />
             <span className="font-medium opacity-90">{t.walletBalance}</span>
           </div>
           <h2 className="text-4xl font-bold relative z-10">₹{balance.toLocaleString()}</h2>
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <Wallet size={120} />
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <ArrowRightLeft className="text-blue-600 dark:text-blue-400" /> {t.transferTitle}
          </h2>

          <form onSubmit={handleInitiate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.recipient}</label>
              <input
                type="text"
                required
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                placeholder="e.g. Amit Sharma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.accountNo}</label>
              <input
                type="text"
                required
                value={account}
                onChange={e => setAccount(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.amount} (₹)</label>
              <input
                type="number"
                required
                max={selectedMethod === 'wallet' ? balance : undefined}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-lg text-slate-900 dark:text-white"
                placeholder="0.00"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.paymentMethod}</label>
               <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => setSelectedMethod(provider.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        selectedMethod === provider.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                       <div className={`w-8 h-8 rounded-full ${provider.color} text-white flex items-center justify-center mb-1 shadow-sm`}>
                          <provider.icon size={14} />
                       </div>
                       <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{provider.name}</span>
                    </button>
                  ))}
               </div>
            </div>

            <button
              type="submit"
              disabled={!amount || (selectedMethod === 'wallet' && parseFloat(amount) > balance)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} /> {t.sendMoney}
            </button>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
           <History className="text-slate-400" /> {t.history}
        </h3>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    {tx.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{tx.name}</p>
                    <p className="text-xs text-slate-400">{tx.date} • via {tx.method}</p>
                  </div>
               </div>
               <div className="text-right">
                 <p className="font-bold text-slate-800 dark:text-white">- ₹{tx.amount.toLocaleString()}</p>
                 <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-medium">Success</span>
               </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
                <History size={48} className="mb-4 opacity-20" />
                <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyTransfer;
