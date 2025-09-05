import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentPayments, getPaymentsSummary } from "../services/paymentsService";
import { upiService } from "../services/upiService";
import { getWalletData } from "../services/coinService";

const PaymentsHub = () => {
  const [recent, setRecent] = useState([]);
  const [coins, setCoins] = useState(0);
  const [summary, setSummary] = useState({ count: 0, byCategory: {} });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = 1; // dev: show seeded user
        
        // Fetch all data in parallel
        const [payments, walletData, summaryData, vpas] = await Promise.all([
          getRecentPayments(userId, 10).catch(() => []), // Fallback to empty array
          getWalletData(), // Use our coin service
          getPaymentsSummary(userId, 30).catch(() => ({ count: 0, byCategory: {} })), // Fallback to empty summary
          upiService.getUserVpas().catch(() => []) // Fallback to empty array
        ]);

        // Fetch UPI transactions for each VPA
        const upiTransactions = [];
        for (const vpa of vpas) {
          try {
            const transactions = await upiService.getTransactions(vpa.vpa);
            console.log(`UPI transactions for ${vpa.vpa}:`, transactions);
            if (Array.isArray(transactions)) {
              // Transform UPI transactions to match payment format
              const transformedTransactions = transactions.map(txn => ({
                id: `upi_${txn.id || Date.now()}`,
                refId: txn.refId || txn.transactionId || `UPI_${txn.id || Date.now()}`,
                amount: txn.amount || txn.transactionAmount || 0,
                status: txn.status || txn.transactionStatus || 'SUCCESS',
                category: { code: 'UPI' },
                createdAt: txn.createdAt || txn.timestamp || txn.transactionDate || new Date().toISOString(),
                type: 'UPI',
                description: txn.description || txn.remarks || 'UPI Transaction'
              }));
              upiTransactions.push(...transformedTransactions);
            }
          } catch (error) {
            console.log(`No transactions for VPA ${vpa.vpa}:`, error);
          }
        }

        // If no UPI transactions found, add sample UPI transactions for testing
        if (upiTransactions.length === 0 && vpas.length === 0) {
          console.log("No UPI transactions found, adding sample transactions");
          const baseTime = Date.now();
          upiTransactions.push(
            {
              id: `upi_sample_1_${baseTime}`,
              refId: `UPI_${baseTime}`,
              amount: 150,
              status: 'SUCCESS',
              category: { code: 'UPI' },
              createdAt: new Date(baseTime - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              type: 'UPI',
              description: 'UPI Payment to friend'
            },
            {
              id: `upi_sample_2_${baseTime + 1}`,
              refId: `UPI_${baseTime + 1}`,
              amount: 250,
              status: 'SUCCESS',
              category: { code: 'UPI' },
              createdAt: new Date(baseTime - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              type: 'UPI',
              description: 'UPI Payment for groceries'
            },
            {
              id: `upi_sample_3_${baseTime + 2}`,
              refId: `UPI_${baseTime + 2}`,
              amount: 500,
              status: 'SUCCESS',
              category: { code: 'UPI' },
              createdAt: new Date(baseTime - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
              type: 'UPI',
              description: 'UPI Payment for movie tickets'
            }
          );
        }

        // Combine and sort all transactions, removing duplicates
        const allTransactions = [
          ...(Array.isArray(payments) ? payments : []),
          ...upiTransactions
        ]
        .filter((transaction, index, self) => 
          index === self.findIndex(t => t.id === transaction.id)
        )
        .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));

        setRecent(allTransactions.slice(0, 10)); // Show latest 10
        
        // Set wallet coins and summary with calculated data
        setCoins(walletData.coins);
        setSummary({
          count: summaryData.count || allTransactions.length,
          byCategory: summaryData.byCategory || { UPI: allTransactions.filter(t => t.type === 'UPI').length }
        });
      } catch (error) {
        console.error("Error loading hub data:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">💳</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">Payments Hub</h1>
        <p className="text-xl text-purple-200 mb-6">Manage all your payments and transactions in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl shadow-2xl p-8 border border-yellow-500">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Wallet Coins</h3>
              <p className="text-yellow-100 text-sm">Available for redemption</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-slate-900">{coins}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl shadow-2xl p-8 border border-blue-500">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Payments (30d)</h3>
              <p className="text-blue-100 text-sm">Total transactions</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-slate-900">{summary.count}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 mb-8 border border-slate-600">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cyan-100">Quick Actions</h2>
            <p className="text-purple-200">Make payments instantly with these shortcuts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link 
            className="group bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-500"
            to="/recharge"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Recharge</h3>
            <p className="text-green-100 text-sm">Mobile & DTH</p>
          </Link>

          <Link 
            className="group bg-gradient-to-br from-red-600 to-pink-700 rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500"
            to="/cinema"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Cinema</h3>
            <p className="text-red-100 text-sm">Book tickets</p>
          </Link>

          <Link 
            className="group bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-500"
            to="/movie"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📺</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Streaming</h3>
            <p className="text-purple-100 text-sm">Subscribe</p>
          </Link>

          <Link 
            className="group bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-500"
            to="/food"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🍕</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Food</h3>
            <p className="text-orange-100 text-sm">Order meals</p>
          </Link>


          <Link 
            className="group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-500"
            to="/upi/send"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💸</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">UPI Send</h3>
            <p className="text-indigo-100 text-sm">Quick transfer</p>
          </Link>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-100">Recent Payments</h2>
              <p className="text-purple-200">Your latest transaction history</p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2"></div>
                Loading...
              </div>
            ) : (
              '🔄 Refresh'
            )}
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No recent payments</h3>
            <p className="text-purple-200">Start making payments to see them here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-600">
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Reference</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Category</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Amount</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p, index) => (
                  <tr key={p.id} className={`border-b border-slate-700 hover:bg-slate-700 transition-colors duration-200 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}`}>
                    <td className="py-4 px-4 font-mono text-sm text-cyan-100">{p.refId}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        p.type === 'UPI' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-slate-900'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-slate-900'
                      }`}>
                        {p.type === 'UPI' ? 'UPI' : p.category?.code}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-cyan-100 font-bold text-lg">₹{p.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        p.status === 'SUCCESS' ? 'bg-green-500 text-slate-900' :
                        p.status === 'PENDING' ? 'bg-yellow-500 text-slate-900' :
                        p.status === 'FAILED' ? 'bg-red-500 text-slate-900' :
                        'bg-gray-500 text-slate-900'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsHub;
