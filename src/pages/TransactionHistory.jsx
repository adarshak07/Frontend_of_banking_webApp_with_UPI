import React, { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import { getHistory } from "../services/transactionService";

export default function TransactionHistory() {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAccounts();
        const arr = data?.data?.accounts || data?.data || data?.accounts || [];
        setAccounts(arr);
        if (arr.length) setSelected(arr[0].id || arr[0].accountId || arr[0].account?.id);
      } catch (e) {
        setError('Failed to load accounts');
      }
    })();
  }, []);

  const fetchHistory = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const res = await getHistory(selected);
      const items = res?.data?.transactions || res?.data || res || [];
      setRows(items);
    } catch (e) {
      setError('Could not fetch history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📊</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">Transaction History</h1>
        <p className="text-xl text-purple-200 mb-6">View all your account transactions and activity</p>
      </div>

      {/* Account Selection */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 mb-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🏦</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-100">Select Account</h2>
              <p className="text-purple-200">Choose an account to view its transaction history</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <select 
            className="flex-1 p-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg"
            value={selected} 
            onChange={e => setSelected(e.target.value)}
          >
            <option value="">Choose an account</option>
            {accounts.map((a, i) => {
              const id = a.id || a.accountId || a.account?.id;
              const label = a.name ? `${a.name} • ${id}` : `Account ${id}`;
              return <option key={id || i} value={id}>{label}</option>;
            })}
          </select>
          <button 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={fetchHistory} 
            disabled={!selected || loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2"></div>
                Loading...
              </div>
            ) : (
              '📈 Fetch History'
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
          <div className="flex items-center">
            <div className="text-red-300 text-lg mr-2">❌</div>
            <div className="text-red-100 font-medium">{error}</div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-100">Transaction Details</h2>
              <p className="text-purple-200">{rows.length} transactions found</p>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No transactions found</h3>
            <p className="text-purple-200">Select an account and fetch history to view transactions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-600">
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">ID</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Type</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Amount</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Date</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Balance</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Notes</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Category</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Ref</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const type = (r.type || '').toLowerCase();
                  return (
                    <tr key={r.transactionId || idx} className={`border-b border-slate-700 hover:bg-slate-700 transition-colors duration-200 ${idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}`}>
                      <td className="py-4 px-4 font-mono text-sm text-cyan-100">{r.transactionId || r.id || idx + 1}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          type === 'deposit' ? 'bg-green-500 text-slate-900' :
                          type === 'withdraw' ? 'bg-red-500 text-slate-900' :
                          type === 'transfer_in' ? 'bg-blue-500 text-slate-900' :
                          type === 'transfer_out' ? 'bg-orange-500 text-slate-900' :
                          'bg-gray-500 text-slate-900'
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xl font-bold ${
                          type === 'deposit' || type === 'transfer_in' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {type === 'deposit' || type === 'transfer_in' ? '+' : '-'}₹{r.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-purple-200 text-sm">{r.timestamp || r.date || r.dateTime}</td>
                      <td className="py-4 px-4 text-cyan-100 font-semibold">₹{r.balanceAfter}</td>
                      <td className="py-4 px-4 text-purple-200">{r.notes || '-'}</td>
                      <td className="py-4 px-4 text-purple-200">{r.category || '-'}</td>
                      <td className="py-4 px-4 text-purple-200 font-mono text-sm">{r.referenceNumber || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}