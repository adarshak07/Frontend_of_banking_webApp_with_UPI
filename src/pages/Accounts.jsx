import React, { useEffect, useState } from "react";
import api from "../api";

export default function Accounts() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Withdraw
  const [withdrawData, setWithdrawData] = useState({ accountId: null, maskedCard: "", amount: "" });
  const [withdrawing, setWithdrawing] = useState(false);

  // History
  const [history, setHistory] = useState([]);
  const [historyOf, setHistoryOf] = useState(null); // { accountId, maskedCard }
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setErr("");
      const { data } = await api.get("/accounts");
      if (data?.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
      } else {
        setErr("Failed to fetch accounts");
      }
    } catch (e) {
      setErr(e?.response?.data?.errors || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  // Add new account
  const addAccount = async () => {
    if (items.length >= 3) {
      setErr("Maximum account limit reached (3 accounts)");
      return;
    }
    
    try {
      setAdding(true);
      setErr("");
      setMsg("");
      const { data } = await api.post("/accounts");
      if (data?.success) {
        setMsg(`✅ Account created successfully! Account #${data.data.id} • Balance: ₹${data.data.balance}`);
        await fetchAccounts();
        setTimeout(() => setMsg(""), 5000); // Clear message after 5 seconds
      } else {
        setErr("Failed to create account");
      }
    } catch (e) {
      setErr(e?.response?.data?.errors || e.message || "Failed to create account. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // Delete account
  const deleteAccount = async (accountId) => {
    if (!accountId) return;
    
    if (!window.confirm(`Are you sure you want to delete Account ${accountId}? This action cannot be undone.`)) {
      return;
    }
    
    setErr("");
    setMsg("");
    try {
      const { data } = await api.delete(`/accounts/${accountId}`);
      if (data?.success) {
        setMsg(`✅ Account ${accountId} deleted successfully!`);
        await fetchAccounts();
        setTimeout(() => setMsg(""), 5000); // Clear message after 5 seconds
      } else {
        setErr("Failed to delete account");
      }
    } catch (e) {
      setErr(e?.response?.data?.errors || e.message || "Failed to delete account. Please try again.");
    }
  };

  // Withdraw money
  const withdraw = async () => {
    try {
      if (!withdrawData.amount) return alert("Enter amount");
      setWithdrawing(true);
      const { data } = await api.post("/transaction/withdraw", {
        ...withdrawData,
        amount: Number(withdrawData.amount)
      });
      if (data?.success) {
        alert("Withdraw successful!");
        setWithdrawData({ accountId: null, maskedCard: "", amount: "" });
        await fetchAccounts();
        // refresh history if open
        if (historyOf?.accountId) fetchHistory(historyOf.accountId, historyOf.maskedCard, true);
      } else {
        alert("Failed to withdraw");
      }
    } catch (e) {
      alert(e?.response?.data?.errors || e.message);
    } finally {
      setWithdrawing(false);
    }
  };

  // Fetch transaction history for an account
  const fetchHistory = async (accountId, maskedCard, silent=false) => {
    try {
      setHistoryLoading(!silent);
      setHistory([]);
      setHistoryOf({ accountId, maskedCard });
      const { data } = await api.get(`/transaction/history/${accountId}`);
      if (data?.success) {
        setHistory(Array.isArray(data.data) ? data.data : []);
      } else {
        alert("Failed to fetch history");
      }
    } catch (e) {
      alert(e?.response?.data?.errors || e.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            Your Accounts
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Manage your bank accounts with style and precision. Built for the modern digital banking experience.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border border-green-500 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold text-white">
                  ₹{items.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border border-blue-500 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Accounts</p>
                <p className="text-3xl font-bold text-white">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🏦</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 border border-purple-500 shadow-2xl">
            <div className="flex items-center justify-between">
        <div>
                <p className="text-purple-100 text-sm font-medium">Account Limit</p>
                <p className="text-3xl font-bold text-white">{items.length}/3</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-cyan-100 mb-2">Account Management</h2>
            <p className="text-purple-200">Create, manage, and monitor your bank accounts</p>
        </div>
        <button 
          onClick={addAccount} 
            disabled={adding || items.length >= 3}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
        >
          {adding ? (
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating...
            </div>
            ) : items.length >= 3 ? (
              "Limit Reached (3/3)"
          ) : (
              "➕ Create Account"
          )}
        </button>
      </div>

      {/* Error Message */}
      {err && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
          <div className="flex items-center">
              <div className="text-red-300 text-lg mr-2">❌</div>
              <div className="text-red-100 font-medium">{String(err)}</div>
            </div>
        </div>
      )}

      {/* Success Message */}
      {msg && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-800 to-emerald-900 border border-green-500 rounded-xl">
          <div className="flex items-center">
            <div className="text-green-300 text-lg mr-2">✅</div>
            <div className="text-green-100 font-medium">{String(msg)}</div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-purple-200 text-lg">Loading accounts...</p>
        </div>
      ) : items.length ? (
        /* Accounts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {items.map((a, i) => (
              <div key={a.accountId ?? i} className="group bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl shadow-2xl p-8 border border-slate-600 hover:border-cyan-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-3xl">
                {/* Account Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {a.accountId}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-100">Account {a.accountId}</h3>
                      <p className="text-sm text-purple-300 font-mono">{a.maskedCard}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-400">₹{Number(a.balance ?? 0).toLocaleString()}</p>
                    <p className="text-sm text-purple-200">Available Balance</p>
                  </div>
                </div>
                
                {/* Account Details */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center py-2 px-4 bg-slate-700 rounded-lg">
                    <span className="text-purple-200 text-sm">Account Type</span>
                    <span className="text-cyan-100 font-semibold">Savings</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-slate-700 rounded-lg">
                    <span className="text-purple-200 text-sm">Status</span>
                    <span className="text-green-400 font-semibold flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
              </div>
              
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setWithdrawData({ ...withdrawData, accountId: a.accountId, maskedCard: a.maskedCard })}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  💸 Withdraw
                </button>
                <button 
                  onClick={() => fetchHistory(a.accountId, a.maskedCard)} 
                  disabled={!a.accountId}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  📊 History
                </button>
              </div>

                {/* Delete Button */}
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <button 
                    onClick={() => deleteAccount(a.accountId)}
                    className="w-full bg-gradient-to-r from-red-800 to-pink-800 hover:from-red-900 hover:to-pink-900 text-red-200 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    🗑️ Delete Account
                  </button>
                </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Accounts State */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="text-5xl">🏦</span>
          </div>
            <h3 className="text-3xl font-bold text-cyan-100 mb-4">No accounts found</h3>
            <p className="text-purple-200 text-lg mb-8 max-w-md mx-auto">
              Get started by creating your first account and experience modern banking
            </p>
          <button 
            onClick={addAccount} 
            disabled={adding}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
            >
              {adding ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                "🚀 Create Your First Account"
              )}
          </button>
        </div>
      )}

      {/* Modern Withdraw Form */}
      {withdrawData.maskedCard && (
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💸</span>
            </div>
            <h3 className="text-2xl font-bold text-cyan-100 mb-2">Withdraw from {withdrawData.maskedCard}</h3>
            <p className="text-purple-200">Enter the amount you want to withdraw</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawData.amount}
                onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
              />
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setWithdrawData({ accountId: null, maskedCard: "", amount: "" })}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button 
                onClick={withdraw} 
                disabled={withdrawing || !withdrawData.amount}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {withdrawing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Confirm Withdraw"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern History Section */}
      {historyOf && (
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-cyan-100 mb-2">📊 Transaction History</h3>
              <p className="text-purple-200">{historyOf.maskedCard} (ID: {historyOf.accountId})</p>
            </div>
            <button 
              onClick={() => { setHistoryOf(null); setHistory([]); }}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              ✕ Close
            </button>
          </div>

          {historyLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading history...</p>
            </div>
          ) : history.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-cyan-100">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-cyan-100">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-cyan-100">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-cyan-100">Date/Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-cyan-100">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, index) => (
                    <tr key={h.transactionId} className={`border-b border-slate-600 hover:bg-slate-700 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700'}`}>
                      <td className="py-3 px-4 font-mono text-sm text-cyan-100">{h.transactionId}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          h.type === 'DEPOSIT' ? 'bg-green-800 text-green-200' :
                          h.type === 'WITHDRAW' ? 'bg-red-800 text-red-200' :
                          h.type === 'TRANSFER_IN' ? 'bg-blue-800 text-blue-200' :
                          h.type === 'TRANSFER_OUT' ? 'bg-orange-800 text-orange-200' :
                          'bg-gray-800 text-gray-200'
                        }`}>
                          {h.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-lg text-cyan-100">₹{Number(h.amount ?? 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-purple-200">{h.dateTime}</td>
                      <td className="py-3 px-4 font-semibold text-green-400">₹{Number(h.balanceAfter ?? 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-purple-200 text-lg">No transactions found for this account</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
