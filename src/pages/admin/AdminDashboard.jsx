import React, { useEffect, useState } from 'react';
import { getSummary } from '../../services/adminService';

export default function AdminDashboard(){
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(()=>{
    (async()=>{
      try{
        const res = await getSummary();
        setData(res);
      }catch(e){ setError(e?.message || 'Failed to load'); }
    })();
  },[]);
  if(error) return <div className="card" style={{maxWidth:720,margin:'40px auto'}}>{String(error)}</div>;
  if(!data) return <div className="card" style={{maxWidth:720,margin:'40px auto'}}>Loading...</div>;
  return (
    <div className="card" style={{maxWidth:960,margin:'40px auto'}}>
      <h2 className="title">Admin Summary</h2>
      <div className="spacer"></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        <Kpi title="Users" value={data.users} />
        <Kpi title="Accounts" value={data.accounts} />
        <Kpi title="Transactions" value={data.txns} />
        <Kpi title="Total Balance" value={data.totalBalance?.toFixed(2)} />
      </div>
    </div>
  );
}

function Kpi({title, value}){
  return <div className="card" style={{padding:16}}><div className="muted">{title}</div><div style={{fontSize:24,fontWeight:700}}>{value}</div></div>
}


