import React, { useState, useEffect } from "react";
import api from "../api";
import { getAccounts } from "../services/accountService";

export default function Deposit() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    getAccounts().then(data => {
      const accountsData = data?.data || data || [];
      setAccounts(Array.isArray(accountsData) ? accountsData : []);
    }).catch(() => {
      setAccounts([]);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    setLoading(true);
    
    if (!selectedAccount || !amount) {
      setErr("Please select an account and enter amount");
      setLoading(false);
      return;
    }

    if (parseFloat(amount) <= 0) {
      setErr("Amount must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/transaction/deposit", { 
        accountId: Number(selectedAccount), 
        amount: Number(amount) 
      });
      if (data?.success) {
        setMsg(`✅ Deposit successful! Transaction #${data.data.id} • New balance: ₹${data.data.balance}`);
        setAmount("");
        setSelectedAccount("");
        loadAccounts(); // Refresh accounts to show updated balance
      } else {
        setErr("Deposit failed");
      }
    } catch (e) {
      const errorMessage = e?.response?.data?.errors || e?.response?.data?.message || e.message || "Deposit failed. Please try again.";
      setErr(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-100 mb-2">💰 Deposit Funds</h2>
          <p className="text-purple-200">Add money to your account easily and securely</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Account Selection */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">
              Select Account to Deposit Into
            </label>
            <select 
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg"
              required
            >
              <option value="">Choose an account</option>
              {Array.isArray(accounts) && accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  Account {acc.id} - **** **** **** {acc.card_number?.slice(-4)} (Balance: ₹{acc.balance})
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">
              Amount to Deposit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">₹</span>
              <input 
                type="number" 
                min="1" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount"
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                required 
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Quick Amounts</label>
            <div className="grid grid-cols-4 gap-3">
              {[100, 500, 1000, 5000].map(quickAmount => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-cyan-100 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {msg && (
            <div className="p-4 bg-gradient-to-r from-green-800 to-emerald-900 border border-green-500 rounded-xl">
              <div className="flex items-center">
                <div className="text-green-300 text-lg mr-2">✅</div>
                <div className="text-green-100 font-medium">{msg}</div>
              </div>
            </div>
          )}
          
          {err && (
            <div className="p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
              <div className="flex items-center">
                <div className="text-red-300 text-lg mr-2">❌</div>
                <div className="text-red-100 font-medium">{typeof err === 'object' ? JSON.stringify(err) : String(err)}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || !selectedAccount || !amount}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-2"></div>
                Processing...
              </div>
            ) : (
              "💳 Deposit Money"
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-800 to-blue-900 border border-indigo-500 rounded-xl">
          <div className="flex items-start">
            <div className="text-cyan-300 text-lg mr-2">🔒</div>
            <div className="text-cyan-100 text-sm">
              <strong>Secure Deposit:</strong> Your money is deposited instantly and securely. 
              All transactions are encrypted and protected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
