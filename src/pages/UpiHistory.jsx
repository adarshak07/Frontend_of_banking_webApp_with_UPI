import React, { useEffect, useState } from "react";
import { upiService } from "../services/upiService";

export default function UpiHistory() {
  const [vpa, setVpa] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!vpa.trim()) {
      setError("Please enter a UPI ID");
      return;
    }
    
    setLoading(true);
    setError("");
      try {
        const data = await upiService.getTransactions(vpa);
        setItems(data || []);
    } catch (e) { 
      setItems([]);
      setError("Failed to load transactions. Please check the UPI ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if(vpa.trim()){ 
      load(); 
    } 
  }, [vpa]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-100 mb-2">📊 UPI Transactions</h1>
            <p className="text-purple-200 text-lg">View your UPI transaction history</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8">
        <h2 className="text-2xl font-bold text-cyan-100 mb-6">Search Transactions</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Enter UPI ID</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">@</span>
              <input 
                placeholder="Enter UPI ID to search transactions" 
                value={vpa} 
                onChange={e => setVpa(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={load}
              disabled={loading || !vpa.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                "🔍 Search"
              )}
            </button>
          </div>
        </div>

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

      {/* Results Section */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-100">Transaction Results</h2>
          {items.length > 0 && (
            <div className="text-purple-200 text-sm">
              {items.length} transaction{items.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-purple-200 text-lg">Loading transactions...</p>
          </div>
        ) : items.length ? (
          <div className="space-y-4">
            {items.map((it, index) => (
              <div 
                key={it.transactionId || index} 
                className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600 hover:border-cyan-500 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      it.type === 'SEND' ? 'bg-red-800' :
                      it.type === 'RECEIVE' ? 'bg-green-800' :
                      it.type === 'REQUEST' ? 'bg-blue-800' :
                      'bg-gray-800'
                    }`}>
                      <span className="text-xl">
                        {it.type === 'SEND' ? '💸' :
                         it.type === 'RECEIVE' ? '💰' :
                         it.type === 'REQUEST' ? '📨' :
                         '💳'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-100">{it.type}</h3>
                      <p className="text-sm text-purple-200">
                        {new Date(it.dateTime || it.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      it.type === 'SEND' ? 'text-red-400' :
                      it.type === 'RECEIVE' ? 'text-green-400' :
                      'text-cyan-400'
                    }`}>
                      {it.type === 'SEND' ? '-' : '+'}₹{Number(it.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-200">Balance: ₹{Number(it.balanceAfter || 0).toLocaleString()}</p>
                  </div>
                </div>
                
                {it.notes && (
                  <div className="mt-4 p-3 bg-slate-600 rounded-lg">
                    <p className="text-sm text-purple-200">
                      <span className="font-semibold text-cyan-100">Note:</span> {it.notes}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-purple-200">
                  <div className="flex items-center space-x-4">
                    <span>Transaction ID: <span className="font-mono text-cyan-100">{it.transactionId || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      it.status === 'SUCCESS' ? 'bg-green-800 text-green-200' :
                      it.status === 'FAILED' ? 'bg-red-800 text-red-200' :
                      it.status === 'PENDING' ? 'bg-yellow-800 text-yellow-200' :
                      'bg-gray-800 text-gray-200'
                    }`}>
                      {it.status || 'COMPLETED'}
                    </span>
                  </div>
                </div>
          </div>
        ))}
          </div>
        ) : vpa ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No transactions found</h3>
            <p className="text-purple-200 text-lg">No transactions found for UPI ID: <span className="font-mono text-cyan-100">{vpa}</span></p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">Search UPI Transactions</h3>
            <p className="text-purple-200 text-lg">Enter a UPI ID above to view transaction history</p>
          </div>
        )}
      </div>
    </div>
  );
}


