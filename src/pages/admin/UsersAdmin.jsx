import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole } from '../../services/adminService';

export default function UsersAdmin(){
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');

  const load = async()=>{
    try{
      const res = await getUsers({ page, pageSize, search, role });
      setData(res);
    }catch(e){ setError(e?.message || 'Failed to load'); }
  };

  useEffect(()=>{ load(); },[page, pageSize, search, role]);

  const onChangeRole = async (id, newRole)=>{
    try{
      await updateUserRole(id, newRole);
      load();
    }catch(e){ alert(e?.message || 'Failed'); }
  };

  return (
    <div className="card" style={{maxWidth:1000,margin:'40px auto'}}>
      <h2 className="title">Users</h2>
      <div className="spacer"></div>
      <div style={{display:'flex',gap:8}}>
        <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div className="spacer"></div>
      {error && <div className="muted" style={{ color: '#fca5a5' }}>{String(error)}</div>}
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
        <tbody>
          {data.items.map(u=> (
            <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td>
              <td>
                <select value={u.role} onChange={e=>onChangeRole(u.id, e.target.value)}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
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


