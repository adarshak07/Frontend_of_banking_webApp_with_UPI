import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut } from 'lucide-react';

export default function Navbar(){
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="navbar">
      <div className="brand"><span style={{width:10,height:10,borderRadius:999,background:'linear-gradient(45deg,#3b82f6,#22c55e)'}}></span>&nbsp;MyBank {user?.role?`(${user.role==='ADMIN'?'Admin':'User'})`:''}</div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {!token ? (
          <>
            <Link className='btn' to='/'>Home</Link>
            <Link className='btn' to='/login'>Login</Link>
            <Link className='btn' to='/register'>Register</Link>
          </>
        ) : (
          <>
            <Link className='btn' to='/'>Dashboard</Link>
            <Link className='btn' to='/accounts'>Accounts</Link>
            <Link className='btn' to='/transactions/history'>History</Link>
            <Link className='btn' to='/transactions/statement'>Statement</Link>
            <Link className='btn' to='/hub'>Payments Hub</Link>
            <Link className='btn' to='/rewards'>Rewards</Link>
            <Link className='btn' to='/redeem'>Redeem</Link>
            <Link className='btn' to='/ai-insights'>AI Insights</Link>
            <Link className='btn' to='/upi'>UPI</Link>
            {user?.role==='ADMIN' && <Link className='btn' to='/admin'>Admin</Link>}
            <Link className='btn' to='/profile'>Profile</Link>
            <button className='btn' onClick={onLogout} title='Logout'><LogOut size={16} /></button>
          </>
        )}
      </div>
    </div>
  );
}


