
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { User, Language } from './types';
import { NAV_ITEMS, TRANSLATIONS, APP_NAME, LANG_DISPLAY_NAMES } from './constants';
import { LogOut, Globe, WalletMinimal, ChevronDown, ArrowRight, ShieldCheck, CheckCircle2, Moon, Sun, Loader2, X, UserPlus, AlertCircle } from 'lucide-react';

// Components
import EmiCalculator from './components/EmiCalculator';
import ExpenseTracker from './components/ExpenseTracker';
import FraudDetector from './components/FraudDetector';
import LoanPredictor from './components/LoanPredictor';
import ChatBot from './components/ChatBot';
import MoneyTransfer from './components/MoneyTransfer';
import Insurance from './components/Insurance';
import CreditScore from './components/CreditScore';

// Language Selector Component
const LanguageSelector: React.FC<{ lang: Language; setLang: (l: Language) => void }> = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
       <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition outline-none focus:ring-2 focus:ring-blue-100"
       >
          <Globe size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{LANG_DISPLAY_NAMES[lang]?.split(' ')[0]}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
       </button>
       
       {isOpen && (
         <>
            {/* Backdrop to close menu when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {Object.values(Language).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition border-b border-slate-50 dark:border-slate-700 last:border-0 ${
                      lang === l ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {LANG_DISPLAY_NAMES[l]}
                  </button>
                ))}
            </div>
         </>
       )}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle: React.FC<{ darkMode: boolean; toggleTheme: () => void }> = ({ darkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <Sun size={18} className="text-amber-400" />
      ) : (
        <Moon size={18} className="text-blue-600" />
      )}
    </button>
  );
};

// Google Account Selection Modal
const GoogleAccountModal: React.FC<{ 
    onClose: () => void; 
    onSelect: (email: string, name: string) => void;
    storedUsers: any[];
}> = ({ onClose, onSelect, storedUsers }) => {
    
    // Only show stored system accounts
    const displayAccounts = storedUsers.map(u => ({ 
        name: u.name, 
        email: u.email,
        isSystem: true 
    }));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-medium text-slate-700 dark:text-slate-200">Choose an account</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <X size={20}/>
                    </button>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto">
                    <div className="mb-2 px-3 pt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Saved Accounts
                    </div>
                    {displayAccounts.length > 0 ? (
                        displayAccounts.map(acc => (
                            <button key={acc.email} onClick={() => onSelect(acc.email, acc.name)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition text-left group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                                    {acc.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {acc.name}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{acc.email}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-center text-slate-400 text-sm italic">
                            No saved accounts found.
                        </div>
                    )}
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                        <button 
                            onClick={() => {
                                // For "Use another account", we can just simulate logging in as a new "Guest" or trigger a flow.
                                // For simplicity here, we'll pick a generic new user name or ask them to sign up.
                                // Let's just create a quick "Guest" account to allow entry as requested.
                                onSelect(`guest_${Date.now()}@gmail.com`, "Guest User");
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition text-left text-slate-600 dark:text-slate-400"
                        >
                            <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                                <UserPlus size={16} />
                            </div>
                            <span className="text-sm font-medium">Use another account</span>
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    To continue, Google will share your name, email address, and language preference with {APP_NAME}.
                </div>
            </div>
        </div>
    );
};

// Landing Page Component
const LandingPage: React.FC<{ 
  setAuthMode: (mode: 'login' | 'signup') => void;
  lang: Language; 
  setLang: (l: Language) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}> = ({ setAuthMode, lang, setLang, darkMode, toggleTheme }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <WalletMinimal size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          <LanguageSelector lang={lang} setLang={setLang} />
          <button 
            onClick={() => setAuthMode('login')}
            className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition hidden sm:block"
          >
            {t.login}
          </button>
          <button 
            onClick={() => setAuthMode('signup')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
          >
            {t.signup}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 -z-10 transition-colors duration-300"></div>
        
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-blue-100 dark:border-slate-700">
           <ShieldCheck size={16} /> Secure & Private
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 max-w-4xl leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {t.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {t.heroSubtitle}
        </p>

        <button 
          onClick={() => setAuthMode('signup')}
          className="group bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 dark:shadow-blue-900/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
        >
          {t.getStarted}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* Features Grid */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NAV_ITEMS.filter(item => item.id !== 'dashboard').map((item, idx) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{item.label[lang]}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description?.[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 py-10 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
         <div className="container mx-auto px-6 text-center text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. Made with ❤️ for India.</p>
         </div>
      </footer>
    </div>
  );
};

// Auth Component
const Auth: React.FC<{ 
  mode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  onLogin: (u: User) => void; 
  onBack: () => void;
  lang: Language; 
  setLang: (l: Language) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}> = ({ mode, setAuthMode, onLogin, onBack, lang, setLang, darkMode, toggleTheme }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [storedUsers, setStoredUsers] = useState<any[]>([]);

  // Load stored users on mount
  useEffect(() => {
      try {
          const raw = localStorage.getItem('arithmitra_users');
          if (raw) {
              setStoredUsers(JSON.parse(raw));
          }
      } catch (e) {
          console.error("Failed to load users", e);
          localStorage.removeItem('arithmitra_users'); // Clear corrupted data
          setStoredUsers([]);
      }
  }, []);

  // Clear errors and form when switching modes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setFormData(prev => ({ ...prev, password: '' }));
  }, [mode]);

  const validate = (): string | null => {
    if (mode === 'signup' && !formData.name.trim()) {
      return t.valName || "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return t.valEmail || "Please enter a valid email address";
    }

    if (!formData.password || formData.password.length < 6) {
      return t.valPass || "Password must be at least 6 characters";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const storedUsersRaw = localStorage.getItem('arithmitra_users');
      const currentStoredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (mode === 'signup') {
        const exists = currentStoredUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
        if (exists) {
          setError("Account already exists. Please login instead.");
          setIsLoading(false);
          return;
        }
        
        const newUser = { name: formData.name, email: formData.email, password: formData.password };
        const updatedUsers = [...currentStoredUsers, newUser];
        localStorage.setItem('arithmitra_users', JSON.stringify(updatedUsers));
        setStoredUsers(updatedUsers); 
        
        setSuccessMsg(t.signupSuccess);
        
        // Auto switch to login after delay
        setTimeout(() => {
          setAuthMode('login');
        }, 1500);
      } else {
        const user = currentStoredUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
        if (!user) {
          setError("Account not found. Please Sign Up first.");
          setIsLoading(false);
          return;
        }
        if (user.password !== formData.password) {
          setError(t.loginError);
          setIsLoading(false);
          return;
        }
        onLogin({ name: user.name, email: user.email });
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSelect = (email: string, name: string) => {
      setShowGoogleModal(false);
      setIsLoading(true);
      
      // Check if user exists, if not create them (implicit signup for Google)
      try {
        const storedUsersRaw = localStorage.getItem('arithmitra_users');
        const currentStoredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        const exists = currentStoredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (!exists) {
            const newUser = { name, email, password: 'google_auth_placeholder' };
            const updatedUsers = [...currentStoredUsers, newUser];
            localStorage.setItem('arithmitra_users', JSON.stringify(updatedUsers));
            setStoredUsers(updatedUsers);
        }
      } catch (e) { console.error(e); }

      // Simulate auth
      setTimeout(() => {
          onLogin({ name, email });
          setIsLoading(false);
      }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 p-4 relative transition-colors duration-300">
      {showGoogleModal && (
        <GoogleAccountModal 
            onClose={() => setShowGoogleModal(false)} 
            onSelect={handleGoogleSelect} 
            storedUsers={storedUsers}
        />
      )}

      <div className="absolute top-6 left-6">
        <button onClick={onBack} className="text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
           <ArrowRight className="rotate-180" size={20}/> Back
        </button>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        <LanguageSelector lang={lang} setLang={setLang} />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/40 text-white">
            <WalletMinimal size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{APP_NAME}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{mode === 'login' ? t.welcome : t.loginSubtitle}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center mb-4 border border-red-100 dark:border-red-800/50 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm text-center mb-4 border border-green-100 dark:border-green-800/50 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 size={16}/> {successMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.name}</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition" 
                placeholder="John Doe" 
                disabled={isLoading}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.email}</label>
            <input 
              type="text" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition" 
              placeholder="you@example.com" 
              disabled={isLoading}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.password}</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition" 
              placeholder="••••••••" 
              disabled={isLoading}
            />
            {mode === 'signup' && <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Min 6 characters</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {mode === 'login' ? t.login : t.signup}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 opacity-50">
            <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">OR</span>
            <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
        </div>

        <button 
          onClick={() => setShowGoogleModal(true)}
          type="button"
          disabled={isLoading}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-3 relative disabled:opacity-70"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
           {t.googleLogin}
        </button>

        <div className="mt-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setAuthMode(mode === 'login' ? 'signup' : 'login');
              }}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              {mode === 'login' ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC<{ lang: Language; user: User }> = ({ lang, user }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">{t.welcome}, {user.name.split(' ')[0]}!</h2>
        <p className="text-blue-100 text-lg opacity-90">Your financial health is looking good today.</p>
        <div className="flex gap-4 mt-8">
           <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex-1 border border-white/10">
              <p className="text-sm text-blue-100">{t.monthlyBudget}</p>
              <p className="text-2xl font-bold">₹0.00</p>
           </div>
           <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex-1 border border-white/10">
              <p className="text-sm text-blue-100">{t.remaining}</p>
              <p className="text-2xl font-bold">₹0.00</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NAV_ITEMS.filter(i => i.id !== 'dashboard').map((item) => (
          <NavLink to={`/${item.id}`} key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">{item.label[lang]}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">{item.description?.[lang]}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [viewState, setViewState] = useState<'landing' | 'login' | 'signup'>('landing');
  
  // Initialize dark mode
  const [darkMode, setDarkMode] = useState(() => {
      // Check local storage first
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      // Fallback to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Effect to apply dark mode class and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setViewState('landing');
  };

  if (!user) {
    if (viewState === 'landing') {
      return (
        <LandingPage 
          setAuthMode={setViewState} 
          lang={lang} 
          setLang={setLang}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      );
    }
    return (
      <Auth 
        mode={viewState as 'login' | 'signup'}
        setAuthMode={setViewState} 
        onLogin={setUser} 
        onBack={() => setViewState('landing')}
        lang={lang} 
        setLang={setLang}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  const t = TRANSLATIONS[lang];

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-20 hidden md:flex flex-col transition-colors duration-300">
          <div className="p-6 flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg text-white">
                <WalletMinimal size={24} />
             </div>
             <span className="text-xl font-bold text-slate-900 dark:text-white">{APP_NAME}</span>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <item.icon size={20} />
                <span>{item.label[lang]}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
             <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settings</span>
             </div>
             <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
                </div>
             </div>
             <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition font-medium">
               <LogOut size={20} />
               <span>{t.logout}</span>
             </button>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50 transition-colors duration-300">
          {NAV_ITEMS.slice(0, 5).map((item) => (
             <NavLink key={item.id} to={`/${item.id}`} className={({ isActive }) => `p-2 rounded-xl ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800' : 'text-slate-400 dark:text-slate-500'}`}>
                <item.icon size={24} />
             </NavLink>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
           <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white md:block hidden transition-colors">
                 {/* Header title */}
              </h1>
              
              <div className="flex items-center gap-4 ml-auto">
                 <div className="md:hidden">
                    <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
                 </div>
                 <LanguageSelector lang={lang} setLang={setLang} />
                 
                 <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200 dark:shadow-blue-900/40">
                    {user.name.charAt(0)}
                 </div>
              </div>
           </header>

           <Routes>
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
             <Route path="/dashboard" element={<Dashboard lang={lang} user={user} />} />
             <Route path="/emi" element={<EmiCalculator lang={lang} />} />
             <Route path="/expense" element={<ExpenseTracker lang={lang} />} />
             <Route path="/loan" element={<LoanPredictor lang={lang} />} />
             <Route path="/fraud" element={<FraudDetector lang={lang} />} />
             <Route path="/chat" element={<ChatBot lang={lang} />} />
             <Route path="/transfer" element={<MoneyTransfer lang={lang} />} />
             <Route path="/insurance" element={<Insurance lang={lang} />} />
             <Route path="/credit" element={<CreditScore lang={lang} />} />
           </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
