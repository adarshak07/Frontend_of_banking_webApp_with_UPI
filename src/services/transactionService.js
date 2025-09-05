import api from "../api";
export async function deposit(data){ const res = await api.post("/transaction/deposit", data); return res.data; }
export async function withdraw(data){ const res = await api.post("/transaction/withdraw", data); return res.data; }
export async function getHistory(accountId){ const res = await api.get(`/transaction/history/${accountId}`); return res.data; }
export async function getStatement(request){ const res = await api.post("/transaction/statement", request); return res.data; }
export async function exportStatement(request, format="csv"){ const ep = format==="pdf"?"/transaction/statement/export/pdf":"/transaction/statement/export/csv"; const res = await api.post(ep, request, { responseType: "blob" }); return res.data; }