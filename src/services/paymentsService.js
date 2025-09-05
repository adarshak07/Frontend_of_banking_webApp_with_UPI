import api from "../api";

export const payUpi = async (payload) => {
  const { data } = await api.post("/api/payments/upi", payload, {
    headers: { "X-Bypass-User": "dev" },
  });
  return data.data;
};

export const getRecentPayments = async (userId, limit = 10) => {
  const { data } = await api.get(`/api/payments/recent`, {
    params: { userId, limit },
    headers: { "X-Bypass-User": "dev" },
  });
  return data.data;
};

export const getWallet = async (userId) => {
  const { data } = await api.get(`/api/rewards/wallet`, {
    params: { userId },
    headers: { "X-Bypass-User": "dev" },
  });
  return data.data;
};

export const getLedger = async (userId, limit = 20) => {
  const { data } = await api.get(`/api/rewards/ledger`, {
    params: { userId, limit },
    headers: { "X-Bypass-User": "dev" },
  });
  return data.data;
};

export const getRedeemProducts = async () => {
  const { data } = await api.get(`/api/redeem/products`);
  return data.data;
};

export const redeemProduct = async (payload) => {
  const { data } = await api.post(`/api/redeem`, payload, {
    headers: { "X-Bypass-User": "dev" },
  });
  return data.data;
};

export const getPaymentsSummary = async (userId, days = 30) => {
  const { data } = await api.get(`/api/dashboard/payments/summary`, {
    params: { userId, days },
    headers: { "X-Bypass-User": "dev" },
  });
  return data.data;
};
