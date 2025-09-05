import React, { useState, useEffect } from "react";
import { upiService } from "../services/upiService";
import { useNavigate } from "react-router-dom";

export default function UpiRequest() {
  const [form, setForm] = useState({ payerVpa: "", payeeVpa: "", amount: "", reason: "" });
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
        setForm(prev => ({ ...prev, payeeVpa: defaultVpa.vpa }));
      }
    }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    
    // Validation
    if (!form.payerVpa || !form.payeeVpa || !form.amount) {
      setMsg("Please fill in all required fields");
      setLoading(false);
      return;
    }
    
    if (parseFloat(form.amount) <= 0) {
      setMsg("Amount must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      await upiService.request({ ...form, amount: parseFloat(form.amount) });
      setMsg("Money request created successfully!");
      setTimeout(() => navigate("/upi"), 2000);
    } catch (e) {
      setMsg(e?.response?.data?.errors || "Failed to create request. Please check the payer UPI ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Request Money</h2>
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">From UPI ID (Who should pay)</label>
          <input 
            placeholder="Enter payer's UPI ID" 
            value={form.payerVpa} 
            onChange={e=>setForm({...form, payerVpa:e.target.value})} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">To UPI ID (Your UPI ID)</label>
          <select 
            value={form.payeeVpa} 
            onChange={e=>setForm({...form, payeeVpa:e.target.value})} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        
        <div>
          <label className="block text-sm font-medium mb-2">Amount (₹)</label>
          <input 
            placeholder="0.00" 
            type="number" 
            step="0.01"
            min="0.01"
            value={form.amount} 
            onChange={e=>setForm({...form, amount:e.target.value})} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
          <input 
            placeholder="Add a reason for this request" 
            value={form.reason} 
            onChange={e=>setForm({...form, reason:e.target.value})} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Request..." : "Create Money Request"}
        </button>
      </form>
      
      {msg && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          msg.includes("successfully") 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {msg}
        </div>
      )}
    </div>
  );
}


