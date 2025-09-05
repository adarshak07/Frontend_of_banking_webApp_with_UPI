import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MoviePage() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const streamingPlans = [
    { 
      id: 'netflix', 
      name: 'Netflix', 
      icon: '🎬', 
      color: 'from-red-500 to-red-600',
      price: 199,
      features: ['HD Streaming', 'Multiple Devices', 'Download Offline']
    },
    { 
      id: 'prime', 
      name: 'Amazon Prime', 
      icon: '📺', 
      color: 'from-blue-500 to-blue-600',
      price: 149,
      features: ['4K Streaming', 'Prime Delivery', 'Music Included']
    },
    { 
      id: 'disney', 
      name: 'Disney+ Hotstar', 
      icon: '🏰', 
      color: 'from-purple-500 to-purple-600',
      price: 299,
      features: ['Live Sports', 'Disney Content', 'Multiple Profiles']
    },
    { 
      id: 'sony', 
      name: 'SonyLIV', 
      icon: '📡', 
      color: 'from-orange-500 to-orange-600',
      price: 99,
      features: ['Live TV', 'Sports', 'Regional Content']
    },
    { 
      id: 'zee', 
      name: 'ZEE5', 
      icon: '🎭', 
      color: 'from-pink-500 to-pink-600',
      price: 99,
      features: ['Bollywood Movies', 'Web Series', 'Live TV']
    },
    { 
      id: 'voot', 
      name: 'Voot', 
      icon: '🎪', 
      color: 'from-green-500 to-green-600',
      price: 99,
      features: ['Reality Shows', 'Kids Content', 'News']
    }
  ];

  const durations = [
    { id: '1month', name: '1 Month', discount: 0 },
    { id: '3months', name: '3 Months', discount: 10 },
    { id: '6months', name: '6 Months', discount: 20 },
    { id: '1year', name: '1 Year', discount: 30 }
  ];

  const handleSubscription = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !selectedDuration) {
      setError('Please select a plan and duration');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage(`🎬 Subscription successful! You can now enjoy ${selectedPlan} for ${selectedDuration}`);
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }, 2000);
  };

  const getTotalPrice = () => {
    if (!selectedPlan || !selectedDuration) return 0;
    const plan = streamingPlans.find(p => p.id === selectedPlan);
    const duration = durations.find(d => d.id === selectedDuration);
    if (!plan || !duration) return 0;
    
    const basePrice = plan.price;
    const discount = (basePrice * duration.discount) / 100;
    return Math.round(basePrice - discount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4">
            Movie Streaming
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Subscribe to your favorite streaming platforms with exclusive offers and instant activation
          </p>
        </motion.div>

        {/* Streaming Plans Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-cyan-100 mb-8">Choose Your Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamingPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  selectedPlan === plan.id
                    ? `bg-gradient-to-r ${plan.color} border-transparent text-white shadow-2xl`
                    : 'bg-slate-800 border-slate-600 text-cyan-100 hover:border-purple-500'
                }`}
              >
                <div className="text-4xl mb-4 text-center">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-center">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4 text-center">₹{plan.price}/month</div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscription Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl shadow-2xl p-8 border border-slate-600"
        >
          <h2 className="text-3xl font-bold text-cyan-100 mb-8">Complete Your Subscription</h2>
          
          <form onSubmit={handleSubscription} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Duration Selection */}
              <div>
                <label className="block text-lg font-semibold text-cyan-100 mb-3">Select Duration</label>
                <div className="space-y-3">
                  {durations.map((duration) => (
                    <button
                      key={duration.id}
                      type="button"
                      onClick={() => setSelectedDuration(duration.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedDuration === duration.id
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-transparent text-white'
                          : 'bg-slate-700 border-slate-600 text-cyan-100 hover:border-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{duration.name}</span>
                        {duration.discount > 0 && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                            {duration.discount}% OFF
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div>
                <label className="block text-lg font-semibold text-cyan-100 mb-3">Price Summary</label>
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                  {selectedPlan && selectedDuration ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-cyan-100">Platform:</span>
                        <span className="text-cyan-100 font-semibold">
                          {streamingPlans.find(p => p.id === selectedPlan)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-100">Duration:</span>
                        <span className="text-cyan-100 font-semibold">
                          {durations.find(d => d.id === selectedDuration)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-100">Base Price:</span>
                        <span className="text-cyan-100">₹{streamingPlans.find(p => p.id === selectedPlan)?.price}</span>
                      </div>
                      {durations.find(d => d.id === selectedDuration)?.discount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>Discount:</span>
                          <span>-{durations.find(d => d.id === selectedDuration)?.discount}%</span>
                        </div>
                      )}
                      <div className="border-t border-slate-600 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-semibold text-cyan-100">Total:</span>
                          <span className="text-3xl font-bold text-green-400">₹{getTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-purple-200">
                      Select a platform and duration to see pricing
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedPlan || !selectedDuration}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Subscription...
                </div>
              ) : (
                '🎬 Subscribe Now'
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 border border-purple-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Instant Activation</h3>
              <p className="text-purple-200">Get access to your streaming platform immediately after payment</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border border-blue-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">Exclusive Offers</h3>
              <p className="text-blue-200">Special discounts and cashback on all streaming subscriptions</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border border-green-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-green-100 mb-2">Secure Payment</h3>
              <p className="text-green-200">Bank-grade security with encrypted payment processing</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
