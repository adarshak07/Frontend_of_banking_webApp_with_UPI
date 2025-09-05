import React, { useEffect, useState } from "react";
import { upiService } from "../services/upiService";

export default function UpiRequests() {
  const [vpa, setVpa] = useState("");
  const [items, setItems] = useState([]);
  const [pin, setPin] = useState("");

  const load = async () => {
    if (!vpa) return;
    try { const data = await upiService.getPending(vpa); setItems(data || []);} catch(e) { setItems([]); }
  };

  useEffect(() => { if(vpa){ load(); } }, [vpa]);

  const approve = async (id) => { try { await upiService.approve(id, pin); load(); } catch(e){} };
  const reject = async (id) => { try { await upiService.reject(id); load(); } catch(e){} };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Pending Requests</h2>
      <div className="mb-2">
        <input placeholder="Your UPI ID" value={vpa} onChange={e=>setVpa(e.target.value)} className="input mr-2"/>
        <button className="btn" onClick={load}>Load</button>
      </div>
      <div className="mb-2">
        <input placeholder="UPI PIN (for approve)" value={pin} onChange={e=>setPin(e.target.value)} className="input"/>
      </div>
      <div>
        {items.map(r => (
          <div key={r.id} className="border p-2 mb-2">
            <div>From: {r.payeeVpa}</div>
            <div>To Pay: {r.amount}</div>
            <button className="btn mr-2" onClick={()=>approve(r.id)}>Approve</button>
            <button className="btn" onClick={()=>reject(r.id)}>Reject</button>
          </div>
        ))}
      </div>
    </div>
  );
}


