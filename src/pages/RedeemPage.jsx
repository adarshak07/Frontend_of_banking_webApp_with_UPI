import React, { useEffect, useState } from "react";
import { getRedeemProducts, redeemProduct } from "../services/paymentsService";
import { getWalletData } from "../services/coinService";

const RedeemPage = () => {
  const [products, setProducts] = useState([]);
  const [coins, setCoins] = useState(0);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = 1;
        const [productsData, walletData] = await Promise.all([
          getRedeemProducts().catch(() => []),
          getWalletData()
        ]);
        
        setProducts(productsData);
        setCoins(walletData.coins);
      } catch (error) {
        console.error("Error loading redeem data:", error);
      }
    };
    
    loadData();
  }, []);

  const onRedeem = async (product) => {
    setError(null);
    try {
      const userId = 1;
      const res = await redeemProduct({ userId, productId: product.id });
      setSelected(product);
      setCode(res.code);
    } catch (e) {
      setError(e?.response?.data?.data?.error || e?.response?.data?.errors || "Redeem failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎁</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">Redeem Rewards</h1>
        <p className="text-xl text-purple-200 mb-6">Exchange your coins for amazing gift cards and rewards</p>
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

      {/* Products Grid */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">🛍️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cyan-100">Available Rewards</h2>
            <p className="text-purple-200">Choose from our collection of gift cards</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No products available</h3>
            <p className="text-purple-200">Check back later for new rewards</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-slate-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎫</span>
                  </div>
                  <h3 className="text-xl font-bold text-cyan-100 mb-2">{p.brand}</h3>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">₹{p.valueRupees}</div>
                  <div className="text-purple-200 text-sm">Gift Card Value</div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-cyan-100">{p.costCoins}</div>
                  <div className="text-purple-200 text-sm">Coins Required</div>
                </div>

                <button 
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    coins >= p.costCoins
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-slate-900'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-slate-300 cursor-not-allowed'
                  }`}
                  onClick={() => onRedeem(p)}
                  disabled={coins < p.costCoins}
                >
                  {coins >= p.costCoins ? '🎁 Redeem Now' : '❌ Insufficient Coins'}
                </button>
              </div>
            ))}
          </div>
        )}
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

      {/* Success Message */}
      {code && (
        <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-2xl shadow-xl p-8 border border-green-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-green-100 mb-4">Gift Card Issued Successfully!</h3>
            <div className="bg-slate-800 rounded-xl p-6 mb-4">
              <div className="text-cyan-100 text-lg mb-2">
                <strong>Product:</strong> {selected.brand} ₹{selected.valueRupees}
              </div>
              <div className="text-cyan-100 text-lg">
                <strong>Code:</strong> 
                <span className="font-mono text-2xl text-yellow-400 ml-2">{code}</span>
              </div>
            </div>
            <p className="text-green-200 text-sm">
              Your gift card code has been generated. Use it at checkout to redeem your reward!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemPage;
