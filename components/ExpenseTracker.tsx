
import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Expense, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ExpenseTrackerProps {
  lang: Language;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ title: '', amount: '', category: 'Food' });
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Prepare data for chart
  const categoryData = expenses.reduce((acc: any, curr) => {
    const found = acc.find((i: any) => i.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">{t.totalExpenses}</p>
              <h2 className="text-4xl font-bold">${totalExpense.toFixed(2)}</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingDown size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-indigo-100">
             <span>{expenses.length} transactions this month</span>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.addExpense}</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
              <input
                type="text"
                value={newExpense.title}
                onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                placeholder="e.g. Coffee"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.amount}</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.category}</label>
                <select
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                  <option>Entertainment</option>
                  <option>Health</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 shadow-md shadow-blue-200 dark:shadow-none">
              <Plus size={18} /> {t.addExpense}
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Spending Analysis</h3>
          <div className="h-64 flex items-center justify-center">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 dark:text-slate-500 text-center text-sm">
                <Info size={32} className="mx-auto mb-2 opacity-50" />
                <p>No expenses recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.recentActivity}</h3>
          <div className="space-y-3">
            {expenses.length === 0 && (
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">No recent activity.</p>
            )}
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {expense.category.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{expense.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{expense.date} • {expense.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800 dark:text-white">-${expense.amount.toFixed(2)}</span>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;