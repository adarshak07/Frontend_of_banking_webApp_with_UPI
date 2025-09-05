import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../api";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState({ totalBalance: 0, totalAccounts: 0, lastTransactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    // Only fetch summary when we actually have a token (after login)
    if (!token) { setLoading(false); return; }
    let mounted = true;
    (async()=>{
      try{
        const { data } = await api.get('/dashboard/summary');
        if(!mounted) return;
        setSummary(data?.data || { totalBalance:0,totalAccounts:0,lastTransactions:[] });
      } finally { if(mounted) setLoading(false); }
    })();
    return ()=>{ mounted=false };
  },[token]);

  const chartData = useMemo(()=>{
    return (summary.lastTransactions||[]).map(t=>({
      ts: new Date(t.timestamp).toLocaleDateString(),
      amount: t.amount * (t.type === 'WITHDRAW' ? -1 : 1)
    })).reverse();
  },[summary]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.5}} 
        className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-100 mb-2">Hello{user?.name ? `, ${user.name}` : ""} 👋</h1>
            <p className="text-purple-200 text-lg">Welcome back to your banking hub</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏦</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{opacity:0,y:10}} 
          animate={{opacity:1,y:0}} 
          transition={{delay:0.05}} 
          className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-6 border border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold text-white">₹ {Number(summary.totalBalance||0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{opacity:0,y:10}} 
          animate={{opacity:1,y:0}} 
          transition={{delay:0.1}} 
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 border border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Accounts</p>
              <p className="text-3xl font-bold text-white">{summary.totalAccounts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🏦</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{opacity:0,y:10}} 
          animate={{opacity:1,y:0}} 
          transition={{delay:0.15}} 
          className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl shadow-xl p-6 border border-purple-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Quick Actions</p>
              <p className="text-lg font-semibold text-white">Banking Hub</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      {token && (
        <motion.div 
          initial={{opacity:0,y:10}} 
          animate={{opacity:1,y:0}} 
          transition={{delay:0.2}} 
          className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8"
        >
          <h2 className="text-2xl font-bold text-cyan-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/hub" 
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">💳</span>
                <span>Payments Hub</span>
              </div>
              <p className="text-purple-100 text-sm">Manage all your payments</p>
            </Link>
            
            <Link 
              to="/transactions/history" 
              className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">📊</span>
                <span>History</span>
              </div>
              <p className="text-orange-100 text-sm">View transaction history</p>
            </Link>
            
            <Link 
              to="/accounts" 
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🏦</span>
                <span>Accounts</span>
              </div>
              <p className="text-blue-100 text-sm">Manage your accounts</p>
            </Link>
            
            <Link 
              to="/upi" 
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">💳</span>
                <span>UPI</span>
              </div>
              <p className="text-purple-100 text-sm">Digital payments</p>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Transaction Chart */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{delay:0.25}} 
        className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-100">Transaction Overview</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-purple-200 text-sm">Recent Activity</span>
          </div>
        </div>
        <div style={{width:'100%', height:320}}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="ts" tick={{ fill: '#a78bfa' }} />
              <YAxis tick={{ fill: '#a78bfa' }} />
              <Tooltip 
                contentStyle={{ 
                  background:'#1e293b', 
                  border:'1px solid #475569', 
                  color:'#e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmt)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
