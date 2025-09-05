import React, { useState, useEffect } from "react";
import api from "../api";
import { getAccounts } from "../services/accountService";

export default function Withdraw() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const getSelectedAccountDetails = () => {
    if (!selectedAccount || !Array.isArray(accounts)) return null;
    return accounts.find(acc => acc && acc.id && acc.id.toString() === selectedAccount);
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

    const accountDetails = getSelectedAccountDetails();
    if (accountDetails && parseFloat(amount) > (accountDetails.balance || accountDetails.availableBalance || 0)) {
      setErr("Insufficient balance. Available: ₹" + (accountDetails.balance || accountDetails.availableBalance || 0));
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/transaction/withdraw", { 
        accountId: Number(selectedAccount), 
        amount: Number(amount) 
      });
      if (data?.success) {
        setMsg(`✅ Withdrawal successful! Transaction #${data.data.id} • New balance: ₹${data.data.balance}`);
        setAmount("");
        setSelectedAccount("");
        setShowConfirm(false);
        loadAccounts(); // Refresh accounts to show updated balance
      } else {
        setErr("Withdrawal failed");
      }
    } catch (e) {
      const errorMessage = e?.response?.data?.errors || e?.response?.data?.message || e.message || "Withdrawal failed. Please try again.";
      setErr(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setAmount("");
    setSelectedAccount("");
  };

  const accountDetails = getSelectedAccountDetails();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-100 mb-2">💸 Withdraw Funds</h2>
          <p className="text-purple-200">Withdraw money from your account securely</p>
        </div>

        {!showConfirm ? (
          <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-6">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">
                Select Account to Withdraw From
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
                Amount to Withdraw (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">₹</span>
                <input 
                  type="number" 
                  min="1" 
                  step="0.01"
                  max={accountDetails?.balance || 999999}
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="Enter amount"
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                  required 
                />
              </div>
              {accountDetails && (
                <p className="text-sm text-purple-300 mt-1">
                  Available balance: ₹{accountDetails.balance || accountDetails.availableBalance || 0}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">Quick Amounts</label>
              <div className="grid grid-cols-4 gap-3">
                {[100, 500, 1000, 2000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    disabled={accountDetails && quickAmount > (accountDetails.balance || accountDetails.availableBalance || 0)}
                    className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-cyan-100 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Messages */}
            {err && (
              <div className="p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
                <div className="flex items-center">
                  <div className="text-red-300 text-lg mr-2">❌</div>
                  <div className="text-red-100 font-medium">{typeof err === 'object' ? JSON.stringify(err) : String(err)}</div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button 
              type="submit" 
              disabled={!selectedAccount || !amount || (accountDetails && parseFloat(amount) > (accountDetails.balance || accountDetails.availableBalance || 0))}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              Continue to Withdraw
            </button>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-100 mb-2">Confirm Withdrawal</h3>
              <p className="text-purple-200">Please review your withdrawal details</p>
            </div>

            <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Account:</span>
                  <span className="font-semibold text-cyan-100">Account {selectedAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Amount:</span>
                  <span className="font-semibold text-red-400">₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Available Balance:</span>
                  <span className="font-semibold text-green-400">₹{accountDetails?.balance || accountDetails?.availableBalance || 0}</span>
                </div>
                <div className="border-t border-slate-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">New Balance:</span>
                    <span className="font-semibold text-cyan-400">₹{(accountDetails?.balance || accountDetails?.availableBalance || 0) - parseFloat(amount)}</span>
                  </div>
                </div>
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

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button 
                onClick={handleCancel}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button 
                onClick={onSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Confirm Withdraw"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-800 to-blue-900 border border-indigo-500 rounded-xl">
          <div className="flex items-start">
            <div className="text-cyan-300 text-lg mr-2">🔒</div>
            <div className="text-cyan-100 text-sm">
              <strong>Secure Withdrawal:</strong> Your withdrawal is processed instantly and securely. 
              All transactions are encrypted and protected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
