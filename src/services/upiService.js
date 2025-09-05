import api from "../api";

export const upiService = {
  // Legacy VPA methods (auto-generated VPAs)
  createVpa: (accountId) => api.post(`/upi/vpa/create`, null, { params: { accountId } }).then(r => r.data?.data),
  getUserVpas: () => api.get(`/upi/vpa/me`).then(r => r.data?.data),
  setDefaultVpa: (vpa) => api.post(`/upi/vpa/default`, null, { params: { vpa } }).then(r => r.data?.data),
  setPin: (newPin) => api.post(`/upi/pin`, null, { params: { newPin } }).then(r => r.data?.data),
  
  // New UPI ID management methods (with account linking)
  createUpiId: (accountId, vpa, upiPin) => api.post(`/upi/create`, { accountId, vpa, upiPin }).then(r => r.data?.data),
  deleteUpiId: (vpa) => api.delete(`/upi/${vpa}`).then(r => r.data?.data),
  getUpiIdDetails: (vpa) => api.get(`/upi/${vpa}`).then(r => r.data?.data),
  
  // Transaction methods
  send: (payload) => api.post(`/upi/send`, payload).then(r => r.data?.data),
  request: (payload) => api.post(`/upi/request`, payload).then(r => r.data?.data),
  getPending: (vpa) => api.get(`/upi/request/${vpa}`).then(r => r.data?.data),
  approve: (id, pin) => api.post(`/upi/request/${id}/approve`, null, { params: { pin } }).then(r => r.data?.data),
  reject: (id) => api.post(`/upi/request/${id}/reject`).then(r => r.data?.data),
  getTransactions: (vpa) => api.get(`/upi/transactions/${vpa}`).then(r => r.data?.data),
  lookup: (q) => api.get(`/upi/lookup`, { params: { q } }).then(r => r.data?.data),
};


