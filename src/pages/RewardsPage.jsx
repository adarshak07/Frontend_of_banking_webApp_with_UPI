import React, { useEffect, useState } from "react";
import { getLedger } from "../services/paymentsService";
import { getWalletData } from "../services/coinService";

const RewardsPage = () => {
  const [coins, setCoins] = useState(0);
  const [prevCoins, setPrevCoins] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [ledger, setLedger] = useState([]);

  useEffect(() => { 
    if(prevCoins && coins>prevCoins){ 
      setCelebrate(true); 
      setTimeout(()=>setCelebrate(false),1500); 
    } 
    setPrevCoins(coins);
    
    const loadData = async () => {
      try {
        const userId = 1; // dev demo
        const [walletData, ledgerData] = await Promise.all([
          getWalletData(),
          getLedger(userId, 20).catch(() => [])
        ]);
        
        setCoins(walletData.coins);
        setLedger(ledgerData);
      } catch (error) {
        console.error("Error loading rewards data:", error);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className={"p-6 max-w-7xl mx-auto" + (celebrate? ' celebrate':'')}>
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🏆</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">Rewards Center</h1>
        <p className="text-xl text-purple-200 mb-6">Earn coins with every transaction and unlock amazing rewards</p>
      </div>

      {/* Wallet Coins Card */}
      <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl shadow-2xl p-8 mb-8 border border-yellow-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Wallet Coins</h2>
          <div className="text-6xl font-bold text-slate-900 mb-4">{coins}</div>
          <p className="text-yellow-100 text-lg">Available for redemption</p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl shadow-xl p-8 mb-8 border border-indigo-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚙️</span>
          </div>
          <h2 className="text-3xl font-bold text-cyan-100 mb-4">How It Works</h2>
          <p className="text-purple-200 text-lg">Earn coins with every transaction and get daily bonuses</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 rounded-xl border border-slate-600">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-100">Transaction Rewards</h3>
            </div>
            <p className="text-purple-200 text-lg font-mono">
              Coins per payment = max(1, floor(amount / 100))
            </p>
            <p className="text-slate-300 text-sm mt-2">
              Earn 1 coin for every ₹100 spent, minimum 1 coin per transaction
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 rounded-xl border border-slate-600">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-100">Daily Bonus</h3>
            </div>
            <p className="text-purple-200 text-lg font-mono">
              Daily bonus: 20 coins after 5 successful payments
            </p>
            <p className="text-slate-300 text-sm mt-2">
              Complete 5 transactions in a day to unlock bonus coins
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-100">Transaction Ledger</h2>
              <p className="text-purple-200">Your complete rewards history</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-slate-900 px-4 py-2 rounded-full font-semibold">
            {ledger.length} Transactions
          </div>
        </div>

        {ledger.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No transactions yet</h3>
            <p className="text-purple-200">Start making payments to earn your first coins!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-600">
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Type</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Coins</th>
                  <th className="text-left py-4 px-4 font-bold text-cyan-100 text-lg">Note</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((e, index) => (
                  <tr key={e.id} className={`border-b border-slate-700 hover:bg-slate-700 transition-colors duration-200 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}`}>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        e.type === 'PAYMENT' ? 'bg-green-500 text-slate-900' :
                        e.type === 'BONUS' ? 'bg-yellow-500 text-slate-900' :
                        e.type === 'REDEMPTION' ? 'bg-red-500 text-slate-900' :
                        'bg-gray-500 text-slate-900'
                      }`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-2xl font-bold ${
                        e.coins > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {e.coins > 0 ? '+' : ''}{e.coins}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-purple-200 font-medium">{e.note}</td>
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

export default RewardsPage;
