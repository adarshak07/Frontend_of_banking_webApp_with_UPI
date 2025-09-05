import React, { useState } from "react";
import Typeahead from '../components/Typeahead';
import { suggestionService } from '../services/suggestionService';
import { upiService } from '../services/upiService';
import { useParams, useNavigate } from "react-router-dom";
import { payUpi } from "../services/paymentsService";

const vpaRegex = /^[a-zA-Z0-9.\\-_]{3,}@[a-zA-Z]{2,}$/;

const PaymentsCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [vpa, setVpa] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVpa, setSelectedVpa] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!vpaRegex.test(vpa)) { setError("Invalid UPI ID"); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setError("Enter valid amount"); return; }
    setLoading(true);
    try {
      // Use the account ID from the selected VPA, or default to 1
      const accountId = selectedVpa?.accountId || 1;
      const payload = { userId: 1, accountId, vpa, amount: amt, category, note };
      const resp = await payUpi(payload);
      setResult(resp);
    } catch (e) {
      setError(e?.response?.data?.data?.error || e?.response?.data?.errors || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVpaSelect = (vpaData) => {
    setVpa(vpaData.vpa);
    setSelectedVpa(vpaData);
  };

  const handleContactSelect = (contact) => {
    // For contacts, we need to construct a UPI ID
    // This is a simplified approach - in real app you'd have contact UPI mapping
    const vpa = contact.name.toLowerCase().replace(/\s+/g, '') + '@mybank';
    setVpa(vpa);
    setSelectedVpa({ vpa, accountId: 1 }); // Default account for contacts
  };

  const combinedFetchFn = async (query) => {
    const [vpaResults, contactResults] = await Promise.all([
      upiService.lookup(query).catch(() => []),
      suggestionService.contacts(query).catch(() => [])
    ]);
    
    // Combine and format results
    const vpaFormatted = vpaResults.map(vpa => ({
      ...vpa,
      name: vpa.vpa,
      phone: `Account ${vpa.accountId}`,
      avatar: null
    }));
    
    const contactFormatted = contactResults.map(contact => ({
      ...contact,
      vpa: contact.name.toLowerCase().replace(/\s+/g, '') + '@mybank',
      accountId: 1
    }));
    
    return [...vpaFormatted, ...contactFormatted];
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">{category} payment</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">UPI ID</label>
          <Typeahead 
            fetchFn={combinedFetchFn}
            placeholder="Search UPI ID or contact name"
            value={vpa}
            onChange={setVpa}
            onSelect={(item) => {
              if (item.vpa) {
                handleVpaSelect(item);
              } else {
                handleContactSelect(item);
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm">Amount</label>
          <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border p-2" placeholder="349" />
        </div>
        <div>
          <label className="block text-sm">Note</label>
          <input value={note} onChange={(e)=>setNote(e.target.value)} className="w-full border p-2" placeholder="Optional" />
        </div>
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading?"Processing...":"Pay"}</button>
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {result && (
        <div className="mt-4 p-4 border rounded bg-green-50">
          <div className="font-semibold">Payment Successful</div>
          <div>Ref: {result.refId}</div>
          <div>Coins earned: {result.coinsEarned}</div>
          <div>Balance after: ₹{Math.round(result.balanceAfter)}</div>
          <button className="mt-3 underline" onClick={()=>navigate("/rewards")}>
            View rewards
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsCategory;
