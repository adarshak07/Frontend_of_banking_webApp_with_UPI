import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import api from "../api";
import { getWalletData } from "../services/coinService";

export default function Profile() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    let mounted = true;
    
    const loadProfileData = async () => {
      console.log('📊 Profile: Starting to load profile data...');
      console.log('📊 Profile: Current user from AuthContext:', user);
      try {
        // Try to get profile summary from backend
        console.log('📊 Profile: Making API call to /profile/summary...');
        const profileResponse = await api.get('/profile/summary').catch((error) => {
          console.error('📊 Profile: /profile/summary failed:', error);
          return null;
        });
        console.log('📊 Profile: /profile/summary response:', profileResponse?.data);
        
        let profileData = null;
        
        if (profileResponse && profileResponse.data && profileResponse.data.data) {
          profileData = profileResponse.data.data;
          console.log('📊 Profile: Profile data extracted:', profileData);
        } else {
          console.log('📊 Profile: No profile data from API, using AuthContext user data');
          profileData = {
            user: {
              name: user?.name,
              email: user?.email,
              phone: user?.phone,
              role: user?.role
            }
          };
        }
        
        // Get wallet data with calculated coins
        console.log('📊 Profile: Getting wallet data...');
        const walletData = await getWalletData();
        console.log('📊 Profile: Wallet data:', walletData);
        
        if (mounted) {
          // Merge profile data with calculated coins
          const summaryData = {
            ...profileData,
            rewards: {
              coins: walletData.coins,
              transactionCount: walletData.transactionCount,
              vpaCount: walletData.vpaCount
            }
          };
          console.log('📊 Profile: Final summary data:', summaryData);
          setSummary(summaryData);
        }
      } catch (error) {
        console.error("📊 Profile: Error loading profile data:", error);
        if (mounted) {
          // Fallback with just wallet data
          console.log('📊 Profile: Using fallback with wallet data only');
          const walletData = await getWalletData();
          setSummary({
            user: {
              name: user?.name,
              email: user?.email,
              phone: user?.phone,
              role: user?.role
            },
            rewards: {
              coins: walletData.coins,
              transactionCount: walletData.transactionCount,
              vpaCount: walletData.vpaCount
            }
          });
        }
      }
    };
    
    loadProfileData();
    return () => { mounted = false; };
  }, [user]);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👤</span>
        </div>
        <h1 className="text-5xl font-bold text-cyan-100 mb-4">Your Profile</h1>
        <p className="text-xl text-purple-200 mb-6">View your account information and activity summary</p>
      </div>

      {summary ? (
        <div className="space-y-8">
          {/* User Information */}
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyan-100">Personal Information</h2>
                <p className="text-purple-200">Your account details and contact information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Basic Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-purple-200 text-sm">Full Name</span>
                    <div className="text-cyan-100 font-semibold text-lg">{summary.user?.name || 'Not provided'}</div>
                  </div>
                  <div>
                    <span className="text-purple-200 text-sm">Email Address</span>
                    <div className="text-cyan-100 font-semibold">{summary.user?.email || 'Not provided'}</div>
                  </div>
                  <div>
                    <span className="text-purple-200 text-sm">Phone Number</span>
                    <div className="text-cyan-100 font-semibold">{summary.user?.phone || 'Not provided'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-purple-200 text-sm">Account Role</span>
                    <div className="text-cyan-100 font-semibold capitalize">{summary.user?.role || 'USER'}</div>
                  </div>
                  <div>
                    <span className="text-purple-200 text-sm">Account Status</span>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-slate-900">
                      ✓ Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Statistics */}
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyan-100">Transaction Statistics</h2>
                <p className="text-purple-200">Your financial activity overview</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">Total Transactions</h3>
                <div className="text-3xl font-bold text-yellow-400">{summary.totals?.txCount || 0}</div>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">Largest Transaction</h3>
                <div className="text-3xl font-bold text-green-400">₹{summary.totals?.maxTransaction || 0}</div>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">First Transaction</h3>
                <div className="text-sm text-purple-200">{summary.totals?.firstTransactionDate || 'No transactions yet'}</div>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">Active Days</h3>
                <div className="text-3xl font-bold text-orange-400">{summary.totals?.activeDays || 0}</div>
              </div>
            </div>
          </div>

          {/* Rewards Information */}
          <div className="bg-gradient-to-br from-yellow-800 to-orange-900 rounded-2xl shadow-xl p-8 border border-yellow-600">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyan-100">Rewards & Coins</h2>
                <p className="text-yellow-200">Your loyalty points and rewards balance</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 mb-4">{summary.rewards?.coins || 0}</div>
              <p className="text-yellow-100 text-lg">Available Coins</p>
              <p className="text-yellow-200 text-sm mt-2">Use these coins to redeem exciting rewards!</p>
            </div>
          </div>
        </div>
      ) : user ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-100 text-lg">Loading profile summary...</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-cyan-100 mb-2">No profile loaded</h3>
          <p className="text-purple-200">Please log in to view your profile information</p>
        </div>
      )}
    </div>
  );
}
