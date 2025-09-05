import React, { useEffect, useState } from "react";
import { upiService } from "../services/upiService";
import { getAccounts } from "../services/accountService";
import { useAuth } from "../AuthContext";

export default function UpiManage() {
  const { user } = useAuth();
  const [vpas, setVpas] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [pin, setPin] = useState("");
  
  const load = () => upiService.getUserVpas().then(data => {
    console.log("VPAs data:", data);
    setVpas(data);
  }).catch(()=>{});
  
  const loadAccounts = () => getAccounts().then(data => {
    console.log("Accounts data:", data);
    // Handle different response formats
    const accountsData = data?.data || data || [];
    const accountsArray = Array.isArray(accountsData) ? accountsData : [];
    console.log("Processed accounts:", accountsArray);
    setAccounts(accountsArray);
  }).catch(() => {
    setAccounts([]);
  });
  
  useEffect(() => { 
    if(user){ 
      load(); 
      loadAccounts();
    } 
  }, [user]);
  
  const createLegacy = async () => { 
    console.log("Create UPI clicked. Current accountId:", accountId);
    console.log("AccountId type:", typeof accountId);
    
    if(!accountId || accountId === ""){ 
      alert("Please select an account first");
      return;
    }
    
    try {
      // Ensure accountId is a number
      const numericAccountId = Number(accountId);
      if (isNaN(numericAccountId) || numericAccountId <= 0) {
        alert("Invalid account selection. Please select a valid account from the dropdown.");
        return;
      }
      
      console.log("Creating UPI for account ID:", numericAccountId);
      await upiService.createVpa(numericAccountId); 
      alert("UPI ID created successfully!");
      setAccountId("");
      load(); 
    } catch (error) {
      console.error("UPI creation error:", error);
      alert("Error creating UPI ID: " + (error.response?.data?.message || error.message));
    }
  };
  
  
  const deleteUpiId = async (vpaToDelete) => {
    if (window.confirm(`Are you sure you want to delete UPI ID: ${vpaToDelete}?`)) {
      try {
        await upiService.deleteUpiId(vpaToDelete);
        alert("UPI ID deleted successfully!");
        load();
      } catch (error) {
        alert("Error deleting UPI ID: " + (error.response?.data?.message || error.message));
      }
    }
  };
  
  const makeDefault = async (vpa) => { 
    await upiService.setDefaultVpa(vpa); 
    load(); 
  };
  
  const setUpiPinGlobal = async () => { 
    if(pin){ 
      await upiService.setPin(pin); 
      alert("Global UPI PIN set"); 
    } 
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚙️</span>
        </div>
        <h1 className="text-4xl font-bold text-cyan-100 mb-4">Manage UPI IDs</h1>
        <p className="text-xl text-purple-200">Create, manage, and organize your UPI payment IDs</p>
      </div>
      
      {/* Existing UPI IDs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyan-100 mb-6">Your UPI IDs</h2>
        {vpas.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-slate-800 to-indigo-900 rounded-2xl border border-slate-600">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">No UPI IDs created yet</h3>
            <p className="text-purple-200">Create your first UPI ID to start making payments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vpas.map(v => (
              <div key={v.id} className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-slate-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3">
                        UPI
                      </div>
                      <div className="font-mono text-xl font-bold text-cyan-100">{v.vpa}</div>
                    </div>
                    <div className="text-sm text-purple-200 mb-2">
                      Linked to Account {v.account?.id} - Balance: ₹{v.account?.balance || 0}
                    </div>
                    {v.isDefault && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-slate-900">
                        ✓ Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!v.isDefault && (
                    <button 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                      onClick={() => makeDefault(v.vpa)}
                    >
                      Set Default
                    </button>
                  )}
                  <button 
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                    onClick={() => deleteUpiId(v.vpa)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Create UPI ID */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
          <h2 className="text-2xl font-bold text-cyan-100 mb-4">Create UPI ID</h2>
          <div className="bg-gradient-to-r from-green-800 to-emerald-900 p-6 rounded-xl border border-green-600">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-slate-900">⚡</span>
              </div>
              <div>
                <p className="text-green-100 font-medium mb-2">Auto-Generated UPI ID</p>
                <p className="text-emerald-200 text-sm">
                  Create a UPI ID automatically based on your email/name. 
                  The system will generate a unique UPI ID for you.
                </p>
              </div>
            </div>
            {(() => {
              console.log("All accounts:", accounts);
              console.log("All VPAs:", vpas);
              
              // Get account IDs that already have UPI IDs
              console.log("VPAs structure analysis:");
              vpas.forEach((vpa, index) => {
                console.log(`VPA ${index}:`, vpa);
                console.log(`VPA ${index} account:`, vpa.account);
                console.log(`VPA ${index} account ID:`, vpa.account?.id);
              });
              
              const accountsWithUpi = vpas
                .map(vpa => vpa.account?.id)
                .filter(id => id !== undefined && id !== null)
                .map(id => Number(id)); // Convert to numbers for comparison
              console.log("Account IDs with UPI:", accountsWithUpi);
              
              // Filter accounts that don't have UPI IDs
              const availableAccounts = Array.isArray(accounts) ? 
                accounts.filter(acc => {
                  // Use accountId instead of id for accounts data
                  const accountId = acc.accountId || acc.id;
                  
                  // Skip accounts with invalid IDs
                  if (!accountId || accountId === undefined || accountId === null) {
                    console.log(`Skipping account with invalid ID:`, acc);
                    return false;
                  }
                  
                  const numericAccountId = Number(accountId);
                  const hasUpi = accountsWithUpi.includes(numericAccountId);
                  console.log(`Account ${numericAccountId} has UPI:`, hasUpi);
                  return !hasUpi;
                }) : [];
              
              console.log("Available accounts for UPI creation:", availableAccounts);
              
              if (availableAccounts.length === 0) {
                return (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-lg font-semibold text-green-100 mb-2">All Accounts Have UPI IDs</h3>
                    <p className="text-emerald-200">All your accounts already have UPI IDs created. No new UPI IDs can be created at this time.</p>
                  </div>
                );
              }
              
              return (
                <div className="flex space-x-4">
                  <select 
                    value={accountId} 
                    onChange={e => {
                      console.log("Selected account value:", e.target.value);
                      setAccountId(e.target.value);
                    }}
                    className="flex-1 p-4 border-2 border-green-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-lg"
                  >
                    <option value="">Choose an account</option>
                    {availableAccounts.map(acc => {
                      const accountId = acc.accountId || acc.id;
                      return (
                        <option key={accountId} value={accountId}>
                          Account {accountId} - Balance: ₹{acc.balance || 0}
                        </option>
                      );
                    })}
                  </select>
                  <button 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    onClick={createLegacy}
                  >
                    Create UPI ID
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Global UPI PIN */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
          <h2 className="text-2xl font-bold text-cyan-100 mb-4">Set Global UPI PIN</h2>
          <div className="bg-gradient-to-r from-indigo-800 to-blue-900 p-6 rounded-xl border border-indigo-600">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-slate-900">🔒</span>
              </div>
              <div>
                <p className="text-cyan-100 font-medium mb-2">Global UPI PIN</p>
                <p className="text-blue-200 text-sm">
                  This sets a global UPI PIN that can be used for all UPI IDs that don't have individual PINs.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <input 
                type="password"
                placeholder="Global UPI PIN" 
                value={pin} 
                onChange={e => setPin(e.target.value)} 
                className="flex-1 p-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
              />
              <button 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={setUpiPinGlobal}
              >
                Save Global PIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


