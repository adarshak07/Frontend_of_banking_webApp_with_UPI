import React, { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import { getStatement, exportStatement } from "../services/transactionService";

export default function TransactionStatement() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    accountId: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
    type: '',
    category: ''
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAccounts();
        const arr = data?.data?.accounts || data?.data || data?.accounts || [];
        setAccounts(arr);
        if (arr.length) {
          setForm(f => ({
            ...f,
            accountId: arr[0].id || arr[0].accountId || arr[0].account?.id
          }));
        }
      } catch (e) {
        setError('Failed to load accounts');
      }
    })();
  }, []);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') delete payload[k];
      });
      const res = await getStatement(payload);
      const items = res?.data?.transactions || res?.data || res || [];
      setRows(items);
    } catch (e) {
      setError('Could not fetch statement');
    } finally {
      setLoading(false);
    }
  };

  const doExport = async (fmt) => {
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') delete payload[k];
      });
      const blob = await exportStatement(payload, fmt);
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = fmt === 'pdf' ? 'statement.pdf' : 'statement.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-100 mb-2">📊 Transaction Statement</h1>
            <p className="text-purple-200 text-lg">View and export your transaction history</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
        </div>
      </div>

      {/* Filter Form */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8">
        <h2 className="text-2xl font-bold text-cyan-100 mb-6">Filter Transactions</h2>
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">Account</label>
              <select
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                name="accountId"
                value={form.accountId}
                onChange={onChange}
              >
                {accounts.map((a, i) => {
                  const id = a.id || a.accountId || a.account?.id;
                  const label = a.name ? `${a.name} • ${id}` : `Account ${id}`;
                  return (
                    <option key={id || i} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">From Date</label>
              <input
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">To Date</label>
              <input
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={onChange}
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">Type</label>
              <select
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                name="type"
                value={form.type}
                onChange={onChange}
              >
                <option value="">Any</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAW">Withdraw</option>
                <option value="TRANSFER_IN">Transfer In</option>
                <option value="TRANSFER_OUT">Transfer Out</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount Range */}
            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">Min Amount (₹)</label>
              <input
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-purple-300"
                type="number"
                name="minAmount"
                placeholder="Min Amount"
                value={form.minAmount}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">Max Amount (₹)</label>
              <input
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-purple-300"
                type="number"
                name="maxAmount"
                placeholder="Max Amount"
                value={form.maxAmount}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-100 mb-2">Category</label>
              <input
                className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-purple-300"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                "🔍 Apply Filters"
              )}
            </button>

            <button
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              type="button"
              onClick={() => doExport('csv')}
            >
              📄 Export CSV
            </button>

            <button
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              type="button"
              onClick={() => doExport('pdf')}
            >
              📋 Export PDF
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
            <div className="flex items-center">
              <div className="text-red-300 text-lg mr-2">❌</div>
              <div className="text-red-100 font-medium">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-100">Transaction Results</h2>
          {rows.length > 0 && (
            <div className="text-purple-200 text-sm">
              {rows.length} transaction{rows.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-purple-200 text-lg">Loading transactions...</p>
          </div>
        ) : rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-600">
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Type</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Balance</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Notes</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Category</th>
                  <th className="text-left py-4 px-4 font-semibold text-cyan-100">Reference</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const type = (r.type || '').toLowerCase();
                  return (
                    <tr
                      key={r.transactionId || idx}
                      className={`border-b border-slate-600 hover:bg-slate-700 ${
                        idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700'
                      }`}
                    >
                      <td className="py-4 px-4 font-mono text-sm text-cyan-100">
                        {r.transactionId || r.id || idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            type === 'deposit'
                              ? 'bg-green-800 text-green-200'
                              : type === 'withdraw'
                              ? 'bg-red-800 text-red-200'
                              : type === 'transfer_in'
                              ? 'bg-blue-800 text-blue-200'
                              : type === 'transfer_out'
                              ? 'bg-orange-800 text-orange-200'
                              : 'bg-gray-800 text-gray-200'
                          }`}
                        >
                          {r.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-lg text-cyan-100">
                        ₹{Number(r.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-purple-200">
                        {r.timestamp || r.date || r.dateTime}
                      </td>
                      <td className="py-4 px-4 font-semibold text-green-400">
                        ₹{Number(r.balanceAfter || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-purple-200">{r.notes || '-'}</td>
                      <td className="py-4 px-4 text-sm text-purple-200">{r.category || '-'}</td>
                      <td className="py-4 px-4 text-sm text-purple-200">{r.referenceNumber || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No transactions found</h3>
            <p className="text-purple-200 text-lg">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
}
