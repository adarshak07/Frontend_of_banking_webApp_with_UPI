import React, { useEffect, useState } from 'react';
import { getAllAccounts } from '../../services/adminService';

export default function AccountsAdmin(){
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');

  const load = async()=>{
    try{
      const res = await getAllAccounts({ page, pageSize });
      setData(res);
    }catch(e){ setError(e?.message || 'Failed to load'); }
  };

  useEffect(()=>{ load(); },[page, pageSize]);

  return (
    <div className="card" style={{maxWidth:1000,margin:'40px auto'}}>
      <h2 className="title">Accounts</h2>
      <div className="spacer"></div>
      {error && <div className="muted" style={{ color: '#fca5a5' }}>{String(error)}</div>}
      <table className="table">
        <thead><tr><th>ID</th><th>User</th><th>Balance</th></tr></thead>
        <tbody>
          {data.items.map(a=> (
            <tr key={a.id}><td>{a.id}</td><td>{a.user}</td><td>{a.balance}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="spacer"></div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <div>Page {page}</div>
        <button className="btn" onClick={()=>setPage(p=>p+1)}>Next</button>
        <div style={{marginLeft:'auto'}}>
          <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}


