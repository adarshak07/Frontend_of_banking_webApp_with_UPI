import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function RechargePage() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const providers = [
    { id: 'airtel', name: 'Airtel', icon: '📱', color: 'from-red-500 to-red-600' },
    { id: 'jio', name: 'Jio', icon: '📶', color: 'from-blue-500 to-blue-600' },
    { id: 'vi', name: 'Vi', icon: '📞', color: 'from-purple-500 to-purple-600' },
    { id: 'bsnl', name: 'BSNL', icon: '🏛️', color: 'from-orange-500 to-orange-600' }
  ];

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!selectedProvider || !phoneNumber || !amount) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage(`✅ Recharge successful! ₹${amount} recharged to ${phoneNumber}`);
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mb-4">
            Mobile Recharge
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Recharge your mobile instantly with lightning-fast processing and amazing offers
          </p>
        </motion.div>

        {/* Main Recharge Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl shadow-2xl p-8 border border-slate-600"
        >
          <form onSubmit={handleRecharge} className="space-y-8">
            {/* Provider Selection */}
            <div>
              <h3 className="text-2xl font-bold text-cyan-100 mb-6">Select Provider</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedProvider === provider.id
                        ? `bg-gradient-to-r ${provider.color} border-transparent text-white shadow-lg`
                        : 'bg-slate-700 border-slate-600 text-cyan-100 hover:border-cyan-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{provider.icon}</div>
                    <div className="font-semibold">{provider.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-lg font-semibold text-cyan-100 mb-3">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">📱</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                  maxLength="10"
                />
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-lg font-semibold text-cyan-100 mb-3">Recharge Amount</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setAmount(amount.toString())}
                    className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-cyan-100 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">₹</span>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                  min="1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Recharge...
                </div>
              ) : (
                '⚡ Recharge Now'
              )}
            </button>
          </form>

          {/* Messages */}
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
              <div className="flex items-center">
                <div className="text-red-300 text-lg mr-2">❌</div>
                <div className="text-red-100 font-medium">{error}</div>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-800 to-emerald-900 border border-green-500 rounded-xl">
              <div className="flex items-center">
                <div className="text-green-300 text-lg mr-2">✅</div>
                <div className="text-green-100 font-medium">{message}</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border border-blue-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">Instant Recharge</h3>
              <p className="text-blue-200">Get recharged instantly with our lightning-fast processing</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 border border-purple-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Best Offers</h3>
              <p className="text-purple-200">Exclusive cashback and bonus data on every recharge</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border border-green-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-green-100 mb-2">Secure Payment</h3>
              <p className="text-green-200">Bank-grade security with encrypted transactions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
