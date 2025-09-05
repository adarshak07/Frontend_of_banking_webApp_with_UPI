import React, { useEffect, useState } from "react";
import { getAiInsights } from "../services/analyticsService";
import { getAccounts } from "../services/accountService";

export default function AiInsights(){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    (async () => {
      try {
        const acctRes = await getAccounts();
        const data = acctRes?.data || acctRes; // backend returns wrapped ResponseModel
        const list = Array.isArray(data) ? data : [];
        setAccounts(list);
        if (list.length > 0){ setAccountId(list[0].id); }
      } catch (e) {
        setError("Failed to load accounts");
      }
    })();
  }, []);

  useEffect(() => {
    if(!accountId) return;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const res = await getAiInsights(accountId, months);
        const data = res?.data || res;
        setInsights(data);
      } catch (e) {
        setError(typeof e?.message === 'string' ? e.message : "Failed to load AI insights");
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId, months]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🤖</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">AI Insights</h1>
        <p className="text-xl text-purple-200 mb-6">Get intelligent analysis of your financial patterns and spending habits</p>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 mb-8 border border-slate-600">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cyan-100">Analysis Settings</h2>
            <p className="text-purple-200">Configure your AI analysis parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Select Account</label>
            <select 
              value={accountId} 
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>Account {a.id} - ****{a.cardNumber?.slice(-4)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Analysis Period (Months)</label>
            <input 
              type="number" 
              min={1} 
              max={24} 
              value={months} 
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-100 text-lg">Analyzing your financial data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
          <div className="flex items-center">
            <div className="text-red-300 text-lg mr-2">❌</div>
            <div className="text-red-100 font-medium">{error}</div>
          </div>
        </div>
      )}

      {/* Insights Display */}
      {insights && (
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl shadow-xl p-8 border border-indigo-600">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyan-100">AI Summary</h2>
                <p className="text-purple-200">Intelligent analysis of your financial patterns</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6">
              <p className="text-cyan-100 text-lg leading-relaxed">{insights.naturalLanguageSummary}</p>
            </div>
          </div>

          {/* Top Spending Categories & Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-100">Top Spending Categories</h3>
                  <p className="text-purple-200">Your highest expense areas</p>
                </div>
              </div>
              <div className="space-y-3">
                {(insights.topSpendingCategories || []).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <span className="text-cyan-100 font-medium">{c.category}</span>
                    <span className="text-yellow-400 font-bold">₹{Number(c.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-100">Monthly Trends</h3>
                  <p className="text-purple-200">Net change over time</p>
                </div>
              </div>
              <div className="space-y-3">
                {(insights.monthlyTrends || []).map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <span className="text-cyan-100 font-medium">{m.month}</span>
                    <span className={`font-bold ${Number(m.netChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Number(m.netChange) >= 0 ? '+' : ''}₹{Number(m.netChange).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projected Balance */}
          <div className="bg-gradient-to-br from-yellow-800 to-orange-900 rounded-2xl shadow-xl p-8 border border-yellow-600">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyan-100">Projected Month-End Balance</h3>
                <p className="text-yellow-200">AI prediction based on current patterns</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 text-center">
              ₹{Number(insights.projectedMonthEndBalance || 0).toFixed(2)}
            </div>
          </div>

          {/* Risk Alerts */}
          {Array.isArray(insights.riskAlerts) && insights.riskAlerts.length > 0 && (
            <div className="bg-gradient-to-br from-red-800 to-pink-900 rounded-2xl shadow-xl p-8 border border-red-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-100">Risk Alerts</h3>
                  <p className="text-red-200">Important financial warnings</p>
                </div>
              </div>
              <div className="space-y-3">
                {insights.riskAlerts.map((r, idx) => (
                  <div key={idx} className="p-4 bg-slate-800 rounded-lg border-l-4 border-red-500">
                    <p className="text-red-100">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Savings Suggestions */}
          {Array.isArray(insights.savingsSuggestions) && insights.savingsSuggestions.length > 0 && (
            <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-2xl shadow-xl p-8 border border-green-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-100">Savings Suggestions</h3>
                  <p className="text-green-200">AI-powered money-saving tips</p>
                </div>
              </div>
              <div className="space-y-3">
                {insights.savingsSuggestions.map((s, idx) => (
                  <div key={idx} className="p-4 bg-slate-800 rounded-lg border-l-4 border-green-500">
                    <p className="text-green-100">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


