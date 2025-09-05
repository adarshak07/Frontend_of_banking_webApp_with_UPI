import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../services/adminService';

export default function TransactionsAdmin(){
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({ accountId:'', type:'', from:'', to:'', min:'', max:'' });
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');

  const load = async()=>{
    try{
      const res = await getAllTransactions({ page, pageSize, ...filters });
      setData(res);
    }catch(e){ setError(e?.message || 'Failed to load'); }
  };

  useEffect(()=>{ load(); },[page, pageSize]);

  return (
    <div className="card" style={{maxWidth:1100,margin:'40px auto'}}>
      <h2 className="title">Transactions</h2>
      <div className="spacer"></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
        <input placeholder="Account ID" value={filters.accountId} onChange={e=>setFilters(f=>({...f, accountId:e.target.value}))} />
        <select value={filters.type} onChange={e=>setFilters(f=>({...f, type:e.target.value}))}>
          <option value="">Any Type</option>
          <option value="DEPOSIT">DEPOSIT</option>
          <option value="WITHDRAW">WITHDRAW</option>
          <option value="FEE">FEE</option>
          <option value="INTEREST">INTEREST</option>
        </select>
        <input type="date" value={filters.from} onChange={e=>setFilters(f=>({...f, from:e.target.value}))} />
        <input type="date" value={filters.to} onChange={e=>setFilters(f=>({...f, to:e.target.value}))} />
        <input placeholder="Min" value={filters.min} onChange={e=>setFilters(f=>({...f, min:e.target.value}))} />
        <input placeholder="Max" value={filters.max} onChange={e=>setFilters(f=>({...f, max:e.target.value}))} />
      </div>
      <div className="spacer"></div>
      <button className="btn" onClick={()=>{ setPage(1); load(); }}>Apply Filters</button>
      <div className="spacer"></div>
      {error && <div className="muted" style={{ color: '#fca5a5' }}>{String(error)}</div>}
      <table className="table">
        <thead><tr><th>ID</th><th>Account</th><th>Type</th><th>Amount</th><th>Timestamp</th></tr></thead>
        <tbody>
          {data.items.map(t=> (
            <tr key={t.id}><td>{t.id}</td><td>{t.accountId}</td><td>{t.type}</td><td>{t.amount}</td><td>{new Date(t.timestamp).toLocaleString()}</td></tr>
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


