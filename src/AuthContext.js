import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    // Check if token exists and is not obviously expired
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          // Token is expired, remove it
          localStorage.removeItem("token");
          return null;
        }
      } catch (error) {
        // Invalid token format, remove it
        localStorage.removeItem("token");
        return null;
      }
    }
    return storedToken;
  });
  const [user, setUser] = useState(null);

  const login = async (t) => {
    console.log('🔐 AuthContext.login called with token:', t ? t.substring(0, 50) + '...' : 'null');
    localStorage.setItem("token", t);
    setToken(t);
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      console.log('🔐 JWT payload:', payload);
      console.log('🔐 Making API call to /profile...');
      const { data } = await api.get('/profile');
      console.log('🔐 Profile API response:', data);
      const profile = data?.data || {};
      console.log('🔐 Profile data extracted:', profile);
      const role = profile?.role || payload?.role;
      const userData = { name: profile?.name, email: profile?.email, phone: profile?.phone, role };
      console.log('🔐 Setting user data:', userData);
      setUser(userData);
    } catch (e) {
      console.error('🔐 Profile fetch failed:', e);
      console.error('🔐 Error details:', e.response?.data || e.message);
      try {
        const payload = JSON.parse(atob(t.split('.')[1]));
        console.log('🔐 Fallback: using JWT payload only:', payload);
        setUser((prev) => ({ ...(prev||{}), role: payload?.role }));
      } catch {}
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // On load or token change, try to populate user (role at least)
  useEffect(()=>{
    if(!token) return;
    (async()=>{
      try{
        const { data } = await api.get('/profile');
        const profile = data?.data || {};
        setUser({ name: profile?.name, email: profile?.email, phone: profile?.phone, role: profile?.role });
      }catch(e){
        console.error('Profile fetch failed in useEffect:', e);
        try{ 
          const payload = JSON.parse(atob(token.split('.')[1])); 
          setUser(prev=>({ ...(prev||{}), role: payload?.role })); 
        }catch{}
      }
    })();
  },[token]);

  const value = useMemo(() => ({ token, setToken, login, logout, user, setUser }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
