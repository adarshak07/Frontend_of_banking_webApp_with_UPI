import api from '../api';

export async function getSummary(){
  const { data } = await api.get('/admin/summary');
  if(!data?.success) throw new Error('Failed to fetch summary');
  return data.data;
}

export async function getUsers({ page=1, pageSize=20, search='', role='' }){
  const { data } = await api.get('/admin/users', { params: { page, pageSize, search, role } });
  if(!data?.success) throw new Error('Failed to fetch users');
  return data.data;
}

export async function updateUserRole(id, role){
  const { data } = await api.patch(`/admin/users/${id}/role`, { role });
  if(!data?.success) throw new Error('Failed to update role');
  return data.data;
}

export async function getAllAccounts({ page=1, pageSize=20 }){
  const { data } = await api.get('/admin/accounts', { params: { page, pageSize } });
  if(!data?.success) throw new Error('Failed to fetch accounts');
  return data.data;
}

export async function getAllTransactions({ page=1, pageSize=20, accountId, type, from, to, min, max }){
  const params = { page, pageSize, accountId, type, from, to, min, max };
  const { data } = await api.get('/admin/transactions', { params });
  if(!data?.success) throw new Error('Failed to fetch transactions');
  return data.data;
}


