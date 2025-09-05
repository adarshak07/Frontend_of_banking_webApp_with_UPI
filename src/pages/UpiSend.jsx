import React, { useState, useEffect } from "react";
import { upiService } from "../services/upiService";
import { useNavigate } from "react-router-dom";

export default function UpiSend() {
  const [form, setForm] = useState({ fromVpa: "", toVpa: "", amount: "", note: "", pin: "" });
  const [msg, setMsg] = useState("");
  const [vpas, setVpas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user's UPI IDs and pre-select default
    upiService.getUserVpas().then(vpaList => {
      setVpas(vpaList);
      const defaultVpa = vpaList.find(v => v.isDefault) || vpaList[0];
      if (defaultVpa) {
        setForm(prev => ({ ...prev, fromVpa: defaultVpa.vpa }));
      }
    }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    
    // Validation
    if (!form.fromVpa || !form.toVpa || !form.amount || !form.pin) {
      setMsg("Please fill in all required fields");
      setLoading(false);
      return;
    }
    
    if (parseFloat(form.amount) <= 0) {
      setMsg("Amount must be greater than 0");
      setLoading(false);
      return;
    }
    
    if (form.pin.length < 4) {
      setMsg("UPI PIN must be at least 4 digits");
      setLoading(false);
      return;
    }

    try {
      const txnId = await upiService.send({ ...form, amount: parseFloat(form.amount) });
      setMsg(`Success! Transaction ID: ${txnId}`);
      setTimeout(() => navigate("/upi"), 2000);
    } catch (e) {
      setMsg(e?.response?.data?.errors || "Transaction failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-100 mb-2">💸 Send Money</h1>
            <p className="text-purple-200 text-lg">Transfer money instantly to any UPI ID</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-slate-600">
        <form onSubmit={submit} className="space-y-6">
          {/* From UPI ID */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">From UPI ID</label>
            <select 
              value={form.fromVpa} 
              onChange={e=>setForm({...form, fromVpa:e.target.value})} 
              className="w-full p-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg"
              required
            >
              <option value="">Select your UPI ID</option>
              {vpas.map(vpa => (
                <option key={vpa.id} value={vpa.vpa}>
                  {vpa.vpa} {vpa.isDefault ? "(Default)" : ""}
                </option>
              ))}
            </select>
          </div>
          
          {/* To UPI ID */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">To UPI ID</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">@</span>
              <input 
                placeholder="Enter recipient's UPI ID" 
                value={form.toVpa} 
                onChange={e=>setForm({...form, toVpa:e.target.value})} 
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                required
              />
            </div>
          </div>
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">₹</span>
              <input 
                placeholder="0.00" 
                type="number" 
                step="0.01"
                min="0.01"
                value={form.amount} 
                onChange={e=>setForm({...form, amount:e.target.value})} 
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                required
              />
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Quick Amounts</label>
            <div className="grid grid-cols-4 gap-3">
              {[100, 500, 1000, 2000].map(quickAmount => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setForm({...form, amount: quickAmount.toString()})}
                  className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-cyan-100 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>
          
          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">Note (Optional)</label>
            <input 
              placeholder="Add a note for this transaction" 
              value={form.note} 
              onChange={e=>setForm({...form, note:e.target.value})} 
              className="w-full p-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
            />
          </div>
          
          {/* UPI PIN */}
          <div>
            <label className="block text-sm font-semibold text-cyan-100 mb-2">UPI PIN</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">🔒</span>
              <input 
                placeholder="Enter your UPI PIN" 
                type="password"
                value={form.pin} 
                onChange={e=>setForm({...form, pin:e.target.value})} 
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-lg placeholder-purple-300"
                required
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "🚀 Send Money"
            )}
          </button>
        </form>
        
        {/* Message Display */}
        {msg && (
          <div className={`mt-6 p-4 rounded-xl ${
            msg.includes("Success") 
              ? "bg-gradient-to-r from-green-800 to-emerald-900 border border-green-500" 
              : "bg-gradient-to-r from-red-800 to-pink-900 border border-red-500"
          }`}>
            <div className="flex items-center">
              <div className={`text-lg mr-2 ${msg.includes("Success") ? "text-green-300" : "text-red-300"}`}>
                {msg.includes("Success") ? "✅" : "❌"}
              </div>
              <div className={`font-medium ${msg.includes("Success") ? "text-green-100" : "text-red-100"}`}>
                {msg}
              </div>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-800 to-blue-900 border border-indigo-500 rounded-xl">
          <div className="flex items-start">
            <div className="text-cyan-300 text-lg mr-2">🔒</div>
            <div className="text-cyan-100 text-sm">
              <strong>Secure Transfer:</strong> Your money is transferred instantly and securely. 
              All transactions are encrypted and protected with UPI PIN.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


