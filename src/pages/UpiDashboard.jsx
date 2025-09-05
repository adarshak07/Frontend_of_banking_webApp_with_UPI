import React, { useEffect, useState } from "react";
import { upiService } from "../services/upiService";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

export default function UpiDashboard() {
  const { user } = useAuth();
  const [vpas, setVpas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      upiService.getUserVpas().then(vpaList => {
        setVpas(vpaList || []);
      }).catch(() => {
        setVpas([]);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const defaultVpa = vpas.find(v => v.isDefault) || vpas[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">💳</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">UPI Payments</h1>
        <p className="text-xl text-purple-200 mb-6">Fast, secure, and convenient digital payments</p>
        
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link 
          to="/upi/send" 
          className="group bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-500"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">💸</span>
          </div>
          <h3 className="text-xl font-bold text-yellow-100 mb-2">Send Money</h3>
          <p className="text-emerald-100 text-sm">Transfer money instantly to any UPI ID</p>
        </Link>

        <Link 
          to="/upi/request" 
          className="group bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-500"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">📨</span>
          </div>
          <h3 className="text-xl font-bold text-yellow-100 mb-2">Request Money</h3>
          <p className="text-orange-100 text-sm">Request money from friends and family</p>
        </Link>

        <Link 
          to="/upi/manage" 
          className="group bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-500"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-xl font-bold text-yellow-100 mb-2">Manage UPI IDs</h3>
          <p className="text-purple-100 text-sm">Create and manage your UPI IDs</p>
        </Link>

        <Link 
          to="/upi/history" 
          className="group bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-500"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-bold text-yellow-100 mb-2">Transaction History</h3>
          <p className="text-blue-100 text-sm">View all your UPI transactions</p>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-900 rounded-2xl p-8 mb-8 border border-indigo-600">
        <h2 className="text-3xl font-bold text-center text-cyan-100 mb-8">Why Choose UPI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-100 mb-2">Instant Transfers</h3>
            <p className="text-purple-200">Money transfers happen in real-time, 24/7</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-100 mb-2">Secure & Safe</h3>
            <p className="text-purple-200">Bank-grade security with UPI PIN protection</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-100 mb-2">Easy to Use</h3>
            <p className="text-purple-200">Simple interface, just enter UPI ID and amount</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {vpas.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
          <h3 className="text-2xl font-bold text-cyan-100 mb-6 text-center">Your UPI Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{vpas.length}</div>
              <p className="text-slate-300">Total UPI IDs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{vpas.filter(v => v.isDefault).length}</div>
              <p className="text-slate-300">Default UPI ID</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <p className="text-slate-300">Available</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


